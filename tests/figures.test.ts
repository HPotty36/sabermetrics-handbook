// 용어 그림(src/components/fig): 용어마다 하나씩 있는지, 그림들이 함께 쓰는 가상의 예가 맞게 더해지는지.
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { test } from 'node:test';
import { gameTotals, isSwing, PA_LOG, paTotals, PITCH_LOG, pitchHeight, plateAngle } from '../src/lib/fig.ts';

const ids = (dir: string, ext: string) =>
  readdirSync(new URL(dir, import.meta.url))
    .filter((f) => f.endsWith(ext))
    .map((f) => f.slice(0, -ext.length))
    .sort();

test('용어마다 그림이 하나씩 있다', () => {
  assert.deepEqual(ids('../src/components/fig/terms/', '.astro'), ids('../src/content/terms/', '.json'));
});

test('가상의 12타석', () => {
  assert.equal(PA_LOG.length, 12);
  assert.deepEqual(paTotals(), { PA: 12, AB: 9, H: 3, HR: 1, BB: 1, HBP: 1, SF: 1, K: 2, TB: 7 });
});

test('가상의 투구 16개', () => {
  assert.equal(PITCH_LOG.length, 16);
  assert.equal(PITCH_LOG.filter((k) => k === 'CS' || k === 'W').length, 4);
  assert.equal(PITCH_LOG.filter(isSwing).length, 7);
});

test('가상의 선발 투수 한 경기', () => {
  assert.deepEqual(gameTotals(), { IP: 6, H: 5, HR: 1, BB: 2, HBP: 1, K: 6, FB: 7, ER: 2, UR: 1 });
});

test('옆에서 본 포심: 홈에서 2.5피트, 중력만이면 16인치 아래, 들어오는 각도 약 −5°', () => {
  assert.ok(Math.abs(pitchHeight(60.5) - 2.5) < 0.01);
  assert.ok(Math.abs((pitchHeight(60.5) - pitchHeight(60.5, true)) * 12 - 16) < 0.1);
  assert.ok(Math.abs(plateAngle() + 5) < 0.2);
});
