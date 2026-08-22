import { getAsset } from '~/utils/permalinks';

export type HomeProjectTone = 'blue' | 'red' | 'green' | 'yellow';

export interface CaseStudyStep {
  title: string;
  description: string;
}

export interface CaseStudyDecision extends CaseStudyStep {
  status: 'Current' | 'Planned' | 'In development' | 'Implemented' | 'Verified';
}

export interface CaseStudyProofItem extends CaseStudyStep {
  badge: string;
  href?: string;
  linkLabel?: string;
}

export interface CaseStudyProof {
  id?: string;
  label?: string;
  title: string;
  introduction: string;
  items: CaseStudyProofItem[];
}

export interface CaseStudyOwnership {
  title: string;
  team: CaseStudyStep;
}

export interface CaseStudyNarrative {
  contextTitle: string;
  context: string[];
  roleTitle: string;
  role: string;
  roleItems: CaseStudyStep[];
  ownership?: CaseStudyOwnership;
  architectureTitle: string;
  architecture: string;
  architectureSteps: CaseStudyStep[];
  decisionsTitle: string;
  decisions: CaseStudyDecision[];
  proof?: CaseStudyProof;
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
  { label: 'Projects', href: '#projects' },
  { label: 'Validation', href: '#infrastructure' },
  { label: 'Contact', href: '#contact' },
] as const;

export const homeHero = {
  eyebrow: 'Yunho Cho / Platform Engineer',
  headline: ['배포 흐름을 만들고,', '운영까지 설계합니다.'],
  description:
    '공개 GitHub 저장소의 main commit을 빌드하고, 동작을 확인한 Preview만 활성화하며 배포 이력을 관리합니다.',
};

const homeProjectOrder = new Map([
  ['heimdall', 0],
  ['klepaas', 1],
  ['gjallar', 2],
]);

const homeProjectSource: HomeProject[] = [
  {
    id: 'heimdall',
    index: '01',
    name: 'Heimdall',
    category: 'Git-based preview deployment',
    statement: 'From commit to a healthy preview.',
    description:
      '공개 GitHub 저장소의 main commit을 격리된 Docker candidate로 빌드하고, health와 route 검증을 통과한 경우에만 Preview를 전환합니다.',
    caseStudyHref: '/projects/heimdall',
    repository: 'https://github.com/CodingPenguin-yoon/heimdall_final',
    tone: 'blue',
    tags: ['Git', 'Docker', 'NGINX', 'FastAPI', 'React', 'PostgreSQL'],
    visual: {
      src: getAsset('/projects/heimdall.png'),
      alt: 'Heimdall Preview Deployment Console 화면',
      position: 'top',
    },
    detail: {
      type: '개인 프로젝트',
      status: 'Alpha · Single-host',
      problemTitle: 'Git commit에서 안정적인 Preview까지.',
      problem: '빌드, 상태 확인, 활성화와 실패 복구를 하나의 배포 흐름으로 관리합니다.',
      steps: [
        {
          title: 'Snapshot',
          description: '저장소와 배포 설정을 변경 불가능한 snapshot으로 저장합니다.',
        },
        {
          title: 'Build',
          description: '정확한 commit에서 service별 Docker 이미지를 빌드합니다.',
        },
        {
          title: 'Verify',
          description: 'candidate container를 실행하고 health check를 확인합니다.',
        },
        {
          title: 'Activate',
          description: '검증된 candidate만 Preview route에 연결합니다.',
        },
      ],
      resultTitle: '검증이 끝나기 전에는 기존 Preview를 바꾸지 않습니다.',
      result:
        '실패한 candidate는 active release와 분리하고, 결과가 불확실한 runtime은 삭제하지 않고 재확인 대상으로 보존합니다.',
      narrative: {
        contextTitle: '빌드 성공만으로는 배포 성공을 판단할 수 없었습니다.',
        context: [
          '작은 Linux 서버를 관리하는 개인이나 소규모 팀이 Git 저장소를 Preview로 확인하려면 checkout과 image build뿐 아니라 서비스 상태 확인, route 전환, 실패 진단과 배포 이력까지 함께 관리해야 합니다.',
          'Heimdall은 신뢰된 단일 Docker 호스트를 대상으로 commit과 배포 설정을 고정하고 candidate를 별도로 검증한 뒤, 실제로 동작하는 환경만 Preview에 연결하는 self-hosted deployment controller입니다.',
        ],
        roleTitle: '배포 Control Plane과 Worker 경계를 직접 설계하고 구현했습니다.',
        role: 'FastAPI API와 배포 Worker, React 관리 화면을 구성하고 Git checkout부터 Docker build, health check, route activation과 복구까지 전체 lifecycle을 연결했습니다.',
        roleItems: [
          {
            title: 'Control Plane',
            description: '프로젝트 설정, immutable deployment snapshot, 상태 전이와 event 이력을 관리합니다.',
          },
          {
            title: 'Deployment Worker',
            description: 'exact SHA checkout, service image build, candidate 실행과 health check를 처리합니다.',
          },
          {
            title: 'Runtime Safety',
            description: '검증 후 route 전환, 실패 진단, 불확실 runtime 보존과 PostgreSQL provisioning을 구현했습니다.',
          },
        ],
        architectureTitle: '동작을 확인한 candidate만 Preview로 전환합니다.',
        architecture:
          'Heimdall은 commit과 설정 snapshot을 기준으로 candidate를 만들고 health와 route를 검증합니다. 검증이 끝난 뒤에만 active release를 전환하고 이전 generation을 정리합니다.',
        architectureSteps: [
          {
            title: 'Register',
            description: 'Git 저장소와 service, 환경변수, health check를 등록합니다.',
          },
          {
            title: 'Snapshot',
            description: 'commit과 배포 설정을 immutable snapshot으로 고정합니다.',
          },
          {
            title: 'Build',
            description: 'service별 image와 격리된 candidate runtime을 만듭니다.',
          },
          {
            title: 'Verify',
            description: 'health endpoint와 candidate route가 실제로 응답하는지 확인합니다.',
          },
          {
            title: 'Activate',
            description: 'NGINX 설정을 검증하고 active release를 원자적으로 전환합니다.',
          },
        ],
        decisionsTitle: '배포 실패가 기존 Preview까지 깨뜨리지 않도록 설계했습니다.',
        decisions: [
          {
            status: 'Implemented',
            title: 'Exact SHA와 immutable snapshot',
            description: '배포 요청 시점의 source와 설정을 고정해 같은 release를 다시 추적할 수 있게 했습니다.',
          },
          {
            status: 'Verified',
            title: 'Health와 route를 통과한 뒤 활성화',
            description: 'candidate service와 route가 실제로 응답하기 전에는 active release를 변경하지 않습니다.',
          },
          {
            status: 'Implemented',
            title: 'Control Plane과 Preview runtime 분리',
            description:
              'API나 Worker가 중지돼도 성공한 service container와 gateway가 유지되도록 lifecycle을 나눴습니다.',
          },
        ],
        proof: {
          id: 'failure-evidence',
          label: '05 / Failure handling & scope',
          title: '실패해도 기존 Preview를 유지합니다.',
          introduction:
            '후보 배포가 실패하면 기존 Preview를 유지하고, 단일 Docker 호스트에서 동작하는 범위에 집중합니다.',
          items: [
            {
              badge: 'Failure path',
              title: 'Route 검증 실패 시 기존 Preview를 보존합니다.',
              description:
                'candidate route probe가 실패하면 active metadata를 전환하지 않고, 기존 gateway 설정을 복구한 뒤 실패 상태를 기록합니다.',
              href: 'https://github.com/CodingPenguin-yoon/heimdall_final/blob/main/backend/tests/test_nginx_gateway.py',
              linkLabel: 'Failure-path test',
            },
            {
              badge: 'Validation',
              title: 'Exact commit부터 Preview 전환까지 테스트합니다.',
              description:
                'Docker build, health check, NGINX activation과 실패 후 기존 Preview 응답 보존을 opt-in 통합 테스트로 확인합니다.',
              href: 'https://github.com/CodingPenguin-yoon/heimdall_final/blob/main/backend/tests/integration/test_worker_runtime_smoke.py',
              linkLabel: 'Integration test',
            },
            {
              badge: 'Current scope',
              title: '단일 Docker 호스트에서 Preview를 운영합니다.',
              description:
                '공개 GitHub 저장소의 main 브랜치와 단일 Docker 호스트를 지원합니다. Private Git, public domain·TLS, multi-host·multi-user, image·data rollback은 아직 지원하지 않습니다.',
              href: 'https://github.com/CodingPenguin-yoon/heimdall_final/blob/main/project-docs/product-scope.md',
              linkLabel: 'Scope document',
            },
          ],
        },
        currentTitle: '현재 동작하는 범위',
        current:
          '공개 GitHub 저장소 등록, main commit 선택, multi-service build, candidate health check, project별 Preview route, 배포 이력, 로그·진단, PostgreSQL database와 role provisioning을 제공합니다.',
        nextTitle: '다음 단계',
        next: '셀프호스팅 버전의 설치 절차와 trust boundary를 정리하고 첫 release를 만든 뒤, Heimdall이 운영하는 인프라에서 사용자의 Preview를 빌드·실행하는 SaaS 버전으로 확장합니다.',
        outcomeLabel: '07 / Current & next',
        outcomeTitle: '현재 제공하는 기능과 다음 단계.',
        currentBadge: 'Current',
        nextBadge: 'Next',
      },
    },
  },
  {
    id: 'gjallar',
    index: '03',
    name: 'Gjallar',
    category: 'Verified Proxmox operations',
    statement: 'Control the change. Verify the outcome.',
    description:
      'Proxmox의 실제 상태를 확인하고, VM 생성·시작을 작업별 절차로 통제한 뒤 task와 실제 결과를 다시 확인합니다.',
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
      problemTitle: '인프라 작업의 성공을 API 응답만으로 판단하지 않습니다.',
      problem: '현재 상태와 권한을 확인하고 작업별 승인·확인 절차를 거친 뒤, 실제 결과를 다시 검증합니다.',
      steps: [
        {
          title: 'Plan',
          description: '실행 의도와 대상, 기대 결과를 먼저 저장합니다.',
        },
        {
          title: 'Confirm',
          description: '작업 종류에 따라 승인이나 명시적 확인 절차를 거칩니다.',
        },
        {
          title: 'Execute',
          description: '중복·동시 요청을 차단하고 Proxmox 작업을 실행합니다.',
        },
        {
          title: 'Verify',
          description: 'Proxmox 작업 완료 여부와 실제 VM 상태를 다시 확인합니다.',
        },
      ],
      resultTitle: '불명확한 결과를 성공으로 처리하지 않습니다.',
      result: '시간이 초과되거나 실제 상태가 예상과 다르면 성공으로 끝내지 않고 다시 확인합니다.',
      narrative: {
        contextTitle: 'VM 생성과 운영 작업을 더 빠르고 안전하게 만들고 싶었습니다.',
        context: [
          '홈랩에서 Proxmox를 운영하며 VM을 생성하고 관리하는 작업을 반복했습니다. 필요한 정보를 입력하면 VM을 빠르게 만들고, 이후의 운영 작업도 한곳에서 처리할 수 있도록 Gjallar를 시작했습니다.',
          '인프라 자동화는 실행 속도만 높여서는 안 된다고 판단했습니다. Proxmox의 실제 상태를 먼저 확인하고, 입력값 검증과 작업별 확인 절차를 거친 뒤 실행 과정과 결과를 기록하도록 설계했습니다.',
        ],
        roleTitle: 'Proxmox 운영 흐름과 제어 계층을 직접 설계하고 구현했습니다.',
        role: 'React, FastAPI와 PostgreSQL을 기반으로 사용자 권한, Proxmox inventory, VM 생성·시작, task 추적과 사후 상태 확인을 구현했습니다.',
        roleItems: [
          {
            title: 'Proxmox Integration',
            description:
              '노드·VM·템플릿·스토리지·네트워크를 Proxmox API에서 조회하고, 개발용 fake inventory는 source를 구분해 표시합니다.',
          },
          {
            title: 'Operations',
            description: 'VM 생성은 승인과 최종 확인 후 실행하고, VM Start는 명시적 확인과 중복 방지 절차를 거칩니다.',
          },
          {
            title: 'Task / Verification',
            description:
              'Proxmox task 완료와 실제 VM 상태를 다시 확인하고, 결과가 불명확하면 재확인 대상으로 기록합니다.',
          },
        ],
        architectureTitle: '작업 종류에 맞는 통제 절차를 거쳐 Proxmox에 전달합니다.',
        architecture:
          'Gjallar는 Proxmox의 현재 상태와 입력값을 확인합니다. VM 생성은 승인과 최종 확인을 거치고, VM Start는 명시적 확인과 중복 방지를 적용합니다. 실행 뒤에는 task와 실제 VM 상태를 다시 확인합니다.',
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
            title: 'Confirm',
            description: '작업 종류에 따라 승인이나 명시적 확인 절차를 적용합니다.',
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
            title: 'Live inventory와 개발용 fallback 구분',
            description:
              '실제 Proxmox inventory와 연결할 수 없을 때 사용하는 개발용 fake inventory의 source를 구분해 표시합니다.',
          },
          {
            status: 'Current',
            title: '작업별 확인과 중복 방지',
            description:
              'VM 생성은 승인과 최종 확인 후 실행하고, VM Start는 명시적 확인과 idempotency key로 중복 요청을 막습니다.',
          },
          {
            status: 'Implemented',
            title: 'Task와 실제 상태 확인',
            description:
              'Proxmox task 완료와 실제 VM 상태를 확인하고, 시간 초과나 상태 불일치는 성공으로 끝내지 않습니다.',
          },
        ],
        currentTitle: '현재 동작하는 범위',
        current:
          '사용자 권한과 Proxmox inventory, 승인 기반 VM 생성, 확인·중복 방지 기반 VM Start를 제공합니다. 작업 완료 후에는 Proxmox task와 실제 상태를 다시 확인합니다.',
        nextTitle: '다음 단계',
        next: '실험 중인 배치 추천은 독립 실행 기능으로 확장하지 않고 모니터링 정보로 정리합니다. 현재 지원하지 않는 VM 운영 작업은 같은 검증 기준을 충족한 뒤 추가합니다.',
      },
    },
  },
  {
    id: 'klepaas',
    index: '02',
    name: 'K-Le-PaaS',
    category: 'AI-assisted Kubernetes operations',
    statement: 'Turn intent into Kubernetes operations.',
    description:
      '자연어 요청을 구조화된 Kubernetes 운영 명령으로 바꾸고, 실행 결과를 웹과 Slack으로 전달한 팀 프로젝트입니다.',
    caseStudyHref: '/projects/klepaas',
    repository: 'https://github.com/K-Le-PaaS/backend-hybrid',
    tone: 'green',
    tags: ['Kubernetes', 'Gemini', 'FastAPI', 'Prometheus', 'NCP'],
    visual: {
      src: getAsset('/projects/klepaas-dashboard.png'),
      alt: 'K-Le-PaaS 클라우드 운영 대시보드',
      position: 'top',
    },
    detail: {
      type: '팀 프로젝트',
      status: '2025.09 - 2025.12',
      problemTitle: '자연어 요청을 Kubernetes 운영 작업으로.',
      problem: 'AI가 자연어 요청을 Kubernetes·NCP 운영 작업으로 바꾸고 결과를 웹과 Slack으로 전달합니다.',
      steps: [
        {
          title: 'Request',
          description: '웹이나 Slack에서 운영 작업을 요청합니다.',
        },
        {
          title: 'Interpret',
          description: 'Gemini가 요청의 의도와 대상을 구조화합니다.',
        },
        {
          title: 'Execute',
          description: '백엔드가 Kubernetes 또는 NCP 작업을 실행합니다.',
        },
        {
          title: 'Report',
          description: '실행 결과와 이력을 웹과 Slack으로 전달합니다.',
        },
      ],
      resultTitle: '자연어 입력과 Kubernetes 실행을 하나의 백엔드 흐름으로 연결했습니다.',
      result: '실행 상태와 결과는 웹과 Slack에 기록됩니다.',
      narrative: {
        contextTitle: '여러 운영 도구를 오가던 Kubernetes 작업을 하나의 흐름으로 묶었습니다.',
        context: [
          '배포와 롤백을 처리하려면 GitHub Actions, NCP, kubectl과 Slack을 각각 확인해야 했습니다. 팀원이 모든 명령과 절차를 알고 있어야 한다는 점도 운영 진입 장벽이었습니다.',
          'K-Le-PaaS는 자연어 요청을 실행 가능한 작업으로 해석하고, Kubernetes와 NCP에서 실행한 뒤 결과와 이력을 다시 전달하는 클라우드 운영 자동화 프로젝트입니다.',
        ],
        roleTitle: '자연어 명령 실행·조회, 외부 URL 연결과 Monitoring 백엔드를 구현했습니다.',
        role: 'Gemini 기반 명령 해석과 Kubernetes 조회·재시작·스케일링·버전 롤백, Ingress 외부 주소와 SourceDeploy 서비스 URL 관리, Prometheus 기반 NKS 모니터링을 담당했습니다.',
        roleItems: [
          {
            title: 'NLP / Kubernetes',
            description:
              '상태·로그·외부 URL 조회, 재시작·스케일링·버전 롤백과 주요 리소스 조회를 Kubernetes API 작업으로 연결했습니다.',
          },
          {
            title: 'Deployment Access',
            description:
              'Ingress에서 Service의 외부 접근 주소를 조회하고, NCP SourceDeploy 과정에서 사용자·저장소별 service URL을 생성·저장·조회하도록 구현했습니다.',
          },
          {
            title: 'Monitoring',
            description: 'Prometheus 기반 NKS 지표 조회 API와 WebSocket 연결 경로를 추가했습니다.',
          },
        ],
        ownership: {
          title: '자연어 요청을 Kubernetes 작업으로 연결하는 백엔드를 맡았습니다.',
          team: {
            title: 'Cloud operations platform',
            description:
              '웹 콘솔과 인증, GitHub·NCP 배포 파이프라인, Kubernetes 운영, 모니터링과 Slack 연동을 팀이 나누어 구현했습니다.',
          },
        },
        architectureTitle: '요청을 실행 가능한 운영 작업으로 변환합니다.',
        architecture:
          '사용자 요청을 의도와 대상으로 구조화하고, 영향도를 확인한 뒤 Kubernetes 또는 NCP에서 실행합니다. 결과와 이력은 웹과 Slack으로 전달합니다.',
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
        decisionsTitle: '자연어 해석과 실제 실행의 경계를 명확히 했습니다.',
        decisions: [
          {
            status: 'Implemented',
            title: 'Gemini 직접 연동으로 해석 구조 단순화',
            description: '자연어 해석 결과를 intent와 entity로 구조화하고 실행 함수와 분리했습니다.',
          },
          {
            status: 'Implemented',
            title: 'Kubernetes 작업을 명시적인 함수로 분리',
            description:
              '상태·로그·외부 URL 조회, 재시작·스케일링·버전 롤백과 리소스 조회를 각각 Kubernetes API 작업으로 구현했습니다.',
          },
          {
            status: 'Implemented',
            title: 'URL 데이터와 지표 조회 API 구현',
            description:
              'Ingress 외부 주소와 SourceDeploy service URL을 사용자·저장소 기준으로 관리하고 Prometheus 지표를 API로 제공했습니다.',
          },
        ],
        proof: {
          id: 'contribution-evidence',
          label: '05 / Contribution highlights',
          title: '세 가지 영역을 중심으로 기여했습니다.',
          introduction: '자연어 명령 처리, NKS 모니터링, 사용자·deployment URL 관리가 대표 작업입니다.',
          items: [
            {
              badge: 'NLP / Kubernetes',
              title: '자연어 명령을 Kubernetes 리소스 작업으로 연결했습니다.',
              description:
                '상태·로그·외부 URL 조회, 재시작·스케일링·버전 롤백과 Deployment, Service, Ingress, Namespace 조회 명령을 구현했습니다.',
              href: 'https://github.com/K-Le-PaaS/backend-hybrid/pull/28',
              linkLabel: 'PR #28',
            },
            {
              badge: 'Monitoring',
              title: 'Prometheus 기반 NKS 모니터링 API를 추가했습니다.',
              description: 'CPU, memory, disk와 network 지표 조회 API 및 WebSocket endpoint를 구현했습니다.',
              href: 'https://github.com/K-Le-PaaS/backend-hybrid/pull/42',
              linkLabel: 'PR #42',
            },
            {
              badge: 'URL Data',
              title: 'Ingress에서 외부 접근 URL까지 연결했습니다.',
              description:
                'Ingress에서 Service의 외부 접근 주소를 조회하고, NCP SourceDeploy 과정에서 사용자·저장소별 service URL을 생성·저장·조회하도록 구현했습니다.',
              href: 'https://github.com/K-Le-PaaS/backend-hybrid/pull/63',
              linkLabel: 'PR #63',
            },
          ],
        },
        currentTitle: '명령 해석과 Kubernetes 실행 연결',
        current:
          'Gemini 명령 해석, Kubernetes 상태·로그·외부 URL 조회, 재시작·스케일링·버전 롤백과 리소스 조회, Prometheus 기반 NKS 모니터링, SourceDeploy service URL 저장·조회를 구현했습니다.',
        nextTitle: '팀 전체 플랫폼 범위',
        next: '내가 구현한 백엔드 기능은 웹 콘솔, 인증, GitHub·NCP 배포 파이프라인, Slack 알림과 함께 팀의 전체 운영 흐름을 구성합니다.',
        outcomeLabel: '07 / Result',
        outcomeTitle: '자연어 요청에서 운영 결과까지.',
        currentBadge: 'Backend',
        nextBadge: 'Team',
      },
    },
  },
];

export const homeProjects = homeProjectSource.sort(
  (left, right) =>
    (homeProjectOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
    (homeProjectOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER)
);
