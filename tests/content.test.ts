// 실제 콘텐츠 파일이 스키마와 참조 검사를 통과하는지 본다. `astro build`가 하는 검사를 빌드 없이 빠르게 돌린다.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { laddersSchema, stubsSchema, termSchema } from '../src/lib/schema.ts';
import { validateHandbook } from '../src/lib/validate.ts';

const dir = new URL('../src/content/', import.meta.url);
const readJson = (path: string | URL) => JSON.parse(readFileSync(path, 'utf8'));

const termFiles = readdirSync(new URL('terms/', dir)).filter((f) => f.endsWith('.json'));
const terms = termFiles.map((f) => ({ id: basename(f, '.json'), raw: readJson(new URL(`terms/${f}`, dir)) }));
const stubs = readJson(new URL('stubs.json', dir));
const ladders = readJson(new URL('ladders.json', dir));

test('용어 파일이 스키마를 통과한다', () => {
  for (const { id, raw } of terms) {
    const r = termSchema.safeParse(raw);
    assert.ok(r.success, `${id}: ${r.error?.message}`);
  }
});

test('stubs와 ladders가 스키마를 통과한다', () => {
  const s = stubsSchema.safeParse(stubs);
  assert.ok(s.success, s.error?.message);
  const l = laddersSchema.safeParse(ladders);
  assert.ok(l.success, l.error?.message);
});

test('참조가 모두 이어진다', () => {
  const problems = validateHandbook({
    terms: terms.map(({ id, raw }) => ({ id, related: raw.related })),
    stubs,
    ladders,
  });
  assert.deepEqual(problems, []);
});

test('스키마가 오타 필드와 범위 밖 눈금을 막는다', () => {
  const base = terms.find((t) => t.id === 'woba')!.raw;

  const typo = { ...base, releated: ['ops'] };
  assert.equal(termSchema.safeParse(typo).success, false);

  const outOfRange = structuredClone(base);
  outOfRange.scale.avg.v = 0.5;
  const r = termSchema.safeParse(outOfRange);
  assert.equal(r.success, false);
  assert.deepEqual(r.error!.issues[0].path, ['scale', 'avg', 'v']);
});
