// 읽은 진도(2-B): 읽은 용어를 이 브라우저에만 적어 두고(localStorage sh-read), 주제의 선에 칠한다. 어디로도 보내지 않는다.
// - 읽음의 기준: 용어 페이지를 연 것만으로는 세지 않는다. 본문 끝([data-read-mark])이 화면에 들어오고, 페이지를 연 지 10초가 지나면 읽음이다.
//   한국어와 영어는 용어 id가 같아서 같은 기록을 쓴다.
// - 칠하기: 첫 화면 전에는 Base.astro의 shMarkLine이 선마다 칠한다. 여기서는 기록이 바뀌었을 때(다른 탭, 지우기)와
//   뒤로 가기로 저장본(bfcache)에서 돌아왔을 때 다시 칠한다.
// - 지우기: 주제 페이지 맨 아래의 ‘읽은 기록 지우기’([data-read-clear]). 기록이 있을 때만 보인다.
const KEY = 'sh-read';
const DWELL_MS = 10_000;

declare function shMarkLine(ol: Element): void;

function load(): string[] {
  try {
    return (localStorage.getItem(KEY) ?? '').split(' ').filter(Boolean);
  } catch {
    return [];
  }
}

function save(ids: string[]) {
  try {
    if (ids.length) localStorage.setItem(KEY, ids.join(' '));
    else localStorage.removeItem(KEY);
  } catch {}
}

function repaint() {
  document.querySelectorAll('[data-progress]').forEach((ol) => shMarkLine(ol));
  syncClear();
}

// 지우기 단추: 기록이 있을 때만 보인다. 지우면 단추 자리에 ‘지웠어요’를 적는다.
const clear = document.querySelector<HTMLButtonElement>('[data-read-clear]');
const cleared = document.querySelector<HTMLElement>('[data-read-cleared]');
function syncClear() {
  if (clear) clear.hidden = load().length === 0;
}
clear?.addEventListener('click', () => {
  save([]);
  repaint();
  if (cleared) cleared.hidden = false;
});
syncClear();

addEventListener('storage', (e) => {
  if (e.key === KEY || e.key === null) repaint();
});
addEventListener('pageshow', (e) => {
  if (e.persisted) repaint();
});

// 용어 페이지: 본문 끝까지 오고 충분히 머물렀으면 읽음으로 적는다.
const id = document.body.dataset.term;
const mark = document.querySelector('[data-read-mark]');
if (id && mark && !load().includes(id)) {
  let seen = false;
  let waited = false;
  const done = () => {
    if (!seen || !waited) return;
    const ids = load();
    if (!ids.includes(id)) save([...ids, id]);
    io?.disconnect();
  };
  const io =
    'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          if (entries.some((en) => en.isIntersecting)) {
            seen = true;
            done();
          }
        })
      : null;
  io?.observe(mark);
  setTimeout(() => {
    waited = true;
    done();
  }, DWELL_MS);
}
