import { expect, test } from '@playwright/test';

import { portfolioDocument } from '../src/data/portfolio-document';

test('portfolio editorial contract is the approved eleven-slide story', () => {
  expect(portfolioDocument.pages.map(({ number, slug }) => ({ number, slug }))).toEqual([
    { number: 1, slug: 'cover' },
    { number: 2, slug: 'problem' },
    { number: 3, slug: 'evolution' },
    { number: 4, slug: 'current-system' },
    { number: 5, slug: 'responsibility-split' },
    { number: 6, slug: 'gjallar' },
    { number: 7, slug: 'heimdall-promotion' },
    { number: 8, slug: 'failure-boundary' },
    { number: 9, slug: 'planned-exposure' },
    { number: 10, slug: 'origin-transfer' },
    { number: 11, slug: 'resume-contact' },
  ]);

  expect(portfolioDocument.pages.map(({ title }) => title)).toEqual([
    '반복되는 운영 문제를 책임과 실패 경계로 나눕니다.',
    '새 서비스를 올릴 때마다 같은 환경을 다시 만들었습니다.',
    '자동화의 범위가 커지자, 변경 이유가 다른 책임을 분리했습니다.',
    '실행 기반, 배포 세대, 사용자 데이터의 수명주기를 분리했습니다.',
    '같은 홈랩 안에서도 실패 경계는 달라야 했습니다.',
    '실제 상태를 확인한 뒤, 승인된 요청만 Proxmox에 반영합니다.',
    '검증된 세대만 Current로 승격합니다.',
    '실패할수록 자동 삭제보다 보존 범위를 좁혔습니다.',
    '외부 Edge는 고정하고 동적 라우팅은 내부에서 처리합니다.',
    '입력을 정규화한 뒤 실행하는 구조를 다른 문제에도 적용했습니다.',
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
  expect(portfolioDocument.pages.find(({ slug }) => slug === 'planned-exposure')?.status).toBe('planned');
});

test('failure limitations name only the approved non-implemented capabilities', () => {
  const failure = portfolioDocument.pages.find(({ slug }) => slug === 'failure-boundary');
  expect(failure?.limitations).toEqual([
    'release-image-rollback',
    'database-backup-restore',
    'database-purge',
    'database-credential-rotation',
    'data-rollback',
  ]);

  expect(portfolioDocument.pages.find(({ slug }) => slug === 'gjallar')?.limitations).toEqual(['vm-full-lifecycle']);
});
