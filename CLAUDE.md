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
  - 글꼴은 npm의 Fontsource 패키지로 직접 내보낸다(`Base.astro`에서 불러옴). `astro.config.mjs`의 작은 Vite 플러그인이 woff를 빼고 woff2만 남긴다.
  - PWA: `public/manifest.webmanifest`, 아이콘(`public/favicon.svg`에서 만든 `public/icons/*.png`), 서비스 워커. 서비스 워커는 빌드가 끝나면 `integrations/service-worker.mjs`가 `dist/sw.js`로 만든다. 페이지·CSS·아이콘은 설치 때 미리 저장하고, 글꼴 조각은 쓰일 때 저장한다. 페이지는 네트워크 우선(3초 안에 안 오면 저장본), 없는 페이지는 오프라인에서 홈으로 대신한다.
- `prototype/index.html`: 동작과 디자인의 기준이다. 브라우저로 바로 열린다.
  - 아티팩트 환경 제약 때문에 해시 라우팅(`#fip`)과 인라인 데이터를 썼다. 안의 JSON은 옮기기 전(2026-10-15) 콘텐츠의 스냅숏이라 고치지 않는다.
- `docs/content-guide.md`: 용어 스키마와 작성 규칙이다. 용어를 쓰거나 고치기 전에 읽는다.
- `docs/verified-facts.md`: 2026-10-15에 원 자료와 대조해 확인한 수치, 정의, URL이다. 확인하지 못한 항목 목록도 있다.

## 다음 작업 (권장 순서)

1. ~~Astro 프로젝트로 옮긴다 (정적 빌드).~~ 끝났다.
   - 클라이언트 스크립트는 검색, 필터, 읽는 순서 전환에만 쓴다. 이 원칙은 계속 지킨다.
2. 프로토타입과 화면이 같은지 확인한다. 데스크톱은 사이드바, 모바일은 한 열이고 라이트·다크를 모두 본다.
   - 2026-10-15에 Chromium 스크린숏으로 자동 비교했다. 모든 페이지 × 1280px·400px × 라이트·다크에서 안티에일리어싱 오차(색값 ±1, 몇 픽셀)를 빼면 같았고, 400px에서 가로 스크롤도 없었다. 실제 기기(iOS Safari, Android Chrome)에서 눈으로 보는 확인이 남았다.
   - 그 뒤 레퍼런스를 참고해 용어 페이지를 일부 바꿨다(‘디자인 기준’ 참고). 이제 프로토타입은 토큰과 동작의 기준이고, 화면이 픽셀 단위로 같지는 않다.
   - 프로토타입과 다른 점:
     - 필터만 걸었는데 결과가 없으면 ‘고른 조건에 맞는 용어가 아직 없어요.’를 보인다. 프로토타입은 빈 따옴표(‘’)가 찍혔다.
     - 모바일 용어 페이지에서 검색을 시작하면 홈의 전체 용어로 페이지를 옮긴다(프로토타입은 같은 화면 안에서 전환). 한글은 글자 조합이 끝난 뒤에 옮긴다.
     - 본문이 살짝 올라오는 등장 애니메이션(0.28초)이 페이지를 옮길 때마다 나온다. 프로토타입은 처음 열 때만 나왔다.
   - 페이지가 나뉘었으므로 검색어와 필터는 sessionStorage에 둬서, 프로토타입처럼 옮겨 다니는 동안 유지한다.
3. ~~`stubs` 12개를 작성한다.~~ 2026-10-15에 작성했다. 남은 일이 있다.
   - 이날은 네트워크 정책 때문에 원 자료 페이지를 열 수 없었다. 수치는 `verified-facts.md`에 이미 확인된 값(타구 속도 88.8mph, 하드히트% 38.6%, 포심 94.8mph, K% 22.1%, FIP 상수, 배트 트래킹 정의)만 썼다. 정의와 설명 가운데 검색으로만 확인한 내용은 `verified-facts.md`의 ‘검색으로만 확인한 것’에 모아 뒀다.
   - 새 12개에는 `scale`(숫자 읽는 법)이 없다. 리그 타율·평균자책점, 경험칙 구간을 원문으로 확인하면 붙인다. 원문을 열 수 있는 환경에서 ‘검색으로만 확인한 것’과 ‘확인하지 못한 것’을 먼저 대조한다.
   - 스윙 타이밍의 판정 기준값은 기록이 엇갈린다(`verified-facts.md`). 확인 전에는 본문에 숫자를 쓰지 않는다.
4. ~~PWA를 붙인다. manifest, 서비스 워커, 오프라인 캐시가 필요하다.~~ 끝났다.
   - 2026-10-15에 Chromium으로 확인했다. 서버를 끈 상태에서 방문하지 않은 용어 페이지, 홈, 없는 주소(→ 홈), 글꼴, 검색이 모두 동작했다.
   - 남은 것: 실제 Android Chrome·iOS Safari에서 ‘홈 화면에 추가’와 오프라인을 눈으로 확인한다. 아이콘은 헤더의 공 마크를 옮긴 임시 디자인이다.
   - manifest와 아이콘 경로는 `/` 기준이다. `base`를 바꾸면 manifest도 함께 고친다.
5. ~~Capacitor로 Android/iOS를 감싼다.~~ 2026-10-15에 프로젝트를 만들었다. 빌드는 아직이다.
   - `android/`, `ios/`(Swift Package Manager)를 만들고, 아이콘과 스플래시는 `assets/`의 원본으로 `npx @capacitor/assets generate --android --ios`로 만들었다.
   - Capacitor식 라우팅(확장자 없는 주소 → 홈)을 흉내 낸 서버에서 앱용 빌드의 링크, 사다리 이동, 검색, 읽는 순서를 확인했다. 같은 서버에서 웹 빌드는 실패한다(앱용 빌드가 따로 있는 이유).
   - 이 컨테이너에는 Android SDK가 없고(dl.google.com 차단) Xcode도 없어 APK·IPA를 만들어 보지 못했다. 로컬에서 `npm run cap:sync` 뒤 `npx cap open android`(Android Studio) 또는 `npx cap open ios`(Xcode)로 빌드하고 실제 기기에서 확인한다.
   - `appId`(`com.sabermetricshandbook.app`)는 임시다. 스토어에 처음 올린 뒤에는 바꿀 수 없으니 출시 전에 정한다. 개인을 알아볼 수 있는 문구(GitHub 계정명 등)는 넣지 않는다.
   - 확인할 것: iOS 상태 표시줄 영역(헤더는 `env(safe-area-inset-top)`을 쓴다), Android 뒤로 가기 버튼, 다크 모드 스플래시에서 공 테두리가 잘 안 보이는 점.

스택은 Astro를 권장하지만 확정은 아니다. 바꾸려면 먼저 이유를 설명하고 확인받는다.

## 디자인 기준

프로토타입 CSS의 `:root` 토큰이 원본이다.

- 색: paper, surface, ink, muted, line, track 토큰과 포인트 색 seam(실밥 빨강)이다.
- 레벨 색: 입문은 초록, 중급은 황색, 심화는 남색이다. 라이트·다크 둘 다 정의돼 있다.
- 글꼴:
  - Big Shoulders Display: 약어와 숫자
  - IBM Plex Sans KR: 본문
  - IBM Plex Mono: 수식
- 이 주제만의 요소는 두 가지다. 헤더 아래 실밥 구분선, 숫자 눈금 막대의 홈플레이트 모양 평균 마커. 이런 장식을 더 늘리지 않는다.
- 모바일 400px 폭에서 가로 스크롤이 생기면 안 된다.

### 레퍼런스를 참고해 프로토타입에서 바꾼 것 (2026-10-15)

토큰, 글꼴, 위 두 요소는 그대로 두고 정보 구조와 위계만 바꿨다. 아래 사이트를 데스크톱(1280px)과 모바일(390px)에서 직접 열어 보고 정했다.

- 용어 페이지 맨 위 ‘사다리 · 투수 평가 2/4’ 상자. [GOV.UK 콘텐츠 페이지](https://www.gov.uk/apply-first-provisional-driving-licence)는 단계별 안내에 속한 페이지 맨 위에 ‘Part of’ 회색 상자와 링크를 둔다.
- 사다리는 본문 끝에 세로 번호 목록으로 둔다. 번호를 세로선으로 잇고 지금 용어는 채운 원으로 표시한다. [GOV.UK step by step](https://www.gov.uk/learn-to-drive-a-car)과 같은 방식이다. 앞뒤 칸이 이름과 함께 보이므로 따로 이전·다음 링크는 두지 않는다. 가로 칩은 모바일에서 줄이 꺾여 순서가 잘 안 보였다. 홈의 사다리 9개는 한눈에 훑는 용도라 가로 칩 그대로다.
- 한 줄 정의(`summary`)를 ‘정의’ 상자로 본문과 떼어 놓는다. [Investopedia 용어 페이지](https://www.investopedia.com/terms/p/price-earningsratio.asp)의 ‘Definition’ 상자, [FanGraphs Library](https://library.fangraphs.com/pitching/fip/)의 맨 위 요약 카드와 같은 역할이다.
- 눈금 막대 양 끝에 ‘나쁨 · 좋음’을 적는다(좋은 쪽이 빨강). [Baseball Savant 선수 페이지](https://baseballsavant.mlb.com/)의 퍼센타일 막대 머리글(POOR · AVERAGE · GREAT, 좋은 쪽 빨강)을 따랐다. 가운데 ‘평균’은 홈플레이트 마커가 맡는다. 범례는 숫자 → 의미를 위에서 아래로 읽는 목록이다.
- 섹션 제목은 16px 굵은 본문색. [MLB.com Glossary](https://www.mlb.com/glossary/statcast/barrel)와 FanGraphs Library처럼 정의 → 계산 → 해석 → 맥락 순서의 구획이 보이게 하려는 것이다.

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
