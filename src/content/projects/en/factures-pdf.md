---
lang: en
title: PDF invoice generator
order: 4
status: offline
stack: [React, react-pdf, Supabase]
summary: An invoicing app that generates PDFs, built solo end-to-end — Supabase authentication and react-pdf generation.
---
**The need**: a self-contained invoicing tool — editing, previewing and PDF export.

**Technical decisions**: client-side PDF generation with react-pdf; authentication and persistence delegated to Supabase, to stay on a serverless architecture with no server to maintain.

**Current status**: offline, redeployment planned.

**What I learned**: client-side document generation, and the importance of backups — the Supabase project disappeared, and only a backup made it possible to keep the work.
