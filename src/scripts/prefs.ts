// 설정: 다크 모드, 언어, 앱 설치.
// - 다크 모드: 누르면 라이트·다크를 바꾸고 localStorage(sh-theme)에 둔다. 고른 적이 없으면 기기 설정을 따른다.
//   첫 화면 전에 저장된 값을 붙이는 일은 Base.astro의 인라인 스크립트가 한다.
// - 언어: 링크라서 스크립트 없이도 옮겨 간다. 고른 언어를 localStorage(sh-lang)에 둬서, 다음에 앱이나 홈 화면 웹앱을 열면
//   한국어 홈이 영어 홈으로 보낸다(Base.astro).
// - 앱 설치(PWA): Chrome·Edge·삼성 인터넷처럼 설치를 띄울 수 있는 브라우저는 beforeinstallprompt가 오면 단추를 보이고,
//   누르면 브라우저의 설치 창을 띄운다. iOS는 그런 API가 없어 단추를 누르면 ‘홈 화면에 추가’ 방법을 시트로 보인다.
//   이미 설치한 앱(standalone)으로 열었으면 단추를 보이지 않는다.
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

// 앱 아이콘의 바로 가기(manifest의 shortcuts)는 ?lang=으로 고른 언어를 알려 준다.
const langParam = new URLSearchParams(location.search).get('lang');
if (langParam === 'ko' || langParam === 'en') {
  try {
    localStorage.setItem(LANG_KEY, langParam);
  } catch {}
}

document.querySelectorAll<HTMLAnchorElement>('[data-lang-switch]').forEach((a) =>
  a.addEventListener('click', () => {
    try {
      localStorage.setItem(LANG_KEY, a.dataset.langSwitch!);
    } catch {}
  }),
);

sync();

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const installButtons = document.querySelectorAll<HTMLButtonElement>('[data-install]');
const installSheet = document.querySelector<HTMLDialogElement>('[data-install-sheet]');
const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
// iPadOS는 Mac처럼 알리므로 터치로 가린다.
const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
let deferred: InstallPromptEvent | null = null;

const showInstall = (show: boolean) => installButtons.forEach((b) => (b.hidden = !show));

if (!standalone && installButtons.length) {
  if (ios && installSheet) showInstall(true);
  window.addEventListener('beforeinstallprompt', (e) => {
    // 브라우저가 알아서 띄우는 작은 설치 안내 대신 설정의 단추로 띄운다.
    e.preventDefault();
    deferred = e as InstallPromptEvent;
    showInstall(true);
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    showInstall(false);
  });
  installButtons.forEach((b) =>
    b.addEventListener('click', async () => {
      if (deferred) {
        const prompt = deferred;
        deferred = null;
        await prompt.prompt();
        await prompt.userChoice;
        // 설치 창은 한 번만 띄울 수 있다(브라우저 규칙). 거절했으면 브라우저가 다음에 다시 알려 줄 때 단추가 다시 나온다.
        showInstall(false);
      } else if (installSheet) {
        installSheet.showModal();
      }
    }),
  );
  // 시트 바깥(어두운 바탕)을 누르면 닫는다.
  installSheet?.addEventListener('click', (e) => {
    if (e.target === installSheet) installSheet.close();
  });
}
