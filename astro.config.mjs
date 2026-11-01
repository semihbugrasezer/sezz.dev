// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sezz.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
      // Adds hreflang alternates for pages that exist under /, /tr/ and /de/.
      i18n: { defaultLocale: 'en', locales: { en: 'en', tr: 'tr', de: 'de' } },
    }),
  ],
  markdown: {
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
    },
  },
});
