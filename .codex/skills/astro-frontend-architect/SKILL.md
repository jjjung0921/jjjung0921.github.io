---
name: astro-frontend-architect
description: Portfolio Astro frontend skill for implementing pages, components, data/render separation, static routing, content collections, and minimal islands while preserving the current site architecture.
---

# Astro Frontend Architect

Use this skill for Astro implementation, route structure, component boundaries, data/render separation, content collections, and client-side interaction decisions.

## Current Architecture

- `src/layouts/Base.astro` is the live app shell.
- `src/pages/` owns file-based routes.
- `src/pages/en/` mirrors core English routes.
- `src/components/ui/` contains shared Astro UI primitives.
- `src/data/` contains page data modules.
- `src/content/blog/` contains blog content.
- `src/styles/` contains the token and shell style layers.
- `public/` contains static assets.
- Deploy is GitHub Pages via `.github/workflows/deploy.yml` (`site: jjjung0921.github.io`).

Verify imports before assuming a file is live. Older docs may mention removed or stale components.

## Implementation Procedure

For tiny edits, implement directly and verify.

For structural changes, first state:

1. Component/data boundary.
2. Route impact.
3. Korean/English parity impact.
4. Client JavaScript impact.
5. Verification command.

Then implement the smallest useful slice.

## Astro Rules

- Default to zero client JavaScript.
- Keep data fetching and transformation in Astro frontmatter or pure modules.
- Use islands only for interaction that cannot be static.
- Use `client:visible` or delayed loading for heavy interactive work.
- Keep heavy demos isolated and lazy-loaded.
- Do not move data shaping into presentational components.
- Do not add a framework integration unless the task actually requires it.

## Data and Rendering Separation

Rendering layer:

- `.astro` pages and components
- receives props/data
- renders HTML
- keeps styling consistent

Data layer:

- `src/data/*`, content collections, or future `src/lib/*`
- normalizes and filters data
- exposes stable typed shapes
- does not know about visual styling

If a transformation is reused or tested independently, keep it outside the `.astro` template.

## Localization Rules

- Core pages should exist in Korean and English.
- If adding a route under `src/pages/foo.astro`, add or explicitly defer `src/pages/en/foo.astro`.
- Keep `Base.astro` `lang`, `slug`, and `page` props correct so language toggle and active nav work.

## Verification

Run:

```bash
npm run build
```

For visual/layout/interaction changes, also run a preview or browser check when feasible.

Report failures exactly and convert them into the next fix.

## Output Format

```md
## Artifact
- Modified:
- Created:

## Verification
- Command:
- Result:
- Not verified:

## Notes
- Architecture decision:
- Remaining assumption:
```
