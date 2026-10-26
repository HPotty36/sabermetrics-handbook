# 세이버메트릭스 핸드북

세이버메트릭스 용어를 입문자부터 깊게 아는 팬까지 읽을 수 있게 정리하는 한국어 용어 사전이다.
claude.ai에서 만든 단일 HTML 프로토타입을 Astro 정적 사이트로 옮겼다.

## 제품 방향 (바꾸지 말 것)

- 하나의 코드베이스로 간다. 웹사이트 → 설치형 웹앱(PWA) → 스토어 앱(Capacitor로 감싸기) 순서다.
- 웹앱·앱 단계에서 새 기능을 따로 만들지 않는다. 같은 사이트를 그대로 확장한다.
- 독자는 두 부류다. 입문자도 이해할 수 있어야 하고, 이미 아는 사람도 새 용어를 배울 수 있어야 한다. 주 사용자는 후자에 가깝다.
- 모든 용어는 두 겹으로 쓴다. `easy`(쉽게 말하면)와 `deep`(깊게 보면)이다.
- 용어 페이지의 읽는 순서 전환(쉽게 먼저 / 깊게 먼저)은 유지한다. 선택은 브라우저에 저장한다.
- 사다리는 기본 → 심화로 한 칸씩 깊어지는 용어 순서다. 홈과 용어 페이지 양쪽에서 핵심 탐색 수단이다.
- 홈의 입구는 두 개다. ‘처음이라면’(입문 용어, OPS부터)과 ‘이미 안다면’(최근 Statcast 지표와 심화 용어)이다.

## 지금 있는 것

- Astro 7 정적 사이트다. Node 22.22 이상. `npm run dev`, `npm run build`(결과는 `dist/`), `npm test`, `npm run check`.
  - 앱(Capacitor 8): `npm run cap:sync`가 앱용 빌드(`dist-app/`)를 만들어 `android/`, `ios/`에 복사한다. 앱의 로컬 서버는 확장자 없는 주소를 모두 홈 `index.html`로 보내므로(Android `WebViewLocalServer`, iOS 라우터), 앱용 빌드(`astro build --mode app`)만 페이지 링크에 `index.html`까지 적는다(`src/lib/make-paths.ts`). 웹 빌드의 주소는 그대로다. 앱에서는 서비스 워커를 등록하지 않는다.
  - 라우트: `src/pages/index.astro`(홈 `/`), `src/pages/terms/[id].astro`(용어 `/terms/<id>/`).
  - 콘텐츠의 원본은 `src/content/`다.
    - `terms/<id>.json`: 용어 1개 = 파일 1개(27개). 파일 이름이 id다. 콘텐츠 컬렉션으로 읽는다.
    - `stubs.json`(준비 중, 지금은 0개), `ladders.json`(사다리 9개): 순서가 있는 목록이라 컬렉션이 아니라 `src/lib/handbook.ts`에서 읽는다. 사다리는 파일에 적힌 순서대로 화면에 나온다.
  - 스키마는 `src/lib/schema.ts`(zod), 파일 사이의 참조 검사는 `src/lib/validate.ts`다. 어긋나면 `astro build`가 실패한다. `npm test`는 빌드 없이 같은 검사를 돌린다.
  - 클라이언트 스크립트는 세 가지뿐이다. `src/scripts/term-index.ts`(검색·필터), 용어 페이지의 인라인 스크립트(읽는 순서), 서비스 워커 등록(빌드 결과에서만, `Base.astro`).
  - 스타일은 `src/styles/global.css`다. 프로토타입 CSS에서 출발했다.
  - 글꼴은 npm 패키지로 직접 내보낸다(`Base.astro`에서 불러옴). 본문은 `pretendard`(가변 글꼴 dynamic subset), 약어·수식은 Fontsource다. `astro.config.mjs`의 작은 Vite 플러그인이 Fontsource의 woff를 빼고 woff2만 남긴다.
  - PWA: `public/manifest.webmanifest`, 아이콘(`public/icons/*.png`), 서비스 워커. 서비스 워커는 빌드가 끝나면 `integrations/service-worker.mjs`가 `dist/sw.js`로 만든다. 페이지·CSS·아이콘은 설치 때 미리 저장하고, 글꼴 조각은 쓰일 때 저장한다. 페이지는 네트워크 우선(3초 안에 안 오면 저장본), 없는 페이지는 오프라인에서 홈으로 대신한다.
  - 배포: https://sabermetrics-handbook.pages.dev/ . Cloudflare Pages에 Git으로 연결했다(프로덕션 브랜치 `main`, 빌드 명령 `npm run build`, 출력 `dist`). `main`에 합치면 다시 배포되고, 다른 브랜치는 미리보기 배포가 된다.
    - 대시보드의 ‘새로운 것을 만들기’에서 GitHub를 바로 고르면 Workers가 만들어진다. Workers 주소에는 계정 서브도메인이 붙으므로 쓰지 않는다. 화면 아래 ‘레거시 Pages 워크플로’의 ‘Pages로 계속’으로 만든다.
    - 2026-10-26에 배포 주소를 확인했다. 파일 418개가 로컬 빌드와 같았다. Chromium에서 검색·필터·읽는 순서가 동작했고, 1280px·400px에서 가로 스크롤이 없었고, 설치 가능 판정에 오류가 없었다. 서버에 닿지 않게 한 뒤에도 방문하지 않은 용어 페이지, 홈, 없는 주소(→ 홈), 글꼴, 검색이 동작했다.
    - Pages 빌드 이미지의 기본 Node(22.16)는 `engines`보다 낮고 `engines`를 읽지 않으므로 `.node-version`으로 고정한다. Node를 올리면 둘 다 고친다.
    - `404.html`이 없으면 Pages는 없는 주소에 홈을 보낸다(SPA 방식). 오프라인 서비스 워커와 같은 동작이다.
    - 사이트 주소(`<프로젝트 이름>.pages.dev`)에도 앱 ID처럼 개인을 알아볼 수 있는 문구를 넣지 않는다.
- `prototype/index.html`: 동작과 디자인의 기준이다. 브라우저로 바로 열린다.
  - 아티팩트 환경 제약 때문에 해시 라우팅(`#fip`)과 인라인 데이터를 썼다. 안의 JSON은 옮기기 전(2026-10-15) 콘텐츠의 스냅숏이라 고치지 않는다.
- `docs/content-guide.md`: 용어 스키마와 작성 규칙이다. 용어를 쓰거나 고치기 전에 읽는다.
- `docs/verified-facts.md`: 2026-10-15에 원 자료와 대조해 확인한 수치, 정의, URL이다. 확인하지 못한 항목 목록도 있다.

## 다음 작업 (권장 순서)

1. ~~Astro 프로젝트로 옮긴다 (정적 빌드).~~ 끝났다.
   - 클라이언트 스크립트는 검색, 필터, 읽는 순서 전환에만 쓴다. 이 원칙은 계속 지킨다.
2. 프로토타입과 화면이 같은지 확인한다. 데스크톱은 사이드바, 모바일은 한 열이고 라이트·다크를 모두 본다.
   - 2026-10-15에 Chromium 스크린숏으로 자동 비교했다. 모든 페이지 × 1280px·400px × 라이트·다크에서 안티에일리어싱 오차(색값 ±1, 몇 픽셀)를 빼면 같았고, 400px에서 가로 스크롤도 없었다. 실제 기기(iOS Safari, Android Chrome)에서 눈으로 보는 확인이 남았다.
   - 그 뒤 레퍼런스를 참고해 화면을 다시 디자인했다(‘디자인 기준’ 참고). 이제 프로토타입은 토큰 이름과 동작의 기준이고, 화면은 같지 않다.
   - 프로토타입과 다른 점:
     - 필터만 걸었는데 결과가 없으면 ‘고른 조건에 맞는 용어가 아직 없어요.’를 보인다. 프로토타입은 빈 따옴표(‘’)가 찍혔다.
     - 모바일 용어 페이지에서 검색을 시작하면 홈의 전체 용어로 페이지를 옮긴다(프로토타입은 같은 화면 안에서 전환). 한글은 글자 조합이 끝난 뒤에 옮긴다.
     - 등장 애니메이션이 없다. 프로토타입은 처음 열 때 본문이 살짝 올라왔다(2026-10-26에 뺐다).
   - 페이지가 나뉘었으므로 검색어와 필터는 sessionStorage에 둬서, 프로토타입처럼 옮겨 다니는 동안 유지한다.
3. ~~`stubs` 12개를 작성한다.~~ 2026-10-15에 작성했고, 2026-10-23에 원문과 대조해 수치를 채웠다.
   - 리그 타율·평균자책점·수비율, 포심 회전수, 배트 스피드·빠른 스윙 비율, 스윙 타이밍 판정 기준값을 원문(Baseball-Reference, Baseball Savant)으로 확인해 본문에 넣었다(`verified-facts.md`).
   - ERA·FIP·xFIP의 `scale`은 FanGraphs ERA-·FIP-·xFIP- 경험칙(평균 = 100)을 2026 리그 평균자책점 4.17로 환산한 구간이다. FanGraphs의 ERA·FIP·xFIP 표는 예전 득점 환경 기준이라 2026 평균과 맞지 않아 그대로 쓰지 않았다. FIP의 예전 구간(3.0/3.5/4.0/4.5/5.0)은 출처가 없어 같은 방식으로 바꿨다.
   - SIERA와 K%에는 `scale`이 없다. 기준 시즌이 없는 오래된 표뿐이다. 다음 시즌으로 바꿀 때는 리그 평균과 환산 구간을 함께 고친다.
   - 남은 미확인 항목(리그 VAA 평균, FanGraphs 리그 xFIP·SIERA 등)은 `verified-facts.md`의 ‘확인하지 못한 것’에 있다. www.fangraphs.com은 봇 차단 때문에 이 작업 환경에서 열리지 않았다.
4. ~~PWA를 붙인다. manifest, 서비스 워커, 오프라인 캐시가 필요하다.~~ 끝났다.
   - 2026-10-15에 Chromium으로 확인했다. 서버를 끈 상태에서 방문하지 않은 용어 페이지, 홈, 없는 주소(→ 홈), 글꼴, 검색이 모두 동작했다.
   - 남은 것: 실제 Android Chrome·iOS Safari에서 배포 주소를 열어 ‘홈 화면에 추가’와 오프라인을 눈으로 확인한다.
   - manifest와 아이콘 경로는 `/` 기준이다. `base`를 바꾸면 manifest도 함께 고친다.
5. ~~Capacitor로 Android/iOS를 감싼다.~~ 2026-10-15에 프로젝트를 만들었다. 빌드는 아직이다.
   - `android/`, `ios/`(Swift Package Manager)를 만들었다. 아이콘과 스플래시는 `npm run icons`로 만든다(아래 ‘앱 아이콘’).
   - Capacitor식 라우팅(확장자 없는 주소 → 홈)을 흉내 낸 서버에서 앱용 빌드의 링크, 사다리 이동, 검색, 읽는 순서를 확인했다. 같은 서버에서 웹 빌드는 실패한다(앱용 빌드가 따로 있는 이유).
   - 이 컨테이너에는 Android SDK가 없고(dl.google.com 차단) Xcode도 없어 APK·IPA를 만들어 보지 못했다. 로컬에서 `npm run cap:sync` 뒤 `npx cap open android`(Android Studio) 또는 `npx cap open ios`(Xcode)로 빌드하고 실제 기기에서 확인한다.
   - `appId`(`com.sabermetricshandbook.app`)는 임시다. 스토어에 처음 올린 뒤에는 바꿀 수 없으니 출시 전에 정한다. 개인을 알아볼 수 있는 문구(GitHub 계정명 등)는 넣지 않는다.
   - 확인할 것: iOS 상태 표시줄 영역(헤더는 `env(safe-area-inset-top)`을 쓴다), Android 뒤로 가기 버튼.

스택은 Astro를 권장하지만 확정은 아니다. 바꾸려면 먼저 이유를 설명하고 확인받는다.

## 디자인 기준

`src/styles/global.css`의 `:root` 토큰이 원본이다. 토큰 이름과 역할은 프로토타입에서 왔고, 값은 2026-10-26에 다시 정했다(아래 ‘다시 디자인’).

- 색:
  - paper(바탕, 라이트 #FFFFFF·다크 #0B0B0D), surface(회색 칸), ink, muted, line(가는 선), track(눈금 막대) 토큰과 포인트 색 seam(실밥 빨강 #C42638, 다크 #FF5D6D)이다.
  - 빨강은 포인트에만 쓴다. 실밥 구분선, 평균 숫자, 주 버튼, 지금 위치, 마우스를 올린 링크가 여기에 든다.
- 레벨 색: 입문은 초록, 중급은 황색, 심화는 남색이다. 라이트·다크 둘 다 정의돼 있다. 글자 앞의 작은 점으로 표시한다.
- 글꼴:
  - Big Shoulders Display: 약어와 숫자(전광판 느낌). 한글이 없어서 한글 칩은 본문 글꼴 굵은 글자로 맞춘다(`hasHangul`, `.is-ko`).
  - Pretendard(가변, dynamic subset): 본문과 UI. 2026-10-26에 IBM Plex Sans KR에서 바꿨다.
  - IBM Plex Mono: 수식, 단축키, 연도 같은 작은 숫자.
- 이 주제만의 요소는 두 가지다. 헤더 아래 실밥 구분선, 숫자 눈금 막대의 홈플레이트 모양 평균 마커. 이런 장식을 더 늘리지 않는다.
  - 앱 아이콘(헤더 마크 겸용)은 장식이 아니라 로고라 따로 센다. 아래 ‘앱 아이콘’ 참고.
- 모바일 400px 폭에서 가로 스크롤이 생기면 안 된다.

### 다시 디자인 (2026-10-26)

사용자 요청: ‘깔끔하면서 포인트가 있게, 분야가 달라도 실제 레퍼런스를 참고해서’. 아래 사이트를 1280px·390px에서 직접 열어 보고 정했다. 그 전에 같은 날 했던 ‘참고서처럼 밋밋하게’ 정리는 너무 심심하다는 피드백을 받아 이것으로 바꿨다.

- [Vercel Geist](https://vercel.com/geist/introduction):
  - 데스크톱 사이드바는 레벨별 묶음 제목 아래 글자 목록이다. 필터는 두지 않고, 지금 페이지는 회색 바탕이다.
  - 검색창은 회색 칸에 ‘/’ 단축키 표시를 둔다.
  - 큰 제목과 한 줄 설명을 쓴다.
  - 가는 선으로 나눈 타일 격자(홈 ‘전체 용어’, 용어 페이지 ‘같이 보기’)를 쓴다. 기록지 칸처럼 보이게 약어를 크게 쓰고, 리그 평균이 있으면 오른쪽 위에 숫자로 둔다.
- [Linear 변경 기록](https://linear.app/changelog): 용어 페이지 단락은 넓은 화면에서 제목을 왼쪽 열(136px), 내용을 오른쪽 열에 둔다.
- [토스피드](https://toss.im/tossfeed): 한글 제목은 굵게, 자간을 좁게(-0.02~-0.035em) 쓴다. 한 줄 정의는 20px 500이다.
- Apple 스포츠 앱(App Store 스크린숏): 리그 평균이 있는 용어는 표제어 오른쪽에 숫자 하나를 크게(64px, 빨강) 둔다. 모바일에서는 회색 칸 한 줄이다.
- 두 입구는 테두리만 있는 카드(14px 모서리, 그림자 없음)다. 주 버튼(‘OPS부터 읽기’)만 빨강으로 채운다.
- 홈 사다리는 지하철 노선도처럼 역(점 + 약어)을 선으로 잇는다. 점 색이 레벨이다.
- 필터와 읽는 순서는 segmented control이다. 회색 홈 안에서 고른 칸만 흰 바탕으로 올라온다.
- 흔한 오해는 ‘오해 / 실제’ 두 줄짜리 표다.
- 그대로 둔 것(2026-10-15에 정한 것): 실밥 구분선, 홈플레이트 마커와 눈금 막대, 막대 양 끝의 ‘나쁨 · 좋음’([Baseball Savant](https://baseballsavant.mlb.com/) 퍼센타일 막대), 맨 위 사다리 위치([GOV.UK ‘Part of’](https://www.gov.uk/apply-first-provisional-driving-licence)), 본문 끝 세로 번호 사다리([GOV.UK step by step](https://www.gov.uk/learn-to-drive-a-car), 앞뒤 칸이 보이므로 이전·다음 링크는 없다), 읽는 순서 전환, 두 입구.
- 문구 규칙(홍보 문구, 사이트 자신을 가리키는 말, ‘~하는 이유다’ 맺음을 쓰지 않는다)은 `docs/content-guide.md`의 ‘쓰는 법’에 있다.
- 쓰지 않는 것: 그림자로 띄운 카드(segmented control의 고른 칸만 예외), 그라데이션 배경, 제목 앞 장식 기호, 등장 애니메이션(색 전환 0.15초만), 이모지, 윗글 + 큰 문구 + 부제로 된 홍보용 첫 화면.

### 앱 아이콘 (2026-10-26)

- 위에서 내려다본 홈플레이트와 양쪽 타석을 seam 빨강 바탕에 흰 선으로 그렸다. 홈플레이트는 실제 비율(폭 17, 옆변 8.5)이다.
- 참고한 앱 아이콘(App Store): The Athletic, Dictionary.com, 위키백과, ESPN, FotMob, Merriam-Webster. 모두 단색 바탕에 생각 하나만 그리고 그라데이션·광택이 없다. 예전 아이콘(공 테두리와 실밥)은 흔한 공 그림이라 작게 보면 무엇인지 구분이 안 됐다.
- 원본: `assets/icon.svg`(꽉 찬 사각형), `public/favicon.svg`(둥근 모서리, 탭 아이콘과 헤더 마크도 이 파일). PNG는 `npm run icons`가 만든다(`scripts/make-icons.mjs` → `@capacitor/assets`). 원(마스크)에 들어가는 아이콘은 안전 영역에 맞춰 줄인다(PWA maskable 0.8, Android 적응형 0.68). 스플래시 바탕은 paper 색이다.

보고도 넣지 않은 것 (넣으려면 먼저 확인받는다)

- 테마 선택(라이트·다크·자동): [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Cache), [Wikipedia](https://en.wikipedia.org/wiki/On-base_plus_slugging)에 있다. CSS는 `data-theme`을 이미 지원하지만 클라이언트 스크립트가 하나 늘어난다.
- 마지막 확인 날짜: MDN(‘last modified’), Investopedia(‘Updated’, ‘Fact checked’)가 신뢰 표시로 쓴다. 용어마다 날짜 필드가 필요하다.
- 본문 17px: [토스피드](https://toss.im/tossfeed/article/beginning-of-tps)는 본문 17px·행간 1.6·폭 700px, MLB 용어집은 16px·1.5다. 지금(16px·1.7)도 범위 안이라 두었다.

## 지켜야 할 것

- 설명 문장은 직접 쓴다. FanGraphs, MLB 용어집 등 외부 문장을 번역하거나 옮기지 않는다.
- 정의와 공식은 쓰되, 원 출처를 `sources`에 링크한다.
- 실제 선수 기록을 예시로 쓰지 않는다 (데이터 라이선스). 예시가 필요하면 가상 수치를 쓴다.
- 확인하지 않은 수치는 쓰지 않는다. 리그 평균에는 기준 시즌을 적는다. 현재 기준은 2026 MLB 정규시즌이다.
- 문체: 본문은 한다체, UI 문구는 해요체다.
