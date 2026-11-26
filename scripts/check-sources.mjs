// 용어의 출처 링크가 아직 열리는지, 마지막 확인 날짜가 오래되지 않았는지 본다. 네트워크가 필요해서 npm test에는 넣지 않았다.
//   npm run check:sources                  모든 출처를 열어 본다
//   npm run check:sources -- --days 120    마지막 확인이 120일보다 오래된 용어도 알린다(기본 180일, --days=120도 된다)
// 봇을 막는 사이트(www.fangraphs.com 등)는 403·429나 Cloudflare 확인 화면(503)을 주므로 ‘막힘’으로 따로 적고 실패로 치지 않는다.
// 네트워크가 잠깐 끊긴 것을 죽은 링크로 적지 않도록, 200이 아니면 조금 기다렸다가 두 번 더 열어 본다.
import { execFile } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

function readDays(argv) {
  const i = argv.findIndex((a) => a === '--days' || a.startsWith('--days='));
  if (i < 0) return 180;
  const raw = argv[i].includes('=') ? argv[i].split('=')[1] : argv[i + 1];
  const n = Number(raw);
  // 빈 값(‘--days=’)은 Number('')가 0이라 따로 막는다.
  if (!raw?.trim() || !Number.isInteger(n) || n < 0) {
    console.error(`--days에는 0 이상의 정수를 적는다(받은 값: ${raw ?? '없음'}).`);
    process.exit(2);
  }
  return n;
}

const dir = new URL('../src/content/terms/', import.meta.url);
const maxDays = readDays(process.argv.slice(2));
const terms = readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => ({ id: f.slice(0, -5), ...JSON.parse(readFileSync(new URL(f, dir), 'utf8')) }));

const today = Date.now();
const stale = terms
  .map((t) => ({ id: t.id, days: Math.floor((today - new Date(t.checked).getTime()) / 86_400_000), checked: t.checked }))
  .filter((t) => t.days > maxDays)
  .sort((a, b) => b.days - a.days);

const urls = new Map();
for (const t of terms) for (const s of t.sources) urls.set(s.u, [...(urls.get(s.u) ?? []), t.id]);

// curl이 실패할 때 내는 번호 가운데 흔한 것
const CURL = { 6: 'DNS를 찾지 못함', 7: '연결 실패', 28: '시간 초과', 35: 'TLS 연결 오류', 47: '리다이렉트가 너무 많음', 52: '빈 응답', 56: '받는 중 끊김' };

// curl로 연다. Node의 fetch는 프록시 환경 변수(HTTPS_PROXY)를 따르지 않아, 프록시 뒤에서는 모든 주소가 실패한다.
// 결과: { code: HTTP 상태(없으면 0), error: curl 오류 설명(없으면 undefined), challenge: Cloudflare 확인 화면인지 }
function probe(url) {
  return new Promise((resolve) => {
    const args = ['-s', '-o', '/dev/null', '-D', '-', '-L', '--max-redirs', '10', '--max-time', '40', '-A', 'Mozilla/5.0 (source check)', '-w', '\n%{http_code}', url];
    execFile('curl', args, { maxBuffer: 4 * 1024 * 1024 }, (err, out) => {
      // curl을 실행하지 못했으면(설치되지 않음 등) 모든 주소를 죽은 링크로 적지 않고 멈춘다.
      if (err && typeof err.code !== 'number') {
        console.error(`curl을 실행하지 못했다(${err.code}). curl을 설치한 뒤 다시 돌린다.`);
        process.exit(2);
      }
      const lines = out.trimEnd().split('\n');
      const code = Number(lines.at(-1)) || 0;
      const exit = err?.code;
      // 리다이렉트를 따라가다 멈춘 경우 등은 상태 번호가 있어도 curl 오류가 먼저다.
      const error = typeof exit === 'number' && exit !== 0 ? `curl ${exit}${CURL[exit] ? ` (${CURL[exit]})` : ''}` : undefined;
      resolve({ code, error, challenge: /^cf-mitigated:\s*challenge/im.test(out) });
    });
  });
}

const kind = (r) => (r.error ? 'dead' : r.code === 200 ? 'ok' : r.code === 403 || r.code === 429 || (r.code === 503 && r.challenge) ? 'blocked' : 'dead');
const label = (r) => r.error ?? String(r.code);

const result = new Map();
const list = [...urls.keys()];
for (let i = 0; i < list.length; i += 6) {
  const batch = list.slice(i, i + 6);
  const res = await Promise.all(batch.map(probe));
  batch.forEach((u, k) => result.set(u, res[k]));
}
// 죽은 것처럼 보이는 주소는 하나씩, 2초와 5초를 쉬고 다시 열어 본다.
for (const u of list.filter((u) => kind(result.get(u)) === 'dead')) {
  for (const wait of [2000, 5000]) {
    await sleep(wait);
    const r = await probe(u);
    result.set(u, r);
    if (kind(r) !== 'dead') break;
  }
}

const pick = (k) => list.filter((u) => kind(result.get(u)) === k).map((u) => ({ url: u, status: label(result.get(u)), terms: urls.get(u) }));
const blocked = pick('blocked');
const dead = pick('dead');

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
  console.log(`\n세 번 열어도 열리지 않는 주소 ${dead.length}개:`);
  for (const d of dead) console.log(`  ${d.status}  ${d.url}  ← ${d.terms.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log('\n열리지 않는 주소가 없다.');
}
