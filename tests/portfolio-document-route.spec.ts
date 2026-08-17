import { expect, test, type Page } from '@playwright/test';

const pageNumbers = Array.from({ length: 11 }, (_, index) => index + 1);

async function getMutedCopyContrastViolations(page: Page) {
  return page.locator('.portfolio-document').evaluate((documentRoot) => {
    const minimumGray = [82, 96, 113];
    const intentionalColorSelector = ['.status-badge', '.evidence-status', '.planned-note', '.contact-link'].join(',');
    const linearize = (channel: number) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    const luminance = ([red, green, blue]: number[]) =>
      0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
    const parseRgba = (color: string) => {
      const channels = color.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255];
      return { rgb: channels.slice(0, 3), alpha: channels[3] ?? 1 };
    };
    const minimumGrayLuminance = luminance(minimumGray);

    return Array.from(documentRoot.querySelectorAll<HTMLElement>('p, li, dt, dd, figcaption, a, small, span, strong'))
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const bounds = element.getBoundingClientRect();
        return bounds.width > 1 && bounds.height > 1 && style.visibility !== 'hidden';
      })
      .filter((element) => !element.matches(intentionalColorSelector))
      .map((element) => {
        const parsed = parseRgba(window.getComputedStyle(element).color);
        let alpha = parsed.alpha;
        let ancestor: HTMLElement | null = element;
        while (ancestor && ancestor !== documentRoot) {
          alpha *= Number.parseFloat(window.getComputedStyle(ancestor).opacity);
          ancestor = ancestor.parentElement;
        }
        return {
          caseId: element.getAttribute('data-contrast-case') ?? `${element.tagName.toLowerCase()}.${element.className}`,
          rgb: parsed.rgb.map((channel) => channel * alpha + 255 * (1 - alpha)),
        };
      })
      .filter(({ rgb }) => luminance(rgb) > minimumGrayLuminance + 0.001)
      .map(({ caseId }) => caseId);
  });
}

test('canonical route renders eleven semantic slides in tagged reading order', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.locator('main[data-portfolio-document="yunho-cho-platform-engineer-portfolio"]')).toHaveCount(1);
  await expect(page.locator('main > h1.visually-hidden')).toHaveCount(1);

  const slides = page.locator('section[data-portfolio-page]');
  await expect(slides).toHaveCount(11);
  for (const pageNumber of pageNumbers) {
    const slide = page.locator(`[data-portfolio-page="${pageNumber}"]`);
    await expect(slide.locator(':scope > h2')).toHaveCount(1);
    await expect(slide.locator(':scope > h2')).toBeVisible();
    await expect(slide.locator('[data-page-number]')).toHaveText(`${String(pageNumber).padStart(2, '0')} / 11`);
  }
});

test('planned exposure has four ownership columns and a separate data route', async ({ page }) => {
  await page.goto('/portfolio');
  const planned = page.locator('[data-portfolio-page="9"]');

  await expect(planned).toHaveAttribute('data-page-status', 'planned');
  await expect(planned.locator('[data-ownership-column]')).toHaveCount(4);
  await expect(planned.locator('[data-connector-route="request"]')).toHaveCount(6);
  await expect(planned.locator('[data-connector-route="data"]')).toHaveCount(1);
  await expect(
    planned.locator(
      '[data-connector-route="data"][data-from-node="runtime-application"][data-to-node="storage-postgresql"]'
    )
  ).toHaveCount(1);

  expect(
    await planned
      .locator('[data-connector-route="request"]')
      .evaluateAll((routes) =>
        routes.map((route) => [route.getAttribute('data-from-node'), route.getAttribute('data-to-node')])
      )
  ).toEqual([
    ['control-dns', 'oci-edge'],
    ['deploy-dns', 'oci-edge'],
    ['oci-edge', 'wireguard'],
    ['wireguard', 'internal-ingress'],
    ['internal-ingress', 'project-gateway'],
    ['project-gateway', 'runtime-application'],
  ]);
  await expect(planned.locator('[data-boundary="home-lab"]')).toHaveCount(1);
  await expect(planned.locator('[data-merge-point]')).toHaveCount(1);
});

test('print slides keep exact 16:9 geometry and all body content above the footer', async ({ page }) => {
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
      const descendants = Array.from(body.querySelectorAll<HTMLElement>('*')).filter((element) => {
        const bounds = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return bounds.width > 0 && bounds.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      });
      return {
        width: slideBounds.width,
        height: slideBounds.height,
        pageOverflowX: slide.scrollWidth - slide.clientWidth,
        pageOverflowY: slide.scrollHeight - slide.clientHeight,
        bodyOverflowX: body.scrollWidth - body.clientWidth,
        bodyOverflowY: body.scrollHeight - body.clientHeight,
        bodyAboveFooter: bodyBounds.bottom <= footerBounds.top + 1,
        descendantsAboveFooter: descendants.every(
          (element) => element.getBoundingClientRect().bottom <= footerBounds.top + 1
        ),
      };
    });

    expect(measurement.width, `slide ${pageNumber} print width`).toBeCloseTo(1280, 0);
    expect(measurement.height, `slide ${pageNumber} print height`).toBeCloseTo(720, 0);
    expect(measurement.width / measurement.height, `slide ${pageNumber} ratio`).toBeCloseTo(16 / 9, 3);
    expect(measurement.pageOverflowX, `slide ${pageNumber} horizontal page overflow`).toBeLessThanOrEqual(1);
    expect(measurement.pageOverflowY, `slide ${pageNumber} vertical page overflow`).toBeLessThanOrEqual(1);
    expect(measurement.bodyOverflowX, `slide ${pageNumber} horizontal body overflow`).toBeLessThanOrEqual(1);
    expect(measurement.bodyOverflowY, `slide ${pageNumber} vertical body overflow`).toBeLessThanOrEqual(1);
    expect(measurement.bodyAboveFooter, `slide ${pageNumber} body/footer ordering`).toBe(true);
    expect(measurement.descendantsAboveFooter, `slide ${pageNumber} descendant/footer ordering`).toBe(true);
  }
});

test('every diagram node title stays on one line without horizontal overflow', async ({ page }) => {
  await page.goto('/portfolio');
  const measurements = await page.locator('[data-node-title]').evaluateAll((titles) =>
    titles.map((title) => {
      const style = window.getComputedStyle(title);
      const bounds = title.getBoundingClientRect();
      return {
        label: title.textContent?.trim(),
        lineCount: Math.round(bounds.height / Number.parseFloat(style.lineHeight)),
        clientWidth: title.clientWidth,
        scrollWidth: title.scrollWidth,
      };
    })
  );
  expect(measurements.length).toBeGreaterThan(30);
  for (const measurement of measurements) {
    expect(measurement.lineCount, JSON.stringify(measurement)).toBe(1);
    expect(measurement.scrollWidth, JSON.stringify(measurement)).toBeLessThanOrEqual(measurement.clientWidth + 1);
  }
});

test('connector segments do not intersect non-endpoint nodes', async ({ page }) => {
  await page.goto('/portfolio');
  const result = await page.locator('[data-diagram]').evaluateAll((diagrams) => {
    const overlaps = (a: DOMRect, b: DOMRect) =>
      Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
      Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
    const segments = diagrams.flatMap((diagram) =>
      Array.from(diagram.querySelectorAll<HTMLElement>('[data-connector-segment]'))
    );
    const violations = diagrams.flatMap((diagram) => {
      const nodes = Array.from(diagram.querySelectorAll<HTMLElement>('[data-diagram-node]'));
      return Array.from(diagram.querySelectorAll<HTMLElement>('[data-connector-segment]')).flatMap((segment) => {
        const from = segment.getAttribute('data-from-node');
        const to = segment.getAttribute('data-to-node');
        return nodes
          .filter((node) => ![from, to].includes(node.getAttribute('data-diagram-node')))
          .filter((node) => overlaps(segment.getBoundingClientRect(), node.getBoundingClientRect()))
          .map((node) => `${from}->${to} intersects ${node.getAttribute('data-diagram-node')}`);
      });
    });
    return { segmentCount: segments.length, violations };
  });
  expect(result.segmentCount).toBeGreaterThan(20);
  expect(result.violations).toEqual([]);
});

test('current-system connector chains physically touch their declared endpoint nodes', async ({ page }) => {
  await page.goto('/portfolio');
  const measurements = await page
    .locator('[data-portfolio-page="4"] [data-diagram="current-system"] [data-connector-route]')
    .evaluateAll((routes) =>
      routes.map((route) => {
        const diagram = route.closest<HTMLElement>('[data-diagram]');
        const fromId = route.getAttribute('data-from-node');
        const toId = route.getAttribute('data-to-node');
        const fromNode = diagram?.querySelector<HTMLElement>(`[data-diagram-node="${fromId}"]`);
        const toNode = diagram?.querySelector<HTMLElement>(`[data-diagram-node="${toId}"]`);
        const segments = Array.from(route.querySelectorAll<HTMLElement>('[data-connector-segment]'));
        if (!fromNode || !toNode || segments.length === 0)
          throw new Error('Current connector endpoint contract is incomplete');

        const distance = (first: DOMRect, second: DOMRect) => ({
          x: Math.max(first.left - second.right, second.left - first.right, 0),
          y: Math.max(first.top - second.bottom, second.top - first.bottom, 0),
        });
        return {
          route: `${fromId}->${toId}`,
          fromDistance: distance(segments[0].getBoundingClientRect(), fromNode.getBoundingClientRect()),
          toDistance: distance(segments.at(-1)!.getBoundingClientRect(), toNode.getBoundingClientRect()),
        };
      })
    );

  expect(measurements).toHaveLength(3);
  for (const measurement of measurements) {
    expect(measurement.fromDistance.x, `${measurement.route} source x`).toBeLessThanOrEqual(2);
    expect(measurement.fromDistance.y, `${measurement.route} source y`).toBeLessThanOrEqual(2);
    expect(measurement.toDistance.x, `${measurement.route} target x`).toBeLessThanOrEqual(2);
    expect(measurement.toDistance.y, `${measurement.route} target y`).toBeLessThanOrEqual(2);
  }
});

test('slides two through ten devote the slide body to a primary visual', async ({ page }) => {
  await page.goto('/portfolio');
  for (const pageNumber of pageNumbers.slice(1, 10)) {
    const ratios = await page.locator(`[data-portfolio-page="${pageNumber}"]`).evaluate((slide) => {
      const body = slide.querySelector<HTMLElement>('.slide-body');
      const visual = slide.querySelector<HTMLElement>('[data-primary-visual]');
      if (!body || !visual) throw new Error(`Slide ${slide.getAttribute('data-portfolio-page')} has no primary visual`);
      const bodyBounds = body.getBoundingClientRect();
      const visualBounds = visual.getBoundingClientRect();
      return {
        width: visualBounds.width / bodyBounds.width,
        height: visualBounds.height / bodyBounds.height,
      };
    });
    expect(ratios.width, `slide ${pageNumber} primary visual width`).toBeGreaterThanOrEqual(0.7);
    expect(ratios.height, `slide ${pageNumber} primary visual height`).toBeGreaterThanOrEqual(0.7);
  }
});

test('real evidence captures appear only on approved slides with intact aspect ratio', async ({ page }) => {
  await page.goto('/portfolio');
  const figures = page.locator('.evidence-figure');
  await expect(figures).toHaveCount(3);
  expect(
    await figures.evaluateAll((items) =>
      items.map((item) => ({
        page: item.closest('[data-portfolio-page]')?.getAttribute('data-portfolio-page'),
        src: item.querySelector('img')?.getAttribute('src'),
        objectFit: window.getComputedStyle(item.querySelector('img')!).objectFit,
      }))
    )
  ).toEqual([
    { page: '6', src: '/projects/gjallar.png', objectFit: 'contain' },
    { page: '10', src: '/projects/klepaas-dashboard.png', objectFit: 'contain' },
    { page: '10', src: '/projects/argus.png', objectFit: 'contain' },
  ]);
  await expect(page.locator('img[src="/projects/heimdall.png"]')).toHaveCount(0);
});

test('failure and ownership scope remain semantic and explicit', async ({ page }) => {
  await page.goto('/portfolio');
  const failure = page.locator('[data-portfolio-page="8"]');
  await expect(failure.locator('[data-failure-branch]')).toHaveCount(3);
  await expect(failure.locator('[data-storage-boundary="user-confirmed-operational"]')).toHaveCount(1);
  for (const scopeLimit of [
    'release-image-rollback',
    'database-backup-restore',
    'database-purge',
    'database-credential-rotation',
    'data-rollback',
  ]) {
    await expect(failure.locator(`[data-scope-limit="${scopeLimit}"]`)).toHaveCount(1);
  }

  const origin = page.locator('[data-portfolio-page="10"]');
  await expect(origin.locator('[data-team-scope="team"]')).toContainText('2인 팀');
  await expect(origin.locator('[data-team-scope="personal"]')).toContainText('CommandPlan');
});

test('contact links are actionable and rendered copy meets the contrast floor', async ({ page }) => {
  await page.goto('/portfolio');
  const last = page.locator('[data-portfolio-page="11"]');
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
