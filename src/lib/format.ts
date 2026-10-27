// 눈금 막대의 숫자 표기와 위치.

export type Fmt = 'int' | 'dec1' | 'dec2' | 'dec3';

export function fmt(v: number, s: { fmt: Fmt; unit?: string }): string {
  let str: string;
  if (s.fmt === 'dec3') str = Math.abs(v) < 1 ? v.toFixed(3).replace(/^(-?)0/, '$1') : v.toFixed(3);
  else if (s.fmt === 'dec2') str = v.toFixed(2);
  else if (s.fmt === 'dec1') str = v.toFixed(1);
  else str = String(Math.round(v));
  return str.replace('-', '−') + (s.unit ?? '');
}

/** 막대 왼쪽 끝에서의 위치(%)를 소수 둘째 자리 문자열로 준다. */
export function pos(v: number, s: { min: number; max: number }): string {
  return (((v - s.min) / (s.max - s.min)) * 100).toFixed(2);
}

/**
 * 평균 설명에서, 옆에 크게 따로 적는 평균 숫자를 뺀 말.
 * ‘2026 MLB 평균 4.17 (2025년 4.15)’ → ‘2026 MLB 평균 (2025년 4.15)’. 숫자가 그대로 들어 있지 않으면 설명을 그대로 둔다.
 */
export function avgCaption(avg: { v: number; t: string }, s: { fmt: Fmt; unit?: string }): string {
  const n = fmt(avg.v, s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(^|[^\\d.])${n}(?![\\d])`);
  if (!re.test(avg.t)) return avg.t;
  return avg.t.replace(re, '$1').replace(/\s{2,}/g, ' ').replace(/\s+\)/g, ')').trim();
}
