import { getAsset } from '~/utils/permalinks';

export type HomeProjectTone = 'blue' | 'red' | 'green' | 'yellow';

export interface CaseStudyStep {
  title: string;
  description: string;
}

export interface CaseStudyDecision extends CaseStudyStep {
  status: 'Current' | 'Planned' | 'In development' | 'Implemented';
}

export interface CaseStudyNarrative {
  contextTitle: string;
  context: string[];
  roleTitle: string;
  role: string;
  roleItems: CaseStudyStep[];
  architectureTitle: string;
  architecture: string;
  architectureSteps: CaseStudyStep[];
  decisionsTitle: string;
  decisions: CaseStudyDecision[];
  currentTitle: string;
  current: string;
  nextTitle: string;
  next: string;
  outcomeLabel?: string;
  outcomeTitle?: string;
  currentBadge?: string;
  nextBadge?: string;
}

export interface CaseStudyDetail {
  type: string;
  status: string;
  problemTitle: string;
  problem: string;
  steps: CaseStudyStep[];
  resultTitle: string;
  result: string;
  narrative?: CaseStudyNarrative;
}

export interface HomeProject {
  id: string;
  index: string;
  name: string;
  category: string;
  statement: string;
  description: string;
  caseStudyHref: string;
  repository: string;
  tone: HomeProjectTone;
  tags: string[];
  visual?: {
    src: string;
    alt: string;
    position?: 'top' | 'center';
  };
  flow?: string[];
  flowLabel?: string;
  flowResult?: string;
  detail: CaseStudyDetail;
}

export const homeNavigation = [
  { label: 'About', href: '#about' },
  { label: 'Infrastructure', href: '#infrastructure' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
] as const;

export const homeHero = {
  eyebrow: 'Yunho Cho / Platform Engineer',
  headline: ['Simplify first.', 'Solve faster.'],
  description: '빌드, 배포, 서버 운영을 자동화합니다.',
};

export const homeProjects: HomeProject[] = [
  {
    id: 'heimdall',
    index: '01',
    name: 'Heimdall',
    category: 'Local deployment automation',
    statement: 'Connect GitHub. Run locally.',
    description: 'GitHub 연결부터 빌드, 배포, DB 구성까지 자동화합니다.',
    caseStudyHref: '/projects/heimdall',
    repository: 'https://github.com/CodingPenguin-yoon/heimdall_final',
    tone: 'blue',
    tags: ['GitHub', 'Docker', 'PostgreSQL', 'FastAPI'],
    visual: {
      src: getAsset('/projects/heimdall.png'),
      alt: 'Heimdall Preview Deployment Console 화면',
      position: 'top',
    },
    detail: {
      type: '개인 프로젝트',
      status: '진행 중',
      problemTitle: '저장소에서 실행까지, 한 번에.',
      problem: '빌드, 배포, 데이터베이스 연결을 자동화합니다.',
      steps: [
        {
          title: 'Connect',
          description: '저장소와 브랜치를 연결합니다.',
        },
        {
          title: 'Build',
          description: 'Docker 이미지를 빌드합니다.',
        },
        {
          title: 'Run',
          description: '컨테이너를 실행하고 로그를 남깁니다.',
        },
        {
          title: 'Provision',
          description: 'PostgreSQL을 만들고 앱에 연결합니다.',
        },
      ],
      resultTitle: '한 번 연결하면, 배포는 자동으로.',
      result: '상태, 로그, 배포 이력과 롤백을 한곳에서 관리합니다.',
      narrative: {
        contextTitle: '배포할 때마다 같은 설정을 반복하고 있었습니다.',
        context: [
          '홈랩의 RED 테스트 영역에 서비스를 배포할 때마다 저장소를 연결하고, Docker 이미지를 빌드하고, 컨테이너와 데이터베이스를 직접 구성해야 했습니다. 매번 반복하던 이 작업을 하나의 배포 흐름으로 자동화하기 위해 Heimdall을 만들었습니다.',
          'Heimdall로 배포 과정을 자동화한 뒤에는 서비스 접근도 간단하게 만들고 싶었습니다. IP와 포트 대신 고정된 주소를 사용할 수 있도록 내부 DNS와 리버스 프록시를 별도로 구축했습니다.',
        ],
        roleTitle: '개인 프로젝트로 전체 배포 흐름을 설계하고 구현했습니다.',
        role: 'GitHub 연동부터 Docker 실행, PostgreSQL 구성, 배포 상태와 릴리스 관리 화면까지 제품과 백엔드 흐름을 직접 만들었습니다.',
        roleItems: [
          {
            title: 'Product / Backend',
            description: '배포 요청 모델, API와 작업 상태 전이를 설계했습니다.',
          },
          {
            title: 'Deployment',
            description: '저장소와 브랜치를 Docker 이미지와 프리뷰 컨테이너로 연결했습니다.',
          },
          {
            title: 'Operations',
            description: '로그, 릴리스 이력, 이미지 롤백과 PostgreSQL 연결을 한 화면에 구성했습니다.',
          },
        ],
        architectureTitle: '저장소에서 접근 가능한 서비스까지.',
        architecture:
          'Heimdall은 애플리케이션 실행을 자동화하고, 배포 이후의 내부 DNS와 리버스 프록시는 사용자가 접근할 수 있는 주소를 만듭니다.',
        architectureSteps: [
          {
            title: 'Register',
            description: 'GitHub 저장소와 배포할 브랜치를 등록합니다.',
          },
          {
            title: 'Build',
            description: '선택한 소스에서 Docker 이미지를 빌드합니다.',
          },
          {
            title: 'Run',
            description: '프리뷰 컨테이너를 실행하고 상태와 로그를 추적합니다.',
          },
          {
            title: 'Provision',
            description: 'PostgreSQL을 만들고 DATABASE_URL을 애플리케이션에 연결합니다.',
          },
          {
            title: 'Expose',
            description: '내부 DNS와 리버스 프록시를 통해 고정된 주소로 접근합니다.',
          },
        ],
        decisionsTitle: '운영 환경에 맞춰 실행 영역과 권한을 나눴습니다.',
        decisions: [
          {
            status: 'Current',
            title: '접근 계층 분리',
            description: '현재 RED 영역의 동일한 VM에서 내부 DNS와 리버스 프록시를 운영합니다.',
          },
          {
            status: 'Planned',
            title: '운영 영역 이전',
            description: '검증이 끝난 DNS와 리버스 프록시를 GREEN 관리 영역으로 이전할 계획입니다.',
          },
          {
            status: 'In development',
            title: '외부 Worker 격리',
            description: 'ORANGE에는 외부 배포를 실행할 Worker만 두고 GREEN으로의 일반 접근은 허용하지 않습니다.',
          },
        ],
        currentTitle: '현재 동작하는 범위',
        current:
          '저장소 등록부터 이미지 빌드, 컨테이너 실행, PostgreSQL 연결, 상태와 로그 확인, 릴리스 이력과 이미지 롤백까지 한 콘솔에서 관리합니다.',
        nextTitle: '다음 단계',
        next: 'DNS와 리버스 프록시를 GREEN으로 이전하고, ORANGE 전용 Worker를 추가해 내부 배포와 외부 배포의 실행 권한을 분리합니다.',
      },
    },
  },
  {
    id: 'gjallar',
    index: '02',
    name: 'Gjallar',
    category: 'Proxmox server operations',
    statement: 'Create. Monitor. Operate with confidence.',
    description: 'Proxmox VM을 만들고, 안전하게 운영합니다.',
    caseStudyHref: '/projects/gjallar',
    repository: 'https://github.com/CodingPenguin-yoon/Gjallar',
    tone: 'red',
    tags: ['Proxmox', 'FastAPI', 'PostgreSQL', 'Audit'],
    visual: {
      src: getAsset('/projects/gjallar.png'),
      alt: 'Gjallar 서버 운영 콘솔 화면',
      position: 'top',
    },
    detail: {
      type: '개인 프로젝트',
      status: '진행 중',
      problemTitle: 'VM 생성부터 운영까지.',
      problem: '현재 상태를 확인하고, 승인한 작업만 실행합니다.',
      steps: [
        {
          title: 'Create',
          description: '템플릿과 네트워크를 골라 VM을 만듭니다.',
        },
        {
          title: 'Check',
          description: '현재 상태와 입력값을 확인합니다.',
        },
        {
          title: 'Approve',
          description: '중요한 작업은 승인 후 실행합니다.',
        },
        {
          title: 'Track',
          description: '작업 ID와 실행 결과를 기록합니다.',
        },
      ],
      resultTitle: '작업 전후를 모두 기록합니다.',
      result: 'VM 생성, 승인, 실행 결과를 한곳에서 확인합니다.',
      narrative: {
        contextTitle: 'VM 생성과 운영 작업을 더 빠르고 안전하게 만들고 싶었습니다.',
        context: [
          '홈랩에서 Proxmox를 운영하며 VM을 생성하고 관리하는 작업을 반복했습니다. 필요한 정보를 입력하면 VM을 빠르게 만들고, 이후의 운영 작업도 한곳에서 처리할 수 있도록 Gjallar를 시작했습니다.',
          '인프라 자동화는 실행 속도만 높여서는 안 된다고 판단했습니다. Proxmox의 실제 상태를 먼저 확인하고, 입력값 검증과 승인 과정을 거친 뒤 작업을 실행하며, 그 과정과 결과를 기록하도록 설계했습니다.',
        ],
        roleTitle: 'Proxmox 운영 흐름과 제어 계층을 직접 설계하고 구현했습니다.',
        role: 'React, FastAPI와 PostgreSQL을 기반으로 사용자 권한, Proxmox 인벤토리, VM 생성과 운영 작업, 승인 및 실행 기록을 하나의 흐름으로 구성했습니다.',
        roleItems: [
          {
            title: 'Proxmox Integration',
            description: '노드, VM, 템플릿, 스토리지와 네트워크의 실제 상태를 Proxmox API에서 가져옵니다.',
          },
          {
            title: 'Operations',
            description: 'VM 생성과 시작을 요청하고 작업 상태와 실행 결과를 추적하도록 구현했습니다.',
          },
          {
            title: 'Safety',
            description: '역할 기반 권한, 입력 검증, 승인과 중복 실행 방지를 운영 작업에 적용했습니다.',
          },
        ],
        architectureTitle: '확인하고 승인한 작업만 Proxmox에 전달합니다.',
        architecture:
          'Gjallar는 운영 의도를 받아 Proxmox의 현재 상태와 입력값을 확인하고, 필요한 승인 후 작업을 실행합니다. 실행 결과와 근거는 다시 작업 기록으로 남깁니다.',
        architectureSteps: [
          {
            title: 'Observe',
            description: 'Proxmox에서 노드와 VM, 리소스의 현재 상태를 확인합니다.',
          },
          {
            title: 'Validate',
            description: '요청값과 연결 상태, 실행 가능 조건을 먼저 검증합니다.',
          },
          {
            title: 'Approve',
            description: '영향이 큰 작업은 권한을 확인하고 승인 후 진행합니다.',
          },
          {
            title: 'Execute',
            description: '검증된 요청만 Proxmox API를 통해 실행합니다.',
          },
          {
            title: 'Record',
            description: '작업 상태와 결과, 판단 근거를 조회할 수 있도록 기록합니다.',
          },
        ],
        decisionsTitle: '자동화보다 먼저 통제할 수 있는 실행 흐름을 만들었습니다.',
        decisions: [
          {
            status: 'Current',
            title: '실제 상태를 기준으로 동작',
            description: 'Proxmox 연결을 상태별로 구분하고, 연결이 정상이 아닐 때 가상 데이터로 대체하지 않습니다.',
          },
          {
            status: 'Current',
            title: '실행 전 승인과 중복 방지',
            description: 'VM 생성은 승인 후 실행하고, VM 시작은 확인과 중복 실행 방지 절차를 거칩니다.',
          },
          {
            status: 'Implemented',
            title: '상태 확인과 작업 기록',
            description: '승인 요청부터 실행 상태와 결과, 위험과 판단 근거까지 같은 작업 기록에서 확인할 수 있습니다.',
          },
        ],
        currentTitle: '현재 동작하는 범위',
        current:
          '사용자 권한과 Proxmox 인벤토리, 승인 기반 VM 생성, 중복 실행을 방지하는 VM 시작, 작업·위험·근거 조회 기능을 제공합니다.',
        nextTitle: '다음 단계',
        next: '아직 전환되지 않은 운영 기능에도 동일한 검증과 승인, 실행 확인, 기록 흐름을 적용하고 상태 조정 과정을 확장합니다.',
      },
    },
  },
  {
    id: 'klepaas',
    index: '03',
    name: 'K-Le-PaaS',
    category: 'Natural-language cloud operations',
    statement: 'Say it. Deploy it.',
    description: 'AI가 자연어 요청을 Kubernetes 작업으로 바꿉니다.',
    caseStudyHref: '/projects/klepaas',
    repository: 'https://github.com/K-Le-PaaS/backend-hybrid',
    tone: 'green',
    tags: ['Kubernetes', 'FastAPI', 'GitHub Actions', 'Slack'],
    visual: {
      src: getAsset('/projects/klepaas-dashboard.png'),
      alt: 'K-Le-PaaS 클라우드 운영 대시보드',
      position: 'top',
    },
    detail: {
      type: '팀 프로젝트',
      status: '2025.09 - 2025.12',
      problemTitle: '말하면, 배포까지.',
      problem: 'AI가 자연어 요청을 Kubernetes 작업으로 바꾸고, 결과를 Slack으로 알립니다.',
      steps: [
        {
          title: 'Say',
          description: '웹이나 Slack에 요청합니다.',
        },
        {
          title: 'Parse',
          description: '요청을 실행 가능한 명령으로 바꿉니다.',
        },
        {
          title: 'Deploy',
          description: 'Kubernetes에서 배포, 스케일, 롤백을 실행합니다.',
        },
        {
          title: 'Notify',
          description: '상태와 결과를 기록하고 알립니다.',
        },
      ],
      resultTitle: 'AI가 자연어 요청을 이해하고, Kubernetes가 실행합니다.',
      result: '실행 상태와 결과는 Slack으로 알려줍니다.',
      narrative: {
        contextTitle: '여러 운영 도구를 오가던 Kubernetes 작업을 하나의 흐름으로 묶었습니다.',
        context: [
          '배포와 롤백을 처리하려면 GitHub Actions, NCP, kubectl과 Slack을 각각 확인해야 했습니다. 팀원이 모든 명령과 절차를 알고 있어야 한다는 점도 운영 진입 장벽이었습니다.',
          'K-Le-PaaS는 자연어 요청을 실행 가능한 작업으로 해석하고, Kubernetes와 NCP에서 실행한 뒤 결과와 이력을 다시 전달하는 클라우드 운영 자동화 프로젝트입니다.',
        ],
        roleTitle: '자연어 명령을 실제 Kubernetes 작업으로 연결하는 백엔드를 맡았습니다.',
        role: 'FastAPI 백엔드에서 Gemini 기반 명령 해석과 Kubernetes 실행 흐름을 구현하고, 배포된 서비스의 접근 주소와 모니터링 정보를 사용자에게 전달하는 기능을 개발했습니다.',
        roleItems: [
          {
            title: 'NLP / Kubernetes',
            description: '상태 조회, 로그, 재시작과 리소스 조회 요청을 해석해 Kubernetes API 작업으로 연결했습니다.',
          },
          {
            title: 'Deployment Access',
            description: 'Ingress와 서비스 엔드포인트를 조회하고 배포 URL을 추적하는 기능을 구현했습니다.',
          },
          {
            title: 'Monitoring',
            description: 'Prometheus 기반 NKS 지표 조회와 상태 변화 알림 기능을 추가했습니다.',
          },
        ],
        architectureTitle: '자연어 요청을 검증 가능한 운영 작업으로 변환합니다.',
        architecture:
          '사용자의 요청은 Gemini를 통해 의도와 대상으로 구조화됩니다. 영향도를 확인한 뒤 Kubernetes 또는 NCP 작업을 실행하고, 결과와 이력은 웹과 Slack으로 전달합니다.',
        architectureSteps: [
          {
            title: 'Request',
            description: '웹이나 Slack에서 한국어로 운영 작업을 요청합니다.',
          },
          {
            title: 'Interpret',
            description: 'Gemini가 요청의 의도와 대상 리소스를 구조화합니다.',
          },
          {
            title: 'Confirm',
            description: '위험도와 실행 조건을 확인하고 필요한 경우 사용자 승인을 받습니다.',
          },
          {
            title: 'Execute',
            description: 'Kubernetes 또는 NCP에서 배포, 조회, 재시작과 롤백을 실행합니다.',
          },
          {
            title: 'Notify',
            description: '실행 결과와 이력을 저장하고 웹과 Slack으로 전달합니다.',
          },
        ],
        decisionsTitle: '명령 해석과 실제 실행 사이에 확인 가능한 단계를 두었습니다.',
        decisions: [
          {
            status: 'Implemented',
            title: '단일 모델로 해석 구조 단순화',
            description: '복잡한 다중 모델 구조를 Gemini 직접 연동으로 정리하고 실제 Kubernetes 명령에 집중했습니다.',
          },
          {
            status: 'Implemented',
            title: '위험 작업 실행 전 확인',
            description: '배포, 스케일링, 롤백과 재시작은 영향도를 분류하고 필요한 경우 승인 후 실행합니다.',
          },
          {
            status: 'Implemented',
            title: '배포 이후 접근 정보 연결',
            description: 'Dockerfile의 포트와 Ingress 정보를 이용해 서비스 접근 URL을 만들고 추적했습니다.',
          },
        ],
        currentTitle: '구현 결과',
        current:
          '자연어로 Kubernetes 상태와 로그를 조회하고, 재시작, 스케일링과 롤백을 요청할 수 있는 백엔드 흐름을 구현했습니다. 실행 결과와 배포 URL, 모니터링 상태는 이력과 알림으로 연결했습니다.',
        nextTitle: '배운 점',
        next: '자연어 인터페이스의 편의성만큼 실행 전 검증과 확인, 실행 결과 추적이 중요하다는 점을 경험했습니다. 여러 운영 도구를 하나의 흐름으로 묶는 과정에서 플랫폼 백엔드의 역할도 구체적으로 이해했습니다.',
        outcomeLabel: '06 / Result & learned',
        outcomeTitle: '구현 결과와 배운 점.',
        currentBadge: 'Result',
        nextBadge: 'Learned',
      },
    },
  },
  {
    id: 'argus',
    index: '04',
    name: 'Argus',
    category: 'Korean market data terminal',
    statement: '흩어진 시장 정보를 한 번에.',
    description: '시장 흐름을 빠르게 확인하기 위해 만든 대시보드입니다.',
    caseStudyHref: '/projects/argus',
    repository: 'https://github.com/CodingPenguin-yoon/argus-renewal',
    tone: 'yellow',
    tags: ['KRX', 'FastAPI', 'Next.js', 'Data provenance'],
    flow: ['Collect', 'Adapt', 'Assess', 'Present'],
    flowLabel: 'MARKET DATA PIPELINE',
    flowResult: 'Source, observed time and freshness attached',
    detail: {
      type: '취미 프로젝트',
      status: '진행 중 · Mock 데이터',
      problemTitle: '데이터의 값과 상태를 함께 보여줍니다.',
      problem: '시장 데이터에 출처, 관측 시각과 신뢰 상태를 함께 표시합니다.',
      steps: [
        {
          title: 'Collect',
          description: '한국 시장의 현물과 파생 수급 데이터를 가져옵니다.',
        },
        {
          title: 'Adapt',
          description: '프로바이더별 응답을 공통 데이터 계약으로 변환합니다.',
        },
        {
          title: 'Assess',
          description: '출처와 관측 시각, 신선도와 확정 여부를 판정합니다.',
        },
        {
          title: 'Present',
          description: '장중 수급 상태를 빠르게 비교할 수 있도록 보여줍니다.',
        },
      ],
      resultTitle: '첫 번째 시장 수급 흐름을 구현했습니다.',
      result: 'KOSPI 현물과 KOSPI200 선물·콜·풋 수급을 mock 데이터로 연결했습니다.',
      narrative: {
        contextTitle: '여러 곳에서 보던 시장 정보를 한 화면에 모았습니다.',
        context: [
          '기존 Argus에는 뉴스와 여러 지표가 함께 있었지만, 장중 수급과 파생 상태를 빠르게 비교하기 어려웠습니다. 데이터마다 출처와 갱신 시점도 달라 수치의 상태를 화면에서 바로 판단하기 어려웠습니다.',
          '리뉴얼에서는 제품 범위를 한국 시장 수급·파생 터미널로 좁혔습니다. 수치와 함께 출처, 관측 시각, 신선도와 추정·확정 상태를 표시하도록 구성했습니다.',
        ],
        roleTitle: '리뉴얼 과정에서 제품 범위와 데이터 구조를 다시 설계했습니다.',
        role: '개인 프로젝트로 백엔드와 프론트엔드의 새 경계를 만들고, 시장 데이터 프로바이더와 공통 계약, 신뢰 상태 모델, 첫 번째 시장 수급 화면을 구현했습니다.',
        roleItems: [
          {
            title: 'Product Scope',
            description: '한국 시장의 수급과 파생 상태를 장중에 판독하는 터미널로 제품 범위를 좁혔습니다.',
          },
          {
            title: 'Data Architecture',
            description: '수집 소스의 차이를 프로바이더와 어댑터 계층에서 흡수하도록 경계를 나눴습니다.',
          },
          {
            title: 'Trust Model',
            description: '출처, 관측 시각, 신선도와 estimate·confirmed 상태를 데이터에 포함했습니다.',
          },
        ],
        architectureTitle: '수집 데이터를 공통 형식으로 변환해 화면에 전달합니다.',
        architecture:
          '프로바이더는 소스별 데이터를 가져오고, 어댑터는 이를 같은 형식으로 변환합니다. API는 데이터 값과 신뢰 상태를 함께 전달하고, 화면은 수집 방식과 분리된 계약만 사용합니다.',
        architectureSteps: [
          {
            title: 'Collect',
            description: '프로바이더가 시장 수급 데이터를 소스별 방식으로 가져옵니다.',
          },
          {
            title: 'Adapt',
            description: '서로 다른 응답을 공통 시장 데이터 형식으로 변환합니다.',
          },
          {
            title: 'Normalize',
            description: '시장, 상품, 투자자와 관측 시각 기준을 맞춥니다.',
          },
          {
            title: 'Assess',
            description: '신선도와 누락 여부, estimate·confirmed 상태를 판정합니다.',
          },
          {
            title: 'Present',
            description: '현물과 파생 수급을 같은 화면에서 비교할 수 있게 전달합니다.',
          },
        ],
        decisionsTitle: '출처와 관측 시각, 신선도를 데이터에 포함했습니다.',
        decisions: [
          {
            status: 'Current',
            title: '레거시와 분리한 새 경계',
            description: '새 백엔드와 프론트엔드가 기존 argus_v2를 참조하지 않도록 독립된 경계에서 재구축했습니다.',
          },
          {
            status: 'Current',
            title: '기능 단위 프로바이더',
            description: '화면이나 API가 특정 수집 소스를 직접 호출하지 않도록 프로바이더와 어댑터를 분리했습니다.',
          },
          {
            status: 'Current',
            title: '신뢰 상태를 데이터에 포함',
            description: 'source, observed time, fresh·stale·missing과 estimate·confirmed를 함께 전달합니다.',
          },
        ],
        currentTitle: '현재 구현한 범위',
        current:
          'KOSPI 현물과 KOSPI200 선물·콜·풋의 투자자별 수급을 mock fixture로 제공하는 첫 수직 기능을 구현했습니다. 시장 대시보드 API와 화면, 데이터 신뢰 상태 표시가 동작합니다.',
        nextTitle: '다음 단계',
        next: '실시간 데이터 소스의 사용 가능성을 검증한 뒤 KOSPI200 종목 구성과 종목별 시세·수급 기능을 같은 데이터 경계 위에 연결할 계획입니다.',
        outcomeLabel: '05 / Current & next',
        outcomeTitle: '현재 구현 범위와 다음 단계.',
      },
    },
  },
];
