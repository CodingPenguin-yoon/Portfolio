import { join } from 'node:path';

import { defineConfig } from '@playwright/test';

const portfolioQaOutputDir = join('/private/tmp', 'portfolio-document-qa', 'playwright');

export default defineConfig({
  outputDir: portfolioQaOutputDir,
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:4322' },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4322',
    url: 'http://127.0.0.1:4322',
    reuseExistingServer: !process.env.CI,
  },
});
