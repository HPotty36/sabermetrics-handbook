// 아이콘 원본 두 개에서 PWA 아이콘, iOS 실행 화면, 바로 가기 아이콘, 앱 아이콘·스플래시 원본 PNG를 만든다.
// - assets/icon.svg: 모서리 없이 꽉 찬 사각형 (iOS, apple-touch-icon처럼 OS가 모서리를 깎는 곳)
// - public/favicon.svg: 둥근 모서리 (탭 아이콘, 헤더 마크, PWA ‘any’ 아이콘, 스플래시)
// 앱의 실제 아이콘·스플래시는 그다음 `npx @capacitor/assets generate --android --ios`가 assets/의 PNG로 만든다(`npm run icons`).
import { mkdirSync, readFileSync } from 'node:fs';
import sharp from 'sharp';
import { APPLE_SPLASH, splashName } from '../src/lib/pwa.ts';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const out = (p) => new URL(p, root).pathname;

const SEAM = '#C42638';
const full = read('assets/icon.svg');
const rounded = read('public/favicon.svg');

// 바탕 사각형을 뺀 그림만 가운데를 기준으로 줄인다. 마스크(원)를 씌우는 아이콘의 안전 영역에 넣기 위해서다.
const art = full.slice(full.indexOf('<g '), full.lastIndexOf('</svg>'));
const shrunk = (k, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${bg ? `<rect width="1024" height="1024" fill="${bg}"/>` : ''}` +
  `<g transform="translate(512 512) scale(${k}) translate(-512 -512)">${art}</g></svg>`;

const png = (svg, size, file) => sharp(Buffer.from(svg), { density: 288 }).resize(size, size).png().toFile(out(file));

async function splash(bg, file) {
  const icon = await sharp(Buffer.from(rounded), { density: 288 }).resize(480, 480).png().toBuffer();
  await sharp({ create: { width: 2732, height: 2732, channels: 4, background: bg } })
    .composite([{ input: icon, gravity: 'center' }])
    .png()
    .toFile(out(file));
}

await png(rounded, 192, 'public/icons/icon-192.png');
await png(rounded, 512, 'public/icons/icon-512.png');
await png(shrunk(0.8, SEAM), 512, 'public/icons/icon-maskable-512.png'); // 안전 영역: 지름 80% 원
await png(full, 180, 'public/icons/apple-touch-icon.png');
await png(full, 1024, 'assets/icon-only.png');
await png(shrunk(0.68), 1024, 'assets/icon-foreground.png'); // 안드로이드 적응형: 108dp 가운데 지름 66dp 원 안
await png(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="${SEAM}"/></svg>`, 1024, 'assets/icon-background.png');
await splash('#FBF9F4', 'assets/splash.png'); // paper
await splash('#000000', 'assets/splash-dark.png'); // 다크 paper (완전한 검정)
// iOS 홈 화면 웹앱의 실행 화면: 기기 화면 크기마다 라이트·다크 한 장씩(src/lib/pwa.ts의 목록). 종이색 바탕 가운데에 아이콘.
mkdirSync(out('public/splash/'), { recursive: true });
for (const d of APPLE_SPLASH) {
  const [w, h] = [d.w * d.r, d.h * d.r];
  const size = Math.round(w * 0.22);
  const icon = await sharp(Buffer.from(rounded), { density: 288 }).resize(size, size).png().toBuffer();
  for (const [mode, bg] of [['light', '#FBF9F4'], ['dark', '#000000']]) {
    await sharp({ create: { width: w, height: h, channels: 4, background: bg } })
      .composite([{ input: icon, gravity: 'center' }])
      .png({ palette: true, compressionLevel: 9 })
      .toFile(out(`public/splash/${splashName(d, mode)}`));
  }
}

// 앱 아이콘을 길게 누르면 나오는 바로 가기(manifest의 shortcuts) 아이콘. 앱 아이콘처럼 빨간 바탕에 흰 선, 그림은 아래쪽 알약의 탭 아이콘이다.
const glyphs = {
  ladders: '<path d="M12 6.5v11" stroke="#fff" stroke-width="2.2"/><circle cx="12" cy="4.5" r="2.4" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="12" r="2.4" fill="#fff" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="19.5" r="2.4" fill="none" stroke="#fff" stroke-width="1.8"/>',
  terms: '<path d="M9 6.5h11M9 12h11M9 17.5h11" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><circle cx="4.75" cy="6.5" r="1.25" fill="#fff"/><circle cx="4.75" cy="12" r="1.25" fill="#fff"/><circle cx="4.75" cy="17.5" r="1.25" fill="#fff"/>',
  language: '<circle cx="12" cy="12" r="8.6" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M3.4 12h17.2M12 3.4c2.5 2.4 3.8 5.3 3.8 8.6s-1.3 6.2-3.8 8.6c-2.5-2.4-3.8-5.3-3.8-8.6S9.5 5.8 12 3.4z" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/>',
};
for (const [name, glyph] of Object.entries(glyphs)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="${SEAM}"/><g transform="translate(12 12) scale(.58) translate(-12 -12)">${glyph}</g></svg>`;
  await png(svg, 192, `public/icons/shortcut-${name}.png`);
}

console.log('아이콘 PNG를 만들었다. 앱 아이콘은 `npx @capacitor/assets generate --android --ios`로 이어서 만든다.');
