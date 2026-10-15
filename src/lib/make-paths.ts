// 사이트 안 링크를 만든다. paths.ts가 빌드 설정을 넣어 쓴다(이 파일은 테스트를 위해 import.meta.env를 쓰지 않는다).

export interface Paths {
  homeHref: string;
  /** 앞쪽 base가 붙은 사이트 루트. manifest, 아이콘처럼 확장자가 있는 파일에 쓴다. */
  base: string;
  termHref(id: string): string;
}

/**
 * @param explicitIndex 앱(Capacitor) 빌드면 true. 앱의 로컬 서버는 확장자 없는 주소를 모두 홈 index.html로 보내므로
 *   페이지 링크에 index.html까지 적는다.
 */
export function makePaths(base: string, explicitIndex: boolean): Paths {
  const root = base.endsWith('/') ? base : `${base}/`;
  const page = explicitIndex ? 'index.html' : '';
  return {
    base: root,
    homeHref: root + page,
    termHref: (id) => `${root}terms/${id}/${page}`,
  };
}
