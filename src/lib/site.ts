export const SITE = {
  url: 'https://sezz.dev',
  name: 'Semih Buğra Sezer',
  github: 'https://github.com/semihbugrasezer',
  linkedin: 'https://www.linkedin.com/in/semihbugrasezer/',
  repo: 'https://github.com/semihbugrasezer/sezz.dev',
};

// Locale-aware date formatting lives in i18n.ts.
export { formatDate } from './i18n';
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Minutes to read at ~230 wpm, code blocks counted at half weight. */
export function readingTime(body = ''): number {
  const code = (body.match(/```[\s\S]*?```/g) ?? []).join(' ');
  const prose = body.replace(/```[\s\S]*?```/g, ' ');
  const words = (s: string) => (s.match(/\S+/g) ?? []).length;
  return Math.max(1, Math.round((words(prose) + words(code) / 2) / 230));
}
