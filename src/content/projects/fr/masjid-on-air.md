---
lang: fr
title: Masjid On Air
order: 2
status: development
stack: [React Native, Expo, TypeScript, Supabase, PostgreSQL, LiveKit, Deno]
summary: "Produit complet de diffusion audio en direct pour les mosquées : cours et adhan en temps réel, notifications, replays et espace d’administration."
demoUrl: https://masjidonair.fr
---
**Le besoin** : permettre de suivre les cours et l’adhan d’une mosquée en direct depuis son téléphone, et de réécouter les cours ensuite — sans avoir à créer de compte.

**Mon rôle** : conception produit et développement, du mobile au backend, en spec-driven development avec des agents de code.

**Décisions techniques** : audio temps réel confié à LiveKit ; Supabase pour la base Postgres, la sécurité par RLS et les Edge Functions ; application mobile React Native et Expo ; console de diffusion pensée pour un iPad en libre-service dans la mosquée, sans compte à gérer. Les séances s’ancrent sur les horaires de prière, calculés localement et calibrés sur les relevés réels de la mosquée.

**Les contraintes** : la confidentialité d’abord — aucun compte auditeur, aucun suivi, aucune publicité. Et un direct qui ne doit jamais tomber : enregistrement et notifications sont traités hors du chemin critique, l’échec de l’un ne coupe jamais l’autre.

**État actuel** : en développement, en préparation d’un pilote TestFlight privé avec une mosquée. Le parcours complet — adhan déclenché depuis la console, notification au son dédié, écoute du direct au premier tap — est validé sur iPhone réel.
