// 뒤로: 홈이 아닌 페이지의 맨 위 왼쪽 링크(Base.astro)와, iOS·iPadOS 홈 화면 웹앱의 가장자리 밀기.
// - 사이트 안의 다른 페이지에서 왔으면 브라우저의 뒤로와 같게 이전 페이지로 간다. 스크롤 위치도 브라우저가 되살린다.
// - 밖에서 바로 열었으면(검색, 공유 링크, 앱 바로 가기, 새 탭) 이전 페이지가 사이트 밖이거나 없으니, 링크대로 한 단계 위(용어 → 용어 목록, 주제·용어 목록 → 홈)로 간다.
//   스크립트가 없어도 이 링크로 동작한다.
// 제스처: Safari, 안드로이드(크롬, 설치한 웹앱, 시스템 뒤로), 앱(Capacitor, 네이티브 코드)은 시스템의 뒤로 제스처가 그대로 동작한다.
//   iOS·iPadOS 홈 화면 웹앱만 시스템 제스처가 이전 페이지가 있을 때만 동작해서, 바로 연 페이지에서는 밀어도 아무 일이 없다.
//   그래서 그곳에서는 왼쪽 가장자리에서 오른쪽으로 민 손가락을 따로 보고, 다 밀면 이 단추와 같은 곳으로 간다.
//   시스템 제스처가 손가락을 가져가면 touchcancel이 오므로 그때는 아무것도 하지 않는다(두 번 돌아가지 않는다).
const back = document.querySelector<HTMLAnchorElement>('[data-back]');

function cameFromSite(): boolean {
  try {
    return Boolean(document.referrer) && new URL(document.referrer).origin === location.origin;
  } catch {
    return false;
  }
}

const canGoBackInSite = () => cameFromSite() && history.length > 1;

back?.addEventListener('click', (e) => {
  // 새 탭·새 창으로 여는 클릭은 브라우저에 맡긴다.
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (canGoBackInSite()) {
    e.preventDefault();
    history.back();
  }
});

/** 가장자리 밀기가 시작돼야 하는 왼쪽 띠(px). iOS의 시스템 제스처와 같은 폭이다. */
const EDGE = 24;
/** 이만큼 밀고 떼면 돌아간다(px). */
const COMMIT = 72;

// iPadOS는 Mac처럼 알리므로 터치로 가린다(prefs.ts와 같다).
const onIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
// 홈 화면 웹앱. 앱(Capacitor)의 웹뷰는 navigator.standalone이 없어서 여기 들지 않는다.
const homeScreenApp = (navigator as { standalone?: boolean }).standalone === true;

if (onIOS && homeScreenApp) {
  const main = document.getElementById('main');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  let start: { x: number; y: number; id: number } | null = null;
  let dx = 0;

  // 민 만큼 본문을 오른쪽으로 조금 따라 보낸다(최대 80px). 손을 떼고 돌아가지 않으면 제자리로 돌린다.
  const follow = (x: number) => {
    if (!main || still.matches) return;
    main.style.transition = 'none';
    main.style.transform = x > 0 ? `translateX(${Math.min(x, 160) / 2}px)` : '';
  };
  const settle = (animate: boolean) => {
    if (!main) return;
    main.style.transition = animate ? 'transform .18s ease-out' : '';
    main.style.transform = '';
  };
  const stop = () => {
    start = null;
    settle(true);
  };

  addEventListener(
    'touchstart',
    (e) => {
      start = null;
      const t = e.touches[0];
      if (e.touches.length !== 1 || t.clientX > EDGE) return;
      // 찾기 화면이나 설치 안내가 열려 있으면 그쪽 손짓이다.
      if (document.body.hasAttribute('data-search-open') || document.querySelector('dialog[open]')) return;
      // 갈 곳이 없다(바로 연 홈).
      if (!back && !canGoBackInSite()) return;
      start = { x: t.clientX, y: t.clientY, id: t.identifier };
      dx = 0;
    },
    { passive: true },
  );

  addEventListener(
    'touchmove',
    (e) => {
      if (!start) return;
      const t = Array.from(e.changedTouches).find((c) => c.identifier === start!.id);
      if (!t) return;
      dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      // 세로로 더 움직였으면 스크롤이다.
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
        stop();
        return;
      }
      follow(dx);
    },
    { passive: true },
  );

  addEventListener(
    'touchend',
    () => {
      if (!start) return;
      const go = dx >= COMMIT;
      start = null;
      if (!go) {
        settle(true);
        return;
      }
      if (canGoBackInSite()) history.back();
      else if (back) location.href = back.href;
      else settle(true);
    },
    { passive: true },
  );

  addEventListener('touchcancel', stop, { passive: true });
  // 뒤로 간 페이지가 저장본(bfcache)에서 돌아오면 밀던 자리에 멈춰 있지 않게 한다.
  addEventListener('pageshow', (e) => {
    if (e.persisted) settle(false);
  });
}
