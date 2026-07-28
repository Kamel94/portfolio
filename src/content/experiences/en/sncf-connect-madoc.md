---
lang: en
company: SNCF Connect
role: Full-Stack Kotlin Developer
mission: Document management (MaDOC)
startDate: 2023-06-01
endDate: 2024-06-01
stack: [Kotlin, Quarkus, GraalVM, MongoDB, React, Material-UI, Jotai, AWS, Flux CD, Helm]
summary: MaDOC, a document-management application built from scratch for railway field workers (train drivers, ground agents) — signing documents issued within the app.
---
- Kotlin/Quarkus backend in hexagonal architecture, isolating the domain from frameworks and making it testable
- Native compilation with GraalVM, for fast start-up in a containerised environment
- PDF processing with iText, S3 storage and the rewrite of a legacy SOAP service
- React/TypeScript front end, with two internal NPM libraries (OpenAM authentication, Material-UI and Storybook design system) packaged to be reusable beyond the project
- Types generated from OpenAPI with swagger-typescript-api, removing drift between the API contract and the front end
- GitOps on AWS (Kubernetes, Flux CD, Helm) for reproducible, versioned deployments
- MongoDB migrations handled with Mongock, versioned alongside the code
