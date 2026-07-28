---
lang: fr
title: Générateur de factures PDF
order: 4
status: offline
stack: [React, react-pdf, Supabase]
summary: Application de création de factures en PDF, développée seul de bout en bout — authentification Supabase et génération react-pdf.
---
**Le besoin** : un outil de facturation autonome — édition, prévisualisation et export PDF.

**Décisions techniques** : génération du PDF côté client avec react-pdf ; authentification et persistance déléguées à Supabase, pour rester sur une architecture sans serveur à maintenir.

**État actuel** : hors ligne, redéploiement prévu.

**Ce que j’ai appris** : la génération documentaire côté client, et l’importance des sauvegardes — le projet Supabase a disparu, seule une sauvegarde a permis de conserver le travail.
