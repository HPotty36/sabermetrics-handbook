// 빌드 때 콘텐츠를 검사하는 순수 함수. Astro에 의존하지 않아 테스트에서 바로 불러 쓴다.

export const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** 눈금 라벨이 겹치지 않도록 둬야 하는 최소 간격 (범위 대비). */
export const MIN_MARK_GAP = 0.1;

export interface Issue {
  path: (string | number)[];
  message: string;
}

export interface ScaleLike {
  min: number;
  max: number;
  marks: { v: number }[];
  avg?: { v: number };
  band?: [number, number];
}

/** `scale` 한 개 안에서 `marks`, `avg`, `band`가 `min`~`max` 안에 있는지 본다. */
export function scaleIssues(s: ScaleLike): Issue[] {
  if (!(s.min < s.max)) {
    return [{ path: ['max'], message: `max(${s.max})가 min(${s.min})보다 커야 한다` }];
  }
  const issues: Issue[] = [];
  const range = `${s.min}~${s.max}`;
  const inRange = (v: number) => v >= s.min && v <= s.max;

  s.marks.forEach((m, i) => {
    if (!inRange(m.v)) issues.push({ path: ['marks', i, 'v'], message: `눈금 ${m.v}: 범위(${range}) 밖이다` });
  });
  if (s.avg && !inRange(s.avg.v)) {
    issues.push({ path: ['avg', 'v'], message: `평균 ${s.avg.v}: 범위(${range}) 밖이다` });
  }
  if (s.band) {
    const [a, b] = s.band;
    if (!(a < b)) issues.push({ path: ['band'], message: `band [${a}, ${b}]: 앞 값이 뒤 값보다 작아야 한다` });
    else if (!inRange(a) || !inRange(b)) issues.push({ path: ['band'], message: `band [${a}, ${b}]: 범위(${range}) 밖이다` });
  }

  const gap = (s.max - s.min) * MIN_MARK_GAP;
  const sorted = s.marks.map((m, i) => ({ v: m.v, i })).sort((x, y) => x.v - y.v);
  for (let k = 1; k < sorted.length; k++) {
    const prev = sorted[k - 1];
    const cur = sorted[k];
    if (cur.v - prev.v + 1e-9 < gap) {
      issues.push({
        path: ['marks', cur.i, 'v'],
        message: `눈금 ${prev.v}와 ${cur.v}: 간격이 범위의 10%(${+gap.toFixed(4)})보다 좁아 라벨이 겹친다`,
      });
    }
  }
  return issues;
}

export interface HandbookRefs {
  terms: { id: string; related: string[] }[];
  stubs: { id: string }[];
  ladders: { name: string; steps: string[] }[];
}

/** 파일 사이의 참조를 검사한다. 문제마다 한 줄씩 돌려준다. */
export function validateHandbook({ terms, stubs, ladders }: HandbookRefs): string[] {
  const problems: string[] = [];
  const termIds = new Set(terms.map((t) => t.id));
  const stubIds = new Set<string>();
  for (const s of stubs) {
    if (stubIds.has(s.id)) problems.push(`stubs.json › ${s.id}: 두 번 들어 있다`);
    stubIds.add(s.id);
  }

  for (const t of terms) {
    const where = `terms/${t.id}.json`;
    if (!ID_PATTERN.test(t.id)) problems.push(`${where}: 파일 이름(id)은 kebab-case로 쓴다`);
    if (stubIds.has(t.id)) problems.push(`${where}: stubs.json에 같은 id가 남아 있다. 작성한 용어는 stubs에서 뺀다`);

    const seen = new Set<string>();
    for (const r of t.related) {
      const problem =
        r === t.id ? '자기 자신이다' :
        seen.has(r) ? '두 번 들어 있다' :
        termIds.has(r) ? null :
        stubIds.has(r) ? '아직 준비 중인 용어다. related에는 작성된 용어만 넣는다' :
        '그런 용어가 없다';
      if (problem) problems.push(`${where} › related "${r}": ${problem}`);
      seen.add(r);
    }
  }

  const laddered = new Set<string>();
  for (const l of ladders) {
    const where = `ladders.json › ${l.name}`;
    const seen = new Set<string>();
    for (const s of l.steps) {
      const problem =
        seen.has(s) ? '두 번 들어 있다' :
        termIds.has(s) || stubIds.has(s) ? null :
        'terms에도 stubs에도 없는 id다';
      if (problem) problems.push(`${where} › steps "${s}": ${problem}`);
      seen.add(s);
      laddered.add(s);
    }
  }

  for (const s of stubIds) {
    if (!laddered.has(s)) problems.push(`stubs.json › ${s}: 어느 사다리에도 없다. 준비 중 용어는 사다리에서만 보인다`);
  }
  return problems;
}

/** 스키마 오류를 `파일 › 경로: 메시지` 줄로 바꾼다. */
export function formatIssues(file: string, issues: { path: PropertyKey[]; message: string }[]): string[] {
  return issues.map((i) => `${file}${i.path.length ? ` › ${i.path.map(String).join('.')}` : ''}: ${i.message}`);
}
