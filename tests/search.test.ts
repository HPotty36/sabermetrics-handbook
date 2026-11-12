import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_CATS, norm, search, toSearchEntry } from '../src/lib/search.ts';

const entries = [
  { id: 'ops', searchNames: ['OPS', '출루율 + 장타율', 'On-base Plus Slugging', '오피에스'], level: 1, cats: ['타격'], summary: '출루율과 장타율을 더한 값.' },
  { id: 'fip', searchNames: ['FIP', '수비 무관 평균자책점', 'Fielding Independent Pitching'], level: 2, cats: ['투구'], summary: '투수가 혼자 결정하는 결과만으로 계산한 지표.' },
  { id: 'oaa', searchNames: ['OAA', '평균 대비 아웃 기여', 'Outs Above Average'], level: 2, cats: ['수비', '트래킹'], summary: '평균적인 수비수와 비교해 아웃을 몇 개 더 잡았는지 센 값.' },
  { id: 'wrc-plus', searchNames: ['wRC+', '조정 득점 창출력', 'Weighted Runs Created Plus'], level: 2, cats: ['타격'], summary: '리그 평균을 100으로 맞춘 지표.' },
].map((t) => toSearchEntry(t, `/terms/${t.id}/`));

const ids = (q: string, level = 0, cat = ALL_CATS) => search(entries, { q, level, cat }).map((e) => e.id);

test('norm은 대소문자, 공백, 구두점을 무시하고 %와 +는 남긴다', () => {
  assert.equal(norm('wRC+'), 'wrc+');
  assert.equal(norm('수비 무관'), '수비무관');
  assert.equal(norm('C+SwStr%'), 'c+swstr%');
  assert.equal(norm('K-BB%'), 'kbb%');
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
  // '평균'은 OAA의 한글 이름 맨 앞, FIP의 한글 이름 가운데, wRC+의 요약에 들어 있다.
  assert.deepEqual(ids('평균'), ['oaa', 'fip', 'wrc-plus']);
});

test('레벨과 분야로 거른다', () => {
  assert.deepEqual(ids('', 2), ['fip', 'oaa', 'wrc-plus']);
  assert.deepEqual(ids('', 0, '타격'), ['ops', 'wrc-plus']);
  assert.deepEqual(ids('', 1, '수비'), []);
});

test('이름이 검색어와 똑같은 용어가 맨 앞에 온다', () => {
  const more = [
    { id: 'avg', searchNames: ['AVG', '타율', 'Batting Average'], level: 1, cats: ['타격'], summary: '안타 ÷ 타수.' },
    { id: 'era', searchNames: ['ERA', '평균자책점', 'Earned Run Average'], level: 1, cats: ['투구'], summary: '9이닝당 자책점.' },
    { id: 'era-plus', searchNames: ['ERA+', '조정 평균자책점'], level: 2, cats: ['투구'], summary: '리그 평균을 100으로 맞춘 평균자책점.' },
    { id: 'babip', searchNames: ['BABIP', '인플레이 타구 타율'], level: 1, cats: ['타격'], summary: '인플레이 타구가 안타가 된 비율.' },
  ].map((t) => toSearchEntry(t, `/terms/${t.id}/`));
  const first = (q: string) => search(more, { q, level: 0, cat: ALL_CATS }).map((e) => e.id);
  // 'era'는 AVG의 영어 이름(av-era-ge)에도 들어 있지만 ERA가 먼저다.
  assert.deepEqual(first('era'), ['era', 'era-plus', 'avg']);
  assert.equal(first('ERA+')[0], 'era-plus');
  assert.deepEqual(first('타율'), ['avg', 'babip']);
  assert.equal(first('wrc').length, 0);
  assert.equal(ids('wrc')[0], 'wrc-plus');
});

test('맞는 게 없으면 이름이 한두 글자 다른 용어를 준다', () => {
  assert.deepEqual(ids('fpi'), []);
  assert.deepEqual(ids('fipp'), ['fip']);
  assert.deepEqual(ids('feilding'), []);
  assert.deepEqual(ids('오피애스'), ['ops']);
  assert.deepEqual(ids('zz'), []);
});
