# Chrome design diff: React prototype vs Astro

**Date:** 2026-07-09  
**Status:** Chrome-verified design-system report  
**Scope:** Build `src/prototype` as the Vite React prototype, compare it with the current Astro shell in Chrome, and define follow-up design fixes.

## Design: Chrome comparison for portfolio shell

### Existing direction

- Current concept: `Bitwise Cities` / `Bit City Lab` in a quiet lab log style.
- Design intent: restrained research notebook, static content first, clear reviewer path, dense metadata, readable technical sections.
- Reused tokens/components:
  - `src/styles/tokens.css`
  - `src/styles/global.css`
  - `src/styles/shell.css`
  - `src/layouts/Base.astro`
  - `src/components/layout/Sidebar.astro`
  - `src/components/ui/Icon.astro`
  - `src/components/ui/ThemeToggle.astro`
  - `src/components/project/ProjectCard.astro`
  - `src/components/content/NoteListItem.astro`
  - `src/components/lab/BilevelToyDemo.astro`
- Missing reference: `.design-sync/conventions.md` is not present in this checkout, so the comparison uses the built Vite prototype and live Astro pages as the visual source of truth.

### Verification setup

- Astro app: `http://localhost:3000/`
- React prototype build:
  - Command: `npx vite build --outDir dist-prototype`
  - Preview: `npx vite preview --outDir dist-prototype --host 0.0.0.0 --port 3001`
  - Actual preview port: `http://localhost:3002/` because `3001` was already in use.
- Browser: Chrome extension control.
- Viewport observed in Chrome: `1420 x 746`.

### Build result

- Vite prototype build passed.
- Astro build passed, 22 pages generated.
- Vite emitted chunk-size warnings:
  - React prototype JS: about `813 kB`
  - `html2pdf` chunk: about `985 kB`
- The warning is not a design blocker, but it supports the current architecture decision: keep the prototype as a visual/content reference and keep Astro as the production static shell.

## Summary

The latest Astro shell is much closer to the React prototype than the previous report baseline: icons, theme toggle, project schema, project cards, note rows, CV actions, and the lab demo now exist.

However, the Chrome comparison shows that Astro has drifted in one important direction: it is now more emphatic and card-heavy than the React prototype. The prototype feels like a restrained research notebook. The Astro version feels more polished, but some pages now read closer to a designed showcase surface than a quiet lab log.

The next frontend pass should not add more visual features. It should tune scale, spacing, and density.

## Observed Metrics

| Surface | React prototype | Astro | Design implication |
|---|---:|---:|---|
| Desktop viewport | `1420 x 746` | `1420 x 746` | Same Chrome viewport. |
| Sidebar width | `256px` | `256px` | Shell width matches. |
| Content width | `896px` | `896px` | Current `--content-width: 56rem` matches prototype. |
| Home main padding | `80px` | `48px 56.8px` | Astro content starts higher and feels more compressed horizontally around the hero. |
| Home title font | visual page title around `48px` in prototype content area | `88px` Astro hero title | Astro hero is much louder than the prototype. |
| Home visual panels | prototype has quote card, CTAs, unframed identity blocks, research card | Astro has quote panel, identity cards, research card | Astro adds more framed surfaces. |
| Projects header height | about `113px` in prototype page content | about `184px` in Astro | Astro page headers are still taller than prototype. |
| First project card height | about `569px` | about `624px` | Astro project cards carry more vertical weight. |
| Lab first-screen structure | page header, demo, three side panels | detail header, tags, demo, side panel, prose below | Astro is richer but less immediately direct. |
| CV first-screen structure | compact header, contact row, right-aligned download, large CV card | larger title header, contact cluster, CV card | Astro is usable, but the header is heavier. |

## Page Findings

### 1. Home: Astro hero scale is too high for the prototype direction

**Chrome observation**

- Prototype content area uses a compact `Bit City Lab` heading and keeps the quote as the dominant framed element.
- Astro uses a large serif hero title. In the measured viewport, the Astro `h1` was `88px`.
- This makes the first screen feel editorial and branded. The prototype is calmer and more utilitarian.

**Design decision**

- Keep the Astro `hero-title` variant, but reduce the max scale.
- The homepage can be slightly larger than normal pages, but it should not dominate the entire viewport.

**Implementation handoff**

- File: `src/styles/tokens.css`
- Suggested token change:
  - `--text-hero-title`: from `clamp(3.2rem, 7vw, 5.5rem)` to approximately `clamp(2.8rem, 5vw, 4rem)`.
- Keep:
  - sidebar icon navigation,
  - theme toggle,
  - identity section,
  - research direction section.

### 2. Home: identity cards should be less boxed

**Chrome observation**

- Prototype identity blocks are mostly unframed, with only icon tiles.
- Astro wraps each identity item in full cards. This increases surface noise.

**Design decision**

- Use cards for repeated project/lab/detail items.
- Use unframed sections for identity/philosophy copy unless the frame carries an interaction or grouping purpose.

**Implementation handoff**

- Files:
  - `src/pages/index.astro`
  - `src/pages/en/index.astro`
  - `src/styles/shell.css`
- Add or reuse an `identity-grid` / `identity-item` pattern:
  - unframed item container,
  - framed `icon-tile`,
  - normal text stack,
  - no card border around the whole item.

### 3. Page headers remain taller than the React prototype

**Chrome observation**

- Projects prototype page header is compact: title, lede, divider.
- Astro Projects header is visually taller because of the eyebrow, larger title scale, and section rhythm.

**Design decision**

- Keep the eyebrow for reviewer orientation, but reduce page-header vertical rhythm on list pages.

**Implementation handoff**

- File: `src/styles/shell.css`
- Suggested changes:
  - `.page-header { gap: 0.65rem; padding-bottom: 1.5rem; }`
  - `.page-stack { gap: 3rem; }`
  - Keep detail pages allowed to use more vertical rhythm if the content needs it.

### 4. Project cards have good structure but too much vertical weight

**Chrome observation**

- Both prototype and Astro use two project cards.
- Astro first project card measured about `624px` high, prototype about `569px`.
- Astro card content is clear, but line spacing and gaps make project list scanning slower.

**Design decision**

- Preserve the richer Astro project schema.
- Reduce card rhythm slightly rather than removing sections.

**Implementation handoff**

- Files:
  - `src/components/project/ProjectCard.astro`
  - `src/styles/shell.css`
- Suggested changes:
  - reduce `.project-card` internal gaps,
  - tighten `.project-detail-grid`,
  - keep metadata labels mono/accent,
  - keep link cluster visible.

### 5. Lab: Astro detail page should expose the executable demo earlier

**Chrome observation**

- Prototype Lab first screen immediately shows the page title and demo module.
- Astro lab detail includes metadata/tags/detail framing before the demo.
- The interactive demo is present and functional, but it starts lower in the viewport.

**Design decision**

- For Lab detail pages, the demo is the primary artifact. It should appear as early as possible.
- Keep prose below the demo as documentation, not above it.

**Implementation handoff**

- Files:
  - `src/pages/lab/[slug].astro`
  - `src/pages/en/lab/[slug].astro`
  - `src/components/lab/BilevelToyDemo.astro`
  - `src/styles/shell.css`
- Suggested layout:
  - compact header,
  - immediate `.lab-layout`,
  - prose/model notes after the demo.
- Keep:
  - slider island,
  - output metrics,
  - interpretation side panel.

### 6. CV: Astro header actions are correct, but the CV body should stay print-like

**Chrome observation**

- Prototype CV has compact contact links and a right-aligned download button.
- Astro CV now has email, GitHub, and save-to-PDF actions. That fixes the prior action gap.
- Astro header is heavier, but acceptable if CV remains a route-level artifact.

**Design decision**

- Keep CV action cluster.
- Avoid adding more decorative UI around CV content.
- CV body should remain print-like and readable.

**Implementation handoff**

- Files:
  - `src/pages/cv.astro`
  - `src/pages/en/cv.astro`
  - `src/components/cv/CVActions.astro`
  - `src/styles/shell.css`
- Suggested changes:
  - reduce `.cv-header` bottom rhythm,
  - keep the CV body card plain,
  - add print CSS only if PDF output is a real user-facing feature.

### 7. Chrome control overlay appeared in captures

**Chrome observation**

- The captured screenshots include a small floating Chrome control overlay near the lower center.

**Design decision**

- Ignore this overlay for design evaluation. It is not part of the site UI.
- Do not compensate for it in CSS.

## Proposed Changes

### Tokens

- Reduce hero title maximum:
  - `--text-hero-title: clamp(2.8rem, 5vw, 4rem)`
- Consider a compact page rhythm token:
  - `--space-section-compact: 3rem`
- Keep current core colors:
  - `#fcfcfa`, `#1a1a18`, `#6b6b66`, `#e6e5e0`, `#1f5f54`

### Layout

- Keep sidebar, content width, icons, theme toggle.
- Reduce header height and hero scale.
- Use fewer full-card wrappers on Home/About identity copy.
- Keep project/lab/CV cards where the frame communicates a discrete artifact.

### Responsive behavior

- Desktop:
  - Preserve `256px` sidebar and `896px` content width.
  - Keep lab demo and side panel as two columns.
- Mobile:
  - Keep icon utility row visible.
  - Stack lab side panels under the demo.
  - Ensure project metadata grids stack before long text starts wrapping awkwardly.

## Implementation Handoff

### P1

- Tune `--text-hero-title`.
- Reduce `.page-header` and `.page-stack` vertical rhythm.
- Move Home identity blocks from full cards to unframed items with icon tiles.
- Move Lab demo closer to the top of detail pages.

### P2

- Tighten `ProjectCard` internal spacing.
- Tune CV header rhythm.
- Add print-specific CV verification if PDF is kept as a first-class action.

### P3

- Add screenshot regression for:
  - `/`
  - `/projects/`
  - `/lab/bilevel-toy/`
  - `/cv/`
  - `/en/projects/`

## Verification

- Build:
  - `npx vite build --outDir dist-prototype`
  - `npm run build`
- Chrome routes observed:
  - `http://localhost:3002/` for the built Vite prototype
  - `http://localhost:3000/`
  - `http://localhost:3000/projects/`
  - `http://localhost:3000/lab/bilevel-toy/`
  - `http://localhost:3000/cv/`

## Final Judgment

The Astro implementation should remain the production direction. The React prototype should remain a visual/content reference, not a deploy target.

The next design pass should avoid adding new components. The problem is no longer missing UI. The problem is calibration: Astro needs to become quieter, slightly denser, and closer to the prototype's research-notebook rhythm.
