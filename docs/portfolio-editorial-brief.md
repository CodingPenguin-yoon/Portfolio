# 포트폴리오 편집 원고

## 편집 목표

- 16:9 PDF 14페이지 안에서 조윤호가 어떤 문제를 발견하고, 무엇을 고민하고, 어떤 기준으로 결정하는 엔지니어인지 보여준다.
- 프로젝트 기능보다 `불편 → 첫 선택 → 문제 발견 → 선택지 → 결정 → 결과 → 한계`의 흐름을 우선한다.
- 실제 화면은 장식이 아닌 구현 증거로 사용하고, 구조도에는 제어·데이터·실패 흐름을 표시한다.
- `Verified`, `Previous`, `Planned`, `Not implemented`를 구분해 현재 구현 범위를 과장하지 않는다.

## 01. Cover — 어떤 엔지니어인가

### 역할

독자가 5초 안에 지원 직무와 엔지니어링 관점을 이해하게 한다.

### 확정 원고

**조윤호 · Platform Engineer**

> 반복 작업을 자동화하는 데서 시작해,
> 시스템의 책임과 실패 경계를 설계했습니다.

홈랩 운영의 반복을 줄이기 위해 자동화를 시작했습니다.
범위가 커지며 생긴 결합과 실패를 겪은 뒤, VM 생성·애플리케이션 배포·사용자 데이터의 수명주기를 분리했습니다.

### 시각 구조

- 왼쪽 60%: 이름, 직무, 핵심 문장, 짧은 소개
- 오른쪽 40%: `반복 운영 → 통합 자동화 → 책임 결합 발견 → Gjallar·Heimdall 분리 → 실패 시 기존 상태 보존`
- 하단: Email, GitHub, Web
- 프로젝트 화면은 표지에 억지로 배치하지 않고 구현 증거 페이지에서 크게 사용
- 기존 `Observe → Automate → Separate → Preserve` 카드와 과도한 중앙 여백 제거

### 독자에게 남길 인상

단순히 자동화 도구를 만든 사람이 아니라, 직접 운영하면서 구조의 문제를 발견하고 책임과 실패 범위를 다시 설계한 사람이다.

## 전체 14페이지 설계안 v1

| 페이지                | 역할                              | 핵심 내용                                                                 | 주 시각 자료                                   | 레이아웃                                                    |
| --------------------- | --------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| 01 Cover              | 어떤 엔지니어인가                 | 반복 자동화에서 책임·실패 경계 설계로 발전한 사람                         | 실제 경험을 압축한 변화 흐름                   | 왼쪽 60% 원고, 오른쪽 40% 변화 흐름                         |
| 02 Origin             | 왜 시작했는가                     | VM·네트워크·Docker·내부 설정·배포를 반복한 실제 불편                      | 반복 준비 흐름과 단계별 문제                   | 왼쪽 서사, 오른쪽 반복 흐름, 하단 처음의 목표               |
| 03 Automation Lens    | 어떤 관점을 얻었는가              | K-Le-PaaS에서 입력을 실행 계획으로 정규화하고 피드백하는 구조를 경험      | `klepaas-dashboard.png`와 CommandPlan 흐름     | 화면 55~60%, 개인 기여와 배운 관점 40~45%                   |
| 04 First Architecture | 처음에는 무엇을 만들었는가        | 초기 Heimdall이 VM 생성·설정·배포를 모두 담당한 이유                      | 초기 통합 자동화 구조도                        | 구조도 65%, 당시 선택 이유와 기대 35%                       |
| 05 Friction           | 무엇이 잘못됐는가                 | 범위와 의존성이 커지고 변경 이유·실패 원인이 뒤섞임                       | 증상→원인→운영 비용 인과 지도                  | 왼쪽 실제 문제, 중앙 인과 지도, 하단 판단 전환점            |
| 06 Decision           | 어떤 결정을 내렸는가              | 기능 추가보다 Gjallar와 Heimdall의 책임 분리를 선택                       | Before/After 책임 지도                         | 상단 갈림길, 중앙 Before/After, 하단 선택의 대가            |
| 07 Current System     | 지금 구조는 무엇인가              | Proxmox·Gjallar·Heimdall·Runtime·Storage의 제어·배포·데이터 경계          | 전체 시스템 아키텍처 지도                      | 구조도 75%, 범례와 핵심 경계 25%                            |
| 08 Gjallar Decision   | VM 생성은 어떻게 다루는가         | Actual state, Profile, Preflight, Approval, Native Create, Observed After | 승인 기반 실행 흐름                            | 왼쪽 판단 배경 35%, 오른쪽 실행 흐름 65%                    |
| 09 Gjallar Evidence   | 실제로 무엇을 구현했는가          | Inventory·Job·Storage·Observed state가 실행 근거로 남는 방식              | `gjallar.png`                                  | 실제 화면 70%, 화면 위 번호 주석과 하단 구현 근거 30%       |
| 10 Heimdall Promotion | 배포를 어떻게 격리하는가          | Exact Commit부터 Candidate 검증과 Current 승격까지의 상태 전이            | Candidate→Activation→Current 시퀀스            | 상단 고민·결정, 중앙 시퀀스 65%, 하단 불변 조건             |
| 11 Failure & Data     | 실패했을 때 무엇을 지키는가       | Build·Activation·Worker 실패별 보존 범위와 Runtime/Data 수명주기 분리     | 실패 시나리오 분기와 보존 대상 지도            | 왼쪽 실패 분기 60%, 오른쪽 데이터 경계 40%                  |
| 12 Heimdall Evidence  | 실제 동작은 어떻게 보이는가       | Commit·배포 세대·Health·Route·Current 상태를 화면으로 증명                | `heimdall.png`                                 | 실제 화면 70%, 핵심 상태 확대와 검증 근거 30%               |
| 13 Transfer           | 같은 판단을 다른 문제에도 썼는가  | K-Le-PaaS와 Argus에서 입력·공급자·실행 경계를 나눈 경험                   | `argus.png`, 03페이지 K-Le-PaaS 핵심 흐름 참조 | Argus 화면 60%, 오른쪽에 두 프로젝트의 공통 판단 비교       |
| 14 Closing            | 무엇을 할 수 있고 어디까지 했는가 | 핵심 판단, 구현 범위, 비범위, 기술 범주, 연락처                           | 별도 이미지 없음                               | 왼쪽 핵심 원칙, 중앙 Verified/Previous/Planned, 하단 연락처 |

### 페이지 리듬

`서사 → 서사 → 실제 화면 → 구조도 → 판단 → 비교 → 전체 구조 → 실행 흐름 → 실제 화면 → 상태 전이 → 실패 설계 → 실제 화면 → 비교 증거 → 마무리`

### 공통 디자인 규칙

- 한 페이지에 핵심 주장 하나만 둔다.
- 페이지 면적의 약 65~75%를 의미 있는 정보가 차지하게 한다.
- 제목 아래에는 상황과 판단을 설명하는 2~4개의 짧은 문단을 허용한다.
- 구조도에는 구성요소 이름뿐 아니라 제어·데이터·승인·실패 흐름을 표시한다.
- 실제 화면은 작은 우측 참고 이미지가 아니라 페이지의 55~70%를 차지하는 구현 증거로 사용한다.
- 사진 위에는 번호나 얇은 연결선만 표시하고, 설명은 옆이나 아래에 배치한다.
- 페이지마다 동일한 2단 레이아웃을 반복하지 않고 서사형·구조형·증거형·비교형을 교차한다.
- 작은 mono 라벨을 본문 대신 사용하지 않고, 축소 열람에서도 읽히는 최소 글자 크기를 유지한다.
- `Verified`, `Previous`, `Planned`, `Not implemented` 표기는 일관되게 유지한다.

## 상세 디자인 시스템

### 캔버스와 그리드

- 기준 캔버스: 화면 미리보기 `1280 × 720px`, PDF `960 × 540pt`
- 안전 여백: 좌우 64px, 상단 42px, 하단 36px
- 본문 그리드: 12 columns, 24px gutter
- 페이지 머리말과 번호는 고정하되 본문 레이아웃은 페이지 역할에 따라 변경한다.
- 의미 있는 정보가 페이지 면적의 65~75%를 차지하게 하되, 모든 공간을 카드로 채우지는 않는다.

### 타이포그래피

- 제목과 본문: `IBM Plex Sans KR`
- 페이지 번호, 상태, 짧은 기술 라벨: `IBM Plex Mono`
- 페이지 제목: 40~46px, 1~2줄
- 핵심 인용문: 26~32px
- 본문: 17~20px, 행간 1.55~1.7
- 캡션과 근거: 14~15px
- 최종 출력에서 14px보다 작은 정보성 텍스트를 만들지 않는다.
- 영문 대문자 라벨은 보조 정보에만 사용하고 한국어 본문을 대신하지 않는다.

### 색상

- 본문: `#101827`
- 보조 본문: `#526071`
- 선: `#D7DEE5`
- 보조 배경: `#F5F7F8`
- 핵심 결정과 정상 흐름: `#0F5961`
- 계획·주의·미구현: `#8A5A00`
- 상태는 색상만으로 구분하지 않고 텍스트 라벨을 함께 사용한다.

### 구조도 문법

- 실선: 제어 또는 실행 요청
- 점선: 상태 관찰 또는 결과 피드백
- 이중선: 데이터 접근
- 승인 지점: 명시적인 `Approval` 노드
- 실패 지점: amber marker와 실패 후 보존 대상을 한 쌍으로 표시
- 각 구조도는 `주체`, `대상`, `변경`, `실패 후 보존`을 읽을 수 있어야 한다.
- 기술 로고와 장식 아이콘으로 구조를 대신하지 않는다.

### 실제 화면 사용

- 증거 페이지에서 실제 화면은 전체 페이지의 55~70%를 사용한다.
- 원본 비율을 유지하고 읽을 수 없는 크기로 한쪽 열에 축소하지 않는다.
- 화면 위에는 1~3개의 번호 marker만 올리고 설명은 바깥에 둔다.
- 화면을 임의로 합성하거나 실제로 존재하지 않는 상태를 만들지 않는다.
- 확대 crop을 사용할 때는 같은 페이지에 전체 화면을 함께 둔다.

### 페이지 템플릿

1. `Narrative Split`: 짧은 서사와 인과 흐름
2. `Architecture Focus`: 전체 구조도와 범례
3. `Decision Compare`: 이전 구조·선택지·결정·대가 비교
4. `Evidence Screen`: 큰 실제 화면과 구현 근거
5. `Closing Summary`: 상태·범위·연락처 요약

## 페이지별 세부 설계

### 02. Origin — 왜 시작했는가

**핵심 질문:** 자동화는 어떤 실제 불편에서 시작됐는가?

**제목**

> 새 서비스를 올릴 때마다, 같은 실행 환경을 다시 만들었습니다.

**본문 초안**

홈랩에 새로운 프로그램을 올리는 일은 애플리케이션만 배포하는 것으로 끝나지 않았습니다. VM을 만들고, IP와 네트워크를 설정하고, Docker와 내부 실행 환경을 구성한 뒤에야 배포를 시작할 수 있었습니다.

프로젝트가 늘어날수록 같은 작업을 반복했고, 실행할 때마다 설정이 조금씩 달라졌습니다. 문제가 발생하면 애플리케이션, 네트워크, 실행 환경 중 어디서 실패했는지 다시 추적해야 했습니다.

> 처음의 목표는 거대한 플랫폼을 만드는 것이 아니라, 매번 반복하던 준비 작업을 줄이는 것이었습니다.

**시각 설계**

- 왼쪽 4 columns: 위 본문과 당시 가장 불편했던 두 지점
- 오른쪽 8 columns: `VM 생성 → IP·네트워크 → Docker → 내부 설정 → 배포`
- 각 단계 아래 실제 불편을 한 줄로 표시한다.
- 흐름 끝에서 `새 프로젝트 → 처음부터 반복`이 시작점으로 돌아가는 피드백 선을 둔다.

**제외**

- 아직 Gjallar와 Heimdall의 정답 구조를 보여주지 않는다.
- 홈랩을 대규모 상용 인프라처럼 표현하지 않는다.

### 03. Automation Lens — 어떤 관점을 얻었는가

**핵심 질문:** 반복 작업을 단순 스크립트가 아니라 실행 구조로 보게 된 계기는 무엇인가?

**제목**

> 자연어 요청을 바로 실행하지 않고, 실행 가능한 계획으로 바꿨습니다.

**본문 초안**

2인 팀으로 진행한 K-Le-PaaS에서 자연어 요청은 그대로 실행할 수 있는 입력이 아니었습니다. 요청의 의도와 대상을 해석하고, 실행 가능한 `CommandPlan`으로 정규화한 뒤 Kubernetes·NCP 작업에 연결해야 했습니다.

저는 Gemini 의도·엔티티 해석과 CommandPlan 경계, Kubernetes 상태 조회·재시작 명령 계획, 도메인 변경과 배포 URL 동기화, Prometheus 기반 NKS 모니터링을 구현했습니다. 영향이 큰 작업은 확인 상태를 거쳐 실행하고 결과를 다시 사용자에게 돌려주는 흐름을 경험했습니다.

> 입력과 실행 사이에 계획과 확인 단계를 두는 관점은 이후 홈랩 자동화의 출발점이 됐습니다.

**시각 설계**

- 왼쪽 7 columns: `klepaas-dashboard.png`를 원본 비율로 크게 배치
- 화면 안에서 실제로 식별 가능한 영역만 최대 3곳 표시
- 오른쪽 5 columns: `Natural Language → Intent & Entity → CommandPlan → Kubernetes/NCP → Feedback`
- 하단 상태: `Previous · 2인 팀`과 `Verified personal contribution`을 분리 표기

**근거**

- `public/projects/klepaas-dashboard.png`
- 자연어 해석, CommandPlan, 실행 확인, 개인 작성 commit과 구현 파일

**제외**

- 팀 전체 기능을 개인 단독 성과로 표현하지 않는다.
- K-Le-PaaS가 현재 홈랩 시스템의 직접 전신인 것처럼 표현하지 않는다.

### 04. First Architecture — 처음에는 무엇을 만들었는가

**핵심 질문:** 첫 자동화 구조는 왜 모든 책임을 한곳에 모았는가?

**제목**

> 처음에는 VM 생성부터 애플리케이션 배포까지 하나의 시스템이 맡아야 효율적이라고 생각했습니다.

**본문 초안**

반복 작업을 한 번의 요청으로 줄이기 위해 초기 Heimdall은 Terraform 기반 VM 생성, Ansible 기반 설정, 네트워크 구성, Docker 실행 환경과 애플리케이션 배포를 하나의 흐름에서 처리했습니다.

당시에는 실행 경로가 하나면 자동화 상태를 추적하기 쉽고, 새 서비스를 더 빠르게 올릴 수 있다고 판단했습니다. 실제로 수동 작업은 줄었지만, 시스템이 담당하는 책임도 함께 커졌습니다.

**시각 설계**

- 중앙 8 columns: `요청 → Heimdall Orchestrator → Terraform / Ansible / Docker → VM + Application`
- 오른쪽 4 columns: 당시 기대 세 가지 `한 번의 요청`, `반복 감소`, `한 경로에서 추적`
- 페이지 전체에 `Previous` 상태를 명확히 표시

**제외**

- Terraform·Ansible 구조를 현재 Heimdall 기능으로 표현하지 않는다.
- 첫 설계를 단순한 실패로 조롱하지 않고 당시에는 합리적이었던 이유를 남긴다.

### 05. Friction — 무엇이 잘못됐는가

**핵심 질문:** 자동화 범위가 커진 것이 왜 운영 문제로 바뀌었는가?

**제목**

> 자동화가 늘수록, 한 번의 변경이 더 많은 책임을 건드렸습니다.

**본문 초안**

VM 생성과 애플리케이션 배포는 변경되는 이유가 달랐습니다. 인프라 용량과 네트워크를 바꾸는 일, 애플리케이션 코드와 설정을 배포하는 일이 하나의 시스템 안에 묶이면서 서로 다른 실패를 같은 실행 경로에서 복구해야 했습니다.

Terraform·Ansible·Docker 의존성까지 함께 관리하자 새 기능을 추가할수록 실패 지점이 늘었고, 어떤 책임이 문제를 소유하는지 설명하기 어려워졌습니다.

> 자동화를 더 추가하는 것보다, 먼저 책임의 경계를 다시 정해야 했습니다.

**시각 설계**

- 상단: 실제 증상 `변경 영향 확대 / 실패 원인 혼재 / 의존성 증가`
- 중앙: `책임 결합 → 실행 경로 확대 → 복구 범위 확대` 인과 지도
- 하단: 갈림길 `기존 구조 확장 / 전체 재작성 / 책임 분리`
- 다음 페이지에서 선택을 공개하도록 `책임 분리`를 아직 강조색으로 확정하지 않는다.

**제외**

- 측정하지 않은 성능 수치나 운영 비용을 만들지 않는다.
- 단순히 마이크로서비스가 더 좋다는 일반론으로 설명하지 않는다.

### 06. Decision — 어떤 결정을 내렸는가

**핵심 질문:** 왜 기존 시스템에 기능을 추가하지 않고 둘로 나눴는가?

**제목**

> 기능을 더 붙이는 대신, 변경 이유가 다른 책임을 두 시스템으로 나눴습니다.

**본문 초안**

VM 생성과 애플리케이션 배포는 같은 홈랩 안에서 동작하지만 변경 주기, 실행 대상, 실패 영향이 달랐습니다. VM 실행 기반은 Gjallar가, 애플리케이션의 빌드와 배포는 Heimdall이 소유하도록 분리했습니다.

복잡성이 사라진 것은 아닙니다. 두 시스템 사이의 계약과 상태 관찰이 새로 필요해졌지만, 실패가 발생했을 때 무엇을 멈추고 무엇을 보존해야 하는지는 더 명확해졌습니다.

**시각 설계**

- 왼쪽 5 columns `Before`: Heimdall 안에 VM·설정·배포가 결합된 구조
- 중앙 2 columns: 결정과 분리 기준
- 오른쪽 5 columns `After`: Gjallar `Infrastructure Create`, Heimdall `Application Release`
- 하단 trade-off: `결합 감소`와 `시스템 간 계약 필요`를 함께 표시

**독자에게 남길 판단**

기능 수보다 변경 이유와 실패 경계를 기준으로 시스템 책임을 다시 나눌 수 있다.

### 07. Current System — 지금 구조는 무엇인가

**핵심 질문:** 현재 시스템에서 누가 무엇을 바꾸고 무엇을 보존하는가?

**제목**

> 실행 기반, 배포 세대, 사용자 데이터의 수명주기를 서로 다르게 다룹니다.

**본문 초안**

Gjallar는 Proxmox의 실제 상태를 확인하고 승인된 VM 생성 요청을 반영합니다. Heimdall은 고정한 commit으로 배포 후보를 만들고 검증된 세대만 현재 경로로 승격합니다. 애플리케이션 실행 세대와 PostgreSQL 사용자 데이터는 같은 실패 정책으로 삭제하거나 되돌리지 않습니다.

**시각 설계**

- 중앙 9 columns: 전체 아키텍처 지도
  - 사용자·요청
  - Gjallar Control → Proxmox VM Runtime
  - Git/Deployment Request → Heimdall Control → Runtime Generation
  - Project Gateway → Application
  - Application ↔ Storage VM PostgreSQL
- 오른쪽 3 columns: 책임과 보존 범례
- 제어, 상태 관찰, 데이터 접근을 서로 다른 선으로 표시
- `Storage VM`은 `Operational · user-confirmed` 상태로 구분

**제외**

- Planned OCI Edge 구조를 현재 구현에 섞지 않는다.
- 내부 IP, secret, 인증서, 정확한 방화벽 규칙을 표시하지 않는다.

### 08. Gjallar Decision — VM 생성은 어떻게 다루는가

**핵심 질문:** Proxmox 상태를 바꾸기 전에 무엇을 확인해야 하는가?

**제목**

> 실제 상태를 먼저 확인하고, 승인된 계획만 Proxmox에 반영합니다.

**본문 초안**

초기 자동화의 Terraform·Ansible 의존성을 유지하는 대신 Proxmox API 기반 native create 경로로 전환했습니다. Proxmox inventory를 actual state의 기준으로 두고, 용도별 VM Profile과 template·IP·network·storage 조건을 생성 전에 확인합니다.

요청은 `Draft → Preflight → Plan → Approval → Preview`를 거치며, 명시적인 승인 뒤에만 실제 Proxmox 상태를 변경합니다. 실행 결과는 job과 artifact, observed-after 상태로 남겨 나중에 다시 확인할 수 있게 했습니다.

**시각 설계**

- 왼쪽 4 columns: `왜 actual state인가`, `왜 승인 단계가 필요한가`
- 오른쪽 8 columns: `Inventory → Profile → Preflight → Plan → Approval → Native Create → Observed After`
- Approval 전후의 배경색을 다르게 하여 mutation 경계를 표시
- 실패 시 재실행과 확인이 가능한 job·artifact를 결과 영역에 연결

**상태와 한계**

- `Verified · Native Create`
- 제한적으로 gated Start를 지원하지만 전체 VM lifecycle로 표현하지 않는다.
- destructive controls가 있는 것처럼 표현하지 않는다.

### 09. Gjallar Evidence — 실제로 무엇을 구현했는가

**핵심 질문:** 앞 페이지의 실행 흐름을 실제 화면과 기록으로 확인할 수 있는가?

**제목**

> 요청 전 상태와 실행 후 결과를 같은 운영 화면에서 확인합니다.

**본문 초안**

자동화가 실제 상태를 가리지 않도록 Proxmox node, VM, storage inventory와 작업 상태를 함께 보여줍니다. 생성 요청과 실행 결과는 나중에 다시 확인할 수 있는 job·artifact로 남기고, observed-after 상태로 실제 반영 결과를 확인합니다.

**시각 설계**

- `gjallar.png`를 페이지 중앙 8~9 columns, 높이 65~70%로 배치
- 화면 전체를 유지하고 식별 가능한 영역에만 최대 3개 marker 사용
  1. Proxmox actual inventory
  2. VM·storage 상태
  3. job 또는 실행 상태
- 오른쪽 또는 하단에 marker 설명과 근거 상태를 둔다.
- 이미지 아래 한 줄: `화면에 보이는 정보 → 어떤 판단에 사용되는가`

**근거**

- `public/projects/gjallar.png`
- Profile schema, preflight, approval execute, Proxmox runner, job·artifact 구현과 집중 테스트

**주의**

- 화면에서 식별되지 않는 기능을 marker로 가리키지 않는다.
- 실제 화면을 장식용 배경으로 흐리게 처리하지 않는다.

### 10. Heimdall Promotion — 배포를 어떻게 격리하는가

**핵심 질문:** 새 배포가 기존 서비스에 영향을 주기 전에 어떻게 검증하는가?

**제목**

> 기존 서비스를 먼저 멈추는 대신, 후보 세대를 분리해 검증합니다.

**본문 초안**

이전 MVP의 `stop-old-then-run-new` 방식은 새 배포가 실패하면 기존 서비스까지 함께 잃을 수 있었습니다. 현재 Heimdall은 요청 시 고정한 commit과 설정 snapshot으로 generation candidate를 만들고, 세대별 network와 service alias로 기존 Current와 분리합니다.

Candidate의 service health를 확인한 뒤 Nginx 설정 검증, atomic replace, reload, 실제 route probe까지 성공해야 current metadata를 전환합니다. 성공이 확정되기 전에는 기존 Current와 운영 경로를 유지합니다.

**시각 설계**

- 상단 3 columns: `Previous` 방식과 발견한 위험
- 중앙 9 columns: 두 단계 시퀀스
  - Execution: `Exact Commit → Build → Generation Network → Start → Health`
  - Activation: `nginx -t → Atomic Replace → Reload → Route Probe → Current`
- Candidate와 Current를 평행한 두 lane으로 보여주고 승격 지점을 명확히 표시
- 하단 불변 조건: `검증 전 Current 유지`, `route probe 성공 후 metadata 전환`

**제외**

- 저장된 image를 즉시 되돌리는 release rollback이 구현된 것처럼 표현하지 않는다.
- health check와 route probe를 하나의 확인 단계로 뭉개지 않는다.

### 11. Failure & Data — 실패했을 때 무엇을 지키는가

**핵심 질문:** 실패한 배포를 정리하면서 기존 서비스와 데이터를 어떻게 보호하는가?

**제목**

> 실패 원인을 넓게 지우지 않고, 확인한 후보만 정리합니다.

**본문 초안**

Build 또는 Health가 실패하면 해당 deployment ID와 label이 일치하는 candidate만 정리하고 Current를 유지합니다. 활성화가 실패하면 last-known-good Nginx 설정과 이전 route를 복원합니다. Worker가 중단됐다가 다시 시작되면 Control DB, Nginx marker, Docker label을 비교하고 상태가 불확실한 candidate는 자동 삭제하지 않습니다.

애플리케이션 generation은 교체할 수 있는 실행 단위지만 PostgreSQL 사용자 데이터는 같은 수명주기로 되돌릴 수 없습니다. 프로젝트별 DB·login role provisioning과 배포 시 credential 전달은 구현했지만 DB purge, rotation, backup, restore와 data rollback은 현재 범위가 아닙니다.

**시각 설계**

- 왼쪽 7 columns: 실패 유형 세 개와 처리·보존 대상
  - Build/Health 실패 → exact candidate cleanup → Current 유지
  - Activation 실패 → last-known-good 복원 → 이전 route 유지
  - Worker 중단 → reconcile → 불확실한 candidate 보존
- 오른쪽 5 columns: `Runtime Generation ≠ PostgreSQL Data` 수명주기 비교
- 하단에 `Not implemented` 범위를 작은 글씨가 아닌 명확한 별도 영역으로 표시

**독자에게 남길 판단**

실패 시 모두 지우는 자동화보다, 확인한 범위만 정리하고 불확실한 상태를 보존하는 편을 선택했다.

### 12. Heimdall Evidence — 실제 동작은 어떻게 보이는가

**핵심 질문:** 배포 세대와 상태 전이를 실제 화면에서 확인할 수 있는가?

**제목**

> 배포 요청부터 세대와 현재 상태까지 하나의 실행 기록으로 추적합니다.

**본문 초안**

Heimdall은 저장소의 main commit을 고정하고 generation candidate를 빌드합니다. 배포 상태와 서비스 로그, 제한된 diagnostics를 제공하되 DB와 사용자 secret은 마스킹합니다. 화면은 새 세대가 어떤 상태에 있고 무엇이 Current인지 확인하는 운영 증거로 사용합니다.

**시각 설계**

- `heimdall.png`를 페이지 중앙 8~9 columns, 높이 65~70%로 배치
- 실제 화면에서 식별 가능한 상태만 최대 3개 marker로 설명
  1. commit 또는 배포 요청
  2. generation·health 상태
  3. Current 또는 route 결과
- 화면 옆에는 코드 목록 대신 `화면 상태 ↔ 검증된 구현 근거`를 연결한다.

**근거**

- `public/projects/heimdall.png`
- commit snapshot, generation candidate, health, gateway activation, reconciliation 집중 테스트 `9 passed`

**주의**

- 화면에서 확인할 수 없는 복구 동작은 11페이지 구조도에서 설명하고, 이 페이지에 억지로 표시하지 않는다.

### 13. Transfer — 같은 판단을 다른 문제에도 썼는가

**핵심 질문:** 책임과 실행 경계를 나누는 사고방식이 특정 프로젝트에만 머물렀는가?

**제목**

> 도구는 달라도, 입력과 실행 사이에 경계를 두는 판단은 반복됐습니다.

**본문 초안**

K-Le-PaaS에서는 자연어 입력을 곧바로 실행하지 않고 Intent·Entity와 CommandPlan으로 정규화했습니다. Argus에서는 파생·현물·뉴스 공급자를 독립된 adapter로 수집하고, normalized snapshot을 거쳐 판단과 대시보드가 원천 차이를 직접 떠안지 않도록 구성했습니다.

두 프로젝트의 도메인은 다르지만 입력을 바로 핵심 실행 로직에 연결하지 않고, 해석하거나 정규화하는 경계를 둔다는 판단은 같습니다.

**시각 설계**

- 왼쪽 7 columns: `argus.png`를 크게 배치
- 오른쪽 5 columns: 두 프로젝트의 공통 구조 비교
  - K-Le-PaaS: `Input → CommandPlan → Execution`
  - Argus: `Provider → Normalized Snapshot → Judgement`
- K-Le-PaaS 이미지는 03페이지에서 이미 크게 사용했으므로 반복하지 않는다.
- 하단 상태: K-Le-PaaS는 `Previous · 2인 팀`, Argus는 `Implemented`

**제외**

- Argus를 플랫폼 포트폴리오의 주 프로젝트처럼 확장하지 않는다.
- 공통점이 있다는 이유로 두 프로젝트가 같은 아키텍처라고 표현하지 않는다.

### 14. Closing — 무엇을 할 수 있고 어디까지 했는가

**핵심 질문:** 이 포트폴리오를 읽고 어떤 사람으로 기억해야 하는가?

**제목**

> 운영 문제를 발견하고, 자동화한 뒤, 실패 경계를 다시 설계합니다.

**마무리 원고**

반복 작업을 줄이기 위해 자동화를 시작했습니다. 자동화의 범위가 커지면서 책임 결합과 실패 범위를 경험했고, 기능을 더 추가하는 대신 시스템의 변경 이유와 보존 대상을 기준으로 구조를 다시 나눴습니다.

완성된 구조만 보여주기보다 첫 판단이 왜 바뀌었는지, 실패했을 때 무엇을 지키려 했는지, 그리고 아직 구현하지 않은 범위까지 설명할 수 있는 엔지니어가 되고자 합니다.

**시각 설계**

- 상단 7 columns: 핵심 원칙 세 가지
  1. 실행 전에 실제 상태와 계획을 확인한다.
  2. 변경 이유가 다르면 책임과 실패 경계를 분리한다.
  3. 불확실한 상태는 자동 삭제보다 보존을 선택한다.
- 오른쪽 5 columns: 현재 프로젝트 상태
  - Implemented: Heimdall, Gjallar, Argus
  - Previous · 2인 팀: K-Le-PaaS와 검증된 개인 기여
  - Planned: External Exposure Architecture
  - Not implemented: image rollback, DB backup/restore·purge·rotation, data rollback
- 하단: 기술 범주, 학력, 자격증, Email, GitHub, Web

**마지막 인상**

기술 목록이 아니라 문제를 발견하고 판단을 수정하며 실패 범위를 설계하는 방식이 기억에 남아야 한다.

## 구현 컴포넌트 설계

### 유지·개편

- `PortfolioPage.astro`: 14페이지 shell, header/footer, 상태 표기 유지
- `PortfolioDocument.astro`: 페이지별 큰 마크업을 템플릿 조합으로 재구성
- `ArchitectureMap.astro`: 노드 나열이 아닌 labeled edge와 책임 경계를 지원하도록 개편
- `FlowDiagram.astro`: 승인·피드백·실패 분기를 표현할 수 있도록 확장
- `EvidenceFigure.astro`: 작은 우측 이미지가 아닌 큰 화면과 외부 annotation 영역을 지원
- `StatusBadge.astro`: Implemented/Previous/Planned/Not implemented의 텍스트 상태를 통일

### 신규 또는 분리할 컴포넌트

- `NarrativeBlock`: 상황·고민·결정·결과 본문
- `DecisionCompare`: Before/After와 trade-off
- `AnnotatedScreenshot`: 전체 화면, marker, 외부 설명
- `FailureBoundaryMap`: 실패 유형·처리·보존 대상을 연결
- `LifecycleComparison`: Runtime generation과 PostgreSQL data 비교
- `EvidenceNote`: 화면·코드·테스트 근거와 주장의 연결

## 구현 순서

1. 14페이지 데이터 계약과 원고를 `portfolio-document.ts`에 반영
2. 공통 12-column grid와 5개 페이지 템플릿 구현
3. 01~06 서사·결정 페이지 구현 및 화면 검증
4. 07 전체 시스템 구조도 구현 및 연결선 검증
5. 08~12 Gjallar·Heimdall 흐름과 실제 화면 구현
6. 13~14 확장·마무리 페이지 구현
7. 각 페이지를 동일한 16:9 viewport에서 캡처해 밀도·가독성 검증
8. PDF를 다시 출력하고 14페이지, 글꼴, 이미지, reading order 검증

## 완료 기준

- 정확히 14페이지이며 모든 페이지가 `960 × 540pt`다.
- 제목만 읽어도 `불편 → 첫 설계 → 문제 → 분리 → 현재 구조 → 실패 대응 → 확장`이 이어진다.
- 증거 페이지 03, 09, 12, 13의 실제 화면이 페이지 면적의 최소 55%를 차지한다.
- 구조도에서 제어·상태·데이터·승인·실패 흐름을 구분할 수 있다.
- 페이지마다 최소 하나의 판단, 구현 근거 또는 명시적 한계가 있다.
- 정보성 텍스트가 최종 출력에서 14px 미만으로 내려가지 않는다.
- 내부 IP, token, secret, 인증서, 계정 정보가 노출되지 않는다.
- `Previous`, `Planned`, `Not implemented`가 현재 구현과 섞이지 않는다.
- 브라우저 미리보기와 PDF의 페이지 내용·순서가 동일하다.
