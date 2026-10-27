import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makePaths } from '../src/lib/make-paths.ts';

test('웹 빌드는 깔끔한 주소를 쓴다', () => {
  const p = makePaths('/', false);
  assert.equal(p.homeHref, '/');
  assert.equal(p.termHref('fip'), '/terms/fip/');
  assert.equal(p.laddersHref, '/ladders/');
  assert.equal(p.termsHref, '/terms/');
});

test('앱 빌드는 index.html까지 적는다 (Capacitor는 확장자 없는 주소를 모두 홈으로 보낸다)', () => {
  const p = makePaths('/', true);
  assert.equal(p.homeHref, '/index.html');
  assert.equal(p.termHref('fip'), '/terms/fip/index.html');
  assert.equal(p.laddersHref, '/ladders/index.html');
  assert.equal(p.termsHref, '/terms/index.html');
});

test('base 끝의 / 유무와 상관없이 같은 주소를 만든다', () => {
  assert.equal(makePaths('/handbook', false).termHref('ops'), '/handbook/terms/ops/');
  assert.equal(makePaths('/handbook/', true).homeHref, '/handbook/index.html');
});
