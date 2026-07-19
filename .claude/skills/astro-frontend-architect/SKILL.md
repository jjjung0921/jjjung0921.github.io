---
name: astro-frontend-architect
description: Use when implementing or changing Astro pages, components, routes, content collections, data/render separation, or client-side islands in this portfolio. Covers route structure, component boundaries, Korean/English parity, and build verification.
---

# Astro Frontend Architect

Use this skill for Astro implementation, route structure, component boundaries, data/render separation, content collections, and client-side interaction decisions.

## Current Architecture

- `src/layouts/Base.astro` is the live app shell. Props: `page` (`'home' | 'about' | 'notes' | 'projects' | 'lab' | 'cv'`) and `lang` (`'ko' | 'en'`, default `ko`).
- `src/pages/` owns file-based routes; `src/pages/en/` mirrors core English routes.
- `src/components/` is organized by domain: `layout/`, `content/`, `cv/`, `lab/`, `project/`, and shared primitives in `ui/` (BadgeList, ContentCard, FilterControls, Icon, PageHeader, ThemeToggle).
- `src/content/` holds content collections `notes`, `projects`, `lab`, `cv`; schemas live in `src/content/config.ts` (zod). Entries carry `lang` and `translationKey` frontmatter; notes nest under language dirs (e.g. `src/content/notes/ko/typescript/...`).
- `src/lib/` is the data layer: `content/` (collections.ts, fields.ts, filters.ts, status.ts) and `lab/` logic modules.
- `src/siteConfig.ts` holds site-wide config (profile, links, analytics).
- `src/styles/` contains `tokens.css`, `global.css`, `shell.css`.
- `public/` contains static assets.
- Deploy is static GitHub Pages via `.github/workflows/deploy.yml` (`site: https://jjjung0921.github.io`).

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
- Keep data fetching and transformation in Astro frontmatter or pure modules under `src/lib/`.
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

- `src/lib/*`, content collections, `src/siteConfig.ts`
- normalizes and filters data (reuse helpers in `src/lib/content/` — `filterByLang`, `sortByDateDesc`, slug utilities — before writing new ones)
- exposes stable typed shapes
- does not know about visual styling

If a transformation is reused or tested independently, keep it outside the `.astro` template.

## Localization Rules

- Core pages should exist in Korean and English.
- If adding a route under `src/pages/foo.astro`, add or explicitly defer `src/pages/en/foo.astro`.
- New collection entries need `lang` and `translationKey` frontmatter so language pairing works.
- Keep `Base.astro` `page` and `lang` props correct so the language toggle and active nav work.

### Content Translation on `post` Branch

When committing on the `post` branch, every new or changed Korean entry under `src/content/` must have an English counterpart in the same commit, so the language toggle works:

- Path: drop the `ko/` segment. `notes/ko/<field>/<slug>.md` → `notes/<field>/<slug>.md`; `projects/ko/<slug>.md` → `projects/<slug>.md`; same pattern for `lab/` and `cv/`.
- Frontmatter: keep the same `translationKey`, set `lang: "en"`, and translate every text field (title, summary, problem, coreIdea, connection, etc.). Keep non-text fields (date, field, category, series, status, tags) aligned with the Korean entry.
- Body: translate to natural technical English — not literal, sentence-by-sentence conversion. Keep code blocks, math, and links identical.
- Verify the pair with `npm run build` before committing.

## Verification

Run:

```bash
npm run lint   # tsc --noEmit
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
