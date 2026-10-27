// 빌드 때 콘텐츠를 검사하는 순수 함수. Astro에 의존하지 않아 테스트에서 바로 불러 쓴다.
import { avgCaption, fmt, type Fmt } from './format.ts';

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

const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힣]/;

/** 영어 글에 한글이 섞였는지 본다(옮기다 남은 문장을 잡는다). 문제가 있는 글의 경로를 돌려준다. */
export function hangulPaths(value: unknown, path: (string | number)[] = []): string[] {
  if (typeof value === 'string') return HANGUL.test(value) ? [path.join('.') || '(값)'] : [];
  if (Array.isArray(value)) return value.flatMap((v, i) => hangulPaths(v, [...path, i]));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([k, v]) => hangulPaths(v, [...path, k]));
  return [];
}

interface KoSide {
  id: string;
  scale?: { fmt: Fmt; unit?: string; avg?: { v: number; t: string }; marks: { v: number }[]; note?: string };
  formula?: unknown;
  myth?: unknown;
  leagues?: unknown[];
  sources: { u: string }[];
}

interface EnSide {
  id: string;
  scale?: { avg?: string; marks: { v: number }[]; note?: string };
  formula?: unknown;
  myth?: unknown;
  leagues?: unknown[];
  sources: { u: string }[];
}

/**
 * 한국어 용어 파일과 영어 파일이 짝이 맞는지 본다.
 * 영어 파일은 글만 옮긴 것이므로 숫자(눈금, 평균), 출처 URL, 있고 없는 부분(눈금, 수식, 오해, 리그)이 같아야 한다.
 */
export function validateEnglish(ko: KoSide[], en: EnSide[]): string[] {
  const problems: string[] = [];
  const enMap = new Map(en.map((e) => [e.id, e]));
  const koIds = new Set(ko.map((t) => t.id));
  for (const e of en) {
    if (!koIds.has(e.id)) problems.push(`en/terms/${e.id}.json: 같은 id의 한국어 파일(terms/${e.id}.json)이 없다`);
  }
  for (const t of ko) {
    const where = `en/terms/${t.id}.json`;
    const e = enMap.get(t.id);
    if (!e) {
      problems.push(`${where}: 영어 파일이 없다. 용어마다 영어 글이 있어야 한다`);
      continue;
    }
    for (const p of hangulPaths(e)) if (p !== 'id') problems.push(`${where} › ${p}: 영어 글에 한글이 있다`);
    for (const k of ['scale', 'formula', 'myth'] as const) {
      if (Boolean(t[k]) !== Boolean(e[k])) problems.push(`${where} › ${k}: 한국어 파일에 ${t[k] ? '있는데 없다' : '없는데 있다'}`);
    }
    if ((t.leagues?.length ?? 0) !== (e.leagues?.length ?? 0)) problems.push(`${where} › leagues: 한국어 파일과 개수가 다르다`);
    if (t.scale && e.scale) {
      const ks = t.scale;
      const es = e.scale;
      if (Boolean(ks.avg) !== Boolean(es.avg)) problems.push(`${where} › scale.avg: 한국어 파일과 있고 없음이 다르다`);
      if (Boolean(ks.note) !== Boolean(es.note)) problems.push(`${where} › scale.note: 한국어 파일과 있고 없음이 다르다`);
      const values = (ms: { v: number }[]) => ms.map((m) => m.v).sort((a, b) => a - b).join(',');
      if (values(ks.marks) !== values(es.marks)) problems.push(`${where} › scale.marks: 눈금 숫자(v)가 한국어 파일과 다르다`);
      // 화면은 평균 설명에서 큰 숫자와 겹치는 부분을 뺀다(avgCaption). 한국어에 숫자가 있으면 영어에도 같은 표기로 있어야 한다.
      const koHasNumber = ks.avg && avgCaption(ks.avg, ks) !== ks.avg.t;
      if (ks.avg && es.avg && koHasNumber && avgCaption({ v: ks.avg.v, t: es.avg }, ks) === es.avg) {
        problems.push(`${where} › scale.avg: 평균 숫자 ${fmt(ks.avg.v, ks)}가 글에 그대로 들어 있어야 한다`);
      }
    }
    const urls = (ss: { u: string }[]) => ss.map((s) => s.u).join('\n');
    if (urls(t.sources) !== urls(e.sources)) problems.push(`${where} › sources: 출처 URL이 한국어 파일과 같은 순서로 같아야 한다`);
  }
  return problems;
}
