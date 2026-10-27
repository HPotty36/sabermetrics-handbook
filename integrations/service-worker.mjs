// 빌드가 끝나면 dist의 파일 목록으로 서비스 워커(dist/sw.js)를 만든다.
// CSS·JS·아이콘·manifest와 두 홈은 설치할 때, 나머지 페이지는 그 뒤 하나씩, 글꼴 조각은 쓰일 때 저장한다(sw-template.js).
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// 글꼴 조각(쓰일 때 저장), 소스맵, 서비스 워커 자신, 그리고 OS만 쓰는 그림(iOS 실행 화면, 설치 창의 화면 사진)은 미리 저장하지 않는다.
const SKIP = [/\.woff2$/, /\.map$/, /^sw\.js$/, /^splash\//, /^screenshots\//];

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

/**
 * 미리 저장할 URL을 설치 때 받을 것(core)과 설치 뒤에 하나씩 받을 페이지(pages)로 나눈다.
 * 첫 방문에 페이지 60개를 한꺼번에 받으면 느린 연결에서 브라우저의 설치 검사(manifest 아이콘·화면 사진 받기)가 밀려
 * 안드로이드 크롬이 ‘이 앱을 설치할 수 없습니다’로 끝낸다(검사 시간 12초). 홈 두 개는 오프라인 대체 화면이라 core에 둔다.
 * @param {string[]} urls precacheUrls의 결과
 * @param {string} base
 */
export function splitPrecache(urls, base) {
  const homes = [base, `${base}en/`];
  const isLaterPage = (u) => u.endsWith('/') && !homes.includes(u);
  return { core: urls.filter((u) => !isLaterPage(u)), pages: urls.filter(isLaterPage) };
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
        const { core, pages } = splitPrecache(precacheUrls(files, base), base);

        // 미리 저장하는 파일의 내용이 바뀌면 버전도 바뀌어, 새 서비스 워커가 옛 저장분을 지운다.
        const hash = createHash('sha256');
        for (const f of files) {
          if (SKIP.some((re) => re.test(f))) continue;
          hash.update(f);
          hash.update(await readFile(join(root, f)));
        }
        const version = hash.digest('hex').slice(0, 12);

        const template = await readFile(new URL('./sw-template.js', import.meta.url), 'utf8');
        const header =
          `const VERSION = ${JSON.stringify(version)};\nconst BASE = ${JSON.stringify(base)};\n` +
          `const CORE_URLS = ${JSON.stringify(core)};\nconst PAGE_URLS = ${JSON.stringify(pages)};\n\n`;
        await writeFile(join(root, 'sw.js'), header + template);
        logger.info(`sw.js ${version}: 설치 때 ${core.length}개, 그 뒤 페이지 ${pages.length}개를 저장한다`);
      },
    },
  };
}
