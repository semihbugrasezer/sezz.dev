export const SITE = {
  url: 'https://sezz.dev',
  name: 'Semih Buğra Sezer',
  title: 'Semih Buğra Sezer — AI Engineer | Agentic AI & LLM Systems',
  role: 'AI Engineer · Agentic AI & LLM Systems',
  tagline: 'Building AI agents, intelligent workflows, and reliable LLM-powered systems.',
  description:
    'AI engineer focused on agentic AI, LLM applications, tool integrations and reliable AI infrastructure. Explore evidence-backed case studies, open-source software and technical research.',
  github: 'https://github.com/semihbugrasezer',
  linkedin: 'https://www.linkedin.com/in/semihbugrasezer/',
  repo: 'https://github.com/semihbugrasezer/sezz.dev',
};

export const NAV = [
  { href: '/ai-engineering/', label: 'AI Engineering' },
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
