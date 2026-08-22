import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const homepage = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const heimdallCaseStudy = await readFile(new URL('../dist/projects/heimdall/index.html', import.meta.url), 'utf8');
const klepaasCaseStudy = await readFile(new URL('../dist/projects/klepaas/index.html', import.meta.url), 'utf8');
const gjallarCaseStudy = await readFile(new URL('../dist/projects/gjallar/index.html', import.meta.url), 'utf8');
const resume = await readFile(new URL('../dist/resume/index.html', import.meta.url), 'utf8');
const notFound = await readFile(new URL('../dist/404.html', import.meta.url), 'utf8');

const renderedPages = [homepage, heimdallCaseStudy, klepaasCaseStudy, gjallarCaseStudy, resume];

const positionOf = (fragment) => {
  const position = homepage.indexOf(fragment);
  assert.notEqual(position, -1, `Expected homepage to include ${fragment}`);
  return position;
};

const resumePositionOf = (fragment) => {
  const position = resume.indexOf(fragment);
  assert.notEqual(position, -1, `Expected resume to include ${fragment}`);
  return position;
};

test('the primary hero action opens the Heimdall case study', () => {
  const heroStart = positionOf('class="home-hero"');
  const heroEnd = homepage.indexOf('</section>', heroStart);
  const hero = homepage.slice(heroStart, heroEnd);

  assert.match(hero, /href="\/projects\/heimdall"/);
});

test('featured projects lead with delivery, then cloud and operations evidence', () => {
  const heimdall = positionOf('id="heimdall"');
  const klepaas = positionOf('id="klepaas"');
  const gjallar = positionOf('id="gjallar"');

  assert.ok(heimdall < klepaas, 'Expected Heimdall before K-Le-PaaS');
  assert.ok(klepaas < gjallar, 'Expected K-Le-PaaS before Gjallar');
});

test('the public portfolio contains only the three platform engineering projects', async () => {
  assert.doesNotMatch(homepage, /href="\/projects\/argus"/);
  assert.doesNotMatch(resume, /href="\/projects\/argus"/);
  await assert.rejects(access(new URL('../dist/projects/argus/index.html', import.meta.url)), { code: 'ENOENT' });
  await assert.rejects(access(new URL('../dist/archive/argus/index.html', import.meta.url)), { code: 'ENOENT' });
});

test('the web resume links the current PDF', () => {
  assert.match(resume, /href="\/resume\/yunho-cho-resume\.pdf"/);
});

test('default page metadata reflects the current platform engineering portfolio', () => {
  assert.match(notFound, /Git 기반 Preview 배포와 Kubernetes·Proxmox 운영 도구/);
  assert.doesNotMatch(notFound, /Terraform|Ansible/);
});

test('the resume leads with deployment automation and keeps the validation environment factual', () => {
  const heimdall = resumePositionOf('href="/projects/heimdall"');
  const klepaas = resumePositionOf('href="/projects/klepaas"');
  const gjallar = resumePositionOf('href="/projects/gjallar"');

  assert.ok(heimdall < klepaas, 'Expected Heimdall before K-Le-PaaS in the resume');
  assert.ok(klepaas < gjallar, 'Expected K-Le-PaaS before Gjallar in the resume');
  assert.match(resume, /Validation environment/);
  assert.doesNotMatch(resume, /Planned|이미지 롤백/);
});

test('the resume uses direct language instead of abstract portfolio copy', () => {
  assert.match(resume, /배포와 인프라 운영을 자동화하고, 실행 후 실제 상태까지 확인합니다/);
  assert.match(resume, /대표 프로젝트/);
  assert.doesNotMatch(
    resume,
    /하나의 흐름|운영 문제에서 시작한 프로젝트|immutable|lifecycle|사후 검증을 포함한|Let's talk/
  );
});

test('project copy stays within the implemented product boundaries', () => {
  assert.match(resume, /공개 GitHub 저장소의 main commit/);

  assert.match(klepaasCaseStudy, /Ingress에서 Service의 외부 접근 주소를 조회/);
  assert.match(klepaasCaseStudy, /재시작·스케일링·버전 롤백/);
  assert.match(klepaasCaseStudy, /NCP SourceDeploy 과정에서 사용자·저장소별 service URL/);
  assert.doesNotMatch(klepaasCaseStudy, /자동 동기화|현재 자동으로 추적/);

  assert.match(gjallarCaseStudy, /VM 생성은 승인과 최종 확인 후 실행/);
  assert.match(gjallarCaseStudy, /VM Start는 명시적 확인과 중복 방지/);
  assert.match(gjallarCaseStudy, /개발용 fake inventory/);
  assert.doesNotMatch(gjallarCaseStudy, /DRS|migration backend/);
  assert.doesNotMatch(resume, /DRS|migration backend/);
  assert.doesNotMatch(gjallarCaseStudy, /가상 데이터로 대체하지 않습니다/);
});

test('project evidence appears before the infrastructure validation environment', () => {
  const projects = positionOf('id="projects"');
  const infrastructure = positionOf('id="infrastructure"');

  assert.ok(projects < infrastructure, 'Expected projects before infrastructure');
});

test('the Heimdall case study exposes failure handling, verification, and scope boundaries', () => {
  const proofStart = heimdallCaseStudy.indexOf('id="failure-evidence"');
  const productStart = heimdallCaseStudy.indexOf('class="case-section case-product"');

  assert.notEqual(proofStart, -1, 'Expected a failure and evidence section');
  assert.ok(proofStart < productStart, 'Expected failure handling before the product screenshot');
  assert.match(
    heimdallCaseStudy,
    /href="https:\/\/github\.com\/CodingPenguin-yoon\/heimdall_final\/blob\/main\/backend\/tests\/test_nginx_gateway\.py"/
  );
  assert.match(
    heimdallCaseStudy,
    /href="https:\/\/github\.com\/CodingPenguin-yoon\/heimdall_final\/blob\/main\/backend\/tests\/integration\/test_worker_runtime_smoke\.py"/
  );
  assert.match(
    heimdallCaseStudy,
    /href="https:\/\/github\.com\/CodingPenguin-yoon\/heimdall_final\/blob\/main\/project-docs\/product-scope\.md"/
  );
  assert.match(heimdallCaseStudy, /Heimdall이 운영하는 인프라에서 사용자의 Preview를 빌드·실행하는 SaaS/);
  assert.doesNotMatch(resume, /SaaS/);
});

test('the K-Le-PaaS case study separates team scope from personal contribution evidence', () => {
  const ownershipStart = klepaasCaseStudy.indexOf('id="ownership"');
  const evidenceStart = klepaasCaseStudy.indexOf('id="contribution-evidence"');
  const productStart = klepaasCaseStudy.indexOf('class="case-section case-product"');

  assert.notEqual(ownershipStart, -1, 'Expected an ownership section');
  assert.match(klepaasCaseStudy, /aria-label="Team scope"/);
  assert.match(klepaasCaseStudy, /aria-label="My contribution"/);
  assert.notEqual(evidenceStart, -1, 'Expected contribution evidence');
  assert.ok(ownershipStart < evidenceStart, 'Expected ownership before contribution evidence');
  assert.ok(evidenceStart < productStart, 'Expected contribution evidence before the product screenshot');
  assert.match(klepaasCaseStudy, /href="https:\/\/github\.com\/K-Le-PaaS\/backend-hybrid\/pull\/28"/);
  assert.match(klepaasCaseStudy, /href="https:\/\/github\.com\/K-Le-PaaS\/backend-hybrid\/pull\/42"/);
  assert.match(klepaasCaseStudy, /href="https:\/\/github\.com\/K-Le-PaaS\/backend-hybrid\/pull\/63"/);
});

test('case-study copy describes the work directly without defensive or internal language', () => {
  assert.doesNotMatch(heimdallCaseStudy, /코드로 확인할 수 있습니다|안전하다는 주장보다|외부 검증 전/);
  assert.match(heimdallCaseStudy, /실패해도 기존 Preview를 유지합니다/);

  assert.doesNotMatch(
    klepaasCaseStudy,
    /제가 맡은 기능은|Contribution scope|Contribution &amp; team scope|팀 시스템은|팀 전체 아키텍처에서/
  );
  assert.match(klepaasCaseStudy, /자연어 요청에서 운영 결과까지/);

  assert.doesNotMatch(gjallarCaseStudy, /after-state|evidence|reconciliation/);
  assert.match(gjallarCaseStudy, /Proxmox task와 실제 상태를 다시 확인합니다/);
});

test('every root-relative link in the generated site resolves to a built file', async () => {
  const hrefs = new Set(
    renderedPages.flatMap((html) =>
      [...html.matchAll(/href="([^"]+)"/g)]
        .map((match) => match[1])
        .filter((href) => href.startsWith('/') && !href.startsWith('//'))
    )
  );

  for (const href of hrefs) {
    const pathname = decodeURIComponent(href.split(/[?#]/, 1)[0]);
    const relativePath = pathname.replace(/^\//, '');
    const target = relativePath
      ? /\.[a-z0-9]+$/i.test(relativePath)
        ? new URL(`../dist/${relativePath}`, import.meta.url)
        : new URL(`../dist/${relativePath.replace(/\/$/, '')}/index.html`, import.meta.url)
      : new URL('../dist/index.html', import.meta.url);

    await assert.doesNotReject(access(target), `Expected ${href} to resolve to a generated file`);
  }
});
