// 검색 엔진용 페이지 목록. 페이지마다 한국어·영어 주소를 짝지어 적는다.
import type { APIRoute } from 'astro';
import { loadHandbook } from '../lib/handbook.ts';
import { LANGS, type Lang } from '../lib/i18n.ts';

export const GET: APIRoute = async ({ site }) => {
  const { terms } = await loadHandbook('ko');
  const pages = ['', 'ladders/', 'terms/', 'benchmarks/', 'changelog/', ...terms.map((t) => `terms/${t.id}/`)];
  const lastmod = new Map(terms.map((t) => [`terms/${t.id}/`, t.checked]));
  const url = (lang: Lang, page: string) => new URL((lang === 'ko' ? '' : 'en/') + page, site).href;
  const body = pages
    .flatMap((page) =>
      LANGS.map(
        (lang) =>
          `<url><loc>${url(lang, page)}</loc>${lastmod.has(page) ? `<lastmod>${lastmod.get(page)}</lastmod>` : ''}` +
          LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${url(l, page)}"/>`).join('') +
          `<xhtml:link rel="alternate" hreflang="x-default" href="${url('ko', page)}"/></url>`,
      ),
    )
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
