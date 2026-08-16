# 포트폴리오 구현 근거표

## 사용 규칙

- `Verified`: 코드와 테스트 또는 실제 화면으로 확인했다.
- `User-confirmed`: 사용자의 운영 설명으로 확인했지만 저장소 증거는 추가 확인이 필요하다.
- `Designed`: 상세 설계가 있으나 현재 코드에는 아직 구현되지 않았다.
- `Planned`: 향후 방향만 확정됐다.
- 최종 포트폴리오에는 내부 IP, 토큰, 인증서, 계정, 정확한 방화벽 규칙을 넣지 않는다.

## Heimdall

현재 저장소: `/Users/yoon/03_projects/04_my_vm_proxmox/heimdall_final`

이전 MVP 저장소: `/Users/yoon/03_projects/04_my_vm_proxmox/02_Heimdall`

| 주장 | 상태 | 근거 | 포트폴리오 표현 |
| --- | --- | --- | --- |
| Public GitHub 프로젝트 등록과 main 배포 요청 | Verified | `README.md:5-18`, project·deployment API | 저장소의 main commit을 single-host Docker preview로 배포한다. |
| 정확한 commit checkout 후 Docker image build | Verified | `backend/src/heimdall/runtime/docker.py:99-251` | 요청 시 고정한 commit과 설정 snapshot으로 generation candidate를 빌드한다. |
| 단일·다중 서비스 generation candidate | Verified | `backend/src/heimdall/runtime/docker.py:99-251`, `backend/src/heimdall/runtime/gateway_config.py:7-31` | 세대별 network와 고유 service alias를 사용해 후보 실행 환경을 분리한다. |
| health check와 실제 route probe 뒤 current 승격 | Verified | `README.md:198-213`, `backend/src/heimdall/runtime/gateway.py:151-214` | service health와 Nginx route가 모두 정상일 때만 current metadata를 전환한다. |
| Nginx 설정 검증과 atomic activation | Verified | `backend/src/heimdall/runtime/gateway.py:151-214`, `:699-703` | `nginx -t`, atomic config replace, reload, route probe 순으로 활성화한다. |
| 활성화 실패 시 직전 정상 경로 복원 | Verified | `backend/src/heimdall/runtime/gateway.py:215-257` | 실패한 후보를 운영 트래픽에 노출하지 않고 last-known-good 설정과 이전 세대를 유지한다. |
| Worker 재시작 reconciliation | Verified | `README.md:246-258`, `backend/src/heimdall/runtime/docker.py:400-448` | Control DB, Nginx marker, Docker label을 비교하고 불확실하면 삭제보다 보존을 선택한다. |
| exact candidate cleanup과 이전 세대 회수 | Verified | `backend/src/heimdall/runtime/docker.py:312-324`, `:450-469`, `backend/src/heimdall/runtime/gateway.py:505-524` | 실패한 배포 ID와 label이 일치하는 후보만 정리하고, 이전 세대는 성공 확정 뒤 회수한다. |
| SSE 이벤트·서비스 로그와 민감정보 마스킹 | Verified | `README.md:20-24`, runtime log·redaction 코드 | 배포 상태와 bounded diagnostics를 제공하되 DB·사용자 secret은 마스킹한다. |
| 저장된 image의 즉시 release rollback | Not implemented | `project-docs/project-profile.md:31`, `project-docs/product-scope.md:40-43` | 과거 commit을 다시 빌드할 수는 있지만 `이미지 롤백 구현`이라고 쓰지 않는다. |
| 프로젝트별 PostgreSQL DB와 login role 생성 | Verified | `backend/src/heimdall/project_database/service.py:38-160`, `provisioner.py:20-142` | PostgreSQL에서 프로젝트별 DB·login role·schema 권한을 만들고 접속을 검증한다. |
| deploy-time database credential injection | Verified | `project-docs/project-profile.md:66-68`, runtime model·Docker secret mount 코드 | DB 접근을 선언한 서비스에만 배포 시점의 연결 정보와 read-only secret을 전달한다. |
| DB 삭제·purge·rotation·backup·restore | Not implemented | `backend/src/heimdall/project_database/router.py:15-26`, `project-docs/product-scope.md:42-43` | `프로젝트 단위 격리 provisioning과 배포 연동`으로 범위를 한정한다. |
| stop-old-then-run-new 방식의 이전 MVP | Previous | 이전 저장소 `product/apps/api/app/services/executor_local_docker.py:802-951` | 기존 교체 위험을 발견하고 generation 승격 구조로 개선한 Before 근거로만 사용한다. |
| PostgreSQL을 별도 Storage VM에서 운영 | User-confirmed | 사용자의 현재 운영 설명. 코드의 DB endpoint 설정은 외부 PostgreSQL을 받을 수 있으나 기본 Compose는 단일 VM 예시다. | 운영 구조로 표시하되, 기본 Compose 기능이라고 설명하지 않는다. |
| OCI Edge → WireGuard → Internal Ingress → Project Gateway | Planned | 사용자가 제공한 외부 공개 구조 설계 | `Planned Architecture` 한 페이지에서만 설명한다. |

검증 실행:

```text
이전 MVP 검증: 24 passed in 0.74s
tests/test_deployments.py, tests/test_project_databases.py

현재 저장소 검증 결과는 최종 PDF 제작 전에 별도로 기록한다.
```

## Gjallar

저장소: `/Users/yoon/03_projects/04_my_vm_proxmox/01_Gjallar`

| 주장 | 상태 | 근거 | 포트폴리오 표현 |
| --- | --- | --- | --- |
| Proxmox inventory 조회 | Verified | `docs/overview/current-state.md`, `backend/app/proxmox/inventory.py` | Proxmox를 actual state의 source of truth로 두고 inventory를 조회한다. |
| Proxmox API 기반 native VM create | Verified | `docs/decisions/0001-proxmox-native-create-vm.md:9-28`, `backend/app/vm_create/proxmox_runner.py`, contract tests | Terraform executor 대신 Proxmox clone/config/task API로 VM을 생성한다. |
| Terraform·Ansible active dependency 제거 | Verified | `docs/decisions/0002-remove-legacy-iac-readiness.md:9-29`, `backend/tests/contracts/test_legacy_backend_cleanup.py` | 초기 Heimdall의 IaC 의존성을 제거하고 Proxmox native 경로로 전환했다. |
| 상위 VM profile 추상화 | Verified | `backend/tests/manifests/test_profile_schema.py:17-80`, `backend/tests/contracts/test_api_v1_vm_create.py:64-101` | 기본 Proxmox template 위에 용도별 profile을 두어 CPU·메모리·디스크 범위와 access 권장값을 재사용한다. |
| template readiness 검증 | Verified | `backend/tests/manifests/test_profile_schema.py:79-80`, `backend/tests/contracts/test_api_v1_vm_create.py` | cloud-init과 guest agent 준비 상태를 생성 전 검증한다. |
| IP·network·storage preflight | Verified | `docs/features/create-vm.md`, `backend/app/vm_create/preflight.py` | 고정 IP, bridge, storage, template 조건을 생성 전에 확인한다. |
| 승인·최종 acknowledgement 뒤 live mutation | Verified | `docs/overview/current-state.md:104-121`, `docs/features/create-vm.md`, approval execute tests | draft → preflight → plan → approval → preview 뒤 명시적 승인에서만 Proxmox 상태를 바꾼다. |
| stopped create와 boot_and_verify | Verified | `docs/decisions/0001-proxmox-native-create-vm.md:18-24`, runner tests | 기본은 정지 상태로 만들고, 선택 시 부팅·guest-agent IP·cloud-init 완료까지 검증한다. |
| job·artifact·observed-after evidence | Verified | `docs/features/create-vm.md`, `backend/app/jobs`, `backend/app/db/vm_runtime.py` | 요청과 실행 결과를 나중에 확인할 수 있는 job·artifact로 남긴다. |
| 모든 VM 작업 자동화 | False claim | 현재 VM Instances는 stopped non-template VM의 gated Start만 지원하며 destructive controls는 없음. | `VM 수명주기 전체`라고 넓게 표현하지 않고, 현재는 native Create VM과 제한된 운영 기능이라고 쓴다. |

검증 실행:

```text
32 passed, 7 subtests passed in 2.18s
test_profile_schema.py
test_api_v1_vm_create.py
test_api_v1_vm_create_approval_execute.py
test_proxmox_runner.py
```

## K-Le-PaaS

저장소: `/Users/yoon/03_projects/zz_past_project/klepaas_project/backend_klepaas_test`

| 주장 | 상태 | 근거 | 포트폴리오 표현 |
| --- | --- | --- | --- |
| 2인 팀 프로젝트 | Verified | 공모전 작품 제출 신청서의 신청인·팀원 정보 | 2인 팀 프로젝트로 표기한다. 개인 기여는 별도로 설명한다. |
| 자연어 → intent/entities → CommandPlan | Verified | `backend-hybrid/app/api/v1/nlp.py:101-174`, `backend-hybrid/app/services/commands.py:105-354` | Gemini 해석 결과를 실행 가능한 명령 계획으로 변환한다. |
| Kubernetes/NCP 작업 실행 | Verified | `backend-hybrid/app/services/commands.py:572-670` | 명령 계획을 Kubernetes·NCP 작업으로 연결한다. |
| 고위험 작업 확인 상태 | Verified | `backend-hybrid/app/api/v1/nlp.py:644-682`, `:957-1111` | 영향이 큰 작업은 대기 상태로 전환하고 사용자 확인 뒤 실행한다. |
| 명령과 결과 이력 저장 | Verified | `backend-hybrid/app/api/v1/nlp.py:119-129`, `:204-211` | 명령의 해석·상태·결과를 저장해 실행 경로를 추적한다. |
| 실제 서비스 화면과 명령 성공 기록 | Verified | `public/projects/klepaas-dashboard.png`, 로컬 screenshots | 제품 화면과 실행 기록을 시각 근거로 사용한다. |
| Gemini 의도·엔티티 해석 흐름 | Verified personal contribution | `backend-hybrid/app/llm/gemini.py:14-104`, 관련 작성 commit `9c48edc`, `7659d71`, `e154510`, `49b8195` | 자연어 요청에서 실행 대상과 의도를 추출하는 흐름을 구현했다. |
| Kubernetes 상태 조회·재시작 명령 계획 | Verified personal contribution | `backend-hybrid/app/services/commands.py:171-219`, 관련 작성 commit `b4c2eb9`, `4e8f86e`, `b8e8f76` | Pod·Service·Deployment 상태 조회와 재시작 명령을 CommandPlan으로 연결했다. |
| 도메인 변경과 배포 URL 동기화 | Verified personal contribution | `backend-hybrid/app/services/commands.py:152-169`, 관련 작성 commit `63fbfa2`, `31cbdb1`, `23da945`, `d3aa475` | Ingress 도메인 변경과 배포 URL 동기화 흐름을 맡았다. |
| Prometheus 기반 NKS 상세 모니터링 | Verified personal contribution | `backend-hybrid/app/api/v1/monitoring.py:26-125`, 관련 작성 commit `bfb5c77`, `0106cd1`, `ca58823` | Prometheus 메트릭을 NKS 리소스 상태 화면에 연결했다. |

## Argus

저장소: `/Users/yoon/03_projects/05_economy_project/argus_renewal`

| 주장 | 상태 | 근거 | 포트폴리오 표현 |
| --- | --- | --- | --- |
| 공급자별 데이터 수집 경계 | Verified | `README.md:43-76`, `backend/src/argus_v2/providers` | 파생·현물·뉴스 공급자를 독립된 adapter로 수집한다. |
| provider health와 snapshot 저장 | Verified | `README.md:50-59`, storage와 migration 코드 | 원천 상태와 정규화 snapshot을 SQLite에 기록한다. |
| 파생 → 뉴스·매크로 → 현물 반응 판단 순서 | Verified | `AGENTS.md`, `README.md:7-23` | 데이터의 역할을 분리한 판단 구조를 한 페이지로 요약한다. |
| Next.js 대시보드 | Verified | `frontend/src/app/argus`, `public/projects/argus.png` | 구현 화면 하나와 수집 흐름만 보여준다. |

## 기존 포트폴리오에서 바로잡을 문구

1. `Heimdall 이미지 롤백` → 삭제. 현재 구현은 후보 격리와 활성화 실패 복구이며 저장 image 승격은 비범위다.
2. `Heimdall은 Terraform/Ansible VM 프로비저닝 컨트롤러` → 과거 구조로 이동한다.
3. `Heimdall의 안전한 세대 승격` → 현재 구현으로 표기하되, Nginx 활성화 실패 복구와 image rollback을 구분한다.
4. `Gjallar가 모든 VM lifecycle을 관리` → 현재 구현 범위보다 넓다. Native Create VM, inventory, 제한된 gated operations로 좁힌다.
5. `별도 Storage VM` → 사용자의 운영 구조와 코드의 프로젝트별 DB provisioning 기능을 나눠 설명한다.
6. K-Le-PaaS의 팀 기능을 개인 단독 성과처럼 표현하지 않는다.
