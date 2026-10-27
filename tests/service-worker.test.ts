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
