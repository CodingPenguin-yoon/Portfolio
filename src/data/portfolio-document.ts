export type DocumentStatus = 'implemented' | 'previous' | 'planned';

export type ScopeLimit =
  | 'release-image-rollback'
  | 'database-backup-restore'
  | 'database-purge'
  | 'database-credential-rotation'
  | 'data-rollback'
  | 'vm-full-lifecycle';

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
  subline?: string;
  status?: DocumentStatus;
  statusNote?: string;
  limitations: readonly ScopeLimit[];
}

export interface FlowStepData {
  id: string;
  label: string;
  qualifier?: string;
}

const klepaasEvidence = {
  label: '자연어 요청과 Kubernetes 작업 사이의 CommandPlan 경계',
  status: 'verified',
  source: 'backend-klepaas-test/backend-hybrid/app/services/commands.py:105-219',
} as const satisfies PortfolioEvidence;

export const portfolioDocument = {
  person: {
    name: '조윤호',
    role: 'Platform Engineer',
    contacts: [
      {
        label: 'Email',
        value: 'code.penguin.yoon@gmail.com',
        href: 'mailto:code.penguin.yoon@gmail.com',
      },
      {
        label: 'GitHub',
        value: 'github.com/CodingPenguin-yoon',
        href: 'https://github.com/CodingPenguin-yoon',
      },
      { label: 'Web', value: 'yoonman.page', href: 'https://yoonman.page' },
    ],
  },
  openingStory: {
    spine: ['Observe', 'Automate', 'Separate', 'Preserve'],
    problem: ['VM 생성', 'IP·네트워크', 'Docker', '내부 설정', '배포'],
    costs: ['반복', '설정 편차', '실패 지점 불명확'],
    evolution: [
      { id: 'klepaas-input', label: 'K-Le-PaaS', qualifier: '입력·실행 구조' },
      { id: 'early-heimdall', label: '초기 Heimdall', qualifier: 'Previous · VM + 설정 + 배포' },
      { id: 'scope-growth', label: '범위·의존성 증가' },
    ],
  },
  projects: {
    currentSystem: {
      zones: [
        {
          id: 'proxmox',
          label: 'PROXMOX',
          responsibility: 'Inventory & VM Runtime',
          nodes: ['Actual Inventory', 'VM Runtime Base'],
        },
        {
          id: 'gjallar-control',
          label: 'GJALLAR CONTROL',
          responsibility: 'Approved Infrastructure Create',
          nodes: ['VM Profile', 'Preflight & Approval', 'Native Create'],
        },
        {
          id: 'runtime',
          label: 'RUNTIME',
          responsibility: 'Application Release',
          nodes: ['Heimdall Worker', 'Project Gateway', 'App Generations'],
        },
        {
          id: 'storage',
          label: 'STORAGE',
          responsibility: 'User Data Lifecycle',
          nodes: ['Storage VM', 'PostgreSQL', 'Project DB & Role'],
          operationalNote: 'Operational · 사용자 확인 운영 구조',
        },
      ],
    },
    responsibilitySplit: {
      rows: [
        {
          id: 'change-trigger',
          label: 'Change trigger',
          gjallar: 'Infrastructure capacity & configuration',
          heimdall: 'Application code & configuration',
        },
        {
          id: 'execution-target',
          label: 'Execution target',
          gjallar: 'Proxmox VM',
          heimdall: 'Docker generation & route',
        },
        {
          id: 'failure-boundary',
          label: 'Failure boundary',
          gjallar: 'Approved create fails',
          heimdall: 'Candidate is not promoted',
        },
      ],
      statement: '한 시스템의 실패가 다른 시스템의 복구 경로를 오염시키지 않게 함',
    },
    gjallar: {
      path: [
        { id: 'actual-inventory', label: 'Actual Inventory' },
        { id: 'vm-profile', label: 'VM Profile' },
        { id: 'preflight', label: 'Preflight' },
        { id: 'plan', label: 'Plan' },
        { id: 'approval', label: 'Approval' },
        { id: 'native-create', label: 'Native Create' },
        { id: 'observed-after', label: 'Observed After' },
      ],
      evidenceFigure: {
        src: '/projects/gjallar.png',
        alt: 'Gjallar 운영 콘솔에서 Proxmox 노드, VM 수, 스토리지와 작업 상태를 조회하는 Overview 화면',
        caption: 'Proxmox node·VM·storage inventory와 job 상태를 확인하는 실제 운영 콘솔',
        status: 'verified',
        source: 'public/projects/gjallar.png',
      },
      scopeLimit: 'Current scope: Native Create + limited gated Start',
    },
    klepaas: {
      teamSize: 2,
      period: '2025.09 - 2025.12',
      personalDecision: {
        summary: '자연어 요청을 의도와 대상으로 해석한 뒤 CommandPlan 경계에서 실행 계획으로 정규화했습니다.',
        evidence: klepaasEvidence,
      },
      personalContributions: [
        {
          id: 'gemini-intent-entity-parsing',
          summary: 'Gemini 의도·엔티티 해석',
          evidence: {
            label: 'Gemini 의도·엔티티 해석 흐름',
            status: 'verified',
            source: 'backend-klepaas-test/backend-hybrid/app/llm/gemini.py:14-104',
          },
        },
        {
          id: 'kubernetes-command-plans',
          summary: 'Kubernetes 상태 조회·재시작 CommandPlan',
          evidence: klepaasEvidence,
        },
        {
          id: 'ingress-domain-sync',
          summary: 'Ingress 도메인·배포 URL 동기화',
          evidence: {
            label: '도메인 변경·배포 URL 동기화',
            status: 'verified',
            source: 'backend-klepaas-test/backend-hybrid/app/services/commands.py:152-169',
          },
        },
        {
          id: 'prometheus-nks-monitoring',
          summary: 'Prometheus 기반 NKS 모니터링',
          evidence: {
            label: 'Prometheus 기반 NKS 상세 모니터링',
            status: 'verified',
            source: 'backend-klepaas-test/backend-hybrid/app/api/v1/monitoring.py:26-125',
          },
        },
      ],
      pipeline: ['Natural Language', 'Intent & Entity', 'CommandPlan', 'Kubernetes / NCP', 'Feedback'],
      evidenceFigure: {
        src: '/projects/klepaas-dashboard.png',
        alt: 'K-Le-PaaS 대시보드에서 배포 상태와 자연어 명령 실행 결과를 확인하는 실제 서비스 화면',
        caption: 'K-Le-PaaS · Previous · 2인 팀 프로젝트',
        status: 'verified',
        source: 'public/projects/klepaas-dashboard.png',
      },
    },
    heimdall: {
      candidate: ['Exact Commit', 'Build', 'Generation Network', 'Start', 'Health'],
      activation: ['nginx -t', 'Atomic Replace', 'Reload', 'Route Probe', 'Current'],
      failureModes: [
        {
          id: 'build-health',
          failure: 'Build / Health 실패',
          handling: 'exact candidate cleanup',
          preserved: 'Current 유지',
        },
        {
          id: 'activation',
          failure: 'Activation 실패',
          handling: 'last-known-good config 복원',
          preserved: '이전 route 유지',
        },
        {
          id: 'worker',
          failure: 'Worker 중단',
          handling: 'DB · marker · label reconcile',
          preserved: '불확실한 candidate 보존',
        },
      ],
    },
    externalExposure: {
      zones: [
        { id: 'dns', label: 'DNS', responsibility: 'Public host names' },
        { id: 'fixed-edge', label: 'FIXED EDGE', responsibility: 'Stable public boundary' },
        { id: 'internal-routing', label: 'INTERNAL ROUTING', responsibility: 'Dynamic project routes' },
        { id: 'runtime-data', label: 'RUNTIME & DATA', responsibility: 'Application & storage' },
      ],
    },
    argus: {
      pipeline: ['Provider Adapter', 'Normalized Snapshot', 'Judgement', 'Dashboard'],
      evidenceFigure: {
        src: '/projects/argus.png',
        alt: 'Argus 대시보드에서 정규화된 snapshot과 판단 결과를 보여주는 실제 Overview 화면',
        caption: 'Argus · Implemented · provider boundary와 normalized snapshot',
        status: 'verified',
        source: 'public/projects/argus.png',
      },
    },
  },
  closingSummary: {
    projectSummaries: [
      {
        id: 'heimdall',
        boundary: 'verified-generation-promotion',
        name: 'Heimdall',
        status: 'Implemented',
        summary: 'Verified generation promotion',
      },
      {
        id: 'gjallar',
        boundary: 'approved-native-create',
        name: 'Gjallar',
        status: 'Implemented',
        summary: 'Approved native create',
      },
      {
        id: 'klepaas',
        boundary: 'verified-personal-contribution',
        name: 'K-Le-PaaS',
        status: 'Previous · 2인 팀',
        summary: 'Verified personal CommandPlan contribution',
      },
      {
        id: 'argus',
        boundary: 'provider-boundaries',
        name: 'Argus',
        status: 'Implemented',
        summary: 'Provider boundary & normalized snapshot',
      },
    ],
    technologies: 'Proxmox · Docker · Kubernetes · FastAPI · PostgreSQL · TypeScript',
    education: '광운대학교 전자통신공학과 · 2026.02 졸업',
    certifications: '정보처리기사 · 리눅스마스터 2급',
  },
  pages: [
    {
      number: 1,
      slug: 'cover',
      eyebrow: 'PORTFOLIO · PLATFORM ENGINEER',
      title: '반복되는 운영 문제를 책임과 실패 경계로 나눕니다.',
      limitations: [],
    },
    {
      number: 2,
      slug: 'problem',
      eyebrow: '01 · PROBLEM',
      title: '새 서비스를 올릴 때마다 같은 환경을 다시 만들었습니다.',
      limitations: [],
    },
    {
      number: 3,
      slug: 'evolution',
      eyebrow: '02 · EVOLUTION',
      title: '자동화의 범위가 커지자, 변경 이유가 다른 책임을 분리했습니다.',
      limitations: [],
    },
    {
      number: 4,
      slug: 'current-system',
      eyebrow: '03 · CURRENT SYSTEM',
      title: '실행 기반, 배포 세대, 사용자 데이터의 수명주기를 분리했습니다.',
      status: 'implemented',
      limitations: [],
    },
    {
      number: 5,
      slug: 'responsibility-split',
      eyebrow: '04 · RESPONSIBILITY',
      title: '같은 홈랩 안에서도 실패 경계는 달라야 했습니다.',
      limitations: [],
    },
    {
      number: 6,
      slug: 'gjallar',
      eyebrow: '05 · GJALLAR',
      title: '실제 상태를 확인한 뒤, 승인된 요청만 Proxmox에 반영합니다.',
      status: 'implemented',
      limitations: ['vm-full-lifecycle'],
    },
    {
      number: 7,
      slug: 'heimdall-promotion',
      eyebrow: '06 · HEIMDALL PROMOTION',
      title: '검증된 세대만 Current로 승격합니다.',
      status: 'implemented',
      limitations: [],
    },
    {
      number: 8,
      slug: 'failure-boundary',
      eyebrow: '07 · FAILURE BOUNDARY',
      title: '실패할수록 자동 삭제보다 보존 범위를 좁혔습니다.',
      status: 'implemented',
      limitations: [
        'release-image-rollback',
        'database-backup-restore',
        'database-purge',
        'database-credential-rotation',
        'data-rollback',
      ],
    },
    {
      number: 9,
      slug: 'planned-exposure',
      eyebrow: '08 · PLANNED EXPOSURE',
      title: '외부 Edge는 고정하고 동적 라우팅은 내부에서 처리합니다.',
      status: 'planned',
      statusNote: 'Public exposure architecture',
      limitations: [],
    },
    {
      number: 10,
      slug: 'origin-transfer',
      eyebrow: '09 · ORIGIN & TRANSFER',
      title: '입력을 정규화한 뒤 실행하는 구조를 다른 문제에도 적용했습니다.',
      limitations: [],
    },
    {
      number: 11,
      slug: 'resume-contact',
      eyebrow: '10 · RESUME & CONTACT',
      title: '운영 문제를 발견하고, 자동화한 뒤, 실패 경계를 다시 설계합니다.',
      limitations: [],
    },
  ] satisfies readonly PortfolioPageData[],
} as const;
