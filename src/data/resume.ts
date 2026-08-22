export interface ResumeSkillGroup {
  label: string;
  items: string[];
}

export interface ResumeProject {
  id: 'heimdall' | 'gjallar' | 'klepaas';
  period: string;
  type: string;
  role: string;
  title: string;
  summary: string;
  highlights: string[];
  stack: string[];
  evidence?: {
    label: string;
    href: string;
  }[];
}

export const resumeProfile = {
  name: '조윤호',
  nameEn: 'Yunho Cho',
  role: 'Platform Engineer',
  secondaryRole: 'Deployment Automation / Infrastructure Operations',
  statement: '배포와 인프라 운영을 자동화하고, 실행 후 실제 상태까지 확인합니다.',
  summary:
    '공개 GitHub 저장소의 main commit을 빌드해 검증된 Preview만 활성화하는 배포 도구를 만들었습니다. 자연어 명령을 Kubernetes 작업으로 연결하는 API와, Proxmox VM 변경을 작업별 확인 절차로 통제하고 실제 상태를 다시 확인하는 운영 도구도 구현했습니다. 개인 프로젝트는 직접 운영하는 Proxmox 3노드 환경에 배포해 검증합니다.',
  location: 'Seoul, Korea',
  updated: 'Updated 2026.08',
} as const;

export const resumeInfrastructure = {
  title: '직접 운영하는 환경에서 프로젝트를 검증했습니다.',
  summary:
    'Proxmox 노드 3대와 IPFire로 분리한 RED·GREEN·ORANGE 네트워크, NAS/NFS, WireGuard·OCI 리버스 프록시를 운영합니다. 이 환경에 Heimdall과 Gjallar를 배포해 정상 동작과 실패 상황을 확인했습니다.',
  items: ['Proxmox VE 3-node', 'IPFire network segmentation', 'NAS / NFS storage', 'WireGuard / OCI reverse proxy'],
} as const;

export const resumeSkillGroups: ResumeSkillGroup[] = [
  {
    label: 'Platform / Runtime',
    items: ['Linux', 'Docker', 'Kubernetes', 'Proxmox VE', 'NCP'],
  },
  {
    label: 'Backend / Data',
    items: ['Python', 'FastAPI', 'PostgreSQL', 'REST API', 'WebSocket'],
  },
  {
    label: 'Delivery / Observability',
    items: ['Git', 'NGINX', 'Prometheus', 'GitHub Actions'],
  },
  {
    label: 'Network / Storage',
    items: ['IPFire', 'WireGuard', 'Reverse Proxy', 'NFS', 'NAS'],
  },
];

export const resumeProjects: ResumeProject[] = [
  {
    id: 'heimdall',
    period: '진행 중',
    type: '개인 프로젝트',
    role: '설계 / FastAPI 백엔드 / 배포 Worker / React UI',
    title: 'Git 기반 셀프호스팅 Preview 배포 도구',
    summary:
      '공개 GitHub 저장소의 main commit을 격리된 Docker candidate로 빌드하고, health와 route 검증을 통과한 경우에만 Preview를 전환합니다.',
    highlights: [
      '배포 대상 commit과 서비스·라우팅·환경 설정을 변경 불가능한 snapshot으로 저장하고, 서비스별 이미지 빌드와 candidate 실행을 자동화했습니다.',
      'candidate 컨테이너의 health check와 NGINX 라우팅이 정상일 때만 활성 릴리스로 전환합니다. 라우팅 검증에 실패하면 기존 Preview를 유지하도록 구현하고 테스트했습니다.',
      '배포 이력과 로그, 실패 원인을 기록하고 프로젝트별 PostgreSQL 데이터베이스와 계정을 자동으로 생성하도록 구현했습니다.',
    ],
    stack: ['Git', 'Docker', 'NGINX', 'FastAPI', 'React', 'PostgreSQL'],
  },
  {
    id: 'klepaas',
    period: '2025.09 - 2025.12',
    type: '팀 프로젝트',
    role: '백엔드 / 자연어 명령 / Kubernetes 실행·조회 / 모니터링',
    title: '자연어 기반 Kubernetes 운영 플랫폼',
    summary: '웹과 Slack의 자연어 요청을 Kubernetes·NCP 운영 작업으로 연결하고 결과를 전달하는 팀 프로젝트입니다.',
    highlights: [
      'Gemini가 해석한 요청을 Kubernetes 상태·로그·외부 URL 조회, 재시작·스케일링·버전 롤백과 Deployment·Service·Ingress·Namespace 조회 API에 연결했습니다.',
      'Prometheus에서 NKS의 CPU·메모리·디스크·네트워크 지표를 조회하는 API와 WebSocket 엔드포인트를 구현했습니다.',
      'Ingress에서 Service의 외부 접근 주소를 조회하고, NCP SourceDeploy 과정에서 사용자·저장소별 service URL을 생성·저장·조회하도록 구현했습니다.',
    ],
    stack: ['Kubernetes', 'Gemini', 'FastAPI', 'Prometheus', 'NCP'],
    evidence: [
      {
        label: 'PR #28',
        href: 'https://github.com/K-Le-PaaS/backend-hybrid/pull/28',
      },
      {
        label: 'PR #42',
        href: 'https://github.com/K-Le-PaaS/backend-hybrid/pull/42',
      },
      {
        label: 'PR #63',
        href: 'https://github.com/K-Le-PaaS/backend-hybrid/pull/63',
      },
    ],
  },
  {
    id: 'gjallar',
    period: '진행 중',
    type: '개인 프로젝트',
    role: '설계 / FastAPI 백엔드 / 운영 UI / Proxmox 연동',
    title: 'VM 변경을 통제하고 실제 상태를 확인하는 Proxmox 운영 도구',
    summary:
      'Proxmox inventory를 조회하고 VM 생성·시작을 작업별 확인 절차로 통제합니다. 작업 완료 뒤 Proxmox task와 실제 상태를 다시 확인하고, 결과가 불명확하면 재확인 대상으로 남깁니다.',
    highlights: [
      'Proxmox API로 노드·VM·템플릿·스토리지·네트워크의 실제 상태를 조회하고, 역할 기반 권한과 입력 검증을 적용했습니다.',
      'VM 생성은 승인과 최종 확인 후 실행하고, VM Start는 명시적 확인과 idempotency key로 중복 요청을 막았습니다.',
      'Proxmox task 완료와 실제 VM 상태를 다시 확인하고, 시간 초과나 상태 불일치는 성공으로 처리하지 않고 재확인 대상으로 기록했습니다.',
    ],
    stack: ['Proxmox API', 'FastAPI', 'React', 'PostgreSQL'],
  },
];

export const resumeEducation = {
  school: '광운대학교',
  major: '전자통신공학과',
  status: '졸업',
  date: '2026.02',
} as const;

export const resumeCertifications = ['정보처리기사', '리눅스마스터 2급'] as const;
