# Design diff: React prototype vs Astro shell

**Date:** 2026-07-09
**Status:** Frontend handoff report
**Scope:** Compare the preserved React prototype against the current Astro shell and identify design fixes.

## Design: React prototype parity for Astro

### Existing direction

- Current concept: quiet lab log / Bit City Lab, aligned with the prior Bitwise Cities direction.
- Visual goal: restrained research notebook feel, static content first, clear reviewer path, dense metadata, readable technical sections.
- Reused tokens/components: `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/shell.css`, `src/layouts/Base.astro`, `src/components/layout/Sidebar.astro`, `src/components/ui/{PageHeader,ContentCard,BadgeList}.astro`.
- Missing reference file: `.design-sync/conventions.md` is not present in the current checkout, so this report uses the actual React prototype files as the design reference.

## Summary

The Astro version has the right structural direction: static routes, content collections, token layer, sidebar shell, and zero-JS content pages. The main design gap is that Astro currently reads like a skeleton of the React prototype rather than the full quiet-lab interface.

The React prototype has:

- tighter content hierarchy inside cards,
- richer project cards with two-column technical detail,
- visible workflow affordances on notes and lab entries,
- icon-supported navigation and identity cards,
- stronger CV header actions,
- subtle interaction states and motion.

The Astro version currently has:

- oversized page titles compared with React page headers,
- flatter cards,
- reduced metadata density,
- no icon affordances,
- no dark-mode toggle,
- no theme state,
- placeholder symbols instead of lucide icons,
- inline styles in the equation card,
- less detailed About, Project, Lab, and CV surfaces.

## Difference Matrix

| Area | React prototype | Current Astro | Fix priority |
|---|---|---|---|
| Shell width | `md:w-64`, content `max-w-4xl`, large desktop padding | equivalent sidebar width, but content max is wider at `68rem` | P2 |
| Navigation | lucide icons, button-like active state, settings icon row | text glyphs, no theme toggle, footer links hidden on mobile | P1 |
| Page header | compact `text-3xl`, page-specific lede | `page-title` can reach 4.6rem on all pages | P1 |
| Home hero | title, quote card, CTA row, identity snapshot with icon blocks, research card | title, lede, quote, CTAs, identity cards without icons | P2 |
| Cards | rounded `0.75rem`, hover shadow/border, internal section divisions | reusable `.card`, but no hover behavior and list cards are too flat | P1 |
| Project list | rich project cards with tags, problem, constraint, architecture, experiment, technical core, research relevance | simple card with status, role, problem, tags/stack | P1 |
| Notes list | clickable row cards with date/category/status and chevron affordance | simple card list with no right-side affordance | P2 |
| Lab | interactive visualization surface, grid background, slider, output side panel | static sample card only | P1 for parity, P2 if island is deferred |
| CV | header has contact links and PDF download button | static CV content only | P1 |
| About | four sections and highlighted philosophy quote | two short cards | P2 |
| Typography | React mostly uses `font-sans`, quote uses `font-serif`, metadata uses mono | tokens define display/body/mono but page titles do not use display style deliberately | P2 |
| Dark mode | React supports `.dark` via context toggle | tokens define dark values but there is no toggle or persisted state | P1 |

## Findings

### 1. Page titles are too hero-like across normal pages

**Where:** `src/styles/shell.css`, `src/components/ui/PageHeader.astro`, all list/detail pages.

React uses compact page headers for normal routes:

- page title roughly `text-3xl`
- lede roughly `text-lg`
- bottom divider with `pb-8`

Astro uses:

```css
.page-title {
  font-size: clamp(2.35rem, 6vw, 4.6rem);
  line-height: 0.98;
}
```

That size is appropriate for a landing hero, but too large for `Notes`, `Projects`, `Lab`, and `CV`. It makes list pages feel like marketing pages rather than a dense research log.

**Fix:**

- Split title scale into `.hero-title` and `.page-title`.
- Keep `src/pages/index.astro` using `.hero-title`.
- Reduce `.page-title` to around `clamp(2rem, 3vw, 2.75rem)`.
- Add `.content-title` for detail pages if long paper-style note titles need better wrapping.

### 2. Navigation lost the React affordance and utility controls

**Where:** `src/components/layout/Sidebar.astro`, `src/styles/shell.css`.

React navigation had:

- lucide icons,
- active state as raised white/dark panel,
- GitHub, email, theme, language controls in a compact footer row,
- hover states for every icon button.

Astro currently uses text glyphs:

```ts
{ id: 'home', href: `${prefix}/`, icon: '⌁' }
```

This is lighter, but it feels less intentional and less consistent with the React prototype. It also removes the dark-mode toggle even though dark tokens exist.

**Fix:**

- Replace glyphs with either inline lucide-compatible static SVGs or a small `Icon.astro` primitive.
- Add `ThemeToggle` as the first client island, or explicitly remove dark tokens until the toggle returns.
- Keep language links but style active language state.
- On mobile, expose GitHub/email as compact icon links instead of hiding the whole footer.

### 3. Astro cards are too generic for project evidence

**Where:** `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/components/ui/ContentCard.astro`, `src/styles/shell.css`.

React project cards communicate portfolio evidence well:

- tags at the top,
- project title and problem,
- two-column detail layout,
- labeled metadata sections: Constraint, Architecture, Experiment, Technical Core, Research Relevance,
- bottom link cluster.

Astro project cards currently collapse this into status, role, title, problem, and tags. This is structurally clean but visually underpowered for the reviewer path.

**Fix:**

- Add `src/components/project/ProjectCard.astro`.
- Keep `ContentCard` generic, but do not force project cards through it.
- Project card layout should preserve:
  - top tag row,
  - prominent problem statement,
  - 2-column detail grid on desktop,
  - stacked detail groups on mobile,
  - link cluster at the bottom.
- Add missing schema fields or map existing frontmatter into labeled sections:
  - `constraint`
  - `architecture`
  - `experiment`
  - `technicalCore`
  - `researchRelevance`
  - `links`

### 4. Note list lacks row affordance

**Where:** `src/pages/notes/index.astro`, `src/components/ui/ContentCard.astro`.

React notes use a full-width button row with:

- date/category/status line,
- hover title color,
- right-side circular chevron on desktop,
- clear click affordance.

Astro notes look like generic content cards. They are valid links, but the interaction affordance is weaker.

**Fix:**

- Add `src/components/content/NoteListItem.astro`.
- Preserve full-width row layout:
  - left text stack,
  - right chevron or arrow symbol,
  - hover border and title accent.
- Use metadata icons only if the icon primitive is added; otherwise keep labels clean.

### 5. Lab page loses the primary visual experience

**Where:** `src/pages/lab/[slug].astro`, `src/prototype/pages/Lab.tsx`, `src/lib/lab/bilevelToy.ts`.

React Lab is the strongest visual proof of "executable project":

- grid-backed visualization panel,
- slider control,
- animated vertical connection line,
- lower response bar,
- side cards for question/output/interpretation.

Astro currently shows only a static sample value. That is acceptable for the first shell pass, but the design now undersells the Lab section.

**Fix:**

- Add `src/components/lab/BilevelToyIsland.tsx` and hydrate it only on the lab detail page.
- Move React visual structure from `src/prototype/pages/Lab.tsx` into the island.
- Keep math and prose in MDX, island only for slider/animation/output.
- Add a `.lab-demo-frame`, `.lab-demo-grid`, `.metric-pill`, and `.response-bar` style group in `shell.css`.
- Use `client:visible` if the island is below the fold.

### 6. CV page lost contact and download actions

**Where:** `src/pages/cv.astro`, `src/prototype/pages/CV.tsx`.

React CV header provides:

- email link,
- GitHub link,
- PDF download button,
- content card with print-friendly boundaries.

Astro CV only renders static content. This weakens the reviewer path because CV and contact are primary actions.

**Fix:**

- Add a `CVHeader.astro` or page-local header action cluster.
- Include email and GitHub links in the header.
- Decide one of:
  - preferred: static PDF link under `public/cv/jungjin-lee-cv.pdf`;
  - later: `DownloadPdfButton.tsx` island if browser-generated PDF remains necessary.
- Add print-specific styles back if CV page is meant to print cleanly.

### 7. About page is too compressed

**Where:** `src/pages/about.astro`, `src/prototype/pages/About.tsx`.

React About has four conceptual sections:

- Identity
- Philosophy of Computing
- Why Bi-level Optimization Matters
- Connecting AI, Games, and Web Systems

Astro currently has only two short cards and lost the philosophy quote block. The result is cleaner, but too thin for a research-contact portfolio.

**Fix:**

- Restore all four sections.
- Use unframed sections for normal prose and a single quote block for the Bit City metaphor.
- Avoid turning every section into a card. The current `.card` usage makes the page look like stacked panels rather than a notebook page.

### 8. Token layer is good, but component semantics are incomplete

**Where:** `src/styles/tokens.css`, `src/styles/shell.css`.

Good:

- core colors match the desired design direction,
- dark tokens exist,
- accent is centralized,
- content width and sidebar width are tokenized.

Needs improvement:

- `--radius-sm`, `--radius-md`, `--radius-lg` should be tokenized instead of repeated `0.4rem`, `0.5rem`, `0.55rem`, `0.75rem`.
- add semantic text tokens:
  - `--text-xs`
  - `--text-sm`
  - `--text-body`
  - `--text-lede`
  - `--text-page-title`
  - `--text-hero-title`
- add spacing tokens for common page rhythm:
  - `--space-page-y`
  - `--space-section`
  - `--space-card`
- avoid inline style in `src/pages/index.astro` equation card. Move padding into `.equation-line` or similar.

### 9. Mobile shell hides too much utility

**Where:** `src/styles/shell.css`, `src/components/layout/Sidebar.astro`.

Astro hides `.sidebar-footer` entirely on mobile. That removes language links, GitHub, and email. React kept top nav horizontally scrollable and still had utility controls available in the shell.

**Fix:**

- On mobile, move language links and GitHub/email into a compact top-right utility strip or second nav row.
- Keep nav scrollable, but add subtle edge padding and avoid layout jumps.
- Ensure long Korean labels do not overflow small screens.

### 10. Visual state classes are missing

**Where:** `src/styles/shell.css`, future project/lab/note components.

React used hover and active states consistently:

- hover shadow,
- hover border accent,
- title color shift,
- active nav panel.

Astro has active nav, but list cards do not have enough state feedback.

**Fix:**

- Add shared classes:
  - `.interactive-card`
  - `.interactive-card:hover`
  - `.interactive-card:hover h2`
  - `.arrow-affordance`
- Use those on note/project/lab list entries.

## Proposed changes

### Tokens

- Add radius, spacing, and type-scale tokens.
- Keep existing color tokens unchanged.
- Add a dark-mode implementation decision:
  - either ship `ThemeToggle` island now,
  - or remove dark tokens from the current visual surface until the toggle exists.

### Layout

- Split home hero title from normal page title.
- Restore React-like content width: keep `max-width: 4xl` equivalent for core prose, allow wider only for project/lab grids.
- Rebuild Project cards as a dedicated organism, not a generic card.
- Rebuild Lab detail as static MDX plus a client island.
- Restore CV header action cluster.

### Responsive behavior

- Keep mobile nav horizontal, but do not hide all footer utilities.
- Stack project detail grids below `780px`.
- Ensure note/project cards remain full-width touch targets.
- Use fixed icon/button dimensions so hover/active states do not resize layout.

## Implementation handoff

### Files likely touched

- `src/styles/tokens.css`
- `src/styles/shell.css`
- `src/components/layout/Sidebar.astro`
- `src/components/ui/PageHeader.astro`
- `src/components/ui/ContentCard.astro`
- `src/components/content/NoteListItem.astro`
- `src/components/project/ProjectCard.astro`
- `src/components/lab/BilevelToyIsland.tsx`
- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/pages/projects/index.astro`
- `src/pages/projects/[slug].astro`
- `src/pages/notes/index.astro`
- `src/pages/lab/[slug].astro`
- `src/pages/cv.astro`
- `src/content/config.ts`
- project/lab content frontmatter files under `src/content/`

### Suggested order

1. Fix token/page-title scale and remove inline equation styles.
2. Restore Sidebar affordances: icons, utility links, theme decision.
3. Add dedicated `NoteListItem` and `ProjectCard`.
4. Restore About and CV content hierarchy.
5. Add Lab island from React prototype.
6. Run desktop/mobile visual smoke check.

### Verification

- `npm run build`
- Check generated routes:
  - `/`
  - `/notes/`
  - `/notes/bert-bidirectional/`
  - `/projects/`
  - `/projects/dda-blackjack/`
  - `/lab/bilevel-toy/`
  - `/cv/`
  - matching `/en/*` routes
- Visual checks:
  - desktop 1440px
  - mobile 390px
  - long note title wrapping
  - project card two-column to stacked transition
  - Lab island nonblank and interactive
  - CV contact/download action visible
  - dark-mode path if theme toggle is shipped

## Current design verdict

Astro is architecturally in the right direction but visually only about 60-65% of the React prototype. The biggest mismatch is not color. It is information density and interaction affordance.

The first frontend fix should be to bring back React's card hierarchy, project evidence layout, and Lab visual surface while keeping Astro's static route/content-collection architecture.
