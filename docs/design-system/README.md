# Portfolio Design System

**Status:** Active reference  
**Source:** `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/shell.css`, `src/layouts/Base.astro`  
**Direction:** Bit City Lab / quiet lab log

## Purpose

This directory documents the visual system used by the portfolio so future Astro pages, project entries, notes, CV sections, and lab demos can remain visually consistent.

The removed React prototype is historical reference only. The production Astro site expresses the visual system through semantic CSS tokens and classes rather than Tailwind utility strings.

## Current Direction

- Restrained research notebook feel.
- Static content first.
- Clear reviewer path to CV, notes, projects, and lab.
- Dense but readable metadata.
- Accent color used rarely and intentionally.
- No marketing-heavy hero or decorative background assets.

## Documents

- [Foundations](./foundations.md): typography, colors, spacing, mobile size tokens, radius, shadows, responsive rules.
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

Tailwind may still be useful for throwaway experiments, but production Astro pages should stay token-driven and semantic.

## Reference Files

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
