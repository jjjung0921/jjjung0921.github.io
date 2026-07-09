# CSS vs CSS+Tailwind vs Tailwind-only architecture comparison

**Date:** 2026-07-09  
**Status:** Architecture/design-system note  
**Scope:** Compare styling strategies for the current Astro portfolio and the preserved Vite React prototype.

## Context

The current repository has two frontend surfaces:

- Production-facing Astro shell:
  - `src/layouts/Base.astro`
  - `src/pages/**/*.astro`
  - `src/components/**/*.astro`
  - `src/styles/tokens.css`
  - `src/styles/global.css`
  - `src/styles/shell.css`
- Preserved Vite React prototype:
  - `src/App.tsx`
  - `src/components/Layout.tsx`
  - `src/prototype/pages/*.tsx`
  - `src/index.css`
  - `vite.config.ts`

The Astro shell currently imports plain CSS directly:

```astro
---
import '../styles/global.css';
import '../styles/shell.css';
---
```

The Astro build config is static and does not install Tailwind as an Astro integration:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
});
```

Tailwind currently exists for the Vite React prototype path:

```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

plugins: [react(), tailwindcss()]
```

and `src/index.css` starts with:

```css
@import "tailwindcss";
```

So the current project is not a clean CSS-only repository and not a clean Tailwind repository. It is an Astro production site using CSS tokens/classes, with a React/Tailwind prototype still present as a visual reference.

## Decision Criteria

The styling choice should be evaluated against this portfolio's actual direction:

- quiet lab-log visual language
- static content first
- route-based KO/EN pages
- typed content collections
- low client JavaScript
- long-term growth in notes, projects, and lab entries
- reviewer-facing consistency over rapid one-off UI assembly

## Option A: CSS-only

This means keeping the current Astro production path as:

- CSS variables in `src/styles/tokens.css`
- base and prose styles in `src/styles/global.css`
- shell/component classes in `src/styles/shell.css`
- semantic classes in Astro markup, for example `.page-stack`, `.card`, `.metadata`, `.lab-layout`

### Pros

- Best fit for the current Astro shell.
- Strongest design-system control for the quiet lab-log style.
- Markup stays semantic and readable:

```astro
<article class="card interactive-card project-card">
  <div class="project-detail-grid">
    ...
  </div>
</article>
```

- Shared tokens are explicit and easy to audit:

```css
--color-bg: #fcfcfa;
--color-ink: #1a1a18;
--color-accent: #1f5f54;
--content-width: 56rem;
--text-hero-title: clamp(2.8rem, 5vw, 4rem);
```

- Good for content-heavy Astro pages where structure is more important than micro-layout speed.
- Easier to preserve KO/EN route parity because page markup is not overloaded with long utility strings.
- No Tailwind integration risk in Astro.
- No need to reconcile Tailwind dark-mode strategy with the current `data-theme` approach.

### Cons

- More custom CSS must be maintained.
- New component variants require naming discipline.
- Without strict conventions, `shell.css` can become a large global stylesheet.
- It is slower for rapid prototyping than Tailwind utilities.
- Responsive behavior is less visible at the call site than `md:*` utility classes.

### Risks

- Global class collisions if names become too generic.
- Styling changes can have wider blast radius because classes are shared.
- A large `shell.css` can become difficult to navigate unless grouped by atoms, molecules, organisms, templates, and responsive rules.

### Fit for this project

High. This is the best default for the production Astro portfolio right now.

The current production UI already depends on semantic CSS classes:

- `.app-shell`
- `.sidebar`
- `.page-stack`
- `.page-header`
- `.hero-title`
- `.card`
- `.project-card`
- `.note-list-item`
- `.lab-layout`
- `.cv-header`

These are not generic layout snippets. They encode the portfolio's information architecture.

## Option B: CSS + Tailwind hybrid

This means keeping CSS variables and semantic classes, but also using Tailwind utilities in Astro components or pages for local layout and spacing.

Example:

```astro
<section class="card grid gap-6 md:grid-cols-2">
  ...
</section>
```

or a Tailwind v4 CSS-first setup with tokens exposed through Tailwind utilities while still keeping semantic component classes.

### Pros

- Useful middle ground if the project needs faster layout iteration.
- Tailwind can handle simple local layout utilities:
  - `grid`
  - `flex`
  - `gap-*`
  - `md:grid-cols-*`
  - `sr-only`
  - `print:*`
- CSS can remain the source of truth for brand tokens and complex organisms.
- Easier migration path if the React prototype's Tailwind patterns must be ported gradually.
- Good for one-off internal layout wrappers where creating a named class would add noise.

### Cons

- Highest convention burden.
- Two styling languages compete:
  - semantic CSS classes
  - inline utility strings
- Visual drift becomes easier because utility classes can bypass token decisions.
- Tailwind dark mode must be aligned with the current theme mechanism.
  - Prototype uses `.dark`.
  - Astro currently uses `:root[data-theme='dark']`.
- Requires adding Tailwind to the Astro build path if utilities are used in `.astro` files. The current `astro.config.mjs` does not do that.
- Harder to search for design primitives because styles are split between CSS files and markup.

### Risks

- Accidental "utility creep": every page starts carrying ad hoc spacing/color decisions.
- Duplicate tokens:
  - CSS variables in `tokens.css`
  - Tailwind theme values or arbitrary values in markup
- Bigger refactor surface if the team later chooses Tailwind-only.
- Higher chance of inconsistent KO/EN pages if utility changes are copied manually across localized routes.

### Fit for this project

Medium, but only with a strict boundary.

Recommended hybrid boundary:

- Keep `tokens.css`, `global.css`, and `shell.css` as the production design-system source of truth.
- Allow Tailwind only for:
  - prototype pages under `src/prototype/**`
  - temporary experiments
  - isolated client islands if they are intentionally React-based
- Do not use Tailwind utilities in production `.astro` routes unless the project explicitly adopts Tailwind in Astro.

If a hybrid Astro setup is chosen later, use this rule:

- CSS owns tokens, typography, color, major organisms, prose, and shell.
- Tailwind owns local layout utilities only.
- No arbitrary color utilities like `bg-[#fcfcfa]` in production Astro markup.
- No duplicated dark-mode model.

## Option C: Tailwind-only

This means migrating the Astro production shell to Tailwind utilities and minimizing custom CSS.

Example direction:

```astro
<main class="min-h-screen bg-[#fcfcfa] text-[#1a1a18]">
  <section class="mx-auto max-w-4xl space-y-12 px-6 py-20">
    ...
  </section>
</main>
```

### Pros

- Very fast component assembly.
- Responsive behavior is visible in markup through `md:*`, `lg:*`, etc.
- Good for teams already fluent in Tailwind.
- Reduces the need to invent class names for small layout differences.
- Can be effective if the design system is simple and utility-first from day one.

### Cons

- Poor fit for the current Astro shell unless a full styling migration is intentional.
- Markup becomes noisy, especially in content-heavy pages.
- Harder to keep the quiet lab-log system coherent because page authors can easily bypass semantic primitives.
- Repeated utility strings across KO/EN pages increase maintenance cost.
- Complex organisms such as lab demos, project cards, and prose rendering still need custom CSS or extracted component classes.
- Tailwind-only does not remove design-system work; it moves design decisions into long class strings unless tokens are carefully configured.

### Risks

- Redesign-by-accident. Tailwind defaults can pull the site toward generic SaaS/card UI rather than the current restrained notebook direction.
- Large migration cost:
  - `Base.astro`
  - `Sidebar.astro`
  - `PageHeader.astro`
  - `ProjectCard.astro`
  - `NoteListItem.astro`
  - `BilevelToyDemo.astro`
  - every route under `src/pages/` and `src/pages/en/`
- Requires deciding Tailwind v4 CSS-first setup for Astro, not just keeping the Vite prototype config.
- The current `data-theme` dark-mode implementation must be rewritten or bridged.

### Fit for this project

Low right now.

Tailwind-only made sense for the preserved React prototype because it was a fast visual prototype. It is less appropriate for the production Astro site because the production surface is now content-first, route-based, and design-token driven.

## Comparison Table

| Criterion | CSS-only | CSS + Tailwind | Tailwind-only |
|---|---|---|---|
| Current Astro compatibility | High | Medium | Low |
| Matches current implementation | High | Medium | Low |
| Quiet lab-log consistency | High | Medium | Medium-low |
| Prototype iteration speed | Medium | High | High |
| Long-term content maintainability | High | Medium | Medium-low |
| KO/EN parity maintenance | High | Medium | Medium-low |
| Risk of visual drift | Low | Medium-high | High |
| Build/config complexity | Low | Medium | Medium |
| Semantic readability | High | Medium | Low-medium |
| Refactor cost from current state | Low | Medium | High |

## Current Project Assessment

### Production Astro

Use CSS-only.

Reasons:

- The live shell already imports CSS directly from `Base.astro`.
- `astro.config.mjs` has no Tailwind integration.
- Production `.astro` markup already uses semantic classes.
- The portfolio's identity is encoded in tokens and shell primitives.
- The site is content-first, not interaction-heavy.

### React Prototype

Keep Tailwind isolated.

Reasons:

- The React prototype still uses Tailwind utilities heavily.
- `vite.config.ts` includes `@tailwindcss/vite`.
- `src/index.css` imports Tailwind.
- The prototype is useful as a visual comparison surface, not the production styling baseline.

### Shared Design Tokens

Do not duplicate tokens into Tailwind yet.

If the prototype needs closer visual parity, either:

1. copy the token values manually into prototype utilities for short-term comparison, or
2. migrate the prototype away from Tailwind toward the Astro token classes.

Do not build a shared token pipeline until the prototype has a clear long-term role.

## Recommendation

Use this policy:

1. Production Astro styling remains CSS-only.
2. `src/styles/tokens.css` is the source of truth for color, typography, spacing, radius, shadows, and layout widths.
3. `src/styles/global.css` owns base HTML/prose rules.
4. `src/styles/shell.css` owns reusable site primitives and organisms.
5. Tailwind remains limited to the Vite React prototype unless a new ADR explicitly approves Tailwind in Astro.
6. Do not mix Tailwind utilities into production `.astro` pages casually.

This keeps the project aligned with the current architecture:

- Astro for static routes and content collections.
- CSS tokens for design-system consistency.
- Minimal islands for interaction.
- React/Tailwind prototype as a reference, not a dependency of production UI.

## If Tailwind Is Reintroduced Into Astro Later

Adopt Tailwind only if one of these becomes true:

- many new interactive islands need rapid utility styling,
- multiple contributors are faster and more consistent with Tailwind,
- the team decides to maintain a formal Tailwind token layer,
- the prototype becomes the source of truth again.

If that happens, do it as a deliberate migration:

1. Add Tailwind to the Astro build path.
2. Decide whether dark mode uses `.dark` or `[data-theme='dark']`.
3. Map CSS variables into Tailwind-compatible tokens.
4. Convert one layer at a time:
   - atoms,
   - molecules,
   - organisms,
   - templates,
   - pages.
5. Keep `prose`, math, and lab visualization styles as semantic CSS unless Tailwind clearly improves them.
6. Verify with build and Chrome screenshots before removing old classes.

## Action Items

- [ ] Keep production Astro pages on semantic CSS classes.
- [ ] Keep Tailwind dependencies only while the React prototype remains useful.
- [ ] Add a comment or README note that `vite.config.ts` is for the prototype path, not the Astro production shell.
- [ ] Revisit dependency cleanup after deciding whether `src/prototype/**` remains in the repository.
- [ ] If prototype is removed, remove Tailwind, React, Vite prototype files, and related dependencies in one dedicated cleanup PR.
- [ ] If prototype remains, avoid importing `src/index.css` or prototype Tailwind utilities into Astro pages.
