// 콘텐츠를 읽어 페이지에서 쓰기 좋은 모양으로 묶는다. 스키마나 파일 사이의 참조에 문제가 있으면 여기서 빌드를 멈춘다.
import { getCollection } from 'astro:content';
import laddersJson from '../content/ladders.json';
import stubsJson from '../content/stubs.json';
import { laddersSchema, stubsSchema, type Ladder, type Stub, type Term } from './schema.ts';
import { formatIssues, validateHandbook } from './validate.ts';

export type TermEntry = Term & { id: string };

/** 목록에서 이름 옆에 붙이는 풀이. 이름이 이미 한국어 이름이면(타율, 블라스트) 붙이지 않는다. 영문은 용어 페이지에만 쓴다. */
export const gloss = (t: Pick<Term, 'chip' | 'ko'>) => (t.ko.startsWith(t.chip) ? '' : t.ko);

/** 용어 페이지 제목 아래에 적는 다른 이름들. 한국어 이름, 약어, 영문 이름 중 제목(chip)과 겹치지 않는 것. */
export const otherNames = (t: Pick<Term, 'chip' | 'ko' | 'abbr' | 'en'>) =>
  [...new Set([t.ko, t.abbr, t.en])].filter((n) => n !== t.chip);

export interface Handbook {
  /** 레벨 순, 같은 레벨 안에서는 order 순 */
  terms: TermEntry[];
  stubs: Stub[];
  /** ladders.json에 적힌 순서 */
  ladders: Ladder[];
  termMap: Map<string, TermEntry>;
  stubMap: Map<string, Stub>;
}

let cached: Promise<Handbook> | undefined;

export function loadHandbook(): Promise<Handbook> {
  // 개발 서버에서는 콘텐츠를 고치면 바로 반영되도록 매번 새로 읽는다.
  if (import.meta.env.DEV) return build();
  return (cached ??= build());
}

function fail(problems: string[]): never {
  throw new Error(`콘텐츠 검사에서 문제 ${problems.length}개를 찾았다.\n${problems.map((p) => `  - ${p}`).join('\n')}`);
}

async function build(): Promise<Handbook> {
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

  const problems = validateHandbook({ terms, stubs, ladders });
  if (problems.length) fail(problems);

  return {
    terms,
    stubs,
    ladders,
    termMap: new Map(terms.map((t) => [t.id, t])),
    stubMap: new Map(stubs.map((s) => [s.id, s])),
  };
}
