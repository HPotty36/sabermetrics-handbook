// 검색과 레벨·분야 필터. 사이드바와 홈의 목록을 함께 거른다.
// 프로토타입처럼 페이지를 옮겨 다녀도 조건이 유지되도록 sessionStorage에 둔다.
import { homeHref } from '../lib/paths.ts';
import { ALL_CATS, search, type SearchEntry, type SearchQuery } from '../lib/search.ts';

const STATE_KEY = 'sh-index';
const FOCUS_KEY = 'sh-search-focus';

const entries: SearchEntry[] = JSON.parse(document.getElementById('search-index')!.textContent!);
const input = document.getElementById('q') as HTMLInputElement;
const homeIndex = document.getElementById('home-index');
const desktop = window.matchMedia('(min-width: 1024px)');
const onTermPage = document.body.dataset.view === 'term';

const indexes = Array.from(document.querySelectorAll<HTMLElement>('[data-term-index]'), (root) => ({
  root,
  list: root.querySelector<HTMLUListElement>('.rows')!,
  rows: new Map(Array.from(root.querySelectorAll<HTMLLIElement>('li[data-id]'), (li) => [li.dataset.id!, li])),
  count: root.querySelector<HTMLElement>('.index-count')!,
  empty: root.querySelector<HTMLElement>('.empty')!,
  levelChips: root.querySelectorAll<HTMLElement>('[data-level]'),
  catChips: root.querySelectorAll<HTMLElement>('[data-cat]'),
}));

let state: SearchQuery = { q: '', level: 0, cat: ALL_CATS };

function restore() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STATE_KEY) ?? 'null');
    if (saved) state = { ...state, ...saved };
  } catch {}
  input.value = state.q;
}

function save() {
  try {
    sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {}
}

function render() {
  const found = search(entries, state);
  const shown = new Set(found.map((e) => e.id));
  const emptyText = state.q
    ? `‘${state.q}’에 맞는 용어가 아직 없어요. 약어(FIP), 한글(수비 무관), 영문(fielding) 모두 검색돼요.`
    : '고른 조건에 맞는 용어가 아직 없어요.';

  for (const ix of indexes) {
    for (const e of found) ix.list.append(ix.rows.get(e.id)!);
    for (const [id, li] of ix.rows) li.hidden = !shown.has(id);
    ix.list.hidden = found.length === 0;
    ix.empty.hidden = found.length > 0;
    ix.empty.textContent = emptyText;
    ix.count.textContent = `${found.length} / ${entries.length} 용어`;
    ix.levelChips.forEach((c) => c.setAttribute('aria-pressed', String(Number(c.dataset.level) === state.level)));
    ix.catChips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.cat === state.cat)));
  }
}

// 모바일 용어 페이지에는 목록이 없으므로, 검색을 시작하면 홈의 전체 용어로 간다.
let leaving = false;
function searchFromHome() {
  if (leaving) return;
  leaving = true;
  save();
  try {
    sessionStorage.setItem(FOCUS_KEY, '1');
  } catch {}
  // #home-index로 가면 브라우저가 앵커로 스크롤하면서 검색창 포커스를 빼앗으므로, 스크롤은 홈에서 직접 한다.
  location.href = homeHref;
}

for (const ix of indexes) {
  ix.root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const lv = target.closest<HTMLElement>('[data-level]');
    const cat = target.closest<HTMLElement>('[data-cat]');
    if (lv) state.level = Number(lv.dataset.level);
    else if (cat) state.cat = cat.dataset.cat!;
    else return;
    save();
    render();
  });
}

input.addEventListener('input', (e) => {
  state.q = input.value.trim();
  if (onTermPage && !desktop.matches) {
    // 한글 조합 중에 페이지를 옮기면 글자가 끊기므로, 조합이 끝난 뒤(compositionend)에 옮긴다.
    if (!(e as InputEvent).isComposing) searchFromHome();
    return;
  }
  save();
  render();
  if (!desktop.matches) homeIndex?.scrollIntoView({ block: 'start' });
});

input.addEventListener('compositionend', () => {
  if (onTermPage && !desktop.matches) {
    state.q = input.value.trim();
    searchFromHome();
  }
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const first = search(entries, state)[0];
    if (first) {
      input.blur();
      location.href = first.href;
    }
  } else if (e.key === 'Escape') {
    input.value = '';
    state.q = '';
    save();
    render();
  }
});

// 뒤로 가기로 캐시된 페이지가 돌아오면 다른 페이지에서 바꾼 조건을 다시 반영한다.
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    leaving = false;
    restore();
    render();
  }
});

restore();
render();

let focusSearch = false;
try {
  focusSearch = sessionStorage.getItem(FOCUS_KEY) === '1';
  sessionStorage.removeItem(FOCUS_KEY);
} catch {}
if (focusSearch) {
  homeIndex?.scrollIntoView({ block: 'start' });
  input.focus({ preventScroll: true });
  input.setSelectionRange(input.value.length, input.value.length);
}
