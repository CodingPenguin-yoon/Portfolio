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

  const teamScope = page.locator('[data-portfolio-page="5"] [data-team-scope="team"]');
  const personalScope = page.locator('[data-portfolio-page="5"] [data-team-scope="personal"]');
  const evidence = teamScope.locator('.evidence-figure');
  const image = evidence.locator('img');
  const caption = evidence.locator('figcaption strong');

  await expect(evidence).toHaveCount(1);
  await expect(personalScope.locator('.evidence-figure')).toHaveCount(0);
  await expect(image).toHaveAttribute('loading', 'eager');
  expect((await image.getAttribute('alt'))?.trim().length).toBeGreaterThan(20);
  await expect(caption).toBeVisible();
  expect((await caption.textContent())?.trim().length).toBeGreaterThan(20);
});

test('K-Le-PaaS scopes expose accessible ownership and personal contribution identity', async ({ page }) => {
  await page.goto('/portfolio');

  const teamScope = page.locator('[data-portfolio-page="5"] [data-team-scope="team"]');
  const personalScope = page.locator('[data-portfolio-page="5"] [data-team-scope="personal"]');
  const contributions = personalScope.locator('[data-contribution-id]');

  await expect(teamScope.getByRole('heading', { level: 3 })).toHaveCount(1);
  await expect(personalScope.getByRole('heading', { level: 3 })).toHaveCount(1);
  await expect(contributions).toHaveCount(4);
  expect(
    await contributions.evaluateAll((items) => items.map((item) => item.getAttribute('data-contribution-id')))
  ).toEqual([
    'gemini-intent-entity-parsing',
    'kubernetes-command-plans',
    'ingress-domain-sync',
    'prometheus-nks-monitoring',
  ]);
});

test('K-Le-PaaS evidence is readable and remains inside the A4 page', async ({ page }) => {
  await page.goto('/portfolio');

  const measurement = await page.locator('[data-portfolio-page="5"]').evaluate((portfolioPage) => {
    const body = portfolioPage.querySelector<HTMLElement>('.page-body');
    const footer = portfolioPage.querySelector<HTMLElement>('.page-footer');
    const evidence = portfolioPage.querySelector<HTMLElement>('[data-team-scope="team"] .evidence-figure');
    const image = evidence?.querySelector<HTMLElement>('img');
    const caption = evidence?.querySelector<HTMLElement>('figcaption');

    if (!body || !footer || !evidence || !image || !caption) throw new Error('Page 5 evidence structure is incomplete');

    const pageBounds = portfolioPage.getBoundingClientRect();
    const footerBounds = footer.getBoundingClientRect();
    const evidenceBounds = evidence.getBoundingClientRect();
    const imageBounds = image.getBoundingClientRect();
    const captionBounds = caption.getBoundingClientRect();
    const withinPageWidth = (bounds: DOMRect) => bounds.left >= pageBounds.left && bounds.right <= pageBounds.right;

    return {
      evidenceWidth: evidenceBounds.width,
      evidenceWithinPage: withinPageWidth(evidenceBounds) && evidenceBounds.bottom <= footerBounds.top,
      imageWithinPage: withinPageWidth(imageBounds) && imageBounds.bottom <= footerBounds.top,
      captionWithinPage: withinPageWidth(captionBounds) && captionBounds.bottom <= footerBounds.top,
      bodyClientHeight: body.clientHeight,
      bodyScrollHeight: body.scrollHeight,
    };
  });

  expect(measurement.evidenceWidth).toBeGreaterThan(360);
  expect(measurement.evidenceWithinPage).toBe(true);
  expect(measurement.imageWithinPage).toBe(true);
  expect(measurement.captionWithinPage).toBe(true);
  expect(measurement.bodyScrollHeight).toBeLessThanOrEqual(measurement.bodyClientHeight + 1);
});
