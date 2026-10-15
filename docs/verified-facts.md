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

## 확인하지 못한 것

- MLB 용어집의 배트 스피드 페이지 (빈 페이지)
- Stuff+ 입력값에 익스텐션·팔 각도가 들어가는지
- Stuff+ 버전 변경 이력
- FanGraphs의 ‘Pitch Brains’ 지표가 무엇인지
- Savant에서 직접 읽은 포심 평균 구속
- 공식 CSW% 리그 평균 (위 값은 FanGraphs C+SwStr%)
- 최근 리그 전체 VAA 평균
- xFIP, SIERA의 FanGraphs Library URL
