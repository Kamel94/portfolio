# Portfolio Kamel Azizi — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire le portfolio statique bilingue (FR/EN) de Kamel Azizi — expériences, projets, articles — selon la spec `docs/superpowers/specs/2026-07-24-portfolio-design.md`, déployé sur Hostinger via GitHub Actions.

**Architecture:** Site Astro 100 % statique, multi-pages, contenu en Content Collections markdown (`experiences`, `projects`, `articles`). i18n par routing natif Astro (FR à la racine, EN sous `/en/`), pages par locale = fines enveloppes autour de composants « View » partagés. Rendu mermaid au build (rehype-mermaid), Shiki pour le code, RSS + sitemap + OG images générés au build.

**Tech Stack:** Astro ^6, TypeScript strict, Vitest (tests des utils), @fontsource (Fraunces, Inter, JetBrains Mono), rehype-mermaid + Playwright, @astrojs/sitemap, @astrojs/rss, astro-og-canvas, GitHub Actions + FTP deploy Hostinger.

## Global Constraints

- Node ≥ 22, npm (pas de pnpm/yarn). Astro ^6.
- Zéro JavaScript client (pas de framework UI côté client, pas de JS mermaid client).
- Polices auto-hébergées via @fontsource — **jamais** de Google Fonts ni CDN externe.
- Couleurs : fond crème `#faf6f0`, encre `#1a1a1a`, accent terracotta `#9a3b2e`, ligne `#e8e0d4`, texte secondaire `#6b6259`, surface `#ffffff`. Clair uniquement, pas de dark mode.
- Contraste AA minimum sur tous les textes.
- URL du site : `https://kamelazizi.dev` (constante unique dans `astro.config.mjs` — à confirmer par Kamel avant le déploiement, une seule ligne à changer).
- Locale par défaut `fr` à la racine, `en` préfixé `/en/`. Articles en FR uniquement.
- Messages de commit en français, style conventional commits (`feat:`, `docs:`, `ci:`…). **Interdiction absolue d'ajouter un trailer `Co-Authored-By` ou toute mention d'IA dans les commits.**
- Le repo deviendra public : ne jamais commiter de secret (FTP, etc.).
- Sources de contenu (lecture seule, ne pas modifier) :
  - CV : `<fichier local, hors dépôt>`
  - Article SDD : `<fichier local, hors dépôt>`
  - Article OpenFeature : `<fichier local, hors dépôt>` (+ PDF `article-openfeature-devoxx2026-avec-images.pdf` du même dossier)

---

### Task 1: Scaffold Astro + config i18n

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`
- Modify: `.gitignore`

**Interfaces:**
- Produces: projet Astro buildable ; `astro.config.mjs` avec `site`, `i18n` (fr racine, en préfixé) et l'intégration sitemap — les tâches suivantes ne modifient ce fichier que pour le markdown (Tasks 6-7).

- [ ] **Step 1: Créer package.json**

```json
{
  "name": "kamel-azizi-portfolio",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: Installer les dépendances**

Run: `npm install astro @astrojs/sitemap`
Expected: `added N packages`, `package-lock.json` créé.

- [ ] **Step 3: Créer tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Créer astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kamelazizi.dev',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap()],
});
```

- [ ] **Step 5: Créer une page d'accueil provisoire** (remplacée en Task 9)

`src/pages/index.astro` :

```astro
---
---
<html lang="fr">
  <head><meta charset="utf-8" /><title>Kamel Azizi</title></head>
  <body><h1>Kamel Azizi</h1></body>
</html>
```

- [ ] **Step 6: Compléter .gitignore**

Ajouter à la suite du contenu existant (`.superpowers/`) :

```
node_modules/
dist/
.astro/
```

- [ ] **Step 7: Vérifier le build**

Run: `npm run build`
Expected: `Complete!` — `dist/index.html` et `dist/sitemap-index.xml` existent.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/pages/index.astro .gitignore
git commit -m "feat: scaffold Astro avec i18n fr/en et sitemap"
```

---

### Task 2: Utils testés (i18n, email, dates) avec Vitest

**Files:**
- Create: `vitest.config.ts`, `src/i18n/ui.ts`, `src/utils/email.ts`, `src/utils/date.ts`
- Test: `src/i18n/ui.test.ts`, `src/utils/email.test.ts`, `src/utils/date.test.ts`

**Interfaces:**
- Produces:
  - `ui.ts` : `type Lang = 'fr' | 'en'` ; `defaultLang: Lang` ; `ui: Record<Lang, Record<UiKey, string>>` ; `useTranslations(lang: Lang): (key: UiKey) => string` ; `getLangFromUrl(url: URL): Lang`.
  - `email.ts` : `obfuscateEmail(email: string): string` — chaque caractère en entité HTML décimale.
  - `date.ts` : `formatMonthYear(date: Date, lang: Lang): string` (ex. `juin 2024` / `June 2024`).

- [ ] **Step 1: Installer Vitest et créer sa config**

Run: `npm install --save-dev vitest`

`vitest.config.ts` :

```ts
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 2: Écrire les tests (rouges d'abord)**

`src/utils/email.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { obfuscateEmail } from './email';

describe('obfuscateEmail', () => {
  it('encode chaque caractère en entité HTML décimale', () => {
    expect(obfuscateEmail('a@b.c')).toBe('&#97;&#64;&#98;&#46;&#99;');
  });
});
```

`src/utils/date.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { formatMonthYear } from './date';

describe('formatMonthYear', () => {
  const d = new Date('2024-06-01');
  it('formate en français', () => {
    expect(formatMonthYear(d, 'fr')).toBe('juin 2024');
  });
  it('formate en anglais', () => {
    expect(formatMonthYear(d, 'en')).toBe('June 2024');
  });
});
```

`src/i18n/ui.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { getLangFromUrl, useTranslations } from './ui';

describe('useTranslations', () => {
  it('retourne la chaîne de la langue demandée', () => {
    expect(useTranslations('en')('nav.experiences')).toBe('Experience');
  });
  it('retombe sur le français si la clé manque en anglais', () => {
    expect(useTranslations('fr')('nav.experiences')).toBe('Expériences');
  });
});

describe('getLangFromUrl', () => {
  it('détecte /en/', () => {
    expect(getLangFromUrl(new URL('https://x.dev/en/articles'))).toBe('en');
  });
  it('retombe sur fr à la racine', () => {
    expect(getLangFromUrl(new URL('https://x.dev/experiences'))).toBe('fr');
  });
});
```

- [ ] **Step 3: Vérifier que les tests échouent**

Run: `npm test`
Expected: FAIL — modules `./email`, `./date`, `./ui` introuvables.

- [ ] **Step 4: Implémenter les trois modules**

`src/utils/email.ts` :

```ts
export function obfuscateEmail(email: string): string {
  return [...email].map((c) => `&#${c.codePointAt(0)};`).join('');
}
```

`src/utils/date.ts` :

```ts
import type { Lang } from '../i18n/ui';

export function formatMonthYear(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}
```

`src/i18n/ui.ts` :

```ts
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
    'projects.learned': 'Ce que j’ai appris',
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
    'projects.learned': 'What I learned',
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
  if (first in ui) return first as Lang;
  return defaultLang;
}
```

- [ ] **Step 5: Vérifier que les tests passent**

Run: `npm test`
Expected: PASS — 6 tests verts.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts src/i18n src/utils package.json package-lock.json
git commit -m "feat: utils i18n, email et dates testés avec Vitest"
```

---

### Task 3: Design system + layout de base (Header, Footer)

**Files:**
- Create: `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/StackBadges.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `useTranslations`, `getLangFromUrl`, `obfuscateEmail` (Task 2).
- Produces:
  - `BaseLayout.astro` — props `{ lang: Lang; title: string; description: string; alternateHref?: string; ogImage?: string }`. `alternateHref` = chemin de la même page dans l'autre langue (hreflang + lien de bascule du header). Slot par défaut = contenu de page. (Les meta OG complètes arrivent en Task 10 ; ici : title, description, canonical, hreflang.)
  - `StackBadges.astro` — props `{ stack: string[] }`, liste de badges monospace.
  - Classes CSS globales : `.container` (max-width 72rem centré), `.section-heading` (numérotation éditoriale), `.prose` (typo articles).

- [ ] **Step 1: Installer les polices**

Run: `npm install @fontsource-variable/fraunces @fontsource-variable/inter @fontsource-variable/jetbrains-mono`

- [ ] **Step 2: Créer src/styles/global.css**

```css
:root {
  --bg: #faf6f0;
  --ink: #1a1a1a;
  --accent: #9a3b2e;
  --muted: #6b6259;
  --line: #e8e0d4;
  --surface: #ffffff;
  --font-serif: 'Fraunces Variable', Georgia, serif;
  --font-sans: 'Inter Variable', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono Variable', Menlo, monospace;
}

* { box-sizing: border-box; margin: 0; }

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  line-height: 1.65;
}

h1, h2, h3 { font-family: var(--font-serif); line-height: 1.15; font-weight: 640; }
h1 { font-size: clamp(2.4rem, 6vw, 3.6rem); }
h2 { font-size: clamp(1.6rem, 4vw, 2.2rem); }

a { color: var(--accent); text-decoration-thickness: 1px; text-underline-offset: 3px; }
a:hover { text-decoration-thickness: 2px; }

.container { max-width: 72rem; margin-inline: auto; padding-inline: 1.5rem; }

.kicker {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 600;
}

.section-heading {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  border-bottom: 1px solid var(--line);
  padding-bottom: 0.75rem;
  margin-bottom: 2rem;
}
.section-heading .num {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--accent);
}

.badge {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 3px;
  padding: 0.15rem 0.5rem;
  color: var(--muted);
  white-space: nowrap;
}

.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 1.5rem;
}

.prose { max-width: 42rem; }
.prose h2, .prose h3 { margin-top: 2.2rem; margin-bottom: 0.8rem; }
.prose p, .prose ul, .prose ol { margin-bottom: 1.1rem; }
.prose li { margin-bottom: 0.35rem; }
.prose blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  color: var(--muted);
  font-style: italic;
}
.prose pre {
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.85rem;
}
.prose code { font-family: var(--font-mono); font-size: 0.88em; }
.prose img, .prose svg { max-width: 100%; height: auto; }
```

- [ ] **Step 3: Créer Header.astro**

```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';
import { useTranslations, type Lang } from '../i18n/ui';

interface Props { lang: Lang; alternateHref?: string }
const { lang, alternateHref } = Astro.props;
const t = useTranslations(lang);
const other = lang === 'fr' ? 'en' : 'fr';
---
<header class="container site-header">
  <a class="logo" href={getRelativeLocaleUrl(lang, '/')}>KA</a>
  <nav>
    <a href={getRelativeLocaleUrl(lang, 'experiences')}>{t('nav.experiences')}</a>
    <a href={getRelativeLocaleUrl(lang, lang === 'fr' ? 'projets' : 'projects')}>{t('nav.projects')}</a>
    <a href={getRelativeLocaleUrl(lang, 'articles')}>{t('nav.articles')}</a>
    {alternateHref && <a class="lang-switch" href={alternateHref}>{t('nav.switchLang')}</a>}
  </nav>
</header>
<style>
  .site-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-block: 1.25rem;
  }
  .logo {
    font-family: var(--font-serif);
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--ink);
    text-decoration: none;
  }
  nav { display: flex; gap: 1.25rem; align-items: center; flex-wrap: wrap; }
  nav a { color: var(--ink); text-decoration: none; font-size: 0.95rem; }
  nav a:hover { color: var(--accent); }
  .lang-switch {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    border: 1px solid var(--line);
    border-radius: 3px;
    padding: 0.15rem 0.5rem;
  }
</style>
```

- [ ] **Step 4: Créer Footer.astro**

Email affiché et lien `mailto:` tous deux encodés en entités HTML (décodées par le navigateur, illisibles pour les scrapers basiques).

```astro
---
import { useTranslations, type Lang } from '../i18n/ui';
import { obfuscateEmail } from '../utils/email';

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
const email = obfuscateEmail('contact@kameldev.fr');
const mailto = `&#109;&#97;&#105;&#108;&#116;&#111;&#58;${email}`;
---
<footer>
  <div class="container footer-inner">
    <p class="kicker">{t('footer.contact')}</p>
    <ul>
      <li><a href={mailto} set:html={email} /></li>
      <li><a href="https://www.linkedin.com/in/kamel-azizi" rel="me">LinkedIn</a></li>
      <li><a href="https://github.com/Kamel94" rel="me">GitHub</a></li>
      <li><a href="/rss.xml">{t('footer.rss')}</a></li>
    </ul>
    <p class="colophon">© {new Date().getFullYear()} Kamel Azizi</p>
  </div>
</footer>
<style>
  footer { border-top: 1px solid var(--line); margin-top: 5rem; }
  .footer-inner { padding-block: 2.5rem; }
  ul { list-style: none; padding: 0; display: flex; gap: 1.5rem; flex-wrap: wrap; margin-block: 0.75rem; }
  .colophon { color: var(--muted); font-size: 0.85rem; }
</style>
```

Note : l'URL LinkedIn exacte est à confirmer auprès de Kamel avant le déploiement (marqueur unique dans ce fichier).

- [ ] **Step 5: Créer StackBadges.astro**

```astro
---
interface Props { stack: string[] }
const { stack } = Astro.props;
---
<ul class="stack">
  {stack.map((s) => <li class="badge">{s}</li>)}
</ul>
<style>
  .stack { list-style: none; padding: 0; display: flex; gap: 0.4rem; flex-wrap: wrap; }
</style>
```

- [ ] **Step 6: Créer BaseLayout.astro**

```astro
---
import '@fontsource-variable/fraunces';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import type { Lang } from '../i18n/ui';

interface Props {
  lang: Lang;
  title: string;
  description: string;
  alternateHref?: string;
  ogImage?: string;
}
const { lang, title, description, alternateHref, ogImage } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
---
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    {alternateHref && (
      <link rel="alternate" hreflang={lang === 'fr' ? 'en' : 'fr'} href={new URL(alternateHref, Astro.site)} />
    )}
    <link rel="alternate" type="application/rss+xml" title="Kamel Azizi — Articles" href={new URL('rss.xml', Astro.site)} />
    <link rel="sitemap" href="/sitemap-index.xml" />
    {ogImage && <meta property="og:image" content={new URL(ogImage, Astro.site)} />}
  </head>
  <body>
    <Header lang={lang} alternateHref={alternateHref} />
    <main class="container">
      <slot />
    </main>
    <Footer lang={lang} />
  </body>
</html>
```

- [ ] **Step 7: Brancher la home provisoire sur le layout**

Remplacer `src/pages/index.astro` par :

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { useTranslations } from '../i18n/ui';
const t = useTranslations('fr');
---
<BaseLayout lang="fr" title={t('site.title')} description={t('site.description')} alternateHref="/en/">
  <h1>Kamel Azizi.</h1>
</BaseLayout>
```

- [ ] **Step 8: Vérifier build + rendu**

Run: `npm run build && grep -c "Fraunces" dist/index.html`
Expected: build OK, au moins 1 occurrence (CSS des polices inliné ou lié).

Run: `grep -o "&#108;&#105;&#118;&#51;" dist/index.html | head -1`
Expected: `&#108;&#105;&#118;&#51;` — l'email n'apparaît jamais en clair (`grep -c "contact" dist/index.html` doit retourner 0).

- [ ] **Step 9: Commit**

```bash
git add src/styles src/layouts src/components src/pages/index.astro package.json package-lock.json
git commit -m "feat: design system éditorial et layout de base"
```

---

### Task 4: Collections de contenu + page Expériences (FR/EN)

**Files:**
- Create: `src/content.config.ts`, 8 fichiers dans `src/content/experiences/{fr,en}/`, `src/components/views/ExperiencesView.astro`, `src/pages/experiences.astro`, `src/pages/en/experiences.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `StackBadges`, `formatMonthYear`, `useTranslations`.
- Produces:
  - `content.config.ts` exporte `collections = { experiences, projects, articles }` — schémas complets ci-dessous (Tasks 5-6 ajoutent le contenu, pas de schéma).
  - Collection `experiences` : frontmatter `{ lang, company, role, startDate, endDate?, stack[], summary }`, body = puces de réalisations.

- [ ] **Step 1: Créer src/content.config.ts** (les trois schémas d'un coup)

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const experiences = defineCollection({
  loader: glob({ base: './src/content/experiences', pattern: '**/*.md' }),
  schema: z.object({
    lang: z.enum(['fr', 'en']),
    company: z.string(),
    role: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    stack: z.array(z.string()),
    summary: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    lang: z.enum(['fr', 'en']),
    title: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    stack: z.array(z.string()),
    summary: z.string(),
    demoUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
  }),
});

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    externalUrl: z.string().url().optional(),
    externalHost: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { experiences, projects, articles };
```

- [ ] **Step 2: Créer le contenu FR des 4 expériences**

`src/content/experiences/fr/sncf-connect-apv.md` :

```markdown
---
lang: fr
company: SNCF Connect
role: Développeur Kotlin Fullstack
startDate: 2024-06-01
stack: [Kotlin, Java 21, Spring Boot, NextJS, react-query, Flutter, MongoDB, DynamoDB, AWS, Kubernetes, Datadog]
summary: Après-vente (APV) de l'application SNCF Connect — réserver, échanger ou annuler un billet de train — au sein d'une équipe de 15 personnes, sur une application web/mobile à très fort trafic.
---
- Ajout de la fonctionnalité d'ajout/annulation d'un animal sur un voyage déjà réservé
- Mise en place de l'échange « multi-inventaires » en après-vente
- Mise en place d'un chatbot pour l'après-vente
- Ajout d'un circuit breaker sur des endpoints sensibles et activation progressive via feature toggles
- Monorepo, pair/mob programming, revues croisées, Sonarqube
- Infrastructure AWS (K8S, DynamoDB, Route53, KMS, Lambda), monitoring Datadog et OpenSearch
```

`src/content/experiences/fr/sncf-connect-madoc.md` :

```markdown
---
lang: fr
company: SNCF Connect
role: Développeur Kotlin Fullstack
startDate: 2023-06-01
endDate: 2024-06-01
stack: [Kotlin, Quarkus, GraalVM, MongoDB, React, Material-UI, Jotaï, AWS, Flux CD, Helm]
summary: MaDOC, application de gestion documentaire construite from scratch pour les métiers du ferroviaire (conducteurs, agents terrestres) — signature de documents émis dans l'application.
---
- Backend Kotlin/Quarkus en architecture hexagonale, compilé avec GraalVM
- Manipulation de PDF via iText, upload S3, réécriture d'un service SOAP
- Frontend React/TypeScript : mise en place et maintenance de 2 librairies NPM internes (authentification OpenAM, design system Material-UI + Storybook)
- Génération automatique des types depuis OpenAPI (swagger-typescript-api), react-query + Jotaï
- GitOps sur AWS : K8S, Flux CD, Helm ; migrations MongoDB avec Mongock
```

`src/content/experiences/fr/officeo.md` :

```markdown
---
lang: fr
company: Officéo
role: Développeur Java Fullstack
startDate: 2021-03-01
endDate: 2023-02-28
stack: [Java 11, Spring Boot, MySQL, VueJS, Vuetify, GraphQL, Keycloak, Docker]
summary: Chez le leader français de l'Office Management à la demande, en binôme direct avec le CTO — refonte du Back Office et évolutions des applications Client et Assistant.
---
- Mise en place du nouveau Back Office VueJS/Vuetify en remplacement de l'ancien (Java 6), migration des fonctionnalités
- Création d'APIs REST et GraphQL (nouvelle application Spring Boot dédiée)
- CRONs dynamiques : activables, reprogrammables via API, avec journal d'exécution en base
- Participation à la conception, documentation, tests unitaires JUnit
```

`src/content/experiences/fr/association.md` :

```markdown
---
lang: fr
company: Association
role: Développeur Java Fullstack
startDate: 2020-10-01
endDate: 2020-12-31
stack: [Java 8, Spring Boot, Spring Cloud, PostgreSQL, Angular, Docker]
summary: Application de gestion des adhérents pour une association d'entraide funéraire — architecture microservices avec gateway.
---
- Mise en œuvre d'une architecture microservices : gateway, Eureka, proxy OpenFeign avec Spring Cloud
- CRON d'envoi automatique de mails de rappel de cotisation
- APIs REST, documentation, tests unitaires JUnit
```

- [ ] **Step 3: Créer le contenu EN des 4 expériences**

Mêmes fichiers sous `src/content/experiences/en/` avec `lang: en`, mêmes frontmatter (dates, stack identiques), `summary` et puces traduits. Traductions complètes :

`en/sncf-connect-apv.md` — summary: `After-sales (APV) for the SNCF Connect app — booking, exchanging or cancelling train tickets — in a 15-person team, on a very high-traffic web/mobile application.` Body :

```markdown
- Built the feature to add or cancel a pet on an already-booked trip
- Implemented "multi-inventory" exchanges for after-sales
- Set up an after-sales chatbot
- Added a circuit breaker on sensitive endpoints, progressive rollout via feature toggles
- Monorepo, pair/mob programming, cross reviews, Sonarqube
- AWS infrastructure (K8S, DynamoDB, Route53, KMS, Lambda), Datadog and OpenSearch monitoring
```

`en/sncf-connect-madoc.md` — summary: `MaDOC, a document-management application built from scratch for railway field workers (train drivers, ground agents) — signing documents issued within the app.` Body :

```markdown
- Kotlin/Quarkus backend with hexagonal architecture, compiled with GraalVM
- PDF processing with iText, S3 uploads, rewrite of a SOAP service
- React/TypeScript frontend: built and maintained 2 internal NPM libraries (OpenAM authentication, Material-UI + Storybook design system)
- Types generated from OpenAPI (swagger-typescript-api), react-query + Jotai
- GitOps on AWS: K8S, Flux CD, Helm; MongoDB migrations with Mongock
```

`en/officeo.md` — summary: `At the French leader of on-demand office management, pairing directly with the CTO — rebuilt the Back Office and evolved the Client and Assistant applications.` Body :

```markdown
- Built the new VueJS/Vuetify Back Office replacing the legacy one (Java 6), migrated its features
- Created REST and GraphQL APIs (dedicated new Spring Boot application)
- Dynamic CRON jobs: toggleable, reschedulable through an API, with an execution log in database
- Application design, documentation, JUnit unit tests
```

`en/association.md` — summary: `Member-management application for a funeral mutual-aid association — microservices architecture behind a gateway.` Body :

```markdown
- Microservices architecture: gateway, Eureka, OpenFeign proxy with Spring Cloud
- Automated CRON reminder emails for overdue membership fees
- REST APIs, documentation, JUnit unit tests
```

- [ ] **Step 4: Créer ExperiencesView.astro**

`src/components/views/ExperiencesView.astro` :

```astro
---
import { getCollection } from 'astro:content';
import { render } from 'astro:content';
import StackBadges from '../StackBadges.astro';
import { formatMonthYear } from '../../utils/date';
import { useTranslations, type Lang } from '../../i18n/ui';

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);

const entries = (await getCollection('experiences', ({ data }) => data.lang === lang))
  .sort((a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf());

const rendered = await Promise.all(
  entries.map(async (e) => ({ entry: e, Content: (await render(e)).Content }))
);
---
<h1>{t('experiences.title')}</h1>
<p class="intro">{t('experiences.intro')}</p>
<ol class="timeline">
  {rendered.map(({ entry, Content }) => (
    <li>
      <p class="period kicker">
        {formatMonthYear(entry.data.startDate, lang)} — {entry.data.endDate
          ? formatMonthYear(entry.data.endDate, lang)
          : t('experiences.today')}
      </p>
      <h2>{entry.data.role} · {entry.data.company}</h2>
      <p class="summary">{entry.data.summary}</p>
      <div class="details"><Content /></div>
      <StackBadges stack={entry.data.stack} />
    </li>
  ))}
</ol>
<style>
  .intro { color: var(--muted); max-width: 38rem; margin-block: 0.75rem 3rem; }
  .timeline { list-style: none; padding: 0; }
  .timeline li {
    border-left: 2px solid var(--accent);
    padding: 0 0 3rem 1.75rem;
    position: relative;
  }
  .timeline li::before {
    content: '';
    position: absolute;
    left: -6px;
    top: 0.4rem;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent);
  }
  .period { margin-bottom: 0.4rem; }
  h2 { font-size: 1.45rem; }
  .summary { margin-block: 0.6rem; max-width: 40rem; }
  .details { color: var(--muted); font-size: 0.95rem; max-width: 40rem; margin-bottom: 1rem; }
  .details :global(ul) { padding-left: 1.1rem; }
</style>
```

- [ ] **Step 5: Créer les deux pages**

`src/pages/experiences.astro` :

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ExperiencesView from '../components/views/ExperiencesView.astro';
import { useTranslations } from '../i18n/ui';
const t = useTranslations('fr');
---
<BaseLayout
  lang="fr"
  title={`${t('experiences.title')} — Kamel Azizi`}
  description={t('experiences.intro')}
  alternateHref="/en/experiences/"
>
  <ExperiencesView lang="fr" />
</BaseLayout>
```

`src/pages/en/experiences.astro` : identique avec `lang="en"`, `useTranslations('en')`, `alternateHref="/experiences/"`.

- [ ] **Step 6: Vérifier le build**

Run: `npm run build && grep -c "SNCF Connect" dist/experiences/index.html && grep -c "multi-inventory" dist/en/experiences/index.html`
Expected: build OK, les deux grep ≥ 1.

- [ ] **Step 7: Commit**

```bash
git add src/content.config.ts src/content/experiences src/components/views/ExperiencesView.astro src/pages/experiences.astro src/pages/en/experiences.astro
git commit -m "feat: collections de contenu et page expériences bilingue"
```

---

### Task 5: Contenu Projets + page Projets (FR/EN)

**Files:**
- Create: 10 fichiers dans `src/content/projects/{fr,en}/`, `src/components/views/ProjectsView.astro`, `src/pages/projets.astro`, `src/pages/en/projects.astro`

**Interfaces:**
- Consumes: schéma `projects` (Task 4), `BaseLayout`, `StackBadges`, `useTranslations`.
- Produces: collection `projects` remplie ; page projets accessible à `/projets` (FR) et `/en/projects` (EN).

- [ ] **Step 1: Créer le contenu FR des 5 projets**

`src/content/projects/fr/degopro.md` :

```markdown
---
lang: fr
title: degopro.fr
order: 1
featured: true
stack: [Nuxt, VueJS, TypeScript]
summary: Site vitrine en production pour une entreprise d'assainissement — réalisé de bout en bout, du design au déploiement.
demoUrl: https://degopro.fr
---
Site client réel, en ligne et utilisé au quotidien : présentation des prestations,
demande de devis, référencement local. Réalisé en Nuxt. Une refonte en NextJS +
Payload CMS est en cours de déploiement — la fiche sera mise à jour à sa sortie.

**Ce que j'ai appris** : livrer et maintenir un site pour un vrai client (SEO local,
performances, contenu évolutif), et arbitrer une migration de stack en production.
```

`src/content/projects/fr/app-evenements.md` :

```markdown
---
lang: fr
title: Application d'animation d'événements
order: 2
stack: [NextJS, React, NestJS, MongoDB, AWS Amplify]
summary: Application ludique pour animer des événements tech (Devfest) — quiz et interactions en direct avec le public.
---
Première version en React + NestJS, puis migration complète vers NextJS avec
MongoDB et un déploiement AWS Amplify. Le service n'est plus en ligne aujourd'hui.

**Ce que j'ai appris** : mener une migration de stack complète sur un produit
existant, et concevoir pour un pic d'utilisateurs simultanés le temps d'un événement.
```

`src/content/projects/fr/factures-pdf.md` :

```markdown
---
lang: fr
title: Générateur de factures PDF
order: 3
stack: [React, react-pdf, Supabase]
summary: Application de création de factures en PDF, développée seul de bout en bout — authentification Supabase et génération react-pdf.
---
Outil complet de facturation : édition, prévisualisation et export PDF.
Actuellement hors ligne (redéploiement prévu), utilisé en contexte privé.

**Ce que j'ai appris** : la génération documentaire côté client avec react-pdf,
et l'authentification/persistance serverless avec Supabase — y compris
l'importance des sauvegardes quand un projet cloud disparaît.
```

`src/content/projects/fr/katas.md` :

```markdown
---
lang: fr
title: Katas — pratique délibérée
order: 4
stack: [Java, Kotlin, TDD]
summary: Une sélection de katas de code — pas des produits, un entraînement régulier au TDD et au refactoring hérité de ma formation craft chez Arolla.
repoUrl: https://github.com/Kamel94/birthday-greetings-kata
---
Le kata est au développeur ce que la gamme est au musicien : un exercice court,
répété, qui muscle les réflexes — écrire le test d'abord, refactorer sans peur,
nommer avec soin. Ceux-ci sont sur mon GitHub, parmi d'autres.
```

`src/content/projects/fr/portfolio.md` :

```markdown
---
lang: fr
title: Ce portfolio
order: 5
stack: [Astro, TypeScript, GitHub Actions]
summary: Le site que vous lisez — statique, bilingue, zéro JavaScript client, déployé en continu sur Hostinger.
repoUrl: https://github.com/Kamel94/portfolio
---
Construit en Astro avec des Content Collections markdown, un design éditorial
sur mesure, un rendu des diagrammes mermaid au build et un déploiement FTP
automatisé par GitHub Actions. Développé en spec-driven development avec des
agents de code — le sujet de mes articles, appliqué à ce site.
```

- [ ] **Step 2: Créer le contenu EN des 5 projets**

Mêmes fichiers sous `src/content/projects/en/`, `lang: en`, mêmes `order`/`stack`/`demoUrl`/`repoUrl`/`featured`. Traduire `summary` et le body fidèlement (le sous-agent traduit le texte FR ci-dessus ; conserver la structure `**What I learned**:`).

- [ ] **Step 3: Créer ProjectsView.astro**

`src/components/views/ProjectsView.astro` :

```astro
---
import { getCollection, render } from 'astro:content';
import StackBadges from '../StackBadges.astro';
import { useTranslations, type Lang } from '../../i18n/ui';

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);

const entries = (await getCollection('projects', ({ data }) => data.lang === lang))
  .sort((a, b) => a.data.order - b.data.order);
const rendered = await Promise.all(
  entries.map(async (e) => ({ entry: e, Content: (await render(e)).Content }))
);
---
<h1>{t('projects.title')}</h1>
<p class="intro">{t('projects.intro')}</p>
<div class="grid">
  {rendered.map(({ entry, Content }) => (
    <article class:list={['card', { featured: entry.data.featured }]}>
      <h2>{entry.data.title}</h2>
      <p class="summary">{entry.data.summary}</p>
      <div class="body prose"><Content /></div>
      <StackBadges stack={entry.data.stack} />
      <p class="links">
        {entry.data.demoUrl && <a href={entry.data.demoUrl}>{t('projects.demo')} ↗</a>}
        {entry.data.repoUrl && <a href={entry.data.repoUrl}>{t('projects.repo')} ↗</a>}
      </p>
    </article>
  ))}
</div>
<style>
  .intro { color: var(--muted); max-width: 38rem; margin-block: 0.75rem 3rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr)); gap: 1.5rem; }
  .featured { grid-column: 1 / -1; border-color: var(--accent); }
  h2 { font-size: 1.35rem; margin-bottom: 0.5rem; }
  .summary { margin-bottom: 0.8rem; }
  .body { color: var(--muted); font-size: 0.93rem; margin-bottom: 1rem; }
  .links { margin-top: 1rem; display: flex; gap: 1.25rem; }
</style>
```

- [ ] **Step 4: Créer les deux pages**

`src/pages/projets.astro` (FR) et `src/pages/en/projects.astro` (EN), sur le même modèle que Task 4 Step 5 : `BaseLayout` avec `title={`${t('projects.title')} — Kamel Azizi`}`, `description={t('projects.intro')}`, `alternateHref` croisé (`/en/projects/` ↔ `/projets/`), contenu `<ProjectsView lang={...} />`.

- [ ] **Step 5: Vérifier le build**

Run: `npm run build && grep -c "degopro.fr" dist/projets/index.html && grep -c "What I learned" dist/en/projects/index.html`
Expected: build OK, les deux grep ≥ 1.

- [ ] **Step 6: Commit**

```bash
git add src/content/projects src/components/views/ProjectsView.astro src/pages/projets.astro src/pages/en/projects.astro
git commit -m "feat: contenu et page projets bilingue"
```

---

### Task 6: Blog — articles SDD + Vitest, index et page article

**Files:**
- Create: `src/content/articles/spec-driven-development.md` (copie adaptée), `src/content/articles/vitest.md`, `plugins/remark-reading-time.mjs`, `src/components/views/ArticlesIndexView.astro`, `src/components/ArticleCard.astro`, `src/pages/articles/index.astro`, `src/pages/articles/[slug].astro`, `src/pages/en/articles/index.astro`
- Modify: `astro.config.mjs` (markdown : shiki + remark plugin)

**Interfaces:**
- Consumes: schéma `articles` (Task 4), `BaseLayout`, `useTranslations`, `formatMonthYear`.
- Produces:
  - `remarkReadingTime` — injecte `minutesRead: number` dans `remarkPluginFrontmatter`.
  - `ArticleCard.astro` — props `{ article: CollectionEntry<'articles'>; lang: Lang }` ; lien interne `/articles/{id}/` ou externe selon `externalUrl`.
  - Pages articles : `/articles/`, `/articles/[slug]/`, `/en/articles/` (index EN listant les articles FR avec mention « in French »).

- [ ] **Step 1: Copier l'article SDD dans la collection**

Copier le contenu intégral de la source (chemin dans Global Constraints) vers `src/content/articles/spec-driven-development.md`, en remplaçant le titre H1 et l'italique d'accroche par du frontmatter (le H1 est rendu par la page, le supprimer du body ; garder l'accroche en première ligne du body) :

```markdown
---
title: "Spec-Driven Development : et si on écrivait la spec avant le code ?"
description: "Comment l'IA a remis au goût du jour une idée vieille comme le génie logiciel : écrire la spécification avant la moindre ligne de code."
pubDate: 2026-07-19
tags: [sdd, ia, agentic-coding, méthodes]
---
*Ou comment l'IA a remis au goût du jour une idée vieille comme le génie logiciel.*

[…reste du body source, inchangé, blocs ```mermaid compris…]
```

- [ ] **Step 2: Créer l'entrée externe Vitest**

D'abord récupérer la date de publication réelle : ouvrir https://www.arolla.fr/vitest-framework-de-test-unitaire-javascript/ (WebFetch) et chercher la date de l'article. L'utiliser comme `pubDate`. Si elle est introuvable sur la page, utiliser `2024-05-01` et le signaler dans le rapport de fin de tâche.

`src/content/articles/vitest.md` :

```markdown
---
title: "Vitest : framework de test unitaire JavaScript"
description: "Présentation de Vitest, le framework de test unitaire nouvelle génération de l'écosystème Vite — publié sur le blog d'Arolla."
pubDate: 2024-05-01
tags: [tests, javascript, vitest]
externalUrl: https://www.arolla.fr/vitest-framework-de-test-unitaire-javascript/
externalHost: arolla.fr
---
```

(Body vide : les cartes externes n'ont pas de page locale.)

- [ ] **Step 3: Créer le plugin reading-time**

Run: `npm install reading-time mdast-util-to-string`

`plugins/remark-reading-time.mjs` :

```js
import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export function remarkReadingTime() {
  return (tree, { data }) => {
    const text = toString(tree);
    data.astro.frontmatter.minutesRead = Math.max(1, Math.round(getReadingTime(text).minutes));
  };
}
```

- [ ] **Step 4: Configurer le markdown dans astro.config.mjs**

Ajouter au `defineConfig` existant (sans toucher au reste) :

```js
import { remarkReadingTime } from './plugins/remark-reading-time.mjs';

// dans defineConfig({ ... }) :
  markdown: {
    shikiConfig: { theme: 'vitesse-light' },
    remarkPlugins: [remarkReadingTime],
  },
```

- [ ] **Step 5: Créer ArticleCard.astro**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { formatMonthYear } from '../utils/date';
import { useTranslations, type Lang } from '../i18n/ui';

interface Props { article: CollectionEntry<'articles'>; lang: Lang }
const { article, lang } = Astro.props;
const t = useTranslations(lang);
const external = Boolean(article.data.externalUrl);
const href = external ? article.data.externalUrl : `/articles/${article.id}/`;
---
<article class="card">
  <p class="kicker">{formatMonthYear(article.data.pubDate, lang)}</p>
  <h2><a href={href}>{article.data.title}{external && ' ↗'}</a></h2>
  <p class="desc">{article.data.description}</p>
  <p class="meta">
    {external && <span class="badge">{t('articles.external')} {article.data.externalHost}</span>}
    {lang === 'en' && !external && <span class="badge">{t('articles.inFrench')}</span>}
  </p>
</article>
<style>
  h2 { font-size: 1.3rem; margin-block: 0.4rem; }
  h2 a { color: var(--ink); text-decoration: none; }
  h2 a:hover { color: var(--accent); }
  .desc { color: var(--muted); font-size: 0.95rem; margin-bottom: 0.6rem; }
</style>
```

- [ ] **Step 6: Créer ArticlesIndexView.astro**

```astro
---
import { getCollection } from 'astro:content';
import ArticleCard from '../ArticleCard.astro';
import { useTranslations, type Lang } from '../../i18n/ui';

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
const articles = (await getCollection('articles', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---
<h1>{t('articles.title')}</h1>
<p class="intro">{t('articles.intro')}</p>
<div class="list">
  {articles.map((a) => <ArticleCard article={a} lang={lang} />)}
</div>
<style>
  .intro { color: var(--muted); max-width: 38rem; margin-block: 0.75rem 3rem; }
  .list { display: grid; gap: 1.5rem; max-width: 46rem; }
</style>
```

- [ ] **Step 7: Créer les pages index**

`src/pages/articles/index.astro` (FR, `alternateHref="/en/articles/"`) et `src/pages/en/articles/index.astro` (EN, `alternateHref="/articles/"`), même modèle que les pages précédentes, contenu `<ArticlesIndexView lang={...} />`.

- [ ] **Step 8: Créer la page article [slug].astro**

`src/pages/articles/[slug].astro` :

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { formatMonthYear } from '../../utils/date';
import { useTranslations } from '../../i18n/ui';

export async function getStaticPaths() {
  const articles = await getCollection(
    'articles',
    ({ data }) => !data.draft && !data.externalUrl
  );
  return articles.map((article) => ({ params: { slug: article.id }, props: { article } }));
}

const { article } = Astro.props;
const t = useTranslations('fr');
const { Content, headings, remarkPluginFrontmatter } = await render(article);
const toc = headings.filter((h) => h.depth === 2);
---
<BaseLayout
  lang="fr"
  title={`${article.data.title} — Kamel Azizi`}
  description={article.data.description}
  ogImage={`/og/${article.id}.png`}
>
  <article>
    <header class="article-header">
      <p class="kicker">
        {formatMonthYear(article.data.pubDate, 'fr')} · {remarkPluginFrontmatter.minutesRead} {t('articles.readingTime')}
      </p>
      <h1>{article.data.title}</h1>
      <p class="desc">{article.data.description}</p>
    </header>
    {toc.length > 2 && (
      <nav class="toc">
        <p class="kicker">{t('articles.toc')}</p>
        <ol>
          {toc.map((h) => <li><a href={`#${h.slug}`}>{h.text}</a></li>)}
        </ol>
      </nav>
    )}
    <div class="prose"><Content /></div>
  </article>
</BaseLayout>
<style>
  .article-header { max-width: 42rem; margin-block: 2rem 2.5rem; }
  .desc { color: var(--muted); font-style: italic; margin-top: 0.75rem; }
  .toc { border: 1px solid var(--line); border-radius: 6px; padding: 1rem 1.25rem; max-width: 42rem; margin-bottom: 2.5rem; }
  .toc ol { padding-left: 1.2rem; margin-top: 0.5rem; }
  .toc a { color: var(--ink); }
</style>
```

- [ ] **Step 9: Vérifier le build**

Run: `npm run build`
Expected: OK. Puis :
- `test -f dist/articles/spec-driven-development/index.html && echo OK` → `OK`
- `grep -c "arolla.fr" dist/articles/index.html` → ≥ 1 (carte externe Vitest)
- `grep -c "min de lecture" dist/articles/spec-driven-development/index.html` → ≥ 1
- `grep -c "in French" dist/en/articles/index.html` → ≥ 1
- `test -f dist/articles/vitest/index.html && echo KO || echo OK` → `OK` (pas de page locale pour l'externe)

- [ ] **Step 10: Commit**

```bash
git add src/content/articles plugins src/components/ArticleCard.astro src/components/views/ArticlesIndexView.astro src/pages/articles src/pages/en/articles astro.config.mjs package.json package-lock.json
git commit -m "feat: blog avec article SDD, carte externe Vitest, TOC et temps de lecture"
```

---

### Task 7: Rendu mermaid au build

**Files:**
- Modify: `astro.config.mjs`

**Interfaces:**
- Consumes: article SDD (contient des blocs ```mermaid).
- Produces: diagrammes rendus en SVG inline au build, zéro JS mermaid côté client.

- [ ] **Step 1: Installer rehype-mermaid et Playwright**

Run: `npm install rehype-mermaid playwright && npx playwright install chromium --with-deps`
Expected: chromium téléchargé. (Sur macOS, `--with-deps` est sans effet ; ne pas s'inquiéter.)

- [ ] **Step 2: Brancher le plugin dans astro.config.mjs**

Modifier le bloc `markdown` (créé en Task 6) pour obtenir :

```js
import rehypeMermaid from 'rehype-mermaid';

// dans defineConfig({ ... }) :
  markdown: {
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    shikiConfig: { theme: 'vitesse-light' },
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [[rehypeMermaid, { strategy: 'img-svg', dark: false }]],
  },
```

- [ ] **Step 3: Vérifier le rendu**

Run: `npm run build && grep -c "<img" dist/articles/spec-driven-development/index.html && grep -c 'class="mermaid"' dist/articles/spec-driven-development/index.html || true`
Expected: build OK ; des `<img src="data:image/svg+xml…` (ou SVG inline selon la stratégie) présents ; **aucun** bloc `<pre class="mermaid">` résiduel ni `<code>` contenant `flowchart`.

Run: `grep -c "mermaid.min.js\|mermaid.esm" dist/articles/spec-driven-development/index.html`
Expected: 0 — aucun script mermaid client.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs package.json package-lock.json
git commit -m "feat: rendu des diagrammes mermaid au build"
```

---

### Task 8: Conversion de l'article OpenFeature

**Files:**
- Create: `src/content/articles/openfeature.md`

**Interfaces:**
- Consumes: sources OpenFeature (chemins dans Global Constraints), schéma `articles`, pipeline markdown (Tasks 6-7).
- Produces: article OpenFeature publié sur le site.

- [ ] **Step 1: Comparer le .md existant au PDF final**

Lire `article-openfeature-devoxx2026.md` **et** le PDF `article-openfeature-devoxx2026-avec-images.pdf` (dossier devoxx, chemin dans Global Constraints). Le dossier contient plusieurs versions ; le PDF « avec-images » est la référence de publication. Vérifier section par section que le `.md` correspond au PDF (titres, ordre, encadrés). Si le `.md` diverge, aligner le texte sur le PDF.

- [ ] **Step 2: Créer src/content/articles/openfeature.md**

Frontmatter (adapter `description` au chapô réel de l'article) :

```markdown
---
title: "OpenFeature : standardiser les feature flags"
description: "Retour sur OpenFeature, le standard CNCF des feature flags, présenté à Devoxx France 2026."
pubDate: 2026-04-15
tags: [feature-flags, openfeature, devoxx, kotlin]
---
```

Régles de conversion :
- Titre H1 du body → supprimé (porté par le frontmatter/la page).
- `pubDate` = date de Devoxx France 2026 si connue du contenu, sinon la date du PDF (`mdls -name kMDItemContentCreationDate <pdf>`).
- Les images du PDF : les extraire n'est pas requis en v1 — si le `.md` référence des images locales, les copier dans `src/content/articles/openfeature/` et corriger les chemins relatifs ; si elles sont introuvables, retirer la référence et le signaler dans le rapport.
- Adapter le titre exact et la description au contenu réel du `.md` (ne pas garder ceux du gabarit ci-dessus s'ils diffèrent).

- [ ] **Step 3: Vérifier le build**

Run: `npm run build && test -f dist/articles/openfeature/index.html && echo OK`
Expected: `OK`, et l'article apparaît dans `dist/articles/index.html` (`grep -c "OpenFeature" dist/articles/index.html` ≥ 1).

- [ ] **Step 4: Commit**

```bash
git add src/content/articles
git commit -m "feat: article OpenFeature (Devoxx France 2026)"
```

---

### Task 9: Home page (FR/EN)

**Files:**
- Create: `src/components/views/HomeView.astro`, `src/pages/en/index.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: collections `experiences`, `projects`, `articles` ; `ArticleCard`, `StackBadges`, `BaseLayout`, utils.
- Produces: home définitive — hero, bio, aperçus (mission actuelle, 2 projets `order` 1-2, 2 derniers articles).

- [ ] **Step 1: Créer HomeView.astro**

Textes de bio exacts à utiliser :

FR :
> Développeur fullstack senior, je conçois des applications robustes côté back (Kotlin, Java, Spring, Quarkus) comme côté front (TypeScript, React, NextJS, Vue). Formé au software craftsmanship chez Arolla, je pratique le TDD, le clean code et le pair programming au quotidien — aujourd'hui chez SNCF Connect, sur l'après-vente d'une application utilisée par des millions de voyageurs. J'intègre l'IA au cœur de mon flux de travail : agentic coding avec Claude Code, Copilot et Codex, complété par la formation « AI Augmented Developer » de SFEIR. Et quand je ne code pas, j'écris — des articles sur les tests, les specs et les pratiques qui font durer le logiciel.

EN :
> I'm a senior fullstack developer building robust applications on the back end (Kotlin, Java, Spring, Quarkus) as well as the front end (TypeScript, React, NextJS, Vue). Trained in software craftsmanship at Arolla, I practice TDD, clean code and pair programming daily — currently at SNCF Connect, on the after-sales side of an app used by millions of travellers. AI sits at the core of my workflow: agentic coding with Claude Code, Copilot and Codex, backed by SFEIR's "AI Augmented Developer" training. And when I'm not coding, I write — articles about tests, specs and the practices that make software last.

```astro
---
import { getCollection } from 'astro:content';
import { getRelativeLocaleUrl } from 'astro:i18n';
import ArticleCard from '../ArticleCard.astro';
import StackBadges from '../StackBadges.astro';
import { formatMonthYear } from '../../utils/date';
import { useTranslations, type Lang } from '../../i18n/ui';

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);

const bio = {
  fr: `Développeur fullstack senior, je conçois des applications robustes côté back (Kotlin, Java, Spring, Quarkus) comme côté front (TypeScript, React, NextJS, Vue). Formé au software craftsmanship chez Arolla, je pratique le TDD, le clean code et le pair programming au quotidien — aujourd'hui chez SNCF Connect, sur l'après-vente d'une application utilisée par des millions de voyageurs. J'intègre l'IA au cœur de mon flux de travail : agentic coding avec Claude Code, Copilot et Codex, complété par la formation « AI Augmented Developer » de SFEIR. Et quand je ne code pas, j'écris — des articles sur les tests, les specs et les pratiques qui font durer le logiciel.`,
  en: `I'm a senior fullstack developer building robust applications on the back end (Kotlin, Java, Spring, Quarkus) as well as the front end (TypeScript, React, NextJS, Vue). Trained in software craftsmanship at Arolla, I practice TDD, clean code and pair programming daily — currently at SNCF Connect, on the after-sales side of an app used by millions of travellers. AI sits at the core of my workflow: agentic coding with Claude Code, Copilot and Codex, backed by SFEIR's "AI Augmented Developer" training. And when I'm not coding, I write — articles about tests, specs and the practices that make software last.`,
}[lang];

const current = (await getCollection('experiences', ({ data }) => data.lang === lang))
  .sort((a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf())[0];

const projects = (await getCollection('projects', ({ data }) => data.lang === lang))
  .sort((a, b) => a.data.order - b.data.order)
  .slice(0, 2);

const articles = (await getCollection('articles', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 2);

const projectsUrl = getRelativeLocaleUrl(lang, lang === 'fr' ? 'projets' : 'projects');
---
<section class="hero">
  <p class="kicker">{t('hero.kicker')}</p>
  <h1>Kamel Azizi.</h1>
  <p class="tagline">{t('hero.tagline')}</p>
  <p class="bio">{bio}</p>
  <p class="ctas">
    <a class="btn" href={getRelativeLocaleUrl(lang, 'experiences')}>{t('hero.ctaExperiences')}</a>
    <a href={getRelativeLocaleUrl(lang, 'articles')}>{t('hero.ctaArticles')} →</a>
  </p>
</section>

<section>
  <div class="section-heading"><span class="num">01</span><h2>{t('home.latestMission')}</h2></div>
  <p class="kicker">{formatMonthYear(current.data.startDate, lang)} — {t('experiences.today')}</p>
  <h3>{current.data.role} · {current.data.company}</h3>
  <p class="muted">{current.data.summary}</p>
  <StackBadges stack={current.data.stack} />
  <p><a href={getRelativeLocaleUrl(lang, 'experiences')}>{t('home.seeAll')} →</a></p>
</section>

<section>
  <div class="section-heading"><span class="num">02</span><h2>{t('home.projects')}</h2></div>
  <div class="pair">
    {projects.map((p) => (
      <article class="card">
        <h3>{p.data.title}</h3>
        <p class="muted">{p.data.summary}</p>
        <StackBadges stack={p.data.stack} />
      </article>
    ))}
  </div>
  <p><a href={projectsUrl}>{t('home.seeAll')} →</a></p>
</section>

<section>
  <div class="section-heading"><span class="num">03</span><h2>{t('home.articles')}</h2></div>
  <div class="pair">
    {articles.map((a) => <ArticleCard article={a} lang={lang} />)}
  </div>
  <p><a href={getRelativeLocaleUrl(lang, 'articles')}>{t('home.seeAll')} →</a></p>
</section>

<style>
  .hero { padding-block: 4rem 5rem; max-width: 46rem; }
  .tagline { font-family: var(--font-serif); font-size: 1.4rem; font-style: italic; margin-block: 1rem 1.5rem; }
  .bio { color: var(--muted); margin-bottom: 2rem; }
  .ctas { display: flex; gap: 1.5rem; align-items: center; }
  .btn {
    background: var(--ink);
    color: var(--bg);
    text-decoration: none;
    padding: 0.6rem 1.4rem;
    border-radius: 3px;
    font-size: 0.95rem;
  }
  .btn:hover { background: var(--accent); }
  section { margin-bottom: 4rem; }
  .muted { color: var(--muted); margin-block: 0.5rem 0.8rem; max-width: 40rem; }
  .pair { display: grid; grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr)); gap: 1.5rem; margin-bottom: 1rem; }
  h3 { font-size: 1.25rem; }
</style>
```

- [ ] **Step 2: Brancher les pages**

`src/pages/index.astro` : remplacer le contenu du slot par `<HomeView lang="fr" />` (garder `BaseLayout` avec `alternateHref="/en/"`).
`src/pages/en/index.astro` : créer, identique avec `lang="en"`, `useTranslations('en')`, `alternateHref="/"`.

- [ ] **Step 3: Vérifier le build**

Run: `npm run build && grep -c "software craftsmanship" dist/index.html && grep -c "millions of travellers" dist/en/index.html`
Expected: build OK, les deux grep ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add src/components/views/HomeView.astro src/pages/index.astro src/pages/en/index.astro
git commit -m "feat: page d'accueil bilingue avec hero, bio et aperçus"
```

---

### Task 10: SEO — OG meta complètes, images OG, RSS

**Files:**
- Create: `src/pages/og/[...route].ts`, `src/pages/rss.xml.js`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: collections, `BaseLayout` (prop `ogImage` existante).
- Produces: meta OG/Twitter complètes sur toutes les pages ; PNG OG générés à `/og/<id>.png` pour chaque article hébergé + une image `/og/site.png` par défaut ; flux RSS `/rss.xml`.

- [ ] **Step 1: Compléter les meta dans BaseLayout.astro**

Dans le `<head>`, remplacer la ligne `{ogImage && …}` par :

```astro
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:locale" content={lang === 'fr' ? 'fr_FR' : 'en_US'} />
    <meta property="og:image" content={new URL(ogImage ?? '/og/site.png', Astro.site)} />
    <meta name="twitter:card" content="summary_large_image" />
```

- [ ] **Step 2: Générer les images OG**

Run: `npm install astro-og-canvas`

`src/pages/og/[...route].ts` :

```ts
import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const articles = await getCollection('articles', ({ data }) => !data.draft && !data.externalUrl);

const pages = Object.fromEntries([
  ['site', { title: 'Kamel Azizi', description: 'Développeur Fullstack Senior — Kotlin · Java · TypeScript' }],
  ...articles.map((a) => [a.id, { title: a.data.title, description: a.data.description }]),
]);

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page: { title: string; description: string }) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[250, 246, 240]],
    border: { color: [154, 59, 46], width: 16, side: 'inline-start' },
    font: {
      title: { color: [26, 26, 26], size: 60, weight: 'Bold' },
      description: { color: [107, 98, 89], size: 30 },
    },
  }),
});
```

Note d'exécution : `astro-og-canvas` évolue — si le build échoue sur une option, consulter `node_modules/astro-og-canvas/README.md` et ajuster les options (l'interface `OGImageRoute({ param, pages, getImageOptions })` est stable). Le critère de réussite est le Step 4, pas la fidélité à ce snippet.

- [ ] **Step 3: Créer le flux RSS**

Run: `npm install @astrojs/rss`

`src/pages/rss.xml.js` :

```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = (
    await getCollection('articles', ({ data }) => !data.draft && !data.externalUrl)
  ).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Kamel Azizi — Articles',
    description:
      'Tests, specs, feature flags : des articles pour faire durer le logiciel.',
    site: context.site,
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.pubDate,
      link: `/articles/${a.id}/`,
    })),
  });
}
```

- [ ] **Step 4: Vérifier le build**

Run: `npm run build`
Expected: OK. Puis :
- `test -f dist/og/site.png && test -f dist/og/spec-driven-development.png && echo OK` → `OK`
- `grep -c "og:image" dist/index.html` → ≥ 1
- `grep -c "spec-driven-development" dist/rss.xml` → ≥ 1 ; `grep -c "vitest" dist/rss.xml` → 0 (les externes n'y sont pas)

- [ ] **Step 5: Commit**

```bash
git add src/pages/og src/pages/rss.xml.js src/layouts/BaseLayout.astro package.json package-lock.json
git commit -m "feat: images OpenGraph, meta sociales et flux RSS"
```

---

### Task 11: CI GitHub Actions + déploiement FTP Hostinger + README

**Files:**
- Create: `.github/workflows/ci.yml`, `README.md`

**Interfaces:**
- Consumes: `npm test`, `npm run build` (toutes tâches précédentes).
- Produces: CI (tests + build + vérification de liens) sur chaque push/PR ; déploiement FTP vers Hostinger sur `main`. Secrets attendus côté GitHub : `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_SERVER_DIR` (ex. `public_html/`).

- [ ] **Step 1: Créer .github/workflows/ci.yml**

```yaml
name: CI & Deploy

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm test
      - run: npm run build
      - name: Vérification des liens internes
        run: npx linkinator ./dist --recurse --silent
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist

  deploy:
    needs: build
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      - name: Déploiement FTP Hostinger
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: dist/
          server-dir: ${{ secrets.FTP_SERVER_DIR }}
```

- [ ] **Step 2: Créer README.md**

```markdown
# kamelazizi.dev

Portfolio de Kamel Azizi — développeur fullstack senior (Kotlin · Java · TypeScript).
Site statique [Astro](https://astro.build), bilingue FR/EN, zéro JavaScript client.

## Développement

​```bash
npm install
npx playwright install chromium   # rendu mermaid au build
npm run dev
​```

## Scripts

- `npm run dev` — serveur de développement
- `npm test` — tests unitaires (Vitest)
- `npm run build` — build statique dans `dist/`

## Contenu

Tout le contenu est en markdown dans `src/content/` (`experiences/`, `projects/`,
`articles/`). Publier un article = ajouter un `.md` dans `src/content/articles/`
et pousser sur `main`. `draft: true` exclut un article du build.

## Déploiement

Chaque push sur `main` déclenche la CI (tests, build, vérification des liens)
puis un déploiement FTP vers Hostinger (secrets `FTP_*` du repo).
```

(Retirer les zero-width markers `​` autour des fences lors de la création du fichier — ils n'existent que pour imbriquer les blocs dans ce plan.)

- [ ] **Step 3: Vérifier la CI localement (simulation)**

Run: `npm test && npm run build && npx linkinator ./dist --recurse --silent && echo CI-OK`
Expected: `CI-OK` — aucun lien interne cassé.

- [ ] **Step 4: Commit**

```bash
git add .github README.md
git commit -m "ci: build, tests, vérification des liens et déploiement FTP Hostinger"
```

- [ ] **Step 5: Actions humaines à lister dans le rapport final** (à faire par Kamel, pas par l'exécuteur)

1. Créer le repo GitHub public `Kamel94/portfolio` et pousser `main`.
2. Créer un compte FTP dans hPanel Hostinger et renseigner les secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_SERVER_DIR` dans GitHub → Settings → Secrets and variables → Actions.
3. Confirmer le domaine (`kamelazizi.dev` ou autre) — mettre à jour `site` dans `astro.config.mjs` si différent.
4. Confirmer l'URL LinkedIn exacte dans `src/components/Footer.astro`.
5. Après le premier déploiement : vérifier le site en production et lancer un audit Lighthouse (objectif ≥ 95 partout).

---

## Self-Review (fait à l'écriture du plan)

- **Couverture spec** : home avec bio ✔ (T9), expériences ✔ (T4), projets avec degopro featured ✔ (T5), articles SDD/Vitest/OpenFeature + draft Kotlin possible via `draft: true` ✔ (T6/T8), mermaid build ✔ (T7), i18n FR/EN + « in French » ✔ (T2-T9), design system éditorial ✔ (T3), email protégé ✔ (T3), sitemap ✔ (T1), OG/RSS ✔ (T10), CI + FTP Hostinger ✔ (T11), Lighthouse vérifié post-déploiement ✔ (T11 action humaine).
- **Placeholders** : aucun TBD ; les deux points volontairement délégués à l'exécution (date Vitest via WebFetch, alignement OpenFeature md/PDF) ont des instructions de résolution précises.
- **Cohérence des types** : `Lang`/`UiKey` (T2) utilisés partout ; props `BaseLayout` stables depuis T3 (T10 ne change que le `<head>`) ; schémas collections définis une fois en T4.
