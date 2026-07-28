---
lang: en
title: Masjid On Air
order: 2
status: development
stack: [React Native, Expo, TypeScript, Supabase, PostgreSQL, LiveKit, Deno]
summary: "A complete live audio product for mosques: classes and adhan in real time, notifications, replays and an admin area."
demoUrl: https://masjidonair.fr
---
**The need**: let people follow a mosque's classes and adhan live from their phone, and listen back to the classes afterwards — without having to create an account.

**My role**: product design and development, from mobile to backend, using spec-driven development with coding agents.

**Technical decisions**: real-time audio handled by LiveKit; Supabase for the Postgres database, RLS security and Edge Functions; a React Native and Expo mobile app; a broadcasting console designed for a self-service iPad in the mosque, with no account to manage. Sessions are anchored to prayer times, computed locally and calibrated against the mosque's own readings.

**The constraints**: privacy first — no listener account, no tracking, no advertising. And a live stream that must never drop: recording and notifications run off the critical path, so a failure in one never cuts the other.

**Current status**: in development, preparing a private TestFlight pilot with one mosque. The full journey — adhan triggered from the console, notification with its dedicated sound, live audio playing on the first tap — is validated on a real iPhone.
