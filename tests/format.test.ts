import { test } from 'node:test';
import assert from 'node:assert/strict';
import { avgCaption, fmt, pos } from '../src/lib/format.ts';

test('dec3은 1 미만이면 앞의 0을 뺀다', () => {
  assert.equal(fmt(0.316, { fmt: 'dec3' }), '.316');
  assert.equal(fmt(0.29, { fmt: 'dec3' }), '.290');
  assert.equal(fmt(1, { fmt: 'dec3' }), '1.000');
});

test('dec1, dec2, int와 단위를 붙인다', () => {
  assert.equal(fmt(3, { fmt: 'dec2' }), '3.00');
  assert.equal(fmt(7.7, { fmt: 'dec1', unit: '%' }), '7.7%');
  assert.equal(fmt(16, { fmt: 'int', unit: ' in' }), '16 in');
});

test('음수는 진짜 마이너스 기호로 쓴다', () => {
  assert.equal(fmt(-4.9, { fmt: 'dec1', unit: '°' }), '−4.9°');
  assert.equal(fmt(-10, { fmt: 'int' }), '−10');
});

test('pos는 막대 위 위치를 백분율 문자열로 준다', () => {
  assert.equal(pos(0.29, { min: 0.24, max: 0.36 }), '41.67');
  assert.equal(pos(-15, { min: -15, max: 20 }), '0.00');
});

test('평균 설명에서 크게 적는 숫자만 뺀다', () => {
  const era = { fmt: 'dec2' as const };
  assert.equal(avgCaption({ v: 4.17, t: '2026 MLB 평균 4.17 (2025년 4.15)' }, era), '2026 MLB 평균 (2025년 4.15)');
  assert.equal(avgCaption({ v: 0.29, t: '2026 MLB 평균 .290' }, { fmt: 'dec3' }), '2026 MLB 평균');
  assert.equal(avgCaption({ v: 7.7, t: '2026 MLB 평균 7.7% (2025년 8.6%)' }, { fmt: 'dec1', unit: '%' }), '2026 MLB 평균 (2025년 8.6%)');
  // 다른 숫자 안의 0은 건드리지 않는다
  assert.equal(avgCaption({ v: 0, t: '평균 0 (정의상)' }, { fmt: 'int' }), '평균 (정의상)');
  assert.equal(avgCaption({ v: 100, t: '리그 평균 100 (정의상)' }, { fmt: 'int' }), '리그 평균 (정의상)');
  // 숫자가 설명에 그대로 없으면(약 16인치) 그대로 둔다
  assert.equal(avgCaption({ v: 16, t: 'MLB 포심 평균 약 16인치' }, { fmt: 'int', unit: ' in' }), 'MLB 포심 평균 약 16인치');
});
