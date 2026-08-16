import { execFile } from 'node:child_process';
import { access, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { expect, test } from '@playwright/test';

const execFileAsync = promisify(execFile);
const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const pdfTempDirectory = join(repositoryRoot, 'tmp', 'pdfs');
const buildOutputDirectory = join(repositoryRoot, 'dist');
const portfolioIdentity = 'yunho-cho-platform-engineer-portfolio';

function createHttpFixture({
  identity,
  pageCount,
  imageSource,
}: {
  identity: string;
  pageCount: number;
  imageSource?: string;
}) {
  const pages = Array.from(
    { length: pageCount },
    (_, index) => `<section data-portfolio-page="${index + 1}">Fixture ${index + 1}</section>`
  ).join('');
  const image = imageSource ? `<img src="${imageSource}" alt="Broken fixture image">` : '';

  return `<!doctype html>
    <html>
      <head>
        <style>
          @page { size: A4 portrait; margin: 0; }
          html, body { margin: 0; }
          section { box-sizing: border-box; width: 210mm; height: 297mm; break-after: page; }
          section:last-child { break-after: auto; }
        </style>
      </head>
      <body>
        <main data-portfolio-document="${identity}">${image}${pages}</main>
      </body>
    </html>`;
}

async function createServedFixture(name: string, workerIndex: number, content: string) {
  const relativePath = join('portfolio-export-fixtures', `${name}-${workerIndex}.html`);
  const fixturePath = join(buildOutputDirectory, relativePath);
  await mkdir(dirname(fixturePath), { recursive: true });
  await writeFile(fixturePath, content);
  return {
    fixturePath,
    sourceUrl: `http://127.0.0.1:4322/${relativePath}`,
  };
}

test('exporter writes exactly 13 A4 pages to the requested output', async ({ page: _page }, testInfo) => {
  test.setTimeout(120_000);
  const outputPath = join(pdfTempDirectory, `portfolio-export-${testInfo.workerIndex}.pdf`);
  await mkdir(pdfTempDirectory, { recursive: true });

  try {
    await execFileAsync(process.execPath, ['scripts/export-portfolio-pdf.mjs', '--output', outputPath], {
      cwd: repositoryRoot,
    });

    const { stdout } = await execFileAsync('pdfinfo', ['-f', '1', '-l', '13', '-box', outputPath], {
      cwd: repositoryRoot,
    });
    expect(stdout).toMatch(/^Pages:\s+13$/m);
    const pageSizes = Array.from(
      stdout.matchAll(/^Page\s+(\d+) size:\s+([\d.]+) x ([\d.]+) pts \(A4\)$/gm),
      ([, pageNumber, width, height]) => ({ pageNumber: Number(pageNumber), width, height })
    );
    const mediaBoxes = Array.from(
      stdout.matchAll(/^Page\s+(\d+) MediaBox:\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)$/gm),
      ([, pageNumber, left, bottom, right, top]) => ({ pageNumber: Number(pageNumber), left, bottom, right, top })
    );

    expect(pageSizes).toEqual(
      Array.from({ length: 13 }, (_, index) => ({ pageNumber: index + 1, width: '595.28', height: '841.89' }))
    );
    expect(mediaBoxes).toEqual(
      Array.from({ length: 13 }, (_, index) => ({
        pageNumber: index + 1,
        left: '0.00',
        bottom: '0.00',
        right: '595.28',
        top: '841.89',
      }))
    );
  } finally {
    await rm(outputPath, { force: true });
  }
});

test('exporter fails clearly when the preview server is unavailable', async ({ page: _page }, testInfo) => {
  const outputPath = join(pdfTempDirectory, `portfolio-unavailable-${testInfo.workerIndex}.pdf`);
  let failure: (Error & { stderr?: string }) | undefined;

  try {
    try {
      await execFileAsync(
        process.execPath,
        ['scripts/export-portfolio-pdf.mjs', '--url', 'http://127.0.0.1:65534/portfolio', '--output', outputPath],
        { cwd: repositoryRoot }
      );
    } catch (error) {
      failure = error as Error & { stderr?: string };
    }

    expect(failure?.stderr).toContain('Portfolio preview is unavailable at http://127.0.0.1:65534/portfolio');
    await expect(access(outputPath)).rejects.toMatchObject({ code: 'ENOENT' });
  } finally {
    await rm(outputPath, { force: true });
  }
});

test('exporter rejects a non-portfolio HTTP error page', async ({ page: _page }, testInfo) => {
  const outputPath = join(pdfTempDirectory, `portfolio-http-error-${testInfo.workerIndex}.pdf`);
  let failure: (Error & { stderr?: string }) | undefined;

  try {
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
    }

    expect(failure?.stderr).toContain(
      'Portfolio preview returned HTTP 404 at http://127.0.0.1:4322/not-a-portfolio-document'
    );
    await expect(access(outputPath)).rejects.toMatchObject({ code: 'ENOENT' });
  } finally {
    await rm(outputPath, { force: true });
  }
});

test('exporter rejects an HTTP 200 page with the wrong portfolio identity', async ({ page: _page }, testInfo) => {
  const outputPath = join(pdfTempDirectory, `portfolio-wrong-identity-${testInfo.workerIndex}.pdf`);
  const { fixturePath, sourceUrl } = await createServedFixture(
    'wrong-identity',
    testInfo.workerIndex,
    createHttpFixture({ identity: 'unrelated-document', pageCount: 13 })
  );
  let failure: (Error & { stderr?: string }) | undefined;

  try {
    try {
      await execFileAsync(
        process.execPath,
        ['scripts/export-portfolio-pdf.mjs', '--url', sourceUrl, '--output', outputPath],
        { cwd: repositoryRoot }
      );
    } catch (error) {
      failure = error as Error & { stderr?: string };
    }

    expect(failure?.stderr).toContain(`Portfolio preview identity mismatch at ${sourceUrl}`);
    await expect(access(outputPath)).rejects.toMatchObject({ code: 'ENOENT' });
  } finally {
    await rm(outputPath, { force: true });
    await rm(fixturePath, { force: true });
  }
});

test('exporter rejects an HTTP 200 portfolio with the wrong page count', async ({ page: _page }, testInfo) => {
  const outputPath = join(pdfTempDirectory, `portfolio-wrong-page-count-${testInfo.workerIndex}.pdf`);
  const { fixturePath, sourceUrl } = await createServedFixture(
    'wrong-page-count',
    testInfo.workerIndex,
    createHttpFixture({ identity: portfolioIdentity, pageCount: 12 })
  );
  let failure: (Error & { stderr?: string }) | undefined;

  try {
    try {
      await execFileAsync(
        process.execPath,
        ['scripts/export-portfolio-pdf.mjs', '--url', sourceUrl, '--output', outputPath],
        { cwd: repositoryRoot }
      );
    } catch (error) {
      failure = error as Error & { stderr?: string };
    }

    expect(failure?.stderr).toContain(`Portfolio preview page count mismatch at ${sourceUrl}: expected 13, found 12`);
    await expect(access(outputPath)).rejects.toMatchObject({ code: 'ENOENT' });
  } finally {
    await rm(outputPath, { force: true });
    await rm(fixturePath, { force: true });
  }
});

test('exporter reports the source of an image decode failure', async ({ page: _page }, testInfo) => {
  const missingImagePath = `/portfolio-export-fixtures/missing-${testInfo.workerIndex}.png`;
  const outputPath = join(pdfTempDirectory, `portfolio-broken-image-${testInfo.workerIndex}.pdf`);
  const { fixturePath, sourceUrl } = await createServedFixture(
    'broken-image',
    testInfo.workerIndex,
    createHttpFixture({ identity: portfolioIdentity, pageCount: 13, imageSource: missingImagePath })
  );
  let failure: (Error & { stderr?: string }) | undefined;

  try {
    try {
      await execFileAsync(
        process.execPath,
        ['scripts/export-portfolio-pdf.mjs', '--url', sourceUrl, '--output', outputPath],
        { cwd: repositoryRoot }
      );
    } catch (error) {
      failure = error as Error & { stderr?: string };
    }

    expect(failure?.stderr).toContain(`Image failed to decode: http://127.0.0.1:4322${missingImagePath}`);
    await expect(access(outputPath)).rejects.toMatchObject({ code: 'ENOENT' });
  } finally {
    await rm(outputPath, { force: true });
    await rm(fixturePath, { force: true });
  }
});
