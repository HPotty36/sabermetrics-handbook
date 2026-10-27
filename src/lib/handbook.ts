// 콘텐츠를 읽어 페이지에서 쓰기 좋은 모양으로 묶는다. 스키마나 파일 사이의 참조에 문제가 있으면 여기서 빌드를 멈춘다.
// 페이지는 언어를 골라 부른다. 숫자와 순서는 언어와 상관없이 같고, 글과 이름만 그 언어의 것으로 바꿔 준다.
import { getCollection } from 'astro:content';
import laddersJson from '../content/ladders.json';
import stubsJson from '../content/stubs.json';
import type { Lang } from './i18n.ts';
import { laddersSchema, stubsSchema, type Ladder, type Scale, type Stub, type Term, type TermEn } from './schema.ts';
import { formatIssues, validateEnglish, validateHandbook } from './validate.ts';

/** 한 언어로 옮긴 용어. 화면은 이것만 쓴다. */
export interface LocalTerm {
  id: string;
  level: Term['level'];
  order: number;
  cats: Term['cats'];
  added?: number;
  related: string[];
  /** 목록(주제의 역, 용어 목록, 검색 결과, 관련 용어, ‘다음’)에 쓰는 이름 */
  chip: string;
  /** 목록에서 이름 옆에 작게 붙이는 풀이. 이름과 같으면 빈 문자열 */
  sub: string;
  /** 용어 페이지의 큰 표제어 */
  headword: string;
  /** 표제어 아래 줄의 이름(크게). 표제어와 같으면 빈 문자열 */
  nameMain: string;
  /** 같은 줄에 작게 붙이는 다른 이름(한국어 화면의 약어 AVG, FPCT). 없으면 빈 문자열 */
  nameAlt: string;
  /** 문서 제목(<title>)에 쓰는 이름 */
  title: string;
  /** 검색에 쓰는 이름. 두 언어의 이름과 별칭을 모두 넣는다(어느 쪽 화면에서든 ‘ERA’, ‘평균자책점’, ‘earned run’으로 찾는다). */
  searchNames: string[];
  summary: string;
  easy: string[];
  scale?: Scale;
  formula?: Term['formula'];
  deep: string[];
  myth?: Term['myth'];
  leagues?: Term['leagues'];
  sources: Term['sources'];
}

export interface LocalStub {
  id: string;
  chip: string;
  added?: number;
}

export interface LocalLadder {
  name: string;
  /** 왼쪽이 기본, 오른쪽이 심화 */
  steps: string[];
}

export interface Handbook {
  lang: Lang;
  /** 레벨 순, 같은 레벨 안에서는 order 순 */
  terms: LocalTerm[];
  stubs: LocalStub[];
  /** ladders.json에 적힌 순서 */
  ladders: LocalLadder[];
  termMap: Map<string, LocalTerm>;
  stubMap: Map<string, LocalStub>;
}

type TermEntry = Term & { id: string };

interface Raw {
  terms: TermEntry[];
  en: Map<string, TermEn>;
  stubs: Stub[];
  ladders: Ladder[];
}

/** 표제어가 약어(ERA, AVG, FPCT, HardHit%)인지. 낱말(Velocity, Barrel)이나 띄어 쓴 이름은 약어가 아니다. */
export const isAcronym = (s: string) => /^[A-Za-z]+[%+]?$/.test(s) && (s.match(/[A-Z]/g)?.length ?? 0) >= 2;

/** 한국어 이름에서 칩과 겹치는 앞부분을 뺀다. ‘어택 앵글 (배트 진입각)’ → ‘배트 진입각’, ‘타율’(칩도 타율) → ‘’ */
export const koRest = (chip: string, ko: string) =>
  ko.startsWith(chip) ? ko.slice(chip.length).trim().replace(/^\((.*)\)$/, '$1').trim() : ko;

function localizeKo(t: TermEntry, en: TermEn): LocalTerm {
  const rest = koRest(t.chip, t.ko);
  // 한국어 화면에서는 팬이 실제로 부르는 이름(chip)이 표제어다. 영어 정식 이름은 영어 화면에만 쓴다.
  // 약어(AVG, FPCT)는 기록표에서 보는 이름이라 표제어 아래에 작게 남긴다.
  const abbr = t.abbr !== t.chip && isAcronym(t.abbr) ? t.abbr : '';
  return {
    ...shared(t, en),
    chip: t.chip,
    sub: rest,
    headword: t.chip,
    nameMain: rest,
    nameAlt: abbr,
    title: [t.chip, rest].filter(Boolean).join(' · '),
    summary: t.summary,
    easy: t.easy,
    scale: t.scale,
    formula: t.formula,
    deep: t.deep,
    myth: t.myth,
    leagues: t.leagues,
    sources: t.sources,
  };
}

function localizeEn(t: TermEntry, en: TermEn): LocalTerm {
  const sub = en.name !== t.abbr ? en.name : '';
  const marks = new Map(en.scale?.marks.map((m) => [m.v, m.t]));
  return {
    ...shared(t, en),
    chip: t.abbr,
    sub,
    headword: t.abbr,
    nameMain: sub,
    nameAlt: '',
    title: [t.abbr, sub].filter(Boolean).join(' · '),
    summary: en.summary,
    easy: en.easy,
    // 숫자는 한국어 파일의 것을 쓰고 글만 바꾼다. 짝이 맞는지는 validateEnglish가 미리 본다.
    scale: t.scale && {
      ...t.scale,
      avg: t.scale.avg && { v: t.scale.avg.v, t: en.scale?.avg ?? '' },
      marks: t.scale.marks.map((m) => ({ v: m.v, t: marks.get(m.v) ?? '' })),
      note: en.scale?.note,
    },
    formula: en.formula,
    deep: en.deep,
    myth: en.myth,
    leagues: en.leagues,
    sources: en.sources,
  };
}

function shared(t: TermEntry, en: TermEn) {
  return {
    id: t.id,
    level: t.level,
    order: t.order,
    cats: t.cats,
    added: t.added,
    related: t.related,
    searchNames: [t.abbr, t.chip, t.ko, en.name, ...(t.aliases ?? []), ...(en.aliases ?? [])],
  };
}

let raw: Promise<Raw> | undefined;
const localized = new Map<Lang, Promise<Handbook>>();

export function loadHandbook(lang: Lang): Promise<Handbook> {
  // 개발 서버에서는 콘텐츠를 고치면 바로 반영되도록 매번 새로 읽는다.
  if (import.meta.env.DEV) return readRaw().then((r) => localize(r, lang));
  let h = localized.get(lang);
  if (!h) localized.set(lang, (h = (raw ??= readRaw()).then((r) => localize(r, lang))));
  return h;
}

function localize(r: Raw, lang: Lang): Handbook {
  const terms = r.terms.map((t) => (lang === 'ko' ? localizeKo : localizeEn)(t, r.en.get(t.id)!));
  const stubs = r.stubs.map((s) => ({ id: s.id, chip: lang === 'ko' ? s.chip : s.en, added: s.added }));
  return {
    lang,
    terms,
    stubs,
    ladders: r.ladders.map((l) => ({ name: lang === 'ko' ? l.name : l.en, steps: l.steps })),
    termMap: new Map(terms.map((t) => [t.id, t])),
    stubMap: new Map(stubs.map((s) => [s.id, s])),
  };
}

function fail(problems: string[]): never {
  throw new Error(`콘텐츠 검사에서 문제 ${problems.length}개를 찾았다.\n${problems.map((p) => `  - ${p}`).join('\n')}`);
}

async function readRaw(): Promise<Raw> {
  const stubsResult = stubsSchema.safeParse(stubsJson);
  const laddersResult = laddersSchema.safeParse(laddersJson);
  if (!stubsResult.success || !laddersResult.success) {
    fail([
      ...(stubsResult.error ? formatIssues('stubs.json', stubsResult.error.issues) : []),
      ...(laddersResult.error ? formatIssues('ladders.json', laddersResult.error.issues) : []),
    ]);
  }
  const stubs = stubsResult.data;
  const ladders = laddersResult.data;

  // getCollection의 순서는 보장되지 않으므로 직접 정렬한다.
  const terms = (await getCollection('terms'))
    .map((e) => ({ id: e.id, ...e.data }))
    .sort((a, b) => a.level - b.level || a.order - b.order || a.id.localeCompare(b.id));
  const en = (await getCollection('termsEn')).map((e) => ({ id: e.id, ...e.data }));

  const problems = [
    ...validateHandbook({ terms, stubs, ladders }),
    ...validateEnglish(terms, en),
    ...ladders.flatMap((l) => (/[가-힣]/.test(l.en) ? [`ladders.json › ${l.name} › en: 영어 이름에 한글이 있다`] : [])),
    ...stubs.flatMap((s) => (/[가-힣]/.test(s.en) ? [`stubs.json › ${s.id} › en: 영어 이름에 한글이 있다`] : [])),
  ];
  if (problems.length) fail(problems);

  return { terms, en: new Map(en.map(({ id, ...e }) => [id, e])), stubs, ladders };
}
