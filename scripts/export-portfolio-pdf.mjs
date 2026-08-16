import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { chromium } from '@playwright/test';

const defaultOutputPath = fileURLToPath(new URL('../output/pdf/yunho-cho-portfolio.pdf', import.meta.url));
const defaultSourceUrl = 'http://127.0.0.1:4322/portfolio';
const portfolioIdentity = 'yunho-cho-platform-engineer-portfolio';
// Chromium 140 serializes CSS A4 with a small device-unit rounding error. Keep
// the replacement byte length identical so every xref offset remains valid.
const chromiumA4MediaBox = Buffer.from('/MediaBox [0 0 594.95996 841.91998]');
const canonicalA4MediaBox = Buffer.from('/MediaBox [0 0 595.28000 841.89000]');

function normalizeA4MediaBoxes(pdf, expectedPageCount) {
  if (chromiumA4MediaBox.length !== canonicalA4MediaBox.length) {
    throw new Error('Canonical A4 MediaBox replacement must preserve PDF byte offsets');
  }

  const normalizedPdf = Buffer.from(pdf);
  let searchOffset = 0;
  let replacements = 0;

  while (searchOffset < normalizedPdf.length) {
    const mediaBoxOffset = normalizedPdf.indexOf(chromiumA4MediaBox, searchOffset);
    if (mediaBoxOffset === -1) break;
    canonicalA4MediaBox.copy(normalizedPdf, mediaBoxOffset);
    replacements += 1;
    searchOffset = mediaBoxOffset + canonicalA4MediaBox.length;
  }

  if (replacements !== expectedPageCount) {
    throw new Error(`Expected ${expectedPageCount} Chromium A4 page boxes; found ${replacements}`);
  }

  return normalizedPdf;
}

function parseArguments(argumentsToParse) {
  const options = {
    outputPath: defaultOutputPath,
    sourceUrl: defaultSourceUrl,
  };

  for (let index = 0; index < argumentsToParse.length; index += 1) {
    const argument = argumentsToParse[index];
    const [name, inlineValue] = argument.split('=', 2);

    if (!['--output', '--url'].includes(name)) {
      throw new Error(`Unknown argument: ${argument}`);
    }

    const value = inlineValue ?? argumentsToParse[++index];
    if (!value || value.startsWith('--')) {
      throw new Error(`${name} requires a value`);
    }

    if (name === '--output') options.outputPath = value;
    if (name === '--url') options.sourceUrl = value;
  }

  return options;
}

export async function exportPortfolioPdf({ outputPath = defaultOutputPath, sourceUrl = defaultSourceUrl } = {}) {
  const resolvedOutputPath = resolve(outputPath);
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage();
    let response;

    try {
      response = await page.goto(sourceUrl, { waitUntil: 'networkidle' });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new Error(`Portfolio preview is unavailable at ${sourceUrl}: ${detail}`);
    }

    if (!response) {
      throw new Error(`Portfolio preview did not return an HTTP response at ${sourceUrl}`);
    }
    if (!response.ok()) {
      throw new Error(`Portfolio preview returned HTTP ${response.status()} at ${sourceUrl}`);
    }

    const portfolioIdentityCount = await page.locator(`[data-portfolio-document="${portfolioIdentity}"]`).count();
    if (portfolioIdentityCount !== 1) {
      throw new Error(`Portfolio preview identity mismatch at ${sourceUrl}`);
    }

    const portfolioPageCount = await page.locator('section[data-portfolio-page]').count();
    if (portfolioPageCount !== 13) {
      throw new Error(
        `Portfolio preview page count mismatch at ${sourceUrl}: expected 13, found ${portfolioPageCount}`
      );
    }

    await page.emulateMedia({ media: 'print' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images, async (image) => {
          const source = image.currentSrc || image.src || '<unknown source>';
          try {
            await image.decode();
          } catch {
            throw new Error(`Image failed to decode: ${source}`);
          }
          if (!image.complete || image.naturalWidth === 0) {
            throw new Error(`Image failed to load: ${source}`);
          }
        })
      );
    });

    const chromiumPdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    });
    const normalizedPdf = normalizeA4MediaBoxes(chromiumPdf, portfolioPageCount);
    await mkdir(dirname(resolvedOutputPath), { recursive: true });
    await writeFile(resolvedOutputPath, normalizedPdf);
  } finally {
    await browser.close();
  }

  return resolvedOutputPath;
}

const isDirectExecution = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectExecution) {
  try {
    const outputPath = await exportPortfolioPdf(parseArguments(process.argv.slice(2)));
    console.log(`Portfolio PDF exported to ${outputPath}`);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`Portfolio PDF export failed: ${detail}`);
    process.exitCode = 1;
  }
}
