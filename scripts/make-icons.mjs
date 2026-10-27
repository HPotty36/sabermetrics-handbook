// 아이콘 원본 두 개에서 PWA 아이콘과 앱 아이콘·스플래시 원본 PNG를 만든다.
// - assets/icon.svg: 모서리 없이 꽉 찬 사각형 (iOS, apple-touch-icon처럼 OS가 모서리를 깎는 곳)
// - public/favicon.svg: 둥근 모서리 (탭 아이콘, 헤더 마크, PWA ‘any’ 아이콘, 스플래시)
// 앱의 실제 아이콘·스플래시는 그다음 `npx @capacitor/assets generate --android --ios`가 assets/의 PNG로 만든다(`npm run icons`).
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

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
console.log('아이콘 PNG를 만들었다. 앱 아이콘은 `npx @capacitor/assets generate --android --ios`로 이어서 만든다.');
