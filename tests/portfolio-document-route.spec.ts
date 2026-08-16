import { expect, test, type Page } from '@playwright/test';

async function getMutedCopyContrastViolations(page: Page) {
  return page.locator('.portfolio-document').evaluate((documentRoot) => {
    const minimumGray = [75, 85, 99];
    const intentionalColorSelector = [
      '.status-badge',
      '.evidence-status',
      '.connection-status',
      '.architecture-operational-note',
      '.scope-limit .diagram-label',
      '.scope-limit-list li',
      '.resume-project-scope',
      '.resume-contacts a strong',
    ].join(',');
    const linearize = (channel: number) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    const luminance = ([red, green, blue]: number[]) =>
      0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
    const parseRgba = (color: string) => {
      const channels = color.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255];
      return {
        rgb: channels.slice(0, 3),
        alpha: channels[3] ?? 1,
      };
    };
    const compositeAgainstWhite = (rgb: number[], alpha: number) =>
      rgb.map((channel) => channel * alpha + 255 * (1 - alpha));
    const minimumGrayLuminance = luminance(minimumGray);

    return Array.from(documentRoot.querySelectorAll<HTMLElement>('p, li, td, th, figcaption, a, small, span, strong'))
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const bounds = element.getBoundingClientRect();
        return bounds.width > 1 && bounds.height > 1 && style.visibility !== 'hidden';
      })
      .filter((element) => !element.matches(intentionalColorSelector))
      .map((element) => {
        const parsedColor = parseRgba(window.getComputedStyle(element).color);
        let effectiveAlpha = parsedColor.alpha;
        let ancestor: HTMLElement | null = element;

        while (ancestor && ancestor !== documentRoot) {
          effectiveAlpha *= Number.parseFloat(window.getComputedStyle(ancestor).opacity);
          ancestor = ancestor.parentElement;
        }

        return {
          caseId:
            element.getAttribute('data-contrast-case') ??
            `${element.tagName.toLowerCase()}.${typeof element.className === 'string' ? element.className : ''}`,
          compositedChannels: compositeAgainstWhite(parsedColor.rgb, effectiveAlpha),
        };
      })
      .filter(({ compositedChannels }) => luminance(compositedChannels) > minimumGrayLuminance + 0.001)
      .map(({ caseId }) => caseId);
  });
}

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

test('Heimdall promotion exposes Nginx activation operations', async ({ page }) => {
  await page.goto('/portfolio');

  const promotion = page.locator('[data-portfolio-page="9"]');
  await expect(promotion).toHaveAttribute('data-page-status', 'implemented');
  const promotionSteps = promotion.locator('[data-flow-step]');
  await expect(promotionSteps).toHaveCount(7);
  expect(await promotionSteps.evaluateAll((steps) => steps.map((step) => step.getAttribute('data-flow-step')))).toEqual(
    [
      'exact-commit',
      'build',
      'generation-network',
      'candidate-start',
      'service-health',
      'nginx-validate-route-probe',
      'current-metadata-previous-retirement',
    ]
  );

  const activationOperations = promotion.locator('[data-flow-step="nginx-validate-route-probe"] [data-flow-operation]');
  await expect(activationOperations).toHaveCount(4);
  expect(
    await activationOperations.evaluateAll((operations) =>
      operations.map((operation) => operation.getAttribute('data-flow-operation'))
    )
  ).toEqual(['nginx-t', 'atomic-config-replace', 'reload', 'route-probe']);
});

test('Heimdall promotion keeps implementation claims visible', async ({ page }) => {
  await page.goto('/portfolio');

  const promotion = page.locator('[data-portfolio-page="9"]');
  expect(
    await promotion
      .locator('[data-promotion-outcome]')
      .evaluateAll((outcomes) => outcomes.map((outcome) => outcome.getAttribute('data-promotion-outcome')))
  ).toEqual(['execution-success', 'traffic-activation-success']);
  expect(
    await promotion
      .locator('[data-implementation-claim]')
      .evaluateAll((claims) => claims.map((claim) => claim.getAttribute('data-implementation-claim')))
  ).toEqual(['generation-isolation', 'retirement-after-activation-success']);
  expect(
    await promotion
      .locator('[data-database-capability]')
      .evaluateAll((capabilities) =>
        capabilities.map((capability) => capability.getAttribute('data-database-capability'))
      )
  ).toEqual(['project-db-role-provisioning', 'deployment-database-injection']);
});

test('Heimdall failure policy exposes structural limits', async ({ page }) => {
  await page.goto('/portfolio');

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
  await expect(failure.locator('[data-scope-limit="database-credential-rotation"]')).toHaveCount(1);
  await expect(failure.locator('[data-scope-limit="data-rollback"]')).toHaveCount(1);
  await expect(failure.locator('[data-reconciliation-policy="preserve-unknown"]')).toHaveCount(1);
  await expect(failure.locator('[data-storage-boundary="user-confirmed-operational"]')).toHaveCount(1);

  const dataLimits = failure.locator('[data-failure-mode="app-deployment-data"] [data-scope-limit-list]');
  await expect(dataLimits).toHaveCount(1);
  await expect(dataLimits).toHaveJSProperty('tagName', 'UL');
  expect(
    await dataLimits
      .locator(':scope > [data-scope-limit]')
      .evaluateAll((limits) => limits.map((limit) => limit.getAttribute('data-scope-limit')))
  ).toEqual(['database-backup-restore', 'database-purge', 'database-credential-rotation', 'data-rollback']);
  expect(
    await dataLimits.locator(':scope > [data-scope-limit]').evaluateAll((limits) => limits.map((item) => item.tagName))
  ).toEqual(Array(4).fill('LI'));
});

test('external exposure branches at the project gateway', async ({ page }) => {
  await page.goto('/portfolio');

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
    { status: 'planned', from: 'project-gateway', to: 'storage-postgresql' },
  ]);
  await expect(external.locator('[data-routing-owner="internal"]')).toHaveCount(1);
  await expect(page.locator('[data-portfolio-page="6"] [data-connection-status="planned"]')).toHaveCount(0);
});

test('external exposure renders planned edges rather than dashed separators', async ({ page }) => {
  await page.goto('/portfolio');

  const plannedConnections = page.locator('[data-portfolio-page="11"] [data-connection-status="planned"]');
  const plannedEdges = plannedConnections.locator('[data-connection-edge]');
  await expect(plannedEdges).toHaveCount(7);
  expect(
    await plannedEdges.evaluateAll((edges) => edges.map((edge) => window.getComputedStyle(edge).borderTopStyle))
  ).toEqual(Array(7).fill('dashed'));
  expect(
    await plannedConnections.evaluateAll((connections) =>
      connections.map((connection) => window.getComputedStyle(connection).borderBottomStyle)
    )
  ).toEqual(Array(7).fill('solid'));
});

test('Argus stays supporting evidence with one normalized provider flow', async ({ page }) => {
  await page.goto('/portfolio');

  const argus = page.locator('[data-portfolio-page="12"]');
  const stages = argus.locator('[data-argus-stage]');
  const evidence = argus.locator('.evidence-figure');
  const image = evidence.locator('img');
  const caption = evidence.locator('figcaption strong');

  expect(await stages.evaluateAll((items) => items.map((item) => item.getAttribute('data-argus-stage')))).toEqual([
    'provider-adapter',
    'normalized-snapshot',
    'judgement',
    'dashboard',
  ]);
  await expect(evidence).toHaveCount(1);
  await expect(image).toHaveAttribute('src', '/projects/argus.png');
  await expect(image).toHaveAttribute('loading', 'eager');
  expect((await image.getAttribute('alt'))?.trim().length).toBeGreaterThan(20);
  await expect(caption).toBeVisible();
  expect((await caption.textContent())?.trim().length).toBeGreaterThan(20);
});

test('Argus evidence presents a substantial near-source-scale focused detail', async ({ page }) => {
  await page.goto('/portfolio');

  const evidence = page.locator('[data-portfolio-page="12"] .evidence-figure');
  const focus = evidence.locator('[data-evidence-focus="overview-desk"]');
  const image = focus.locator('img');

  await expect(evidence).toHaveAttribute('data-evidence-presentation', 'focused-detail');
  await expect(focus).toHaveCount(1);
  await expect(focus).toHaveAttribute('aria-label', /확대/);
  await expect(image).toHaveAttribute('alt', /확대/);
  await expect(evidence.locator('figcaption strong')).toContainText('확대');

  const measurement = await evidence.evaluate((figure) => {
    const focusViewport = figure.querySelector<HTMLElement>('[data-evidence-focus="overview-desk"]');
    const image = focusViewport?.querySelector<HTMLImageElement>('img');
    if (!focusViewport || !image) throw new Error('Argus focused evidence is missing');

    const figureBounds = figure.getBoundingClientRect();
    const viewportBounds = focusViewport.getBoundingClientRect();
    const imageBounds = image.getBoundingClientRect();
    const viewportStyle = window.getComputedStyle(focusViewport);
    const sourcePixelsPerEffectiveRenderedPixel = image.naturalWidth / imageBounds.width;

    return {
      viewportWidth: viewportBounds.width,
      viewportHeight: viewportBounds.height,
      sourcePixelsPerEffectiveRenderedPixel,
      visibleSourceWidth: viewportBounds.width * sourcePixelsPerEffectiveRenderedPixel,
      visibleSourceHeight: viewportBounds.height * sourcePixelsPerEffectiveRenderedPixel,
      clipsX: ['clip', 'hidden'].includes(viewportStyle.overflowX),
      clipsY: ['clip', 'hidden'].includes(viewportStyle.overflowY),
      viewportContained:
        viewportBounds.left >= figureBounds.left &&
        viewportBounds.right <= figureBounds.right &&
        viewportBounds.top >= figureBounds.top &&
        viewportBounds.bottom <= figureBounds.bottom,
      imageExtendsLeft: imageBounds.left < viewportBounds.left - 100,
      imageExtendsTop: imageBounds.top < viewportBounds.top - 250,
      imageExtendsRight: imageBounds.right > viewportBounds.right + 100,
      imageExtendsBottom: imageBounds.bottom > viewportBounds.bottom + 50,
    };
  });

  expect(measurement.viewportWidth).toBeGreaterThanOrEqual(620);
  expect(measurement.viewportHeight).toBeGreaterThanOrEqual(320);
  expect(measurement.sourcePixelsPerEffectiveRenderedPixel).toBeGreaterThanOrEqual(0.9);
  expect(measurement.sourcePixelsPerEffectiveRenderedPixel).toBeLessThanOrEqual(1.3);
  expect(measurement.visibleSourceWidth).toBeGreaterThanOrEqual(600);
  expect(measurement.visibleSourceHeight).toBeGreaterThanOrEqual(300);
  expect(measurement.clipsX).toBe(true);
  expect(measurement.clipsY).toBe(true);
  expect(measurement.viewportContained).toBe(true);
  expect(measurement.imageExtendsLeft).toBe(true);
  expect(measurement.imageExtendsTop).toBe(true);
  expect(measurement.imageExtendsRight).toBe(true);
  expect(measurement.imageExtendsBottom).toBe(true);
});

test('resume project numbering is visual only inside the semantic ordered list', async ({ page }) => {
  await page.goto('/portfolio');

  const projectNumbers = page.locator('[data-portfolio-page="13"] .resume-project-heading > span');
  await expect(projectNumbers).toHaveCount(4);
  expect(await projectNumbers.evaluateAll((items) => items.map((item) => item.getAttribute('aria-hidden')))).toEqual(
    Array(4).fill('true')
  );
});

test('rendered copy contrast audit catches cool gray and alpha-composited regressions', async ({ page }) => {
  await page.goto('/portfolio');

  await page.locator('[data-portfolio-page="13"] .page-body').evaluate((body) => {
    const fixture = document.createElement('div');
    fixture.setAttribute('data-contrast-regression-fixture', '');
    fixture.innerHTML = `
      <span data-contrast-case="cool-gray" style="display:block;color:rgb(103 118 139)">Cool gray regression</span>
      <span data-contrast-case="alpha-gray" style="display:block;color:rgb(75 85 99 / 55%)">Alpha gray regression</span>
    `;
    body.append(fixture);
  });

  expect(await getMutedCopyContrastViolations(page)).toEqual(['cool-gray', 'alpha-gray']);
});

test('document closes with four scoped project summaries and actionable contact links', async ({ page }) => {
  await page.goto('/portfolio');

  const last = page.locator('[data-portfolio-page="13"]');
  const summaries = last.locator('[data-summary-project]');

  await expect(summaries).toHaveCount(4);
  expect(
    await summaries.evaluateAll((items) =>
      items.map((item) => ({
        project: item.getAttribute('data-summary-project'),
        boundary: item.getAttribute('data-summary-boundary'),
      }))
    )
  ).toEqual([
    { project: 'heimdall', boundary: 'verified-generation-promotion' },
    { project: 'gjallar', boundary: 'approved-native-create' },
    { project: 'klepaas', boundary: 'verified-personal-contribution' },
    { project: 'argus', boundary: 'provider-boundaries' },
  ]);
  await expect(last.locator('[data-tech-category]')).toHaveCount(3);
  await expect(last.locator('[data-resume-fact="education"]')).toHaveCount(1);
  await expect(last.locator('[data-resume-fact="certification"]')).toHaveCount(2);
  await expect(last.locator('a[href="mailto:code.penguin.yoon@gmail.com"]')).toHaveCount(1);
  await expect(last.locator('a[data-contact="github"][href="https://github.com/CodingPenguin-yoon"]')).toHaveCount(1);
  await expect(last.locator('a[data-contact="web"][href="https://yoonman.page"]')).toHaveCount(1);
});

test('document typography and body contrast preserve the editorial floor', async ({ page }) => {
  await page.goto('/portfolio');

  const metrics = await page.locator('.portfolio-document').evaluate((documentRoot) => {
    const pages = Array.from(documentRoot.querySelectorAll<HTMLElement>('[data-portfolio-page]'));
    const bodyText = Array.from(
      documentRoot.querySelectorAll<HTMLElement>('p, li, td, th, figcaption, a, small, span, strong')
    ).filter((element) => {
      const style = window.getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      return bounds.width > 1 && bounds.height > 1 && style.visibility !== 'hidden';
    });
    return {
      titleSizes: pages.map(
        (portfolioPage) =>
          Number.parseFloat(window.getComputedStyle(portfolioPage.querySelector('h2')!).fontSize) * 0.75
      ),
      thesisSizes: pages.map(
        (portfolioPage) =>
          Number.parseFloat(
            window.getComputedStyle(portfolioPage.querySelector<HTMLElement>('.page-thesis')!).fontSize
          ) * 0.75
      ),
      minimumBodySize: Math.min(
        ...bodyText.map((element) => Number.parseFloat(window.getComputedStyle(element).fontSize) * 0.75)
      ),
    };
  });

  expect(metrics.titleSizes.every((size) => size >= 24.9 && size <= 31.1)).toBe(true);
  expect(metrics.thesisSizes.every((size) => size >= 11.9 && size <= 15.1)).toBe(true);
  expect(metrics.minimumBodySize).toBeGreaterThanOrEqual(9.4);
  expect(await getMutedCopyContrastViolations(page)).toEqual([]);
});

test('system and project content stays inside the nested A4 page bounds', async ({ page }) => {
  await page.goto('/portfolio');

  for (const pageNumber of [6, 7, 8, 9, 10, 11, 12, 13]) {
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
        const focusViewport = element.closest<HTMLElement>('[data-evidence-focus]');
        const isClippedFocusContent = focusViewport && focusViewport !== element;
        return (
          !isClippedFocusContent &&
          bounds.width > 0 &&
          bounds.height > 0 &&
          style.display !== 'none' &&
          style.visibility !== 'hidden'
        );
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
        childMetrics: Array.from(body.children).map((child) => {
          const bounds = child.getBoundingClientRect();
          const style = window.getComputedStyle(child);
          return {
            tag: child.tagName,
            className: child.className,
            height: Math.round(bounds.height),
            marginTop: style.marginTop,
            marginBottom: style.marginBottom,
          };
        }),
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

    expect(
      measurement.bodyScrollHeight,
      `page ${pageNumber} body overflow: ${JSON.stringify(measurement.childMetrics)}`
    ).toBeLessThanOrEqual(measurement.bodyClientHeight + 1);
    expect(measurement.bodyScrollWidth, `page ${pageNumber} horizontal overflow`).toBeLessThanOrEqual(
      measurement.bodyClientWidth + 1
    );
    expect(measurement.childrenWithinPage, `page ${pageNumber} child bounds`).toBe(true);
    expect(measurement.descendantsWithinBody, `page ${pageNumber} nested descendant bounds`).toBe(true);
    expect(measurement.descendantsNotClipped, `page ${pageNumber} nested descendant clipping`).toBe(true);
  }
});
