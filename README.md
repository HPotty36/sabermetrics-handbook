# 세이버메트릭스 핸드북

입문자부터 깊게 아는 팬까지 읽을 수 있게 정리하는 한국어 세이버메트릭스 용어 사전이다.

- 모든 용어를 ‘쉽게 말하면’과 ‘깊게 보면’ 두 겹으로 쓴다. 읽는 순서는 바꿀 수 있다.
- 사다리로 기본 지표에서 심화 지표까지 한 칸씩 따라간다 (예: ERA → FIP → xFIP → SIERA).
- 숫자 읽는 법은 눈금 막대와 구간으로 보여 준다. 리그 평균은 2026 MLB 정규시즌 기준이다.
- 블라스트, 어택 앵글처럼 최근 Statcast에 생긴 지표까지 다룬다.

## 상태

Astro 정적 사이트로 옮겼고, 설치형 웹앱(PWA)으로 오프라인에서도 열린다. 용어 27개를 썼다.

```sh
npm install
npm run dev      # 개발 서버 (http://localhost:4321)
npm run build    # 정적 빌드 → dist/. 콘텐츠 검사에 걸리면 실패한다
npm test         # 콘텐츠 검사와 검색·숫자 표기 단위 테스트 (빌드 없이)
npm run check    # 타입 검사
npm run cap:sync # 앱용 빌드(dist-app/)를 만들어 android/, ios/에 복사
npx cap open android   # Android Studio에서 열기 (Xcode는 npx cap open ios)
```

Node 22.22 이상이 필요하다.

## 구조

```
src/content/terms/<id>.json   용어 1개 = 파일 1개 (콘텐츠 원본)
src/content/stubs.json        준비 중 용어
src/content/ladders.json      사다리 (적힌 순서대로 화면에 나온다)
src/lib/schema.ts             콘텐츠 스키마 (zod)
src/lib/validate.ts           파일 사이의 참조와 눈금 범위 검사
src/pages/                    홈(/)과 용어 페이지(/terms/<id>/)
src/scripts/term-index.ts     검색·필터 (브라우저)
src/styles/global.css         스타일 (프로토타입에서 출발)
integrations/                 빌드 후 서비스 워커(dist/sw.js) 생성
public/                       manifest, 아이콘
capacitor.config.ts           앱 설정 (Capacitor)
android/, ios/                네이티브 앱 프로젝트
assets/                       앱 아이콘·스플래시 원본 (@capacitor/assets)
prototype/index.html          동작과 디자인의 기준이 되는 단일 HTML 프로토타입
docs/content-guide.md         용어 스키마와 작성 규칙
docs/verified-facts.md        원 자료와 대조해 확인한 수치와 정의
CLAUDE.md                     Claude Code용 프로젝트 안내
```

## 로드맵

1. ~~정적 사이트로 이전 (Astro, 용어별 페이지)~~ 끝
2. ~~설치형 웹앱 (PWA, 오프라인)~~ 끝
3. Android/iOS 앱 (Capacitor) — 프로젝트는 만들었고, 로컬 빌드와 기기 확인이 남았다

웹앱과 앱은 같은 사이트를 그대로 확장한다.

## 콘텐츠 원칙

- 설명 문장은 모두 직접 쓴다. 외부 글을 옮기거나 번역하지 않는다.
- 정의와 공식의 원 출처(FanGraphs Library, MLB.com Glossary, Baseball Savant 등)는 용어마다 링크한다.
- 실제 선수 기록은 예시로 쓰지 않는다.
