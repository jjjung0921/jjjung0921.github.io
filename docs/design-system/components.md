# Design System Components

**Status:** Active reference  
**Source:** React prototype visual language mapped to production Astro classes.

## Atomic Structure

Use this vocabulary when adding or refactoring UI:

- Atoms: badge, button, icon, label, metric pill.
- Molecules: metadata pair, link cluster, note row, CTA row.
- Organisms: sidebar, project list, lab demo section, CV header, page header.
- Templates: app shell, content page, detail page, lab page.
- Pages: localized route content under `src/pages/` and `src/pages/en/`.

Do not create a new component when an existing primitive covers the need.

## Atoms

### Badge

Production class:

- `.badge`
- `.badge-list`

Prototype source:

- `px-3 py-1`
- `bg-slate-50`
- `text-xs`
- `rounded-full`
- `border border-slate-200/60`

Usage:

- project tags
- note categories
- lab tags

Rules:

- Keep badges small.
- Use neutral surface and muted text.
- Do not use solid accent badges for normal tags.

### Button

Production classes:

- `.button`
- `.button.primary`
- `.button.secondary`

Prototype source:

- primary: `bg-slate-900`, `text-white`
- secondary: `bg-white`, `border`, `text-slate-700`
- size: `px-5 py-2.5`, `text-sm`, `rounded-lg`

Usage:

- homepage CTAs
- CV print/download action
- clear user commands

Rules:

- Primary button should be rare.
- Secondary buttons can cluster in CTA rows.
- Buttons must not resize based on hover state.

### Icon Button

Production class:

- `.icon-button`

Prototype source:

- utility nav icons with `p-2`, `rounded-lg`, hover background.

Usage:

- GitHub
- email
- theme toggle
- compact toolbar actions

Rules:

- Always include `aria-label`.
- Use `Icon.astro` where possible.
- Keep dimensions stable at `2.25rem`.

### Icon Tile

Production class:

- `.icon-tile`

Prototype source:

- `w-12 h-12`
- `rounded-xl`
- `border`
- `text-teal-700`

Usage:

- home identity items
- conceptual section markers

Rules:

- Use icon tiles as accents inside unframed identity sections.
- Do not wrap every icon tile in a card unless the surrounding item is a discrete artifact.

### Metric Pill

Production class:

- `.metric-pill`

Prototype source:

- `font-mono`
- `px-2 py-0.5`
- `rounded-md`
- small bordered value display

Usage:

- lab lambda value
- lab objective value
- computed outputs

Rules:

- Use mono font.
- Keep value labels short.
- Prefer neutral background; use warm/accent only for semantic signal.

## Molecules

### Metadata Row

Production class:

- `.metadata`

Prototype source:

- `flex flex-wrap items-center gap-*`
- `text-sm text-slate-500`

Usage:

- project status, role, time range
- note date/category/status
- lab tier/status/runtime

Rules:

- Metadata should be scannable and secondary.
- Use muted text.
- Use mono only for explicit labels, not every metadata value.

### Metadata Block

Production class:

- `.metadata-block`

Prototype source:

- project detail groups with `text-xs font-mono text-teal-700 uppercase tracking-widest`.

Usage:

- Constraint
- Architecture
- Experiment
- Technical Core
- Research Relevance

Rules:

- Label uses mono uppercase accent.
- Body text uses muted small text.
- Use inside project details and lab side panels.

### Link Cluster

Production class:

- `.link-cluster`

Prototype source:

- `flex gap-4 pt-8 border-t`
- links ending with `->`

Usage:

- project external links
- report/demo/github links

Rules:

- Keep links grouped after evidence content.
- Use accent text, not button styling, unless it is a primary user command.

### CTA Row

Production class:

- `.button-row`

Prototype source:

- `flex flex-wrap gap-3`

Usage:

- home intro actions
- important route jumps

Rules:

- One primary action maximum.
- Secondary route actions should be visually equal.

## Organisms

### Sidebar

Production classes:

- `.sidebar`
- `.brand`
- `.brand-mark`
- `.nav-list`
- `.nav-item`
- `.sidebar-footer`
- `.language-links`
- `.utility-row`

Prototype source:

- `md:w-64`
- sticky left nav
- lucide icons
- active item raised surface
- footer icon controls

Rules:

- Sidebar width is `16rem`.
- Active navigation uses background, border, shadow, and accent text.
- Utility controls remain visible on mobile.
- Do not add large descriptive text to the sidebar.

### Page Header

Production classes:

- `.page-header`
- `.page-title`
- `.hero-title`
- `.lede`
- `.eyebrow`

Prototype source:

- normal page title: `text-3xl`
- home title: `text-4xl md:text-5xl`
- lede: `text-lg` or `text-xl md:text-2xl`
- divider: `border-b`, `pb-8`

Rules:

- Use `.hero-title` only on homepage-level hero.
- Use `.page-title` for all normal routes.
- Keep page headers compact.
- Eyebrow is optional and should clarify context, not decorate.

### Card

Production classes:

- `.card`
- `.interactive-card`

Prototype source:

- `bg-white`
- `border border-slate-200/60`
- `rounded-xl`
- `shadow-sm`
- `hover:shadow-md`
- `hover:border-teal-*`

Usage:

- project entries
- note rows
- lab side panels
- CV body
- research direction panel

Rules:

- Use cards for discrete artifacts.
- Avoid cards inside cards.
- Do not turn every prose section into a card.
- Hover state is for clickable cards only.

### Note List Item

Production class:

- `.note-list-item`
- `.arrow-affordance`

Prototype source:

- full-width clickable row
- date/category/status metadata
- right-side circular arrow on desktop

Rules:

- Entire row should be clickable.
- Metadata should sit above or below title depending on density.
- Arrow affordance is hidden on mobile.

### Project Card

Production classes:

- `.project-card`
- `.project-detail-grid`
- `.metadata-block`
- `.link-cluster`

Prototype source:

- tags at top
- title and problem
- two-column detail grid
- labeled technical sections
- bottom link cluster

Rules:

- Preserve the evidence path:
  - problem
  - constraint
  - architecture
  - experiment
  - technical core
  - research relevance
  - links
- Do not collapse project cards to simple teasers unless on a compact index.
- Desktop detail grid uses two columns.
- Mobile stacks details before links.

### Lab Demo

Production classes:

- `.lab-layout`
- `.lab-demo-frame`
- `.lab-control-stack`
- `.lab-control-label`
- `.lab-range`
- `.signal-line`
- `.response-card`
- `.response-track`
- `.response-fill`
- `.lab-side-panel`

Prototype source:

- `grid md:grid-cols-[1fr_300px] gap-8`
- bordered grid visualization frame
- slider control
- animated vertical connection line
- lower response bar
- side cards for question/output/interpretation

Rules:

- The demo is the primary artifact on lab detail pages.
- Demo should appear early in the viewport.
- Side panels explain question, output, and interpretation.
- Keep client-side behavior isolated to the demo component.

### CV Header and Body

Production classes:

- `.cv-header`
- `.contact-row`
- `.card`
- `.prose`

Prototype source:

- compact route header
- email and GitHub links
- right-aligned PDF button
- large print-like document card

Rules:

- CV body should remain print-like.
- Header actions should be visible but not decorative.
- Avoid extra panels around CV content.

## Templates

### App Shell

Production:

- `Base.astro`
- `.app-shell`
- `.sidebar`
- `.main`
- `.content-frame`

Rules:

- The shell provides layout, background grid, sidebar, and content width.
- Pages should not create their own full-screen layout wrappers.
- Use `.content-frame.wide` only when a page truly needs wider content.

### Content Page

Use for:

- About
- Notes index
- Projects index
- Lab index

Structure:

```astro
<div class="page-stack">
  <PageHeader ... />
  <section class="card-list">...</section>
</div>
```

Rules:

- Keep route header compact.
- Use list organisms for repeated content.
- Avoid marketing hero layouts.

### Detail Page

Use for:

- note detail
- project detail
- lab detail

Structure:

```astro
<article class="page-stack">
  <header class="page-header">...</header>
  <div class="prose">...</div>
</article>
```

Rules:

- Header gives context.
- Body uses `.prose` unless rendering a structured artifact.
- Lab detail may use `.lab-detail-stack` to bring the demo higher.

## Production Mapping From Prototype

| Prototype Tailwind Pattern | Production Class |
|---|---|
| `md:w-64` | `.sidebar`, `--shell-sidebar` |
| `max-w-4xl mx-auto` | `.content-frame`, `--content-width` |
| `space-y-12 pb-20` | `.page-stack` |
| `border-b ... pb-8` | `.page-header` |
| `text-3xl font-bold` | `.page-title` |
| `text-xl md:text-2xl ... leading-relaxed` | `.lede` |
| `rounded-xl border bg-white shadow-sm` | `.card` |
| `hover:shadow-md hover:border-teal-*` | `.interactive-card` |
| `text-xs font-mono uppercase tracking-widest` | `.eyebrow`, `.metadata-block h3` |
| `grid md:grid-cols-2 gap-*` | `.project-detail-grid` |
| `grid md:grid-cols-[1fr_300px] gap-8` | `.lab-layout` |
| `w-12 h-12 rounded-xl ...` | `.icon-tile` |

## Do and Do Not

### Do

- Use tokens before one-off values.
- Keep accent use rare.
- Prefer semantic classes in production Astro.
- Keep page-level content dense and readable.
- Verify desktop and mobile after changing spacing or typography.

### Do Not

- Do not add decorative gradients or unrelated palettes.
- Do not use large marketing-style hero sections except the controlled homepage hero.
- Do not put cards inside cards.
- Do not use Tailwind utility strings directly in production Astro without an explicit migration decision.
- Do not hide key actions such as CV/contact/theme on mobile.

## Implementation Handoff

### Files likely touched

- `src/styles/tokens.css`
- `src/styles/shell.css`
- `src/styles/global.css`
- `src/components/ui/*.astro`
- `src/components/layout/Sidebar.astro`
- `src/components/project/ProjectCard.astro`
- `src/components/content/NoteListItem.astro`
- `src/components/lab/BilevelToyDemo.astro`

### Verification

- `npm run build`
- `npm run lint`
- Chrome screenshot comparison:
  - desktop `1420px` width
  - mobile below `780px`
