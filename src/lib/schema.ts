// 콘텐츠 스키마. 규칙은 docs/content-guide.md를 따른다.
// 용어는 content.config.ts, 목록 파일(stubs, ladders)은 handbook.ts가 이 스키마로 검사하고,
// 파일 사이의 참조와 한국어·영어 짝은 validate.ts가 검사한다.
// 용어 파일(terms/<id>.json)에는 언어와 상관없는 값(레벨, 눈금 숫자, 출처 URL)과 한국어 글이,
// 영어 파일(en/terms/<id>.json)에는 영어 글만 있다.
import { z } from 'astro/zod';
import { ID_PATTERN, scaleIssues } from './validate.ts';

export const CATS = ['타격', '투구', '수비', '종합', '트래킹'] as const;
export const UNITS = ['%', '°', ' in', ' ft', ' ft/s'] as const;

const text = z.string().trim().min(1);
const id = z.string().regex(ID_PATTERN, 'id는 kebab-case로 쓴다');
const year = z.number().int().min(1850).max(2100);
const labeled = z.strictObject({ v: z.number(), t: text });
const formula = z.strictObject({
  expr: text,
  vars: z.array(z.tuple([text, text])).optional(),
});
const myth = z.strictObject({ claim: text, truth: text });
const leagues = z.array(z.strictObject({ lg: text, t: text }));
const sources = z.array(z.strictObject({ t: text, u: z.url({ protocol: /^https?$/ }) })).min(1);

export const scaleSchema = z
  .strictObject({
    min: z.number(),
    max: z.number(),
    dir: z.enum(['high', 'low', 'none']),
    fmt: z.enum(['int', 'dec1', 'dec2', 'dec3']),
    unit: z.enum(UNITS).optional(),
    avg: labeled.optional(),
    marks: z.array(labeled).min(1),
    band: z.tuple([z.number(), z.number()]).optional(),
    note: text.optional(),
  })
  .superRefine((s, ctx) => {
    for (const issue of scaleIssues(s)) ctx.addIssue({ code: 'custom', ...issue });
  });

export const termSchema = z.strictObject({
  abbr: text,
  chip: text,
  ko: text,
  aliases: z.array(text).optional(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  /** 같은 레벨 안에서의 순서. 목록과 홈 입구에 이 순서로 나온다. */
  order: z.number().int(),
  cats: z.array(z.enum(CATS)).min(1),
  added: year.optional(),
  summary: text,
  /** 문단 수는 용어마다 다르게 쓴다(1~3). */
  easy: z.array(text).min(1).max(3),
  scale: scaleSchema.optional(),
  formula: formula.optional(),
  deep: z.array(text).min(1).max(4),
  myth: myth.optional(),
  leagues: leagues.optional(),
  related: z.array(id).min(1),
  sources,
});

/** 영어 글(en/terms/<id>.json). 숫자와 출처 URL은 한국어 파일과 같아야 한다(validate.ts). */
export const termEnSchema = z.strictObject({
  /** 영어 정식 이름. 표제어(abbr)와 같으면 목록에서 따로 적지 않는다. */
  name: text,
  /** 검색에만 쓰는 영어 별칭 */
  aliases: z.array(text).optional(),
  summary: text,
  easy: z.array(text).min(1).max(3),
  /** 눈금의 글만. 숫자(v)는 한국어 파일의 것과 같아야 한다. */
  scale: z
    .strictObject({
      avg: text.optional(),
      marks: z.array(labeled).min(1),
      note: text.optional(),
    })
    .optional(),
  formula: formula.optional(),
  deep: z.array(text).min(1).max(4),
  myth: myth.optional(),
  leagues: leagues.optional(),
  sources,
});

export const stubSchema = z.strictObject({
  id,
  chip: text,
  /** 영어 화면에 쓰는 이름 */
  en: text,
  added: year.optional(),
});

export const ladderSchema = z.strictObject({
  name: text,
  /** 영어 화면의 주제 이름 */
  en: text,
  hint: text,
  /** 왼쪽이 기본, 오른쪽이 심화 */
  steps: z.array(id).min(2),
});

// 준비 중 용어와 사다리는 순서가 있는 목록 파일 하나씩이다. 사다리는 파일에 적힌 순서대로 화면에 나온다.
export const stubsSchema = z.array(stubSchema);
export const laddersSchema = z.array(ladderSchema);

export type Term = z.infer<typeof termSchema>;
export type TermEn = z.infer<typeof termEnSchema>;
export type Scale = z.infer<typeof scaleSchema>;
export type Stub = z.infer<typeof stubSchema>;
export type Ladder = z.infer<typeof ladderSchema>;
