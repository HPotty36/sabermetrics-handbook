// 서비스 워커 본체. 빌드 때 integrations/service-worker.mjs가 맨 앞에 VERSION, BASE, PRECACHE_URLS를 붙여 dist/sw.js로 내보낸다.
/* global VERSION, BASE, PRECACHE_URLS */

const PRECACHE = `sh-precache-${VERSION}`;
// 글꼴 조각(woff2)은 파일 이름에 해시가 있어 버전이 바뀌어도 그대로 쓴다. 쓰는 조각만 처음 받을 때 저장한다.
const FONTS = 'sh-fonts';
const NETWORK_TIMEOUT_MS = 3000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

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
