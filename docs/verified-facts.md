# 확인한 사실 (2026-10-15)

원 자료를 직접 열어 대조한 값이다. 새로 확인한 값은 날짜와 출처를 붙여 여기에 추가한다.

## 리그 평균 (MLB 정규시즌)

| 지표 | 2026 | 2025 | 출처 |
|---|---|---|---|
| wOBA | .316 | .313 | FanGraphs Guts (Savant 기준 .317) |
| 출루율 | .318 | .315 | FanGraphs |
| BABIP | .290 | .291 | FanGraphs |
| FIP 상수 | 3.100 | 3.135 | FanGraphs Guts |
| K% | 22.1% | 22.2% | FanGraphs |
| BB% | 8.9% | 8.4% | FanGraphs |
| 배럴 (타구 대비) | 7.7% | 8.6% | Baseball Savant (FanGraphs도 같음) |
| 하드히트% | 38.6% | 40.9% | Baseball Savant |
| 평균 타구 속도 | 88.8mph | 89.4mph | Baseball Savant |
| 포심 평균 구속 | 94.8mph (역대 최고) | 94.5mph | AP 보도 (Statcast 인용). FanGraphs 기준은 94.6 / 94.3 |
| CSW% (C+SwStr%) | 27.0% | 27.2% | FanGraphs |

- FanGraphs Guts: https://www.fangraphs.com/guts.aspx?type=cn
- Baseball Savant 리그: https://baseballsavant.mlb.com/league?season=2026
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
- **2026년 6월 스윙 타이밍**: Miss Distance, 타이밍 분류(이르다/늦다 등), Perfect Contact%, Flawed Swing%. 숫자 기준은 공개되지 않음. https://baseballsavant.mlb.com/changelog/2026-06-09-swing-timing-miss-distance
- **Stuff+**: Eno Sarris·Max Bay가 만들고 Sarris·Owen McGrattan이 관리. 입력값은 릴리스 포인트, 구속, 수직·수평 무브먼트, 회전수, 주 패스트볼과의 구속·무브먼트 차이, 회전축 차이. 로케이션 제외. 구종 단위 10점 = 1 표준편차. Pitching+는 별도 모델. 2026년에도 공개 중. https://library.fangraphs.com/pitching/stuff-location-and-pitching-primer/
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

## 검색으로만 확인한 것 (2026-10-15, 원문 미확인)

이 날은 작업 환경의 네트워크 정책 때문에 원 자료 페이지를 직접 열 수 없었다. 웹 검색 결과로만 확인했으므로, 원문을 열 수 있을 때 다시 대조해 위 표나 ‘정의’로 옮긴다.

### 출처 URL (검색 결과에 정확한 주소가 나온 것)

- https://library.fangraphs.com/pitching/xfip/ , https://library.fangraphs.com/pitching/siera/ (아래 ‘확인하지 못한 것’의 xFIP·SIERA URL 항목)
- https://library.fangraphs.com/pitching/era/ , https://library.fangraphs.com/stats-to-avoid-batting-average/
- https://library.fangraphs.com/offense/rate-stats/ , https://library.fangraphs.com/pitching/rate-stats/
- MLB.com Glossary: batting-average, earned-run-average, earned-run, strikeout-rate, fielding-percentage, expected-fielding-independent-pitching, skill-interactive-earned-run-average, exit-velocity, hard-hit-rate, velocity(포심 구속 용어 주소는 `/statcast/velocity`), perceived-velocity, spin-rate, active-spin
- https://baseballsavant.mlb.com/leaderboard/bat-tracking/swing-timing-miss-distance (스윙 타이밍 정의가 있는 리더보드)
- AP 2026-09-29 포심 평균 구속 기사의 U.S. News 게재본

### 용어 본문에 쓴 내용

모두 수치 없이 정성적으로만 썼다.

- **ERA**: 기록원이 실책·포일이 없었다고 가정하고 이닝을 재구성해 자책점을 정한다. 남겨 둔 주자가 득점하면 그 주자를 내보낸 투수의 실점이다.
- **xFIP**: FIP의 피홈런 자리에 뜬공 × 리그 평균 HR/FB를 넣는다. FIP와 같은 상수를 쓴다. 구장·리그를 보정한 xFIP-가 있다.
- **SIERA**: 타석당 삼진·볼넷, 땅볼과 뜬공의 차이에 제곱항·곱셈항을 넣는다. 삼진이 많은 투수일수록 BABIP와 HR/FB가 낮은 경향을 반영한다. Baseball Prospectus에서 처음 발표됐고 FanGraphs가 수정한 버전을 쓴다. 지난 결과로 실력을 추정하는 지표다.
- **K%**: K/9는 상대 타자 수를 무시해 주자를 많이 내보낸 투수에게서 부풀려진다. K%는 표본이 비교적 빨리 안정된다.
- **수비율**: (자살 + 보살) ÷ (자살 + 보살 + 실책). 실책은 ‘평범한 수비수라면 처리했을 플레이’라는 기록원의 판단이다.
- **타구 속도**: 인플레이 타구(안타·아웃·실책)마다 잰다.
- **하드히트%**: 95mph 이상 타구 ÷ 인플레이 타구. 95mph부터 결과가 눈에 띄게 좋아진다는 것이 기준을 잡은 이유다.
- **구속**: Statcast는 공이 손을 떠날 때의 속도(가장 빠른 순간)를 기록한다. 예전 추적 시스템은 재는 지점이 달랐다. 익스텐션을 반영한 체감 구속이 따로 있다.
- **회전수**: 진행 방향에 수직인 성분만 움직임을 만든다(액티브 스핀, 회전 효율). 지금은 회전축을 직접 재고, 예전에는 움직임에서 역산했다.
- **스윙 타이밍**: 배트와 공이 가장 가까워진 순간을 기준으로 시간(이르다·제때·늦다), 위아래(공 위·맞음·공 아래), 좌우(안쪽으로 파고듦·중심·바깥쪽)를 판정한다. 헛스윙에는 Miss Distance(인치)가 붙는다. Perfect Contact%는 세 방향이 모두 맞은 스윙의 비율이다. Flawed Swing%의 정확한 정의(셋 중 하나라도 어긋남인지, 모두 어긋남인지)는 확인하지 못해 본문에서 구체적으로 쓰지 않았다.

## 확인하지 못한 것

- MLB 용어집의 배트 스피드 페이지 (빈 페이지)
- Stuff+ 입력값에 익스텐션·팔 각도가 들어가는지
- Stuff+ 버전 변경 이력
- FanGraphs의 ‘Pitch Brains’ 지표가 무엇인지
- Savant에서 직접 읽은 포심 평균 구속
- 공식 CSW% 리그 평균 (위 값은 FanGraphs C+SwStr%)
- 최근 리그 전체 VAA 평균
- xFIP, SIERA의 FanGraphs Library URL: 2026-10-15 검색 결과로 주소는 확인했다(위 참고). 페이지를 열어 내용은 확인하지 못했다.
- 2026·2025 MLB 리그 타율과 평균자책점. 검색에는 2026 타율 약 .244(AL .241, NL .246)가 2차 자료로만 나왔다.
- 포심 평균 회전수, 리그 평균 배트 스피드(검색에 2026년 72.1mph가 MLB.com 기사로 나옴), 리그 수비율(검색에 .985가 Baseball-Reference로 나옴), 빠른 스윙 비율
- 스윙 타이밍의 판정 기준값. 위 ‘정의’에는 ‘숫자 기준은 공개되지 않음’으로 적었는데, 검색으로는 리더보드 페이지에 수직 ±2인치, 수평 ±4인치, 시간 ±7ms가 적혀 있다는 결과가 여러 번 나왔다. 변경 기록에는 없고 리더보드에만 있을 수 있다. 리더보드를 열어 확인한다.
- FanGraphs Library의 경험칙 표(ERA, xFIP, SIERA, 타자·투수 K%). 확인되면 해당 용어에 `scale`을 붙일 수 있다.
