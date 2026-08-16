import { expect, test } from '@playwright/test';

test('portfolio harness serves the existing static site', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.ok()).toBe(true);
  await expect(page.locator('body')).toBeVisible();
});
