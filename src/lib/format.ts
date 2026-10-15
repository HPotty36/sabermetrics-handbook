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
