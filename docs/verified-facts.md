# 확인한 사실 (2026-10-15, 2026-10-23·2026-10-28 보강)

원 자료를 직접 열어 대조한 값이다. 새로 확인한 값은 날짜와 출처를 붙여 여기에 추가한다.

## 리그 평균 (MLB 정규시즌)

| 지표 | 2026 | 2025 | 출처 |
|---|---|---|---|
| wOBA | .316 | .313 | FanGraphs Guts. Savant 리그 페이지도 .316 (2026-10-23 확인, 예전 기록의 .317은 잘못) |
| 출루율 | .318 | .315 | FanGraphs |
| BABIP | .290 | .291 | FanGraphs |
| FIP 상수 | 3.100 | 3.135 | FanGraphs Guts |
| K% | 22.1% | 22.2% | FanGraphs |
| BB% | 8.9% | 8.4% | FanGraphs |
| 배럴 (타구 대비) | 7.7% | 8.6% | Baseball Savant (FanGraphs도 같음) |
| 하드히트% | 38.6% | 40.9% | Baseball Savant |
| 평균 타구 속도 | 88.8mph | 89.4mph | Baseball Savant |
| 포심 평균 구속 | 94.8mph (역대 최고) | 94.5mph | Baseball Savant Statcast Search(포심, 정규시즌, 리그 단위)와 AP 보도가 같다. FanGraphs 기준은 94.6 / 94.3 |
| 포심 평균 회전수 | 2,314rpm | 2,323rpm | Baseball Savant Statcast Search(위와 같은 조건). AP 보도는 2025년을 2,322rpm으로 적었다 |
| 타율 | .244 | .245 | Baseball-Reference 리그 평균 행. Savant 리그 페이지도 같다 |
| 평균자책점 | 4.17 | 4.15 | Baseball-Reference 리그 평균 행 (같은 행의 FIP는 4.18 / 4.16) |
| 수비율 | .985 | .986 | Baseball-Reference 리그 평균 행 |
| 평균 배트 스피드 | 72.1mph | 71.8mph | Baseball Savant 배트 트래킹 리그 행, 경쟁 스윙 기준 (전체 스윙 기준은 2026년 70.3mph) |
| 빠른 스윙 비율 (75mph 이상) | 26.6% | 24.6% | Baseball Savant 배트 트래킹 리그 행, 경쟁 스윙 기준 |
| CSW% (C+SwStr%) | 27.0% | 27.2% | FanGraphs |

- FanGraphs Guts: https://www.fangraphs.com/guts.aspx?type=cn
- Baseball Savant 리그: https://baseballsavant.mlb.com/league?season=2026
- Baseball Savant 포심 리그 평균: https://baseballsavant.mlb.com/statcast_search?hfPT=FF%7C&hfGT=R%7C&hfSea=2026%7C&player_type=pitcher&group_by=league&chk_stats_velocity=on&chk_stats_spin_rate=on
- Baseball Savant 배트 트래킹 리그: https://baseballsavant.mlb.com/leaderboard/bat-tracking?minSwings=q&seasonStart=2026&seasonEnd=2026&type=league&gameType=Regular
- Baseball-Reference: https://www.baseball-reference.com/leagues/majors/2026-standard-batting.shtml (pitching, fielding도 같은 형식). 2025는 연도만 바꾼다.
- 2026년은 2025년보다 장타 지표가 뚜렷하게 낮고 볼넷은 늘었다. 원인은 확인하지 않았다.

## 정의

- **블라스트**: 스퀘어드업 비율(%) + 배트 스피드(mph) ≥ 164. 별도의 75mph 하한은 없다. 2024년 기준 경쟁 스윙의 10%, 타구의 27%. https://www.mlb.com/glossary/statcast/bat-tracking-blasts
- **빠른 스윙**: 75mph 이상. https://www.mlb.com/glossary/statcast/fast-swing-rate
- **스퀘어드업**: 실제 타구 속도 ≥ 배트 스피드와 투구 속도로 낼 수 있는 최대치의 80%. https://www.mlb.com/glossary/statcast/squared-up
- **배트 스피드**: 배트 끝에서 6인치 안쪽 지점의 속도. 선수 평균은 경쟁 스윙(가장 빠른 90% + 60mph 이상이면서 타구 90mph 이상인 스윙)으로 계산. MLB 용어집 페이지는 없고 Savant 리더보드 설명이 원본. https://baseballsavant.mlb.com/leaderboard/bat-tracking
- **배트 트래킹 공개**: 2024년 5월 13일. 데이터는 2023 올스타 휴식기 이후부터.
- **2025년 5월 스윙 지표**: https://baseballsavant.mlb.com/changelog/2025-05-20-swing-path-attack-angle
  - 스윙 패스 틸트: 접촉 직전 40ms 배트 궤적의 기울기, 평균 약 32°
  - 어택 앵글: 접촉 순간 스위트 스팟의 수직 각도, 평균 약 10°
  - 이상적 어택 앵글 비율: 5~20° 스윙 비율, 약 50%
  - 어택 디렉션: 좌우 방향, 평균 약 2° 당겨치는 쪽
- **2025년 3월**: 인터셉트(접촉) 지점, 타격 자세 데이터.
- **2026년 6월 스윙 타이밍** (2026-10-23 다시 확인): 변경 기록 날짜는 2026년 6월 9일. https://baseballsavant.mlb.com/changelog/2026-06-09-swing-timing-miss-distance
  - 분류: 위아래 Over / Lined Up / Under, 좌우 Tied Up / Centered / Flail, 시간 Early / On Time / Late
  - 판정 기준값은 변경 기록에는 없고 리더보드에 있다: 배럴이 공과 위아래 ±2인치 안이면 Lined Up, 좌우 ±4인치 안이면 Centered, 완벽한 타이밍에서 ±7ms 안이면 On Time. https://baseballsavant.mlb.com/leaderboard/bat-tracking/swing-timing-miss-distance
  - Perfect Contact%: 전체 스윙 중 공을 맞혔고 세 가지가 모두 좋은 스윙의 비율. Flawed Swing%: 전체 스윙 중 헛스윙이면서 세 가지 중 하나도 좋지 않은 스윙의 비율.
  - Miss Distance: 가장 가까워진 순간 배트의 배럴 쪽 절반과 공 사이 거리(인치). 헛스윙만, 번트 제외.
- **Stuff+**: Eno Sarris·Max Bay가 만들고 Sarris·Owen McGrattan이 관리. 입력값은 릴리스 포인트, 구속, 수직·수평 무브먼트, 회전수, 주 패스트볼과의 구속·무브먼트 차이, 회전축 차이. 로케이션 제외. 구종 단위 10점 = 1 표준편차. Pitching+는 별도 모델. 2026년에도 공개 중. 입문서에 익스텐션·팔 각도는 입력값으로 적혀 있지 않다(2026-10-23). Stuff+는 시즌 첫 80구 무렵부터, Location+는 400구쯤부터 안정된다고 적었다. https://library.fangraphs.com/pitching/stuff-location-and-pitching-primer/
- **CSW%**: (루킹 스트라이크 + 헛스윙) ÷ 전체 투구, 파울팁 포함. Pitcher List의 Nick Pollack이 2018년에 만들고 Alex Fast가 2019년 4월 소개 글을 씀. https://pitcherlist.com/csw-rate-an-intro-to-an-important-new-metric
- **IVB**: 중력을 뺀 회전에 의한 수직 움직임. 포심 평균 약 +16인치 (2024). https://www.mlb.com/glossary/statcast/induced-vertical-break
- **VAA**: 포심 평균 약 −4.8~−5.0° (2021~2024년 글 기준). −4° 이상 평평, −5.5° 이하 가파름. https://blogs.fangraphs.com/a-visualized-primer-on-vertical-approach-angle-vaa/
- **xwOBA**: 타구 속도 + 발사각. 2019년부터 일부 타구에 스프린트 스피드 반영. 볼넷·삼진·사구는 실제 값. https://www.mlb.com/glossary/statcast/expected-woba
- **배럴**: 98mph 이상, 98mph에서 26~30°, 116mph에서 8~50°. 비슷한 타구 타율 .500·장타율 1.500 이상. 2016년 도입. https://www.mlb.com/glossary/statcast/barrel
- **OAA**: 외야는 포구 확률 기반, 내야는 2020년 추가. https://www.mlb.com/glossary/statcast/outs-above-average

## FanGraphs Library (열리는 것 확인)

- https://library.fangraphs.com/offense/woba/
- https://library.fangraphs.com/offense/wrc/
- https://library.fangraphs.com/pitching/fip/
- https://library.fangraphs.com/pitching/babip/
- https://library.fangraphs.com/misc/war/
- https://library.fangraphs.com/offense/ops/
- 2026-10-23 추가: https://library.fangraphs.com/pitching/era/ , https://library.fangraphs.com/pitching/xfip/ , https://library.fangraphs.com/pitching/siera/ , https://library.fangraphs.com/pitching/era-fip-xfip/ , https://library.fangraphs.com/offense/rate-stats/ , https://library.fangraphs.com/pitching/rate-stats/ , https://library.fangraphs.com/stats-to-avoid-batting-average/

## 2026-10-23 원문 대조

2026-10-15에 검색으로만 확인했던 내용을 원문 페이지를 열어 대조했다. 아래와 다른 내용은 용어 본문에서 고쳤다.

### 정의와 설명 (원문과 맞음)

- **타율**: 안타 ÷ 타수. 타수에서 타격방해도 뺀다. FanGraphs ‘Stats to Avoid’는 볼넷을 빼고 모든 안타를 같게 친다는 점을 비판한다. https://www.mlb.com/glossary/standard-stats/batting-average , https://library.fangraphs.com/stats-to-avoid-batting-average/
- **ERA**: 9 × 자책점 ÷ 이닝. 자책 여부는 실책이나 포일 없이도 났을 점수인지에 대한 기록원의 판단이다. 주자를 남기고 내려간 투수는 그 주자의 자책점을 떠안는다. https://www.mlb.com/glossary/standard-stats/earned-run-average , https://www.mlb.com/glossary/standard-stats/earned-run
- **K%**: 투수는 삼진 ÷ 상대 타자 수, 타자는 삼진 ÷ 타석. K/9는 상대 타자 수를 보지 않는다. 타자 K%는 60타석 안팎이면 의미가 생긴다(BB%는 120타석). https://library.fangraphs.com/offense/rate-stats/ , https://library.fangraphs.com/pitching/rate-stats/
- **수비율**: (자살 + 보살) ÷ (자살 + 보살 + 실책). 실책은 ‘평균적인 수비수라면 처리했어야 할 플레이’라는 기록원의 판단(본문 표현을 ‘평범한’에서 고쳤다). https://www.mlb.com/glossary/standard-stats/fielding-percentage
- **xFIP**: 피홈런 대신 뜬공 × 리그 평균 HR/FB. FIP와 같은 상수. 구장·리그를 보정한 xFIP-가 있다. 투수가 HR/FB를 거의 통제하지 못한다는 가정. https://library.fangraphs.com/pitching/xfip/
- **SIERA**: FanGraphs 수정판은 타석당 삼진·볼넷과 (땅볼 − 뜬공)에 제곱항·곱셈항을 쓴다. MLB 용어집의 처음 식은 내야 뜬공도 뺀다(본문에 보탰다). 삼진이 많은 투수는 BABIP와 HR/FB가 낮다. Baseball Prospectus에서 처음 나왔고 FanGraphs가 고쳤다. 지난 결과로 추정하는 지표이며 구장 보정이 들어 있다. https://library.fangraphs.com/pitching/siera/ , https://blogs.fangraphs.com/new-siera-part-two-of-five-unlocking-underrated-pitching-skills/
- **타구 속도·하드히트%**: 모든 인플레이 타구(아웃·안타·실책)에서 잰다. 하드히트는 95mph 이상, 이 속도부터 타구 속도가 ‘의미를 갖기’ 때문이라고 적었다. https://www.mlb.com/glossary/statcast/exit-velocity , https://www.mlb.com/glossary/statcast/hard-hit-rate
- **구속**: 손을 떠날 때의 최고 속도. PITCHf/x는 홈에서 50피트 지점에서 쟀다. 체감 구속은 익스텐션을 반영한다. https://www.mlb.com/glossary/statcast/velocity
- **회전수·액티브 스핀**: 손을 떠날 때의 rpm. 액티브 스핀의 직접 측정은 2020시즌부터이고, 움직임에서 역산하던 예전 방식도 따로 공개된다(본문을 ‘지금은’에서 ‘2020시즌부터’로 고쳤다). https://www.mlb.com/glossary/statcast/active-spin , https://baseballsavant.mlb.com/leaderboard/active-spin

### FanGraphs Library 경험칙 표 (2026-10-23)

| 등급 | ERA | FIP¹ | xFIP² | SIERA | ERA-·FIP-·xFIP-³ | 타자 K% | 투수 K% |
|---|---|---|---|---|---|---|---|
| Excellent | 2.50 | 3.20 | 2.90 | 2.90 | 70 | 10.0% | 27.0% |
| Great | 3.00 | 3.50 | 3.20 | 3.25 | 80 | 12.5% | 24.0% |
| Above Average | 3.40 | 3.80 | 3.50 | 3.75 | 90 | 16.0% | 22.0% |
| Average | 3.75 | 4.20 | 3.80 | 3.90 | 100 | 20.0% | 20.0% |
| Below Average | 4.00 | 4.40 | 4.10 | 4.20 | 110 | 22.0% | 17.0% |
| Poor | 4.30 | 4.70 | 4.40 | 4.50 | 115 | 25.0% | 15.0% |
| Awful | 4.60 | 5.00 | 4.70 | 5.00 | 125 | 27.5% | 13.0% |

1. ‘2016년 득점 환경 기준’이라고 적혀 있다. 2. 표 머리글이 ‘FIP’로 적혀 있다. 3. 선발 투수 기준, 불펜은 대체로 더 낮다.
나머지 표는 기준 시즌이 없고 2010~2016년 무렵에 만들어졌다. ERA·FIP·xFIP 표의 ‘Average’(3.75~4.20)와 K% 표의 20%는 2026 실제 평균(ERA 4.17, K% 22.1%)과 맞지 않는다.

**ERA·FIP·xFIP의 `scale`**: 시즌에 따라 움직이지 않는 ERA-·FIP-·xFIP- 표(평균 = 100)를 2026 리그 평균자책점 4.17에 곱해 환산했다(계산값, 구장 보정 없음). 70 → 2.92, 80 → 3.34, 90 → 3.75, 110 → 4.59, 125 → 5.21. FIP 평균은 정의상 리그 ERA와 같으므로 같은 구간을 쓴다(FanGraphs FIP 페이지). SIERA와 K%는 기준 시즌이 없는 표뿐이라 `scale`을 붙이지 않았다.

### 확인 결과 ‘없음’으로 정리한 것

- FanGraphs ‘Pitch Brains’: FanGraphs 블로그·라이브러리·RotoGraphs에서 찾을 수 없다.
- Pitcher List의 공식 리그 평균 CSW%: 2026년 글과 용어집, 리더보드 어디에도 리그 전체 값이 없다. 위 27.0%는 FanGraphs C+SwStr%로 둔다.
- Stuff+ 버전 변경 내용: FanGraphs는 2026-02-03 채팅에서 Eno Sarris가 Stuff+를 갱신했다고만 알렸다. 무엇이 바뀌었는지 설명한 글은 없다.

## 2026-10-28 새 용어 35개

출루율, 장타율, ISO, BB%, K-BB%, ERA+, WHIP, 발사각, 스위트 스팟%, 체이스%, 헛스윙%, 스프린트 스피드, 송구 속도, 팝 타임, xBA, xERA, 스윙 길이, 스퀘어드업%, 어택 디렉션, 스윙 틸트, 익스텐션, 팔 각도, 액티브 스핀, FRV, 블로킹, 프레이밍, 주루 득점 가치, RE24, WPA, LI, BsR, DRS, Location+, Pitching+, ABS 챌린지를 쓰면서 원문을 열어 확인했다. 원문에 접근하지 못해 뺀 후보는 없다. www.fangraphs.com 본 사이트는 여전히 막혀 있어서(403) FanGraphs 지표는 FanGraphs Library의 정의만 쓰고, 평균이 정의로 정해진 것(0, 100, 1.0)만 수치 기준에 넣었다.

### 리그 평균 (MLB 정규시즌)

| 지표 | 2026 | 2025 | 출처 |
|---|---|---|---|
| 장타율 | .400 | .404 | Baseball-Reference 리그 평균 행. Savant 리그 페이지도 같다 |
| ISO | .156 | .159 | 장타율 − 타율로 계산 (위 두 행) |
| K-BB% | 13.3% | 13.8% | Baseball-Reference 리그 평균 행으로 계산: (삼진 − 볼넷) ÷ 타석. 2026은 (1357 − 545) ÷ 6128, 2025는 (1355 − 513) ÷ 6098 |
| WHIP | 1.30 (1.304) | 1.29 (1.289) | Baseball-Reference 투구 리그 평균 행 |
| 평균 발사각 | 13.9° | 13.5° | Baseball Savant 리그 페이지 MLB 행 |
| 스위트 스팟% (발사각 8~32°) | 33.7% | 34.1% | Baseball Savant 리그 페이지 MLB 행 (기대 기록 리더보드의 MLB 행은 2026년 33.6%) |
| xBA | .243 | .243 | Baseball Savant 리그 페이지 MLB 행 |
| 체이스% | 30.5% | 28.2% | Baseball Savant 리그 페이지 MLB 행. 같은 행의 존 안 투구 비율은 47.5% / 50.6% |
| 헛스윙% (스윙 대비) | 25.1% | 25.3% | Baseball Savant 리그 페이지 MLB 행 |
| 스윙 길이 | 7.32ft | 7.31ft | Baseball Savant 배트 트래킹 리그 행(경쟁 스윙) |
| 스퀘어드업% | 스윙 대비 24.7%, 접촉 대비 32.3% | 25.5%, 33.4% | 같은 리그 행 |
| 어택 디렉션 | 2.1° 당겨 치는 쪽 | 1.8° | Baseball Savant 스윙 궤적 리그 행 (`attack_direction_pullopp` −2.13 / −1.76, 음수가 당겨 치는 쪽) |
| 스윙 틸트 | 32.3° | 32.2° | 같은 리그 행 |
| 포심 익스텐션 | 6.5ft | 6.5ft | Baseball Savant Statcast Search(포심, 정규시즌, 리그 단위). 전체 구종은 2026년 6.4ft |
| 팔 각도 | 우투 37.1°, 좌투 38.0° | | Baseball Savant 팔 각도 리더보드의 2026 리그 행 |
| 팝 타임 (2루 도루 시도) | 1.94초 | | Baseball Savant 팝 타임 리더보드(2루 시도 5회 이상 포수 94명, 송구 2,500개)의 평균. 리더보드 설명문은 ‘MLB 평균 2.0초’라고 적었다 |
| 스프린트 스피드 | 27ft/s | | Savant 리더보드 설명문 ‘경쟁 주루의 MLB 평균 27ft/s’. 2026 리더보드(10회 이상, 567명)의 선수 평균은 27.4ft/s |
| 섀도 존 루킹 스트라이크 비율 | 46.5% | | Baseball Savant 포수 프레이밍 리더보드 리그 행 |
| ABS 챌린지 성공률 | 53.9% (10,557번 중 5,686번) | | Baseball Savant ABS 대시보드(정규시즌). 타자 48.9%(4,765번), 포수 58.6%(5,613번), 투수 39.7%(179번) |

- Savant 리그: https://baseballsavant.mlb.com/league?season=2026 (2025는 연도만 바꾼다). MLB 행의 타석 183,849은 Baseball-Reference 팀 평균(6,128) × 30과 맞아 정규시즌만이다.
- 배트 트래킹 리그 행: 위 ‘리그 평균’ 표의 배트 트래킹 주소. 스윙 궤적: https://baseballsavant.mlb.com/leaderboard/bat-tracking/swing-path-attack-angle?gameType=Regular&minSwings=q&seasonStart=2026&seasonEnd=2026&type=league
- 익스텐션: https://baseballsavant.mlb.com/statcast_search?hfPT=FF%7C&hfGT=R%7C&hfSea=2026%7C&player_type=pitcher&group_by=league&chk_stats_velocity=on&chk_stats_release_extension=on
- 팔 각도: https://baseballsavant.mlb.com/leaderboard/pitcher-arm-angles?season=2026
- 팝 타임: https://baseballsavant.mlb.com/leaderboard/poptime?year=2026
- 스프린트 스피드: https://baseballsavant.mlb.com/leaderboard/sprint_speed?year=2026
- 프레이밍: https://baseballsavant.mlb.com/catcher_framing?year=2026
- ABS: https://baseballsavant.mlb.com/abs?year=2026&gameType=regular&level=mlb (주소에 `gameType=regular`가 없으면 포스트시즌이 나온다)

### 수치 기준(`scale`)의 구간

FanGraphs 경험칙 표의 평균이 2026 실제 평균과 맞는 것은 표를 그대로 썼고, 맞지 않거나 표가 없는 것은 2026 Baseball Savant 리더보드의 선수 분포(하위 10%, 가운데, 상위 10%, 계산값)로 구간을 정했다.

- 그대로 쓴 표 (FanGraphs Library):
  - 출루율: .390 / .370 / .340 / 평균 .320 / .310 / .300 / .290. 2026 실제 평균은 .318.
  - WHIP: 1.00 / 1.10 / 1.20 / 평균 1.30 / 1.40 / 1.50 / 1.60. 2026 실제 평균도 1.30.
  - WPA(주전 선수 기준): +6.0 / +3.0 / +2.0 / +1.0 / 0.0 / −1.0 / −3.0. 리그 평균은 정의상 0.
  - DRS: 골드글러브급 +15 / +10 / … / −10 / −15. 가운데 세 칸의 숫자는 페이지에서 읽히지 않아 쓰지 않았다.
  - ERA+: ERA- 표(70 / 80 / 90 / 100 / 110 / 115 / 125, 선발 기준)를 ERA+ = 10000 ÷ ERA-로 바꿨다. 143 / 125 / 111 / 100 / 91 / 80.
- 표를 쓰지 않은 것: ISO(표 평균 .140, 실제 .156), BB%(표 평균 8.0%, 실제 8.9%), O-Swing%(표 평균 30%는 BIS 존 기준이라 Savant 체이스%와 존이 다르다).
- 2026 선수 분포 (Baseball Savant, 계산값):

| 지표 | 대상 | 하위 10% | 가운데 | 상위 10% |
|---|---|---|---|---|
| 장타율 | 규정 타석 타자 135명 | .359 | .427 | .500 |
| ISO | 같음 | .114 | .168 | .238 |
| BB% | 같음 | 5.7% | 9.2% | 13.2% |
| xBA | 같음 | .224 | .255 | .283 |
| 스위트 스팟% | 같음 | 30.4% | 34.3% | 38.7% |
| 체이스% | 같음 | 22.1% | 30.3% | 38.0% |
| 헛스윙% | 같음 | 15.3% | 23.9% | 32.4% |
| K-BB% | 규정 이닝 투수 46명 | 9.3% | 16.8% | 23.4% |
| 스프린트 스피드 | 경쟁 주루 10회 이상 567명 | 25.5 | 27.5 | 29.0 (ft/s) |
| 팝 타임 | 2루 시도 5회 이상 포수 94명 | 1.88 | 1.95 | 2.00 (초, 짧을수록 좋음) |
| 스윙 길이 | 배트 트래킹 규정 타자 209명 | 6.8 | 7.35 | 7.8 (ft) |
| 스퀘어드업% (스윙 대비) | 같음 | 20.0% | 25.0% | 31.7% |
| 포심 익스텐션 | 포심 300구 이상 투수 270명 | 6.0 | 6.5 | 6.9 (ft) |
| 팔 각도 | 팔 각도 리더보드 투수 276명 | 23.4° | 39.1° | 51.5° |
| 액티브 스핀 (구종별 가운데) | 액티브 스핀 리더보드(50구 이상) | 포심 90.5%, 싱커 87.2%, 체인지업 90.0%, 스플리터 85.6%, 커브 73.3%, 스위퍼 50.5%, 커터 47.0%, 슬라이더 31.7% | | |

- 커스텀 리더보드: https://baseballsavant.mlb.com/leaderboard/custom?year=2026&type=batter&min=q (투수는 `type=pitcher`). 배트 트래킹 선수 단위는 `type=batter`.
- 어택 디렉션(약 15° 당겨 치는 쪽 ~ 10° 밀어 치는 쪽), 스윙 틸트(약 20° ~ 50°), 스윙 길이(6ft 조금 아래 ~ 8.5ft 넘게)의 시즌 범위는 MLB 용어집 설명이다.

### 정의 (2026-10-28 원문 대조)

- **출루율**: (안타 + 볼넷 + 사구) ÷ (타수 + 볼넷 + 사구 + 희생플라이). 실책·야수선택·낫아웃 출루는 넣지 않고, 희생번트는 분모에서도 뺀다. Branch Rickey와 Allan Roth가 1940~50년대에 만들었고 1984년에 공식 기록이 됐다. FanGraphs는 출루율이 타율보다 평균 60포인트쯤 높고, 500타석쯤 지나야 앞으로를 예측한다고 적었다. https://www.mlb.com/glossary/standard-stats/on-base-percentage , https://library.fangraphs.com/offense/obp/
- **장타율**: (1루타 + 2루타×2 + 3루타×3 + 홈런×4) ÷ 타수. 볼넷·사구는 들어가지 않는다. https://www.mlb.com/glossary/standard-stats/slugging-percentage
- **ISO**: 장타율 − 타율 = (2루타 + 3루타×2 + 홈런×3) ÷ 타수. 구장·리그 보정이 없고, 550타석쯤 지나야 예측력이 생긴다(FanGraphs). https://www.mlb.com/glossary/advanced-stats/isolated-power , https://library.fangraphs.com/offense/iso/
- **BB%**: 타자는 볼넷 ÷ 타석, 투수는 볼넷 ÷ 상대 타자. 타자 BB%는 120타석쯤이면 의미가 생긴다. https://www.mlb.com/glossary/advanced-stats/walk-rate , https://library.fangraphs.com/offense/rate-stats/
- **K-BB%**: K% − BB%. FanGraphs Library의 K-BB% 주소(/pitching/k-bb/)는 페이지가 없어서, 정의는 투수 비율 지표 페이지(https://library.fangraphs.com/pitching/rate-stats/)와 Stuff+ 입문서(K-BB%가 남은 시즌 예측에 강하다는 설명)를 출처로 둔다.
- **ERA+**: 리그 평균자책점(구장 보정) × 100 ÷ 평균자책점. 100이 평균이고 클수록 좋다. MLB.com 편집부가 쓴 항목이다. https://www.mlb.com/glossary/advanced-stats/earned-run-average-plus
- **WHIP**: (볼넷 + 피안타) ÷ 이닝. 사구, 실책, 야수선택 출루는 넣지 않는다. 1979년 Daniel Okrent가 처음엔 ‘innings pitched ratio’라는 이름으로 만들었다. FanGraphs는 분모가 이닝이라 피출루율보다 거칠다고 적었다. https://www.mlb.com/glossary/standard-stats/walks-and-hits-per-inning-pitched , https://library.fangraphs.com/pitching/whip/
- **발사각**: 타구가 배트를 떠나는 수직 각도. 땅볼 10° 미만, 라인드라이브 10~25°, 뜬공 25~50°, 팝업 50° 초과. 타자 평균에서 번트는 뺀다. https://www.mlb.com/glossary/statcast/launch-angle
- **스위트 스팟**: 발사각 8~32°인 타구. Savant 리더보드 이름은 LA SwSp%. https://www.mlb.com/glossary/statcast/sweet-spot
- **체이스%**: 존 밖 투구에 스윙한 비율(존 밖 스윙 ÷ 존 밖 투구). FanGraphs의 O-Swing%와 계산은 같지만 존 정의가 다르다. https://library.fangraphs.com/offense/plate-discipline/ (MLB 용어집의 chase-rate, whiff-rate 주소는 빈 틀이었다)
- **헛스윙%(Whiff%)**: 헛스윙 ÷ 스윙. 헛스윙 ÷ 전체 투구는 SwStr%로 다르다(FanGraphs가 둘을 헷갈리지 말라고 적었다).
- **스프린트 스피드**: 가장 빠른 1초 구간의 초당 피트. 2017년 도입, 2018년에 타자의 1루 전력 질주를 더했다. 두 베이스 이상 달린 주루(장타 때 2루 주자는 제외)와 약한 땅볼 때 1루까지 달린 것 가운데 빠른 쪽 약 3분의 2를 평균한다. 30ft/s 이상이면 볼트. https://www.mlb.com/glossary/statcast/sprint-speed
- **송구 속도(Arm Strength)**: 한 플레이에서 가장 빠른 송구 속도(놓는 순간이 최고). 리더보드는 ‘전력 송구’ 평균으로, 1루수는 상위 1%, 2·3루수와 유격수는 상위 5%, 외야수는 상위 10%를 평균한다. 2020년 Hawk-Eye부터. 포수는 팝 타임 리더보드에 상위 10%로 따로 있다. https://www.mlb.com/glossary/statcast/arm-strength
- **팝 타임**: 공이 포수 미트에 닿은 순간부터 송구가 베이스 한가운데에 닿을(닿았을) 때까지. 풋워크, 빼는 시간(exchange), 송구 속도가 합쳐진 값이다. https://www.mlb.com/glossary/statcast/pop-time , https://baseballsavant.mlb.com/leaderboard/poptime
- **xBA**: 비슷한 타구 속도·발사각(약한 땅볼과 빗맞은 타구에는 스프린트 스피드도)의 타구가 2015년 이후 안타가 된 비율. 삼진은 실제 값을 더한다. 2017~18년의 Hit Probability가 2019년에 이 이름으로 바뀌었다. https://www.mlb.com/glossary/statcast/expected-batting-average
- **xERA**: xwOBA를 평균자책점 눈금으로 1:1 바꾼 값. 예측용이라기보다, 실제 ERA와 크게 다르면 들여다볼 신호라고 적었다. 리그 평균 xERA는 Savant에서 찾지 못해 수치 기준을 붙이지 않았다. https://www.mlb.com/glossary/statcast/expected-era
- **스윙 길이**: 배트 트래킹이 잡히기 시작한 순간(대개 접촉 150ms 전)부터 접촉까지 배트 머리가 3차원으로 움직인 거리의 합(ft). 2024년 첫 달에 평균보다 짧은 스윙은 헛스윙% 19%, 긴 스윙은 30%였다. https://www.mlb.com/glossary/statcast/swing-length
- **스퀘어드업**: 배트 스피드와 투구 속도로 낼 수 있는 최대 타구 속도 대비 실제 타구 속도. 80% 이상이면 스퀘어드업 스윙. 최대치는 배트 끝에서 4~9인치(스위트 스팟)에 맞았을 때만 나온다. 위 ‘정의’의 블라스트 항목과 같은 출처.
- **어택 디렉션**: 접촉 순간(헛스윙이면 배트와 공이 지나친 지점) 스위트 스팟이 좌우로 움직이던 방향. 홈에서 중견수 쪽 직선을 0°로 ‘당겨 치는 쪽(pull)’, ‘밀어 치는 쪽(oppo)’으로 적는다. 타이밍에 따라 크게 바뀐다. https://www.mlb.com/glossary/statcast/attack-direction
- **스윙 틸트(Swing Path Tilt)**: 접촉 직전 40ms 동안 배트가 그린 궤적이 땅과 이루는 각도. 0°는 완전히 평평, 90°는 골프 스윙. 좋고 나쁨이 아니라 스윙의 종류이고, 높은 공에는 평평해지고 낮은 공에는 가팔라진다. https://www.mlb.com/glossary/statcast/swing-path-tilt
- **익스텐션**: 투수판(홈에서 60피트 6인치)보다 몇 피트 앞에서 공을 놓았는지. 키가 크고 팔이 길수록 길다. 체감 구속에 들어간다. https://www.mlb.com/glossary/statcast/extension
- **팔 각도**: 공을 놓는 순간 던지는 쪽 어깨와 공을 이은 선이 수평선과 이루는 각도. 0°는 수평(사이드암), 90°는 완전히 위. 2020년 데이터부터 있다. 2024년 9월 Baseball Savant에 공개됐다(MLB.com 2024-09-25 기사 ‘newly released arm angle metrics’). 같은 기사에서 2024년 평균 릴리스 높이는 5.8피트. https://baseballsavant.mlb.com/leaderboard/pitcher-arm-angles , https://www.mlb.com/news/how-arm-slot-and-arm-angle-affect-pitches
- **FRV**: Statcast 수비 지표를 득점으로 바꿔 더한 값, 2018년부터(지표마다 2016년부터). 환산: OAA 1아웃 = 외야 0.9점·내야 0.75점, 송구 1점 = 1점, 블로킹 1개 = 0.25점, 프레이밍 1스트라이크 = 0.125점, 포수 송구 도루 저지 1개 = 0.65점, 병살 1개 = 0.4점, 1루수 포구 OAA 1개 = 0.75점. 2026년 10월부터 포수의 ABS 챌린지 가치도 들어간다(Savant 변경 기록 2026-10-08). https://www.mlb.com/glossary/statcast/fielding-run-value , https://baseballsavant.mlb.com/leaderboard/fielding-run-value , https://baseballsavant.mlb.com/changelog/2026-10-08-abs-leaderboard-update-frv
- **블로킹(Blocks Above Average)**: 투구마다 위치, 속도, 무브먼트, 포수 위치, 좌우로 폭투·포일이 될 확률을 매기고, 실제 폭투+포일과 기대치의 차이를 센다. 확률 10%짜리를 막으면 +0.10. 경기당 평균 40번의 블로킹 기회 기준 비율도 있다. 1개 = 0.25점. https://baseballsavant.mlb.com/leaderboard/catcher-blocking (MLB 용어집 catcher-blocking 주소는 빈 틀)
- **프레이밍**: 존 안팎 구역별 루킹 스트라이크 확률 모델로, 1스트라이크 = 0.125점. 섀도 존은 존 안쪽 공 하나 폭부터 바깥쪽 공 하나 폭까지. 2025년에 존과의 거리를 반영하도록 모델을 고쳤고, 새 모델은 2018년부터 있다. 2026년 ABS 이후에는 심판의 첫 판정으로 프레이밍을 매기고, 챌린지로 바뀐 몫은 ‘챌린지 기술’로 따로 센다. https://www.mlb.com/glossary/statcast/catcher-framing , https://baseballsavant.mlb.com/catcher_framing , https://baseballsavant.mlb.com/abs-metrics-documentation
- **주루 득점 가치(Baserunning Run Value)**: 도루(도루·보크 진루 +0.2점, 도루 실패·견제사 −0.45점, 투수·포수에 따른 성공 확률)와 도루가 아닌 추가 진루(주자 속도, 외야수 어깨, 위치, 거리로 성공 확률)를 합친 값. https://baseballsavant.mlb.com/leaderboard/baserunning-run-value (MLB 용어집 주소는 빈 틀)
- **RE24**: 아웃 수(0~2) × 주자 배치(8가지) = 24상황의 기대 득점으로, 타석 뒤 기대 득점 − 타석 전 기대 득점 + 그 타석의 득점. 리그 평균 0. 점수 차와 이닝은 보지 않는다. 도루·폭투 진루는 주자에게, 나머지는 타자와 투수에게만 준다. 수비는 모두 투수 몫. FanGraphs 예시 표(경기당 4.15점 환경)에서 무사 1루 0.831, 무사 1·3루 1.798. 9~10점 = 1승. https://library.fangraphs.com/misc/re24/
- **WPA**: 플레이 뒤 승리 확률 − 플레이 전 승리 확률. 타자와 투수가 정반대로 나눠 갖고, 이긴 팀 합계는 +0.5, 진 팀은 −0.5. 평균 0, +1 = 평균보다 1승. 예측력은 없다. 수비는 모두 투수 몫. https://library.fangraphs.com/misc/wpa/ , https://www.mlb.com/glossary/advanced-stats/win-probability-added
- **LI**: Tom Tango가 만든 지수. 이 타석에서 승리 확률이 얼마나 크게 움직일 수 있는지를 평균 상황과 견준 값으로 평균 1.0. 0.85 미만 낮음, 2.0 이상 높음. 실제 상황의 10%가 2를 넘고 60%가 1보다 낮다. 큰 순간에는 10 가까이 간다. https://library.fangraphs.com/misc/li/ , https://www.mlb.com/glossary/advanced-stats/leverage-index
- **BsR**: wSB(도루 득점) + UBR(도루가 아닌 주루) + wGDP(병살 회피). 리그 평균 0, 약 10점 = 1승, FanGraphs WAR의 주루 부분. 도루는 3분의 2쯤 성공해야 득이 된다. UBR은 2002년부터. https://library.fangraphs.com/offense/bsr/
- **DRS**: Baseball Info Solutions(BIS)가 사람 손으로 기록한 타구 위치·종류 데이터로(FanGraphs Library 기준. 지금 회사 이름은 확인하지 않았다), 같은 포지션 평균 대비 몇 점을 막았는지. 범위(rPM), 송구(rARM), 병살(rGDP), 번트(rBU), 홈런 훔치기(rHR, 1개 1.6점), 도루 억제(rSB) 등을 더한다. 사람이 위치를 기록해서 오차가 있다. https://library.fangraphs.com/defense/drs/ , https://www.mlb.com/glossary/advanced-stats/defensive-runs-saved
- **Location+**: 볼카운트와 구종을 보정해 공이 들어간 위치만 평가한다. 구속·무브먼트는 넣지 않는다. 구종마다 100이 평균. 400구쯤 지나야 안정된다.
- **Pitching+**: Stuff+와 Location+의 가중 평균이 아니라, 공의 물리 특성·위치·볼카운트·타자 좌우를 함께 넣은 세 번째 모델. 구종 단위로 10점 = 1 표준편차. 남은 시즌 예측에서 작은 표본일 때 K-BB%보다 낫다고 적었다. 불펜은 약 250구, 선발은 약 400구부터 시즌 전 예상치보다 잘 맞힌다. 위 두 항목 모두 https://library.fangraphs.com/pitching/stuff-location-and-pitching-primer/
- **ABS 챌린지**: 2026시즌부터. 타자, 투수, 포수만 신청할 수 있고(감독·코치·다른 선수는 안 됨), 팀마다 경기당 2번으로 시작해 실패 두 번이면 더 못 한다. 연장전은 이닝마다 1번을 새로 받는다. 존은 폭 17인치, 위는 선수 키(맨발)의 53.5%, 아래는 27%이고, 홈플레이트 앞이 아니라 한가운데를 지날 때 판정한다. 야수가 등판했을 때는 챌린지가 없다. KBO는 2024시즌에 프로 리그 가운데 처음으로 ABS를 들였고 볼·스트라이크 판정 자체를 기계가 한다(Lee 외, arXiv 2407.15779 초록). Savant는 2026년 2월에 대시보드와 리더보드를 열었다. 챌린지 기회(신청할 수 있는 판정)는 전체 투구의 약 50%, ‘해 볼 만한’ 공은 약 5%라고 적었다. https://baseballsavant.mlb.com/abs , https://baseballsavant.mlb.com/abs-metrics-documentation , https://baseballsavant.mlb.com/changelog/2026-02-26-abs-challenge-dashboard-leaderboard

## 2026-10-29 용어 그림

그림(`src/components/fig/terms/`)에 쓴 숫자는 위에 있는 값과 아래뿐이다. 나머지는 그림마다 ‘가상의 예’라고 밝혔다.

- **wOBA 2013 시즌 가중치**: 고의4구를 뺀 볼넷 0.690, 사구 0.722, 단타 0.888, 2루타 1.271, 3루타 1.616, 홈런 2.101. FanGraphs Library wOBA 페이지가 예로 든 식(2026-10-29 확인). 가중치는 해마다 다시 계산한다. https://library.fangraphs.com/offense/woba/
- 계산값(그림 설명에 계산값이라고 적었다):
  - 회전수: 2026 포심 평균 94.8mph, 2,314rpm, 익스텐션 6.5피트로 홈까지 54피트를 느려지지 않는다고 치면 0.39초, 약 15바퀴.
  - 주루 득점 가치: 도루 성공 +0.2점, 실패 −0.45점이면 본전 성공률은 0.45 ÷ 0.65 ≈ 69%.
  - RE24: FanGraphs 예시 표의 무사 1루 0.831 → 무사 1·3루 1.798, 득점 0이면 +0.967.
  - ERA+: 2026 리그 평균자책점 4.17, 가상의 투수 3.34(구장 보정 없음)면 125.
  - LI: 실제 상황의 60%가 1보다 낮고 10%가 2를 넘으니 1~2는 30%.
- 옆에서 본 투구 그림의 포심은 2026 포심 평균 익스텐션(6.5피트), 2024 평균 릴리스 높이(5.8피트), 포심 평균 IVB(약 16인치, 2024)로 만든 가상의 길이다. 홈에서의 각도는 약 −5°로 FanGraphs 글의 포심 평균(−4.8~−5.0°)과 맞는다. 2026 포심 평균(아래 −4.6°)보다는 조금 가파르다.

## 2026-10-29 평균 시즌

평균 설명에 기준 시즌이 없던 넷(어택 앵글, IVB, VAA, 스프린트 스피드)을 원 자료로 다시 확인해 채웠다.

| 지표 | 2026 | 2025 | 출처 |
|---|---|---|---|
| 어택 앵글 | 10.1° | 10.0° | Baseball Savant 스윙 궤적 리그 행(`attack_angle` 10.12 / 10.03, 경쟁 스윙 297,747 / 297,284개). 같은 행의 이상적 어택 앵글(5~20°) 비율은 50.9% / 51.0% |
| 포심 IVB | 15.6인치 | 15.8인치 | Baseball Savant Statcast Search(포심, 정규시즌, 리그 단위)의 ‘Vertical Movement w/o Gravity’. 같은 행의 포심은 219,172 / 226,410개, 평균 구속 94.8 / 94.5mph, 릴리스 높이 5.77 / 5.82피트 |
| 포심 VAA | −4.6° (−4.645°) | −4.7° (−4.696°) | 계산값. 아래 |
| 스프린트 스피드 | Statcast 기준값 27.0ft/s, 2026 리더보드 선수 평균 27.4ft/s | | 위 ‘2026-10-28 새 용어 35개’와 같다. 27.0은 시즌 값이 아니라 Savant 리더보드 설명문이 적은 경쟁 주루의 MLB 평균이다 |

- VAA: Savant는 VAA를 리그 값으로 내지 않고, FanGraphs 본 사이트(Pitch Info VAA)는 이 환경에서 막혀 있다. 그래서 Statcast Search의 투구 단위 자료(CSV, 포심, 정규시즌)를 주 단위로 받아 투구마다 계산하고 평균했다. 2026은 219,172개, 2025는 226,410개로 위 IVB 행의 포심 수와 같다.
  - 식(FanGraphs ‘A Visualized Primer on Vertical Approach Angle’과 같은 방법): 투구 추적의 기준면 y = 50피트에서 홈 앞 y = 17/12피트까지, vy_f = −√(vy0² − 2·ay·(50 − 17/12)), t = (vy_f − vy0) ÷ ay, vz_f = vz0 + az·t, VAA = −arctan(vz_f ÷ vy_f).
  - 가운데 값도 −4.646° / −4.695°로 평균과 거의 같다. 2021~2024년 글의 −4.8~−5.0°보다 평평하다.
  - 주소: https://baseballsavant.mlb.com/statcast_search/csv?all=true&hfPT=FF%7C&hfGT=R%7C&hfSea=2026%7C&player_type=pitcher&game_date_gt=2026-04-01&game_date_lt=2026-04-07&type=details (날짜만 바꿔 가며 받았다)
- IVB: https://baseballsavant.mlb.com/statcast_search?hfPT=FF%7C&hfGT=R%7C&hfSea=2026%7C&player_type=pitcher&group_by=league&chk_stats_api_break_z_induced=on
- 어택 앵글: 위 ‘2026-10-28 새 용어 35개’의 스윙 궤적 리그 단위 주소(2025는 연도만 바꾼다).

## 용어마다의 마지막 확인 날짜 (2026-10-29 정리)

용어 파일의 `checked`(화면의 ‘마지막 확인’)는 그 용어의 숫자와 정의를 출처의 원문과 마지막으로 대조한 날이다. 이 파일과 커밋 기록으로 정했다. 글만 다듬거나 관련 용어만 더한 날(2026-10-26·27, 2026-10-28의 기존 용어)은 세지 않는다.

- 2026-10-29 (3개): 어택 앵글, IVB, VAA. 위 ‘2026-10-29 평균 시즌’.
- 2026-10-28 (35개): 위 ‘2026-10-28 새 용어 35개’의 용어 모두. 스프린트 스피드는 2026-10-29에 평균 설명만 고쳤고 숫자는 이날 확인한 값이라 이날로 둔다.
- 2026-10-23 (17개): 타율, 배럴, 배트 스피드, CSW%, ERA, 타구 속도, FIP, 수비율, 하드히트%, K%, SIERA, 회전수, Stuff+, 스윙 타이밍, 구속, wOBA, xFIP. 위 ‘2026-10-23 원문 대조’와 리그 평균 표의 2026-10-23 행(배럴·wOBA는 Savant 리그 행, CSW%는 Pitcher List에 리그 값이 없음을 확인).
- 2026-10-15 (7개): BABIP, 블라스트, OAA, OPS, WAR, wRC+, xwOBA. 그 뒤로 원문을 다시 열지 않았다.

## 확인하지 못한 것 (2026-10-23 기준)

- MLB 용어집의 배트 스피드 페이지: 주소는 열리지만 여전히 빈 틀이다(제목 ‘@seo-title’). 배트 스피드 정의는 Savant 리더보드 설명을 원본으로 둔다.
- FanGraphs의 2026 리그 xFIP·SIERA: www.fangraphs.com이 이 작업 환경에서 봇 차단 페이지를 띄워 열지 못했다(FanGraphs Guts도 같아서 2026-10-15 값을 그대로 둔다).
- AP 구속 기사의 U.S. News 게재본은 이 환경에서 열리지 않아(502), 같은 기사의 ESPN 게재본으로 출처를 바꿨다.
