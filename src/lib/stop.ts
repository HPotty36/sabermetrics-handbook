/** 사다리 선(components/Line.astro)의 역 하나. */
export interface Stop {
  id: string;
  name: string;
  /** 이름 옆 풀이 (세로 선에서만 보인다) */
  sub?: string;
  /** 오른쪽 끝에 붙는 숫자 (공개된 해) */
  note?: string;
  href?: string;
  state?: 'current' | 'stub';
}

/** 용어 페이지의 ‘다음’: 사다리에서 바로 다음 용어. */
export interface NextStop {
  href: string;
  name: string;
  sub: string;
  ladder: string;
}
