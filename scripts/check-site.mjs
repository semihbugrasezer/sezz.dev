// Post-build checks for dist/. Fails the build on:
//  1. a URL from the previous (MkDocs) site that neither exists nor is redirected,
//  2. an internal link or asset reference that does not resolve,
//  3. a <script src> loaded from another origin.
// Netlify CLI is not required: redirects are read from netlify.toml.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const SITE = 'https://sezz.dev';

// Public URLs of sezz.dev captured from the live sitemap on 2026-10-31, plus the two RSS feeds.
const LEGACY = [
  '/', '/projects/', '/tags/',
  '/cline-memory-bank-a-practical-guide-to-persistent-ai-context/',
  '/epic-react-articles-a-guided-reading-path/',
  '/building-a-restful-api-with-go/',
  '/javascript-guide-roadmap-a-tutorial-path-for-learners/',
  '/javascript-fundamentals-tutorial-a-reference-for-learners/',
  '/mdn-javascript-reference-notes-a-practical-map/',
  '/react-tutorial-production-ready-patterns-for-learners/',
  '/react-quick-start-notes-a-beginner-friendly-tutorial/',
  '/react-state-and-data-flow-tutorial-a-learners-reference/',
  '/redux-toolkit-tutorial-reference-the-smallest-practical-path/',
  '/thinking-in-react-a-step-by-step-tutorial-reference/',
  '/typescript-jsx-primer-a-short-tutorial-for-react-learners/',
  '/typescript--react-handbook-notes-a-compact-tutorial/',
  '/archive/2026/', '/archive/2024/',
  '/category/productivity/', '/category/react/', '/category/javascript/', '/category/golang/',
  '/page/2/', '/archive/2026/page/2/',
  '/feed_rss_created.xml', '/feed_rss_updated.xml',
];

// Minimal parser for the [[redirects]] tables we write in netlify.toml.
function redirects() {
  const toml = readFileSync('netlify.toml', 'utf8');
  return [...toml.matchAll(/\[\[redirects\]\][^[]*?from\s*=\s*"([^"]+)"[^[]*?to\s*=\s*"([^"]+)"/g)].map(([, from, to]) => ({ from, to }));
}
const RULES = redirects();

function fileFor(path) {
  const p = decodeURI(path.split(/[?#]/)[0]);
  const candidates = p.endsWith('/') ? [join(DIST, p, 'index.html')] : [join(DIST, p), join(DIST, p, 'index.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
}
function redirectFor(path) {
  return RULES.find(({ from }) => (from.endsWith('*') ? path.startsWith(from.slice(0, -1)) : path === from));
}
function resolves(path) {
  if (fileFor(path)) return true;
  const r = redirectFor(path);
  return !!r && !!fileFor(r.to);
}

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const errors = [];

for (const url of LEGACY) if (!resolves(url)) errors.push(`legacy URL not served or redirected: ${url}`);

let pages = 0, links = 0;
for (const file of walk(DIST)) {
  if (!file.endsWith('.html') || file.includes(`${DIST}/pagefind`)) continue;
  pages++;
  const html = readFileSync(file, 'utf8');
  const here = '/' + relative(DIST, file).replace(/index\.html$/, '').replace(/\\/g, '/');

  for (const [, src] of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
    if (/^(https?:)?\/\//.test(src) && !src.startsWith(SITE)) errors.push(`${here}: third-party script ${src}`);
  }
  // Ignore inline script bodies: template strings there are not markup.
  const markup = html.replace(/(<script[^>]*>)[\s\S]*?<\/script>/g, '$1</script>');
  for (const [, attr, raw] of markup.matchAll(/\s(href|src)="([^"]+)"/g)) {
    let url = raw.replace(/&amp;/g, '&');
    if (url.startsWith(SITE)) url = url.slice(SITE.length) || '/';
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(url)) continue;
    if (!url.startsWith('/')) url = new URL(url, `https://x${here}`).pathname;
    const path = url.split(/[?#]/)[0];
    links++;
    if (!resolves(path)) errors.push(`${here}: broken ${attr} → ${raw}`);
    // Internal page links should use the canonical trailing slash.
    else if (attr === 'href' && !path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path)) errors.push(`${here}: link without trailing slash → ${raw}`);
  }
}

if (errors.length) {
  console.error(`check-site: ${errors.length} problem(s)\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`check-site: ${LEGACY.length} legacy URLs ok, ${links} internal references across ${pages} pages ok, no third-party scripts.`);
