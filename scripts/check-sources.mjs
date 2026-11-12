// 용어의 출처 링크가 아직 열리는지, 마지막 확인 날짜가 오래되지 않았는지 본다. 네트워크가 필요해서 npm test에는 넣지 않았다.
//   npm run check:sources            모든 출처를 열어 본다
//   npm run check:sources -- --days 120   마지막 확인이 120일보다 오래된 용어도 알린다(기본 180일)
// 봇을 막는 사이트(www.fangraphs.com 등)는 403을 주므로 ‘막힘’으로 따로 적고 실패로 치지 않는다.
import { execFile } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';

const dir = new URL('../src/content/terms/', import.meta.url);
const daysArg = process.argv.indexOf('--days');
const maxDays = daysArg > 0 ? Number(process.argv[daysArg + 1]) : 180;
const terms = readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => ({ id: f.slice(0, -5), ...JSON.parse(readFileSync(new URL(f, dir), 'utf8')) }));

const today = Date.now();
const stale = terms
  .map((t) => ({ id: t.id, days: Math.floor((today - new Date(t.checked).getTime()) / 86_400_000), checked: t.checked }))
  .filter((t) => t.days > maxDays)
  .sort((a, b) => b.days - a.days);

const urls = new Map();
for (const t of terms) for (const s of t.sources) urls.set(s.u, [...(urls.get(s.u) ?? []), t.id]);

// curl로 연다. Node의 fetch는 프록시 환경 변수(HTTPS_PROXY)를 따르지 않아, 프록시 뒤에서는 모든 주소가 실패한다.
function probe(url) {
  return new Promise((resolve) => {
    execFile('curl', ['-s', '-o', '/dev/null', '-L', '--max-time', '40', '-A', 'Mozilla/5.0 (source check)', '-w', '%{http_code}', url], (err, out) => {
      const code = Number(out);
      resolve(code || `curl ${err?.code ?? '?'}`);
    });
  });
}

const dead = [];
const blocked = [];
const list = [...urls.keys()];
for (let i = 0; i < list.length; i += 6) {
  const batch = list.slice(i, i + 6);
  const res = await Promise.all(batch.map(probe));
  batch.forEach((u, k) => {
    const s = res[k];
    if (s === 200) return;
    (s === 403 || s === 429 ? blocked : dead).push({ url: u, status: s, terms: urls.get(u) });
  });
}

console.log(`용어 ${terms.length}개, 출처 주소 ${list.length}개`);
if (stale.length) {
  console.log(`\n마지막 확인이 ${maxDays}일보다 오래된 용어 ${stale.length}개:`);
  for (const t of stale) console.log(`  ${t.id}  ${t.checked} (${t.days}일 전)`);
}
if (blocked.length) {
  console.log(`\n자동 요청을 막아 확인하지 못한 주소 ${blocked.length}개:`);
  for (const b of blocked) console.log(`  ${b.status}  ${b.url}  ← ${b.terms.join(', ')}`);
}
if (dead.length) {
  console.log(`\n열리지 않는 주소 ${dead.length}개:`);
  for (const d of dead) console.log(`  ${d.status}  ${d.url}  ← ${d.terms.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log('\n열리지 않는 주소가 없다.');
}
