# ADR-001: Content-first portfolio platform architecture

**Status:** Proposed
**Date:** 2026-07-09
**Deciders:** Lee Jungjin

## Context

This portfolio is meant to help a busy reviewer understand the person, obtain the CV, and inspect concrete work quickly. The site currently presents that intent through a quiet lab-log interface: CV, notes, projects, and an interactive lab are all reachable from the main navigation.

The current checkout is a Vite + React + Tailwind application, not an Astro application. It builds successfully as a static bundle, but most content is still embedded in TypeScript modules or imported Markdown files. That is workable for a small portfolio, but it will become harder to maintain as technical blog posts, project pages, and executable lab demos increase.

The expected growth pressure is:

- More technical blog posts with math, tags, references, and search.
- More project pages with evidence, links, screenshots, experiment logs, and status.
- More lab entries, some of which may be client-only demos while others may need server execution, persistence, queues, or private API keys.
- A deployment path that can start static and add backend cloud services only when the lab surface actually requires them.

## Decision

Adopt a staged, content-first architecture:

1. Migrate the public portfolio surface to Astro when the next structural rewrite begins.
2. Keep the default site static: Astro pages, content collections, MDX/Markdown, and selectively hydrated islands for interactive UI.
3. Deploy the static site through a CDN-backed object storage pipeline. For AWS this means GitHub Actions or another CI runner builds the site, uploads `dist/` to S3, and invalidates CloudFront.
4. Use Docker for reproducible build and local preview, not as the primary runtime for the static site.
5. Add backend cloud services later as a separate API/runtime boundary, only for lab entries that need server-side execution, durable storage, scheduled jobs, or private credentials.

## Options Considered

### Option A: Keep Vite + React SPA

| Dimension | Assessment |
|---|---|
| Complexity | Low short-term, medium long-term |
| Cost | Low |
| Scalability | Good for UI, weak for content growth and SEO |
| Team familiarity | High if continuing from the current checkout |

**Pros:**

- Current app already builds and has working navigation, theme, language toggle, Markdown rendering, CV download, and one lab toy.
- Rich client interactivity is straightforward.

**Cons:**

- Page state is client-side only, so notes/projects/lab entries do not naturally become shareable URLs.
- Content is coupled to React modules and translation functions.
- Blog scale, project detail pages, metadata, RSS, sitemap, and static SEO require more custom work.

### Option B: Astro static site with islands

| Dimension | Assessment |
|---|---|
| Complexity | Medium migration, low maintenance |
| Cost | Low |
| Scalability | Strong for content/project growth; enough for client-side labs |
| Team familiarity | Medium, but aligned with prior portfolio direction |

**Pros:**

- Blog posts, project pages, and lab entries can become typed content collections.
- Static output fits CDN deployment well.
- Interactive lab demos can be React/Svelte/Vanilla islands instead of forcing the whole site to be a SPA.
- Better reviewer path: every note, project, and demo can have a durable URL.

**Cons:**

- Requires migrating the current React stateful page model into route-based pages.
- Bilingual content needs a clear convention, such as route prefixes or paired content files.
- Existing React components must be wrapped as islands or rewritten as Astro components.

### Option C: Astro plus backend from the start

| Dimension | Assessment |
|---|---|
| Complexity | Medium-high |
| Cost | Medium |
| Scalability | Strong, but overbuilt for current public content |
| Team familiarity | Medium |

**Pros:**

- Server-side lab execution, persistence, auth, and APIs are available early.
- Content ingestion from Notion, GitHub, or experiment logs can be automated.

**Cons:**

- Adds operational load before the portfolio has enough dynamic requirements.
- Expands security, monitoring, CORS, secrets, and deployment concerns.
- Can slow the reviewer-facing site if dynamic paths are introduced too early.

### Option D: Full app platform first

| Dimension | Assessment |
|---|---|
| Complexity | High |
| Cost | Medium-high |
| Scalability | Strong for products, excessive for a portfolio |
| Team familiarity | Medium |

**Pros:**

- Maximum flexibility for accounts, dashboards, server jobs, and complex lab apps.

**Cons:**

- Misaligned with the portfolio goal.
- Most pages are static evidence surfaces, not app workflows.
- Harder to keep the quiet lab-log style and review path focused.

## Trade-off Analysis

The main architectural question is not whether the portfolio can run dynamic code. It can. The question is where dynamic behavior belongs.

Most reviewer-facing value is static: identity, CV, project evidence, notes, papers, experiment summaries, and links. These should be fast, URL-addressable, indexable, and easy to maintain as files. Astro is a better default for that than a single-page React app.

Lab entries should be tiered:

- Tier 0: static writeups, screenshots, notebooks, and recorded results.
- Tier 1: client-only interactive demos that run entirely in the browser.
- Tier 2: server-backed demos that need private keys, persistence, longer compute, or scheduled jobs.
- Tier 3: heavier research artifacts that should link to repositories, papers, reports, or hosted notebooks instead of running inside the portfolio.

This keeps the portfolio from turning into a backend product too early while preserving a clean path to add one later.

Docker plus AWS CDN is reasonable if interpreted as "Dockerized build, static CDN runtime." A container runtime for the public site is not necessary unless server rendering or backend APIs are added. For the static site, S3 + CloudFront is simpler and cheaper than running a container. If backend services become necessary, they should be deployed separately, for example as API Gateway + Lambda, App Runner, ECS Fargate, or a managed platform, with the frontend calling a stable API base URL.

## Consequences

- Blog, project, and lab content should move out of hardcoded TypeScript arrays into typed content collections.
- Each note, project, and lab entry should have a stable route and metadata schema.
- The design system should keep the current quiet lab-log direction: restrained colors, dense metadata, clear evidence paths, and rare accent usage.
- Interactive components should be isolated as islands so they do not force every content page into a full client application.
- Backend work should be deferred until a lab entry has a concrete server-only requirement.
- The deployment decision should separate build packaging from runtime architecture.

## Proposed Target Structure

```txt
portfolio/
  apps/
    web/                  # Astro site
      src/
        content/
          notes/
          projects/
          lab/
          cv/
        components/
          ui/
          content/
          lab/
        layouts/
        pages/
        styles/
      public/
      astro.config.mjs
  packages/
    schemas/              # Shared Zod/content schemas if needed
    lab-core/             # Pure simulation/optimization logic usable by demos and tests
  infra/
    aws/
      cloudfront/
      s3/
    docker/
  docs/
    adr/
```

For the immediate next step, this can remain a single `apps/web` package. `packages/lab-core` should be introduced only when lab code becomes non-trivial or shared across demos/tests.

## Content Model

Minimum schemas:

- `notes`: title, slug, date, topic, status, summary, prerequisites, body, references.
- `projects`: title, slug, problem, role, stack, status, evidence links, architecture, experiments, results, repository, demo.
- `lab`: title, slug, tier, status, question, inputs, outputs, runtime type, source link, safety note, body.
- `cv`: Markdown source plus downloadable PDF artifact.

## Deployment Model

Phase 1:

- CI installs dependencies, runs typecheck/build, and uploads static `dist/`.
- CDN serves static assets with caching and security headers.
- No runtime secrets are exposed to the public bundle.

Phase 2:

- Add a backend only for server-required lab entries.
- Keep public content static.
- Expose backend through a versioned API boundary such as `/api/lab/*`.
- Store generated artifacts in object storage, not in the frontend repo.

Phase 3:

- Add background jobs or queues only when a lab demo needs long-running work.
- Add observability, rate limiting, and abuse controls before exposing compute-heavy demos publicly.

## Action Items

1. [ ] Decide whether the current Vite + React checkout is a temporary prototype or the new baseline.
2. [ ] If Astro is accepted, create `apps/web` or replace the current app with an Astro site before content volume grows further.
3. [ ] Define content schemas for notes, projects, and lab entries.
4. [ ] Convert the current two notes, two projects, CV, and toy lab into file-backed content.
5. [ ] Preserve the quiet lab-log visual system as tokens and shared primitives.
6. [ ] Add route-based pages for every note, project, and lab entry.
7. [ ] Add CI checks: typecheck, build, link check, and later visual smoke tests.
8. [ ] Implement AWS static deployment only after the target framework is chosen.
9. [ ] Revisit backend architecture when a lab entry requires private credentials, persistence, or server compute.
