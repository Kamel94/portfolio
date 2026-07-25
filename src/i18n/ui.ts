export const defaultLang = 'fr';

export const ui = {
  fr: {
    'site.title': 'Kamel Azizi — Développeur Fullstack Senior',
    'site.description':
      'Développeur fullstack senior Kotlin, Java et TypeScript. Expériences, projets et articles sur le craft et le développement augmenté par l’IA.',
    'nav.experiences': 'Expériences',
    'nav.projects': 'Projets',
    'nav.articles': 'Articles',
    'nav.switchLang': 'English',
    'hero.kicker': 'Développeur Fullstack Senior — Kotlin · Java · TypeScript',
    'hero.tagline': 'J’écris du code qui dure — et des articles sur l’art de le faire.',
    'hero.ctaExperiences': 'Voir mon parcours',
    'hero.ctaArticles': 'Lire mes articles',
    'home.latestMission': 'Aujourd’hui',
    'home.projects': 'Projets choisis',
    'home.articles': 'Derniers articles',
    'home.seeAll': 'Tout voir',
    'experiences.title': 'Expériences',
    'experiences.intro':
      'Cinq ans de développement fullstack, du monolithe legacy aux plateformes cloud à fort trafic.',
    'experiences.today': 'aujourd’hui',
    'projects.title': 'Projets',
    'projects.intro':
      'Sites en production, applications personnelles et pratique délibérée.',
    'projects.demo': 'Voir le site',
    'projects.repo': 'Code source',
    'articles.title': 'Articles',
    'articles.intro':
      'Tests, specs, feature flags : des articles pour faire durer le logiciel.',
    'articles.external': 'Lire sur',
    'articles.readingTime': 'min de lecture',
    'articles.toc': 'Sommaire',
    'articles.inFrench': '',
    'footer.contact': 'Me contacter',
    'footer.rss': 'Flux RSS',
  },
  en: {
    'site.title': 'Kamel Azizi — Senior Fullstack Developer',
    'site.description':
      'Senior fullstack developer — Kotlin, Java, TypeScript. Experience, projects and articles about software craft and AI-augmented development.',
    'nav.experiences': 'Experience',
    'nav.projects': 'Projects',
    'nav.articles': 'Articles',
    'nav.switchLang': 'Français',
    'hero.kicker': 'Senior Fullstack Developer — Kotlin · Java · TypeScript',
    'hero.tagline': 'I write code that lasts — and articles about the craft of doing so.',
    'hero.ctaExperiences': 'See my experience',
    'hero.ctaArticles': 'Read my articles',
    'home.latestMission': 'Currently',
    'home.projects': 'Selected projects',
    'home.articles': 'Latest articles',
    'home.seeAll': 'See all',
    'experiences.title': 'Experience',
    'experiences.intro':
      'Five years of fullstack development, from legacy monoliths to high-traffic cloud platforms.',
    'experiences.today': 'present',
    'projects.title': 'Projects',
    'projects.intro': 'Production websites, personal apps and deliberate practice.',
    'projects.demo': 'Visit site',
    'projects.repo': 'Source code',
    'articles.title': 'Articles',
    'articles.intro':
      'Tests, specs, feature flags: articles about making software last.',
    'articles.external': 'Read on',
    'articles.readingTime': 'min read',
    'articles.toc': 'Contents',
    'articles.inFrench': 'in French',
    'footer.contact': 'Get in touch',
    'footer.rss': 'RSS feed',
  },
} as const;

export type Lang = keyof typeof ui;
export type UiKey = keyof (typeof ui)['fr'];

export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (Object.hasOwn(ui, first)) return first as Lang;
  return defaultLang;
}
