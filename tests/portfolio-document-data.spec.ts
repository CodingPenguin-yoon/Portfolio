import { expect, test } from '@playwright/test';

import { portfolioDocument } from '../src/data/portfolio-document';

test('portfolio editorial contract is the approved fourteen-slide story', () => {
  expect(portfolioDocument.pages.map(({ number, slug }) => ({ number, slug }))).toEqual([
    { number: 1, slug: 'cover' },
    { number: 2, slug: 'origin' },
    { number: 3, slug: 'automation-lens' },
    { number: 4, slug: 'first-architecture' },
    { number: 5, slug: 'friction' },
    { number: 6, slug: 'decision' },
    { number: 7, slug: 'current-system' },
    { number: 8, slug: 'gjallar-decision' },
    { number: 9, slug: 'gjallar-evidence' },
    { number: 10, slug: 'heimdall-promotion' },
    { number: 11, slug: 'failure-and-data' },
    { number: 12, slug: 'heimdall-evidence' },
    { number: 13, slug: 'transfer' },
    { number: 14, slug: 'closing' },
  ]);

  expect(portfolioDocument.pages.map(({ title }) => title)).toEqual([
    '반복 작업을 자동화하는 데서 시작해, 시스템의 책임과 실패 경계를 설계했습니다.',
    '새 서비스를 올릴 때마다, 같은 실행 환경을 다시 만들었습니다.',
    '자연어 요청을 바로 실행하지 않고, 실행 가능한 계획으로 바꿨습니다.',
    '처음에는 VM 생성부터 배포까지 하나의 시스템이 맡아야 효율적이라고 생각했습니다.',
    '자동화가 늘수록, 한 번의 변경이 더 많은 책임을 건드렸습니다.',
    '기능을 더 붙이는 대신, 변경 이유가 다른 책임을 두 시스템으로 나눴습니다.',
    '실행 기반, 배포 세대, 사용자 데이터의 수명주기를 서로 다르게 다룹니다.',
    '실제 상태를 먼저 확인하고, 승인된 계획만 Proxmox에 반영합니다.',
    '요청 전 상태와 실행 후 결과를 같은 운영 화면에서 확인합니다.',
    '기존 서비스를 먼저 멈추는 대신, 후보 세대를 분리해 검증합니다.',
    '실패 원인을 넓게 지우지 않고, 확인한 후보만 정리합니다.',
    '배포 요청부터 세대와 현재 상태까지 하나의 실행 기록으로 추적합니다.',
    '도구는 달라도, 입력과 실행 사이에 경계를 두는 판단은 반복됐습니다.',
    '운영 문제를 발견하고, 자동화한 뒤, 실패 경계를 다시 설계합니다.',
  ]);
});

test('team ownership and evidence boundaries remain explicit', () => {
  const klepaas = portfolioDocument.projects.klepaas;
  expect(klepaas.teamSize).toBe(2);
  expect(klepaas.period).toBe('2025.09 - 2025.12');
  expect(klepaas.personalDecision.evidence.status).toBe('verified');
  expect(klepaas.personalDecision.evidence.source).toContain('backend-hybrid/app/services/commands.py:105-219');
  expect(klepaas.personalContributions.map(({ id }) => id)).toEqual([
    'gemini-intent-entity-parsing',
    'kubernetes-command-plans',
    'ingress-domain-sync',
    'prometheus-nks-monitoring',
  ]);

  expect(portfolioDocument.projects.gjallar.scopeLimit).toContain('Native Create');
  expect(portfolioDocument.projects.gjallar.scopeLimit).toContain('limited gated Start');
  const storage = portfolioDocument.projects.currentSystem.zones.find(({ id }) => id === 'storage');
  expect(storage && 'operationalNote' in storage ? storage.operationalNote : undefined).toContain('Operational');
  expect(portfolioDocument.pages.find(({ slug }) => slug === 'automation-lens')?.status).toBe('previous');
});

test('failure limitations name only the approved non-implemented capabilities', () => {
  const failure = portfolioDocument.pages.find(({ slug }) => slug === 'failure-and-data');
  expect(failure?.limitations).toEqual([
    'release-image-rollback',
    'database-backup-restore',
    'database-purge',
    'database-credential-rotation',
    'data-rollback',
  ]);

  expect(portfolioDocument.pages.find(({ slug }) => slug === 'gjallar-decision')?.limitations).toEqual([
    'vm-full-lifecycle',
  ]);
});
