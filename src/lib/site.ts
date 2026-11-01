export const SITE = {
  url: 'https://sezz.dev',
  name: 'Semih Buğra Sezer',
  title: 'Semih Buğra Sezer — Software Engineer & Independent Researcher',
  role: 'Software Engineer · Independent Researcher · Systems Builder',
  tagline: 'Building reliable software, autonomous systems, and AI-powered developer tools.',
  description:
    'Software engineer working on backend systems, infrastructure, autonomous AI agents and practical security tooling. Engineering case studies, research notes and technical writing.',
  github: 'https://github.com/semihbugrasezer',
  linkedin: 'https://www.linkedin.com/in/semihbugrasezer/',
  repo: 'https://github.com/semihbugrasezer/sezz.dev',
};

export const NAV = [
  { href: '/projects/', label: 'Projects' },
  { href: '/research/', label: 'Research' },
  { href: '/writing/', label: 'Writing' },
  { href: '/about/', label: 'About' },
  { href: '/now/', label: 'Now' },
];

const fmt = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (d: Date) => fmt.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Minutes to read at ~230 wpm, code blocks counted at half weight. */
export function readingTime(body = ''): number {
  const code = (body.match(/```[\s\S]*?```/g) ?? []).join(' ');
  const prose = body.replace(/```[\s\S]*?```/g, ' ');
  const words = (s: string) => (s.match(/\S+/g) ?? []).length;
  return Math.max(1, Math.round((words(prose) + words(code) / 2) / 230));
}
