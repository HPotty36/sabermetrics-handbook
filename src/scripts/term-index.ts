// 넓은 화면 왼쪽 차례의 레벨·분야 고르기. 검색은 scripts/search-box.ts가 따로 맡는다.
// 페이지를 옮겨 다녀도 고른 것이 유지되도록 sessionStorage에 둔다.
import { ALL_CATS, search, type SearchEntry, type SearchQuery } from '../lib/search.ts';

const STATE_KEY = 'sh-index';

const entries: SearchEntry[] = JSON.parse(document.getElementById('search-index')!.textContent!);

const indexes = Array.from(document.querySelectorAll<HTMLElement>('[data-term-index]'), (root) => ({
  root,
  list: root.querySelector<HTMLUListElement>('.rows')!,
  rows: new Map(Array.from(root.querySelectorAll<HTMLLIElement>('li[data-id]'), (li) => [li.dataset.id!, li])),
  groups: Array.from(root.querySelectorAll<HTMLLIElement>('li[data-group]')),
  empty: root.querySelector<HTMLElement>('.empty')!,
  levelChips: root.querySelectorAll<HTMLElement>('[data-level]'),
  catChips: root.querySelectorAll<HTMLElement>('[data-cat]'),
}));

let state: SearchQuery = { q: '', level: 0, cat: ALL_CATS };

function restore() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STATE_KEY) ?? 'null');
    if (saved) state = { ...state, level: saved.level ?? 0, cat: saved.cat ?? ALL_CATS };
  } catch {}
}

function save() {
  try {
    sessionStorage.setItem(STATE_KEY, JSON.stringify({ level: state.level, cat: state.cat }));
  } catch {}
}

function render() {
  const found = search(entries, state);
  const shown = new Set(found.map((e) => e.id));
  const shownLevels = new Set(found.map((e) => e.level));
  for (const ix of indexes) {
    for (const [id, li] of ix.rows) li.hidden = !shown.has(id);
    for (const g of ix.groups) g.hidden = !shownLevels.has(Number(g.dataset.group));
    ix.list.hidden = found.length === 0;
    ix.empty.hidden = found.length > 0;
    ix.empty.textContent = '이 조건에 맞는 용어는 아직 없어요.';
    ix.levelChips.forEach((c) => c.setAttribute('aria-pressed', String(Number(c.dataset.level) === state.level)));
    ix.catChips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.cat === state.cat)));
  }
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

// 뒤로 가기로 저장된 페이지가 돌아오면 다른 페이지에서 바꾼 조건을 다시 반영한다.
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    restore();
    render();
  }
});

restore();
render();
