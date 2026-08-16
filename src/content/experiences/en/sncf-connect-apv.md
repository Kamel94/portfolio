---
lang: en
company: SNCF Connect
role: Full-Stack Kotlin Developer
mission: After-sales (APV)
startDate: 2024-06-01
stack: [Kotlin, Java 21, Spring Boot, Kotest, TestContainers, Next.js, React Query, Storybook, Flutter, MongoDB, DynamoDB, AWS, Kubernetes, Datadog]
summary: After-sales for the SNCF Connect app — booking, exchanging or cancelling train tickets — in a 15-person team, on a very high-traffic journey.
---
- After-sales impact study for the Worldline SIPS to GoPay payment migration: identifying the adaptations required and the components shareable with the purchase journey
- Built adding and cancelling a pet on an already-booked trip, a journey that did not exist in after-sales before
- Implemented "multi-inventory" exchanges, covering tickets from several booking systems within a single exchange
- Set up a chatbot as first-line response for after-sales
- Added a circuit breaker on sensitive endpoints, so a partner outage cannot degrade the whole journey
- Progressive rollout of new features through feature toggles, reducing the risk of each release
- Next.js/TypeScript front end and Flutter mobile app in a monorepo, with a design system documented in Storybook
- AWS infrastructure (Kubernetes, DynamoDB, Route 53, KMS, Lambda) with Datadog and OpenSearch monitoring for production diagnosis
- Unit tests with Kotest and integration tests on ephemeral containers with TestContainers, validating the code against real dependencies
- Pair and mob programming, cross reviews and SonarQube to spread knowledge across the team
