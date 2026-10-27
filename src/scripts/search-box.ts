// 검색.
// - 넓은 화면: 왼쪽 단 입력란에 검색어를 넣으면 본문 자리에 맞는 용어가 나온다. 지우면 보던 자리로 돌아간다.
// - 폰: 아래쪽 알약의 찾기 단추를 누르면 알약이 입력란과 닫기 단추로 바뀌고(iOS 26처럼 아래쪽), 용어 목록이 그 위로 화면을 덮는다.
//   검색어를 넣으면 목록을 거른다. 키보드가 올라오면 입력란도 키보드 위로 올린다.
import { ALL_CATS, search, type SearchEntry } from '../lib/search.ts';

const entries: SearchEntry[] = JSON.parse(document.getElementById('search-index')!.textContent!);
const input = document.getElementById('q') as HTMLInputElement;
const results = document.getElementById('results')!;
const list = results.querySelector<HTMLUListElement>('.hits')!;
const rows = new Map(Array.from(list.querySelectorAll<HTMLLIElement>('li[data-id]'), (li) => [li.dataset.id!, li]));
const empty = results.querySelector<HTMLElement>('.empty')!;
const status = results.querySelector<HTMLElement>('[role="status"]')!;

const find = (q: string) => search(entries, { q, level: 0, cat: ALL_CATS });

let open = false; // 폰의 검색 화면이 열려 있는지
let shown = false; // 결과 목록이 보이는지
let inPlace = false; // 결과가 본문 자리에 나와 있는지(넓은 화면). 폰의 검색 화면은 본문 위를 덮으므로 스크롤을 건드리지 않는다.
let scrollBefore = 0;

function render(composing = false) {
  const q = input.value.trim();
  const found = find(q);
  // 한글을 조합하는 중(‘ㅂ’)에는 맞는 게 없다는 말이 깜박이지 않게 앞의 결과를 그대로 둔다.
  if (composing && q && found.length === 0) return;

  const show = open || Boolean(q);
  if (show !== shown) {
    shown = show;
    results.hidden = !show;
    document.body.toggleAttribute('data-searching', show);
    // 넓은 화면에서는 결과가 본문 자리에 나오므로 맨 위로 올렸다가, 닫으면 보던 자리로 돌려놓는다.
    if (show) {
      inPlace = !open;
      if (inPlace) {
        scrollBefore = window.scrollY;
        window.scrollTo(0, 0);
      }
    } else if (inPlace) {
      window.scrollTo(0, scrollBefore);
    }
  }
  if (!show) return;

  const ids = new Set(found.map((e) => e.id));
  for (const e of found) list.append(rows.get(e.id)!);
  for (const [id, li] of rows) li.hidden = !ids.has(id);
  list.hidden = found.length === 0;
  empty.hidden = found.length > 0;
  empty.textContent = `‘${q}’에 맞는 용어가 없어요.`;
  status.textContent = found.length ? `용어 ${found.length}개` : empty.textContent;
}

// 키보드 높이. 화면 아래에 붙은 입력란을 키보드 위로 올린다(브라우저가 키보드만큼 화면을 줄여 주지 않을 때).
const viewport = window.visualViewport;
function syncKeyboard() {
  const kb = open && viewport ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0;
  document.documentElement.style.setProperty('--kb', `${Math.round(kb)}px`);
}
viewport?.addEventListener('resize', syncKeyboard);
viewport?.addEventListener('scroll', syncKeyboard);

function openSheet() {
  open = true;
  document.body.toggleAttribute('data-search-open', true);
  // iOS는 누른 순간에 바로 focus해야 키보드가 올라온다.
  input.focus();
  render();
  results.scrollTop = 0;
  syncKeyboard();
}

function close() {
  input.value = '';
  open = false;
  document.body.toggleAttribute('data-search-open', false);
  input.blur();
  render();
  syncKeyboard();
}

document.querySelectorAll('[data-open-search]').forEach((b) => b.addEventListener('click', openSheet));
document.querySelectorAll('[data-close-search]').forEach((b) => b.addEventListener('click', close));

input.addEventListener('input', (e) => render((e as InputEvent).isComposing));
input.addEventListener('compositionend', () => render());

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.isComposing) {
    const first = find(input.value)[0];
    if (input.value.trim() && first) {
      input.blur();
      location.href = first.href;
    }
  } else if (e.key === 'Escape') {
    close();
  }
});

// 넓은 화면에서 ‘/’를 누르면 검색창으로 간다.
document.addEventListener('keydown', (e) => {
  const t = e.target as HTMLElement;
  if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey || t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
  e.preventDefault();
  input.focus();
});

// 뒤로 가기로 저장된 페이지가 돌아오면 떠날 때의 검색 화면과 검색어대로 다시 그린다.
window.addEventListener('pageshow', (e) => {
  if (e.persisted) render();
});

render();
