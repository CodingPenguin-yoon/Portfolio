export type DocumentStatus = 'implemented' | 'previous' | 'planned';

export type ScopeLimit =
  | 'release-image-rollback'
  | 'database-backup-restore'
  | 'database-purge'
  | 'database-credential-rotation'
  | 'data-rollback'
  | 'vm-full-lifecycle';

export type EvidenceStatus = 'verified' | 'user-confirmed' | 'planned';

export type ArchitectureConnectionStatus = 'active' | 'operational' | 'planned' | 'external';

export interface ArchitectureZoneData {
  id: string;
  label: string;
  responsibility: string;
  systemNode?: 'platform' | 'control' | 'runtime' | 'storage';
  details?: readonly string[];
  operationalNote?: string;
}

export interface ArchitectureConnectionData {
  fromZoneId: ArchitectureZoneData['id'];
  toZoneId: ArchitectureZoneData['id'];
  label: string;
  status: ArchitectureConnectionStatus;
}

export interface FlowStepData {
  id: string;
  label: string;
  summary?: string;
  operations?: readonly {
    id: string;
    label: string;
  }[];
}

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
  lessons: readonly [string, string, string];
  evidenceFigure: {
    src: string;
    alt: string;
    caption: string;
    status: EvidenceStatus;
    source: string;
  };
}

export type CurrentSystemZoneId = 'proxmox' | 'gjallar-control' | 'runtime' | 'storage';

export interface CurrentSystemData {
  zones: readonly (ArchitectureZoneData & { id: CurrentSystemZoneId })[];
  connections: readonly (ArchitectureConnectionData & {
    fromZoneId: CurrentSystemZoneId;
    toZoneId: CurrentSystemZoneId;
  })[];
  caption: string;
}

export type ResponsibilityRowId =
  | 'responsibility'
  | 'change-reason'
  | 'execution-target'
  | 'failure-impact'
  | 'current-scope';

export interface ResponsibilitySplitData {
  rows: readonly {
    id: ResponsibilityRowId;
    label: string;
    gjallar: string;
    heimdall: string;
  }[];
  before: { label: string; summary: string };
  after: { label: string; summary: string };
}

export type GjallarLayerId = 'actual-state' | 'policy' | 'preflight' | 'execution' | 'outcome';

export interface GjallarProjectData {
  layers: readonly {
    id: GjallarLayerId;
    label: string;
    title: string;
    summary: string;
  }[];
  evidenceFigure: {
    src: string;
    alt: string;
    caption: string;
    status: EvidenceStatus;
    source: string;
  };
  scopeLimit: string;
}

export type HeimdallPromotionStepId =
  | 'exact-commit'
  | 'build'
  | 'generation-network'
  | 'candidate-start'
  | 'service-health'
  | 'nginx-validate-route-probe'
  | 'current-metadata-previous-retirement';

export type HeimdallPromotionOutcomeId = 'execution-success' | 'traffic-activation-success';

export type HeimdallFailureModeId = 'build-health' | 'nginx-activation' | 'worker-interruption' | 'app-deployment-data';

export interface HeimdallProjectData {
  promotion: {
    steps: readonly (FlowStepData & { id: HeimdallPromotionStepId })[];
    outcomes: readonly {
      id: HeimdallPromotionOutcomeId;
      label: string;
      summary: string;
    }[];
    implementationClaims: readonly {
      id: 'generation-isolation' | 'retirement-after-activation-success';
      label: string;
      summary: string;
    }[];
    databaseCapabilities: readonly {
      id: 'project-db-role-provisioning' | 'deployment-database-injection';
      label: string;
      summary: string;
    }[];
  };
  failureModes: readonly {
    id: HeimdallFailureModeId;
    failure: string;
    handling: string;
    preserved: string;
    limitation: string;
    scopeLimits: readonly ScopeLimit[];
  }[];
  reconciliationPolicy: string;
  storageBoundary: string;
}

export type ExternalExposureZoneId =
  | 'control-dns'
  | 'deployment-dns'
  | 'oci-edge'
  | 'wireguard'
  | 'external-network-ingress'
  | 'project-gateway'
  | 'runtime-application'
  | 'storage-postgresql';

export interface ExternalExposureData {
  zones: readonly (ArchitectureZoneData & { id: ExternalExposureZoneId })[];
  connections: readonly (ArchitectureConnectionData & {
    fromZoneId: ExternalExposureZoneId;
    toZoneId: ExternalExposureZoneId;
    status: 'planned';
  })[];
  caption: string;
  routingBoundary: string;
}

export type ArgusStageId = 'provider-adapter' | 'normalized-snapshot' | 'judgement' | 'dashboard';

export interface ArgusProjectData {
  stages: readonly {
    id: ArgusStageId;
    label: string;
  }[];
  evidenceFigure: {
    src: string;
    alt: string;
    caption: string;
    status: EvidenceStatus;
    source: string;
    focus: {
      id: string;
      label: string;
    };
  };
}

export type SummaryProjectId = 'heimdall' | 'gjallar' | 'klepaas' | 'argus';

export type SummaryBoundaryId =
  | 'verified-generation-promotion'
  | 'approved-native-create'
  | 'verified-personal-contribution'
  | 'provider-boundaries';

export interface ClosingSummaryData {
  projectSummaries: readonly {
    id: SummaryProjectId;
    boundary: SummaryBoundaryId;
    name: string;
    scope: string;
    summary: string;
  }[];
  techCategories: readonly {
    id: string;
    label: string;
    items: readonly string[];
  }[];
  education: {
    school: string;
    major: string;
    status: string;
    date: string;
  };
  certifications: readonly string[];
}

export const portfolioDocument = {
  person: {
    name: '조윤호',
    role: 'Platform Engineer',
    positioning:
      '반복되는 인프라 운영과 배포 문제를 자동화하고, 책임 경계와 실패 복구 구조를 설계하는 신입 플랫폼 엔지니어',
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
    profileAxes: [
      {
        label: '배포 자동화',
        project: 'Heimdall',
        summary: '후보 실행 환경을 만들고 검증한 뒤 현재 세대로 승격합니다.',
      },
      {
        label: 'VM 생성 자동화',
        project: 'Gjallar',
        summary: '실제 Proxmox 상태를 기준으로 승인된 VM 생성 요청을 실행합니다.',
      },
      {
        label: '상태와 실패 추적',
        project: 'K-Le-PaaS',
        summary: '입력 해석부터 실행 결과까지 확인 가능한 흐름으로 연결합니다.',
      },
    ],
    secondaryProject: {
      name: 'Argus',
      summary: '공급자별 입력 경계를 분리하고 비교 가능한 형태로 정규화한 보조 프로젝트입니다.',
    },
    originCosts: [
      { label: '수동 입력', summary: '새 환경마다 같은 값을 다시 입력해야 했습니다.' },
      { label: '설정 편차', summary: '작업 순서와 설정이 실행할 때마다 달라질 수 있었습니다.' },
      { label: '복구 어려움', summary: '어느 단계에서 실패했는지 확인하고 되돌리기 어려웠습니다.' },
    ],
    evolutionStages: [
      {
        label: 'K-Le-PaaS',
        summary: '입력, 실행 계획, 작업 결과를 연결하는 배포 자동화를 경험했습니다.',
      },
      {
        label: '초기 Heimdall',
        summary: 'Terraform VM 생성, Ansible 설정, 애플리케이션 배포를 한 시스템에 모았습니다.',
        status: 'Previous',
      },
      {
        label: '범위·의존성 증가',
        summary: '인프라 생성과 릴리스가 서로 다른 이유로 바뀐다는 점을 확인했습니다.',
      },
      {
        label: '책임 분리',
        summary: 'Gjallar는 VM Create, Heimdall은 Application Deploy를 맡도록 나눴습니다.',
      },
    ],
    responsibilitySplit: [
      { owner: 'Gjallar', responsibility: 'VM Create' },
      { owner: 'Heimdall', responsibility: 'Application Deploy' },
    ],
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
      lessons: ['입력 정규화', '고위험 작업 확인', '실행 피드백'],
      evidenceFigure: {
        src: '/projects/klepaas-dashboard.png',
        alt: 'K-Le-PaaS 대시보드의 배포 상태, 모니터링 지표, 자연어 명령 성공 이력',
        caption: '실제 서비스 화면에서 배포 상태와 자연어 명령 실행 결과를 함께 확인했습니다.',
        status: 'verified',
        source: 'public/projects/klepaas-dashboard.png',
      },
    } satisfies KlepaasProjectData,
    currentSystem: {
      zones: [
        {
          id: 'proxmox',
          label: 'Proxmox',
          responsibility: '실제 VM inventory와 실행 기반을 소유합니다.',
          systemNode: 'platform',
          details: ['Actual-state Source of Truth'],
        },
        {
          id: 'gjallar-control',
          label: 'Gjallar Control',
          responsibility: 'VM 생성 정책을 검증하고 native API 실행을 제어합니다.',
          systemNode: 'control',
          details: ['VM Profile', 'Preflight', 'Native Create'],
        },
        {
          id: 'runtime',
          label: 'Runtime VM',
          responsibility: '애플리케이션 배포 세대와 내부 라우팅을 실행합니다.',
          systemNode: 'runtime',
          details: ['Heimdall Worker', 'Project Gateway', 'App Generations'],
        },
        {
          id: 'storage',
          label: 'Storage VM',
          responsibility: '배포 세대와 분리된 사용자 데이터 수명주기를 소유합니다.',
          systemNode: 'storage',
          details: ['PostgreSQL', 'Project DB & Role'],
          operationalNote: 'Operational · 사용자 확인 운영 구조',
        },
      ],
      connections: [
        {
          fromZoneId: 'gjallar-control',
          toZoneId: 'proxmox',
          label: 'inventory 조회 · native API create',
          status: 'active',
        },
        {
          fromZoneId: 'proxmox',
          toZoneId: 'runtime',
          label: 'VM 실행 기반',
          status: 'active',
        },
        {
          fromZoneId: 'runtime',
          toZoneId: 'storage',
          label: '애플리케이션 DB 연결 · 별도 VM 운영',
          status: 'operational',
        },
      ],
      caption:
        '실선은 현재 코드로 확인한 경로입니다. Storage VM 연결은 별도 PostgreSQL VM을 사용한다는 사용자 확인 운영 구조입니다.',
    } satisfies CurrentSystemData,
    responsibilitySplit: {
      rows: [
        {
          id: 'responsibility',
          label: '책임',
          gjallar: 'VM 생성 요청의 정책·검증·실행',
          heimdall: '애플리케이션 세대의 빌드·검증·승격',
        },
        {
          id: 'change-reason',
          label: '변경 이유',
          gjallar: '인프라 용량·구성 변경',
          heimdall: '애플리케이션 릴리스',
        },
        {
          id: 'execution-target',
          label: '실행 대상',
          gjallar: 'Proxmox VM',
          heimdall: 'Docker Deployment Generation',
        },
        {
          id: 'failure-impact',
          label: '실패 영향',
          gjallar: '실행 기반 생성 실패',
          heimdall: '후보 배포 미승격',
        },
        {
          id: 'current-scope',
          label: '현재 범위',
          gjallar: 'Native Create · 제한된 gated Start',
          heimdall: 'Deployment Generation 생성·검증·Current 승격',
        },
      ],
      before: {
        label: 'Before · 초기 Heimdall',
        summary: 'Terraform VM 생성, Ansible 설정, 애플리케이션 배포가 한 자동화에 집중됐습니다.',
      },
      after: {
        label: 'After · 책임 분리',
        summary: 'Gjallar의 VM Create와 Heimdall의 Deployment Generation으로 소유권을 나눴습니다.',
      },
    } satisfies ResponsibilitySplitData,
    gjallar: {
      layers: [
        {
          id: 'actual-state',
          label: 'Source of Truth',
          title: 'Proxmox actual inventory',
          summary: 'DB가 아닌 Proxmox 조회 결과를 현재 VM 상태의 기준으로 사용합니다.',
        },
        {
          id: 'policy',
          label: 'Policy',
          title: 'DB-backed VM Profile',
          summary: 'CPU·메모리·디스크 범위와 access 권장값을 용도별 정책으로 재사용합니다.',
        },
        {
          id: 'preflight',
          label: 'Preflight',
          title: '실행 전 조건 검증',
          summary: '고정 IP, bridge, storage, template과 guest-agent 준비 상태를 먼저 확인합니다.',
        },
        {
          id: 'execution',
          label: 'Gated Execution',
          title: '명시적 승인 뒤 native API 실행',
          summary: 'Draft → Preflight → Plan → Approval → Preview → Acknowledgement → Native Proxmox API',
        },
        {
          id: 'outcome',
          label: 'Outcome',
          title: '기본은 stopped create',
          summary: '선택 시에만 부팅하고 guest-agent IP와 cloud-init 완료 근거를 확인합니다.',
        },
      ],
      evidenceFigure: {
        src: '/projects/gjallar.png',
        alt: 'Gjallar 운영 콘솔에서 Proxmox 노드, VM 수, 스토리지와 작업 상태를 조회하는 Overview 화면',
        caption: '실제 운영 콘솔 화면은 Proxmox node·VM·storage inventory와 job 상태 조회 범위를 보여줍니다.',
        status: 'verified',
        source: 'public/projects/gjallar.png',
      },
      scopeLimit:
        '현재 구현은 Native Create와 stopped VM의 제한된 gated Start입니다. 전체 VM lifecycle과 destructive control은 범위가 아닙니다.',
    } satisfies GjallarProjectData,
    heimdall: {
      promotion: {
        steps: [
          { id: 'exact-commit', label: 'Exact Commit' },
          { id: 'build', label: 'Build' },
          {
            id: 'generation-network',
            label: 'Generation Network',
          },
          {
            id: 'candidate-start',
            label: 'Candidate Start',
          },
          {
            id: 'service-health',
            label: 'Service Health',
          },
          {
            id: 'nginx-validate-route-probe',
            label: 'Nginx Validate + Route Probe',
            operations: [
              { id: 'nginx-t', label: 'nginx -t' },
              { id: 'atomic-config-replace', label: 'Atomic config replace' },
              { id: 'reload', label: 'Nginx reload' },
              { id: 'route-probe', label: 'Route probe' },
            ],
          },
          {
            id: 'current-metadata-previous-retirement',
            label: 'Current Metadata + Previous Retirement',
          },
        ],
        outcomes: [
          {
            id: 'execution-success',
            label: 'Execution Success',
            summary: 'candidate가 시작되고 service health를 통과한 상태입니다. 아직 운영 트래픽 승격은 아닙니다.',
          },
          {
            id: 'traffic-activation-success',
            label: 'Traffic Activation Success',
            summary: 'Nginx 검증과 실제 route probe가 끝나 current metadata를 전환할 수 있는 상태입니다.',
          },
        ],
        implementationClaims: [
          {
            id: 'generation-isolation',
            label: 'Generation Isolation',
            summary: '세대별 network와 고유 service alias로 Current와 Candidate의 실행 경계를 분리합니다.',
          },
          {
            id: 'retirement-after-activation-success',
            label: 'Previous Retirement',
            summary: 'Nginx 활성화와 실제 route probe 성공이 확정된 뒤에만 이전 generation을 회수합니다.',
          },
        ],
        databaseCapabilities: [
          {
            id: 'project-db-role-provisioning',
            label: 'Project DB · Role',
            summary: '프로젝트별 PostgreSQL DB와 login role을 만들고 연결을 검증합니다.',
          },
          {
            id: 'deployment-database-injection',
            label: 'Deploy-time Injection',
            summary: 'DB 접근을 선언한 서비스에만 연결 정보와 read-only secret을 전달합니다.',
          },
        ],
      },
      failureModes: [
        {
          id: 'build-health',
          failure: 'Build / Health',
          handling: '실패한 배포 ID와 label이 정확히 일치하는 candidate만 정리',
          preserved: '기존 Current와 active metadata',
          limitation: '저장된 image 재사용 없음',
          scopeLimits: ['release-image-rollback'],
        },
        {
          id: 'nginx-activation',
          failure: 'Nginx Activation',
          handling: 'last-known-good 설정 복원 후 실패 candidate를 exact-label 정리',
          preserved: '이전 route와 generation',
          limitation: 'release rollback 아님',
          scopeLimits: [],
        },
        {
          id: 'worker-interruption',
          failure: 'Worker Interruption',
          handling: 'Control DB·Nginx marker·Docker label을 비교해 reconcile',
          preserved: '상태가 불확실한 candidate',
          limitation: '확정할 수 없으면 수동 판단',
          scopeLimits: [],
        },
        {
          id: 'app-deployment-data',
          failure: 'App Deployment / Data',
          handling: 'runtime generation과 PostgreSQL 데이터 실패 범위를 분리',
          preserved: '별도 Storage VM의 사용자 데이터',
          limitation: 'DB purge·backup·restore와 data rollback 비범위',
          scopeLimits: ['database-backup-restore', 'database-purge', 'database-credential-rotation', 'data-rollback'],
        },
      ],
      reconciliationPolicy:
        'Worker가 중단된 뒤 runtime 상태를 확정할 수 없으면 자동 삭제보다 candidate 보존을 선택합니다.',
      storageBoundary:
        '프로젝트별 DB·role provisioning과 배포 연동은 구현됐습니다. 별도 PostgreSQL Storage VM은 사용자 확인 운영 구조이며 기본 Compose의 물리 격리를 뜻하지 않습니다.',
    } satisfies HeimdallProjectData,
    externalExposure: {
      zones: [
        {
          id: 'control-dns',
          label: 'control.example.com',
          responsibility: 'Control Web 진입점을 가리키는 DNS 역할입니다.',
          details: ['Control Web'],
        },
        {
          id: 'deployment-dns',
          label: '*.deploy.example.com',
          responsibility: '사용자 deployment Host를 수용하는 wildcard DNS 역할입니다.',
          details: ['Deployment wildcard'],
        },
        {
          id: 'oci-edge',
          label: 'OCI Edge Nginx',
          responsibility: '고정된 공인 경계에서 TLS를 종료하고 Host를 전달합니다.',
          details: ['Fixed TLS', 'Host forward'],
        },
        {
          id: 'wireguard',
          label: 'WireGuard',
          responsibility: 'Edge와 홈랩 외부 네트워크 사이의 tunnel입니다.',
        },
        {
          id: 'external-network-ingress',
          label: 'External Network · Internal Ingress',
          responsibility: '홈랩 외부망을 분리하고 도메인별 동적 route를 선택합니다.',
          details: ['Internal Ingress Nginx'],
        },
        {
          id: 'project-gateway',
          label: 'Project Gateway',
          responsibility: '프로젝트 서비스와 승격된 generation으로 요청을 연결합니다.',
        },
        {
          id: 'runtime-application',
          label: 'Runtime Application',
          responsibility: 'Heimdall이 승격한 애플리케이션 generation을 실행합니다.',
          systemNode: 'runtime',
        },
        {
          id: 'storage-postgresql',
          label: 'Storage VM PostgreSQL',
          responsibility: 'runtime generation과 분리된 사용자 데이터 경계입니다.',
          systemNode: 'storage',
        },
      ],
      connections: [
        { fromZoneId: 'control-dns', toZoneId: 'oci-edge', label: 'Control Web Host', status: 'planned' },
        {
          fromZoneId: 'deployment-dns',
          toZoneId: 'oci-edge',
          label: 'Deployment wildcard Host',
          status: 'planned',
        },
        { fromZoneId: 'oci-edge', toZoneId: 'wireguard', label: '고정 Host 전달', status: 'planned' },
        {
          fromZoneId: 'wireguard',
          toZoneId: 'external-network-ingress',
          label: '홈랩 외부망 진입',
          status: 'planned',
        },
        {
          fromZoneId: 'external-network-ingress',
          toZoneId: 'project-gateway',
          label: '내부 동적 routing',
          status: 'planned',
        },
        {
          fromZoneId: 'project-gateway',
          toZoneId: 'runtime-application',
          label: '승격된 generation',
          status: 'planned',
        },
        {
          fromZoneId: 'project-gateway',
          toZoneId: 'storage-postgresql',
          label: '프로젝트 DB 연결',
          status: 'planned',
        },
      ],
      caption:
        '모든 점선은 계획 연결입니다. 실제 도메인·IP·방화벽 규칙·secret·certificate는 이 설계에 포함하지 않습니다.',
      routingBoundary:
        'OCI Edge는 배포마다 바뀌지 않습니다. deployment별 동적 routing은 Internal Ingress와 Project Gateway가 소유합니다.',
    } satisfies ExternalExposureData,
    argus: {
      stages: [
        { id: 'provider-adapter', label: 'Provider Adapter' },
        { id: 'normalized-snapshot', label: 'Normalized Snapshot' },
        { id: 'judgement', label: 'Judgement' },
        { id: 'dashboard', label: 'Dashboard' },
      ],
      evidenceFigure: {
        src: '/projects/argus.png',
        alt: 'Argus 대시보드의 Overview Desk와 판단 근거 카드를 원본 크기에 가깝게 확대한 상세 화면',
        caption: 'Overview Desk를 원본 크기에 가깝게 확대한 상세로, 정규화된 snapshot과 판단 근거의 연결을 보여줍니다.',
        status: 'verified',
        source: 'public/projects/argus.png',
        focus: {
          id: 'overview-desk',
          label: 'Argus Overview Desk 확대 상세',
        },
      },
    } satisfies ArgusProjectData,
  },
  closingSummary: {
    projectSummaries: [
      {
        id: 'heimdall',
        boundary: 'verified-generation-promotion',
        name: 'Heimdall',
        scope: 'Implemented · Generation Deployment',
        summary: '고정 commit의 candidate를 격리하고 health와 실제 route를 검증한 뒤에만 current로 승격합니다.',
      },
      {
        id: 'gjallar',
        boundary: 'approved-native-create',
        name: 'Gjallar',
        scope: 'Implemented · Native Create VM',
        summary: 'Proxmox inventory를 기준으로 preflight와 명시적 승인을 거쳐 native API로 VM을 생성합니다.',
      },
      {
        id: 'klepaas',
        boundary: 'verified-personal-contribution',
        name: 'K-Le-PaaS',
        scope: '2인 팀 · Verified Personal Scope',
        summary: '팀 안에서 맡은 자연어 해석과 CommandPlan 구현으로 Kubernetes 작업과 실행 피드백을 연결했습니다.',
      },
      {
        id: 'argus',
        boundary: 'provider-boundaries',
        name: 'Argus',
        scope: 'Implemented · Supporting Project',
        summary: '공급자 adapter와 normalized snapshot 경계를 분리해 수집 입력을 하나의 판단 흐름으로 연결했습니다.',
      },
    ],
    techCategories: [
      {
        id: 'platform-infrastructure',
        label: 'Platform / Infrastructure',
        items: ['Proxmox', 'Kubernetes', 'NCP', 'Docker', 'Linux'],
      },
      {
        id: 'backend-data',
        label: 'Backend / Data',
        items: ['FastAPI', 'PostgreSQL', 'Redis', 'SQLAlchemy', 'REST API'],
      },
      {
        id: 'interface-delivery',
        label: 'Interface / Delivery',
        items: ['React', 'Next.js', 'TypeScript', 'GitHub Actions', 'WireGuard'],
      },
    ],
    education: {
      school: '광운대학교',
      major: '전자통신공학과',
      status: '졸업',
      date: '2026.02',
    },
    certifications: ['정보처리기사', '리눅스마스터 2급'],
  } satisfies ClosingSummaryData,
  pages: [
    {
      number: 1,
      slug: 'cover',
      eyebrow: 'PORTFOLIO',
      title: '조윤호',
      thesis:
        '반복되는 인프라 운영과 배포 문제를 자동화하고, 책임 경계와 실패 복구 구조를 설계하는 신입 플랫폼 엔지니어',
      facts: ['Platform Engineer'],
      decisions: ['프로젝트 이미지 없이 이름, 직무, 포지셔닝과 연락처만 첫 화면에 둡니다.'],
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
      flows: [['VM 생성', 'IP·네트워크', 'Docker 설치', '애플리케이션 배포']],
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
      flows: [['K-Le-PaaS', '초기 Heimdall', '범위·의존성 증가', 'Gjallar·Heimdall 책임 분리']],
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
          'Exact Commit',
          'Build',
          'Generation Network',
          'Candidate Start',
          'Service Health',
          'Nginx Validate + Route Probe',
          'Current Metadata + Previous Retirement',
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
      limitations: [],
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
      limitations: [
        'release-image-rollback',
        'database-backup-restore',
        'database-purge',
        'database-credential-rotation',
        'data-rollback',
      ],
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
      flows: [['Provider Adapter', 'Normalized Snapshot', 'Judgement', 'Dashboard']],
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
      title: '조윤호 · Platform Engineer',
      thesis: '운영 문제를 발견하고 자동화한 뒤, 책임과 실패 경계를 다시 설계할 수 있습니다.',
      facts: ['대표 프로젝트의 역할과 상태, 핵심 기술, 교육·자격, 연락처를 한 페이지에 요약합니다.'],
      decisions: ['별도의 감사 인사 페이지를 추가하지 않고 판단과 연락처로 문서를 마칩니다.'],
      flows: [],
      evidence: [],
      limitations: [],
    },
  ] satisfies PortfolioPageData[],
} as const;
