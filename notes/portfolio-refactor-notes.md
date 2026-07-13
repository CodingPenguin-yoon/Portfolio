# 변경 요약

- 홈을 evidence-first 구조로 재작성했습니다.
- Hero에서 포지션, 대표 프로젝트, 핵심 스택, 문제 해결 영역, 이력서/대표 프로젝트/GitHub CTA를 1스크린 안에 배치했습니다.
- Quick Proof Strip, Featured Projects, Troubleshooting / Key Decisions, Working Principles, Resume / Contact CTA 섹션으로 정보 구조를 재정렬했습니다.
- 프로젝트 데이터와 카피를 `src/data/portfolio.ts`로 통합해 홈, 상세 페이지, 네비게이션, 이력서 페이지가 같은 소스를 참조하도록 변경했습니다.
- `Heimdall`, `K-Le-PaaS`, `Argus`를 reusable project detail template로 렌더링하도록 구성했습니다.
- 상세 페이지에 Problem, Architecture, Workflow / Before-After, Key Decisions, Troubleshooting, Outcome & Learning 섹션을 추가했습니다.
- `Argus`는 `/archive/argus`로 이동시키고 홈에서는 Additional Project로 비중을 낮췄습니다.
- `/resume` 페이지와 정적 PDF 다운로드 경로 `public/resume/yunho-cho-resume.pdf`를 추가했습니다.
- 네비게이션과 푸터를 채용용 흐름에 맞게 단순화했고, direct links 영역에 Resume / Portfolio URL / Email placeholder를 노출했습니다.
- 전역 스타일에서 배경 glow를 줄이고, 버튼/카드/포커스 링을 더 성숙한 제품 UI 톤으로 정리했습니다.
- 기본 SEO title / description과 project page metadata를 채용용 카피에 맞게 정리했습니다.

# 추가로 사용자가 채워야 할 정보 목록

- `src/config.yaml`
  - `site.site`: 실제 배포 도메인으로 교체

- `src/data/portfolio.ts`
  - `portfolioProfile.email`: 실제 연락 가능한 이메일
  - `portfolioProfile.shortUrl`: 실제 짧은 포트폴리오 URL
  - `portfolioProfile.resumeHref`: 최종 resume PDF 경로로 교체 여부 확인
  - 각 프로젝트의 `period`: 정확한 기간 입력
  - 각 프로젝트의 `nextSteps`에 들어간 `TODO` 문구를 실제 수치/계획으로 교체
  - Heimdall / K-Le-PaaS / Argus의 architecture diagram 이미지 경로가 생기면 `architecture.diagram` 필드 추가

- `public/resume/yunho-cho-resume.pdf`
  - 현재는 placeholder PDF입니다.
  - 최종 이력서 PDF로 교체 필요

- 프로젝트 상세 페이지 보강 권장
  - Heimdall: 실제 배포 시간 절감, 운영 단계 축소, 실패 분석 시간 절감 등 measurable outcome 추가
  - K-Le-PaaS: 팀 프로젝트에서 본인 기여 범위와 실제 운영 환경 규모 추가
  - Argus: 타깃 포지션과 연결되는 운영 파이프라인 관점만 더 압축해서 정리

- 이미지/메타 보강 권장
  - OG 전용 이미지 준비 시 `src/config.yaml`의 `metadata.openGraph.images` 교체
  - 각 프로젝트 architecture 섹션에 실제 다이어그램 캡처 또는 주석 이미지 추가
