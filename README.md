# Yunho Cho Portfolio

조윤호의 홈페이지, 프로젝트 상세 페이지, 웹 이력서를 하나의 Astro 애플리케이션으로 관리합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

기본 개발 서버는 `http://localhost:4321`에서 실행됩니다.

## 검증과 빌드

```bash
npm run check:astro
npm run check:eslint
npm run build
```

## Portfolio document

- Web preview: `/portfolio`
- PDF: `output/pdf/yunho-cho-portfolio.pdf`
- Prerequisites:
  - A Node.js version accepted by `package.json` (Node 18.17.1 or newer) and `npm ci`.
  - Playwright 1.55's pinned Chromium: `npx playwright install chromium`.
  - Poppler command-line tools: `pdfinfo`, `pdffonts`, `pdfimages`, `pdftotext`, and `pdftoppm` (`brew install poppler` on macOS).

- Verify:

  ```bash
  npm run check:astro
  npm run check:eslint
  npm run check:portfolio-format
  npm run build
  npm run test:portfolio
  ```

- Export: start `npm run preview -- --host 127.0.0.1 --port 4322`, then run `npm run portfolio:pdf`.
- Inspect the canonical artifact:

  ```bash
  pdfinfo -f 1 -l 14 -box output/pdf/yunho-cho-portfolio.pdf
  pdffonts output/pdf/yunho-cho-portfolio.pdf
  pdfimages -list output/pdf/yunho-cho-portfolio.pdf
  pdftotext -layout output/pdf/yunho-cho-portfolio.pdf -
  pdftoppm -r 144 -png output/pdf/yunho-cho-portfolio.pdf tmp/pdfs/pages/page
  ```

  `npm run test:portfolio` automates the 14-page 16:9, tagged-PDF, embedded-font, image-page, and text-order assertions. The 144 DPI PNGs remain the visual layout check for every page.

## Docker

```bash
docker compose up --build -d
docker compose ps
```

컨테이너는 `http://localhost:8088`에서 실행됩니다. 다른 포트가 필요하면 `PORT=9090 docker compose up --build -d`처럼 지정할 수 있습니다.

```bash
docker compose down
```

## 주요 경로

- `/`: 홈페이지와 프로젝트 요약
- `/projects/{slug}`: 프로젝트 상세 페이지
- `/resume`: 웹 이력서
- `/resume/yunho-cho-resume.pdf`: PDF 이력서
