# 조윤호 포트폴리오

운영 자동화, 플랫폼 설계, 금융 데이터 분석·가공 서비스를 중심으로 정리한 개인 포트폴리오 사이트입니다.

현재 메인 메시지는 아래 기준으로 정리되어 있습니다.

- 복잡한 운영과 판단 과정을 자동화 가능한 시스템으로 바꾸는 엔지니어
- 자연어 기반 운영 제어
- 인프라 자동화 워크플로우
- 금융 데이터 분석·가공 서비스

## 대표 프로젝트

### K-Le-PaaS

자연어 기반 Kubernetes PaaS / 자체 구축 PaaS 운영 플랫폼

자연어로 Kubernetes를 제어하고 배포 즉시 도메인을 연결하는 자체 구축 PaaS 운영 플랫폼입니다.

- 자연어 -> kubectl 명령 변환 파이프라인
- 배포 시 서브도메인 자동 생성과 Ingress·DNS 연동
- Kubernetes 클러스터와 배포 인프라 직접 구축
- 배포 상태 추적 / 할당 도메인 관리

### Heimdall

인프라 자동화 제어면 / VM 배포와 후처리 워크플로우 기반

- Proxmox 템플릿 클론 기반 VM 배포 엔진
- Terraform·Ansible 연동
- Task·SSE 기반 상태 추적 UI
- 로드맵: GitLab 중심 개발자 셀프서비스 환경 플랫폼

### Argus

금융 데이터 분석·가공 서비스 / 해석형 금융 정보 서비스

- 뉴스·파생·매크로 데이터 수집·가공 흐름 설계
- 대시보드, AI 인사이트, 수급, 뉴스, 매크로 캘린더 구성
- Provider·Adapter 패턴과 Mock·File 기반 실행 구조

## 기술 구성

- Astro 5
- Tailwind CSS
- TypeScript
- AstroWind 기반 커스텀 테마

포트폴리오 내부 카피와 UI는 아래 방향으로 커스텀했습니다.

- 다크 테마 유지
- 터미널 모티프 기반 히어로
- 프로젝트 카드 중심 레이아웃
- 레트로 게임 감성의 픽셀 타이틀 폰트

## 로컬 실행

```bash
npm install
npm run dev
```

## 검증

```bash
npx astro check
```

## 빌드

```bash
npm run build
```

일부 템플릿 샘플 페이지는 원격 이미지에 의존할 수 있어 네트워크 환경에 따라 빌드가 실패할 수 있습니다.

## 주요 파일

- `src/pages/index.astro`: 메인 포트폴리오 페이지
- `src/data/portfolio.ts`: 카피와 프로젝트 데이터
- `src/components/CustomStyles.astro`: 폰트와 전역 스타일
- `src/assets/styles/tailwind.css`: 버튼과 공통 UI 스타일
- `src/navigation.ts`: 헤더와 푸터 네비게이션
