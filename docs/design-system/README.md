# Portfolio Design System

**Status:** Active reference  
**Source:** `src/prototype/**`, `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/shell.css`  
**Direction:** Bit City Lab / quiet lab log

## Purpose

This directory documents the visual system used by the portfolio so future Astro pages, project entries, notes, CV sections, and lab demos can remain visually consistent.

The React prototype in `src/prototype/**` is treated as the visual reference. The production Astro site expresses that reference through semantic CSS tokens and classes rather than Tailwind utility strings.

## Current Direction

- Restrained research notebook feel.
- Static content first.
- Clear reviewer path to CV, notes, projects, and lab.
- Dense but readable metadata.
- Accent color used rarely and intentionally.
- No marketing-heavy hero or decorative background assets.

## Documents

- [Foundations](./foundations.md): typography, colors, spacing, radius, shadows, responsive rules.
- [Components](./components.md): atoms, molecules, organisms, page templates, and Astro implementation mapping.

## Production Styling Rule

Production Astro pages should use semantic classes from `src/styles/shell.css` and tokens from `src/styles/tokens.css`.

Use this:

```astro
<article class="card interactive-card project-card">
  <div class="project-detail-grid">
    ...
  </div>
</article>
```

Avoid this in production Astro pages:

```astro
<article class="border border-slate-200/60 bg-white rounded-xl p-8 shadow-sm">
  ...
</article>
```

Tailwind remains useful as a prototype language in `src/prototype/**`, but the production design system should stay token-driven and semantic.

## Reference Files

Prototype visual source:

- `src/components/Layout.tsx`
- `src/prototype/pages/Home.tsx`
- `src/prototype/pages/Projects.tsx`
- `src/prototype/pages/Notes.tsx`
- `src/prototype/pages/Lab.tsx`
- `src/prototype/pages/CV.tsx`

Production Astro source:

- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/styles/shell.css`
- `src/layouts/Base.astro`
- `src/components/layout/Sidebar.astro`
- `src/components/ui/*.astro`
- `src/components/project/ProjectCard.astro`
- `src/components/content/NoteListItem.astro`
- `src/components/lab/BilevelToyDemo.astro`
