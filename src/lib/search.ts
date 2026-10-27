// 검색. 빌드 때 색인을 만들고, 브라우저에서 같은 함수로 찾는다.

export function norm(s: string): string {
  return s.toLowerCase().replace(/[\s%+\-·.,()/]/g, '');
}

export interface SearchEntry {
  id: string;
  href: string;
  level: number;
  /** 약어, 표기, 한글·영문 이름, 별칭을 정규화해 이은 것 */
  name: string;
  summary: string;
}

interface Searchable {
  id: string;
  abbr: string;
  chip: string;
  ko: string;
  en: string;
  aliases?: string[];
  level: number;
  summary: string;
}

export function toSearchEntry(t: Searchable, href: string): SearchEntry {
  return {
    id: t.id,
    href,
    level: t.level,
    name: norm([t.abbr, t.chip, t.ko, t.en, ...(t.aliases ?? [])].join('|')),
    summary: norm(t.summary),
  };
}

/** 검색어에 맞는 용어를 고른다. 이름에 맞는 용어를 먼저, 그다음 레벨 순, 같으면 들어온 순서대로 둔다. */
export function search(entries: SearchEntry[], q: string): SearchEntry[] {
  const nq = norm(q);
  return entries
    .map((e, i) => ({ e, i, byName: !nq || e.name.includes(nq) }))
    .filter(({ e, byName }) => byName || e.summary.includes(nq))
    .sort((a, b) => Number(b.byName) - Number(a.byName) || a.e.level - b.e.level || a.i - b.i)
    .map(({ e }) => e);
}
