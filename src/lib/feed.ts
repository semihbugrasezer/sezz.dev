import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from './site';

/** One feed for writing + research. `by` picks the date field used for ordering. */
export async function feed(by: 'created' | 'updated') {
  const writing = await getCollection('writing', (e) => !e.data.draft);
  const research = await getCollection('research', (e) => !e.data.draft);
  const items = [
    ...writing.map((e) => ({ title: e.data.title, description: e.data.description, link: `/${e.data.slug}/`, d: e.data, categories: [e.data.topic, ...e.data.tags] })),
    ...research.map((e) => ({ title: e.data.title, description: e.data.description, link: `/research/${e.id}/`, d: e.data, categories: ['Research', e.data.type, ...e.data.tags] })),
  ]
    .map(({ d, ...i }) => ({ ...i, pubDate: by === 'updated' ? (d.updated ?? d.created) : d.created }))
    .sort((a, b) => +b.pubDate - +a.pubDate);

  return rss({
    title: 'sezz.dev — Semih Buğra Sezer',
    description: 'Engineering writing and independent research notes.',
    site: SITE.url,
    items,
    customData: '<language>en</language>',
    trailingSlash: true,
  });
}
