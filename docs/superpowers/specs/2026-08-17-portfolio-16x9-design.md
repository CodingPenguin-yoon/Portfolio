# 16:9 Architecture-led Portfolio Design Specification

- **Date:** 2026-08-17
- **Status:** Approved visual direction
- **Selected reference:** `docs/superpowers/specs/assets/portfolio-16x9-selected-ownership-columns.png`
- **Replaces:** the canonical A4 `/portfolio` document and `output/pdf/yunho-cho-portfolio.pdf`
- **Recovery:** the A4 version remains recoverable from Git commit `c677b93`

## 1. Outcome

Rebuild the portfolio as an 11-slide, 16:9 document whose primary evidence is architecture, flow, responsibility, and failure-boundary diagrams. The document must read as a hiring portfolio rather than a technical report: each slide makes one claim, the diagram carries that claim, and supporting copy stays short enough to scan at laptop scale.

The selected visual direction is the third ideation option: ownership columns. Its defining structure is four clearly separated responsibility zones, large node labels, restrained teal routes, no crossing connectors, and generous white space.

## 2. Audience and reading mode

- Primary audience: enterprise recruiter and first-round technical reviewer.
- Primary mode: screen reading as a 16:9 PDF or `/portfolio` web document.
- Secondary mode: interview conversation support.
- Expected first pass: a reviewer should understand the problem, the responsibility split, and the failure-handling judgement without reading paragraphs.

## 3. Editorial thesis

> 반복되는 운영 문제를 자동화하고, 변경 이유와 실패 영향이 다른 책임을 분리했습니다.

The deck should demonstrate four behaviours:

1. Find a repeated operational problem.
2. Automate the repeatable path.
3. Split a system when ownership and failure impact diverge.
4. Preserve the last known good state and user data when failure is uncertain.

## 4. Visual grammar

### 4.1 Frame

- Page ratio: exact 16:9 landscape.
- Canonical print size: `13.333333in × 7.5in` (`960 × 540pt`).
- White canvas with a subtle cool-gray browser surround only outside the slide.
- Slide padding: approximately 42–48px at a 1600×900 CSS reference frame.
- Twelve-column grid with a consistent 24px gutter.
- Footer: name and role on the left, `NN / 11` on the right.

### 4.2 Typography

- Korean and display text: IBM Plex Sans KR.
- Small labels, status, and page numbers: IBM Plex Mono.
- Headline: 46–56px at the reference frame, maximum two lines, preferably one.
- Zone label: 15–18px uppercase mono or condensed sans.
- Node title: 18–22px; it must not wrap.
- Node qualifier: 14–16px, one short line.
- No paragraph smaller than 14px at the reference frame.

### 4.3 Palette

- Ink: `#101827`.
- Muted text: `#526071`.
- Hairline: `#D7DEE5`.
- Soft surface: `#F5F7F8`.
- Active route: `#0F5961`.
- Planned state only: `#8A5A00`.
- No gradient, drop shadow, glossy treatment, dark canvas, or decorative illustration.

### 4.4 Diagram rules

- Architecture or flow occupies at least 70% of slides 2–10.
- Use orthogonal 90° routes only.
- Connectors never cross each other, text, or nodes.
- A connector has no sentence placed on top of it.
- Merge and fork points are visually explicit.
- Request traffic and data access use separate routes and labels.
- Nodes use consistent height, padding, corner radius, and border weight.
- Each ownership column has one heading and one responsibility.
- Iconography comes from the existing Tabler icon set; do not draw custom icons.
- Evidence screenshots remain real raster captures with intact aspect ratio and legible crops.

### 4.5 Copy rules

- One headline per slide.
- One short subline only when it changes the interpretation of the diagram.
- A node uses a title and, at most, one qualifier.
- No prose paragraphs, long bullet lists, report-style card grids, or connector captions.
- Status language is explicit: `Implemented`, `Previous`, `Operational`, or `Planned`.
- Do not call last-known-good Nginx restoration a stored-image release rollback.
- Do not present database backup, restore, purge, rotation, or user-data rollback as implemented.
- Do not present Gjallar as a full VM lifecycle manager.

## 5. Slide architecture

### Slide 01 — Cover

**Headline:** `반복되는 운영 문제를 책임과 실패 경계로 나눕니다.`

**Visual:** a single restrained four-step spine: `Observe → Automate → Separate → Preserve`.

**Supporting content:**

- 조윤호
- Platform Engineer
- Email · GitHub · Web

**Purpose:** establish the candidate's judgement before naming technologies.

### Slide 02 — Problem

**Headline:** `새 서비스를 올릴 때마다 같은 환경을 다시 만들었습니다.`

**Visual:** a large loop containing `VM 생성 → IP·네트워크 → Docker → 내부 설정 → 배포`, returning to the start for the next service. Three small cost labels sit outside the loop: `반복`, `설정 편차`, `실패 지점 불명확`.

**Purpose:** show the concrete operational pain without emotional or rhetorical copy.

### Slide 03 — Evolution

**Headline:** `자동화의 범위가 커지자, 변경 이유가 다른 책임을 분리했습니다.`

**Visual:** one left-to-right evolution line:

`K-Le-PaaS의 입력·실행 구조 → 초기 Heimdall: VM+설정+배포 → 범위·의존성 증가 → Gjallar | Heimdall`

The final step forks into two equally weighted ownership lanes:

- Gjallar: infrastructure create
- Heimdall: application release

**Purpose:** present the split as a design correction, not as unrelated projects.

### Slide 04 — Current System

**Headline:** `실행 기반, 배포 세대, 사용자 데이터의 수명주기를 분리했습니다.`

**Visual:** four ownership columns:

1. `PROXMOX` — actual inventory and VM runtime base
2. `GJALLAR CONTROL` — profile, preflight, approval, native create
3. `RUNTIME` — Heimdall worker, project gateway, app generations
4. `STORAGE` — separate VM, PostgreSQL, project DB and role

Use a horizontal infrastructure route and a separate runtime-to-storage data route. The Storage VM carries an `Operational` note because the separate VM is user-confirmed operation, while the external PostgreSQL capability is repository-backed.

**Purpose:** make the complete current system visible before project details.

### Slide 05 — Responsibility Split

**Headline:** `같은 홈랩 안에서도 실패 경계는 달라야 했습니다.`

**Visual:** two large ownership columns with three aligned rows:

| Dimension        | Gjallar                                   | Heimdall                           |
| ---------------- | ----------------------------------------- | ---------------------------------- |
| Change trigger   | infrastructure capacity and configuration | application code and configuration |
| Execution target | Proxmox VM                                | Docker generation and route        |
| Failure boundary | approved create fails                     | candidate is not promoted          |

The bottom line is a single forked ownership statement: `한 시스템의 실패가 다른 시스템의 복구 경로를 오염시키지 않게 함`.

**Purpose:** show the precise reason the projects were split.

### Slide 06 — Gjallar

**Headline:** `실제 상태를 확인한 뒤, 승인된 요청만 Proxmox에 반영합니다.`

**Visual:** large six-stage path:

`Actual Inventory → VM Profile → Preflight → Plan → Approval → Native Create → Observed After`

Use a compact, unmodified Gjallar screenshot as evidence beside or beneath the path. A small scope line reads: `Current scope: native Create + limited gated Start`.

**Purpose:** communicate safety and repeatability without listing every endpoint.

### Slide 07 — Heimdall Promotion

**Headline:** `검증된 세대만 Current로 승격합니다.`

**Visual:** two horizontal lanes:

- Candidate lane: `Exact Commit → Build → Generation Network → Start → Health`
- Activation lane: `nginx -t → Atomic Replace → Reload → Route Probe → Current`

`Previous Retirement` appears only after the Current decision gate. Visually separate `execution success` from `traffic activation success`.

**Purpose:** show why a running container is not yet a successful deployment.

### Slide 08 — Failure Boundary

**Headline:** `실패할수록 자동 삭제보다 보존 범위를 좁혔습니다.`

**Visual:** three failure branches terminating in preserved state:

1. `Build / Health 실패 → exact candidate cleanup → Current 유지`
2. `Activation 실패 → last-known-good config 복원 → 이전 route 유지`
3. `Worker 중단 → DB·marker·label reconcile → 불확실한 candidate 보존`

A distinct data rail shows `Runtime generation ≠ PostgreSQL data lifecycle` and ends at the separate Storage VM. A muted bottom scope line names non-implemented capabilities: image rollback, DB backup/restore/purge/rotation, user-data rollback.

**Purpose:** make judgement under failure the memorable technical strength.

### Slide 09 — Planned Exposure

**Headline:** `외부 Edge는 고정하고 동적 라우팅은 내부에서 처리합니다.`

**Visual:** implement the selected ownership-column reference faithfully:

1. `DNS` — `control.example.com`, `*.deploy.example.com`
2. `FIXED EDGE` — `OCI Edge Nginx`, `WireGuard`
3. `INTERNAL ROUTING` — `Internal Ingress Nginx`, `Project Gateway`
4. `RUNTIME & DATA` — `Runtime Application`, `Storage VM PostgreSQL`

Correct the reference's semantic ambiguity: the request route ends at Runtime Application; a separate internal data connector runs from Runtime Application to Storage VM PostgreSQL. Public ingress does not connect directly to PostgreSQL. Mark the entire slide `Planned`.

**Purpose:** preserve the selected visual direction while keeping the architecture technically honest.

### Slide 10 — Origin and Transfer

**Headline:** `입력을 정규화한 뒤 실행하는 구조를 다른 문제에도 적용했습니다.`

**Visual:** two aligned, compact pipelines sharing the same visual grammar:

- K-Le-PaaS · Previous: `Natural Language → Intent & Entity → CommandPlan → Kubernetes/NCP → Feedback`
- Argus · Implemented: `Provider Adapter → Normalized Snapshot → Judgement → Dashboard`

Use one real screenshot crop per pipeline only when both remain readable. Otherwise prioritise the K-Le-PaaS evidence and keep Argus as a smaller secondary strip.

**Ownership note:** K-Le-PaaS is a two-person project; personal ownership is the interpretation and CommandPlan boundary described in the evidence matrix.

**Purpose:** prove the main design principle did not appear from nowhere and transfers beyond one system.

### Slide 11 — Resume and Contact

**Headline:** `운영 문제를 발견하고, 자동화한 뒤, 실패 경계를 다시 설계합니다.`

**Visual:** a four-project scope strip with status and one-line ownership:

- Heimdall — verified generation promotion
- Gjallar — approved native create
- K-Le-PaaS — verified personal contribution within a two-person team
- Argus — provider boundary and normalized snapshot

Below it, use a compact single-row summary for core technologies, education, certifications, and contact. Do not add a thank-you slide.

**Purpose:** close on evidence-backed scope and a clear way to contact the candidate.

## 6. Data and component boundaries

- Keep `src/data/portfolio-document.ts` as the single source of truth for factual claims, evidence status, page order, and scope limits.
- Reduce `portfolioDocument.pages` from 13 to 11 and update slugs to the slide architecture above.
- Keep semantic HTML so the tagged PDF and reading order remain verifiable.
- Replace generic report-oriented maps with focused slide components:
  - ownership-column architecture
  - orthogonal flow
  - responsibility comparison
  - evidence figure
- Preserve real screenshots in `public/projects/`; do not rasterise architecture diagrams.
- Use the selected PNG only as the design-QA source, not as the slide implementation.

## 7. Web and PDF behaviour

- `/portfolio` remains the canonical route.
- On screen, slides stack vertically with a cool-gray gap and keep a 16:9 ratio.
- At narrow widths, each slide scales as a complete frame; the architecture must not reflow into a different topology.
- In print, each slide becomes exactly one 16:9 page with no clipping or overflow.
- `output/pdf/yunho-cho-portfolio.pdf` becomes the 11-page 16:9 canonical PDF.
- The exporter must preserve tagged output, embedded fonts, image validation, atomic replacement, and failure cleanup.

## 8. Acceptance criteria

1. Exactly 11 semantic slides and 11 PDF pages.
2. Every page reports an exact `960 × 540pt` MediaBox.
3. Every slide has exactly one visible `h2` and `NN / 11` footer.
4. No slide body overflows or intersects its footer at the reference viewport or in print.
5. Slides 2–10 devote at least 70% of usable body area to a diagram, comparison, or evidence composition.
6. No architecture title wraps; no connectors cross nodes or text.
7. Planned architecture shows separate request and PostgreSQL data routes.
8. Status boundaries remain accurate and the non-implemented capabilities remain explicit.
9. Fonts are embedded, subset, and Unicode mapped; PDF remains tagged.
10. The selected reference and rendered slide 9 are visually compared at the same 16:9 crop, with all P0/P1/P2 differences resolved or documented as intentional semantic corrections.
11. All 11 rendered PDF pages receive visual QA at laptop-readable scale.
