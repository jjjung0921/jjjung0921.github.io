# Vite React to Astro refactor plan

**Date:** 2026-07-09
**Status:** Draft
**Scope:** Current portfolio checkout in `/Users/leejungjin/projects/portfolio`

## Executive decision

For this portfolio, Docker should not be the primary runtime for the public site.

The better default is:

```txt
CI or local Docker build image
  -> npm run build / astro build
  -> static dist/
  -> object storage
  -> CDN
```

Docker is useful for reproducible builds, CI parity, and local preview. The built files should then be hosted as static assets behind a CDN. Running a container just to serve static portfolio HTML, CSS, JS, fonts, and images adds operational surface without improving the reviewer experience.

If later lab demos need private API keys, persistence, scheduled jobs, or server-side compute, add a separate backend boundary. Do not turn the whole portfolio into a backend app just because some future lab entries may need one.

## Current repository reality

The current checkout is a Vite + React + Tailwind application, not an Astro application.

Observed files:

- `src/App.tsx`: client-side page switcher using React state.
- `src/components/Layout.tsx`: global shell, navigation, theme/language controls, animation wrapper.
- `src/data.ts`: project and note data factories mixed with translation calls.
- `src/pages/*.tsx`: page rendering, local interaction state, and content presentation.
- `src/content/*.md`: Markdown sources imported as raw strings.
- `src/index.css`: Tailwind import plus Markdown prose styling.
- `vite.config.ts`: React and Tailwind Vite plugins.

Build scripts:

- `npm run lint`: TypeScript no-emit check.
- `npm run build`: Vite static build.

## Current product role

The site is already shaped around a reviewer path:

1. Understand identity from the first screen.
2. Open CV quickly.
3. Inspect projects.
4. Read technical notes.
5. Try or inspect lab experiments.
6. Contact through GitHub or email.

That product role is content-first, not app-first. The interface should feel like a quiet lab log: dense metadata, research questions, project evidence, and runnable experiments only where they improve understanding.

## Current architecture map

```txt
index.html
  -> src/main.tsx
    -> SettingsProvider
      -> Layout
        -> App state: currentPage
          -> Home | About | Notes | Projects | Lab | CV
```

Data path:

```txt
Markdown files
  -> imported as raw strings
  -> src/data.ts factories
  -> page components
  -> MarkdownContent / custom JSX cards
```

Interaction path:

```txt
React state
  -> page switching
  -> note detail switching
  -> theme toggle
  -> language toggle
  -> lab slider
  -> CV PDF download
```

## Architecture issues to fix before content grows

### 1. Page navigation is not URL-addressable

`src/App.tsx` stores `currentPage` in React state. This means `projects`, `notes`, `lab`, and `cv` are not real routes.

Impact:

- A reviewer cannot link directly to a specific note, project, or lab entry.
- Browser refresh returns to `home`.
- SEO and static indexing are weaker than they need to be.
- Astro migration will need to turn every top-level page into a file route.

Astro target:

```txt
src/pages/index.astro
src/pages/about.astro
src/pages/projects/index.astro
src/pages/projects/[slug].astro
src/pages/notes/index.astro
src/pages/notes/[slug].astro
src/pages/lab/index.astro
src/pages/lab/[slug].astro
src/pages/cv.astro
```

### 2. Content and translation are coupled to React functions

`src/data.ts` exports `getProjects(t)` and `getNotes(t)`. The domain content depends on a runtime translation function.

Impact:

- Content is not portable to Astro content collections.
- Metadata cannot be validated independently.
- Adding many posts/projects will turn TypeScript files into content databases.
- Korean/English parity cannot be checked structurally.

Astro target:

Use file-backed content:

```txt
src/content/notes/ko/*.mdx
src/content/notes/en/*.mdx
src/content/projects/ko/*.mdx
src/content/projects/en/*.mdx
src/content/lab/ko/*.mdx
src/content/lab/en/*.mdx
```

or use paired entries:

```txt
src/content/notes/*.mdx
frontmatter:
  lang: ko | en
  translationKey: bert-bidirectional
```

### 3. Design tokens are embedded in Tailwind class strings

The visual direction is consistent, but tokens are repeated inline:

- `#fcfcfa`
- `#11110f`
- `#1a1a18`
- `#f4f1ea`
- `#1f5f54`
- `#e6e5e0`

Impact:

- The quiet lab-log style is preserved by convention, not by a stable token layer.
- Astro components may drift if every page repeats raw colors.
- Dark mode rules are duplicated across components.

Astro target:

```txt
src/styles/tokens.css
src/styles/global.css
src/styles/shell.css
```

Keep semantic tokens:

- `--color-bg`
- `--color-bg-dark`
- `--color-ink`
- `--color-muted`
- `--color-line`
- `--color-accent`
- `--font-body`
- `--font-display`
- `--font-mono`

### 4. Layout owns too many concerns

`Layout.tsx` currently owns:

- site shell
- navigation model
- active page state display
- theme controls
- language controls
- global links
- motion wrapper
- background grid
- responsive sidebar behavior

Impact:

- In Astro, most of this should become static shell HTML.
- Only theme/language toggles need client behavior.
- The whole layout should not require React hydration.

Astro target:

```txt
src/layouts/Base.astro
src/components/layout/Sidebar.astro
src/components/layout/NavItem.astro
src/components/islands/ThemeToggle.tsx
src/components/islands/LanguageToggle.tsx
```

Hydrate only the toggles if needed.

### 5. Notes detail view is stateful instead of routed

`Notes.tsx` stores `selectedNoteId` in local state.

Impact:

- Individual notes cannot be linked directly.
- Browser back does not behave like a document site.
- Note content is not independently buildable as a static page.

Astro target:

```txt
src/pages/notes/index.astro
src/pages/notes/[slug].astro
src/content/notes/*.mdx
```

The notes index should sort by date at build time.

### 6. Project entries are list-only

`Projects.tsx` renders project cards, but the current `Project` type is not enough for a serious project archive.

Current fields:

- `id`
- `name`
- `problem`
- `tags`
- `constraint`
- `technicalCore`
- `architecture`
- `experiment`
- `researchRelevance`
- `links`

Missing fields for growth:

- `status`
- `role`
- `timeRange`
- `stack`
- `repository`
- `demoUrl`
- `paperOrReport`
- `evidence`
- `screenshots`
- `results`
- `limitations`
- `nextStep`

Astro target:

```txt
src/content/projects/*.mdx
src/pages/projects/[slug].astro
src/components/project/ProjectCard.astro
src/components/project/ProjectEvidence.astro
```

### 7. Lab logic is mixed with page rendering

`Lab.tsx` computes:

```txt
x_star = lambda * 10
F_val = -x_star + 0.5 * (lambda * 5)^2
```

inside the React component.

Impact:

- The mathematical toy model is not testable independently.
- Adding more lab demos will mix simulation logic, UI controls, animation, and explanatory text.
- Server-backed lab entries will be harder to isolate later.

Astro target:

```txt
src/content/lab/*.mdx
src/lib/lab/bilevelToy.ts
src/components/lab/BilevelToyIsland.tsx
src/pages/lab/[slug].astro
```

Rule:

- Static explanation in Astro/MDX.
- Pure model logic in `src/lib/lab/*`.
- Interactive controls in an island.
- Heavy/server demos behind a future API.

### 8. CV PDF generation is client-heavy

`CV.tsx` dynamically imports `html2pdf.js`, which is good because it avoids loading it immediately. The production build still emits a large separate chunk.

Impact:

- This is acceptable as an island, but should not be part of the static CV rendering path.
- A prebuilt PDF artifact may be simpler and more reliable for reviewers.

Astro target:

Options:

1. Preferred: generate and store `public/cv/jungjin-lee-cv.pdf`.
2. Optional: keep `DownloadPdfButton.tsx` as a client-only island.

### 9. Dependencies include server/AI packages not used by the visible app

`package.json` includes:

- `@google/genai`
- `dotenv`
- `express`
- `tsx`
- `@types/express`

The visible current app is static and does not call Gemini or Express.

Impact:

- The dependency graph suggests a server/AI runtime that the public app does not currently use.
- This can confuse deployment decisions.
- Future maintainers may assume secrets are needed for the static site.

Astro target:

- Keep the public site free of server-only dependencies.
- Move future server code to `apps/api` or `packages/server`.
- Keep secrets out of the frontend app.

### 10. HTML metadata is still scaffolded

`index.html` uses the title `My Google AI Studio App`.

Impact:

- The current build is technically valid but not portfolio-ready.
- Astro migration should treat metadata, Open Graph, canonical URLs, sitemap, and RSS as first-class output.

Astro target:

```txt
src/components/seo/Seo.astro
src/siteConfig.ts
astro.config.mjs
```

## Lessons adapted from the referenced frontend audit thread

The referenced thread was about a different codebase, so its file-specific findings are not evidence for this repo. The useful transferable lessons are:

- Prefer real semantic routes and stable IDs over UI-only state.
- Avoid hidden coupling between templates/components and DOM structure.
- Do not hardcode navigational paths when the framework can generate routes.
- Keep input/control behavior directly accessible, not dependent on fragile indirect click handlers.
- Separate shared logic from page rendering before duplication appears.
- Treat "works visually" as insufficient; verify keyboard, browser navigation, failure states, and build output.

Applied to this portfolio, the equivalent risks are not jQuery-style DOM bugs. The risks are SPA routing, content coupling, global state, and client-only rendering of mostly static content.

## Recommended Astro target architecture

```txt
src/
  content/
    config.ts
    notes/
    projects/
    lab/
  components/
    layout/
      Sidebar.astro
      NavItem.astro
      Footer.astro
    ui/
      Badge.astro
      Button.astro
      Card.astro
      MetadataRow.astro
      Section.astro
    content/
      MarkdownProse.astro
      ContentHeader.astro
    project/
      ProjectCard.astro
      ProjectEvidence.astro
    lab/
      LabEntryCard.astro
    islands/
      ThemeToggle.tsx
      LanguageToggle.tsx
      BilevelToyIsland.tsx
      DownloadPdfButton.tsx
  layouts/
    Base.astro
    ContentLayout.astro
  lib/
    content/
      sortByDate.ts
      groupByTag.ts
    lab/
      bilevelToy.ts
  pages/
    index.astro
    about.astro
    cv.astro
    notes/
      index.astro
      [slug].astro
    projects/
      index.astro
      [slug].astro
    lab/
      index.astro
      [slug].astro
    en/
      ...
  styles/
    tokens.css
    global.css
    shell.css
```

## Static vs island boundary

| Feature | Astro static | Client island | Future backend |
|---|---:|---:|---:|
| Home/About | Yes | No | No |
| Notes index/detail | Yes | No | No |
| Project index/detail | Yes | No | No |
| CV page | Yes | Optional PDF button | No |
| Theme toggle | Mostly | Yes | No |
| Language toggle | Prefer routes | Optional | No |
| Bilevel toy slider | Explanation yes | Yes | No |
| Heavy lab compute | Writeup yes | Maybe | Yes if private/long-running |
| Search/filter | Initial static | Optional | No unless content becomes huge |

## Migration sequence

### Phase 0: Stabilize current baseline

1. Rename app metadata away from AI Studio scaffold text.
2. Remove unused server/AI dependencies if they are truly unused.
3. Keep `npm run lint` and `npm run build` green.
4. Decide whether this Vite app is a temporary prototype or the migration source of truth.

### Phase 1: Create Astro shell

1. Add Astro app structure.
2. Port the quiet lab-log shell into `Base.astro`.
3. Move repeated color/font values into tokens.
4. Implement static top-level routes.
5. Preserve Korean-first reviewer path.

### Phase 2: Move content to collections

1. Define `notes`, `projects`, and `lab` schemas.
2. Convert current notes and CV Markdown.
3. Convert project entries into MDX with frontmatter.
4. Add project detail routes.
5. Add lab detail routes.

### Phase 3: Reintroduce interactivity as islands

1. Port the bilevel toy to a small React island.
2. Extract `bilevelToy.ts` pure computation and test it separately.
3. Keep PDF download as either a static artifact or a small island.
4. Avoid hydrating the full layout.

### Phase 4: Deploy static output

1. Build Astro to `dist/`.
2. Upload static output to object storage.
3. Serve through CDN.
4. Configure security headers, cache rules, and invalidation.
5. Add link checking and build verification to CI.

### Phase 5: Add backend only when needed

Add backend cloud only if a lab entry needs:

- private API keys
- long-running compute
- persistence
- generated artifacts
- user-submitted inputs
- scheduled jobs

Until then, the portfolio should remain static.

## Docker and CDN recommendation

Use Docker like this:

```txt
Docker image
  -> install exact Node version
  -> npm ci
  -> npm run lint
  -> npm run build
  -> export dist/
```

Then host `dist/` on CDN-backed static storage.

Do not use Docker like this for the public portfolio unless backend rendering is required:

```txt
Docker container
  -> serve static files forever
  -> behind load balancer
  -> behind CDN
```

That second model is operationally heavier and does not improve a mostly static reviewer-facing portfolio.

## Verification checklist for the refactor

Minimum:

- `npm run lint`
- `npm run build`
- each route renders in Korean and English or is explicitly deferred
- refresh works on each route
- direct links work for notes/projects/lab entries
- CV download or static PDF link works
- no frontend bundle contains private API keys

For visual verification:

- desktop and mobile screenshots
- dark and light theme check
- long title wrapping check
- Markdown math rendering check
- keyboard navigation through sidebar and controls

For lab verification:

- pure lab functions have deterministic tests
- islands load only on lab pages
- heavy computation is not bundled into every page

## Open decisions

1. Site name: keep `Bit City Lab` or return to `Bitwise Cities`.
2. Localization: route-based `/en/*` or client language toggle.
3. CV: static generated PDF or browser-generated PDF.
4. Deployment target: Cloudflare Pages, AWS S3 + CloudFront, or another static host.
5. Repository shape: single Astro app or `apps/web` workspace layout.

## Recommended next action

Create the Astro shell and content schema before adding more posts or projects. The current Vite app is useful as a visual/content prototype, but it should not be the long-term content architecture if the blog, project archive, and lab area are expected to grow.
