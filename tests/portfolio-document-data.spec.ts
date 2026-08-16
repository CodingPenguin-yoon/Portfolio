import { expect, test } from '@playwright/test';

import { portfolioDocument } from '../src/data/portfolio-document';

test('portfolio editorial contract', () => {
  expect(portfolioDocument.pages).toHaveLength(13);
  expect(portfolioDocument.pages.map((page) => page.number)).toEqual(
    Array.from({ length: 13 }, (_, index) => index + 1)
  );
  expect(new Set(portfolioDocument.pages.map((page) => page.slug)).size).toBe(13);
  expect(portfolioDocument.pages.filter((page) => page.status === 'planned')).toHaveLength(1);
  expect(portfolioDocument.pages.find((page) => page.status === 'planned')?.slug).toBe('external-exposure');
});

test('team contribution and limitations are explicit', () => {
  const klepaas = portfolioDocument.projects.klepaas;
  expect(klepaas.teamSize).toBe(2);
  expect(klepaas.personalContributions).toHaveLength(4);

  const heimdallFailure = portfolioDocument.pages.find((page) => page.slug === 'heimdall-failure');
  expect(heimdallFailure?.limitations).toEqual(
    expect.arrayContaining(['release-image-rollback', 'database-backup-restore'])
  );

  const gjallar = portfolioDocument.pages.find((page) => page.slug === 'gjallar');
  expect(gjallar?.limitations).toContain('vm-full-lifecycle');
});
