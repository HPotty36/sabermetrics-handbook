// 사이트 안 링크를 만든다. paths.ts가 빌드 설정을 넣어 쓴다(이 파일은 테스트를 위해 import.meta.env를 쓰지 않는다).
import type { Lang } from './i18n.ts';

export interface Paths {
  homeHref: string;
  /** 앞쪽 base가 붙은 사이트 루트. manifest, 아이콘처럼 확장자가 있는 파일에 쓴다. 언어와 상관없이 같다. */
  base: string;
  /** 이 언어의 루트. 한국어는 base, 영어는 base + en/ */
  langRoot: string;
  /** 주제(사다리) 전체 페이지 */
  laddersHref: string;
  /** 용어 전체 목록 페이지 */
  termsHref: string;
  termHref(id: string): string;
}

/** 언어마다 붙는 주소 앞부분. 한국어가 기본이라 사이트 루트에 있다. */
export const LANG_PREFIX: Record<Lang, string> = { ko: '', en: 'en/' };

/**
 * @param explicitIndex 앱(Capacitor) 빌드면 true. 앱의 로컬 서버는 확장자 없는 주소를 모두 홈 index.html로 보내므로
 *   페이지 링크에 index.html까지 적는다.
 */
export function makePaths(base: string, explicitIndex: boolean, lang: Lang = 'ko'): Paths {
  const site = base.endsWith('/') ? base : `${base}/`;
  const root = site + LANG_PREFIX[lang];
  const page = explicitIndex ? 'index.html' : '';
  return {
    base: site,
    langRoot: root,
    homeHref: root + page,
    laddersHref: `${root}ladders/${page}`,
    termsHref: `${root}terms/${page}`,
    termHref: (id) => `${root}terms/${id}/${page}`,
  };
}
