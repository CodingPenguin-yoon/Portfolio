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

test('system map separates lifecycles and Gjallar execution layers', async ({ page }) => {
  await page.goto('/portfolio');

  const system = page.locator('[data-portfolio-page="6"]');
  await expect(system.locator('[data-architecture-map]')).toHaveCount(1);
  await expect(system.locator('[data-system-node="runtime"]')).toHaveCount(1);
  await expect(system.locator('[data-system-node="storage"]')).toHaveCount(1);
  await expect(system.locator('[data-system-node="runtime"]')).toContainText('Heimdall Worker');
  await expect(system.locator('[data-system-node="storage"]')).toContainText('PostgreSQL');

  const gjallar = page.locator('[data-portfolio-page="8"]');
  const layers = gjallar.locator('[data-gjallar-layer]');
  await expect(layers).toHaveCount(5);
  expect(await layers.evaluateAll((items) => items.map((item) => item.getAttribute('data-gjallar-layer')))).toEqual([
    'actual-state',
    'policy',
    'preflight',
    'execution',
    'outcome',
  ]);
  await expect(gjallar.locator('[data-scope-limit="vm-full-lifecycle"]')).toHaveCount(1);
});

test('current system connections resolve declared zones without showing the planned external path', async ({
  page,
}) => {
  await page.goto('/portfolio');

  const map = page.locator('[data-portfolio-page="6"] [data-architecture-map]');
  const zoneLabels = await map
    .locator('[data-architecture-zone]')
    .evaluateAll((zones) =>
      Object.fromEntries(
        zones.map((zone) => [
          zone.getAttribute('data-architecture-zone'),
          zone.querySelector('h3')?.textContent?.trim(),
        ])
      )
    );
  const currentConnections = map.locator('[data-connection-status]');
  const resolvedConnections = await currentConnections.evaluateAll((connections) =>
    connections.map((connection) => ({
      status: connection.getAttribute('data-connection-status'),
      from: connection.getAttribute('data-from-zone'),
      to: connection.getAttribute('data-to-zone'),
      labels: Array.from(connection.querySelectorAll('.connection-route strong')).map((label) =>
        label.textContent?.trim()
      ),
    }))
  );

  expect(resolvedConnections).toEqual([
    {
      status: 'active',
      from: 'gjallar-control',
      to: 'proxmox',
      labels: ['Gjallar Control', 'Proxmox'],
    },
    {
      status: 'active',
      from: 'proxmox',
      to: 'runtime',
      labels: ['Proxmox', 'Runtime VM'],
    },
    {
      status: 'operational',
      from: 'runtime',
      to: 'storage',
      labels: ['Runtime VM', 'Storage VM'],
    },
  ]);

  for (const connection of resolvedConnections) {
    expect(connection.from).not.toBeNull();
    expect(connection.to).not.toBeNull();
    expect(connection.labels).toEqual([
      zoneLabels[connection.from as keyof typeof zoneLabels],
      zoneLabels[connection.to as keyof typeof zoneLabels],
    ]);
  }

  await expect(map.locator('[data-connection-status="planned"]')).toHaveCount(0);
  await expect(map.locator('[data-connection-status="external"]')).toHaveCount(0);
  await expect(map).not.toContainText('OCI Edge');
  await expect(map).not.toContainText('WireGuard');
});

test('responsibility split compares five decision dimensions and one before-after change', async ({ page }) => {
  await page.goto('/portfolio');

  const responsibility = page.locator('[data-portfolio-page="7"]');
  const rows = responsibility.locator('[data-responsibility-row]');
  await expect(rows).toHaveCount(5);
  expect(await rows.evaluateAll((items) => items.map((item) => item.getAttribute('data-responsibility-row')))).toEqual([
    'responsibility',
    'change-reason',
    'execution-target',
    'failure-impact',
    'current-scope',
  ]);
  await expect(responsibility.locator('[data-responsibility-state="before"]')).toHaveCount(1);
  await expect(responsibility.locator('[data-responsibility-state="after"]')).toHaveCount(1);
  await expect(responsibility.locator('[data-responsibility-state="after"]')).toContainText('VM Create');
  await expect(responsibility.locator('[data-responsibility-state="after"]')).toContainText('Deployment Generation');
});

test('Gjallar evidence is eager, accessible, and scoped to the implementation page', async ({ page }) => {
  await page.goto('/portfolio');

  const gjallar = page.locator('[data-portfolio-page="8"]');
  const evidence = gjallar.locator('.evidence-figure');
  const image = evidence.locator('img');
  const caption = evidence.locator('figcaption strong');

  await expect(evidence).toHaveCount(1);
  await expect(image).toHaveAttribute('src', '/projects/gjallar.png');
  await expect(image).toHaveAttribute('loading', 'eager');
  expect((await image.getAttribute('alt'))?.trim().length).toBeGreaterThan(20);
  await expect(caption).toBeVisible();
  expect((await caption.textContent())?.trim().length).toBeGreaterThan(20);
  const evidenceBounds = await gjallar.locator('.gjallar-evidence').evaluate((container) => {
    const figure = container.querySelector<HTMLElement>('.evidence-figure');
    const image = container.querySelector<HTMLElement>('img');
    const scopeLimit = container.querySelector<HTMLElement>('.scope-limit');
    if (!figure || !image || !scopeLimit) throw new Error('Gjallar evidence layout is incomplete');

    return {
      containerWidth: container.getBoundingClientRect().width,
      figureWidth: figure.getBoundingClientRect().width,
      imageWidth: image.getBoundingClientRect().width,
      scopeLimitWidth: scopeLimit.getBoundingClientRect().width,
    };
  });
  expect(evidenceBounds.imageWidth, JSON.stringify(evidenceBounds)).toBeGreaterThanOrEqual(500);
  await expect(page.locator('[data-portfolio-page="6"] .evidence-figure')).toHaveCount(0);
  await expect(page.locator('[data-portfolio-page="7"] .evidence-figure')).toHaveCount(0);
});

test('Heimdall implementation and external plan are visibly separated', async ({ page }) => {
  await page.goto('/portfolio');

  const promotion = page.locator('[data-portfolio-page="9"]');
  await expect(promotion).toHaveAttribute('data-page-status', 'implemented');
  const promotionSteps = promotion.locator('[data-flow-step]');
  await expect(promotionSteps).toHaveCount(7);
  expect(
    await promotionSteps.evaluateAll((steps) =>
      steps.map((step) => ({
        id: step.getAttribute('data-flow-step'),
        label: step.querySelector('strong')?.textContent?.trim(),
      }))
    )
  ).toEqual([
    { id: 'exact-commit', label: 'Exact Commit' },
    { id: 'build', label: 'Build' },
    { id: 'generation-network', label: 'Generation Network' },
    { id: 'candidate-start', label: 'Candidate Start' },
    { id: 'service-health', label: 'Service Health' },
    { id: 'nginx-validate-route-probe', label: 'Nginx Validate + Route Probe' },
    { id: 'current-metadata-previous-retirement', label: 'Current Metadata + Previous Retirement' },
  ]);
  expect(
    await promotion
      .locator('[data-promotion-outcome]')
      .evaluateAll((outcomes) => outcomes.map((outcome) => outcome.getAttribute('data-promotion-outcome')))
  ).toEqual(['execution-success', 'traffic-activation-success']);

  const failure = page.locator('[data-portfolio-page="10"]');
  await expect(failure).toHaveAttribute('data-page-status', 'implemented');
  const failureModes = failure.locator('[data-failure-mode]');
  await expect(failureModes).toHaveCount(4);
  expect(
    await failureModes.evaluateAll((modes) => modes.map((mode) => mode.getAttribute('data-failure-mode')))
  ).toEqual(['build-health', 'nginx-activation', 'worker-interruption', 'app-deployment-data']);
  await expect(failure.locator('[data-scope-limit="release-image-rollback"]')).toHaveCount(1);
  await expect(failure.locator('[data-scope-limit="database-backup-restore"]')).toHaveCount(1);
  await expect(failure.locator('[data-scope-limit="database-purge"]')).toHaveCount(1);
  await expect(failure.locator('[data-reconciliation-policy="preserve-unknown"]')).toHaveCount(1);
  await expect(failure.locator('[data-storage-boundary="user-confirmed-operational"]')).toHaveCount(1);

  const external = page.locator('[data-portfolio-page="11"]');
  await expect(external).toHaveAttribute('data-page-status', 'planned');
  expect(
    await external
      .locator('[data-architecture-zone]')
      .evaluateAll((zones) => zones.map((zone) => zone.getAttribute('data-architecture-zone')))
  ).toEqual([
    'control-dns',
    'deployment-dns',
    'oci-edge',
    'wireguard',
    'external-network-ingress',
    'project-gateway',
    'runtime-application',
    'storage-postgresql',
  ]);
  const plannedConnections = external.locator('[data-connection-status]');
  await expect(plannedConnections).toHaveCount(7);
  expect(
    await plannedConnections.evaluateAll((connections) =>
      connections.map((connection) => ({
        status: connection.getAttribute('data-connection-status'),
        from: connection.getAttribute('data-from-zone'),
        to: connection.getAttribute('data-to-zone'),
      }))
    )
  ).toEqual([
    { status: 'planned', from: 'control-dns', to: 'oci-edge' },
    { status: 'planned', from: 'deployment-dns', to: 'oci-edge' },
    { status: 'planned', from: 'oci-edge', to: 'wireguard' },
    { status: 'planned', from: 'wireguard', to: 'external-network-ingress' },
    { status: 'planned', from: 'external-network-ingress', to: 'project-gateway' },
    { status: 'planned', from: 'project-gateway', to: 'runtime-application' },
    { status: 'planned', from: 'runtime-application', to: 'storage-postgresql' },
  ]);
  expect(
    await plannedConnections.evaluateAll((connections) =>
      connections.map((connection) => window.getComputedStyle(connection).borderBottomStyle)
    )
  ).toEqual(Array(7).fill('dashed'));
  await expect(external.locator('[data-routing-owner="internal"]')).toHaveCount(1);
  await expect(page.locator('[data-portfolio-page="6"] [data-connection-status="planned"]')).toHaveCount(0);
});

test('system and project content stays inside the nested A4 page bounds', async ({ page }) => {
  await page.goto('/portfolio');

  for (const pageNumber of [6, 7, 8, 9, 10, 11]) {
    const measurement = await page.locator(`[data-portfolio-page="${pageNumber}"]`).evaluate((portfolioPage) => {
      const body = portfolioPage.querySelector<HTMLElement>('.page-body');
      const footer = portfolioPage.querySelector<HTMLElement>('.page-footer');
      if (!body || !footer) throw new Error(`Page ${portfolioPage.getAttribute('data-portfolio-page')} is incomplete`);

      const pageBounds = portfolioPage.getBoundingClientRect();
      const bodyBounds = body.getBoundingClientRect();
      const footerBounds = footer.getBoundingClientRect();
      const bodyChildren = Array.from(body.children).map((child) => child.getBoundingClientRect());
      const renderedDescendants = Array.from(body.querySelectorAll<HTMLElement>('*')).filter((element) => {
        const bounds = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return bounds.width > 0 && bounds.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      });
      const tolerance = 1;
      const withinBounds = (bounds: DOMRect, container: DOMRect) =>
        bounds.left >= container.left - tolerance &&
        bounds.right <= container.right + tolerance &&
        bounds.top >= container.top - tolerance &&
        bounds.bottom <= container.bottom + tolerance;
      const descendantsWithinBody = renderedDescendants.every((element) =>
        withinBounds(element.getBoundingClientRect(), bodyBounds)
      );
      const descendantsNotClipped = renderedDescendants.every((element) => {
        const bounds = element.getBoundingClientRect();
        let ancestor = element.parentElement;

        while (ancestor && ancestor !== body) {
          const ancestorStyle = window.getComputedStyle(ancestor);
          const ancestorBounds = ancestor.getBoundingClientRect();
          const clipsX = ['auto', 'clip', 'hidden', 'scroll'].includes(ancestorStyle.overflowX);
          const clipsY = ['auto', 'clip', 'hidden', 'scroll'].includes(ancestorStyle.overflowY);

          if (
            (clipsX &&
              (bounds.left < ancestorBounds.left - tolerance || bounds.right > ancestorBounds.right + tolerance)) ||
            (clipsY &&
              (bounds.top < ancestorBounds.top - tolerance || bounds.bottom > ancestorBounds.bottom + tolerance))
          ) {
            return false;
          }

          ancestor = ancestor.parentElement;
        }

        return true;
      });

      return {
        bodyClientHeight: body.clientHeight,
        bodyScrollHeight: body.scrollHeight,
        bodyClientWidth: body.clientWidth,
        bodyScrollWidth: body.scrollWidth,
        childrenWithinPage: bodyChildren.every(
          (bounds) =>
            bounds.left >= pageBounds.left &&
            bounds.right <= pageBounds.right &&
            bounds.top >= pageBounds.top &&
            bounds.bottom <= footerBounds.top
        ),
        descendantsWithinBody,
        descendantsNotClipped,
      };
    });

    expect(measurement.bodyScrollHeight, `page ${pageNumber} body overflow`).toBeLessThanOrEqual(
      measurement.bodyClientHeight + 1
    );
    expect(measurement.bodyScrollWidth, `page ${pageNumber} horizontal overflow`).toBeLessThanOrEqual(
      measurement.bodyClientWidth + 1
    );
    expect(measurement.childrenWithinPage, `page ${pageNumber} child bounds`).toBe(true);
    expect(measurement.descendantsWithinBody, `page ${pageNumber} nested descendant bounds`).toBe(true);
    expect(measurement.descendantsNotClipped, `page ${pageNumber} nested descendant clipping`).toBe(true);
  }
});
