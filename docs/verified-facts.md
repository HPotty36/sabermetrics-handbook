# 확인한 사실 (2026-10-15, 2026-10-23 보강)

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

## 확인하지 못한 것 (2026-10-23 기준)

- MLB 용어집의 배트 스피드 페이지: 주소는 열리지만 여전히 빈 틀이다(제목 ‘@seo-title’). 배트 스피드 정의는 Savant 리더보드 설명을 원본으로 둔다.
- 최근 리그 전체 포심 VAA 평균, FanGraphs의 2026 리그 xFIP·SIERA: www.fangraphs.com이 이 작업 환경에서 봇 차단 페이지를 띄워 열지 못했다(FanGraphs Guts도 같아서 2026-10-15 값을 그대로 둔다).
- AP 구속 기사의 U.S. News 게재본은 이 환경에서 열리지 않아(502), 같은 기사의 ESPN 게재본으로 출처를 바꿨다.
