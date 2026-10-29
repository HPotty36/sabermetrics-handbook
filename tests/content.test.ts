// 실제 콘텐츠 파일이 스키마와 참조 검사를 통과하는지 본다. `astro build`가 하는 검사를 빌드 없이 빠르게 돌린다.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { laddersSchema, stubsSchema, termEnSchema, termSchema } from '../src/lib/schema.ts';
import { validateEnglish, validateHandbook } from '../src/lib/validate.ts';

const dir = new URL('../src/content/', import.meta.url);
const readJson = (path: string | URL) => JSON.parse(readFileSync(path, 'utf8'));

const termFiles = readdirSync(new URL('terms/', dir)).filter((f) => f.endsWith('.json'));
const terms = termFiles.map((f) => ({ id: basename(f, '.json'), raw: readJson(new URL(`terms/${f}`, dir)) }));
const enFiles = readdirSync(new URL('en/terms/', dir)).filter((f) => f.endsWith('.json'));
const enTerms = enFiles.map((f) => ({ id: basename(f, '.json'), raw: readJson(new URL(`en/terms/${f}`, dir)) }));
const stubs = readJson(new URL('stubs.json', dir));
const ladders = readJson(new URL('ladders.json', dir));

test('용어 파일이 스키마를 통과한다', () => {
  for (const { id, raw } of terms) {
    const r = termSchema.safeParse(raw);
    assert.ok(r.success, `${id}: ${r.error?.message}`);
  }
});

test('영어 파일이 스키마를 통과하고 한국어 파일과 짝이 맞는다', () => {
  for (const { id, raw } of enTerms) {
    const r = termEnSchema.safeParse(raw);
    assert.ok(r.success, `en/${id}: ${r.error?.message}`);
  }
  const problems = validateEnglish(
    terms.map(({ id, raw }) => ({ id, ...raw })),
    enTerms.map(({ id, raw }) => ({ id, ...raw })),
  );
  assert.deepEqual(problems, []);
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

test('마지막 확인 날짜는 첫 기록(2026-10-15)과 오늘 사이이고, docs/verified-facts.md에 그날의 기록이 있다', () => {
  const facts = readFileSync(new URL('../docs/verified-facts.md', import.meta.url), 'utf8');
  // 한국 시간으로 적은 오늘 날짜가 UTC로는 내일일 수 있어 하루를 더 둔다.
  const latest = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  for (const { id, raw } of terms) {
    assert.ok(raw.checked >= '2026-10-15' && raw.checked <= latest, `${id}: ${raw.checked}`);
    assert.ok(facts.includes(raw.checked), `${id}: verified-facts.md에 ${raw.checked} 기록이 없다`);
  }
});
