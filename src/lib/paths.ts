import { makePaths } from './make-paths.ts';

/** `astro build --mode app`으로 만든 앱(Capacitor)용 빌드인지. */
export const isAppBuild = import.meta.env.MODE === 'app';

export const { base, homeHref, termHref } = makePaths(import.meta.env.BASE_URL, isAppBuild);
