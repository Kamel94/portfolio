---
title: "Bye bye Vendor Lock-in — Mon retour sur la conférence OpenFeature à Devoxx France 2026"
description: "Retour sur la conférence de Thomas Poignant à Devoxx France 2026 : OpenFeature, le standard CNCF qui affranchit les feature flags du vendor lock-in, avec OFREP, la Tracking API, OpenTelemetry et un serveur MCP dédié."
pubDate: 2026-04-24
tags: [feature-flags, openfeature, devoxx, kotlin]
---
*Devoxx France 2026 — Talk de Thomas Poignant*

---

Parmi toutes les sessions auxquelles j’ai assisté cette année à Devoxx France, celle de **Thomas Poignant** sur OpenFeature est sans doute l’une de celles qui m’a le plus marqué. Le titre était accrocheur : *« Bye bye Vendor Lock-in: Standardise Feature Flags with OpenFeature »*. Et la promesse a été tenue : une présentation fluide, claire, pédagogique, qui donne envie d’aller tester dès le lendemain.

---

## Le problème de fond : déployer sans releaser

Avant d’entrer dans le vif du sujet, Thomas a posé le contexte avec une question simple mais structurante : **et si vous pouviez déployer votre code sans le livrer à vos utilisateurs ?**

C’est exactement ce que permettent les *feature flags* : décorréler le déploiement du code de la mise en production fonctionnelle. On merge, on déploie, mais la feature reste éteinte jusqu’à ce qu’on décide de l’activer — sans redéployer.

Les bénéfices sont concrets et immédiats :

- **Déploiement incrémental** — on livre progressivement, on réduit le risque
- **Test en production** — on active la feature pour une fraction du trafic réel
- **Kill switch** — en cas de bug critique, on coupe en un clic, sans rollback
- **Progressive rollout** — on monte en charge graduellement
- **Ciblage d’audience** — on active pour certains utilisateurs, certaines régions, certains plans
- **Encapsulation du code IA** — idéal pour *wrapper* tout nouveau code généré par IA avant de le valider pleinement en prod

Ce dernier point m’a particulièrement parlé dans le contexte actuel où l’IA génère de plus en plus de code que l’on n’a pas encore pleinement audité.

---

## Le vrai problème : le vendor lock-in

Les feature flags, c’est bien. Mais aujourd’hui, si vous utilisez LaunchDarkly, Flagsmith, Harness ou Flipt, votre code est truffé d’appels SDK spécifiques au vendor. Changer de solution ? Une migration douloureuse sur toute la codebase.

C’est là qu’**OpenFeature** entre en jeu.

OpenFeature est un **standard ouvert**, incubé par la **CNCF** (Cloud Native Computing Foundation), dont l’ambition est simple : définir une interface universelle pour l’évaluation des feature flags, **indépendamment du vendor**.

Un seul standard. Votre code ne sait plus quel backend tourne derrière. Et si vous changez de provider demain, vous n’avez pas à réécrire votre logique applicative.

---

## L’architecture en 3 couches

Thomas a présenté l’architecture d’OpenFeature de façon très claire, illustrée par un schéma limpide :

```
Votre application
    └── Flag Evaluation  ──┐
    └── Flag Evaluation  ──┤──► OpenFeature SDK ──► OpenFeature Provider ──► Feature Flag Backend
    └── Flag Evaluation  ──┘
                                        │
                                      Hooks
                          (logging, telemetry, validation)
```

### 1. L’Application (SDK)

Votre code n’appelle **que les APIs OpenFeature**. Jamais directement le vendor. Le SDK est disponible dans tous les langages majeurs : Java, Go, Node.js, Python, PHP, React, TypeScript, Kotlin, Swift, Ruby, Angular, Dart, Rust, Svelte… L’écosystème est déjà très large.

### 2. Le Provider

Le Provider est le pont entre le SDK OpenFeature et votre backend de feature flags. Vous choisissez une fois votre provider (LaunchDarkly, Flagsmith, GO Feature Flag, flagd…) et vous le branchez. Si vous changez de vendor, vous swappez le provider — **rien d’autre ne change dans votre code applicatif**.

```java
// Brancher un provider — c'est tout ce qui change si vous migrez
OpenFeatureAPI api = OpenFeatureAPI.getInstance();
api.setProviderAndWait(new MyProvider());
Client client = api.getClient("my-app");

// Cette ligne ne change jamais, quel que soit le backend
boolean enabled = client.getBooleanValue("my-flag", false);
```

### 3. Les Hooks

Les Hooks permettent d’injecter des comportements transversaux **sans modifier votre logique de flags**. Ils s’exécutent à 4 moments du cycle de vie d’une évaluation :

- **Before** — avant l’évaluation (enrichissement du contexte, validation)
- **After** — après une évaluation réussie (logging, audit)
- **Error** — en cas d’erreur d’évaluation
- **Finally** — quoi qu’il arrive (nettoyage, métriques)

C’est le mécanisme idéal pour brancher de l’observabilité ou de la traçabilité sans polluer le code métier.

---

## OFREP : le protocole HTTP universel

Une slide qui a retenu mon attention : **OFREP**, pour *OpenFeature Remote Evaluation Protocol*.

L’idée : définir **un seul protocole REST** standard pour évaluer les flags à distance. N’importe quel backend compatible OFREP peut donc être interrogé par n’importe quel SDK OpenFeature, sans provider spécifique.

```http
POST /ofrep/v1/evaluate/flags/my-flag
Content-Type: application/json

{
  "context": {
    "targetingKey": "user-123",
    "email": "john.doe@example.com"
  }
}

// Réponse
{
  "key": "my-flag",
  "value": true,
  "reason": "TARGETING_MATCH",
  "variant": "on"
}
```

C’est particulièrement utile dans des environnements **polyglotte** où plusieurs langages cohabitent, ou pour des solutions maison qui veulent s’intégrer dans l’écosystème sans implémenter un SDK complet.

---

## Le mode Multi-Provider

OpenFeature supporte également l’exécution de **plusieurs providers en parallèle**. On peut ainsi interroger simultanément plusieurs backends, faire du shadow testing, ou mettre en place une stratégie de fallback — le tout de façon transparente pour le code applicatif.

---

## Tracking API : des flags aux conversions

Un point souvent négligé dans les implémentations de feature flags : **mesurer l’impact business**.

Activer un flag pour 10% des utilisateurs, c’est bien. Savoir si ce 10% convertit mieux, c’est indispensable. C’est ce que permet la **Tracking API** d’OpenFeature.

```java
client.track(
    "checkout_completed",
    evaluationContext,
    TrackingEventDetails.builder()
        .value(42.0)
        .add("currency", "EUR")
        .build()
);
```

Cette API permet de **corréler les évaluations de flags avec des événements métier** — conversions, paniers, clics. On connecte ainsi les feature flags aux A/B tests et à l’expérimentation produit. C’est la passerelle entre technique et business.

---

## OpenFeature x OpenTelemetry

L’intégration avec **OpenTelemetry** est native et particulièrement élégante. En ajoutant simplement un hook OTel, chaque évaluation de flag émet automatiquement des spans conformes aux *Semantic Conventions* définies conjointement par les deux projets.

```java
import dev.openfeature.sdk.OpenFeatureAPI;
import dev.openfeature.contrib.hooks.otel.TracingHook;

// Un seul hook global — toutes les évaluations sont tracées
OpenFeatureAPI api = OpenFeatureAPI.getInstance();
api.addHooks(new TracingHook());

Client client = api.getClient("my-app");
boolean value = client.getBooleanValue("my-flag", false);
```

La formule de Thomas résume parfaitement l’idée : **« Every evaluation becomes a span, every rollout a signal. »**

Fini l’instrumentation manuelle. Votre observabilité des flags est standardisée, interopérable, et s’intègre directement dans votre pipeline OpenTelemetry existant.

---

## OpenFeature MCP Server : les agents IA entrent dans la danse

La cerise sur le gâteau : **un serveur MCP (Model Context Protocol) pour OpenFeature**.

Concrètement, cela signifie que vos outils IA — Cursor, Claude, Codex — peuvent interagir directement avec OpenFeature. L’agent peut installer le SDK, configurer un provider, et évaluer des flags pour vous.

```json
{
  "mcpServers": {
    "openfeature": {
      "command": "npx",
      "args": ["-y", "@openfeature/mcp"]
    }
  }
}
```

C’est une vision concrète de l’IA intégrée dans le workflow de développement : au lieu de chercher la syntaxe du flag dans la doc ou de configurer manuellement un provider, vous demandez simplement à votre agent. **« Installe le SDK OpenFeature Java avec le provider Flagsmith, puis évalue le flag `new-checkout` pour l’utilisateur `john@me.com`. »**

---

## Comment démarrer en 3 étapes

Thomas a conclu sa présentation avec une slide simple et efficace :

**1. Pick an SDK** — Java, Go, Node.js, Python, .NET, Ruby, Rust, Swift, Kotlin… choisissez votre stack.

**2. Pick a provider** — GO Feature Flag, flagd, Flagsmith, LaunchDarkly… ou construisez le vôtre.

**3. Add hooks** — branchez OpenTelemetry, du logging, de la validation en quelques lignes.

Ou, plus simplement encore : **demandez à votre agent IA via le MCP OpenFeature**.

---

## Mon verdict

Cette conférence de Thomas Poignant fait partie de celles qui changent la façon de voir un sujet qu’on croyait maîtriser. Les feature flags, beaucoup d’équipes les utilisent déjà — mais souvent avec un couplage fort au vendor, sans observabilité standardisée, et sans vision claire sur le tracking business.

OpenFeature répond à ces trois problèmes d’un seul tenant : **un standard ouvert, un écosystème riche, une intégration native avec les outils modernes d’observabilité et d’IA**.

Ce qui m’a convaincu ? Le fait que l’adoption côté vendor soit déjà là. LaunchDarkly, Flagsmith, Harness, Flipt… ils ont tous implémenté le standard. Ce n’est pas un projet académique — c’est une réalité de production.

---

## Et de mon côté ?

Je travaille avec des feature flags au quotidien dans mon contexte professionnel. C’est un outil que mon équipe et moi utilisons déjà pour piloter nos mises en production et sécuriser nos déploiements. Mais cette présentation m’a donné une perspective différente sur la façon dont on pourrait aller plus loin — en termes de standardisation, d’observabilité et de résilience face aux changements de vendor.

C’est pourquoi j’ai l’intention de **présenter OpenFeature à mon équipe** dans les prochaines semaines, pour partager ces concepts et ouvrir la réflexion ensemble. Pas question de vendre une solution toute faite, mais plutôt d’apporter des éléments concrets issus du terrain — exactement ce que Thomas a su faire à Devoxx.

---

*Thomas Poignant — Devoxx France 2026*
*Ressources : [openfeature.dev](https://openfeature.dev) · [conférence](https://www.youtube.com/watch?v=22vp6gxXIrI)*
