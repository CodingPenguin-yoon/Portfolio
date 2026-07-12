# Portfolio HTML

정적 HTML 포트폴리오 초안입니다. 브라우저에서 `index.html`을 바로 열 수 있고, 서버가 필요 없습니다.

## 파일 구조

- `index.html`: 포트폴리오 내용. 이름, 문장, 프로젝트 설명은 여기서 수정합니다.
- `deck.html`: PPT처럼 보이도록 만든 16:9 슬라이드덱 HTML.
- `cho-yunho-portfolio.pptx`: 실제 PPT 원본 파일.
- `cho-yunho-portfolio.pdf`: 제출용 PDF 파일.
- `slides-index.html`: 슬라이드별 PNG/PPTX 다운로드 페이지.
- `slide-images/`: PPTX를 Keynote에서 export한 슬라이드별 PNG.
- `pptx-slides/`: 슬라이드 1장씩 분리한 PPTX.
- `cho-yunho-slide-images.zip`: 슬라이드별 PNG 묶음.
- `cho-yunho-pptx-slides.zip`: 슬라이드별 PPTX 묶음.
- `klepaas.html`: K-Le-PaaS 제출용 PDF 페이지.
- `heimdall.html`: Heimdall 제출용 PDF 페이지.
- `gjallar.html`: Gjallar 제출용 PDF 페이지.
- `styles.css`: 색상, 레이아웃, 반응형 스타일.
- `slides.css`: PPT형 슬라이드덱 전용 스타일.
- `assets/klepaas-dashboard.png`: K-Le-PaaS 대표 화면 이미지.

## PDF 저장 방법

1. 편집 원본은 `cho-yunho-portfolio.pptx`입니다.
2. 제출용 PDF는 `cho-yunho-portfolio.pdf`입니다. 이 파일은 PPTX를 Keynote에서 export한 결과입니다.
3. 슬라이드별 파일은 `slides-index.html` 또는 `slide-images/`, `pptx-slides/`에서 확인합니다.
4. PPTX를 다시 생성하려면 `PYTHONPATH=/private/tmp/pptx_vendor python3 portfolio/tools/build_pptx.py`를 실행합니다.

## 사용한 공개 기준 자료

- K-Le-PaaS Backend Hybrid: https://github.com/K-Le-PaaS/backend-hybrid
- Heimdall: https://github.com/CodingPenguin-yoon/Heimdall
- Gjallar: https://github.com/CodingPenguin-yoon/Gjallar

## 더 채우면 좋아지는 정보

- 목표 직무: 플랫폼 엔지니어, DevOps, 백엔드, SRE 중 어디에 더 맞출지
- 프로젝트별 기간, 개인/팀 여부, 본인 담당 범위
- 수치 성과: 배포 시간 단축, 자동화한 작업 수, 운영 오류 감소, 테스트 수
- 연락처: 이메일, 블로그, LinkedIn, 이력서 PDF 링크
- Heimdall/Gjallar 실제 화면 스크린샷 또는 데모 캡처
