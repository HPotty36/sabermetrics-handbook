import { test } from 'node:test';
import assert from 'node:assert/strict';
import { precacheUrls, splitPrecache } from '../integrations/service-worker.mjs';

test('빌드 파일을 미리 저장할 URL로 바꾼다', () => {
  const files = [
    'index.html',
    'terms/fip/index.html',
    '_astro/Base.abc123.css',
    '_astro/ibm-plex-sans-kr-0-400-normal.Xy12.woff2',
    'icons/icon-192.png',
    'manifest.webmanifest',
    'favicon.svg',
    'sw.js',
    'splash/apple-1290x2796-light.png',
    'screenshots/ko-home.webp',
  ];
  assert.deepEqual(precacheUrls(files, '/'), [
    '/',
    '/_astro/Base.abc123.css',
    '/favicon.svg',
    '/icons/icon-192.png',
    '/manifest.webmanifest',
    '/terms/fip/',
  ]);
});

test('base 경로를 앞에 붙인다', () => {
  assert.deepEqual(precacheUrls(['index.html', 'terms/ops/index.html'], '/handbook/'), ['/handbook/', '/handbook/terms/ops/']);
});

test('두 홈과 페이지가 아닌 파일은 설치 때, 나머지 페이지는 그 뒤에 받는다', () => {
  const urls = ['/', '/_astro/Base.abc123.css', '/en/', '/en/manifest.webmanifest', '/en/terms/fip/', '/ladders/', '/terms/fip/'];
  assert.deepEqual(splitPrecache(urls, '/'), {
    core: ['/', '/_astro/Base.abc123.css', '/en/', '/en/manifest.webmanifest'],
    pages: ['/en/terms/fip/', '/ladders/', '/terms/fip/'],
  });
  assert.deepEqual(splitPrecache(['/handbook/', '/handbook/en/', '/handbook/terms/ops/'], '/handbook/'), {
    core: ['/handbook/', '/handbook/en/'],
    pages: ['/handbook/terms/ops/'],
  });
});

test('사이트 글자와 겹치는 글꼴 조각만 고른다', async () => {
  const { fontUrls } = await import('../integrations/service-worker.mjs');
  const css =
    '@font-face{font-family:P;src:url(/_astro/P.0.aa.woff2)format("woff2");unicode-range:U+AC00-AC0F}' +
    '@font-face{font-family:P;src:url(/_astro/P.1.bb.woff2)format("woff2");unicode-range:U+2018-2019,U+00B0}' +
    '@font-face{font-family:P;src:url(/_astro/P.2.cc.woff2)format("woff2");unicode-range:U+3000-30FF}' +
    '@font-face{font-family:B;src:url(/_astro/B.dd.woff2)format("woff2")}' +
    '@font-face{font-family:W;src:url(/_astro/W.ee.woff2)format("woff2");unicode-range:U+00??}';
  // 가(U+AC00), ’(U+2019, &#8217;로 적음), A(U+0041). 일본어 가나는 없다.
  assert.deepEqual(fontUrls(css, '<p>가 &#8217; A</p>', '/'), ['/_astro/B.dd.woff2', '/_astro/P.0.aa.woff2', '/_astro/P.1.bb.woff2', '/_astro/W.ee.woff2']);
});
