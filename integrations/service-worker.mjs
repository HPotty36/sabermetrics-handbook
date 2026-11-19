// 빌드가 끝나면 dist의 파일 목록으로 서비스 워커(dist/sw.js)를 만든다.
// CSS·JS·아이콘·manifest와 두 홈은 설치할 때, 나머지 페이지와 사이트 글자에 쓰이는 글꼴 조각은 그 뒤 하나씩 저장한다(sw-template.js).
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// 글꼴 조각(쓰일 때 저장), 소스맵, 서비스 워커 자신, OS만 쓰는 그림(iOS 실행 화면, 설치 창의 화면 사진),
// 그리고 검색 엔진과 공유 카드만 쓰는 것(404, sitemap, robots, og.png)은 미리 저장하지 않는다.
const SKIP = [/\.woff2$/, /\.map$/, /^sw\.js$/, /^splash\//, /^screenshots\//, /^404\.html$/, /^sitemap\.xml$/, /^robots\.txt$/, /^og\.png$/, /rss\.xml$/];

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

/**
 * 사이트의 글자를 그리는 데 필요한 글꼴 파일. 글꼴은 unicode-range로 잘게 나뉘어 있어(Pretendard 92조각) 브라우저는 그 페이지에
 * 나오는 글자의 조각만 받는다. 그래서 온라인에서 열어 본 페이지의 조각만 저장되고, 오프라인에서 처음 여는 페이지에는
 * ‘’나 ° 같은 글자가 다른 글꼴로 나왔다. 빌드한 HTML 전체에 나오는 글자와 겹치는 조각을 모두 고른다.
 * @param {string} css 빌드한 CSS(@font-face가 든 것)
 * @param {string} text 빌드한 HTML을 모두 이은 것
 * @param {string} base
 */
export function fontUrls(css, text, base) {
  const used = new Set();
  for (const ch of text.replace(/&#x([0-9a-f]+);|&#(\d+);/gi, (_, h, d) => String.fromCodePoint(h ? parseInt(h, 16) : Number(d)))) used.add(ch.codePointAt(0));
  const covers = (range) =>
    range.split(',').some((part) => {
      const r = part.trim().replace(/^U\+/i, '');
      const [lo, hi] = r.includes('?') ? [r.replace(/\?/g, '0'), r.replace(/\?/g, 'F')] : r.split('-').concat(r.split('-').slice(-1)).slice(0, 2);
      const a = parseInt(lo, 16);
      const b = parseInt(hi, 16);
      for (const c of used) if (c >= a && c <= b) return true;
      return false;
    });
  const out = new Set();
  for (const [, face] of css.matchAll(/@font-face\s*{([^}]*)}/g)) {
    const range = /unicode-range:\s*([^;}]+)/.exec(face)?.[1];
    if (range && !covers(range)) continue;
    for (const [, u] of face.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)) out.add(u.startsWith('/') ? u : base + u.replace(/^\.?\//, ''));
  }
  return [...out].sort();
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

        const read = (ext) => Promise.all(files.filter((f) => f.endsWith(ext)).map((f) => readFile(join(root, f), 'utf8')));
        const fonts = fontUrls((await read('.css')).join('\n'), (await read('.html')).join('\n'), base);

        const template = await readFile(new URL('./sw-template.js', import.meta.url), 'utf8');
        const header =
          `const VERSION = ${JSON.stringify(version)};\nconst BASE = ${JSON.stringify(base)};\n` +
          `const CORE_URLS = ${JSON.stringify(core)};\nconst PAGE_URLS = ${JSON.stringify(pages)};\nconst FONT_URLS = ${JSON.stringify(fonts)};\n\n`;
        await writeFile(join(root, 'sw.js'), header + template);
        logger.info(`sw.js ${version}: 설치 때 ${core.length}개, 그 뒤 페이지 ${pages.length}개와 글꼴 조각 ${fonts.length}개를 저장한다`);
      },
    },
  };
}
