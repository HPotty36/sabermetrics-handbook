// 콘텐츠를 읽어 페이지에서 쓰기 좋은 모양으로 묶는다. 스키마나 파일 사이의 참조에 문제가 있으면 여기서 빌드를 멈춘다.
import { getCollection } from 'astro:content';
import laddersJson from '../content/ladders.json';
import stubsJson from '../content/stubs.json';
import { laddersSchema, stubsSchema, type Ladder, type Stub, type Term } from './schema.ts';
import { formatIssues, validateHandbook } from './validate.ts';

export type TermEntry = Term & { id: string };

/** 목록에서 칩 옆에 붙이는 이름. 한글 이름이 칩과 같거나 칩으로 시작하면(어택 앵글) 영문 이름을 쓴다. */
export const subName = (t: Pick<Term, 'chip' | 'ko' | 'en'>) => (t.ko.startsWith(t.chip) ? t.en : t.ko);

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
