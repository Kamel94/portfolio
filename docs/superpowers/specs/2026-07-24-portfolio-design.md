# Spec — Portfolio de Kamel Azizi

**Créée le** : 2026-07-24 · **Mise à jour le** : 2026-07-28
**Statut** : en production sur https://kameldev.fr

Document de référence : il décrit le site **tel qu'il est**, pas tel qu'il a été
conçu au départ. Le plan d'implémentation initial (`../plans/`) est un document
historique et ne fait plus foi.

## Objectif

Portfolio personnel bilingue (FR/EN) présentant le profil de Kamel Azizi,
développeur full-stack senior Kotlin/Java : expériences, projets et articles
techniques. Deux audiences : les recruteurs (lisibilité du parcours en quelques
minutes) et les lecteurs des articles (confort de lecture, RSS).

## Décisions structurantes

| Sujet | Décision |
|---|---|
| Framework | Astro 7 — site 100 % statique, Content Collections, i18n natif |
| JavaScript client | **Zéro** : aucun `<script>` dans le HTML produit, aucune île |
| Direction visuelle | « Éditorial & craft » : fond crème, serif, accent terracotta |
| Structure | Multi-pages, avec bio courte sur la home |
| Langues | FR à la racine, EN sous `/en/` ; articles en FR, présentation traduite |
| Contenu | Markdown versionné dans le repo, pas de CMS |
| Domaine | `kameldev.fr` (constante `site` dans `astro.config.mjs`) |
| Hébergement | Hostinger mutualisé, déploiement FTPS par GitHub Actions |
| Repo | Public — le portfolio est lui-même une fiche projet |
| Contact | `contact@kameldev.fr` (obfusqué), LinkedIn, GitHub. Pas de photo, **pas de CV publié**, pas de formulaire |

## Pages

### Home (`/`, `/en/`)
- **Hero** : kicker, `<h1>` « Kamel A. », accroche en serif, bio de 4-5 phrases,
  puis trois appels à l'action — « Voir mon parcours » (bouton), « Lire mes
  articles », « Me contacter ».
- **Sections numérotées** : `01` mission actuelle · `02` deux projets (`order` 1-2)
  · `03` deux derniers articles · `04` **Travaillons ensemble** (bouton
  « M'écrire » + mention « Mon CV détaillé est disponible sur demande »).

### Expériences (`/experiences`, `/en/experiences`)
Timeline verticale (filet terracotta, pastille par entreprise), de la plus récente
à la plus ancienne. Les missions **consécutives chez le même employeur sont
regroupées** en une entrée unique avec période globale, puis une sous-section par
mission (champ `mission`) :

1. **SNCF Connect** (depuis juin 2023) — Développeur Kotlin Full-Stack
   - *Après-vente (APV)*, depuis juin 2024
   - *Gestion documentaire (MaDOC)*, juin 2023 → juin 2024
2. **Officéo** — mars 2021 → février 2023
3. **Association** — octobre → décembre 2020

Chaque mission : résumé, réalisations **orientées bénéfice** (jamais de métrique
inventée), stack en badges. Contenu sourcé du CV, reformulé pour le web.

La durée annoncée dans le chapô est **calculée au build** : plus ancienne
`startDate` du contenu → années révolues (arrondi inférieur) → écrite en toutes
lettres. Voir `src/utils/experience.ts` et `src/utils/career.ts`.

#### Formations et certifications
Section compacte en bas de page, volontairement plus légère que la timeline
(pas de filet vertical, intitulés en sans-serif, ~15 % de sa hauteur) :
SFEIR *AI Augmented Developer* (mai 2026, pastille « Certification » cliquable
vers le justificatif public), Arolla *Software Craftsmanship* (février – juin
2023), OpenClassrooms *Développeur d'application Java* (2020, titre RNCP
niveau 6). Données dans `src/components/TrainingList.astro`.

### Projets (`/projets`, `/en/projects`)
**Liste éditoriale, pas une grille de cartes** — décision prise après revue
design : une grille est un contenant de comparaison, or ces fiches sont des
études de cas qui se lisent. Chaque entrée : colonne de lecture à 34 rem
(≈ 68 signes) + rail à droite portant la stack et les liens.

Chaque fiche suit une trame courte à libellés — **Le besoin · Mon rôle ·
Décisions techniques · La contrainte · État actuel · Ce que j'ai appris** —
en n'utilisant que les rubriques que les faits permettent de remplir. Les
libellés sont rendus en petites capitales monospace terracotta (règle
`.body p > strong:first-child`) pour servir d'index scannable.

| # | Projet | Statut | Démo |
|---|---|---|---|
| 1 | **Degopro** (vedette) | `production` | degopro.fr |
| 2 | **Masjid On Air** | `development` | masjidonair.fr |
| 3 | Application d'animation d'événements | `offline` | — |
| 4 | Générateur de factures PDF | `offline` | — |
| 5 | Katas — pratique délibérée | — | repo |
| 6 | Ce portfolio | `production` | repo |

Le projet vedette est signalé **typographiquement** (filet terracotta 2 px, titre
plus grand, résumé en serif), pas par une boîte. Le statut s'affiche en pastille
à côté du titre.

### Articles (`/articles`, `/en/articles`)
Index du blog, deux types de cartes : **hébergé** (lien interne) et **externe**
(lien sortant, badge « Lire sur … »).

| Article | Type |
|---|---|
| Passer de Java à Kotlin | hébergé |
| Spec-Driven Development | hébergé |
| Bye bye Vendor Lock-in (OpenFeature, Devoxx France 2026) | hébergé |
| Vitest | externe (arolla.fr) |

Les titres restent en français dans les deux langues — c'est le titre réel de
l'article. L'index EN affiche le badge « in French » et une `descriptionEn`
traduite.

### Page article (`/articles/[slug]`)
Colonne de lecture centrée. Sommaire depuis les `h2` (au-delà de deux), temps de
lecture, date complète (jour inclus), coloration Shiki, **diagrammes mermaid
rendus au build** (aucun JS client), `og:type: article`.

## Contenu & i18n

Collections typées dans `src/content.config.ts` :

- `experiences` — `lang`, `company`, `role`, `mission?`, `startDate`, `endDate?`,
  `stack[]`, `summary`
- `projects` — `lang`, `title`, `order`, `featured?`, `status?`
  (`production | development | offline`), `stack[]`, `summary`, `demoUrl?`, `repoUrl?`
- `articles` — `title`, `description`, `descriptionEn?`, `pubDate`, `tags[]`,
  `externalUrl?`, `externalHost?`, `draft`

i18n par routing natif Astro (`defaultLocale: fr`, `prefixDefaultLocale: false`).
Chaînes d'interface dans `src/i18n/ui.ts`, typées par `UiKey` — une clé manquante
dans une langue est une erreur de compilation. `draft: true` exclut du build.

## Design system

- **Couleurs** : crème `#faf6f0`, encre `#1a1a1a`, terracotta `#9a3b2e`,
  secondaire `#6b6259`, filet `#e8e0d4`, surface `#ffffff`. Clair uniquement.
- **Typographie** : Fraunces (titres), Inter (corps), JetBrains Mono (dates,
  badges, libellés). Auto-hébergées via `@fontsource` — **jamais** de Google
  Fonts ni de CDN.
- **Détails** : filets fins, sections numérotées sur la home, badges discrets,
  pastilles de statut.
- Contraste AA minimum, focus clavier visible (`a:focus-visible`),
  `prefers-reduced-motion` respecté.

## Conventions éditoriales

- **Typographie française** : apostrophes `’` (jamais `'`), espace insécable
  avant `:`, espace fine insécable (U+202F) avant `; ! ?` et à l'intérieur des
  guillemets `« … »`. Ne s'applique pas aux corps d'articles publiés ni au code.
- **Terminologie** : Next.js, Vue.js, React Query, Jotai, SonarQube,
  GitHub Actions, TypeScript, JavaScript, full-stack (FR et EN).
- **Liens sortants** : `target="_blank" rel="noopener noreferrer"` — appliqué
  aux composants, et aux liens des corps markdown via `rehype-external-links`.
- **Honnêteté** : aucune métrique, adoption ou résultat non vérifiable. Quand
  l'impact ne peut pas être prouvé, formulation qualitative.

## SEO & qualité

Sitemap, meta description par page, OpenGraph complet avec images générées au
build (`astro-og-canvas`), flux RSS, hreflang croisés. L'adresse e-mail n'apparaît
jamais en clair dans le HTML : elle est encodée en entités décimales et injectée
via `set:html` (Astro échappe `&` dans les attributs, ce qui casserait les
entités).

Tests unitaires Vitest sur les utilitaires purs (i18n, dates, obfuscation,
calcul des années).

## Déploiement

- GitHub Actions sur `main` : `npm ci` → Chromium (pour mermaid) → tests → build
  → vérification des **liens internes** (les liens externes sont exclus : un site
  tiers indisponible ne doit pas bloquer un déploiement) → artefact.
- Job `deploy` séparé, borné à `main`, hors pull request : téléchargement de
  l'artefact puis FTPS vers Hostinger. Action épinglée par SHA, délai à 120 s,
  **seconde tentative automatique** (le serveur mutualisé a des timeouts).
- `FTP_SERVER_DIR` vaut `/` : le compte FTP est enraciné sur le dossier du site.
- **Reconstruction programmée** (1er janvier et 1er octobre) : deux valeurs sont
  calculées au build et se périmeraient sinon — la durée d'expérience et l'année
  du copyright.
- Publier un article = commiter un `.md` sur `main`.

## Hors périmètre

Dark mode · formulaire de contact · analytics · commentaires · CV téléchargeable
(volontairement : disponible sur demande uniquement) · traduction des articles en
anglais.
