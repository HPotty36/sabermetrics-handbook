// 검색과 필터. 빌드 때 색인을 만들고, 브라우저에서 같은 함수로 거른다.

/** 분야 고르기에서 ‘전체’를 뜻하는 값. 화면에 보이는 이름은 i18n.ts에 있다. */
export const ALL_CATS = '전체';

/** 대소문자, 공백, 구두점을 무시한다. %와 +는 남긴다(ERA와 ERA+, K와 K%는 다른 용어다). */
export function norm(s: string): string {
  return s.toLowerCase().replace(/[\s\-·.,()/]/g, '');
}

export interface SearchEntry {
  id: string;
  href: string;
  level: number;
  cats: string[];
  /** 약어, 표기, 한국어·영어 이름, 별칭을 정규화해 이은 것 */
  name: string;
  summary: string;
}

export interface SearchQuery {
  q: string;
  /** 0이면 모든 레벨 */
  level: number;
  /** ALL_CATS면 모든 분야 */
  cat: string;
}

interface Searchable {
  id: string;
  /** 두 언어의 이름과 별칭 */
  searchNames: string[];
  level: number;
  cats: string[];
  /** 지금 화면 언어의 한 줄 정의 */
  summary: string;
}

export function toSearchEntry(t: Searchable, href: string): SearchEntry {
  return {
    id: t.id,
    href,
    level: t.level,
    cats: t.cats,
    name: norm(t.searchNames.join('|')),
    summary: norm(t.summary),
  };
}

/** 검색어가 얼마나 잘 맞는지. 0 이름과 똑같음, 1 이름이 검색어로 시작함, 2 이름에 들어 있음, 3 요약에만 있음, 4 안 맞음 */
function rank(e: SearchEntry, nq: string): number {
  if (!nq) return 0;
  const names = e.name.split('|');
  if (names.includes(nq)) return 0;
  if (names.some((n) => n.startsWith(nq))) return 1;
  if (e.name.includes(nq)) return 2;
  return e.summary.includes(nq) ? 3 : 4;
}

/**
 * 조건에 맞는 용어를 고른다. 이름이 검색어와 똑같은 용어를 맨 앞에(‘era’는 ERA, Enter로 바로 열린다),
 * 그다음 이름이 검색어로 시작하는 것, 이름에 들어 있는 것, 요약에만 있는 것 순이다. 같으면 레벨 순, 들어온 순서대로 둔다.
 */
export function search(entries: SearchEntry[], { q, level, cat }: SearchQuery): SearchEntry[] {
  const nq = norm(q);
  return entries
    .map((e, i) => ({ e, i, r: rank(e, nq) }))
    .filter(({ e, r }) => (!level || e.level === level) && (cat === ALL_CATS || e.cats.includes(cat)) && r < 4)
    .sort((a, b) => a.r - b.r || a.e.level - b.e.level || a.i - b.i)
    .map(({ e }) => e);
}
