export interface ResumeSkillGroup {
  label: string;
  items: string[];
}

export interface ResumeProject {
  id: 'heimdall' | 'gjallar' | 'klepaas' | 'argus';
  period: string;
  type: string;
  role: string;
  title: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface ResumeInfrastructureItem {
  title: string;
  status: 'Current' | 'Planned';
  description: string;
}

export const resumeProfile = {
  name: '조윤호',
  nameEn: 'Yunho Cho',
  role: 'Platform Engineer',
  secondaryRole: 'DevOps / Infrastructure Automation',
  statement: '직접 운영하며 발견한 반복과 불편을 코드와 자동화로 개선합니다.',
  summary:
    'Proxmox 3노드 홈랩과 분리된 네트워크를 직접 운영하고 있습니다. 테스트, 관리, 외부 서비스 영역에서 반복되는 배포와 서버 작업을 Heimdall과 Gjallar로 자동화하며 운영 가능한 플랫폼을 만들고 있습니다.',
  location: 'Seoul, Korea',
  updated: 'Updated 2026.07',
} as const;

export const resumeInfrastructure = {
  title: 'Proxmox 3노드 홈랩을 구축하고 운영하고 있습니다.',
  summary:
    'IPFire로 RED, GREEN, ORANGE 영역을 분리하고 각 Proxmox 노드의 NIC를 관리, 외부 통신, DMZ 용도로 나눴습니다. 스토리지와 외부 접근 경로까지 직접 운영하며 배포와 서버 관리 자동화의 기준을 만들었습니다.',
  items: [
    {
      title: 'Compute & Storage',
      status: 'Current',
      description: 'Proxmox 노드 3대와 NAS, 디스크 패스스루 방식의 NFS VM을 운영합니다.',
    },
    {
      title: 'Network Segmentation',
      status: 'Current',
      description: 'IPFire로 RED 테스트망, GREEN 관리망, ORANGE 외부 서비스망을 분리하고 접근 방향을 통제합니다.',
    },
    {
      title: 'External Access',
      status: 'Current',
      description: 'OCI 리버스 프록시와 ORANGE의 WireGuard 서버를 연결해 외부 서비스 접근 경로를 구성했습니다.',
    },
    {
      title: 'Deployment Boundary',
      status: 'Planned',
      description: '내부 DNS와 리버스 프록시는 GREEN으로 이전하고, 외부 배포 Worker는 ORANGE에 격리할 계획입니다.',
    },
  ] satisfies ResumeInfrastructureItem[],
} as const;

export const resumeSkillGroups: ResumeSkillGroup[] = [
  {
    label: 'Infrastructure',
    items: ['Proxmox', 'Kubernetes', 'NCP', 'Docker', 'Linux'],
  },
  {
    label: 'Network / Storage',
    items: ['IPFire', 'WireGuard', 'NFS', 'NAS', 'Reverse Proxy'],
  },
  {
    label: 'Automation / Delivery',
    items: ['GitHub Actions', 'Terraform', 'Ansible', 'Docker', 'REST API'],
  },
  {
    label: 'Backend / Interface',
    items: ['FastAPI', 'PostgreSQL', 'React', 'Next.js', 'TypeScript'],
  },
];

export const resumeProjects: ResumeProject[] = [
  {
    id: 'heimdall',
    period: '진행 중',
    type: '개인 프로젝트',
    role: 'Product design / Backend / Deployment automation',
    title: 'Git 기반 로컬 프리뷰 배포 자동화',
    summary: '홈랩 배포마다 반복하던 Docker 이미지 빌드, 컨테이너 실행과 데이터베이스 설정을 자동화했습니다.',
    highlights: [
      'Problem — 배포할 때마다 저장소 연결, 이미지 빌드, 컨테이너와 DB 설정을 직접 반복',
      'Built — GitHub 저장소 등록부터 Docker 실행, PostgreSQL 연결까지 이어지는 배포 흐름 구현',
      'Result — 배포 상태, 로그, 릴리스 이력과 이미지 롤백을 하나의 콘솔에서 관리',
    ],
    stack: ['GitHub', 'Docker', 'FastAPI', 'PostgreSQL'],
  },
  {
    id: 'gjallar',
    period: '진행 중',
    type: '개인 프로젝트',
    role: 'Product design / Backend / Operations UI',
    title: 'Proxmox 운영 및 리스크 관리 콘솔',
    summary: '반복되는 Proxmox VM 생성과 운영 작업을 빠르게 처리하면서 실행 과정은 통제할 수 있도록 만들었습니다.',
    highlights: [
      'Problem — Proxmox에서 VM 생성과 상태 확인, 운영 작업을 반복해서 처리',
      'Built — 실제 인벤토리 조회와 입력 검증, 승인 기반 VM 생성·운영 흐름 구현',
      'Result — 요청, 승인, 실행 상태와 결과, 위험과 판단 근거를 작업 기록에서 확인',
    ],
    stack: ['Proxmox API', 'FastAPI', 'React', 'PostgreSQL'],
  },
  {
    id: 'klepaas',
    period: '2025.09 - 2025.12',
    type: '팀 프로젝트',
    role: 'Backend / NLP commands / Kubernetes API',
    title: 'AI 자연어 기반 Kubernetes 운영 플랫폼',
    summary:
      '여러 운영 도구를 오가던 Kubernetes 작업을 자연어 요청부터 실행과 결과 확인까지 하나의 흐름으로 연결했습니다.',
    highlights: [
      'Role — 자연어 명령 해석, Kubernetes 실행 API, Ingress 접근 정보와 Prometheus 모니터링 담당',
      'Built — Gemini가 요청을 명령 계획으로 변환하고 위험 작업은 확인 후 실행하도록 구성',
      'Result — 배포와 운영 결과, 명령 이력을 저장하고 Slack으로 전달하는 백엔드 흐름 구현',
    ],
    stack: ['Gemini', 'Kubernetes', 'FastAPI', 'GitHub Actions', 'Slack'],
  },
  {
    id: 'argus',
    period: '진행 중',
    type: '취미 프로젝트',
    role: 'Product / Data architecture / Backend / Frontend',
    title: '한국 시장 수급·파생 데이터 터미널',
    summary: '흩어진 시장 정보를 한 화면에서 빠르게 확인하기 위해 만든 대시보드입니다.',
    highlights: [
      '레거시와 분리된 backend market_data, frontend market_terminal 경계를 구성',
      '프로바이더와 어댑터 계층을 분리하고 source, observed time, freshness, estimate·confirmed 상태를 공통 계약에 포함',
      'KOSPI 현물과 KOSPI200 선물·콜·풋 투자자 수급을 mock fixture로 제공하는 첫 수직 기능 구현',
    ],
    stack: ['Next.js', 'FastAPI', 'KIS API', 'Market Data'],
  },
];

export const resumeEducation = {
  school: '광운대학교',
  major: '전자통신공학과',
  status: '졸업',
  date: '2026.02',
} as const;

export const resumeCertifications = ['정보처리기사', '리눅스마스터 2급'] as const;
