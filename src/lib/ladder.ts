import type { Ladder } from './schema.ts';

export interface LadderPlace {
  ladder: Ladder;
  /** 1부터 센 위치 */
  pos: number;
  total: number;
}

/** 용어가 들어 있는 사다리마다, 몇 번째 칸인지 돌려준다. */
export function ladderPlaces(ladders: Ladder[], id: string): LadderPlace[] {
  return ladders.flatMap((ladder) => {
    const i = ladder.steps.indexOf(id);
    if (i === -1) return [];
    return [{ ladder, pos: i + 1, total: ladder.steps.length }];
  });
}
