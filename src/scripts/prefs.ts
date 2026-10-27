// 설정: 다크 모드, 언어, 앱 설치.
// - 다크 모드: 누르면 라이트·다크를 바꾸고 localStorage(sh-theme)에 둔다. 고른 적이 없으면 기기 설정을 따른다.
//   첫 화면 전에 저장된 값을 붙이는 일은 Base.astro의 인라인 스크립트가 한다.
// - 언어: 링크라서 스크립트 없이도 옮겨 간다. 고른 언어를 localStorage(sh-lang)에 둬서, 다음에 앱이나 홈 화면 웹앱을 열면
//   한국어 홈이 영어 홈으로 보낸다(Base.astro).
// - 앱 설치(PWA): Chrome·Edge·삼성 인터넷처럼 설치를 띄울 수 있는 브라우저는 beforeinstallprompt가 오면 그 창을 띄운다.
//   설치 창을 띄울 수 없는 곳에서는 단추를 누르면 방법을 아래쪽 시트로 보인다.
//   - iOS: 설치 API가 없다. 공유 → 홈 화면에 추가.
//   - 안드로이드: 크롬은 페이지를 누르고 30초쯤 본 뒤에야 beforeinstallprompt를 보낸다. 그 전에도 단추를 보이고 브라우저 메뉴로 안내한다.
//     크롬은 시크릿 탭, 다른 앱 안의 크롬 탭(Custom Tab)에서는 설치 메뉴를 숨기고, 설치가 진행 중이면 흐리게 둔다.
//     광고 차단 앱이 manifest 링크를 지웠으면 그 사실을 함께 알린다.
//   - 다른 앱 안의 브라우저(카카오톡, 네이버, 인스타그램 등): 설치할 수 없다. 브라우저로 여는 링크를 준다.
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
const ua = navigator.userAgent;
// iPadOS는 Mac처럼 알리므로 터치로 가린다.
const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
const android = /Android/.test(ua);
const kakao = /KAKAOTALK/i.test(ua);
// 다른 앱 안의 브라우저. 안드로이드 WebView는 사용자 에이전트에 ‘; wv)’가 붙는다.
const inApp = kakao || /NAVER\(inapp|Instagram|FBAN|FBAV|FB_IAB|\bLine\/|DaumApps|BAND\/|everytimeApp|; wv\)/.test(ua);
const platform = inApp ? 'inapp' : ios ? 'ios' : android ? 'android' : null;
let deferred: InstallPromptEvent | null = null;

const showInstall = (show: boolean) => installButtons.forEach((b) => (b.hidden = !show));

/** 다른 앱 안의 브라우저에서 바깥 브라우저로 여는 주소. 카카오톡은 자체 주소, 안드로이드는 크롬 인텐트(없으면 기본 브라우저). */
function openOutsideHref(): string | null {
  const here = location.href;
  if (kakao) return `kakaotalk://web/openExternal?url=${encodeURIComponent(here)}`;
  if (android) {
    const rest = location.host + location.pathname + location.search;
    return `intent://${rest}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(here)};end`;
  }
  return null;
}

function openHelp() {
  if (!installSheet || !platform) return;
  installSheet.querySelectorAll<HTMLElement>('[data-help]').forEach((el) => (el.hidden = el.dataset.help !== platform));
  installSheet.setAttribute('aria-labelledby', `install-title-${platform}`);
  const open = installSheet.querySelector<HTMLAnchorElement>('[data-install-open]')!;
  const href = platform === 'inapp' ? openOutsideHref() : null;
  open.hidden = !href;
  if (href) open.href = href;
  installSheet.querySelector<HTMLElement>('[data-inapp-hint]')!.hidden = Boolean(href);
  // 광고 차단 앱(AdGuard의 ‘Mobile App Banners’ 필터 등)은 HTML에서 manifest 링크를 지운다.
  // 그러면 크롬은 사이트 루트가 아닌 페이지를 바로 가기로만 만들 수 있다(‘이 앱을 설치할 수 없습니다’).
  installSheet.querySelector<HTMLElement>('[data-blocked-note]')!.hidden = Boolean(document.querySelector('link[rel~="manifest"]'));
  installSheet.showModal();
}

if (!standalone && installButtons.length) {
  if (platform && installSheet) showInstall(true);
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
        // 설치 창은 한 번만 띄울 수 있다(브라우저 규칙). 안내가 있는 기기(폰)는 단추를 남겨 두고 다음에는 방법을 보인다.
        if (!platform) showInstall(false);
      } else {
        openHelp();
      }
    }),
  );
  // 시트 바깥(어두운 바탕)을 누르면 닫는다.
  installSheet?.addEventListener('click', (e) => {
    if (e.target === installSheet) installSheet.close();
  });
}
