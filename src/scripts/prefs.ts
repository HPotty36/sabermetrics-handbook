// 설정: 다크 모드와 언어.
// - 다크 모드: 누르면 라이트·다크를 바꾸고 localStorage(sh-theme)에 둔다. 고른 적이 없으면 기기 설정을 따른다.
//   첫 화면 전에 저장된 값을 붙이는 일은 Base.astro의 인라인 스크립트가 한다.
// - 언어: 링크라서 스크립트 없이도 옮겨 간다. 고른 언어를 localStorage(sh-lang)에 둬서, 다음에 앱이나 홈 화면 웹앱을 열면
//   한국어 홈이 영어 홈으로 보낸다(Base.astro).
const THEME_KEY = 'sh-theme';
const LANG_KEY = 'sh-lang';

const root = document.documentElement;
const media = window.matchMedia('(prefers-color-scheme: dark)');
const toggles = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
const themeColors = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
const defaultColors = Array.from(themeColors, (m) => m.content);

const isDark = () => (root.dataset.theme ?? (media.matches ? 'dark' : 'light')) === 'dark';

function sync() {
  const dark = isDark();
  toggles.forEach((b) => b.setAttribute('aria-pressed', String(dark)));
  // 브라우저 막대 색(theme-color)도 고른 쪽에 맞춘다. 고른 적이 없으면 기기 설정별 기본값 그대로다.
  const forced = root.dataset.theme;
  const paper = getComputedStyle(document.body).backgroundColor;
  themeColors.forEach((m, i) => (m.content = forced ? paper : defaultColors[i]));
}

toggles.forEach((b) =>
  b.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    sync();
  }),
);
media.addEventListener('change', sync);
// 다른 페이지에서 바꾸고 뒤로 가기로 돌아오면 저장된 페이지가 옛 색 그대로 나오므로 다시 맞춘다.
window.addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') root.dataset.theme = saved;
  } catch {}
  sync();
});

document.querySelectorAll<HTMLAnchorElement>('[data-lang-switch]').forEach((a) =>
  a.addEventListener('click', () => {
    try {
      localStorage.setItem(LANG_KEY, a.dataset.langSwitch!);
    } catch {}
  }),
);

sync();
