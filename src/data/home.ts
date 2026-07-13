import { getAsset } from '~/utils/permalinks';

export type HomeProjectTone = 'blue' | 'red' | 'green' | 'yellow';

export interface CaseStudyStep {
  title: string;
  description: string;
}

export interface CaseStudyDetail {
  type: string;
  status: string;
  problemTitle: string;
  problem: string;
  steps: CaseStudyStep[];
  resultTitle: string;
  result: string;
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
  detail: CaseStudyDetail;
}

export const homeNavigation = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Capabilities', href: '#capabilities' },
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
    repository: 'https://github.com/CodingPenguin-yoon/Heimdall',
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
    },
  },
  {
    id: 'argus',
    index: '04',
    name: 'Argus',
    category: 'Personal market dashboard',
    statement: 'Started with stocks. Ended with a dashboard.',
    description: '경제 데이터를 수집하고 시각화합니다.',
    caseStudyHref: '/projects/argus',
    repository: 'https://github.com/CodingPenguin-yoon/argus-renewal',
    tone: 'yellow',
    tags: ['Next.js', 'FastAPI', 'KIS', 'Market data'],
    visual: {
      src: getAsset('/projects/argus.png'),
      alt: 'Argus 한국 시장 상황 대시보드',
      position: 'top',
    },
    detail: {
      type: '취미 프로젝트',
      status: '진행 중',
      problemTitle: '시장을 보는 또 하나의 눈.',
      problem: '여러 출처의 경제 데이터를 수집하고, 분석 가능한 형태로 가공합니다.',
      steps: [
        {
          title: 'Collect',
          description: '여러 출처의 경제 데이터를 가져옵니다.',
        },
        {
          title: 'Normalize',
          description: '형식과 기준을 맞춥니다.',
        },
        {
          title: 'Analyze',
          description: '비교에 필요한 지표를 계산합니다.',
        },
        {
          title: 'Visualize',
          description: '결과를 한 화면에 보여줍니다.',
        },
      ],
      resultTitle: '주식 보다가, 프로젝트까지.',
      result: '경제 데이터를 수집하고 가공해 대시보드로 만들었습니다.',
    },
  },
];

export const homeAbout = {
  eyebrow: 'How I work',
  statement: '한 번은 해도, 두 번은 자동화합니다.',
  supporting: ['복잡함은 줄이고', '반복은 자동화하고', '필요한 건 만듭니다'],
};

export const homeCapabilities = [
  {
    index: '01',
    title: '빌드와 배포를 자동화합니다.',
    evidence: 'Heimdall / K-Le-PaaS',
  },
  {
    index: '02',
    title: '서버를 만들고 안전하게 운영합니다.',
    evidence: 'Gjallar',
  },
  {
    index: '03',
    title: '운영 상태와 데이터를 한눈에 정리합니다.',
    evidence: 'K-Le-PaaS / Gjallar / Argus',
  },
] as const;
