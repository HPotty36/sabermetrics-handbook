// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // 용어 페이지는 /terms/<id>/ 형태로 정적 생성한다.
  trailingSlash: 'always',
});
