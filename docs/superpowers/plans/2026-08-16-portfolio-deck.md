# Portfolio Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 15-slide Korean 16:9 HTML portfolio deck at `/portfolio`, export it reproducibly as a downloadable PDF, and link it beside the existing resume.

**Architecture:** Keep the deck in the existing Astro app while isolating its data, components, styles, tests, and exporter. Render a typed slide dataset through focused Astro components, then use Playwright/Chromium for browser tests and deterministic PDF generation.

**Tech Stack:** Astro 5, TypeScript, CSS, `@playwright/test`, Chromium PDF output, Poppler CLI.

## Global Constraints

- Exactly 15 slides at 16:9; Korean body copy with conventional English technical labels.
- Heimdall is the main project and has one codebase with `Internal` and `Public` profiles.
- Heimdall owns application deployment; Kubernetes execution convergence is `Roadmap`.
- Gjallar owns VM lifecycle operations and is not currently integrated with Heimdall.
- Argus is one compact supporting slide, outside the main progression.
- `Implemented`, `Preparing Beta`, and `Roadmap` are visually and verbally distinct.
- Include no secrets, IPs, tokens, exact firewall rules, user data, or invented metrics.
- Reuse existing images/profile links, but keep deck copy independent of homepage copy.
- Existing homepage, resume, project, and archive routes must keep working.
- Generated output: `public/portfolio/yunho-cho-portfolio.pdf`.

---

## File Map

**Create:**

- `src/data/portfolio-deck.ts` — typed slide copy, states, flows, links, and evidence.
- `src/components/portfolio-deck/Deck.astro` — deck composition.
- `src/components/portfolio-deck/Slide.astro` — shared slide frame.
- `src/components/portfolio-deck/FlowDiagram.astro` — text-based system flows.
- `src/components/portfolio-deck/ProjectEvidence.astro` — screenshot evidence.
- `src/assets/styles/portfolio-deck.css` — screen and print system.
- `src/pages/portfolio/index.astro` — deck route and download controls.
- `playwright.config.ts`, `tests/portfolio-deck-data.spec.ts`, `tests/portfolio-deck-page.spec.ts` — tests.
- `scripts/export-portfolio-pdf.mjs` — deterministic exporter.
- `public/portfolio/yunho-cho-portfolio.pdf` — generated artifact.

**Modify:** `package.json`, `package-lock.json`, `src/pages/index.astro`, `README.md`.

**Do not modify:** `src/data/home.ts` remains the homepage/project source. `src/data/portfolio.ts` remains the profile/archive source; its older Heimdall record is not reused by the deck.

---

### Task 1: Add the deck data contract and final draft copy

**Files:**

- Create: `src/data/portfolio-deck.ts`
- Create: `tests/portfolio-deck-data.spec.ts`
- Create: `playwright.config.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**

- Consumes: `portfolioProfile` only for identity and direct links.
- Produces: `portfolioDeckSlides`, `PortfolioDeckSlide`, `DeckStatus`, `DeckAccent`, `FlowNode`, `DeckLink`.

- [ ] **Step 1: Install the test dependency and Chromium**

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

Add scripts:

```json
"test:portfolio": "playwright test tests/portfolio-deck-data.spec.ts tests/portfolio-deck-page.spec.ts",
"portfolio:pdf": "node scripts/export-portfolio-pdf.mjs"
```

- [ ] **Step 2: Configure Playwright**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'portfolio-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 900 } } }],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: true,
  },
});
```

- [ ] **Step 3: Write failing data invariants**

Create `tests/portfolio-deck-data.spec.ts`:

```ts
import { expect, test } from '@playwright/test';
import { portfolioDeckSlides } from '../src/data/portfolio-deck';

test('contains fifteen ordered unique slides', () => {
  expect(portfolioDeckSlides).toHaveLength(15);
  expect(portfolioDeckSlides.map(({ number }) => number)).toEqual(Array.from({ length: 15 }, (_, i) => i + 1));
  expect(new Set(portfolioDeckSlides.map(({ id }) => id)).size).toBe(15);
});

test('keeps current and future states honest', () => {
  const heimdall = portfolioDeckSlides.filter(({ project }) => project === 'heimdall');
  const roadmap = portfolioDeckSlides.find(({ id }) => id === 'current-and-roadmap');
  expect(heimdall.some(({ status }) => status === 'preparing-beta')).toBe(true);
  expect(roadmap?.status).toBe('roadmap');
  expect(JSON.stringify(portfolioDeckSlides)).not.toContain('다음 주');
  expect(JSON.stringify(portfolioDeckSlides)).not.toContain('현재 연동');
});

test('keeps Argus outside the main journey', () => {
  const journey = portfolioDeckSlides.find(({ id }) => id === 'engineering-journey');
  expect(journey?.flow?.map(({ label }) => label)).not.toContain('Argus');
  expect(portfolioDeckSlides.filter(({ project }) => project === 'argus')).toHaveLength(1);
});
```

- [ ] **Step 4: Prove the test fails because the data module is absent**

Run `npx playwright test tests/portfolio-deck-data.spec.ts`.

Expected: FAIL resolving `src/data/portfolio-deck.ts`.

- [ ] **Step 5: Implement the typed dataset**

Use these exact public types:

```ts
export type DeckStatus = 'implemented' | 'preparing-beta' | 'roadmap';
export type DeckAccent = 'neutral' | 'blue' | 'red' | 'green' | 'yellow';
export type DeckProject = 'klepaas' | 'heimdall' | 'gjallar' | 'argus';
export interface DeckLink { label: string; href: string; external?: boolean; download?: boolean }
export interface FlowNode { label: string; detail: string; status?: DeckStatus; branch?: 'main' | 'infrastructure' }
export interface PortfolioDeckSlide {
  id: string;
  number: number;
  kind: 'cover' | 'statement' | 'journey' | 'architecture' | 'flow' | 'decision' | 'evidence' | 'closing';
  eyebrow: string;
  title: string;
  lead: string;
  accent: DeckAccent;
  project?: DeckProject;
  status?: DeckStatus;
  bullets?: readonly { label: string; text: string }[];
  flow?: readonly FlowNode[];
  evidence?: { src: string; alt: string; caption: string };
  links?: readonly DeckLink[];
}
```

Create these fifteen records with the stated factual scope:

| # | ID | Title | Scope |
|---|---|---|---|
| 1 | `cover` | `반복되는 배포와 운영을, 추적 가능한 플랫폼으로.` | identity and direct links |
| 2 | `what-i-build` | `배포와 인프라의 경계를 설계합니다.` | request, execution, state/feedback |
| 3 | `engineering-journey` | `하나의 경험이 다음 시스템의 질문이 됐습니다.` | K-Le-PaaS → Home Lab → Internal → Public → Kubernetes; Gjallar as branch |
| 4 | `home-lab` | `실험을 실제 운영 조건으로 옮긴 홈랩` | validation environment without sensitive topology |
| 5 | `klepaas-problem` | `말하면 배포되는 흐름을 만들었습니다.` | natural language, FastAPI, Actions, Kubernetes, Slack |
| 6 | `klepaas-learning` | `자동화보다 중요한 것은 실행 이후였습니다.` | personal contribution, status/log/feedback lesson |
| 7 | `transition-to-heimdall` | `이 흐름을 직접 운영하는 환경으로 옮긴다면?` | short transition only |
| 8 | `heimdall-product` | `하나의 배포 흐름, 두 개의 운영 프로필` | one codebase, Internal/Public, beta preparation |
| 9 | `heimdall-architecture` | `저장소에서 실행 환경까지 하나의 작업으로 추적합니다.` | GitHub → control → build/runtime/DB/domain → profile |
| 10 | `heimdall-public-flow` | `GitHub 저장소를 등록하면 3-Tier 서비스를 서브도메인으로 공개합니다.` | register → configure → build → run → DB → subdomain |
| 11 | `heimdall-decisions` | `공통 흐름은 재사용하고, 환경 차이는 격리합니다.` | shared flow, state/logs, failure visibility, boundaries |
| 12 | `why-gjallar` | `배포 시스템이 VM 생명주기까지 책임해야 할까?` | separate application and VM responsibilities |
| 13 | `gjallar-safe-operations` | `VM 작업은 검증하고, 실행하고, 추적합니다.` | Request → Validate → Approve → Execute → Track |
| 14 | `current-and-roadmap` | `책임은 분리하고, 실행 환경은 수렴시킵니다.` | current independence; Kubernetes/control plane as roadmap |
| 15 | `additional-and-contact` | `다른 문제에도 같은 원칙을 적용합니다.` | compact Argus, external deployment preparation, links |

Assign `implemented` to slides 5, 6, and 13; `preparing-beta` to slides 8 and 11; and `roadmap` to slide 14. Slides that describe identity, context, or transitions have no status badge.

Reuse `/projects/klepaas-dashboard.png`, `/projects/heimdall.png`, `/projects/gjallar.png`, and `/projects/argus.png`. Add no numerical outcomes.

- [ ] **Step 6: Pass the data tests and commit**

```bash
npx playwright test tests/portfolio-deck-data.spec.ts
git add package.json package-lock.json playwright.config.ts tests/portfolio-deck-data.spec.ts src/data/portfolio-deck.ts
git commit -m "feat: add portfolio deck content model"
```

Expected: 3 tests PASS.

---

### Task 2: Render an accessible HTML deck

**Files:**

- Create: `src/components/portfolio-deck/Slide.astro`
- Create: `src/components/portfolio-deck/FlowDiagram.astro`
- Create: `src/components/portfolio-deck/ProjectEvidence.astro`
- Create: `src/components/portfolio-deck/Deck.astro`
- Create: `src/pages/portfolio/index.astro`
- Create: `tests/portfolio-deck-page.spec.ts`

**Interfaces:**

- Consumes: Task 1 deck data.
- Produces: `/portfolio`, fifteen `section[data-slide]` elements, `#slide-<id>` anchors, slide numbering, and status labels.

- [ ] **Step 1: Write the failing route tests**

```ts
import { expect, test } from '@playwright/test';

test('renders fifteen named portfolio slides', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page).toHaveTitle(/Portfolio/);
  const slides = page.locator('section[data-slide]');
  await expect(slides).toHaveCount(15);
  await expect(slides.first()).toHaveAttribute('id', 'slide-cover');
  await expect(slides.last()).toHaveAttribute('id', 'slide-additional-and-contact');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('반복되는 배포와 운영을, 추적 가능한 플랫폼으로.');
});

test('labels implemented, beta, and roadmap content', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.getByText('Implemented', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Preparing Beta', { exact: true })).toBeVisible();
  await expect(page.getByText('Roadmap', { exact: true })).toBeVisible();
});
```

Run `npx playwright test tests/portfolio-deck-page.spec.ts`.

Expected: FAIL because `/portfolio` does not exist.

- [ ] **Step 2: Implement `Slide.astro`**

Render `<section id={`slide-${slide.id}`} data-slide data-kind={slide.kind} data-accent={slide.accent}>`. Use `<h1>` only on slide 1 and `<h2>` for slides 2–15. Show `01 / 15` numbering and map statuses exactly:

```ts
const statusLabel = {
  implemented: 'Implemented',
  'preparing-beta': 'Preparing Beta',
  roadmap: 'Roadmap',
} as const;
```

- [ ] **Step 3: Implement focused body components**

`FlowDiagram.astro` accepts `nodes: readonly FlowNode[]` and renders an accessible ordered list with `data-branch`. `ProjectEvidence.astro` accepts `{ src, alt, caption, priority? }` and renders `<figure>`, `<img>`, and `<figcaption>`.

- [ ] **Step 4: Compose the deck and route**

`Deck.astro` iterates the dataset and branches only on `slide.kind`; it does not duplicate copy. `src/pages/portfolio/index.astro` uses root `Layout.astro` without the normal site header/footer, sets `Yunho Cho | Portfolio Deck`, renders a compact Home/PDF/Resume/GitHub toolbar, and wraps `<Deck />` in `<main aria-label="포트폴리오 슬라이드">`.

- [ ] **Step 5: Pass route and Astro tests, then commit**

```bash
npx playwright test tests/portfolio-deck-data.spec.ts tests/portfolio-deck-page.spec.ts
npm run check:astro
git add src/components/portfolio-deck src/pages/portfolio tests/portfolio-deck-page.spec.ts
git commit -m "feat: render portfolio deck route"
```

---

### Task 3: Add the screen and print visual system

**Files:**

- Create: `src/assets/styles/portfolio-deck.css`
- Modify: `src/pages/portfolio/index.astro`
- Modify: `tests/portfolio-deck-page.spec.ts`

**Interfaces:**

- Consumes: slide data attributes from Task 2.
- Produces: responsive 16:9 slides, project accents, safe margins, and exact print pages.

- [ ] **Step 1: Write failing ratio, overflow, and print tests**

```ts
test('keeps every slide at 16:9 without overflow', async ({ page }) => {
  await page.goto('/portfolio');
  const values = await page.locator('section[data-slide]').evaluateAll((slides) => slides.map((slide) => {
    const el = slide as HTMLElement;
    const rect = el.getBoundingClientRect();
    return { ratio: rect.width / rect.height, x: el.scrollWidth - el.clientWidth, y: el.scrollHeight - el.clientHeight };
  }));
  for (const value of values) {
    expect(value.ratio).toBeCloseTo(16 / 9, 2);
    expect(value.x).toBeLessThanOrEqual(1);
    expect(value.y).toBeLessThanOrEqual(1);
  }
});

test('prints one page per slide', async ({ page }) => {
  await page.goto('/portfolio');
  await page.emulateMedia({ media: 'print' });
  expect(await page.locator('section[data-slide]').first().evaluate((el) => getComputedStyle(el).breakAfter)).toBe('page');
});
```

Run the test and expect failure before adding the stylesheet.

- [ ] **Step 2: Implement tokens and screen layout**

```css
:root {
  --deck-bg: #0c0d10;
  --deck-surface: #15171c;
  --deck-line: #343842;
  --deck-text: #f7f7f3;
  --deck-muted: #aeb3bd;
  --deck-blue: #4f8cff;
  --deck-red: #ff5f56;
  --deck-green: #35c989;
  --deck-yellow: #f4c84a;
  --deck-width: 1600px;
  --deck-height: 900px;
}
```

Center slides in a dark stage; use `aspect-ratio: 16 / 9`, `width: min(100vw, var(--deck-width))`, at least 5% safe margins, existing font variables, text-based CSS diagrams, project accent mapping, and `scroll-snap-type: y proximity` on screen.

- [ ] **Step 3: Implement exact print behavior**

```css
@page { size: 13.333333in 7.5in; margin: 0; }

@media print {
  html, body { margin: 0; background: var(--deck-bg); }
  .deck-toolbar, .skip-link { display: none !important; }
  section[data-slide] {
    width: 13.333333in;
    height: 7.5in;
    break-after: page;
    page-break-after: always;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
```

Only suppress the final page break if PDF inspection proves Chromium adds a blank page.

- [ ] **Step 4: Pass focused checks and commit**

```bash
npx playwright test tests/portfolio-deck-page.spec.ts
npm run check
npm run build
git add src/assets/styles/portfolio-deck.css src/pages/portfolio/index.astro tests/portfolio-deck-page.spec.ts
git commit -m "feat: style 16 by 9 portfolio slides"
```

---

### Task 4: Link the deck from the existing homepage

**Files:**

- Modify: `src/pages/index.astro`
- Modify: `tests/portfolio-deck-page.spec.ts`

**Interfaces:**

- Consumes: `/portfolio`.
- Produces: Portfolio access beside Resume in the header, hero, and contact links.

- [ ] **Step 1: Write the failing homepage-link test**

```ts
test('links to the portfolio beside resume entry points', async ({ page }) => {
  await page.goto('/');
  const links = page.getByRole('link', { name: /Portfolio|포트폴리오/ });
  await expect(links.first()).toBeVisible();
  expect(await links.count()).toBeGreaterThanOrEqual(3);
  await expect(links.first()).toHaveAttribute('href', '/portfolio');
});
```

Run `npx playwright test tests/portfolio-deck-page.spec.ts -g "links to the portfolio"`.

Expected: FAIL because the homepage has no Portfolio entry.

- [ ] **Step 2: Add three scoped entry points**

Modify only these existing areas in `src/pages/index.astro`:

1. Add a `/portfolio` presentation-icon action immediately before Resume in `.header-actions`, with `aria-label="포트폴리오 열기"`.
2. Add `Portfolio` between `프로젝트 보기` and `이력서` in `.hero-actions`.
3. Add `Portfolio` between GitHub and Resume in `.contact-links`.

Do not restructure the homepage or change project ordering.

- [ ] **Step 3: Pass link and regression checks, then commit**

```bash
npx playwright test tests/portfolio-deck-page.spec.ts
npm run check
npm run build
git add src/pages/index.astro tests/portfolio-deck-page.spec.ts
git commit -m "feat: link portfolio deck from homepage"
```

---

### Task 5: Export the HTML deck deterministically to PDF

**Files:**

- Create: `scripts/export-portfolio-pdf.mjs`
- Modify: `src/pages/portfolio/index.astro`
- Modify: `tests/portfolio-deck-page.spec.ts`
- Generate: `public/portfolio/yunho-cho-portfolio.pdf`

**Interfaces:**

- Consumes: production `/portfolio` and Playwright Chromium.
- Produces: final PDF in `public/portfolio/` and a copy in `dist/portfolio/` for preview verification.

- [ ] **Step 1: Write a failing PDF-link test**

```ts
test('offers the generated portfolio PDF', async ({ page }) => {
  await page.goto('/portfolio');
  const download = page.getByRole('link', { name: /PDF/ }).first();
  await expect(download).toHaveAttribute('href', '/portfolio/yunho-cho-portfolio.pdf');
  await expect(download).toHaveAttribute('download');
});
```

Run the focused test. Expected: FAIL until the exact download action exists.

- [ ] **Step 2: Add the exact toolbar and closing-slide action**

Both actions render:

```html
<a href="/portfolio/yunho-cho-portfolio.pdf" download>Portfolio PDF</a>
```

- [ ] **Step 3: Implement condition-based production export**

`scripts/export-portfolio-pdf.mjs` must:

1. run `npm run build` and stop on non-zero exit;
2. spawn `npm run preview -- --host 127.0.0.1 --port 4322`;
3. poll `http://127.0.0.1:4322/portfolio` until HTTP 200 or a 30-second deadline;
4. launch Chromium and navigate with `waitUntil: 'networkidle'`;
5. await `document.fonts.ready` and assert 15 `section[data-slide]` elements;
6. emulate print media;
7. export with `width: '13.333333in'`, `height: '7.5in'`, `printBackground: true`, and `preferCSSPageSize: true`;
8. write through a temporary file before replacing `public/portfolio/yunho-cho-portfolio.pdf`;
9. copy the final file to `dist/portfolio/`;
10. close Chromium and terminate preview in `finally`.

Use a retry loop with a deadline, not a fixed sleep. Print only concise milestones and actionable errors.

- [ ] **Step 4: Generate and inspect PDF metadata**

```bash
npm run portfolio:pdf
pdfinfo public/portfolio/yunho-cho-portfolio.pdf
```

Expected: `Pages: 15` and a 16:9 page size. `960 x 540 pts` is expected, but an equivalent 16:9 size is acceptable. Any other page count is a failure.

- [ ] **Step 5: Pass PDF-link and regression checks, then commit**

```bash
npx playwright test tests/portfolio-deck-page.spec.ts
npm run check
git add scripts/export-portfolio-pdf.mjs src/pages/portfolio/index.astro tests/portfolio-deck-page.spec.ts public/portfolio/yunho-cho-portfolio.pdf
git commit -m "feat: export portfolio deck as PDF"
```

---

### Task 6: Render and visually verify every PDF page

**Files:**

- Modify only for observed defects: `src/assets/styles/portfolio-deck.css`
- Modify only for observed defects: `src/data/portfolio-deck.ts`
- Regenerate: `public/portfolio/yunho-cho-portfolio.pdf`
- Temporary, never stage: `.artifacts/portfolio-deck-pages/`

**Interfaces:**

- Consumes: the generated PDF.
- Produces: visually verified pages with no clipping, broken evidence, ambiguous states, or sensitive information.

- [ ] **Step 1: Invoke and read the PDF skill**

Use the session's `pdf:pdf` skill and follow its full render-and-verify workflow before inspecting or changing the artifact.

- [ ] **Step 2: Render all pages without deleting existing artifacts**

```bash
mkdir -p .artifacts/portfolio-deck-pages
pdftoppm -png -r 120 public/portfolio/yunho-cho-portfolio.pdf .artifacts/portfolio-deck-pages/slide
```

Expected: exactly 15 PNG files.

- [ ] **Step 3: Inspect all pages**

Check every page for:

- safe margins and readable Korean glyphs;
- unstretched, legible screenshots;
- correct architecture ordering and responsibility boundaries;
- unmistakable `Implemented`, `Preparing Beta`, and `Roadmap` states;
- no current Heimdall/Gjallar integration claim;
- Argus limited to one compact slide;
- working, non-placeholder identity links;
- no IPs, credentials, internal addresses, or private data.

- [ ] **Step 4: Correct one observed defect class at a time**

For each defect, note the slide and symptom, add a Playwright assertion if mechanically testable, apply the smallest data/CSS correction, rerun `npm run portfolio:pdf`, then rerender the affected and adjacent pages. Do not perform unrelated visual refactors.

- [ ] **Step 5: Run full artifact validation**

```bash
npm run check
npm run build
npx playwright test
npm run portfolio:pdf
pdfinfo public/portfolio/yunho-cho-portfolio.pdf
```

Expected: checks/build/tests PASS and the PDF is 15 consistent 16:9 pages.

- [ ] **Step 6: Commit only if QA produced corrections**

```bash
git add src/data/portfolio-deck.ts src/assets/styles/portfolio-deck.css tests/portfolio-deck-page.spec.ts public/portfolio/yunho-cho-portfolio.pdf
git commit -m "fix: polish portfolio PDF layout"
```

Skip this commit when no corrections were needed.

---

### Task 7: Document maintenance and run final verification

**Files:**

- Modify: `README.md`

**Interfaces:**

- Consumes: the final route, tests, exporter, and artifact.
- Produces: concise maintenance instructions.

- [ ] **Step 1: Add focused README instructions**

```markdown
## Portfolio deck

- HTML: `/portfolio`
- PDF: `/portfolio/yunho-cho-portfolio.pdf`
- Copy and slide order: `src/data/portfolio-deck.ts`
- Screen/print layout: `src/assets/styles/portfolio-deck.css`

Run `npm run test:portfolio` after copy or layout changes.
Run `npm run portfolio:pdf` to rebuild and export the 16:9 PDF.
Render and inspect all 15 pages before publishing an updated artifact.
```

- [ ] **Step 2: Run final verification**

```bash
npm run check
npm run build
npm run test:portfolio
npm run portfolio:pdf
pdfinfo public/portfolio/yunho-cho-portfolio.pdf
git status --short
```

Expected: checks, build, and tests PASS; PDF is 15 16:9 pages; the user's existing `.artifacts/` remains untracked and untouched.

- [ ] **Step 3: Commit documentation**

```bash
git add README.md public/portfolio/yunho-cho-portfolio.pdf
git commit -m "docs: document portfolio deck workflow"
```

- [ ] **Step 4: Inspect final history and worktree**

```bash
git log --oneline --max-count=8
git status --short
```

Expected: all task commits are present, no intended file is missing, and `.artifacts/` was neither staged nor removed.
