# kameldev.fr

Portfolio de Kamel Azizi — développeur fullstack senior (Kotlin · Java · TypeScript).
Site statique [Astro](https://astro.build), bilingue FR/EN, zéro JavaScript client.

## Développement

Prérequis : Node ≥ 22.

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
puis un déploiement FTPS vers Hostinger (secrets `FTP_*` du repo).

Une reconstruction est aussi programmée le 1er janvier et le 1er octobre : la
durée d'expérience affichée et l'année du copyright sont calculées au build et
se périmeraient sans nouveau déploiement.

## Licence

Le code est sous licence MIT : reprenez et adaptez l'implémentation librement.
Le contenu éditorial — articles, fiches d'expériences et de projets, textes
d'interface — reste protégé, tous droits réservés. Voir [LICENSE](LICENSE).
