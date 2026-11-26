import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
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
  assert.equal(norm('ERA-'), 'era-');
  assert.equal(norm('a|b'), 'ab');
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
  assert.deepEqual(ids('fpi'), ['fip']); // 이웃한 두 글자가 바뀐 오타
  assert.deepEqual(ids('fipp'), ['fip']);
  assert.deepEqual(ids('feilding'), []);
  assert.deepEqual(ids('오피애스'), ['ops']);
  assert.deepEqual(ids('zz'), []);
});

test('이름이 안 맞고 요약에만 맞으면 오타 후보를 앞에 둔다', () => {
  const more = [
    { id: 'fip', searchNames: ['FIP'], level: 2, cats: ['투구'], summary: 'Not the same thing as sera.' },
    { id: 'siera', searchNames: ['SIERA'], level: 3, cats: ['투구'], summary: '타구 유형까지 넣은 추정.' },
  ].map((t) => toSearchEntry(t, `/terms/${t.id}/`));
  assert.deepEqual(search(more, { q: 'sera', level: 0, cat: ALL_CATS }).map((e) => e.id), ['siera', 'fip']);
  // 다른 이름 가운데에 들어 있어도(chase rate) 오타 후보가 먼저다.
  const chase = toSearchEntry({ id: 'chase', searchNames: ['Chase%'], searchAliases: ['chase rate'], level: 2, cats: ['타격'], summary: '' }, '/terms/chase/');
  assert.equal(search([chase, ...more], { q: 'sera', level: 0, cat: ALL_CATS })[0].id, 'siera');
});

test('한 낱말 안에 든 검색어는 오타 후보보다 앞이다', () => {
  const more = [
    { id: 'fip', searchNames: ['FIP'], level: 2, cats: ['투구'], summary: '' },
    { id: 'babip', searchNames: ['BABIP'], level: 1, cats: ['타격'], summary: '' },
    { id: 'obp', searchNames: ['OBP'], level: 1, cats: ['타격'], summary: '' },
    { id: 'woba', searchNames: ['wOBA'], level: 2, cats: ['타격'], summary: '' },
  ].map((t) => toSearchEntry(t, `/terms/${t.id}/`));
  const first = (q: string) => search(more, { q, level: 0, cat: ALL_CATS })[0]?.id;
  assert.equal(first('bip'), 'babip');
  assert.equal(first('oba'), 'woba');
});

test('정식 이름이 같은 용어를 별칭이 같은 용어보다 앞에 둔다', () => {
  const more = [
    { id: 'baserunning', searchNames: ['Baserunning Run Value'], searchAliases: ['baserunning'], level: 2, cats: ['종합'], summary: '' },
    { id: 'bsr', searchNames: ['BsR', 'Base Running'], level: 3, cats: ['종합'], summary: '' },
    { id: 'era', searchNames: ['ERA'], level: 1, cats: ['투구'], summary: '' },
    { id: 'era-plus', searchNames: ['ERA+'], searchAliases: ['ERA-'], level: 2, cats: ['투구'], summary: '' },
    { id: 'k-bb', searchNames: ['K-BB%'], level: 2, cats: ['투구'], summary: '' },
  ].map((t) => toSearchEntry(t, `/terms/${t.id}/`));
  const first = (q: string) => search(more, { q, level: 0, cat: ALL_CATS })[0]?.id;
  assert.equal(first('Base Running'), 'bsr');
  assert.equal(first('ERA-'), 'era-plus');
  assert.equal(first('K-'), 'k-bb'); // 치는 중
});

test('실제 용어 64개가 제 정식 이름으로 찾으면 맨 앞에 온다', () => {
  const dir = new URL('../src/content/', import.meta.url);
  const read = (f: URL) => JSON.parse(readFileSync(f, 'utf8'));
  const terms = readdirSync(new URL('terms/', dir)).filter((f) => f.endsWith('.json')).map((f) => {
    const ko = read(new URL(`terms/${f}`, dir));
    const en = read(new URL(`en/terms/${f}`, dir));
    return { id: f.replace('.json', ''), ko, en };
  });
  const all = terms.map(({ id, ko, en }) =>
    toSearchEntry(
      { id, searchNames: [ko.abbr, ko.chip, ko.ko, en.name], searchAliases: [...(ko.aliases ?? []), ...(en.aliases ?? [])], level: ko.level, cats: ko.cats, summary: ko.summary },
      `/terms/${id}/`,
    ),
  );
  const wrong = terms.flatMap(({ id, ko, en }) =>
    [ko.abbr, ko.chip, ko.ko, en.name]
      .filter((q) => search(all, { q, level: 0, cat: ALL_CATS })[0]?.id !== id)
      .map((q) => `${id}: ‘${q}’ → ${search(all, { q, level: 0, cat: ALL_CATS })[0]?.id}`),
  );
  assert.deepEqual(wrong, []);
});
