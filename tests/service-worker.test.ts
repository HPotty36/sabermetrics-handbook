import { test } from 'node:test';
import assert from 'node:assert/strict';
import { precacheUrls } from '../integrations/service-worker.mjs';

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
