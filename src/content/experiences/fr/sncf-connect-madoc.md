---
lang: fr
company: SNCF Connect
role: Développeur Kotlin Full-Stack
mission: Gestion documentaire (MaDOC)
startDate: 2023-06-01
endDate: 2024-06-01
stack: [Kotlin, Quarkus, GraalVM, MongoDB, React, Material-UI, Jotai, AWS, Flux CD, Helm]
summary: MaDOC, application de gestion documentaire construite from scratch pour les métiers du ferroviaire (conducteurs, agents terrestres) — signature des documents émis dans l’application.
---
- Backend Kotlin/Quarkus en architecture hexagonale, isolant le métier des frameworks et facilitant les tests
- Compilation native avec GraalVM, pour un démarrage rapide en environnement conteneurisé
- Manipulation de PDF via iText, stockage S3 et réécriture d’un service SOAP hérité
- Front React/TypeScript, avec deux librairies NPM internes (authentification OpenAM, design system Material-UI et Storybook) packagées pour être réutilisables au-delà du projet
- Types générés depuis OpenAPI avec swagger-typescript-api, supprimant les écarts entre le contrat d’API et le front
- GitOps sur AWS (Kubernetes, Flux CD, Helm) pour des déploiements reproductibles et versionnés
- Migrations MongoDB gérées avec Mongock, versionnées avec le code
