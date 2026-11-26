// 검색과 필터. 빌드 때 색인을 만들고, 브라우저에서 같은 함수로 거른다.

/** 분야 고르기에서 ‘전체’를 뜻하는 값. 화면에 보이는 이름은 i18n.ts에 있다. */
export const ALL_CATS = '전체';

/**
 * 대소문자, 공백, 구두점을 무시한다. %와 +는 남긴다(ERA와 ERA+, K와 K%는 다른 용어다).
 * 끝에 붙은 -도 남긴다(ERA-는 ERA+의 다른 이름이다). 가운데의 -는 지운다(K-BB%와 kbb%는 같다).
 */
export function norm(s: string): string {
  const t = s.toLowerCase().trim();
  return t.replace(/[\s\-·.,()/|]/g, '') + (/[^\s-]-$/.test(t) ? '-' : '');
}

export interface SearchEntry {
  id: string;
  href: string;
  level: number;
  cats: string[];
  /** 정식 이름(약어, 표기, 한국어·영어 이름)을 정규화해 |로 이은 것 */
  name: string;
  /** 별칭을 정규화해 |로 이은 것. 정식 이름보다 뒤에 센다. */
  alias: string;
  /** 이름과 별칭을 띄어쓰기·구두점에서 나눈 낱말을 정규화해 |로 이은 것. 검색어가 한 낱말 안에 들었는지 본다. */
  words: string;
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
  /** 두 언어의 정식 이름 */
  searchNames: string[];
  /** 두 언어의 별칭 */
  searchAliases?: string[];
  level: number;
  cats: string[];
  /** 지금 화면 언어의 한 줄 정의 */
  summary: string;
}

const join = (xs: string[]) => [...new Set(xs.map(norm).filter(Boolean))].join('|');
const SEP = /[\s\-·.,()/|]+/;

export function toSearchEntry(t: Searchable, href: string): SearchEntry {
  return {
    id: t.id,
    href,
    level: t.level,
    cats: t.cats,
    name: join(t.searchNames),
    alias: join(t.searchAliases ?? []),
    words: join([...t.searchNames, ...(t.searchAliases ?? [])].flatMap((n) => n.split(SEP))),
    summary: norm(t.summary),
  };
}

const allNames = (e: SearchEntry) => (e.alias ? `${e.name}|${e.alias}` : e.name).split('|');

/**
 * 검색어가 얼마나 잘 맞는지. 0 정식 이름과 똑같음, 1 별칭과 똑같음, 2 이름이 검색어로 시작함,
 * 3 이름의 한 낱말 안에 들어 있음(babip의 bip), 4 띄어쓰기를 지운 이름에만 들어 있음(chase rate의 sera),
 * 5 요약에만 있음, 6 안 맞음.
 */
function rank(e: SearchEntry, nq: string): number {
  if (!nq) return 0;
  if (e.name.split('|').includes(nq)) return 0;
  if (e.alias && e.alias.split('|').includes(nq)) return 1;
  const names = allNames(e);
  if (names.some((n) => n.startsWith(nq))) return 2;
  if (e.words.split('|').some((w) => w.includes(nq))) return 3;
  if (names.some((n) => n.includes(nq))) return 4;
  return e.summary.includes(nq) ? 5 : 6;
}

/**
 * 조건에 맞는 용어를 고른다. 정식 이름이 검색어와 똑같은 용어를 맨 앞에(‘era’는 ERA, Enter로 바로 열린다),
 * 그다음 별칭이 똑같은 것, 이름이 검색어로 시작하는 것, 이름에 들어 있는 것, 요약에만 있는 것 순이다.
 * 같으면 레벨 순, 들어온 순서대로 둔다.
 */
export function search(entries: SearchEntry[], { q, level, cat }: SearchQuery): SearchEntry[] {
  const inFilter = (e: SearchEntry) => (!level || e.level === level) && (cat === ALL_CATS || e.cats.includes(cat));
  const run = (nq: string) =>
    entries
      .map((e, i) => ({ e, i, r: rank(e, nq) }))
      .filter(({ e, r }) => inFilter(e) && r < 6)
      .sort((a, b) => a.r - b.r || a.e.level - b.e.level || a.i - b.i);
  let nq = norm(q);
  let found = run(nq);
  // ‘K-’처럼 치는 중이면 끝의 -를 떼고 다시 찾는다.
  if (!found.length && nq.endsWith('-')) found = run((nq = nq.slice(0, -1)));
  if (nq.length < 3 || found.some(({ r }) => r < 4)) return found.map(({ e }) => e);
  // 이름의 낱말에 검색어가 없으면 오타일 수 있다. 이름이 한두 글자만 다른 용어를 가까운 순으로 앞에 두고
  // (‘sierra’ → SIERA, ‘babpi’ → BABIP), 낱말 사이에 걸쳐서만 맞거나(‘chase rate’의 ‘sera’) 요약에만 맞은 용어는 그 뒤에 둔다.
  // 한 낱말 안에 든 것(‘bip’ → BABIP, ‘oba’ → wOBA)은 오타 후보보다 앞이다.
  const max = nq.length < 6 ? 1 : 2;
  const near = entries
    .map((e, i) => ({ e, i, d: Math.min(...allNames(e).map((n) => distance(n, nq, max))) }))
    .filter(({ e, d }) => inFilter(e) && d <= max)
    .sort((a, b) => a.d - b.d || a.e.level - b.e.level || a.i - b.i)
    .map(({ e }) => e);
  const seen = new Set(near.map((e) => e.id));
  return [...near, ...found.map(({ e }) => e).filter((e) => !seen.has(e.id))];
}

/**
 * 두 낱말의 편집 거리(글자를 넣고, 빼고, 바꾸고, 이웃한 두 글자를 맞바꾸는 횟수). ‘babpi’와 ‘babip’는 1이다.
 * max를 넘으면 더 세지 않고 max + 1을 준다.
 */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let before: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, before[j - 2] + 1);
      cur[j] = v;
    }
    // 맞바꾸기는 두 줄 앞을 보므로, 두 줄이 모두 max를 넘어야 멈춘다.
    if (Math.min(...cur) > max && Math.min(...prev) > max) return max + 1;
    before = prev;
    prev = cur;
  }
  return prev[b.length];
}
