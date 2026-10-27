/** 이름과 단계만 있으면 된다(언어별로 옮긴 주제도 받는다). */
interface LadderLike {
  name: string;
  steps: string[];
}

export interface LadderPlace<L extends LadderLike = LadderLike> {
  ladder: L;
  /** 1부터 센 위치 */
  pos: number;
  total: number;
}

/** 용어가 들어 있는 사다리마다, 몇 번째 칸인지 돌려준다. */
export function ladderPlaces<L extends LadderLike>(ladders: L[], id: string): LadderPlace<L>[] {
  return ladders.flatMap((ladder) => {
    const i = ladder.steps.indexOf(id);
    if (i === -1) return [];
    return [{ ladder, pos: i + 1, total: ladder.steps.length }];
  });
}
