import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladderPlaces } from '../src/lib/ladder.ts';

const ladders = [
  { name: '타격 생산', hint: '', steps: ['avg', 'ops', 'woba', 'wrc-plus'] },
  { name: '전체 가치', hint: '', steps: ['wrc-plus', 'war'] },
  { name: '투수 평가', hint: '', steps: ['era', 'fip'] },
];

test('용어가 들어 있는 사다리마다 위치와 앞뒤 칸을 준다', () => {
  const places = ladderPlaces(ladders, 'wrc-plus');
  assert.deepEqual(
    places.map(({ ladder, pos, total, prev, next }) => ({ name: ladder.name, pos, total, prev, next })),
    [
      { name: '타격 생산', pos: 4, total: 4, prev: 'woba', next: undefined },
      { name: '전체 가치', pos: 1, total: 2, prev: undefined, next: 'war' },
    ],
  );
});

test('어느 사다리에도 없으면 빈 목록이다', () => {
  assert.deepEqual(ladderPlaces(ladders, 'oaa'), []);
});
