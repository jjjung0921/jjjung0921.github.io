---
name: backend-architect
description: Portfolio backend architecture skill for future dynamic capabilities such as auth, comments, lab scores, contact handling, database schema, and infrastructure; current deploy is GitHub Pages, with Cloudflare as the expansion path.
---

# Backend Architect

Use this skill only when the portfolio needs backend, database, auth, API, infra, or dynamic feature design.

The current portfolio is a static Astro site deployed as static output. Backend work is future-facing unless the repo already contains backend code.

## Design Gate

Before implementing backend or schema changes, produce a short design note and get confirmation when the decision is high-impact.

High-impact examples:

- database schema
- auth/session model
- public API contract
- comment/contact submission flow
- lab score storage
- deployment or secret-management change

Tiny config or documentation fixes do not need a gate.

## Architecture Procedure

1. Define the feature and why static Astro is insufficient.
2. Define data entities and lifecycle.
3. Define API contract.
4. Define auth and authorization needs.
5. Define hosting path. Current deploy is static GitHub Pages (`.github/workflows/deploy.yml`). When a feature needs runtime input, custom headers, or server-side state, migrate to Cloudflare (Pages + Workers/Functions, KV/D1) instead of bolting a separate server onto GitHub Pages.
6. Define migration and rollback strategy if data exists.
7. Define security and abuse controls.
8. Define verification commands or smoke checks.

## Static-First Bias

Prefer the simplest path that preserves the current deploy model:

- static content for portfolio pages
- content collections or data files when runtime mutation is unnecessary
- serverless/edge functions only when runtime input is required
- managed storage/database only when state must persist

Do not add a backend just because a feature could have one.

## Backend Checklist

- schema has stable identifiers
- relationships and delete policy are explicit
- indexes follow actual query patterns
- secrets are not committed
- input validation exists at the boundary
- errors have safe public messages
- rate limiting or spam controls exist for public writes
- deployment environment variables are listed
- tests or smoke checks are defined

## Output Format

```md
## Backend design: <feature>

### Why backend is needed

### Data model

### API contract

### Infrastructure

### Security

### Verification

### Open assumptions
```

## Rules

- Do not claim the site has a backend unless current repo files prove it.
- Do not create schemas or migrations without an approved design.
- Keep costs and operational complexity proportional to a personal portfolio.
