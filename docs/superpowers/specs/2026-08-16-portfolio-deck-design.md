# 16:9 Portfolio Deck Design

## 1. Purpose

Create a standalone, presentation-style portfolio that complements the existing website and resume.

- The website remains the concise entry point.
- The resume remains the fast factual summary.
- The portfolio deck explains project context, engineering decisions, implementation evidence, and growth.
- The primary output is a downloadable 16:9 PDF.
- The same content is also readable as an HTML slide page at `/portfolio`.

The deck is intended to be read on a laptop without a presenter. It must therefore preserve the visual clarity of a presentation while including enough context to stand alone.

## 2. Audience and Language

The primary audience is a Korean hiring reviewer evaluating platform, DevOps, infrastructure, or backend engineering capability.

- Body copy is written in Korean.
- Section labels such as `Architecture`, `Decision`, and `Outcome` may remain in English.
- Product names, APIs, infrastructure terms, and code-level concepts keep their conventional English spelling.
- Sentences stay short enough to scan within a slide.

## 3. Portfolio Thesis

The portfolio is organized around an engineering progression rather than a chronological project list.

> K-Le-PaaS에서 배포 자동화를 경험하고, 홈랩에서 Heimdall을 직접 설계·운영하며 외부 사용자용 서비스로 확장했다. 인프라 책임은 Gjallar로 분리하고, 향후 Kubernetes 기반 실행 환경으로 통합한다.

The shorter recurring message is:

> 배포 자동화에서 시작해, 애플리케이션과 인프라의 책임을 분리하고, 실제 사용자가 있는 서비스 운영으로 확장하고 있습니다.

## 4. Project Roles in the Story

### K-Le-PaaS: origin

K-Le-PaaS is the starting point. It demonstrates experience translating natural-language requests into Kubernetes operations and learning the value of deployment pipelines, execution feedback, and operational visibility.

It receives two slides. Its purpose is to establish the experience that led to Heimdall, not to dominate the deck.

### Home Lab: operating environment

The home lab is not presented as a hardware collection. It is the environment used to test deployment automation, VM operations, service exposure, and failure handling under real operating conditions.

The deck must describe the architecture at an appropriate level without exposing IP addresses, credentials, tokens, exact firewall rules, or other security-sensitive details.

### Heimdall: main project

Heimdall is the central project. It has one codebase with two operating profiles:

- `Internal Profile`: deploys personal and internal workloads in the home lab.
- `Public Profile`: lets an external user register a GitHub repository and quickly deploy a simple three-tier application with a subdomain.

The shared deployment workflow is reused across the profiles. Environment-specific execution and exposure policies differ by profile.

Heimdall is preparing for a private beta with bootcamp peers. The deck must label this as beta preparation until the service is actually open. After launch, the label and evidence should be updated with observed metrics.

The roadmap is to converge the Internal and Public execution profiles on a shared Kubernetes execution plane. This is shown as a future state, not a current capability.

### Gjallar: separated infrastructure responsibility

Gjallar is an independent VM lifecycle management system.

- Heimdall owns application deployment.
- Gjallar owns VM creation, state, and operational tasks.
- The systems are not currently integrated.

The design rationale is responsibility and failure-boundary separation. The deck must not imply that Gjallar currently provisions or manages Heimdall's VMs.

A possible unified control plane may be shown only as a concept or roadmap. Gjallar remains the infrastructure-management boundary even if a higher-level control plane is introduced later.

### Argus: supporting project

Argus is a supporting project rather than part of the main progression. It receives no more than one compact slide or half-slide.

It demonstrates economic-data collection, normalization, analysis, visualization, and preparation for external service deployment. It must not be forced into the K-Le-PaaS → Heimdall → Gjallar narrative.

## 5. Slide Structure

The target is 15 slides.

1. **Cover** — name, target role, one-line introduction, and direct links.
2. **What I Build** — engineering identity, problem domain, and core capabilities.
3. **Engineering Journey** — K-Le-PaaS → Home Lab → Heimdall Internal → Heimdall Public → Kubernetes roadmap, with Gjallar shown as a responsibility-separation branch.
4. **My Home Lab** — purpose, abstracted infrastructure layers, workloads, and operational status.
5. **K-Le-PaaS / Problem** — project goal, team context, and the problem addressed.
6. **K-Le-PaaS / Contribution & Learning** — personal contribution, execution flow, outcome, and the insight that led to Heimdall.
7. **Transition** — a concise question: "다른 환경에서도 사용할 수 있는 배포 흐름을 직접 설계한다면?"
8. **Heimdall / Product** — user problem, target users, and Internal/Public profiles.
9. **Heimdall / Current Architecture** — GitHub → control/API → build/runtime/database/domain → operating profile.
10. **Heimdall / Public Deployment Flow** — repository registration → three-tier configuration → build → runtime → database → subdomain → external access.
11. **Heimdall / Engineering Decisions** — shared workflow, profile separation, state and logs, failure handling, isolation, and beta status.
12. **Why Gjallar?** — why application deployment and VM lifecycle management have separate responsibilities.
13. **Gjallar / Safe VM Operations** — request → validate → approve → execute → track, supported by implemented evidence.
14. **Current Architecture & Roadmap** — present independent boundaries versus future Kubernetes execution convergence and optional higher-level control plane.
15. **Additional Project & Contact** — compact Argus evidence, engineering principles, portfolio links, resume, GitHub, and contact.

Approximate narrative weight:

- Heimdall: 45%
- Gjallar: 25%
- K-Le-PaaS: 20%
- Home Lab and Argus: 10%

## 6. Content Model

Every main project follows a consistent evidence structure:

> 문제 → 내 역할 → 구조 → 핵심 판단 → 구현 증거 → 현재 결과 → 다음 단계

The deck avoids long feature lists. Each claim must be backed by at least one of the following where available:

- product screenshot;
- architecture or execution-flow diagram;
- deployment state or operational log;
- code or API excerpt that demonstrates a key boundary;
- measured result;
- beta usage or feedback after launch;
- a concrete failure and the resulting design change.

Current implementation, beta status, and roadmap must be visually and verbally distinct:

- `Implemented`: solid line and standard project color;
- `Beta` or `Preparing Beta`: explicit status badge;
- `Roadmap` or `Concept`: lighter treatment and dashed line.

Time-sensitive statements use status wording instead of phrases such as "next week." After a launch, the content is updated with the launch state and evidence rather than leaving stale relative dates.

## 7. Visual System

The deck reuses the current website's design language without copying page layouts directly.

- Fixed 16:9 canvas.
- Dark background consistent with the site.
- Large headings, short body copy, and strong numeric hierarchy.
- Wide safe margins and a restrained card system.
- Architecture, workflow, product screens, and evidence take priority over decoration.
- Consistent page number and project-status treatment.

Project accent colors follow the website:

- Heimdall: blue;
- Gjallar: red;
- K-Le-PaaS: green;
- Argus: yellow.

Four reusable slide patterns provide rhythm and consistency:

1. `Statement` — one strong idea or transition.
2. `Architecture` — system boundaries and data flow.
3. `Evidence` — interface, log, code, metric, or observed result.
4. `Decision` — context, choice, rationale, and consequence.

The layout must remain readable when the PDF is viewed full-screen or fitted to a laptop window. It is optimized for screen viewing rather than A4 printing.

## 8. Application Structure

The deck is implemented inside the existing Astro application, but its source is isolated from ordinary website pages.

```text
src/
├── pages/portfolio/index.astro
├── components/portfolio-deck/
│   ├── Deck.astro
│   ├── Slide.astro
│   ├── Architecture.astro
│   └── ProjectEvidence.astro
├── data/portfolio-deck.ts
└── assets/styles/portfolio-deck.css
scripts/
└── export-portfolio-pdf.mjs
public/
└── portfolio/yunho-cho-portfolio.pdf
```

The exact component list may be reduced during implementation when two components do not provide distinct responsibilities. The important boundaries are:

- deck copy and slide ordering live in dedicated deck data;
- slide layout primitives live in the deck component directory;
- print and 16:9 rules live in a dedicated stylesheet;
- PDF export is a repeatable script;
- the generated PDF is a deployable static asset.

Shared profile data and existing project images may be reused. Long-form deck copy is not coupled to the shorter website copy.

## 9. Navigation and Delivery

The website header adds `Portfolio` beside `Resume`.

- `/portfolio` opens the HTML deck.
- A visible action on the deck downloads `/portfolio/yunho-cho-portfolio.pdf`.
- The existing resume route and PDF remain independent.
- Direct links remain usable inside the generated PDF when supported by Chromium output.

## 10. PDF Generation

Playwright is added as a development dependency. No Astro-specific PDF plugin or PDF-editing library is required.

The export flow is:

```text
Astro portfolio route
→ Playwright opens the built or locally served page
→ Chromium prints with background graphics enabled
→ one slide becomes one PDF page
→ public/portfolio/yunho-cho-portfolio.pdf
```

The print stylesheet defines a zero-margin 16:9 page and forces a page break after every slide. The exporter uses an explicit width and height rather than relying on the machine's default paper settings.

The export command is exposed through an npm script such as `portfolio:pdf`. The final command name is chosen during implementation to match the existing script naming style.

## 11. Content-Gathering Workflow

Implementation begins with copy and evidence, not visual decoration.

1. Draft slide copy from the current repository and existing portfolio data.
2. Mark claims that require user verification during the working session rather than placing placeholder language in the finished deck.
3. Confirm K-Le-PaaS contribution, Heimdall profile behavior, Gjallar's implemented operations, and abstracted home-lab topology.
4. Select or capture evidence for each main project.
5. Replace beta-preparation claims with measured evidence after launch.
6. Apply the visual system only after the slide narrative is coherent.

No sensitive home-lab values, repository secrets, user data, credentials, or attack-surface details are included in source data or output artifacts.

## 12. Validation

The work is complete only when all of the following pass:

- Astro type and content checks pass.
- ESLint and formatting checks pass.
- The production site builds successfully.
- `/portfolio` renders all 15 slides in the intended order.
- Browser navigation and the PDF download link work.
- PDF export produces exactly 15 pages at a consistent 16:9 size.
- All PDF pages are rendered to images and visually inspected.
- No text, image, diagram, page number, or link is clipped.
- Korean and English fonts render correctly.
- Images remain legible at normal laptop viewing size.
- Implemented, beta, and roadmap states are not visually ambiguous.
- The PDF contains no secrets or unintended internal infrastructure details.
- The existing website and resume routes still work after the header change.

## 13. Out of Scope

- A native `.pptx` output.
- A separate nested Astro application or duplicated package setup.
- Live integration between Heimdall and Gjallar.
- Implementing the future Kubernetes execution plane.
- Implementing the possible unified control plane.
- Presenting planned capabilities as completed work.
- Turning Argus into a main case study in this deck.
