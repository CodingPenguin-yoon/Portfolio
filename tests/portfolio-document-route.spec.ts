import { expect, test } from '@playwright/test';

test('every page has one visible h2 and a page label', async ({ page }) => {
  await page.goto('/portfolio');
  const pages = page.locator('section[data-portfolio-page]');
  await expect(pages).toHaveCount(13);

  for (let index = 0; index < 13; index += 1) {
    await expect(pages.nth(index).locator('h2')).toHaveCount(1);
    await expect(pages.nth(index).locator('h2')).toBeVisible();
    await expect(pages.nth(index).locator('[data-page-number]')).toContainText(String(index + 1).padStart(2, '0'));
  }
});

test('document typography keeps Korean status in sans and page numbers in mono', async ({ page }) => {
  await page.goto('/portfolio');

  const statusBadge = page.locator('[data-portfolio-page="5"] .status-badge');
  const pageNumber = page.locator('[data-portfolio-page="5"] [data-page-number]');

  await expect(statusBadge).toHaveCSS('font-family', /IBM Plex Sans KR/);
  await expect(statusBadge).not.toHaveCSS('font-family', /IBM Plex Mono/);
  await expect(pageNumber).toHaveCSS('font-family', /IBM Plex Mono/);
});

test('opening story exposes the manual flow, evolution, and team scopes', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.locator('[data-portfolio-page="3"] [data-origin-step]')).toHaveCount(4);
  await expect(page.locator('[data-portfolio-page="4"] [data-evolution-stage]')).toHaveCount(4);
  await expect(page.locator('[data-portfolio-page="4"] [data-responsibility-split]')).toHaveCount(1);
  await expect(page.locator('[data-portfolio-page="5"] [data-team-scope="team"]')).toHaveCount(1);
  await expect(page.locator('[data-portfolio-page="5"] [data-team-scope="personal"]')).toHaveCount(1);
});

test('K-Le-PaaS evidence is immediately available with an accessible description', async ({ page }) => {
  await page.goto('/portfolio');

  const evidence = page.locator('[data-portfolio-page="5"] .evidence-figure');
  const image = evidence.locator('img');
  const caption = evidence.locator('figcaption strong');

  await expect(image).toHaveAttribute('loading', 'eager');
  expect((await image.getAttribute('alt'))?.trim().length).toBeGreaterThan(20);
  await expect(caption).toBeVisible();
  expect((await caption.textContent())?.trim().length).toBeGreaterThan(20);
});
