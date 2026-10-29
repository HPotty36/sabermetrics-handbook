// 뒤로: 홈이 아닌 페이지의 맨 위 왼쪽 링크(Base.astro).
// - 사이트 안의 다른 페이지에서 왔으면 브라우저의 뒤로와 같게 이전 페이지로 간다. 스크롤 위치도 브라우저가 되살린다.
// - 밖에서 바로 열었으면(검색, 공유 링크, 앱 바로 가기, 새 탭) 이전 페이지가 사이트 밖이거나 없으니, 링크대로 한 단계 위(용어 → 용어 목록, 주제·용어 목록 → 홈)로 간다.
//   스크립트가 없어도 이 링크로 동작한다.
// 홈 화면 웹앱(iOS)처럼 브라우저의 뒤로 단추가 없는 곳을 위해 둔다.
const back = document.querySelector<HTMLAnchorElement>('[data-back]');

function cameFromSite(): boolean {
  try {
    return Boolean(document.referrer) && new URL(document.referrer).origin === location.origin;
  } catch {
    return false;
  }
}

back?.addEventListener('click', (e) => {
  // 새 탭·새 창으로 여는 클릭은 브라우저에 맡긴다.
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (cameFromSite() && history.length > 1) {
    e.preventDefault();
    history.back();
  }
});
