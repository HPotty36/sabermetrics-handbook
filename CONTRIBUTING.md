# Contributing

Thanks for helping. The handbook is small on purpose, so every number and sentence gets checked. This page covers how to send a fix, how to add a term, and what the build checks for you.

## Reporting a wrong number or definition

This is the most useful kind of help. [Open an issue](../../issues/new/choose) and pick **Fix a fact or number**. Include the term, what looks wrong, and a link to the source that shows the right value. League averages need the season they belong to.

## Adding or editing a term

Each term lives in two files that share a name:

| File | Holds |
| --- | --- |
| `src/content/terms/<id>.json` | Everything that doesn't depend on language (level, categories, scale numbers, related terms, source URLs) plus the Korean text. |
| `src/content/en/terms/<id>.json` | The English text: name, summary, simple and detailed explanations, scale labels, formula, misconception, league notes, source titles. |

Then add the term to at least one topic in `src/content/ladders.json`, in order from basic to advanced, and draw its figure in `src/components/fig/terms/<id>.astro` (`npm test` fails without one). Pick the form that explains that stat best, reuse the shared pieces in `src/components/fig/` and the made-up data in `src/lib/fig.ts`, and write the labels and caption in both languages. Numbers in a figure follow the same rules as the text: definitional thresholds, checked averages with their season, or examples marked as made up.

The full schema and writing rules are in [`docs/content-guide.md`](docs/content-guide.md) (Korean). In short:

- `easy` is for someone seeing the stat for the first time: one to three paragraphs, no formulas.
- `deep` is for someone who already knows the basics: how it's calculated, when it misleads, how sources differ. One to four paragraphs.
- `myth` only when the misconception is real and common. Don't build a straw man.
- `scale.avg` names its season. In English, write the average with exactly the same number formatting the site shows (`2026 MLB average 4.17 (2025: 4.15)`).
- Don't point at the screen ("see the table below"). The site handles navigation.

### Writing

- Write every sentence yourself. Don't translate or paraphrase FanGraphs, MLB.com, Baseball Savant or any other published text. Facts, definitions and formulas are fine; link the original in `sources`.
- No real player stats as examples. Use made-up numbers.
- No unverified numbers. If you checked a number against a source, note it in [`docs/verified-facts.md`](docs/verified-facts.md) with the date.
- Korean body text uses the plain declarative style (한다체); interface text uses 해요체.
- English is plain American English, written the way a fan who knows the numbers would explain them to a friend. Avoid making stats sound like people ("WAR tells us"), decorative metaphors, and a summary sentence at the end of every paragraph.

## What the build checks

`npm test` runs the same checks as the build, without building. A pull request can't merge with any of these failing:

- Every field the schema requires, with no unknown (misspelled) fields.
- Scale marks, averages and highlighted ranges inside the scale, with marks far enough apart that their labels don't overlap.
- `related` and topic steps point at terms that exist.
- Every Korean term has an English file and vice versa, with the same scale numbers, the same source URLs in the same order, the same optional sections, and no Hangul left in the English text.

## Working on the code

```sh
npm install
npm run dev      # http://localhost:4321, English at /en/
npm test
npm run check
npm run build
```

- Keep client-side JavaScript to what's there now: search, term filters, reading order, settings (language, light/dark/auto), the back button and reading progress. Everything else is static HTML.
- Interface text lives in `src/lib/i18n.ts`, with the same keys in both languages.
- Design tokens are at the top of `src/styles/global.css`. The design rules (colors, type, the three baseball marks: seam, topic line and home-plate marker) are described in `CLAUDE.md` (Korean).
- On phones, nothing should scroll sideways at 400px, and tap targets stay around 44px.

## Pull requests

1. Branch from `main`.
2. Run `npm test`, `npm run check` and `npm run build`.
3. Open the pull request. Cloudflare Pages posts a preview deployment; check your change there in both languages and in dark mode.
