// Regenerates public/images/projects/*.webp by screenshotting each live
// project and downscaling the result. The maps are WebGL, so this needs a real
// Chrome (channel: 'chrome'), not the bundled headless shell.
//
// Deliberately NOT a devDependency: the Pages deploy runs `npm ci`, and
// Playwright there would download browsers on every build. Install unsaved,
// and skip the download since we drive the system Chrome anyway:
//
//   PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i --no-save playwright sharp
//   node scripts/capture-thumbnails.mjs            # every project
//   node scripts/capture-thumbnails.mjs <slug>...  # only the named ones
//
// Wait times are per-project because the heavier maps keep painting for a
// while after networkidle; bump one if its thumbnail comes out half-drawn.
//
// `nudge` works around a DataMapPlot bug where cluster labels do not paint
// until the view is interacted with -- on a cold load you get bare points.
// A small drag is enough to trigger the render, and unlike a zoom it leaves
// the map's default framing intact. Only DataMapPlot pages take it: the other
// projects are scrollable documents or a different map engine, where a drag
// would scroll or re-centre the page instead.
//
// A fourth field, `zoom`, is a number of wheel ticks to zoom in at the centre
// after the nudge, for maps whose default framing fits only one or two labels
// into the thumbnail.
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import sharp from 'sharp';

const T = [
  ['museum-map', 20000, true],
  ['living-people-map', 18000, true],
  ['semantic-github-map', 15000, true],
  ['atlantic-mirror', 12000, false],
  ['steam-atlas', 14000, true],
  ['movie-madness-map', 16000, true],
  ['taskmaster-map', 14000, true],
  ['jeopardy-map', 18000, true],
  ['half-america', 14000, false],
  // landing page is a dense data table; the map view is the better thumbnail
  ['claude-code-changelog-analysis/map.html', 12000, true],
  ['oeisdata-map', 16000, true],
  ['huggingface-dataset-map', 14000, true],
  ['mh-ai-research', 14000, true],
  ['ChEBI-20-datamap', 16000, true, 3],
];

const W = 1200;
const H = 750;
const OUT = new URL('../public/images/projects/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const only = process.argv.slice(2);
const todo = only.length ? T.filter(([path]) => only.includes(path.replace(/\/.*$/, ''))) : T;
const b = await chromium.launch({ channel: 'chrome' });
for (const [path, wait, nudge, zoom = 0] of todo) {
  const slug = path.replace(/\/.*$/, '');
  const url = path.endsWith('.html')
    ? `https://stevenfazzio.com/${path}`
    : `https://stevenfazzio.com/${slug}/`;
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  try {
    await p.goto(url, { waitUntil: 'load', timeout: 180000 });
    await p.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
    await p.waitForTimeout(wait);
    if (nudge) {
      await p.mouse.move(W / 2, H / 2);
      await p.mouse.down();
      await p.mouse.move(W / 2 + 15, H / 2 + 8, { steps: 6 });
      await p.mouse.up();
      await p.waitForTimeout(5000);
    }
    if (zoom) {
      await p.mouse.move(W / 2, H / 2);
      for (let i = 0; i < zoom; i++) {
        await p.mouse.wheel(0, -50);
        await p.waitForTimeout(150);
      }
      await p.waitForTimeout(5000);
    }
    const shot = await p.screenshot();
    await sharp(shot).resize(W, H, { fit: 'cover' }).webp({ quality: 82 })
      .toFile(`${OUT}/${slug}.webp`);
    console.log('OK  ', slug);
  } catch (e) {
    console.log('FAIL', slug, e.message.split('\n')[0]);
  }
  await ctx.close();
}
await b.close();
console.log('DONE');
