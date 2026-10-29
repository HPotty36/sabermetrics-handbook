// 용어 그림(components/fig)이 함께 쓰는 계산과 가상의 예.
// 그림은 빌드 때 만드는 정적 SVG라 화면에서 스크립트가 돌지 않는다. 선수 기록은 쓰지 않는다.
// 숫자는 정의상의 경계(배럴 98mph 26~30° 같은 것)와 docs/verified-facts.md에 적은 값만 쓰고, 나머지는 가상의 예다.

/** 경로 문자열에 넣을 숫자. 소수 둘째 자리까지. */
export const n = (v: number) => String(Math.round(v * 100) / 100);

/** 값(d0~d1)을 화면 좌표(r0~r1)로 바꾸는 직선 눈금 */
export function lin(d0: number, d1: number, r0: number, r1: number) {
  return (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

/** 각도(도). 0°는 오른쪽, 양수는 위(반시계)다. 화면의 y는 아래로 늘어나므로 sin의 부호를 뒤집는다. */
export function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
}

/** deg0에서 deg1까지 반지름 r의 호 */
export function arc(cx: number, cy: number, r: number, deg0: number, deg1: number) {
  const [x0, y0] = polar(cx, cy, r, deg0);
  const [x1, y1] = polar(cx, cy, r, deg1);
  const large = Math.abs(deg1 - deg0) > 180 ? 1 : 0;
  const sweep = deg1 > deg0 ? 0 : 1;
  return `M${n(x0)} ${n(y0)}A${n(r)} ${n(r)} 0 ${large} ${sweep} ${n(x1)} ${n(y1)}`;
}

/** 중심에서 deg0~deg1로 벌어진 부채꼴 */
export function wedge(cx: number, cy: number, r: number, deg0: number, deg1: number) {
  const [x0, y0] = polar(cx, cy, r, deg0);
  const [x1, y1] = polar(cx, cy, r, deg1);
  const large = Math.abs(deg1 - deg0) > 180 ? 1 : 0;
  const sweep = deg1 > deg0 ? 0 : 1;
  return `M${n(cx)} ${n(cy)}L${n(x0)} ${n(y0)}A${n(r)} ${n(r)} 0 ${large} ${sweep} ${n(x1)} ${n(y1)}Z`;
}

/** (x1,y1)에서 (x2,y2)로 가는 화살표의 몸통과 머리 */
export function arrow(x1: number, y1: number, x2: number, y2: number, size = 7) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const back = (s: number) => [x2 - size * Math.cos(a + s), y2 - size * Math.sin(a + s)];
  const [lx, ly] = back(0.45);
  const [rx, ry] = back(-0.45);
  const [bx, by] = [x2 - size * 0.8 * Math.cos(a), y2 - size * 0.8 * Math.sin(a)];
  return {
    line: `M${n(x1)} ${n(y1)}L${n(bx)} ${n(by)}`,
    head: `M${n(x2)} ${n(y2)}L${n(lx)} ${n(ly)}L${n(rx)} ${n(ry)}Z`,
  };
}

/** 점들을 잇는 매끈한 곡선(Catmull-Rom → 3차 베지에) */
export function smooth(pts: [number, number][]) {
  if (pts.length < 2) return '';
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(p2[0])} ${n(p2[1])}`;
  }
  return d;
}

/** 소수 셋째 자리 비율 표기(.333, 1.194) */
export function rate3(v: number) {
  const s = v.toFixed(3);
  return v < 1 ? s.replace(/^0/, '') : s;
}

/** 백분율 한 자리(8.3%) */
export const pct1 = (v: number) => `${(v * 100).toFixed(1)}%`;

// ---------- 가상의 12타석 ----------
// 타격 비율 지표(타율, 출루율, 장타율, ISO, OPS, BB%, K%, BABIP, wOBA)의 그림이 모두 이 12타석으로 계산한다.
export type PaKind = '1B' | '2B' | '3B' | 'HR' | 'BB' | 'HBP' | 'K' | 'GO' | 'FO' | 'SF';
export const PA_LOG: PaKind[] = ['1B', 'GO', 'BB', 'K', '2B', 'FO', 'K', 'HR', 'SF', 'GO', 'HBP', 'FO'];

export const PA_LABEL: Record<'ko' | 'en', Record<PaKind, string>> = {
  ko: { '1B': '단타', '2B': '2루타', '3B': '3루타', HR: '홈런', BB: '볼넷', HBP: '사구', K: '삼진', GO: '땅볼', FO: '뜬공', SF: '희생플라이' },
  en: { '1B': 'Single', '2B': 'Double', '3B': 'Triple', HR: 'Homer', BB: 'Walk', HBP: 'HBP', K: 'K', GO: 'Groundout', FO: 'Flyout', SF: 'Sac fly' },
};

export const isHit = (k: PaKind) => k === '1B' || k === '2B' || k === '3B' || k === 'HR';
/** 타수에 들어가는 타석 */
export const isAB = (k: PaKind) => k !== 'BB' && k !== 'HBP' && k !== 'SF';
/** 루타 */
export const bases = (k: PaKind) => ({ '1B': 1, '2B': 2, '3B': 3, HR: 4 })[k as '1B'] ?? 0;

export function paTotals(log: PaKind[] = PA_LOG) {
  const c = (f: (k: PaKind) => boolean) => log.filter(f).length;
  const PA = log.length;
  const AB = c(isAB);
  const H = c(isHit);
  const HR = c((k) => k === 'HR');
  const BB = c((k) => k === 'BB');
  const HBP = c((k) => k === 'HBP');
  const SF = c((k) => k === 'SF');
  const K = c((k) => k === 'K');
  const TB = log.reduce((s, k) => s + bases(k), 0);
  return { PA, AB, H, HR, BB, HBP, SF, K, TB };
}

// ---------- 가상의 투구 16개 ----------
// CSW%, 헛스윙%의 그림이 이 16구로 계산한다. 결과: 볼, 루킹 스트라이크, 헛스윙, 파울, 인플레이.
export type PitchKind = 'B' | 'CS' | 'W' | 'F' | 'IP';
export const PITCH_LOG: PitchKind[] = ['B', 'CS', 'F', 'W', 'B', 'IP', 'CS', 'B', 'B', 'F', 'B', 'W', 'IP', 'B', 'B', 'F'];
export const PITCH_LABEL: Record<'ko' | 'en', Record<PitchKind, string>> = {
  ko: { B: '볼', CS: '루킹', W: '헛스윙', F: '파울', IP: '인플레이' },
  en: { B: 'Ball', CS: 'Called K', W: 'Whiff', F: 'Foul', IP: 'In play' },
};
export const isSwing = (k: PitchKind) => k === 'W' || k === 'F' || k === 'IP';

// ---------- 가상의 선발 투수 한 경기(6이닝) ----------
// 평균자책점, WHIP, FIP의 그림이 이 경기로 계산한다. 회마다 내보낸 주자와 점수.
// 3회: 안타 뒤 홈런(자책 2점). 5회: 안타, 볼넷, 사구로 만루가 된 뒤 실책으로 1점(비자책).
export type RunnerKind = 'H' | 'HR' | 'BB' | 'HBP';
export const GAME: { runners: RunnerKind[]; er: number; ur: number }[] = [
  { runners: ['H'], er: 0, ur: 0 },
  { runners: ['BB'], er: 0, ur: 0 },
  { runners: ['H', 'HR'], er: 2, ur: 0 },
  { runners: [], er: 0, ur: 0 },
  { runners: ['H', 'BB', 'HBP'], er: 0, ur: 1 },
  { runners: ['H'], er: 0, ur: 0 },
];
export const GAME_K = 6;
/** 허용한 뜬공(홈런 포함) */
export const GAME_FB = 7;
export function gameTotals() {
  const all = GAME.flatMap((g) => g.runners);
  const c = (k: RunnerKind) => all.filter((r) => r === k).length;
  return {
    IP: GAME.length,
    H: c('H') + c('HR'),
    HR: c('HR'),
    BB: c('BB'),
    HBP: c('HBP'),
    K: GAME_K,
    FB: GAME_FB,
    ER: GAME.reduce((s, g) => s + g.er, 0),
    UR: GAME.reduce((s, g) => s + g.ur, 0),
  };
}
/** 2026 MLB 리그 평균자책점과 FIP 상수(docs/verified-facts.md) */
export const LG_ERA_2026 = 4.17;
export const FIP_C_2026 = 3.1;

// ---------- 포수 뒤에서 본 스트라이크 존 ----------
// 폭 17인치(홈플레이트 폭), 높이는 가상의 타자 22인치. 1인치 = 5.6px. 공 지름은 2.9인치로 그린다.
export const ZONE = (() => {
  const S = 5.6;
  const cx = 180;
  const cy = 125;
  return { S, cx, cy, left: cx - 8.5 * S, right: cx + 8.5 * S, top: cy - 11 * S, bottom: cy + 11 * S, r: 1.45 * S };
})();
/** 존 가운데를 0으로 둔 인치(오른쪽 +, 위 +)를 화면 좌표로 */
export const zxy = (x: number, y: number): [number, number] => [ZONE.cx + x * ZONE.S, ZONE.cy - y * ZONE.S];

// ---------- 타구 속도 × 발사각 평면 ----------
// 가로 타구 속도 60~120mph, 세로 발사각 −30°~70°.
export const EVLA = { x: lin(60, 120, 44, 344), y: lin(-30, 70, 232, 18) };

// ---------- 옆에서 본 투구 ----------
// 투수판(0피트)에서 홈플레이트(60.5피트)까지. 높이는 실제보다 약 3배 키워 그린다.
// 가상의 포심: 투수판 6.5피트 앞(2026 포심 평균 익스텐션), 높이 5.8피트(2024 평균 릴리스 높이)에서 놓아 홈에서 2.5피트 높이로 지난다.
// 날아가는 동안 중력으로 2.71피트 떨어질 것을 회전이 1.33피트(포심 평균 IVB 약 16인치) 덜 떨어지게 한다. 홈에서의 각도는 약 −5°다.
export const PSIDE = { x: lin(0, 60.5, 22, 334), y: lin(0, 7, 150, 38) };
export const RELEASE = { ft: 6.5, h: 5.8 };
const P_SLOPE = -0.0356;
const K_ACT = 1.38 / 54 ** 2;
const K_GRAV = 2.71 / 54 ** 2;
/** 투수판에서 ft만큼 온 곳의 공 높이(피트). gravityOnly면 회전 없이 중력만 받았을 때 */
export function pitchHeight(ft: number, gravityOnly = false) {
  const u = ft - RELEASE.ft;
  return RELEASE.h + P_SLOPE * u - (gravityOnly ? K_GRAV : K_ACT) * u * u;
}
/** 옆에서 본 투구의 길(화면 좌표 경로) */
export function pitchPath(gravityOnly = false, to = 60.5) {
  const pts: [number, number][] = [];
  for (let ft = RELEASE.ft; ft <= to + 1e-9; ft += (to - RELEASE.ft) / 24) pts.push([PSIDE.x(ft), PSIDE.y(pitchHeight(ft, gravityOnly))]);
  return smooth(pts);
}
/** 홈에서 공이 들어오는 실제 각도(도, 음수) */
export const plateAngle = () => (Math.atan(P_SLOPE - 2 * K_ACT * (60.5 - RELEASE.ft)) * 180) / Math.PI;
