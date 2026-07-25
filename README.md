# kamelazizi.dev

Portfolio de Kamel Azizi — développeur fullstack senior (Kotlin · Java · TypeScript).
Site statique [Astro](https://astro.build), bilingue FR/EN, zéro JavaScript client.

## Développement

```bash
npm install
npx playwright install chromium   # rendu mermaid au build
npm run dev
```

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
