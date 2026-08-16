export type DocumentStatus = 'implemented' | 'previous' | 'planned';

export type ScopeLimit = 'release-image-rollback' | 'database-backup-restore' | 'database-purge' | 'vm-full-lifecycle';

export type EvidenceStatus = 'verified' | 'user-confirmed' | 'planned';

export interface PortfolioEvidence {
  label: string;
  status: EvidenceStatus;
  source: string;
}

export interface PortfolioPageData {
  number: number;
  slug: string;
  eyebrow: string;
  title: string;
  thesis: string;
  status?: DocumentStatus;
  statusNote?: string;
  facts: readonly string[];
  decisions: readonly string[];
  flows: readonly (readonly string[])[];
  evidence: readonly PortfolioEvidence[];
  limitations: readonly ScopeLimit[];
}

export type KlepaasContributionId =
  | 'gemini-intent-entity-parsing'
  | 'kubernetes-command-plans'
  | 'ingress-domain-sync'
  | 'prometheus-nks-monitoring';

export interface PersonalContribution {
  id: KlepaasContributionId;
  summary: string;
  evidence: PortfolioEvidence;
}

export interface KlepaasProjectData {
  teamSize: 2;
  teamOutcome: readonly string[];
  personalContributions: readonly PersonalContribution[];
}

export const portfolioDocument = {
  person: {
    name: '조윤호',
    role: 'Platform Engineer',
    positioning:
      '반복되는 인프라 운영과 배포 문제를 자동화하고, 책임 경계와 실패 복구 구조를 설계하는 신입 플랫폼 엔지니어',
  },
  projects: {
    klepaas: {
      teamSize: 2,
      teamOutcome: [
        '자연어 요청을 의도와 대상으로 해석해 실행 가능한 CommandPlan으로 변환했습니다.',
        '명령 계획을 Kubernetes·NCP 작업에 연결하고 상태와 결과를 기록했습니다.',
        '영향이 큰 작업은 사용자 확인 뒤 실행하도록 대기 상태를 뒀습니다.',
      ],
      personalContributions: [
        {
          id: 'gemini-intent-entity-parsing',
          summary: '자연어 요청에서 실행 대상과 의도를 추출하는 Gemini 흐름을 구현했습니다.',
          evidence: {
            label: 'Gemini 의도·엔티티 해석 흐름과 작성 commit',
            status: 'verified',
            source: 'backend-klepaas-test/backend-hybrid/app/llm/gemini.py:14-104',
          },
        },
        {
          id: 'kubernetes-command-plans',
          summary: 'Pod·Service·Deployment 상태 조회와 재시작 명령을 CommandPlan으로 연결했습니다.',
          evidence: {
            label: 'Kubernetes 상태 조회·재시작 명령 계획과 작성 commit',
            status: 'verified',
            source: 'backend-klepaas-test/backend-hybrid/app/services/commands.py:171-219',
          },
        },
        {
          id: 'ingress-domain-sync',
          summary: 'Ingress 도메인 변경과 배포 URL 동기화 흐름을 맡았습니다.',
          evidence: {
            label: '도메인 변경·배포 URL 동기화와 작성 commit',
            status: 'verified',
            source: 'backend-klepaas-test/backend-hybrid/app/services/commands.py:152-169',
          },
        },
        {
          id: 'prometheus-nks-monitoring',
          summary: 'Prometheus 메트릭을 NKS 리소스 상태 화면에 연결했습니다.',
          evidence: {
            label: 'Prometheus 기반 NKS 상세 모니터링과 작성 commit',
            status: 'verified',
            source: 'backend-klepaas-test/backend-hybrid/app/api/v1/monitoring.py:26-125',
          },
        },
      ],
    } satisfies KlepaasProjectData,
  },
  pages: [
    {
      number: 1,
      slug: 'cover',
      eyebrow: 'PORTFOLIO',
      title: '운영의 반복을 구조로 바꿉니다.',
      thesis: '반복 작업을 자동화하는 것에서 시작해 시스템의 책임 경계와 실패 복구 구조까지 설계했습니다.',
      facts: ['Platform Engineer / DevOps / Infrastructure Automation을 목표 직무로 삼습니다.'],
      decisions: ['프로젝트 이미지 대신 이름, 직무, 핵심 문장을 첫 화면에 둡니다.'],
      flows: [],
      evidence: [],
      limitations: [],
    },
    {
      number: 2,
      slug: 'profile',
      eyebrow: 'PROFILE',
      title: '플랫폼 운영이라는 하나의 문제를 다뤘습니다.',
      thesis: '배포 자동화, VM 생성, 실행 상태 추적을 서로 연결된 운영 문제로 풀었습니다.',
      facts: [
        'Heimdall은 애플리케이션 배포를, Gjallar는 VM 생성을 자동화합니다.',
        'K-Le-PaaS는 자동화의 입력·실행·피드백 구조를 경험한 팀 프로젝트입니다.',
        'Argus는 공급자별 입력을 분리하고 정규화한 보조 프로젝트입니다.',
      ],
      decisions: ['대표 프로젝트 세 개와 보조 프로젝트 하나로 경험의 위계를 구분합니다.'],
      flows: [],
      evidence: [],
      limitations: [],
    },
    {
      number: 3,
      slug: 'origin',
      eyebrow: 'ORIGIN',
      title: '반복 설정이 자동화의 출발점이었습니다.',
      thesis: 'VM 생성부터 IP·네트워크·Docker·배포까지 매번 반복되는 작업과 설정 편차를 줄이고 싶었습니다.',
      facts: ['홈랩을 반복되는 운영 문제를 확인하고 자동화를 검증하는 환경으로 사용했습니다.'],
      decisions: ['감정적인 불편보다 반복 단계와 설정 편차를 문제로 정의했습니다.'],
      flows: [['VM 생성', 'IP·네트워크 설정', 'Docker 설치', '애플리케이션 배포']],
      evidence: [],
      limitations: [],
    },
    {
      number: 4,
      slug: 'evolution',
      eyebrow: 'EVOLUTION',
      title: '큰 자동화 하나를 두 개의 책임으로 나눴습니다.',
      thesis: 'VM 생성과 애플리케이션 배포는 변경 주기와 실패 영향이 달랐습니다.',
      facts: [
        '초기 Heimdall은 Terraform 기반 VM 생성, Ansible 설정, 애플리케이션 배포를 함께 다뤘습니다.',
        '현재 Gjallar는 Proxmox native VM 생성 경로를, Heimdall은 애플리케이션 배포를 담당합니다.',
      ],
      decisions: ['변경 이유와 실패 영향이 다른 VM 관리와 애플리케이션 배포의 소유권을 분리했습니다.'],
      flows: [
        ['K-Le-PaaS', '초기 Heimdall'],
        ['초기 Heimdall', 'Gjallar: VM 생성', 'Heimdall: 애플리케이션 배포'],
      ],
      evidence: [
        {
          label: '초기 Heimdall의 stop-old-then-run-new 배포 방식',
          status: 'verified',
          source: '02_Heimdall/product/apps/api/app/services/executor_local_docker.py:802-951',
        },
        {
          label: 'Gjallar의 legacy IaC dependency 제거 결정',
          status: 'verified',
          source: '01_Gjallar/docs/decisions/0002-remove-legacy-iac-readiness.md:9-29',
        },
      ],
      limitations: [],
    },
    {
      number: 5,
      slug: 'klepaas',
      eyebrow: 'K-LE-PAAS',
      title: '자동화는 실행보다 입력과 피드백까지 포함해야 했습니다.',
      thesis:
        '자연어 요청을 Kubernetes 명령으로 바꾸고 결과를 되돌려주는 흐름에서 플랫폼 자동화의 기본 구조를 경험했습니다.',
      status: 'previous',
      statusNote: '2인 팀 프로젝트이며 팀 기능과 개인 기여를 분리해 설명합니다.',
      facts: [
        'Gemini 해석 결과를 실행 가능한 CommandPlan으로 변환합니다.',
        '영향이 큰 작업은 대기 상태로 전환하고 사용자 확인 뒤 실행합니다.',
        '명령의 해석, 상태, 결과를 저장해 실행 경로를 추적합니다.',
      ],
      decisions: ['자연어 입력과 실제 Kubernetes 작업 사이에 확인 가능한 명령 계획을 뒀습니다.'],
      flows: [['자연어 요청', '의도·대상 해석', 'CommandPlan', 'Kubernetes·NCP 작업', '실행 결과']],
      evidence: [
        {
          label: '자연어 해석과 CommandPlan 생성',
          status: 'verified',
          source: 'backend-klepaas-test/backend-hybrid/app/api/v1/nlp.py:101-174',
        },
        {
          label: 'Kubernetes·NCP 작업 실행',
          status: 'verified',
          source: 'backend-klepaas-test/backend-hybrid/app/services/commands.py:572-670',
        },
      ],
      limitations: [],
    },
    {
      number: 6,
      slug: 'system-map',
      eyebrow: 'CURRENT SYSTEM',
      title: '실행 기반, 배포, 데이터의 수명주기를 분리했습니다.',
      thesis: 'Proxmox 위에서 Gjallar는 VM을, Heimdall은 배포 세대를, Storage VM은 사용자 데이터를 책임집니다.',
      status: 'implemented',
      statusNote: 'Storage VM 운영은 사용자 확인 사항이며 저장소 근거와 분리해 표시합니다.',
      facts: [
        'Gjallar는 Proxmox inventory 조회와 native VM create를 제공합니다.',
        'Heimdall은 Docker 실행 세대를 만들고 검증한 후보만 current로 승격합니다.',
        'PostgreSQL은 별도 Storage VM에서 운영 중인 것으로 확인됐습니다.',
      ],
      decisions: ['애플리케이션 실행 환경과 사용자 데이터의 수명주기를 분리했습니다.'],
      flows: [
        ['Proxmox', 'Gjallar', 'Runtime VM'],
        ['Heimdall', 'Docker generation', 'Project Gateway'],
        ['Runtime application', 'Storage VM / PostgreSQL'],
      ],
      evidence: [
        {
          label: 'Gjallar current state',
          status: 'verified',
          source: '01_Gjallar/docs/overview/current-state.md',
        },
        {
          label: '별도 PostgreSQL Storage VM 운영',
          status: 'user-confirmed',
          source: '사용자의 현재 운영 설명',
        },
      ],
      limitations: [],
    },
    {
      number: 7,
      slug: 'responsibility',
      eyebrow: 'DESIGN DECISION',
      title: '같은 홈랩 안에서도 실패 경계는 달라야 했습니다.',
      thesis: '인프라 생성 실패와 후보 배포 실패가 서로의 상태를 오염시키지 않도록 소유권을 나눴습니다.',
      status: 'implemented',
      facts: [
        'Gjallar의 주요 대상은 Proxmox VM이고 변경 이유는 인프라 용량과 구성입니다.',
        'Heimdall의 주요 대상은 Docker 실행 세대이고 변경 이유는 애플리케이션 릴리스입니다.',
      ],
      decisions: ['VM 생성과 애플리케이션 배포를 같은 시스템이 소유하지 않도록 분리했습니다.'],
      flows: [
        ['인프라 요청', 'Gjallar', 'VM 생성 실패 경계'],
        ['릴리스 요청', 'Heimdall', '후보 배포 실패 경계'],
      ],
      evidence: [
        {
          label: 'Gjallar native create 결정',
          status: 'verified',
          source: '01_Gjallar/docs/decisions/0001-proxmox-native-create-vm.md:9-28',
        },
        {
          label: 'Heimdall candidate generation 구현',
          status: 'verified',
          source: 'heimdall_final/backend/src/heimdall/runtime/docker.py:99-251',
        },
      ],
      limitations: [],
    },
    {
      number: 8,
      slug: 'gjallar',
      eyebrow: 'GJALLAR',
      title: 'Proxmox의 실제 상태를 기준으로 VM 생성을 반복 가능하게 만들었습니다.',
      thesis: '정책을 담은 VM Profile과 실제 Template Inventory를 분리하고, 승인된 요청만 native API로 실행합니다.',
      status: 'implemented',
      statusNote: '현재 범위는 native Create VM과 제한된 gated operations입니다.',
      facts: [
        'Proxmox inventory를 actual state의 source of truth로 사용합니다.',
        '용도별 profile은 CPU, 메모리, 디스크 범위와 access 권장값을 재사용합니다.',
        '고정 IP, bridge, storage, template 조건을 생성 전에 확인합니다.',
        '기본은 정지 상태로 생성하고 선택 시 guest-agent IP와 cloud-init 완료까지 검증합니다.',
      ],
      decisions: [
        'Terraform executor 대신 Proxmox clone, config, task API를 사용합니다.',
        'draft, preflight, plan, approval, preview 뒤 명시적 승인에서만 Proxmox 상태를 변경합니다.',
      ],
      flows: [['요청', '검증', '계획', '승인', '생성·설정', '상태 확인']],
      evidence: [
        {
          label: 'VM profile schema와 create contract',
          status: 'verified',
          source: '01_Gjallar/backend/tests/contracts/test_api_v1_vm_create.py:64-101',
        },
        {
          label: 'Create VM preflight와 승인 흐름',
          status: 'verified',
          source: '01_Gjallar/docs/features/create-vm.md',
        },
      ],
      limitations: ['vm-full-lifecycle'],
    },
    {
      number: 9,
      slug: 'heimdall-promotion',
      eyebrow: 'HEIMDALL',
      title: '검증된 세대만 Current로 승격합니다.',
      thesis:
        '고정된 commit으로 후보 세대를 만든 뒤 health check와 실제 route probe를 모두 통과해야 트래픽을 전환합니다.',
      status: 'implemented',
      facts: [
        '요청 시 고정한 commit과 설정 snapshot으로 generation candidate를 빌드합니다.',
        '세대별 network와 고유 service alias로 후보 실행 환경을 분리합니다.',
        '프로젝트별 PostgreSQL DB와 login role을 만들고 접속을 검증합니다.',
        'DB 접근을 선언한 서비스에만 배포 시점 연결 정보와 read-only secret을 전달합니다.',
      ],
      decisions: [
        'service health와 Nginx route가 모두 정상일 때만 current metadata를 전환합니다.',
        '이전 세대는 성공이 확정된 뒤에만 회수합니다.',
      ],
      flows: [
        [
          'commit checkout',
          'image build',
          'candidate 실행',
          'health check',
          'Nginx 검증·교체',
          'route probe',
          'current 승격',
        ],
      ],
      evidence: [
        {
          label: 'candidate build와 generation network',
          status: 'verified',
          source: 'heimdall_final/backend/src/heimdall/runtime/docker.py:99-251',
        },
        {
          label: 'Nginx 활성화와 route probe',
          status: 'verified',
          source: 'heimdall_final/backend/src/heimdall/runtime/gateway.py:151-214',
        },
        {
          label: '프로젝트 DB와 login role 생성',
          status: 'verified',
          source: 'heimdall_final/backend/src/heimdall/project_database/service.py:38-160',
        },
      ],
      limitations: ['release-image-rollback', 'database-backup-restore'],
    },
    {
      number: 10,
      slug: 'heimdall-failure',
      eyebrow: 'FAILURE DESIGN',
      title: '실패할수록 보존 범위를 좁혔습니다.',
      thesis: '활성화 실패에는 직전 정상 경로를 복원하고, 상태가 불확실할 때는 자동 삭제보다 보존을 선택합니다.',
      status: 'implemented',
      statusNote: '이미지·데이터 rollback과 DB purge·backup·restore는 구현 범위가 아닙니다.',
      facts: [
        '승격 전 실패는 기존 current와 active metadata를 유지합니다.',
        '활성화 실패 시 last-known-good Nginx 설정과 이전 세대를 유지합니다.',
        '재시작 시 Control DB, Nginx marker, Docker label을 비교해 상태를 조정합니다.',
        '실패한 배포 ID와 label이 일치하는 후보만 정리합니다.',
        '배포 진단을 남기되 DB와 사용자 secret은 마스킹합니다.',
      ],
      decisions: [
        '실행 세대, 라우팅 설정, 데이터 수명주기를 서로 다른 실패 범위로 다룹니다.',
        '상태를 확정할 수 없으면 자동 삭제보다 후보 보존을 선택합니다.',
      ],
      flows: [
        ['source deployment 실패', 'candidate 미승격', 'current 유지'],
        ['route activation 실패', 'last-known-good 복원', '이전 세대 유지'],
        ['worker interruption', 'reconciliation', '불확실한 후보 보존'],
        ['runtime generation', '독립된 PostgreSQL 데이터 수명주기'],
      ],
      evidence: [
        {
          label: '활성화 실패 복구',
          status: 'verified',
          source: 'heimdall_final/backend/src/heimdall/runtime/gateway.py:215-257',
        },
        {
          label: 'Worker 재시작 reconciliation',
          status: 'verified',
          source: 'heimdall_final/backend/src/heimdall/runtime/docker.py:400-448',
        },
        {
          label: 'exact candidate cleanup',
          status: 'verified',
          source: 'heimdall_final/backend/src/heimdall/runtime/docker.py:450-469',
        },
      ],
      limitations: ['release-image-rollback', 'database-backup-restore', 'database-purge'],
    },
    {
      number: 11,
      slug: 'external-exposure',
      eyebrow: 'PLANNED ARCHITECTURE',
      title: '외부 Edge는 고정하고 동적 라우팅은 내부에서 처리합니다.',
      thesis: 'Control Web과 배포 도메인을 분리하고 OCI Edge에서 홈랩 내부 Ingress까지 하나의 중계 경계를 둡니다.',
      status: 'planned',
      statusNote: '방향과 책임 경계만 확정된 향후 구조입니다.',
      facts: [
        'Control Web과 사용자 배포용 wildcard domain을 분리할 계획입니다.',
        'OCI Edge는 공인 TLS 종료와 Host 전달을 담당하도록 계획했습니다.',
        '도메인별 동적 중계는 홈랩 내부 Ingress가 담당하도록 계획했습니다.',
      ],
      decisions: ['배포마다 OCI 설정을 바꾸지 않고 외부 Edge와 내부 동적 라우팅의 책임을 나눕니다.'],
      flows: [
        ['DNS', 'OCI Edge Nginx', 'WireGuard', 'Internal Ingress Nginx', 'Project Gateway', 'Runtime application'],
        ['Runtime application', 'Storage VM / PostgreSQL'],
      ],
      evidence: [
        {
          label: '외부 공개 구조 설계',
          status: 'planned',
          source: '사용자가 제공한 외부 공개 구조 설계',
        },
      ],
      limitations: [],
    },
    {
      number: 12,
      slug: 'argus',
      eyebrow: 'ARGUS',
      title: '다른 문제에도 입력 경계를 분리하는 원칙을 적용했습니다.',
      thesis: '서로 다른 데이터 공급자를 독립적으로 수집하고 정규화해 비교 가능한 판단 흐름으로 만들었습니다.',
      status: 'implemented',
      facts: [
        '파생, 현물, 뉴스 공급자를 독립된 adapter로 수집합니다.',
        '원천 상태와 정규화 snapshot을 SQLite에 기록합니다.',
        'Next.js 대시보드로 수집 결과를 확인합니다.',
      ],
      decisions: ['공급자별 수집 경계와 공통 비교 형식을 분리했습니다.'],
      flows: [['파생 데이터', '뉴스·매크로', '현물 반응', '비교 가능한 판단 흐름']],
      evidence: [
        {
          label: '공급자별 adapter와 수집 구조',
          status: 'verified',
          source: 'argus_renewal/README.md:43-76',
        },
        {
          label: 'Argus 대시보드',
          status: 'verified',
          source: 'argus_renewal/frontend/src/app/argus',
        },
      ],
      limitations: [],
    },
    {
      number: 13,
      slug: 'resume-contact',
      eyebrow: 'RESUME & CONTACT',
      title: '문제를 발견하고, 자동화하고, 실패 경계를 다시 설계합니다.',
      thesis: '플랫폼 엔지니어로서 반복 가능한 운영 구조를 만들겠습니다.',
      facts: ['대표 프로젝트의 역할과 상태, 핵심 기술, 교육·자격, 연락처를 한 페이지에 요약합니다.'],
      decisions: ['별도의 감사 인사 페이지를 추가하지 않고 판단과 연락처로 문서를 마칩니다.'],
      flows: [],
      evidence: [],
      limitations: [],
    },
  ] satisfies PortfolioPageData[],
} as const;
