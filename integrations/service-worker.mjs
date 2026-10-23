// 빌드가 끝나면 dist의 파일 목록으로 서비스 워커(dist/sw.js)를 만든다.
// 페이지·CSS·JS·아이콘은 설치할 때 미리 저장하고, 글꼴 조각은 쓰일 때 저장한다(sw-template.js).
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKIP = [/\.woff2$/, /\.map$/, /^sw\.js$/];

/**
 * dist 기준 상대 경로 목록을 미리 저장할 URL 목록으로 바꾼다. `x/index.html`은 `x/`가 된다.
 * @param {string[]} files
 * @param {string} base
 */
export function precacheUrls(files, base) {
  return files
    .filter((f) => !SKIP.some((re) => re.test(f)))
    .map((f) => base + f.replace(/(^|\/)index\.html$/, '$1'))
    .sort();
}

/** @param {string} dir */
async function walk(dir) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries.filter((e) => e.isFile()).map((e) => relative(dir, join(e.parentPath, e.name)).split(sep).join('/'));
}

/** @returns {import('astro').AstroIntegration} */
export default function serviceWorker() {
  let base = '/';
  return {
    name: 'handbook-service-worker',
    hooks: {
      'astro:config:done': ({ config }) => {
        base = config.base.endsWith('/') ? config.base : `${config.base}/`;
      },
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = (await walk(root)).sort();
        const urls = precacheUrls(files, base);

        // 미리 저장하는 파일의 내용이 바뀌면 버전도 바뀌어, 새 서비스 워커가 옛 저장분을 지운다.
        const hash = createHash('sha256');
        for (const f of files) {
          if (SKIP.some((re) => re.test(f))) continue;
          hash.update(f);
          hash.update(await readFile(join(root, f)));
        }
        const version = hash.digest('hex').slice(0, 12);

        const template = await readFile(new URL('./sw-template.js', import.meta.url), 'utf8');
        const header = `const VERSION = ${JSON.stringify(version)};\nconst BASE = ${JSON.stringify(base)};\nconst PRECACHE_URLS = ${JSON.stringify(urls)};\n\n`;
        await writeFile(join(root, 'sw.js'), header + template);
        logger.info(`sw.js ${version}: 파일 ${urls.length}개를 미리 저장한다`);
      },
    },
  };
}
