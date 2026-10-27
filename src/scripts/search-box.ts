// 검색. 검색어가 있으면 페이지 내용을 감추고 머리글 바로 아래에 맞는 용어만 보인다. 지우면 보던 자리로 돌아간다.
import { search, type SearchEntry } from '../lib/search.ts';

const entries: SearchEntry[] = JSON.parse(document.getElementById('search-index')!.textContent!);
const input = document.getElementById('q') as HTMLInputElement;
const results = document.getElementById('results')!;
const list = results.querySelector<HTMLUListElement>('.rows')!;
const rows = new Map(Array.from(list.querySelectorAll<HTMLLIElement>('li[data-id]'), (li) => [li.dataset.id!, li]));
const empty = results.querySelector<HTMLElement>('.empty')!;
const status = results.querySelector<HTMLElement>('[role="status"]')!;

let searching = false;
let scrollBefore = 0;

function render(composing = false) {
  const q = input.value.trim();
  const found = q ? search(entries, q) : [];
  // 한글을 조합하는 중(‘ㅂ’)에는 맞는 게 없다는 말이 깜박이지 않게 앞의 결과를 그대로 둔다.
  if (composing && q && found.length === 0) return;

  if (Boolean(q) !== searching) {
    searching = Boolean(q);
    if (searching) scrollBefore = window.scrollY;
    document.body.toggleAttribute('data-searching', searching);
    results.hidden = !searching;
    window.scrollTo(0, searching ? 0 : scrollBefore);
  }
  if (!searching) return;

  const shown = new Set(found.map((e) => e.id));
  for (const e of found) list.append(rows.get(e.id)!);
  for (const [id, li] of rows) li.hidden = !shown.has(id);
  list.hidden = found.length === 0;
  empty.hidden = found.length > 0;
  empty.textContent = `‘${q}’에 맞는 용어가 없어요.`;
  status.textContent = found.length ? `용어 ${found.length}개` : empty.textContent;
}

input.addEventListener('input', (e) => render((e as InputEvent).isComposing));
input.addEventListener('compositionend', () => render());

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.isComposing) {
    const first = search(entries, input.value)[0];
    if (input.value.trim() && first) {
      input.blur();
      location.href = first.href;
    }
  } else if (e.key === 'Escape') {
    input.value = '';
    render();
  }
});

// 넓은 화면에서 ‘/’를 누르면 검색창으로 간다.
document.addEventListener('keydown', (e) => {
  const t = e.target as HTMLElement;
  if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey || t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
  e.preventDefault();
  input.focus();
});

// 뒤로 가기로 저장된 페이지가 돌아오면 입력란에 남은 검색어대로 다시 그린다.
window.addEventListener('pageshow', (e) => {
  if (e.persisted) render();
});

render();
