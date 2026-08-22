import { getAsset } from '~/utils/permalinks';

export interface PortfolioProfile {
  name: string;
  nameEn: string;
  role: string;
  intro: string;
  resumeHref: string;
  resumePageHref: string;
  email?: string;
  shortUrl?: string;
  socials: {
    github?: string;
    linkedin?: string;
    blog?: string;
  };
}

export interface PortfolioActionLink {
  label: string;
  href: string;
  description: string;
  external?: boolean;
  download?: boolean;
}

export interface ProjectVisual {
  src?: string;
  alt: string;
  label: string;
  caption: string;
}

export interface PortfolioEvidenceCard {
  title: string;
  description: string;
}

export interface PortfolioApproachCard {
  index: string;
  title: string;
  description: string;
}

export interface ProjectNarrative {
  problem: string;
  structure: string;
  result: string;
}

export interface PortfolioSectionCopy {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}

export interface PortfolioHomeCopy {
  hero: {
    eyebrow: string;
    identity: string;
    headline: string;
    lead: string;
    supporting: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta?: {
      label: string;
      href: string;
      download?: boolean;
    };
    featureChips: string[];
  };
  purposeSection: PortfolioSectionCopy & {
    cards: PortfolioEvidenceCard[];
  };
  approachSection: PortfolioSectionCopy & {
    cards: PortfolioApproachCard[];
  };
  projectsSection: PortfolioSectionCopy;
  contactSection: PortfolioSectionCopy;
  footerSummary: string;
}

export interface ProjectDecision {
  title: string;
  description: string;
}

export interface SignatureFlowStep {
  title: string;
  description: string;
}

export interface SignatureFlow {
  kind: 'provisioning' | 'request-execution' | 'source-to-question';
  eyebrow: string;
  title: string;
  description: string;
  steps: SignatureFlowStep[];
}

export interface HomeProjectCardCopy {
  variant: 'request-execution' | 'provisioning' | 'question-structure';
  eyebrow: string;
  summary: string;
  chips?: string[];
  steps?: string[];
  supporting?: string;
  primaryCtaLabel: string;
  secondaryCtaLabel?: string;
}

export interface ProjectHeroCopy {
  eyebrow: string;
  lead: string;
  resultTitle: string;
  result: string;
  emphasis?: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
}

export interface ProjectProblemCopy {
  eyebrow: string;
  title: string;
  highlights?: string[];
  paragraphs: string[];
}

export interface ProjectImplementationCopy {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
  asideTitle?: string;
  asideItems?: string[];
}

export interface ProjectDecisionSectionCopy {
  eyebrow: string;
  title: string;
  items: ProjectDecision[];
}

export interface ProjectOutcomeCopy {
  eyebrow: string;
  title: string;
  items: string[];
}

export interface ProjectLearningCopy {
  eyebrow: string;
  title: string;
  items: string[];
}

export interface MainProjectDetailCopy {
  template: 'main';
  hero: ProjectHeroCopy;
  problem: ProjectProblemCopy;
  implementation: ProjectImplementationCopy;
  flow: SignatureFlow;
  decisions: ProjectDecisionSectionCopy;
  results: ProjectOutcomeCopy;
  learning: ProjectLearningCopy;
}

export interface SecondaryProjectProblemBlockCopy {
  eyebrow: string;
  title: string;
  body: string;
  structureTitle: string;
  structureBody: string;
}

export interface SecondaryProjectDetailCopy {
  template: 'secondary';
  hero: ProjectHeroCopy;
  problemBlock: SecondaryProjectProblemBlockCopy;
  flow: SignatureFlow;
  learning: ProjectLearningCopy;
}

export type ProjectDetailCopy = MainProjectDetailCopy | SecondaryProjectDetailCopy;

export interface PortfolioProject {
  slug: string;
  routeGroup: 'projects' | 'archive';
  tier: 'main' | 'secondary';
  order: number;
  title: string;
  fullTitle: string;
  tagline: string;
  summary: string;
  period?: string;
  projectType: string;
  role: string;
  coreStack: string[];
  narrative: ProjectNarrative;
  resultLine: string;
  repoHref?: string;
  directHref: string;
  visual: ProjectVisual;
  home: HomeProjectCardCopy;
  detail: ProjectDetailCopy;
  seoDescription: string;
}

export interface ResumeSkillGroup {
  label: string;
  items: string[];
}

export interface ResumeEducationItem {
  title: string;
  detail: string;
}

export interface PortfolioResumeCopy {
  headline: string;
  summary: string;
  skillsTitle: string;
  skills: ResumeSkillGroup[];
  projectsTitle: string;
  projectsDescription: string;
  educationTitle: string;
  education: ResumeEducationItem[];
  certificationsTitle: string;
  certifications: string[];
}

const projectPath = (routeGroup: 'projects' | 'archive', slug: string) =>
  routeGroup === 'archive' ? `/archive/${slug}` : `/projects/${slug}`;

const hasValue = (value?: string) => Boolean(value && value.trim().length > 0);

export const portfolioSectionIds = {
  purpose: 'purpose',
  approach: 'approach',
  projects: 'projects',
  contact: 'contact',
} as const;

export const portfolioSectionLinks = [
  { label: '개요', id: portfolioSectionIds.purpose },
  { label: '구현 방식', id: portfolioSectionIds.approach },
  { label: '프로젝트', id: portfolioSectionIds.projects },
  { label: '링크', id: portfolioSectionIds.contact },
] as const;

const sectionHref = (id: (typeof portfolioSectionIds)[keyof typeof portfolioSectionIds]) => `/#${id}`;

export const portfolioProfile: PortfolioProfile = {
  name: '조윤호',
  nameEn: 'Yunho Cho',
  role: 'Platform Engineer',
  intro: 'Git 기반 Preview 배포와 Kubernetes·Proxmox 운영 도구를 구현합니다.',
  email: 'code.penguin.yoon@gmail.com',
  resumeHref: '/resume/yunho-cho-resume.pdf',
  resumePageHref: '/resume',
  shortUrl: 'https://yoonman.page',
  socials: {
    github: 'https://github.com/CodingPenguin-yoon',
    linkedin: '',
    blog: '',
  },
};

export const portfolioHome: PortfolioHomeCopy = {
  hero: {
    eyebrow: '플랫폼 엔지니어',
    identity: '조윤호 | 플랫폼·데브옵스 엔지니어',
    headline: '프로비저닝, 배포,\n상태 추적 자동화',
    lead: '핵심 운영 작업을 요청 모델, 오케스트레이션, 실행 로그 기준으로 구조화합니다.',
    supporting: 'FastAPI, Terraform, Kubernetes, GitHub Actions, PostgreSQL을 연결합니다.',
    primaryCta: {
      label: '프로젝트 보기',
      href: sectionHref(portfolioSectionIds.projects),
    },
    secondaryCta: {
      label: '이력서 보기',
      href: portfolioProfile.resumePageHref,
    },
    featureChips: ['FastAPI', 'Terraform', 'Kubernetes', 'GitHub Actions', 'PostgreSQL'],
  },
  purposeSection: {
    id: portfolioSectionIds.purpose,
    eyebrow: '개요',
    title: '운영 흐름을 짧은 추적으로 바꿉니다',
    description: '핵심은 기능 수보다 요청 1건의 추적 경로를 짧게 만드는 것입니다.',
    cards: [
      {
        title: '요청 계층',
        description: '입력 방식과 관계없이 같은 요청 모델로 처리합니다.',
      },
      {
        title: '실행 계층',
        description: '실행 대상과 오케스트레이션을 하나의 흐름으로 묶습니다.',
      },
      {
        title: '상태와 피드백',
        description: '실행 결과를 로그, UI, 알림으로 즉시 연결합니다.',
      },
    ],
  },
  approachSection: {
    id: portfolioSectionIds.approach,
    eyebrow: '구현 패턴',
    title: '자동화를 묶는 기본 패턴',
    description: '입력 정규화, 오케스트레이션, 로그와 피드백을 기본 단위로 사용합니다.',
    cards: [
      {
        index: '01',
        title: '요청 모델',
        description: '자연어 명령이든 UI 요청이든 같은 스키마로 수렴시킵니다.',
      },
      {
        index: '02',
        title: '오케스트레이션',
        description: '실행 순서와 대상 시스템을 워크플로로 고정합니다.',
      },
      {
        index: '03',
        title: '로그와 피드백',
        description: '중간 상태와 결과를 같은 맥락에서 다시 보게 만듭니다.',
      },
    ],
  },
  projectsSection: {
    id: portfolioSectionIds.projects,
    eyebrow: '대표 프로젝트',
    title: '대표 프로젝트 3가지',
    description: '메인에는 요약을, 상세에는 아키텍처·흐름·설계 판단을 담았습니다.',
  },
  contactSection: {
    id: portfolioSectionIds.contact,
    eyebrow: '바로가기',
    title: '연락처, 저장소, 이력서',
    description: '필요한 링크만 정리했습니다.',
  },
  footerSummary: '배포와 인프라 운영을 자동화하고, 실행 후 실제 상태까지 확인합니다.',
};

export const portfolioResume: PortfolioResumeCopy = {
  headline: '이력서 기준으로 같은 내용을 HTML에서도 읽을 수 있게 정리했습니다.',
  summary:
    'PDF 이력서와 포트폴리오가 서로 다른 이야기를 하지 않도록 연락처, 기술, 프로젝트, 학력, 자격증을 같은 기준으로 맞췄습니다.',
  skillsTitle: '기술',
  skills: [
    {
      label: '인프라 / IaC',
      items: ['Proxmox', 'Kubernetes', 'Terraform', 'Ansible'],
    },
    {
      label: '백엔드 / 자동화',
      items: ['FastAPI', 'PostgreSQL', 'GitHub Actions', 'Slack API'],
    },
    {
      label: '네트워크 / 운영체제',
      items: ['Linux', 'WireGuard'],
    },
  ],
  projectsTitle: '프로젝트',
  projectsDescription: '이력서에 실은 두 프로젝트를 문제, 구조, 결과 기준으로 다시 정리했습니다.',
  educationTitle: '학력',
  education: [
    {
      title: '광운대학교 전자통신공학과 졸업',
      detail: '2026.02',
    },
  ],
  certificationsTitle: '자격증',
  certifications: ['정보처리기사', '리눅스마스터 2급'],
};

const projectSource: Omit<PortfolioProject, 'directHref'>[] = [
  {
    slug: 'klepaas',
    routeGroup: 'projects',
    tier: 'main',
    order: 1,
    title: 'K-Le-PaaS',
    fullTitle: 'K-Le-PaaS | 자연어 명령 기반 Kubernetes 제어·배포 플랫폼',
    tagline: '자연어 요청 -> FastAPI -> GitHub Actions -> Kubernetes',
    summary: '자연어 명령을 배포 요청으로 정규화하고 실행 로그까지 연결한 팀 프로젝트입니다.',
    period: '2025.09 ~ 2025.12',
    projectType: '팀 프로젝트',
    role: 'FastAPI 백엔드, 자연어 명령 처리, 클러스터 제어 API, 상태 조회 API',
    coreStack: ['Kubernetes', 'FastAPI', 'GitHub Actions', 'Slack API', 'NCP'],
    narrative: {
      problem: '배포 요청 추적 경로가 길었습니다.',
      structure:
        'FastAPI를 컨트롤 플레인으로 두고 Actions, Kubernetes, Slack을 하나의 실행 파이프라인으로 묶고 로그까지 연결했습니다.',
      result: '입력 채널과 무관하게 같은 요청 모델로 추적할 수 있게 만들었습니다.',
    },
    resultLine: '요청 -> 실행 -> 상태 확인 -> 피드백',
    repoHref: 'https://github.com/K-Le-PaaS/backend-hybrid',
    visual: {
      src: getAsset('/projects/klepaas-dashboard.png'),
      alt: 'K-Le-PaaS 요청부터 실행까지 보여주는 대시보드 스크린샷',
      label: '운영 대시보드',
      caption: '명령 입력, 실행 이력, 클러스터 상태를 한 화면에 정리한 대시보드입니다.',
    },
    home: {
      variant: 'request-execution',
      eyebrow: '자연어 배포 제어',
      summary: '자연어 요청을 배포 요청 모델로 바꾸고 배포, 상태 조회, 피드백을 한 흐름으로 묶었습니다.',
      chips: ['FastAPI', 'GitHub Actions', 'Kubernetes', 'NCP', 'Slack'],
      steps: ['자연어 요청', 'API 라우터', 'Actions + K8s', '로그 + Slack'],
      primaryCtaLabel: '자세히 보기',
      secondaryCtaLabel: '저장소 보기',
    },
    detail: {
      template: 'main',
      hero: {
        eyebrow: '개요',
        lead: '자연어 요청을 배포 요청으로 변환하고 실행 로그를 남기는 컨트롤 플레인입니다.',
        resultTitle: '핵심 요약',
        result: '자연어 요청과 UI 요청이 같은 파이프라인과 로그 스키마를 공유합니다.',
        primaryCtaLabel: '저장소 보기',
        secondaryCtaLabel: '홈으로',
      },
      problem: {
        eyebrow: '문제',
        title: '배포 추적 경로가 길었습니다',
        highlights: [
          '자연어 명령을 배포 요청으로 파싱하여 변환했습니다.',
          '상태와 피드백을 같은 맥락에서 확인할 수 있어야 했습니다.',
        ],
        paragraphs: [
          '배포 실행, 상태 조회, 결과 공유가 서로 다른 도구에 분리돼 요청 1건을 끝까지 따라가기 어려웠습니다.',
          'FastAPI 진입점과 실행 로그를 기준으로 통합 추적 경로를 단순화했습니다.',
        ],
      },
      implementation: {
        eyebrow: '아키텍처',
        title: '요청 모델 + 오케스트레이션 + 실행 로그',
        description:
          '입력 형식과 무관하게 같은 요청 스키마를 사용하고, Actions, Kubernetes, Slack 이벤트를 하나의 로그로 모았습니다.',
        items: [
          '자연어 명령 파서',
          '실행 API',
          '클러스터 상태 API',
          'GitHub Actions 디스패처',
          'Slack 알림기',
          '실행 로그 저장소',
        ],
        asideTitle: '핵심 포인트',
        asideItems: [
          '입력 채널이 달라도 같은 페이로드와 로그 스키마를 사용합니다.',
          '상태 조회를 보조 기능이 아니라 제어 흐름 안에 포함시켰습니다.',
          'Slack 알림을 결과 확인 경로의 일부로 처리했습니다.',
        ],
      },
      flow: {
        kind: 'request-execution',
        eyebrow: '흐름',
        title: '요청 -> 실행 -> 상태 확인 -> 피드백',
        description: '자연어 요청과 UI 요청이 같은 제어 흐름을 탑니다.',
        steps: [
          {
            title: '자연어 요청',
            description: '입력 채널을 공통 요청 모델로 변환합니다.',
          },
          {
            title: 'API 라우터',
            description: '실행과 상태 조회 경로를 분기합니다.',
          },
          {
            title: 'Actions / Kubernetes',
            description: '실제 배포와 클러스터 제어를 수행합니다.',
          },
          {
            title: '로그 / Slack',
            description: '실행 결과를 저장하고 피드백을 반환합니다.',
          },
        ],
      },
      decisions: {
        eyebrow: '설계 판단',
        title: '주요 설계 선택',
        items: [
          {
            title: '단일 요청 모델',
            description: '자연어 명령과 UI 요청을 같은 페이로드로 수렴시켰습니다.',
          },
          {
            title: '흐름 안의 피드백',
            description: '로그와 Slack 알림이 자동으로 발송됩니다.',
          },
          {
            title: '핵심 API로 둔 상태 조회',
            description: '배포 후 상태 확인도 같은 서비스 안에서 처리하게 했습니다.',
          },
        ],
      },
      results: {
        eyebrow: '결과',
        title: '구현 결과',
        items: [
          '자연어 명령을 실행 및 상태 조회 요청으로 변환하는 API를 만들었습니다.',
          'Actions, Kubernetes, Slack을 실행 로그로 묶었습니다.',
          '요청 1건 기준으로 추적 경로와 피드백 흐름을 단순화했습니다.',
        ],
      },
      learning: {
        eyebrow: '회고',
        title: '중요했던 점',
        items: [
          '처리 방식을 통일하는 것이 더 중요했습니다.',
          '실행 API와 상태 API가 같은 맥락을 공유해야 운영 추적 경로가 짧아집니다.',
        ],
      },
    },
    seoDescription:
      'K-Le-PaaS는 자연어 명령, FastAPI, Kubernetes, GitHub Actions, Slack을 연결해 배포 실행과 결과 확인을 한 흐름으로 정리한 팀 프로젝트입니다.',
  },
  {
    slug: 'heimdall',
    routeGroup: 'projects',
    tier: 'main',
    order: 2,
    title: 'Heimdall',
    fullTitle: 'Heimdall | Proxmox VM 프로비저닝 자동화 컨트롤러',
    tagline: 'Proxmox -> Terraform -> Ansible -> 상태 추적',
    summary: 'VM 생성 이후 네트워크 설정, 초기 구성, 상태 추적을 하나의 프로비저닝 흐름으로 묶은 개인 프로젝트입니다.',
    period: '2026.01 ~ 현재',
    projectType: '개인 프로젝트',
    role: '설계, Terraform/Ansible 연동, 상태 저장 구조, 운영 UI',
    coreStack: ['Proxmox', 'Terraform', 'Ansible', 'FastAPI', 'PostgreSQL', 'WireGuard'],
    narrative: {
      problem: 'VM 생성 뒤 단계가 수작업으로 이어졌습니다.',
      structure: 'Proxmox 클론, Terraform, Ansible, 상태 저장을 하나의 프로비저닝 흐름으로 묶었습니다.',
      result: '실패 지점과 재실행 기준이 남는 프로비저닝 파이프라인을 만들었습니다.',
    },
    resultLine: '요청 -> 클론 -> 프로비저닝 -> 추적',
    repoHref: 'https://github.com/CodingPenguin-yoon/heimdall_final',
    visual: {
      src: getAsset('/projects/heimdall.png'),
      alt: 'Heimdall VM 프로비저닝 흐름 스크린샷',
      label: '운영 UI',
      caption: '요청, 진행 상황, 작업 상태를 한 화면에서 보는 프로비저닝 UI입니다.',
    },
    home: {
      variant: 'provisioning',
      eyebrow: 'VM 프로비저닝',
      summary: 'VM 생성 이후 네트워크 설정, 초기 구성, 상태 추적을 하나의 흐름으로 묶었습니다.',
      chips: ['Proxmox', 'Terraform', 'Ansible', 'PostgreSQL', 'WireGuard'],
      steps: ['UI 요청', 'Proxmox 클론', 'Terraform + Ansible', '작업 + SSE'],
      primaryCtaLabel: '자세히 보기',
      secondaryCtaLabel: '저장소 보기',
    },
    detail: {
      template: 'main',
      hero: {
        eyebrow: '개요',
        lead: 'VM 생성 이후 단계를 하나의 프로비저닝 흐름으로 연결한 컨트롤러입니다.',
        resultTitle: '핵심 요약',
        result: 'Proxmox 클론, Terraform, Ansible, 작업 로그를 같은 실행 파이프라인으로 연결했습니다.',
        primaryCtaLabel: '저장소 보기',
        secondaryCtaLabel: '홈으로',
      },
      problem: {
        eyebrow: '문제',
        title: '프로비저닝 흐름이 끊겨 있었습니다',
        highlights: [
          'VM 설정 워크플로 각 단계가 수동으로 분리되어 있어 연속적인 실행이 어려웠습니다.',
          '실행 지침과 작업 로그가 남아야만 상태 확인이 가능했습니다.',
        ],
        paragraphs: [
          'VM 생성 자체는 빨라도 이후 네트워크 설정, 초기 구성, 상태 확인이 따로 분리돼 실제 운영에서는 흐름이 길었습니다.',
          'Heimdall은 생성 이후 단계를 같은 실행 맥락으로 연결하는 데 초점을 뒀습니다.',
        ],
      },
      implementation: {
        eyebrow: '아키텍처',
        title: '프로비저닝 컨트롤러 + 상태 저장소',
        description:
          'UI 요청, Proxmox 클론, Terraform 프로비저닝, Ansible 후처리, 상태 추적을 하나의 흐름으로 연결했습니다.',
        items: [
          '프로비저닝 요청 API',
          'Proxmox 클론 단계',
          'Terraform 적용',
          'Ansible 후처리 단계',
          'PostgreSQL 작업 로그',
          'SSE 상태 스트림',
        ],
        asideTitle: '핵심 포인트',
        asideItems: [
          'VM 생성부터 추적까지 하나의 요청 단위로 기록했습니다.',
          '실행 전후 로그가 남아 작업 재현이 가능합니다.',
          '운영자는 Proxmox와 로그를 따로 열지 않고 같은 UI에서 진행 상황을 확인합니다.',
        ],
      },
      flow: {
        kind: 'provisioning',
        eyebrow: '흐름',
        title: '요청 -> 클론 -> 프로비저닝 -> 추적',
        description: 'UI 요청부터 상태 추적까지 하나의 프로비저닝 흐름을 유지합니다.',
        steps: [
          {
            title: 'UI 요청',
            description: '템플릿과 파라미터를 입력받아 작업을 시작합니다.',
          },
          {
            title: 'Proxmox 클론',
            description: '기본 VM을 생성하고 후속 단계를 준비합니다.',
          },
          {
            title: 'Terraform + Ansible',
            description: '네트워크 설정과 초기 구성을 같은 흐름에서 적용합니다.',
          },
          {
            title: '작업 / SSE',
            description: '작업 로그와 상태 이벤트를 UI에 전달합니다.',
          },
        ],
      },
      decisions: {
        eyebrow: '설계 판단',
        title: '주요 설계 선택',
        items: [
          {
            title: '변경 기준으로 둔 Terraform',
            description: '선언적 인프라를 기준으로 Terraform을 중심에 배치했습니다.',
          },
          {
            title: '같은 흐름 안의 후속 단계',
            description: '네트워크 설정과 초기 구성을 생성 직후 같은 흐름에 넣었습니다.',
          },
          {
            title: '작업 로그 우선',
            description: '실패 단계가 남아야 재시도와 복구 판단이 가능합니다.',
          },
        ],
      },
      results: {
        eyebrow: '결과',
        title: '구현 결과',
        items: [
          'VM 생성부터 초기 구성까지 하나의 흐름으로 처리했습니다.',
          'Terraform과 Ansible을 재실행 가능한 프로비저닝 경로로 묶었습니다.',
          'UI와 작업 로그로 실제 실행 흐름을 추적할 수 있습니다.',
        ],
      },
      learning: {
        eyebrow: '회고',
        title: '중요했던 점',
        items: [
          '단발성 명령보다 중간 상태와 실패 지점을 남기는 구조가 더 중요했습니다.',
          '상태 저장과 추적 UI가 없으면 자동화 체감 비용은 크게 줄지 않습니다.',
        ],
      },
    },
    seoDescription:
      'Heimdall은 Proxmox VM 생성, 네트워크 설정, 초기 구성을 단일 요청 흐름으로 처리하고 작업 이력과 실패 지점을 추적하게 만든 개인 프로젝트입니다.',
  },
  {
    slug: 'argus',
    routeGroup: 'archive',
    tier: 'secondary',
    order: 3,
    title: 'Argus',
    fullTitle: 'Argus | 질문 중심 금융 데이터 인터페이스 실험',
    tagline: '데이터 소스 -> 어댑터 -> 질문 중심 UI',
    summary: '시장 데이터를 소스 목록이 아니라 질문 흐름으로 재구성한 인터페이스 실험입니다.',
    projectType: '개인 프로젝트',
    role: '정보 구조 설계, 프로바이더-어댑터 구조 설계, 인터페이스 실험',
    coreStack: ['프로바이더', '어댑터', '대시보드', '목업 데이터'],
    narrative: {
      problem: '데이터는 많아도 읽는 순서가 보이지 않았습니다.',
      structure: '프로바이더-어댑터 구조로 소스를 교체 가능하도록 분리하고 질문 중심 UI로 재구성했습니다.',
      result: '소스 교체와 UI 실험을 분리할 수 있게 했습니다.',
    },
    resultLine: '수집 -> 정규화 -> 질문 UI',
    repoHref: 'https://github.com/CodingPenguin-yoon/argus-renewal',
    visual: {
      src: getAsset('/projects/argus.png'),
      alt: 'Argus 질문 중심 시장 데이터 대시보드 스크린샷',
      label: '질문 중심 화면',
      caption: '질문 순서 기준으로 재배치한 대시보드입니다.',
    },
    home: {
      variant: 'question-structure',
      eyebrow: '질문 중심 UI',
      summary: '시장 데이터를 질문 흐름 기준으로 다시 배열한 인터페이스 실험입니다.',
      supporting: '뉴스, 파생, 매크로 데이터를 같은 질문 구조 안에서 읽히게 정리했습니다.',
      steps: ['소스 수집', '어댑터 정규화', '질문 UI'],
      primaryCtaLabel: '자세히 보기',
      secondaryCtaLabel: '저장소 보기',
    },
    detail: {
      template: 'secondary',
      hero: {
        eyebrow: '개요',
        lead: '시장 데이터를 소스 목록이 아니라 질문 순서 기준으로 재배치한 UI 실험입니다.',
        resultTitle: '핵심 요약',
        result: '프로바이더-어댑터 계층으로 소스 교체와 UI 실험을 독립적으로 관리할 수 있게 구성했습니다.',
        emphasis: '핵심은 데이터 양보다 읽는 순서입니다.',
        primaryCtaLabel: '저장소 보기',
        secondaryCtaLabel: '홈으로',
      },
      problemBlock: {
        eyebrow: '문제',
        title: '먼저 읽어야 할 순서가 보이지 않았습니다',
        body: '뉴스, 파생, 매크로 데이터를 많이 쌓아도 먼저 봐야 할 질문이 드러나지 않으면 해석에 걸리는 시간은 줄어들지 않습니다. Argus는 읽는 순서를 다시 설계하는 데 초점을 둔 프로젝트입니다.',
        structureTitle: '소스 차이는 프로바이더-어댑터 계층에서 흡수했습니다',
        structureBody:
          '뉴스, 파생, 매크로 데이터를 소스별로 수집하고 프로바이더-어댑터 계층에서 형식 차이를 흡수했습니다. 덕분에 UI는 소스별 예외를 직접 알지 않고 같은 질문 흐름을 유지할 수 있었습니다.',
      },
      flow: {
        kind: 'source-to-question',
        eyebrow: '흐름',
        title: '수집 -> 정규화 -> 질문 UI',
        description: '원시 데이터를 프로바이더-어댑터 계층을 거쳐 질문 중심 UI로 재구성했습니다.',
        steps: [
          {
            title: '소스 수집',
            description: '소스별 입력을 분리해 현재 신호를 수집합니다.',
          },
          {
            title: '어댑터 정규화',
            description: '형식 차이를 흡수해 UI 계층의 예외 처리를 줄입니다.',
          },
          {
            title: '질문 UI',
            description: '먼저 답해야 할 질문 순서로 카드를 배치합니다.',
          },
        ],
      },
      learning: {
        eyebrow: '회고',
        title: '중요했던 점',
        items: [
          '질문을 먼저 고정하면 데이터 양보다 읽는 순서 설계가 선명해집니다.',
          '프로바이더-어댑터 구조가 있으면 UI는 질문 흐름에만 집중할 수 있습니다.',
          '목업과 파일 기반 경로를 유지해야 UI 실험 속도가 유지됩니다.',
        ],
      },
    },
    seoDescription:
      'Argus는 시장 데이터를 질문 순서로 재구성하고 프로바이더-어댑터 구조로 소스 차이를 분리한 금융 데이터 인터페이스 실험입니다.',
  },
];

export const portfolioProjects: PortfolioProject[] = projectSource
  .map((project) => ({
    ...project,
    directHref: projectPath(project.routeGroup, project.slug),
  }))
  .sort((a, b) => a.order - b.order);

export const mainProjects = portfolioProjects.filter((project) => project.tier === 'main');
export const secondaryProjects = portfolioProjects.filter((project) => project.tier === 'secondary');

export const portfolioActionLinks = [
  hasValue(portfolioProfile.email)
    ? {
        label: '이메일',
        href: `mailto:${portfolioProfile.email?.trim()}`,
        description: portfolioProfile.email!.trim(),
      }
    : null,
  hasValue(portfolioProfile.shortUrl)
    ? {
        label: '포트폴리오',
        href: portfolioProfile.shortUrl!.trim(),
        description: '공개 포트폴리오',
        external: true,
      }
    : null,
  hasValue(portfolioProfile.socials.linkedin)
    ? {
        label: 'LinkedIn',
        href: portfolioProfile.socials.linkedin!.trim(),
        description: '프로필',
        external: true,
      }
    : null,
  hasValue(portfolioProfile.socials.github)
    ? {
        label: 'GitHub',
        href: portfolioProfile.socials.github!.trim(),
        description: '저장소와 커밋',
        external: true,
      }
    : null,
  hasValue(portfolioProfile.resumeHref)
    ? {
        label: '이력서 PDF',
        href: portfolioProfile.resumeHref,
        description: 'PDF 이력서',
        download: true,
      }
    : null,
].flatMap((item) => (item ? [item] : [])) satisfies PortfolioActionLink[];

export const missingPortfolioValues = [
  !hasValue(portfolioProfile.email) ? '실제 이메일 주소' : null,
  !hasValue(portfolioProfile.shortUrl) ? '실제 포트폴리오 공개 URL' : null,
  ...portfolioProjects.map((project) => (!hasValue(project.period) ? `${project.title} 실제 기간` : null)),
].filter((item): item is string => Boolean(item));

export const getProjectBySlug = (slug: string, routeGroup?: 'projects' | 'archive') =>
  portfolioProjects.find((project) => project.slug === slug && (!routeGroup || project.routeGroup === routeGroup));
