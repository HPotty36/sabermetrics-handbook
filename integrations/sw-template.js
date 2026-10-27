// 서비스 워커 본체. 빌드 때 integrations/service-worker.mjs가 맨 앞에 VERSION, BASE, CORE_URLS, PAGE_URLS를 붙여 dist/sw.js로 내보낸다.
/* global VERSION, BASE, CORE_URLS, PAGE_URLS */

const PRECACHE = `sh-precache-${VERSION}`;
// 글꼴 조각(woff2)은 파일 이름에 해시가 있어 버전이 바뀌어도 그대로 쓴다. 쓰는 조각만 처음 받을 때 저장한다.
const FONTS = 'sh-fonts';
const NETWORK_TIMEOUT_MS = 3000;

// 설치 때는 CSS·JS·아이콘·manifest와 두 홈만 받는다. 나머지 페이지는 warmPages가 그 뒤에 받는다.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => cache.addAll(CORE_URLS))
      .then(() => self.skipWaiting()),
  );
});

// 페이지가 다 열리고 조금 지나면 ‘warm’을 보낸다(Base.astro). 그때 나머지 페이지를 하나씩 저장한다.
// 한 번에 하나만 받으므로 느린 연결에서도 브라우저의 설치 검사나 다른 요청을 밀어내지 않는다.
// 연결이 끊기면 멈추고, 다음에 ‘warm’이 오면 아직 없는 것부터 잇는다.
let warming = null;
self.addEventListener('message', (event) => {
  if (event.data !== 'warm') return;
  warming ??= warmPages().finally(() => (warming = null));
  event.waitUntil(warming);
});

async function warmPages() {
  const cache = await caches.open(PRECACHE);
  for (const url of PAGE_URLS) {
    if (await cache.match(url, { ignoreVary: true })) continue;
    const response = await fetch(url).catch(() => null);
    if (!response) return;
    if (response.ok) await cache.put(url, response);
  }
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('sh-precache-') && k !== PRECACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fromNetworkFirst(request));
  } else if (url.pathname.endsWith('.woff2')) {
    event.respondWith(fromCacheFirst(request, FONTS));
  } else if (url.pathname.startsWith(`${BASE}screenshots/`)) {
    // 설치 창의 화면 사진. 안드로이드 크롬은 페이지를 열 때마다 받으므로 처음 받은 것을 이 버전의 저장분에 둔다.
    event.respondWith(fromCacheFirst(request, PRECACHE));
  } else {
    event.respondWith(fromCacheFirst(request, null));
  }
});

// 페이지: 온라인이면 새 내용을 받고(받은 것은 저장), 오프라인이거나 느리면 저장해 둔 것을 보여 준다.
async function fromNetworkFirst(request) {
  const cache = await caches.open(PRECACHE);
  const network = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });
  network.catch(() => {}); // 캐시로 먼저 응답한 뒤 실패해도 오류로 남기지 않는다.
  const timeout = new Promise((resolve) => setTimeout(resolve, NETWORK_TIMEOUT_MS));
  try {
    const response = await Promise.race([network, timeout]);
    if (response) return response;
  } catch {
    // 오프라인: 아래에서 저장된 페이지를 찾는다.
  }
  const cached = await cache.match(request, { ignoreSearch: true, ignoreVary: true });
  if (cached) return cached;
  try {
    return await network;
  } catch {
    // 저장해 둔 적 없는 주소는 그 언어의 홈으로 대신한다(영어는 /en/ 아래).
    const home = new URL(request.url).pathname.startsWith(`${BASE}en/`) ? `${BASE}en/` : BASE;
    return (await cache.match(home)) ?? (await cache.match(BASE)) ?? Response.error();
  }
}

// 해시가 붙은 정적 파일: 저장된 것이 있으면 바로 쓰고, 없으면 받아서(runtimeCache가 있으면) 저장한다.
// 모듈 스크립트는 Origin 헤더를 붙여 요청하므로, 서버가 Vary: Origin을 보내면 미리 저장한 것과 짝이 안 맞는다.
// 파일 이름에 내용 해시가 있어 바뀌지 않으니 Vary는 보지 않는다.
async function fromCacheFirst(request, runtimeCache) {
  const cached = await caches.match(request, { ignoreVary: true });
  if (cached) return cached;
  const response = await fetch(request);
  if (runtimeCache && response.ok) {
    const cache = await caches.open(runtimeCache);
    cache.put(request, response.clone());
  }
  return response;
}
