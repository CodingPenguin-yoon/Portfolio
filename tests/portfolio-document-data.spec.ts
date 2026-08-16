import { expect, test } from '@playwright/test';

import { portfolioDocument } from '../src/data/portfolio-document';

test('portfolio editorial contract', () => {
  expect(portfolioDocument.pages).toHaveLength(13);
  expect(portfolioDocument.pages.map((page) => page.number)).toEqual(
    Array.from({ length: 13 }, (_, index) => index + 1)
  );
  expect(new Set(portfolioDocument.pages.map((page) => page.slug)).size).toBe(13);
  expect(
    portfolioDocument.pages
      .filter((page) => page.status !== undefined)
      .map((page) => ({ slug: page.slug, status: page.status }))
  ).toEqual([
    { slug: 'klepaas', status: 'previous' },
    { slug: 'system-map', status: 'implemented' },
    { slug: 'responsibility', status: 'implemented' },
    { slug: 'gjallar', status: 'implemented' },
    { slug: 'heimdall-promotion', status: 'implemented' },
    { slug: 'heimdall-failure', status: 'implemented' },
    { slug: 'external-exposure', status: 'planned' },
    { slug: 'argus', status: 'implemented' },
  ]);
});

test('team contribution and limitations are explicit', () => {
  const klepaas = portfolioDocument.projects.klepaas;
  expect(klepaas.teamSize).toBe(2);
  expect(klepaas.personalContributions.map((contribution) => contribution.id)).toEqual([
    'gemini-intent-entity-parsing',
    'kubernetes-command-plans',
    'ingress-domain-sync',
    'prometheus-nks-monitoring',
  ]);
  expect(new Set(klepaas.personalContributions.map((contribution) => contribution.id)).size).toBe(4);

  const heimdallFailure = portfolioDocument.pages.find((page) => page.slug === 'heimdall-failure');
  expect(heimdallFailure?.limitations).toEqual([
    'release-image-rollback',
    'database-backup-restore',
    'database-purge',
    'database-credential-rotation',
    'data-rollback',
  ]);

  const gjallar = portfolioDocument.pages.find((page) => page.slug === 'gjallar');
  expect(gjallar?.limitations).toEqual(['vm-full-lifecycle']);

  expect(new Set(portfolioDocument.pages.flatMap((page) => page.limitations))).toEqual(
    new Set([
      'release-image-rollback',
      'database-backup-restore',
      'database-purge',
      'database-credential-rotation',
      'data-rollback',
      'vm-full-lifecycle',
    ])
  );
});
