import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_CATS, norm, search, toSearchEntry } from '../src/lib/search.ts';

const entries = [
  { id: 'ops', abbr: 'OPS', chip: 'OPS', ko: '출루율 + 장타율', en: 'On-base Plus Slugging', aliases: ['오피에스'], level: 1, cats: ['타격'], summary: '출루율과 장타율을 더한 값.' },
  { id: 'fip', abbr: 'FIP', chip: 'FIP', ko: '수비 무관 평균자책점', en: 'Fielding Independent Pitching', level: 2, cats: ['투구'], summary: '투수가 혼자 결정하는 결과만으로 계산한 지표.' },
  { id: 'oaa', abbr: 'OAA', chip: 'OAA', ko: '평균 대비 아웃 기여', en: 'Outs Above Average', level: 2, cats: ['수비', '트래킹'], summary: '평균적인 수비수와 비교해 아웃을 몇 개 더 잡았는지 센 값.' },
  { id: 'wrc-plus', abbr: 'wRC+', chip: 'wRC+', ko: '조정 득점 창출력', en: 'Weighted Runs Created Plus', level: 2, cats: ['타격'], summary: '리그 평균을 100으로 맞춘 지표.' },
].map((t) => toSearchEntry(t, `/terms/${t.id}/`));

const ids = (q: string, level = 0, cat = ALL_CATS) => search(entries, { q, level, cat }).map((e) => e.id);

test('norm은 대소문자, 공백, 기호를 무시한다', () => {
  assert.equal(norm('wRC+'), 'wrc');
  assert.equal(norm('수비 무관'), '수비무관');
  assert.equal(norm('C+SwStr%'), 'cswstr');
});

test('검색어가 없으면 들어온 순서를 그대로 둔다', () => {
  assert.deepEqual(ids(''), ['ops', 'fip', 'oaa', 'wrc-plus']);
});

test('약어, 한글, 영문, 별칭으로 찾는다', () => {
  assert.deepEqual(ids('fip'), ['fip']);
  assert.deepEqual(ids('수비 무관'), ['fip']);
  assert.deepEqual(ids('fielding'), ['fip']);
  assert.deepEqual(ids('오피에스'), ['ops']);
  assert.deepEqual(ids('WRC+'), ['wrc-plus']);
});

test('이름이 맞는 용어를 요약만 맞는 용어보다 앞에 둔다', () => {
  // '수비'는 FIP의 한글 이름과 OAA의 요약에 들어 있다.
  assert.deepEqual(ids('수비'), ['fip', 'oaa']);
  // '평균'은 FIP·OAA의 한글 이름과 wRC+의 요약에 들어 있다.
  assert.deepEqual(ids('평균'), ['fip', 'oaa', 'wrc-plus']);
});

test('레벨과 분야로 거른다', () => {
  assert.deepEqual(ids('', 2), ['fip', 'oaa', 'wrc-plus']);
  assert.deepEqual(ids('', 0, '타격'), ['ops', 'wrc-plus']);
  assert.deepEqual(ids('', 1, '수비'), []);
});
