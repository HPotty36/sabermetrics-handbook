# 세이버메트릭스 핸드북

입문자부터 깊게 아는 팬까지 읽을 수 있게 정리하는 한국어 세이버메트릭스 용어 사전이다.

- 모든 용어를 ‘쉽게 말하면’과 ‘깊게 보면’ 두 겹으로 쓴다. 읽는 순서는 바꿀 수 있다.
- 사다리로 기본 지표에서 심화 지표까지 한 칸씩 따라간다 (예: ERA → FIP → xFIP → SIERA).
- 숫자 읽는 법은 눈금 막대와 구간으로 보여 준다. 리그 평균은 2026 MLB 정규시즌 기준이다.
- 블라스트, 어택 앵글처럼 최근 Statcast에 생긴 지표까지 다룬다.

## 상태

프로토타입 단계다. `prototype/index.html`을 브라우저로 열면 바로 볼 수 있다.
용어 15개를 썼고, 12개를 준비 중이다.

## 구조

```
prototype/index.html      동작과 디자인의 기준이 되는 단일 HTML 프로토타입
data/terms.json           용어, 준비 중 용어, 사다리 데이터 (콘텐츠 원본)
docs/content-guide.md     용어 스키마와 작성 규칙
docs/verified-facts.md    원 자료와 대조해 확인한 수치와 정의
CLAUDE.md                 Claude Code용 프로젝트 안내
```

## 로드맵

1. 정적 사이트로 이전 (Astro, 용어별 페이지)
2. 설치형 웹앱 (PWA, 오프라인)
3. Android/iOS 앱 (Capacitor)

웹앱과 앱은 같은 사이트를 그대로 확장한다.

## 콘텐츠 원칙

- 설명 문장은 모두 직접 쓴다. 외부 글을 옮기거나 번역하지 않는다.
- 정의와 공식의 원 출처(FanGraphs Library, MLB.com Glossary, Baseball Savant 등)는 용어마다 링크한다.
- 실제 선수 기록은 예시로 쓰지 않는다.
