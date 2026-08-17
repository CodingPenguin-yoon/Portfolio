import { expect, test, type Page } from '@playwright/test';

const pageNumbers = Array.from({ length: 14 }, (_, index) => index + 1);

async function getMutedCopyContrastViolations(page: Page) {
  return page.locator('.portfolio-document').evaluate((documentRoot) => {
    const linearize = (channel: number) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    const luminance = ([red, green, blue]: number[]) =>
      0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
    const minimum = luminance([82, 96, 113]);
    return Array.from(documentRoot.querySelectorAll<HTMLElement>('p, li, dt, dd, figcaption, a, small, span, strong'))
      .filter((element) => {
        const bounds = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return bounds.width > 1 && bounds.height > 1 && style.visibility !== 'hidden';
      })
      .map((element) => {
        const rgb = window
          .getComputedStyle(element)
          .color.match(/[\d.]+/g)
          ?.slice(0, 3)
          .map(Number) ?? [0, 0, 0];
        return { label: element.textContent?.trim().slice(0, 40), rgb };
      })
      .filter(({ rgb }) => luminance(rgb) > minimum + 0.001);
  });
}

test('canonical route renders fourteen semantic slides in reading order', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.locator('main[data-portfolio-document="yunho-cho-platform-engineer-portfolio"]')).toHaveCount(1);
  const slides = page.locator('section[data-portfolio-page]');
  await expect(slides).toHaveCount(14);
  for (const pageNumber of pageNumbers) {
    const slide = page.locator(`[data-portfolio-page="${pageNumber}"]`);
    await expect(slide.locator(':scope > h2')).toBeVisible();
    await expect(slide.locator('[data-page-number]')).toHaveText(`${String(pageNumber).padStart(2, '0')} / 14`);
    await expect(slide.locator('[data-primary-visual]')).toHaveCount(1);
  }
});

test('print slides keep exact 16:9 geometry without overflow', async ({ page }) => {
  await page.emulateMedia({ media: 'print' });
  await page.goto('/portfolio');
  for (const pageNumber of pageNumbers) {
    const measurement = await page.locator(`[data-portfolio-page="${pageNumber}"]`).evaluate((slide) => {
      const body = slide.querySelector<HTMLElement>('.slide-body');
      const footer = slide.querySelector<HTMLElement>('.page-footer');
      if (!body || !footer) throw new Error('Slide shell is incomplete');
      const slideBounds = slide.getBoundingClientRect();
      const bodyBounds = body.getBoundingClientRect();
      const footerBounds = footer.getBoundingClientRect();
      return {
        width: slideBounds.width,
        height: slideBounds.height,
        pageOverflowX: slide.scrollWidth - slide.clientWidth,
        pageOverflowY: slide.scrollHeight - slide.clientHeight,
        bodyOverflowX: body.scrollWidth - body.clientWidth,
        bodyOverflowY: body.scrollHeight - body.clientHeight,
        bodyAboveFooter: bodyBounds.bottom <= footerBounds.top + 1,
      };
    });
    expect(measurement.width, `slide ${pageNumber} width`).toBeCloseTo(1280, 0);
    expect(measurement.height, `slide ${pageNumber} height`).toBeCloseTo(720, 0);
    expect(measurement.width / measurement.height).toBeCloseTo(16 / 9, 3);
    expect(measurement.pageOverflowX, `slide ${pageNumber} page x overflow`).toBeLessThanOrEqual(1);
    expect(measurement.pageOverflowY, `slide ${pageNumber} page y overflow`).toBeLessThanOrEqual(1);
    expect(measurement.bodyOverflowX, `slide ${pageNumber} body x overflow`).toBeLessThanOrEqual(1);
    expect(measurement.bodyOverflowY, `slide ${pageNumber} body y overflow`).toBeLessThanOrEqual(1);
    expect(measurement.bodyAboveFooter, `slide ${pageNumber} body stays above footer`).toBe(true);
  }
});

test('evidence screens appear on the approved slides at meaningful size', async ({ page }) => {
  await page.goto('/portfolio');
  const figures = page.locator('.evidence-figure');
  await expect(figures).toHaveCount(4);
  expect(
    await figures.evaluateAll((items) =>
      items.map((item) => ({
        page: item.closest('[data-portfolio-page]')?.getAttribute('data-portfolio-page'),
        src: item.querySelector('img')?.getAttribute('src'),
        objectFit: window.getComputedStyle(item.querySelector('img')!).objectFit,
      }))
    )
  ).toEqual([
    { page: '3', src: '/projects/klepaas-dashboard.png', objectFit: 'contain' },
    { page: '9', src: '/projects/gjallar.png', objectFit: 'contain' },
    { page: '12', src: '/projects/heimdall.png', objectFit: 'contain' },
    { page: '13', src: '/projects/argus.png', objectFit: 'contain' },
  ]);
  for (const pageNumber of [3, 9, 12, 13]) {
    const ratio = await page.locator(`[data-portfolio-page="${pageNumber}"]`).evaluate((slide) => {
      const body = slide.querySelector<HTMLElement>('.slide-body')!;
      const image = slide.querySelector<HTMLElement>('.evidence-figure')!;
      return image.getBoundingClientRect().width / body.getBoundingClientRect().width;
    });
    expect(ratio, `slide ${pageNumber} evidence width`).toBeGreaterThanOrEqual(0.5);
  }
});

test('team, previous, operational and non-implemented boundaries remain explicit', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.locator('[data-portfolio-page="3"]')).toHaveAttribute('data-page-status', 'previous');
  await expect(page.locator('[data-portfolio-page="3"]')).toContainText('개인 기여');
  await expect(
    page.locator('[data-portfolio-page="7"] [data-storage-boundary="user-confirmed-operational"]')
  ).toHaveCount(1);
  await expect(page.locator('[data-portfolio-page="8"] [data-scope-limit="vm-full-lifecycle"]')).toHaveCount(1);
  for (const limit of [
    'release-image-rollback',
    'database-backup-restore',
    'database-purge',
    'database-credential-rotation',
    'data-rollback',
  ]) {
    await expect(page.locator(`[data-portfolio-page="11"] [data-scope-limit="${limit}"]`)).toHaveCount(1);
  }
});

test('contact links work and muted copy meets the contrast floor', async ({ page }) => {
  await page.goto('/portfolio');
  const last = page.locator('[data-portfolio-page="14"]');
  await expect(last.locator('[data-summary-project]')).toHaveCount(4);
  await expect(last.locator('a[href="mailto:code.penguin.yoon@gmail.com"]')).toHaveCount(1);
  await expect(last.locator('a[href="https://github.com/CodingPenguin-yoon"]')).toHaveCount(1);
  await expect(last.locator('a[href="https://yoonman.page"]')).toHaveCount(1);
  expect(await getMutedCopyContrastViolations(page)).toEqual([]);
});

test('visual system has no gradients or shadows', async ({ page }) => {
  await page.goto('/portfolio');
  const violations = await page.locator('.portfolio-document *').evaluateAll((items) =>
    items
      .map((item) => ({
        element: `${item.tagName.toLowerCase()}.${typeof item.className === 'string' ? item.className : ''}`,
        backgroundImage: window.getComputedStyle(item).backgroundImage,
        boxShadow: window.getComputedStyle(item).boxShadow,
      }))
      .filter(({ backgroundImage, boxShadow }) => backgroundImage !== 'none' || boxShadow !== 'none')
  );
  expect(violations).toEqual([]);
});
