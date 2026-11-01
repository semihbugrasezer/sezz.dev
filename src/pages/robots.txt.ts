export const GET = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: https://sezz.dev/sitemap-index.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
