import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from '@playwright/test';

const checkoutPath = fileURLToPath(new URL('.', import.meta.url));
const checkoutId = createHash('sha256').update(checkoutPath).digest('hex').slice(0, 12);
const portfolioQaRoot =
  process.platform === 'darwin'
    ? join('/private', 'tmp', 'portfolio-document-qa')
    : join(tmpdir(), 'portfolio-document-qa');
const portfolioQaOutputDir = join(portfolioQaRoot, `playwright-portfolio-document-${checkoutId}`);

export default defineConfig({
  outputDir: portfolioQaOutputDir,
  testDir: './tests',
  use: {
    baseURL: 'http://127.0.0.1:4322',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : undefined,
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4322',
    url: 'http://127.0.0.1:4322',
    reuseExistingServer: !process.env.CI,
  },
});
