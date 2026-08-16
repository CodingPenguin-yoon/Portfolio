import { execFile } from 'node:child_process';
import { access, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { expect, test } from '@playwright/test';

const execFileAsync = promisify(execFile);
const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const pdfTempDirectory = join(repositoryRoot, 'tmp', 'pdfs');

test('exporter writes exactly 13 A4 pages to the requested output', async ({ page: _page }, testInfo) => {
  test.setTimeout(120_000);
  const outputPath = join(pdfTempDirectory, `portfolio-export-${testInfo.workerIndex}.pdf`);
  await mkdir(pdfTempDirectory, { recursive: true });

  try {
    await execFileAsync(process.execPath, ['scripts/export-portfolio-pdf.mjs', '--output', outputPath], {
      cwd: repositoryRoot,
    });

    const { stdout } = await execFileAsync('pdfinfo', [outputPath], { cwd: repositoryRoot });
    expect(stdout).toMatch(/^Pages:\s+13$/m);
    expect(stdout).toMatch(/^Page size:\s+595\.28 x 841\.89 pts \(A4\)$/m);
  } finally {
    await rm(outputPath, { force: true });
  }
});

test('exporter fails clearly when the preview server is unavailable', async ({ page: _page }, testInfo) => {
  const outputPath = join(pdfTempDirectory, `portfolio-unavailable-${testInfo.workerIndex}.pdf`);
  let failure: (Error & { stderr?: string }) | undefined;

  try {
    await execFileAsync(
      process.execPath,
      ['scripts/export-portfolio-pdf.mjs', '--url', 'http://127.0.0.1:65534/portfolio', '--output', outputPath],
      { cwd: repositoryRoot }
    );
  } catch (error) {
    failure = error as Error & { stderr?: string };
  } finally {
    await rm(outputPath, { force: true });
  }

  expect(failure?.stderr).toContain('Portfolio preview is unavailable at http://127.0.0.1:65534/portfolio');
  await expect(access(outputPath)).rejects.toMatchObject({ code: 'ENOENT' });
});

test('exporter rejects a non-portfolio HTTP error page', async ({ page: _page }, testInfo) => {
  const outputPath = join(pdfTempDirectory, `portfolio-http-error-${testInfo.workerIndex}.pdf`);
  let failure: (Error & { stderr?: string }) | undefined;

  try {
    await execFileAsync(
      process.execPath,
      [
        'scripts/export-portfolio-pdf.mjs',
        '--url',
        'http://127.0.0.1:4322/not-a-portfolio-document',
        '--output',
        outputPath,
      ],
      { cwd: repositoryRoot }
    );
  } catch (error) {
    failure = error as Error & { stderr?: string };
  } finally {
    await rm(outputPath, { force: true });
  }

  expect(failure?.stderr).toContain(
    'Portfolio preview returned HTTP 404 at http://127.0.0.1:4322/not-a-portfolio-document'
  );
  await expect(access(outputPath)).rejects.toMatchObject({ code: 'ENOENT' });
});
