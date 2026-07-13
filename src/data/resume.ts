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

export const resumeProfile = {
  name: '조윤호',
  nameEn: 'Yunho Cho',
  role: 'Platform Engineer',
  secondaryRole: 'DevOps / Infrastructure Automation',
  statement: '빌드, 배포, 서버 운영의 반복을 API와 코드로 바꿉니다.',
  summary:
    'Git 저장소 연결부터 로컬 배포, Proxmox 운영, 자연어 Kubernetes 제어, 경제 데이터 수집까지 필요한 도구를 설계하고 구현했습니다.',
  location: 'Seoul, Korea',
  updated: 'Updated 2026.07',
} as const;

export const resumeSkillGroups: ResumeSkillGroup[] = [
  {
    label: 'Platform / Infra',
    items: ['Proxmox', 'Kubernetes', 'NCP', 'Docker', 'Linux'],
  },
  {
    label: 'Backend / Data',
    items: ['FastAPI', 'PostgreSQL', 'Redis', 'SQLAlchemy', 'REST API'],
  },
  {
    label: 'Automation / Delivery',
    items: ['GitHub Actions', 'Terraform', 'Ansible', 'WireGuard', 'Slack API'],
  },
  {
    label: 'Frontend / Interface',
    items: ['React', 'Next.js', 'TypeScript', 'Vite', 'Market Data API'],
  },
];

export const resumeProjects: ResumeProject[] = [
  {
    id: 'heimdall',
    period: '진행 중',
    type: '개인 프로젝트',
    role: 'Product design / Backend / Deployment automation',
    title: 'Git 기반 로컬 프리뷰 배포 자동화',
    summary: '저장소 연결부터 Docker 실행과 데이터베이스 구성까지 로컬에서 자동화한 배포 관리자입니다.',
    highlights: [
      'GitHub 저장소와 브랜치를 등록하면 Docker 이미지를 빌드하고 프리뷰 컨테이너를 실행하도록 구성',
      '배포 상태, 로그, 릴리스 이력과 이미지 롤백을 하나의 콘솔에서 관리',
      '관리형 PostgreSQL을 생성하고 DATABASE_URL을 애플리케이션에 자동 연결',
    ],
    stack: ['GitHub', 'Docker', 'FastAPI', 'PostgreSQL'],
  },
  {
    id: 'gjallar',
    period: '진행 중',
    type: '개인 프로젝트',
    role: 'Product design / Backend / Operations UI',
    title: 'Proxmox 운영 및 리스크 관리 콘솔',
    summary: 'Proxmox VM 생성과 운영 작업을 승인, 실행, 검증 기록과 함께 관리하는 콘솔입니다.',
    highlights: [
      '실제 Proxmox 인벤토리를 읽기 전용으로 조회하고 노드, VM, 스토리지 상태를 한 화면에 구성',
      'Create VM과 마이그레이션을 승인 후 실행하고 Proxmox UPID와 사후 검증 결과를 기록',
      '운영 요청, 승인, 작업, 감사 로그를 PostgreSQL에 저장해 작업 전후 상태를 확인',
    ],
    stack: ['Proxmox API', 'FastAPI', 'React', 'PostgreSQL'],
  },
  {
    id: 'klepaas',
    period: '2025.09 - 2025.12',
    type: '팀 프로젝트',
    role: 'Backend / NLP commands / Kubernetes API',
    title: 'AI 자연어 기반 Kubernetes 운영 플랫폼',
    summary: '자연어 요청을 Kubernetes 작업으로 바꾸고 실행 상태와 결과를 Slack으로 전달하는 플랫폼입니다.',
    highlights: [
      'Gemini가 한국어 요청의 의도와 대상을 해석하고 실행 가능한 명령 계획으로 변환',
      'FastAPI에서 Kubernetes, NCP, GitHub Webhook, Slack 연동을 단일 API 계층으로 구성',
      '배포, 스케일, 롤백 결과와 명령 이력을 PostgreSQL에 저장하고 Slack으로 알림',
    ],
    stack: ['Gemini', 'Kubernetes', 'FastAPI', 'GitHub Actions', 'Slack'],
  },
  {
    id: 'argus',
    period: '진행 중',
    type: '취미 프로젝트',
    role: 'Data pipeline / Backend / Dashboard',
    title: '한국 시장 경제 데이터 대시보드',
    summary: '여러 출처의 경제 데이터를 수집하고 비교 가능한 형태로 가공해 보여주는 개인 대시보드입니다.',
    highlights: [
      'KIS 시장 데이터와 RSS, 네이버, DART 뉴스 수집기를 분리해 독립적으로 실행',
      '출처별 데이터 형식을 정규화하고 선물, 옵션, 수급 지표를 계산하는 백엔드 구성',
      '선물, 옵션, 포지션, 뉴스 데이터를 Next.js 대시보드에서 비교할 수 있도록 시각화',
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
