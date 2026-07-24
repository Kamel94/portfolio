# Spec — Portfolio de Kamel Azizi

**Date** : 2026-07-24
**Statut** : validé en brainstorming, en attente de relecture finale

## Objectif

Portfolio personnel bilingue (FR/EN) présentant le profil de Kamel Azizi, développeur
fullstack senior Kotlin/Java : expériences, projets et articles techniques. Deux
audiences : les recruteurs (lisibilité du parcours en quelques minutes) et les
lecteurs des articles (confort de lecture, RSS).

## Décisions structurantes

| Sujet | Décision |
|---|---|
| Framework | Astro (site 100 % statique, Content Collections, i18n natif) |
| Direction visuelle | « Éditorial & craft » : fond crème, serif, accent terracotta |
| Structure | Multi-pages, avec bio courte sur la home |
| Langues | FR par défaut à la racine, EN sous `/en/` ; articles en FR uniquement |
| Contenu | Markdown dans le repo (Content Collections), pas de CMS |
| Hébergement | Hostinger (mutualisé, déjà souscrit), déploiement FTP via GitHub Actions |
| Repo | Public sur GitHub — le portfolio est lui-même une fiche projet |
| Contact | Email, LinkedIn, GitHub dans le footer ; pas de photo, pas de CV téléchargeable, pas de formulaire |

## Pages

### Home (`/`, `/en/`)
- **Hero** : nom, titre (« Développeur Fullstack Senior — Kotlin · Java · TypeScript »),
  accroche courte, CTA « Voir mon parcours » + lien articles.
- **Bio courte** : 3-4 phrases — senior fullstack, culture craft (formation Arolla,
  TDD, clean code), expérience SNCF Connect, auteur d'articles techniques.
- **Aperçus** : dernière mission (SNCF Connect APV), 2 projets, 2 derniers articles.
- **Footer contact** (commun à toutes les pages) : email (protégé contre les bots),
  LinkedIn, GitHub.

### Expériences (`/experiences`, `/en/experiences`)
Timeline verticale, une entrée par mission, de la plus récente à la plus ancienne :
1. **SNCF Connect — APV** (depuis juin 2024) : Kotlin/Spring Boot, NextJS, Flutter,
   AWS/K8s ; fonctionnalité animaux, multi-inventaires, chatbot, circuit breaker,
   feature toggles.
2. **SNCF Connect — MaDOC** (juin 2023 → juin 2024) : Kotlin/Quarkus, architecture
   hexagonale, GraalVM, React/MUI, librairies NPM internes, GitOps Flux CD.
3. **Officéo** (mars 2021 → février 2023) : Java/Spring Boot, VueJS/Vuetify,
   REST/GraphQL, CRONs dynamiques.
4. **Association funéraire** (oct. → déc. 2020) : microservices Spring Cloud, Angular.

Chaque entrée : contexte (2-3 phrases), réalisations clés (puces), stack en badges.
Contenu sourcé du CV (`Kamel_AZIZI_CV_Fullstack_Senior.pdf`), reformulé pour le web.

### Projets (`/projets`, `/en/projects`)
Fiches projet sans dépendance à une démo live. Chaque fiche : contexte, stack,
« ce que j'ai appris », emplacements optionnels (lien repo, lien démo, captures)
activables via le frontmatter.
1. **App d'animation d'événements** (Devfest) — React/NestJS migré vers NextJS,
   MongoDB, AWS Amplify. Démo hors ligne : fiche descriptive seule.
2. **Générateur de factures PDF** — React, react-pdf, Supabase. Confidentiel et à
   redéployer : fiche descriptive, démo ajoutable plus tard.
3. **Katas — pratique délibérée** — sélection de katas GitHub (birthday-greetings-kata…)
   présentée comme pratique craft, pas comme produits.
4. **Ce portfolio** — Astro, i18n, CI/CD Hostinger ; lien vers le repo public.

### Articles (`/articles`, `/en/articles`)
Index du blog. Deux types de cartes :
- **Article hébergé** : lien interne vers `/articles/[slug]`.
- **Article externe** : lien sortant (icône externe) — utilisé pour Vitest (Arolla).

Au lancement :
| Article | Type | Source |
|---|---|---|
| Spec-Driven Development | hébergé | `sdd-article.md` (Kaibee/Article) |
| OpenFeature (Devoxx 2026) | hébergé | comparer `article-openfeature-devoxx2026.md` au PDF final du même dossier, partir de la version la plus à jour |
| Vitest | externe | https://www.arolla.fr/vitest-framework-de-test-unitaire-javascript/ |
| Kotlin | différé | publié après relecture par Kamel (hors périmètre v1) |

L'index EN liste les articles FR avec la mention « in French ».

### Page article (`/articles/[slug]`)
- Sommaire (TOC) généré depuis les titres.
- Temps de lecture estimé.
- Coloration syntaxique Shiki (thème accordé au design system).
- **Diagrammes mermaid rendus au build** (l'article SDD en contient) — aucun JS
  mermaid côté client.
- Métadonnées : date, tags, description.

## Contenu & i18n

- Content Collections typées : `experiences/`, `projects/`, `articles/`, schémas zod
  (titre, dates, stack, langue, liens optionnels, brouillon).
- i18n via le routing natif Astro : `defaultLocale: fr` (racine), `en` préfixé.
  Les chaînes d'interface (nav, labels) dans des fichiers de traduction dédiés.
- Un article marqué `draft: true` est exclu du build (mécanique prête pour Kotlin
  et les brouillons futurs).

## Design system

- **Couleurs** : fond crème `#faf6f0`, encre `#1a1a1a`, accent terracotta `#9a3b2e`,
  gris chauds pour le secondaire. Clair uniquement en v1 (pas de dark mode).
- **Typographie** : serif expressive pour les titres (type Fraunces), sans-serif
  pour le corps, monospace en touches (badges de stack). Polices auto-hébergées
  (@fontsource) — pas de Google Fonts (perf + RGPD).
- **Détails éditoriaux** : filets fins, numérotation de sections, badges discrets.
- Contraste AA minimum sur tous les textes.

## SEO & qualité

- Sitemap, meta descriptions par page, OpenGraph (images générées par page), RSS.
- Objectif Lighthouse ≥ 95 sur les quatre axes.
- CI : build + vérification des liens internes à chaque push.

## Déploiement

- Repo GitHub public.
- GitHub Action sur `main` : install → build Astro → déploiement FTP/SFTP vers
  Hostinger (secrets FTP dans GitHub).
- Domaine géré chez Hostinger (à acquérir si absent — ex. `kamelazizi.dev`).
- Publier un article = commiter un `.md` sur `main`.

## Hors périmètre v1

- Article Kotlin (après relecture), article OpenFeature en anglais.
- Dark mode.
- Démos live des projets (emplacements prévus dans le frontmatter).
- Formulaire de contact, analytics, commentaires.
