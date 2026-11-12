// 바뀐 내용의 RSS. 한국어는 /rss.xml, 영어는 /en/rss.xml.
import type { APIRoute } from 'astro';
import changelog from '../../content/changelog.json';
import { langPaths, ui, type Lang } from '../../lib/i18n.ts';

export const getStaticPaths = langPaths;

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = ({ props, site }) => {
  const lang = (props as { lang: Lang }).lang;
  const s = ui(lang);
  const link = new URL(`${lang === 'ko' ? '' : 'en/'}changelog/`, site).href;
  const items = changelog
    .map((c, i) => {
      const n = changelog.length - i;
      return `<item><title>${esc(c[lang])}</title><link>${link}</link><guid isPermaLink="false">${link}#${n}</guid><pubDate>${new Date(c.date).toUTCString()}</pubDate></item>`;
    })
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${esc(s.siteName)} · ${esc(s.changelog)}</title><link>${link}</link><description>${esc(s.changelogDescription)}</description><language>${lang}</language>\n${items}\n</channel></rss>\n`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } },
  );
};
