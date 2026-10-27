import type { Lang } from './i18n.ts';
import { makePaths, type Paths } from './make-paths.ts';

/** `astro build --mode app`으로 만든 앱(Capacitor)용 빌드인지. */
export const isAppBuild = import.meta.env.MODE === 'app';

const cache = new Map<Lang, Paths>();

/** 언어별 사이트 안 링크 */
export function paths(lang: Lang): Paths {
  let p = cache.get(lang);
  if (!p) cache.set(lang, (p = makePaths(import.meta.env.BASE_URL, isAppBuild, lang)));
  return p;
}

export const { base } = paths('ko');
