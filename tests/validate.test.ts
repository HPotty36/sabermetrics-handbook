import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scaleIssues, validateHandbook } from '../src/lib/validate.ts';

const handbook = () => ({
  terms: [
    { id: 'ops', related: ['woba'] },
    { id: 'woba', related: ['ops'] },
  ],
  stubs: [{ id: 'avg' }],
  ladders: [{ name: '타격 생산', steps: ['avg', 'ops', 'woba'] }],
});

test('문제없는 핸드북은 통과한다', () => {
  assert.deepEqual(validateHandbook(handbook()), []);
});

test('related가 없는 용어를 가리키면 잡는다', () => {
  const h = handbook();
  h.terms[0].related = ['woba', 'nope'];
  const problems = validateHandbook(h);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /terms\/ops\.json/);
  assert.match(problems[0], /"nope"/);
});

test('related가 준비 중 용어를 가리키면 잡는다', () => {
  const h = handbook();
  h.terms[0].related = ['avg'];
  const problems = validateHandbook(h);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /"avg"/);
  assert.match(problems[0], /준비 중/);
});

test('related의 자기 참조와 중복을 잡는다', () => {
  const h = handbook();
  h.terms[0].related = ['ops', 'woba', 'woba'];
  assert.equal(validateHandbook(h).length, 2);
});

test('사다리 단계가 없는 id를 가리키면 잡는다', () => {
  const h = handbook();
  h.ladders[0].steps = ['avg', 'ops', 'wobaa'];
  const problems = validateHandbook(h);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /ladders\.json/);
  assert.match(problems[0], /타격 생산/);
  assert.match(problems[0], /"wobaa"/);
});

test('사다리 안의 중복 단계를 잡는다', () => {
  const h = handbook();
  h.ladders[0].steps = ['avg', 'ops', 'ops'];
  assert.equal(validateHandbook(h).length, 1);
});

test('작성한 용어가 stubs에 남아 있으면 잡는다', () => {
  const h = handbook();
  h.stubs.push({ id: 'ops' });
  const problems = validateHandbook(h);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /stubs/);
});

test('stubs의 중복 id를 잡는다', () => {
  const h = handbook();
  h.stubs.push({ id: 'avg' });
  const problems = validateHandbook(h);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /stubs\.json/);
});

test('어느 사다리에도 없는 준비 중 용어를 잡는다', () => {
  const h = handbook();
  h.stubs.push({ id: 'era' });
  const problems = validateHandbook(h);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /era/);
});

test('kebab-case가 아닌 파일 이름(id)을 잡는다', () => {
  const h = handbook();
  h.terms.push({ id: 'Stuff_Plus', related: ['ops'] });
  assert.equal(validateHandbook(h).length, 1);
});

const scale = () => ({
  min: 0.27,
  max: 0.42,
  avg: { v: 0.316 },
  marks: [{ v: 0.29 }, { v: 0.34 }, { v: 0.37 }, { v: 0.4 }],
  band: [0.3, 0.35] as [number, number],
});

test('범위 안의 눈금은 통과한다', () => {
  assert.deepEqual(scaleIssues(scale()), []);
});

test('범위 밖의 눈금을 잡는다', () => {
  const s = scale();
  s.marks[3].v = 0.43;
  const issues = scaleIssues(s);
  assert.equal(issues.length, 1);
  assert.deepEqual(issues[0].path, ['marks', 3, 'v']);
});

test('범위 밖의 평균을 잡는다', () => {
  const s = scale();
  s.avg.v = 0.2;
  const issues = scaleIssues(s);
  assert.equal(issues.length, 1);
  assert.deepEqual(issues[0].path, ['avg', 'v']);
});

test('범위를 벗어나거나 뒤집힌 band를 잡는다', () => {
  const out = scale();
  out.band = [0.3, 0.5];
  assert.equal(scaleIssues(out).length, 1);
  const flipped = scale();
  flipped.band = [0.35, 0.3];
  assert.equal(scaleIssues(flipped).length, 1);
});

test('min이 max보다 크거나 같으면 잡는다', () => {
  const s = scale();
  s.max = s.min;
  assert.equal(scaleIssues(s).length, 1);
});

test('범위의 10%보다 가까운 눈금을 잡는다', () => {
  const s = scale();
  s.marks = [{ v: 0.29 }, { v: 0.3 }, { v: 0.4 }];
  const issues = scaleIssues(s);
  assert.equal(issues.length, 1);
  assert.deepEqual(issues[0].path, ['marks', 1, 'v']);
});

test('정확히 10% 간격은 통과한다 (부동소수점 오차 포함)', () => {
  assert.deepEqual(scaleIssues({ min: 0.55, max: 1.05, marks: [{ v: 0.6 }, { v: 0.65 }, { v: 0.7 }] }), []);
});
