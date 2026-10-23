// @ts-check
import { defineConfig } from 'astro/config';
import serviceWorker from './integrations/service-worker.mjs';

/**
 * Fontsource CSS는 woff2와 woff를 함께 적어 두 파일이 모두 빌드에 들어간다.
 * 지원하는 브라우저는 모두 woff2를 읽으므로 woff를 빼서 결과물(웹, 앱 번들) 크기를 줄인다.
 * @returns {import('vite').Plugin}
 */
function fontsourceWoff2Only() {
  return {
    name: 'fontsource-woff2-only',
    enforce: 'pre',
    transform(code, id) {
      if (!/@fontsource\/.+\.css$/.test(id)) return;
      return code.replace(/,\s*url\([^)]+\.woff\)\s*format\('woff'\)/g, '');
    },
  };
}

export default defineConfig({
  // 용어 페이지는 /terms/<id>/ 형태로 정적 생성한다.
  trailingSlash: 'always',
  integrations: [serviceWorker()],
  vite: {
    plugins: [fontsourceWoff2Only()],
  },
});
