# Design System Foundations

**Status:** Active reference  
**Primary implementation:** `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/shell.css`  
**Historical prototype:** Removed from production; use current Astro styles as source of truth.

## Existing Direction

- Current concept: `Bit City Lab` in a quiet lab-log style.
- Visual role: personal research interface for AI, games, optimization, and computational systems.
- Design tone: calm, technical, notebook-like, evidence-oriented.
- Reused components: sidebar shell, page headers, cards, metadata labels, badges, note rows, project cards, CV card, lab demo frame.

The older prototype used Tailwind utilities such as `slate`, `teal`, `amber`, `rounded-xl`, `space-y-*`, `p-*`, and `md:*`. The Astro implementation should preserve that visual language through named tokens and semantic classes.

## Color

### Core Palette

| Role | Token | Value | Prototype source | Use |
|---|---|---:|---|---|
| Background | `--color-bg` | `#fcfcfa` | `bg-[#fcfcfa]` | Page background, lab grid base |
| Raised surface | `--color-bg-raised` | `#ffffff` | `bg-white`, `bg-white/80` | Cards, quote panels, nav active |
| Ink | `--color-ink` | `#1a1a18` | `text-[#1a1a18]`, `text-slate-900` | Primary text, primary button |
| Muted | `--color-muted` | `#6b6b66` | `text-slate-500`, `text-slate-600` | Supporting copy, metadata |
| Soft text | `--color-soft` | `#4f4f4a` | `text-slate-600` | Long prose |
| Divider | `--color-line` | `#e6e5e0` | `border-slate-200/60` | Borders, section rules |
| Accent | `--color-accent` | `#1f5f54` | `text-teal-700`, `accent-teal-700` | Links, active nav, metadata labels |
| Accent surface | `--color-accent-soft` | `rgba(31, 95, 84, 0.1)` | `bg-teal-50`, `hover:bg-teal-*` | Soft hover backgrounds |
| Warm signal | `--color-warm` | `#a16207` | `text-amber-700`, `bg-amber-500` | Secondary math/lab signal |

### Dark Palette

| Role | Token | Value | Prototype source |
|---|---|---:|---|
| Background | `--color-bg` | `#11110f` | `dark:bg-[#11110f]` |
| Raised surface | `--color-bg-raised` | `rgba(255, 255, 255, 0.05)` | `dark:bg-white/5` |
| Ink | `--color-ink` | `#f4f1ea` | `dark:text-[#f4f1ea]`, `dark:text-slate-50` |
| Muted | `--color-muted` | `#a9a59c` | `dark:text-slate-400` |
| Soft text | `--color-soft` | `#d4d0c7` | `dark:text-slate-300` |
| Divider | `--color-line` | `#2c2a25` | `dark:border-[#2c2a25]` |
| Accent | `--color-accent` | `#7dd3c7` | `dark:text-teal-300` |
| Warm signal | `--color-warm` | `#fcd34d` | `dark:text-amber-300` |

### Color Usage Rules

- Use `--color-accent` for navigation active states, labels, links, slider accents, and focused affordances.
- Do not use accent as a broad background color.
- Use `--color-warm` only for secondary mathematical or lab signal values.
- Use `--color-line` for all neutral borders and dividers.
- Avoid new hue families unless a new content domain truly needs a new semantic signal.

## Typography

### Font Families

| Role | Token | Stack | Prototype source | Use |
|---|---|---|---|---|
| Body | `--font-body` | `Pretendard, Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | `font-sans` | UI text, body copy |
| Display | `--font-display` | `"Noto Serif KR", Georgia, serif` | `font-serif` quote card | Hero title and quote panels |
| Mono | `--font-mono` | `"JetBrains Mono", "SFMono-Regular", Consolas, monospace` | `font-mono` | Metadata labels, equations, values |

### Type Scale

| Role | Token | Value | Use |
|---|---|---:|---|
| Extra small | `--text-xs` | `0.76rem` | badges, metadata labels |
| Small | `--text-sm` | `0.9rem` | metadata, card detail text |
| Body | `--text-body` | `1rem` | normal copy |
| Lede | `--text-lede` | `clamp(1rem, 1.6vw, 1.18rem)` | page intro, problem statement |
| Page title | `--text-page-title` | `clamp(2rem, 3vw, 2.75rem)` | normal route headings |
| Hero title | `--text-hero-title` | `clamp(2.8rem, 5vw, 4rem)` | home title only |

### Typography Rules

- Body text should remain compact and readable, not editorial.
- Use `letter-spacing: 0` for primary headings.
- Metadata labels may use `0.08em` uppercase tracking.
- Quote panels can use display serif, but normal card text should use body sans.
- Avoid viewport-width-only font scaling. Use bounded `clamp()`.

## Spacing

### Core Spacing Tokens

| Token | Value | Use |
|---|---:|---|
| `--space-page-y` | `5rem` | Bottom breathing room for page stacks |
| `--space-section` | `3rem` | Standard vertical gap between major sections |
| `--space-section-compact` | `2.25rem` | Detail pages where artifact should appear sooner |
| `--space-card` | `2rem` | Card internal padding ceiling |
| `--space-card-gap` | `0.85rem` | Default gap between direct card elements |
| `--space-card-gap-loose` | `1.15rem` | Project cards or evidence-heavy cards |
| `--space-card-element-gap` | `0.55rem` | Compact spacing inside a card content group |

### Prototype Mapping

| Prototype utility | Approximate production expression |
|---|---|
| `p-8` | `2rem`, or `clamp(1.25rem, 2.5vw, var(--space-card))` |
| `md:p-10` | `2.5rem`, only for large artifact cards |
| `space-y-12` | `var(--space-section)` |
| `space-y-20` | legacy prototype rhythm; production should prefer `3rem` to `5rem` |
| `gap-8` | `2rem` |
| `gap-10` | `2.5rem`, use sparingly |
| `pb-20` | `var(--space-page-y)` |

### Layout Spacing Rules

- Desktop shell padding should feel close to the prototype's `lg:p-20`.
- Current production `.main` uses `5rem clamp(1.25rem, 4vw, 5rem)`.
- Page headers use compact rhythm:
  - `gap: 0.65rem`
  - `padding-bottom: 1.5rem`
- Use more spacing around major artifacts than around metadata blocks.
- Do not stack cards with excessive vertical whitespace on project lists.

## Mobile Size System

Mobile uses explicit size tokens instead of shrinking desktop values ad hoc. CSS media queries still use the literal `780px` breakpoint because custom properties cannot be used directly in standard media query conditions.

| Role | Token | Value | Use |
|---|---|---:|---|
| Breakpoint | `--mobile-breakpoint` | `780px` | Documentation token for the mobile shell boundary |
| Shell horizontal padding | `--mobile-shell-padding-x` | `1rem` | Page, top nav, and utility row side padding |
| Shell vertical padding | `--mobile-shell-padding-y` | `1.5rem` | Main content top padding below sticky mobile nav |
| Navigation item width | `--mobile-nav-item-min` | `4.5rem` | Minimum tap target width for horizontal mobile nav |
| Navigation item height | `--mobile-nav-item-height` | `3.85rem` | Stable mobile nav item height with icon and label |
| Navigation icon | `--mobile-nav-icon` | `1rem` | Icon size inside mobile nav items |
| Utility control | `--mobile-control-size` | `2.5rem` | Language links and icon buttons in the mobile utility row |
| Page title | `--mobile-title` | `1.85rem` | Normal route headings below `780px` |
| Hero title | `--mobile-hero-title` | `2.35rem` | Home hero heading below `780px` |
| Section title | `--mobile-section-title` | `1.45rem` | Section headings below `780px` |
| Card padding | `--mobile-card-padding` | `1.15rem` | Cards, lab frame, and compact panels below `780px` |
| Card gap | `--mobile-card-gap` | `0.75rem` | Gap between direct card elements below `780px` |
| Card element gap | `--mobile-card-element-gap` | `0.5rem` | Compact spacing inside card content groups below `780px` |
| Lab frame minimum height | `--mobile-lab-min-height` | `19rem` | Interactive demo frame height below `780px` |

### Mobile Sizing Rules

- Do not use viewport-width font sizing for mobile text. Use fixed mobile title tokens below `780px`.
- Keep mobile nav items as icon plus label columns with stable width and height.
- Horizontal mobile navigation may scroll; avoid forcing all routes into the viewport.
- Language links and utility icon buttons should share the same control size.
- Cards and lab frames use compact padding, but prose and metadata must still be able to wrap without horizontal overflow.

## Radius and Shadow

| Role | Token | Value | Prototype source | Use |
|---|---|---:|---|---|
| Small radius | `--radius-sm` | `0.35rem` | `rounded-md` | metric pills, language pills |
| Medium radius | `--radius-md` | `0.55rem` | `rounded-lg` | nav items, buttons |
| Large radius | `--radius-lg` | `0.75rem` | `rounded-xl` | cards, panels, lab frame |
| Small shadow | `--shadow-sm` | `0 1px 2px rgba(26, 26, 24, 0.05)` | `shadow-sm` | cards, active nav |
| Medium shadow | `--shadow-md` | `0 14px 34px rgba(26, 26, 24, 0.08)` | `hover:shadow-md` | hover affordance |

### Rules

- Cards should use `--radius-lg`.
- Interactive hover should be subtle: border color plus small elevation.
- Avoid highly rounded pill cards except for badges and circular affordance controls.
- In dark mode, shadows are disabled; rely on borders and surface contrast.

## Grid and Layout

### Shell

| Element | Token/Class | Rule |
|---|---|---|
| Sidebar | `--shell-sidebar` | `16rem` / `256px` |
| Content | `--content-width` | `56rem` / `896px` |
| Wide content | `--content-wide` | `68rem` |
| Background grid | `.app-shell` | `24px` grid |
| Lab grid | `.lab-demo-frame` | `20px` grid |

### Responsive Rules

- Desktop:
  - sidebar is sticky and fixed-width.
  - content is centered at `56rem`.
  - project details use two columns.
  - lab uses `1fr + 18rem` side panel.
- Mobile below `780px`:
  - sidebar becomes top horizontal navigation.
  - utility row stays visible.
  - note rows, identity grid, project grids, lab layout, and CV header stack to one column.
  - arrow affordance in note rows is hidden.

## Motion

Prototype motion:

- Page transition: opacity, small vertical offset, blur.
- Lab signal: repeated vertical dot animation.
- Hover states: subtle elevation and color.

Production rules:

- Keep motion functional, not decorative.
- Use motion for interaction feedback and lab state only.
- Respect `prefers-reduced-motion`.
- Do not add background animation to the shell.

## Accessibility

- Keep `:focus-visible` outline using `--color-accent`.
- Icon-only buttons need `aria-label`.
- Language links should expose current state with `aria-current`.
- Do not rely on color alone for active navigation; use surface, border, and text color together.
- Keep text inside controls short enough for mobile.

## Implementation Handoff

### Files likely touched

- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/styles/shell.css`
- `src/components/ui/*.astro`
- `src/components/layout/Sidebar.astro`
- page components under `src/pages/**`

### Verification

- `npm run build`
- `npm run lint`
- Chrome visual check for:
  - `/`
  - `/projects/`
  - `/notes/`
  - `/lab/bilevel-toy/`
  - `/cv/`
  - mobile width below `780px`
