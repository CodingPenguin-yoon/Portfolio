# 채용 포트폴리오 문서 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 홈페이지와 분리된 `/portfolio` 경로에 흰색 A4 세로형 13페이지 채용 포트폴리오를 만들고, 동일한 레이아웃을 재현 가능한 PDF로 출력한다.

**Architecture:** 검증된 원고와 상태를 단일 TypeScript 데이터 모듈에 두고 Astro 컴포넌트가 이를 문서 페이지로 렌더링한다. 화면에서는 연속된 문서 미리보기로, 인쇄에서는 각 `section`이 정확히 A4 한 장이 되도록 CSS를 분리한다. Playwright는 데이터 계약·렌더링·오버플로를 검증하고 Chromium PDF를 생성하며, Poppler 렌더링으로 최종 시각 품질을 확인한다.

**Tech Stack:** Astro 5, TypeScript, CSS, `@playwright/test`, Chromium PDF, Poppler

## Global Constraints

- 기존 홈페이지와 `/resume`의 디자인은 이번 범위에서 변경하지 않는다.
- 최종 문서는 13페이지이며, 한 페이지에는 하나의 주장만 둔다.
- 본문은 흰색, 텍스트는 검정·회색 계열로 제한하고 상태 표기에만 청록색·남색·회색을 사용한다.
- `Implemented`, `Previous`, `Planned`를 화면과 PDF에 동일하게 노출한다.
- `이미지 롤백 구현`, `VM 수명주기 전체 자동화`, `DB purge 구현`처럼 근거보다 넓은 문구를 금지한다.
- 내부 IP, 토큰, 계정, 인증서, 정확한 방화벽 규칙은 포함하지 않는다.
- Heimdall은 현재 `heimdall_final` 저장소를 기준으로 쓰고, `02_Heimdall`은 이전 MVP의 한계만 설명할 때 사용한다.
- K-Le-PaaS의 팀 성과와 조윤호의 개인 기여를 시각적으로 분리한다.
- 기존 `public/projects/heimdall.png`는 과거 rollback UI가 보여 현재 구현과 충돌하므로 사용하지 않는다. Heimdall은 구조도와 상태 흐름으로 증명한다.
- 생성 중간물은 `/private/tmp/portfolio-document-qa`에 두고, 사용자 소유의 기존 `.artifacts/`는 건드리지 않는다.
- 사용자 요청 전에는 commit, push, 배포를 수행하지 않는다.
- 기존 tracked 홈페이지 파일의 Prettier 실패는 기준선 문제로 보존한다. Astro·ESLint는 전체 실행하고, Prettier는 이번 계획에서 추가·수정한 파일만 검증한다.

---

## Task 1: 테스트·PDF 출력 도구 기반 만들기

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `playwright.config.ts`
- Create: `tests/portfolio-harness.spec.ts`

- [ ] **Step 1: Playwright와 실행 스크립트 추가**

이 단계는 이후 기능의 RED/GREEN을 실행하기 위한 테스트 하네스 구성이다. 제품 코드는 변경하지 않는다.

`package.json`에 아래 스크립트와 개발 의존성을 추가한다.

```json
{
  "scripts": {
    "test:portfolio": "playwright test",
    "portfolio:pdf": "node scripts/export-portfolio-pdf.mjs"
  },
  "devDependencies": {
    "@playwright/test": "^1.55.0"
  }
}
```

`playwright.config.ts`는 Astro preview를 사용한다.

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:4322' },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4322',
    url: 'http://127.0.0.1:4322',
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 2: 의존성과 Chromium 설치**

Run: `npm install`

Run: `npx playwright install chromium`

- [ ] **Step 3: 실제 Astro preview를 여는 하네스 검증 테스트 작성**

```ts
import { expect, test } from '@playwright/test';

test('portfolio harness serves the existing static site', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.ok()).toBe(true);
  await expect(page.locator('body')).toBeVisible();
});
```

- [ ] **Step 4: 하네스 테스트와 기존 빌드 통과 확인**

Run: `npm run test:portfolio -- tests/portfolio-harness.spec.ts`

Expected: 1 test passed. `npm run build` also succeeds through `webServer.command`.

---

## Task 2: 검증된 원고를 타입 안전한 데이터 계약으로 고정하기

**Files:**

- Create: `src/data/portfolio-document.ts`
- Create: `tests/portfolio-document-data.spec.ts`

- [ ] **Step 1: 페이지 수·순서·상태·금지 문구 테스트 작성**

```ts
import { expect, test } from '@playwright/test';
import { portfolioDocument } from '../src/data/portfolio-document';

test('portfolio editorial contract', () => {
  expect(portfolioDocument.pages).toHaveLength(13);
  expect(portfolioDocument.pages.map((page) => page.number)).toEqual(
    Array.from({ length: 13 }, (_, index) => index + 1)
  );
  expect(new Set(portfolioDocument.pages.map((page) => page.slug)).size).toBe(13);
  expect(portfolioDocument.pages.filter((page) => page.status === 'planned')).toHaveLength(1);

  const copy = JSON.stringify(portfolioDocument);
  expect(copy).not.toContain('이미지 롤백 구현');
  expect(copy).not.toContain('VM 수명주기 전체');
  expect(copy).not.toContain('DB purge 구현');
});
```

- [ ] **Step 2: 테스트를 실행해 모듈 부재로 실패하는지 확인**

Run: `npm run test:portfolio -- tests/portfolio-document-data.spec.ts`

Expected: `src/data/portfolio-document.ts`를 찾지 못해 실패한다.

- [ ] **Step 3: 문서 데이터 타입과 13페이지 원고 구현**

```ts
export type DocumentStatus = 'implemented' | 'previous' | 'planned';

export interface PortfolioPageData {
  number: number;
  slug: string;
  eyebrow: string;
  title: string;
  thesis: string;
  status?: DocumentStatus;
  statusNote?: string;
}

export const portfolioDocument = {
  person: {
    name: '조윤호',
    role: 'Platform Engineer',
    positioning:
      '반복되는 인프라 운영과 배포 문제를 자동화하고, 책임 경계와 실패 복구 구조를 설계하는 신입 플랫폼 엔지니어',
  },
  pages: [
    { number: 1, slug: 'cover', eyebrow: 'PORTFOLIO', title: '운영의 반복을 구조로 바꿉니다.', thesis: '반복 작업을 자동화하는 것에서 시작해 시스템의 책임 경계와 실패 복구 구조까지 설계했습니다.' },
    { number: 2, slug: 'profile', eyebrow: 'PROFILE', title: '플랫폼 운영이라는 하나의 문제를 다뤘습니다.', thesis: '배포 자동화, VM 생성, 실행 상태 추적을 서로 연결된 운영 문제로 풀었습니다.' },
    { number: 3, slug: 'origin', eyebrow: 'ORIGIN', title: '반복 설정이 자동화의 출발점이었습니다.', thesis: 'VM 생성부터 IP·네트워크·Docker·배포까지 매번 반복되는 작업과 설정 편차를 줄이고 싶었습니다.' },
    { number: 4, slug: 'evolution', eyebrow: 'EVOLUTION', title: '큰 자동화 하나를 두 개의 책임으로 나눴습니다.', thesis: 'VM 생성과 애플리케이션 배포는 변경 주기와 실패 영향이 달랐습니다.' },
    { number: 5, slug: 'klepaas', eyebrow: 'K-LE-PAAS', title: '자동화는 실행보다 입력과 피드백까지 포함해야 했습니다.', thesis: '자연어 요청을 Kubernetes 명령으로 바꾸고 결과를 되돌려주는 흐름에서 플랫폼 자동화의 기본 구조를 경험했습니다.', status: 'previous' },
    { number: 6, slug: 'system-map', eyebrow: 'CURRENT SYSTEM', title: '실행 기반, 배포, 데이터의 수명주기를 분리했습니다.', thesis: 'Proxmox 위에서 Gjallar는 VM을, Heimdall은 배포 세대를, Storage VM은 사용자 데이터를 책임집니다.', status: 'implemented' },
    { number: 7, slug: 'responsibility', eyebrow: 'DESIGN DECISION', title: '같은 홈랩 안에서도 실패 경계는 달라야 했습니다.', thesis: '인프라 생성 실패와 후보 배포 실패가 서로의 상태를 오염시키지 않도록 소유권을 나눴습니다.', status: 'implemented' },
    { number: 8, slug: 'gjallar', eyebrow: 'GJALLAR', title: 'Proxmox의 실제 상태를 기준으로 VM 생성을 반복 가능하게 만들었습니다.', thesis: '정책을 담은 VM Profile과 실제 Template Inventory를 분리하고, 승인된 요청만 native API로 실행합니다.', status: 'implemented' },
    { number: 9, slug: 'heimdall-promotion', eyebrow: 'HEIMDALL', title: '검증된 세대만 Current로 승격합니다.', thesis: '고정된 commit으로 후보 세대를 만든 뒤 health check와 실제 route probe를 모두 통과해야 트래픽을 전환합니다.', status: 'implemented' },
    { number: 10, slug: 'heimdall-failure', eyebrow: 'FAILURE DESIGN', title: '실패할수록 보존 범위를 좁혔습니다.', thesis: '활성화 실패에는 직전 정상 경로를 복원하고, 상태가 불확실할 때는 자동 삭제보다 보존을 선택합니다.', status: 'implemented' },
    { number: 11, slug: 'external-exposure', eyebrow: 'PLANNED ARCHITECTURE', title: '외부 Edge는 고정하고 동적 라우팅은 내부에서 처리합니다.', thesis: 'Control Web과 배포 도메인을 분리하고 OCI Edge에서 홈랩 내부 Ingress까지 하나의 중계 경계를 둡니다.', status: 'planned' },
    { number: 12, slug: 'argus', eyebrow: 'ARGUS', title: '다른 문제에도 입력 경계를 분리하는 원칙을 적용했습니다.', thesis: '서로 다른 데이터 공급자를 독립적으로 수집하고 정규화해 비교 가능한 판단 흐름으로 만들었습니다.', status: 'implemented' },
    { number: 13, slug: 'resume-contact', eyebrow: 'RESUME & CONTACT', title: '문제를 발견하고, 자동화하고, 실패 경계를 다시 설계합니다.', thesis: '플랫폼 엔지니어로서 반복 가능한 운영 구조를 만들겠습니다.' },
  ] satisfies PortfolioPageData[],
} as const;
```

실제 데이터에는 콘텐츠 아키텍처와 근거표를 바탕으로 페이지별 `facts`, `decisions`, `flows`, `evidence`, `limitations`를 추가한다. 모든 문장은 `/docs/superpowers/specs/2026-08-17-portfolio-evidence-matrix.md`의 표현 범위 안에 둔다.

- [ ] **Step 4: 개인 기여와 한계 문구를 추가 검증**

```ts
test('team contribution and limitations are explicit', () => {
  const copy = JSON.stringify(portfolioDocument);
  expect(copy).toContain('2인 팀');
  expect(copy).toContain('개인 기여');
  expect(copy).toContain('release rollback은 비범위');
  expect(copy).toContain('DB backup·restore는 비범위');
});
```

- [ ] **Step 5: 데이터 테스트 통과 확인**

Run: `npm run test:portfolio -- tests/portfolio-document-data.spec.ts`

Expected: 2 tests passed.

---

## Task 3: A4 문서 셸과 재사용 가능한 시각 컴포넌트 만들기

**Files:**

- Create: `src/components/portfolio-document/PortfolioDocument.astro`
- Create: `src/components/portfolio-document/PortfolioPage.astro`
- Create: `src/components/portfolio-document/StatusBadge.astro`
- Create: `src/components/portfolio-document/FlowDiagram.astro`
- Create: `src/components/portfolio-document/ArchitectureMap.astro`
- Create: `src/components/portfolio-document/EvidenceFigure.astro`
- Create: `src/assets/styles/portfolio-document.css`
- Create: `src/pages/portfolio/index.astro`
- Create: `tests/portfolio-document-route.spec.ts`

- [ ] **Step 1: 문서 의미 구조와 기본 접근성 테스트 확장**

```ts
test('every page has one visible h2 and a page label', async ({ page }) => {
  await page.goto('/portfolio');
  const pages = page.locator('section[data-portfolio-page]');
  await expect(pages).toHaveCount(13);

  for (let index = 0; index < 13; index += 1) {
    await expect(pages.nth(index).locator('h2')).toHaveCount(1);
    await expect(pages.nth(index).locator('[data-page-number]')).toContainText(
      String(index + 1).padStart(2, '0')
    );
  }
});
```

- [ ] **Step 2: 테스트를 실행해 렌더링 부재 확인**

Run: `npm run test:portfolio -- tests/portfolio-document-route.spec.ts`

Expected: `/portfolio` 404로 실패한다.

- [ ] **Step 3: 페이지 셸과 상태 배지 구현**

`PortfolioPage.astro`의 핵심 계약은 아래와 같다.

```astro
<section
  class="portfolio-page"
  data-portfolio-page={number}
  data-page-status={status}
  aria-labelledby={`portfolio-page-${number}-title`}
>
  <header class="page-header">
    <p class="page-eyebrow">{eyebrow}</p>
    {status && <StatusBadge status={status} note={statusNote} />}
  </header>
  <h2 id={`portfolio-page-${number}-title`}>{title}</h2>
  <p class="page-thesis">{thesis}</p>
  <div class="page-body"><slot /></div>
  <footer><span>YUNHO CHO · PLATFORM ENGINEER</span><span data-page-number>{String(number).padStart(2, '0')} / 13</span></footer>
</section>
```

- [ ] **Step 4: A4 화면·인쇄 CSS 구현**

```css
@page { size: A4 portrait; margin: 0; }

.portfolio-page {
  box-sizing: border-box;
  width: 210mm;
  height: 297mm;
  padding: 18mm 18mm 14mm;
  break-after: page;
  overflow: hidden;
  background: #fff;
  color: #111827;
}

@media screen {
  body { margin: 0; background: #e8eaed; }
  .portfolio-page { margin: 24px auto; box-shadow: 0 10px 32px rgb(15 23 42 / 10%); }
}

@media print {
  body { background: #fff; }
  .portfolio-page { margin: 0; box-shadow: none; }
}
```

`IBM Plex Sans KR`을 본문에 사용하고, 영문 눈썹·페이지 번호에만 `Inter` 또는 `IBM Plex Mono`를 사용한다. 본문은 9.5pt 아래로 내리지 않는다.

- [ ] **Step 5: 순수 HTML/CSS/SVG 다이어그램 컴포넌트 구현**

`FlowDiagram`은 3~7개의 순차 단계, `ArchitectureMap`은 책임 영역과 연결 상태, `EvidenceFigure`는 스크린샷·캡션·근거 상태를 표현한다. 기술 로고 나열이나 장식용 아이콘은 넣지 않는다.

- [ ] **Step 6: 경로와 기본 셸 테스트 통과 확인**

Run: `npm run test:portfolio -- tests/portfolio-document-route.spec.ts`

Expected: 13개 section, 페이지별 h2 1개, 01~13 페이지 라벨이 통과한다.

---

## Task 4: 01–05 페이지로 문제의 시작과 설계 진화 구현하기

**Files:**

- Modify: `src/components/portfolio-document/PortfolioDocument.astro`
- Modify: `src/data/portfolio-document.ts`
- Modify: `tests/portfolio-document-route.spec.ts`

- [ ] **Step 1: 초반 5페이지 핵심 서사 테스트 작성**

```ts
test('opening story moves from repetition to responsibility split', async ({ page }) => {
  await page.goto('/portfolio');
  const copy = await page.locator('main').innerText();
  expect(copy).toContain('VM 생성');
  expect(copy).toContain('IP·네트워크');
  expect(copy).toContain('Terraform');
  expect(copy).toContain('Ansible');
  expect(copy).toContain('Gjallar');
  expect(copy).toContain('Heimdall');
  expect(copy).toContain('2인 팀');
  expect(copy).toContain('개인 기여');
});
```

- [ ] **Step 2: 테스트가 구체 콘텐츠 부재로 실패하는지 확인**

Run: `npm run test:portfolio -- tests/portfolio-document-route.spec.ts -g "opening story"`

Expected: 필요한 서사 일부가 없어 실패한다.

- [ ] **Step 3: 01 Cover와 02 Profile 구현**

- Cover: 이름, 지원 직무, 포지셔닝, 이메일·GitHub·웹 주소만 둔다.
- Profile: `배포 자동화`, `VM 생성 자동화`, `상태와 실패 추적` 3축과 대표 프로젝트를 한 화면에 연결한다.
- 장식용 슬로건, 영웅 이미지, 기술 로고 벽을 사용하지 않는다.

- [ ] **Step 4: 03 Origin 구현**

`VM 생성 → IP·네트워크 → Docker 설치 → 애플리케이션 배포` 흐름 아래 반복 비용을 `수동 입력`, `설정 편차`, `복구 어려움`으로 연결한다. 욕설이나 감정 표현 대신 반복되는 손작업을 구체적으로 보여준다.

- [ ] **Step 5: 04 Evolution 구현**

한 줄 연대기만 사용한다.

```text
K-Le-PaaS
  → 초기 Heimdall: Terraform + Ansible + Deploy
  → 범위·의존성 증가
  → Gjallar: VM Create / Heimdall: Application Deploy
```

`Previous` 라벨은 초기 Heimdall에만 붙이고, 분리의 이유를 `변경 주기`와 `실패 영향` 두 문장으로 마무리한다.

- [ ] **Step 6: 05 K-Le-PaaS 구현**

- 팀 성과: 자연어 → intent/entities → CommandPlan → Kubernetes/NCP 작업 → 결과 이력
- 개인 기여: Gemini 해석, Kubernetes 상태 조회·재시작 명령, 도메인 변경·URL 동기화, Prometheus NKS 모니터링
- `public/projects/klepaas-dashboard.png`를 제품 근거로 사용하되 개인 기여 텍스트와 혼합하지 않는다.
- “여기서 얻은 학습”은 `입력 정규화`, `고위험 작업 확인`, `실행 피드백` 3개로 제한한다.

- [ ] **Step 7: 초반 서사 테스트 통과 확인**

Run: `npm run test:portfolio -- tests/portfolio-document-route.spec.ts -g "opening story"`

Expected: 1 test passed.

---

## Task 5: 06–08 페이지로 현재 책임 지도와 Gjallar 구현하기

**Files:**

- Modify: `src/components/portfolio-document/PortfolioDocument.astro`
- Modify: `src/data/portfolio-document.ts`
- Modify: `tests/portfolio-document-route.spec.ts`

- [ ] **Step 1: 현재 구조와 Gjallar 범위 테스트 작성**

```ts
test('system map separates lifecycles and Gjallar scope', async ({ page }) => {
  await page.goto('/portfolio');
  const system = page.locator('[data-portfolio-page="6"]');
  await expect(system).toContainText('Runtime VM');
  await expect(system).toContainText('Storage VM');

  const gjallar = page.locator('[data-portfolio-page="8"]');
  await expect(gjallar).toContainText('Proxmox inventory');
  await expect(gjallar).toContainText('VM Profile');
  await expect(gjallar).toContainText('preflight');
  await expect(gjallar).toContainText('approval');
  await expect(gjallar).not.toContainText('모든 VM 수명주기');
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm run test:portfolio -- tests/portfolio-document-route.spec.ts -g "system map"`

Expected: 세부 노드가 없어 실패한다.

- [ ] **Step 3: 06 Current System 구현**

아래 책임 지도를 계층형 SVG 또는 CSS grid로 구현한다.

```text
Proxmox
├─ Gjallar Control: VM Profile / Preflight / Native Create
├─ Runtime VM: Heimdall Worker / Project Gateway / App Generations
└─ Storage VM: PostgreSQL / Project DB & Role
```

코드로 확인된 현재 경로는 실선, 사용자가 확인한 별도 Storage VM 운영 구조는 `Operational` 보조 라벨, 11페이지의 외부 공개 계획은 이 페이지에 섞지 않는다.

- [ ] **Step 4: 07 Responsibility Split 구현**

Gjallar와 Heimdall을 `책임`, `변경 이유`, `실행 대상`, `실패 영향`, `현재 범위` 5개 행으로 비교한다. Before/After는 `모든 자동화가 초기 Heimdall에 집중`에서 `VM Create와 Deployment Generation 분리`로 바뀐 점만 보여준다.

- [ ] **Step 5: 08 Gjallar 구현**

- Source of Truth: Proxmox actual inventory
- Policy: DB-backed VM Profile
- Execution: draft → preflight → plan → approval → preview → acknowledgement → native Proxmox API
- Default: stopped create
- Optional: boot + guest-agent IP + cloud-init evidence
- Limit: 전체 lifecycle이나 destructive operation이 아닌 Native Create와 제한된 gated Start

`public/projects/gjallar.png`를 사용하고, 캡션에는 화면이 증명하는 범위만 적는다.

- [ ] **Step 6: Gjallar 범위 테스트 통과 확인**

Run: `npm run test:portfolio -- tests/portfolio-document-route.spec.ts -g "system map"`

Expected: 1 test passed.

---

## Task 6: 09–11 페이지로 Heimdall 실패 대응과 외부 공개 계획 구현하기

**Files:**

- Modify: `src/components/portfolio-document/PortfolioDocument.astro`
- Modify: `src/data/portfolio-document.ts`
- Modify: `tests/portfolio-document-route.spec.ts`

- [ ] **Step 1: 구현과 계획의 상태 경계 테스트 작성**

```ts
test('Heimdall implementation and external plan are visibly separated', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.locator('[data-portfolio-page="9"]')).toHaveAttribute('data-page-status', 'implemented');
  await expect(page.locator('[data-portfolio-page="10"]')).toHaveAttribute('data-page-status', 'implemented');
  await expect(page.locator('[data-portfolio-page="11"]')).toHaveAttribute('data-page-status', 'planned');

  const failurePage = page.locator('[data-portfolio-page="10"]');
  await expect(failurePage).toContainText('last-known-good');
  await expect(failurePage).toContainText('reconciliation');
  await expect(failurePage).toContainText('release rollback은 비범위');
  await expect(failurePage).toContainText('DB backup·restore는 비범위');
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm run test:portfolio -- tests/portfolio-document-route.spec.ts -g "Heimdall implementation"`

Expected: 상태 또는 한계 문구가 없어 실패한다.

- [ ] **Step 3: 09 Heimdall Promotion 구현**

흐름을 아래 7단계로 고정한다.

```text
Exact Commit
→ Build
→ Generation Network
→ Candidate Start
→ Service Health
→ Nginx Validate + Route Probe
→ Current Metadata + Previous Retirement
```

핵심 판단은 `실행 성공`과 `운영 트래픽 승격 성공`을 분리한 것이다. 기존 Heimdall 스크린샷은 사용하지 않고 SVG 상태 흐름과 구현 근거 요약을 사용한다.

- [ ] **Step 4: 10 Heimdall Failure & Data 구현**

실패 유형과 보존 대상을 4열 표로 표현한다.

| 실패 | 처리 | 유지 | 한계 |
| --- | --- | --- | --- |
| Build/Health | 후보만 정리 | Current | image 재사용 없음 |
| Nginx activation | last-known-good 복원 | 이전 route·generation | release rollback 아님 |
| Worker interruption | DB·marker·label reconcile | 불확실 candidate | 확정 불가 시 수동 판단 |
| App deployment | generation과 DB 분리 | Storage VM 데이터 | backup·data rollback 비범위 |

Managed PostgreSQL은 `프로젝트별 DB·role provisioning과 배포 연동`으로만 표현한다.

- [ ] **Step 5: 11 External Exposure 구현**

한 페이지 전체에 `PLANNED` 워터마크가 아니라, 제목 옆 상태 배지와 점선 연결을 사용한다.

```text
control.example.com ─┐
*.deploy.example.com ├→ OCI Edge Nginx → WireGuard
                     └→ Internal Ingress Nginx → Project Gateway
                                                   ├→ Runtime Application
                                                   └→ Storage VM PostgreSQL
```

OCI는 TLS 종료·Host 전달만 맡고 배포별 동적 route는 내부 Ingress/Gateway가 처리한다. DNS 두 영역의 역할을 분리하고 실제 도메인·IP는 넣지 않는다.

- [ ] **Step 6: 구현·계획 경계 테스트 통과 확인**

Run: `npm run test:portfolio -- tests/portfolio-document-route.spec.ts -g "Heimdall implementation"`

Expected: 1 test passed.

---

## Task 7: 12–13 페이지와 문서 전체 편집 완성하기

**Files:**

- Modify: `src/components/portfolio-document/PortfolioDocument.astro`
- Modify: `src/data/portfolio-document.ts`
- Modify: `src/assets/styles/portfolio-document.css`
- Modify: `tests/portfolio-document-route.spec.ts`

- [ ] **Step 1: 종료 페이지와 전체 카피 테스트 작성**

```ts
test('document closes with evidence and contact, not a thank-you slide', async ({ page }) => {
  await page.goto('/portfolio');
  const last = page.locator('[data-portfolio-page="13"]');
  await expect(last).toContainText('Platform Engineer');
  await expect(last).toContainText('GitHub');
  await expect(last).toContainText('Email');
  await expect(last).not.toContainText('감사합니다');

  const body = await page.locator('body').innerText();
  expect(body).not.toMatch(/생태계에 끼쳐도 될까|완벽한|혁신적인/);
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm run test:portfolio -- tests/portfolio-document-route.spec.ts -g "document closes"`

Expected: 연락처나 금지 표현 계약이 충족되지 않아 실패한다.

- [ ] **Step 3: 12 Argus 구현**

`Provider Adapter → Normalized Snapshot → Judgement → Dashboard` 한 줄 흐름과 `public/projects/argus.png`만 사용한다. 플랫폼 주 서사를 방해하지 않도록 상세 기능 목록과 시장 분석 설명은 제외한다.

- [ ] **Step 4: 13 Resume & Contact 구현**

- Heimdall: 검증 후 승격하는 generation deployment
- Gjallar: Proxmox inventory 기반의 승인된 native VM create
- K-Le-PaaS: 자연어 요청을 Kubernetes 작업과 피드백으로 연결
- Argus: 공급자 경계를 분리한 수집·판단 흐름

교육·자격·기술·연락처를 이력서형 2열 그리드에 배치하고 `감사합니다` 페이지는 만들지 않는다. 기존 `src/data/resume.ts`에서 가져오는 항목은 실제 값만 재사용하며 과장된 프로젝트 문구는 복사하지 않는다.

- [ ] **Step 5: 전체 문서의 활자·간격·표 스타일 정리**

- 제목 25–31pt, thesis 12–15pt, 본문 9.5–11pt
- 페이지 상단 eyebrow와 상태 배지, 하단 문서명과 페이지 번호 고정
- 카드 대신 구분선, 표, 단계 흐름을 우선 사용
- 한 페이지 안에 3개보다 많은 독립 패널을 만들지 않는다.
- 색 대비는 WCAG AA 수준을 만족시키고 회색 본문을 `#4b5563`보다 흐리게 하지 않는다.

- [ ] **Step 6: 종료·카피 테스트 통과 확인**

Run: `npm run test:portfolio -- tests/portfolio-document-route.spec.ts -g "document closes"`

Expected: 1 test passed.

---

## Task 8: 오버플로 검증과 재현 가능한 PDF 출력 만들기

**Files:**

- Create: `scripts/export-portfolio-pdf.mjs`
- Modify: `tests/portfolio-document-route.spec.ts`
- Create: `public/portfolio/yunho-cho-portfolio.pdf`
- Modify: `README.md`

- [ ] **Step 1: A4 크기와 콘텐츠 오버플로 실패 테스트 작성**

```ts
test('every print page fits one A4 sheet without overflow', async ({ page }) => {
  await page.emulateMedia({ media: 'print' });
  await page.goto('/portfolio');

  const measurements = await page.locator('section[data-portfolio-page]').evaluateAll((pages) =>
    pages.map((item) => ({
      width: item.getBoundingClientRect().width,
      height: item.getBoundingClientRect().height,
      clientHeight: item.clientHeight,
      scrollHeight: item.scrollHeight,
    }))
  );

  for (const item of measurements) {
    expect(item.width).toBeCloseTo(793.7, 0);
    expect(item.height).toBeCloseTo(1122.5, 0);
    expect(item.scrollHeight).toBeLessThanOrEqual(item.clientHeight + 1);
  }
});
```

- [ ] **Step 2: 테스트를 실행해 실제 오버플로 페이지 식별**

Run: `npm run test:portfolio -- tests/portfolio-document-route.spec.ts -g "fits one A4"`

Expected: 초기에는 최소 한 페이지가 넘치거나 px 허용값이 맞지 않아 실패한다. 테스트 결과에 페이지 번호를 포함하도록 측정값을 개선한다.

- [ ] **Step 3: 글자를 무작정 줄이지 않고 오버플로 수정**

우선순위는 `중복 문장 제거 → 패널 수 축소 → 표 행간 조정 → 이미지 비율 조정 → 페이지 내부 여백 1~2mm 조정`이다. 본문 9.5pt 미만 축소는 금지한다.

- [ ] **Step 4: PDF exporter 구현**

```js
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const output = new URL('../public/portfolio/yunho-cho-portfolio.pdf', import.meta.url);
await mkdir(new URL('../public/portfolio/', import.meta.url), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://127.0.0.1:4322/portfolio', { waitUntil: 'networkidle' });
await page.pdf({
  path: output.pathname,
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: false,
});
await browser.close();
```

스크립트는 preview 서버가 없으면 명확한 오류를 출력하고, 빌드 결과의 `/portfolio`만 사용한다.

- [ ] **Step 5: 전체 코드 검증 실행**

Run: `npm run check:astro`

Expected: Astro check passes.

Run: `npm run check:eslint`

Expected: ESLint check passes.

Run: `npx prettier --check <이번 계획에서 추가·수정한 파일 목록>`

Expected: 이번 포트폴리오 작업 파일의 Prettier check가 통과한다. 기존 홈페이지 파일의 기준선 포맷 오류는 수정하지 않는다.

Run: `npm run build`

Expected: static build succeeds and `dist/portfolio/index.html` exists.

Run: `npm run test:portfolio`

Expected: all portfolio tests pass.

- [ ] **Step 6: PDF 생성과 구조 검증**

한 터미널에서 Run: `npm run preview -- --host 127.0.0.1 --port 4322`

다른 터미널에서 Run: `npm run portfolio:pdf`

Run: `pdfinfo public/portfolio/yunho-cho-portfolio.pdf`

Expected:

```text
Pages:           13
Page size:       595.28 x 841.89 pts (A4)
```

- [ ] **Step 7: Poppler로 모든 페이지 렌더링 후 시각 검수**

Run: `mkdir -p /private/tmp/portfolio-document-qa`

Run: `pdftoppm -png -r 120 public/portfolio/yunho-cho-portfolio.pdf /private/tmp/portfolio-document-qa/page`

13개 PNG를 모두 확인해 잘림, 겹침, 작은 본문, 어색한 빈 공간, 흐린 선, 잘못된 상태 라벨을 찾는다. 문제가 있으면 해당 페이지 CSS·원고를 수정하고 Step 5–7을 반복한다.

- [ ] **Step 8: README에 재생성 절차 기록**

```md
## Portfolio document

- Web preview: `/portfolio`
- PDF: `public/portfolio/yunho-cho-portfolio.pdf`
- Verify: `npm run check && npm run build && npm run test:portfolio`
- Export: start `npm run preview -- --port 4322`, then run `npm run portfolio:pdf`
```

- [ ] **Step 9: 최종 diff와 상태 확인**

Run: `git status --short`

Run: `git diff --check`

Expected: 사용자 소유 `.artifacts/`를 제외하고 계획된 파일만 변경됐고 whitespace 오류가 없다.

---

## Acceptance Checklist

- [ ] `/portfolio`가 기존 홈페이지와 독립된 13페이지 문서로 열린다.
- [ ] PDF가 정확히 13장의 A4 세로 문서다.
- [ ] 초반 4페이지 안에 문제의 시작과 Gjallar·Heimdall 분리 판단이 이해된다.
- [ ] K-Le-PaaS 팀 성과와 개인 기여가 구분된다.
- [ ] Gjallar는 Native Create와 제한된 운영 범위만 주장한다.
- [ ] Heimdall의 generation 승격·복구 구현과 image/data rollback 비범위가 함께 보인다.
- [ ] 별도 Storage VM은 운영 구조로, 외부 공개 경로는 Planned로 표시된다.
- [ ] 모든 페이지가 9.5pt 이상의 본문과 충분한 여백을 유지한다.
- [ ] 기존 홈페이지·이력서 파일은 수정하지 않는다.
- [ ] Astro check, ESLint, build, Playwright, PDF 구조 검증과 변경 파일 대상 Prettier 검증이 모두 통과한다.
- [ ] Poppler로 렌더링한 13개 페이지를 전부 시각 검수한다.
