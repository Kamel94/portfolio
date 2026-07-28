---
lang: fr
company: SNCF Connect
role: Développeur Kotlin Full-Stack
mission: Après-vente (APV)
startDate: 2024-06-01
stack: [Kotlin, Java 21, Spring Boot, Next.js, React Query, Flutter, MongoDB, DynamoDB, AWS, Kubernetes, Datadog]
summary: Après-vente de l’application SNCF Connect — réserver, échanger ou annuler un billet de train — au sein d’une équipe de 15 personnes, sur un parcours à très fort trafic.
---
- Ajout de l’ajout et de l’annulation d’un animal sur un voyage déjà réservé, une démarche jusque-là absente du parcours après-vente
- Mise en place de l’échange « multi-inventaires », pour couvrir des billets issus de plusieurs systèmes de réservation dans un même échange
- Mise en place d’un chatbot en premier niveau de réponse sur l’après-vente
- Ajout d’un circuit breaker sur les endpoints sensibles, pour éviter qu’une panne partenaire ne dégrade l’ensemble du parcours
- Activation progressive des nouvelles fonctionnalités par feature toggles, réduisant le risque à chaque mise en production
- Pair et mob programming, revues croisées et SonarQube pour diffuser les connaissances dans une équipe de 15 personnes
- Infrastructure AWS (Kubernetes, DynamoDB, Route 53, KMS, Lambda) et supervision Datadog et OpenSearch pour diagnostiquer en production
