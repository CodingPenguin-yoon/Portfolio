# Website workspace

이 저장소는 홈페이지와 포트폴리오를 각각 독립된 폴더로 관리합니다.

- `homepage/`: AstroWind 기반 홈페이지
- `portfolio/`: 정적 HTML 포트폴리오와 PDF/PPTX 자료

## 홈페이지 실행

```bash
cd homepage
npm install
npm run dev
```

프로덕션 빌드는 `homepage` 폴더에서 `npm run build`로 실행합니다. GitHub와 연결된 배포 서비스를 사용한다면 프로젝트의 Root Directory도 `homepage`로 설정해야 합니다.

포트폴리오는 `portfolio/index.html`을 브라우저에서 열어 확인할 수 있습니다.
