// Languages: English at the site root (keeps every existing URL), Turkish under /tr/, German under /de/.
// Navigation pages are translated. Long-form content (case studies, research entries, articles) stays in
// English and is marked as such in the other languages.

export const LOCALES = ['en', 'tr', 'de'] as const;
export type Lang = (typeof LOCALES)[number];
export const OTHER_LOCALES = ['tr', 'de'] as const;

export const LANG_META: Record<Lang, { name: string; short: string; bcp47: string; og: string }> = {
  en: { name: 'English', short: 'EN', bcp47: 'en', og: 'en_US' },
  tr: { name: 'Türkçe', short: 'TR', bcp47: 'tr', og: 'tr_TR' },
  de: { name: 'Deutsch', short: 'DE', bcp47: 'de', og: 'de_DE' },
};

/** Paths (without language prefix) that exist in every language. */
export const TRANSLATED_PAGES = ['/', '/ai-engineering/', '/projects/', '/research/', '/writing/', '/about/', '/now/', '/contact/', '/search/', '/open-source/'] as const;

export function getLang(url: URL): Lang {
  const seg = url.pathname.split('/')[1];
  return (OTHER_LOCALES as readonly string[]).includes(seg) ? (seg as Lang) : 'en';
}

/** Remove a /tr or /de prefix: "/tr/about/" → "/about/". */
export function stripLang(pathname: string): string {
  const m = pathname.match(/^\/(tr|de)(\/.*)?$/);
  return m ? m[2] || '/' : pathname;
}

/** Prefix a site path for a language. External URLs, anchors and files are returned unchanged. */
export function localize(path: string, lang: Lang): string {
  if (lang === 'en' || !path.startsWith('/') || path.startsWith('//')) return path;
  const [base, hash = ''] = path.split('#');
  if (!(TRANSLATED_PAGES as readonly string[]).includes(base)) return path; // English-only page
  return `/${lang}${base}${hash ? `#${hash}` : ''}`;
}

export const isTranslated = (pathname: string) => (TRANSLATED_PAGES as readonly string[]).includes(stripLang(pathname));

/** Where the language switcher should go from an English-only page: its section index. */
export function sectionIndex(pathname: string): string {
  const p = stripLang(pathname);
  if (isTranslated(p)) return p;
  if (p.startsWith('/projects/')) return '/projects/';
  if (p.startsWith('/research/')) return '/research/';
  return '/writing/';
}

const DATE_LOCALE: Record<Lang, string> = { en: 'en-GB', tr: 'tr-TR', de: 'de-DE' };
const fmts = Object.fromEntries(
  LOCALES.map((l) => [l, new Intl.DateTimeFormat(DATE_LOCALE[l], { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })]),
) as Record<Lang, Intl.DateTimeFormat>;
export const formatDate = (d: Date, lang: Lang = 'en') => fmts[lang].format(d);

export const ui = {
  en: {
    role: 'AI Engineer · Agentic AI & LLM Systems',
    // For uppercase eyebrows: English terms keep English casing (Turkish would render “AGENTİC”).
    roleHtml: 'AI Engineer · Agentic AI &amp; LLM Systems',
    title: 'Semih Buğra Sezer — AI Engineer | Agentic AI & LLM Systems',
    tagline: 'Building autonomous AI agents, intelligent workflows, and production-ready LLM applications.',
    description:
      'AI engineer focused on agentic AI, LLM applications, tool integrations and reliable AI infrastructure. Explore evidence-backed case studies, open-source software and technical research.',
    nav: { ai: 'AI Engineering', projects: 'Projects', research: 'Research', writing: 'Writing', about: 'About', now: 'Now' },
    skip: 'Skip to content',
    home: 'home',
    search: 'Search',
    toggleTheme: 'Toggle dark mode',
    language: 'Language',
    englishOnly: 'English only',
    elsewhere: 'Elsewhere',
    contact: 'Contact',
    openSource: 'Open source',
    openToWork: 'Open to AI Engineer roles',
    email: 'Email',
    siteSource: 'Site source',
    caseStudy: 'Case study',
    source: 'Source',
    live: 'Live',
    problem: 'Problem',
    demonstrates: 'Demonstrates',
    technologies: 'Technologies',
    minRead: 'min read',
    learningNote: 'Learning note',
    enBadge: 'EN',
    enBadgeTitle: 'Written in English',
  },
  tr: {
    role: 'AI Engineer · Agentic AI & LLM Sistemleri',
    roleHtml: '<span lang="en">AI Engineer · Agentic AI</span> &amp; LLM Sistemleri',
    title: 'Semih Buğra Sezer — AI Engineer | Agentic AI & LLM Sistemleri',
    tagline: 'Otonom AI ajanları, akıllı iş akışları ve canlıya hazır LLM uygulamaları geliştiriyorum.',
    description:
      'Agentic AI, LLM uygulamaları, araç entegrasyonları ve güvenilir AI altyapısına odaklanan AI mühendisi. Kanıta dayalı vaka çalışmaları, açık kaynak yazılım ve teknik araştırmalar.',
    nav: { ai: 'AI Mühendisliği', projects: 'Projeler', research: 'Araştırma', writing: 'Yazılar', about: 'Hakkımda', now: 'Şimdi' },
    skip: 'İçeriğe geç',
    home: 'ana sayfa',
    search: 'Ara',
    toggleTheme: 'Karanlık modu değiştir',
    language: 'Dil',
    englishOnly: 'Yalnızca İngilizce',
    elsewhere: 'Bağlantılar',
    contact: 'İletişim',
    openSource: 'Açık kaynak',
    openToWork: 'AI Engineer pozisyonlarına açığım',
    email: 'E-posta',
    siteSource: 'Site kaynak kodu',
    caseStudy: 'Vaka çalışması',
    source: 'Kaynak kod',
    live: 'Canlı',
    problem: 'Problem',
    demonstrates: 'Gösterdiği beceriler',
    technologies: 'Teknolojiler',
    minRead: 'dk okuma',
    learningNote: 'Öğrenme notu',
    enBadge: 'EN',
    enBadgeTitle: 'İngilizce yazılmıştır',
  },
  de: {
    role: 'AI Engineer · Agentic AI & LLM-Systeme',
    roleHtml: 'AI Engineer · Agentic AI &amp; LLM-Systeme',
    title: 'Semih Buğra Sezer — AI Engineer | Agentic AI & LLM-Systeme',
    tagline: 'Ich entwickle autonome KI-Agenten, intelligente Workflows und produktionsreife LLM-Anwendungen.',
    description:
      'AI Engineer mit Fokus auf Agentic AI, LLM-Anwendungen, Tool-Integrationen und zuverlässige KI-Infrastruktur. Belegbare Fallstudien, Open-Source-Software und technische Recherche.',
    nav: { ai: 'AI Engineering', projects: 'Projekte', research: 'Recherche', writing: 'Artikel', about: 'Über mich', now: 'Aktuell' },
    skip: 'Zum Inhalt springen',
    home: 'Startseite',
    search: 'Suche',
    toggleTheme: 'Dunkelmodus umschalten',
    language: 'Sprache',
    englishOnly: 'Nur auf Englisch',
    elsewhere: 'Profile',
    contact: 'Kontakt',
    openSource: 'Open Source',
    openToWork: 'Offen für Rollen als AI Engineer',
    email: 'E-Mail',
    siteSource: 'Quellcode der Website',
    caseStudy: 'Fallstudie',
    source: 'Quellcode',
    live: 'Live',
    problem: 'Problem',
    demonstrates: 'Belegt',
    technologies: 'Technologien',
    minRead: 'Min. Lesezeit',
    learningNote: 'Lernnotiz',
    enBadge: 'EN',
    enBadgeTitle: 'Auf Englisch verfasst',
  },
} satisfies Record<Lang, Record<string, unknown>>;

export const t = (lang: Lang) => ui[lang];
