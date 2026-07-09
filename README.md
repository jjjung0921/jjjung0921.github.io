# Bit City Lab Portfolio

AI, game systems, optimization, and computational systems work를 정리하기 위한 개인 포트폴리오입니다. 목표는 방문자가 짧은 시간 안에 작성자의 연구 관심사, 프로젝트 근거, 기술 노트, CV, 실행 가능한 lab demo를 확인할 수 있게 하는 것입니다.

이 저장소는 현재 production shell을 Astro 정적 사이트로 구성합니다. 이전 React/Vite prototype은 삭제되었고, 현재 기준은 `src/pages`, `src/content`, `src/components`, `src/styles`입니다.

## Quick Start

**Prerequisites**

- Node.js 20 이상 권장
- npm

```bash
npm install
npm run dev
```

기본 개발 서버는 `http://localhost:3000`에서 실행됩니다.

```bash
npm run build
npm run lint
```

`build`는 Astro static output을 `dist/`에 생성하고, `lint`는 `tsc --noEmit`으로 타입 검사를 수행합니다.

## Project Role

이 프로젝트는 단순한 랜딩 페이지가 아니라, 연구/개발 이력을 검증 가능한 단위로 축적하는 정적 포트폴리오입니다.

- `projects`: 문제, 역할, 제약, 아키텍처, 실험, 기술 핵심, 연구 관련성을 정리합니다.
- `notes`: 기술 블로그와 논문/개념 노트를 축적합니다.
- `lab`: 브라우저에서 실행 가능한 작은 실험 또는 서버 확장이 필요한 실험의 진입점을 제공합니다.
- `cv`: 최신 CV와 연락 경로를 제공합니다.

디자인 방향은 "quiet lab log"입니다. 과한 랜딩 페이지보다 밀도 있는 metadata, 절제된 색상, 명확한 evidence path, 읽기 쉬운 technical prose를 우선합니다.

## Architecture

현재 아키텍처는 content-first Astro static site입니다.

```txt
portfolio/
  src/
    content/              # Typed content collections
      notes/
      projects/
      lab/
      cv/
      config.ts
    pages/                # Route-based pages, including /en mirrors
    components/
      layout/             # Sidebar shell
      ui/                 # Shared Astro UI primitives
      content/            # Note/project list items
      project/
      lab/                # Client-side demo surface
      cv/
    layouts/
      Base.astro          # Document shell, theme bootstrap, navigation frame
    lib/
      content/            # Slug, language, sorting helpers
      lab/                # Pure lab logic
    styles/
      tokens.css          # Design tokens
      global.css          # Base typography and prose
      shell.css           # Layout and component classes
  docs/
    design-system/        # Visual system source of truth
    *.md                  # ADRs and migration reports
```

### Key Decisions

- Astro is the production framework.
- Public pages are static by default.
- Content is stored in Astro content collections instead of hardcoded UI arrays.
- KO/EN pages use route-based mirrors such as `/` and `/en/`.
- Interactivity is isolated to small client-side surfaces, for example `BilevelToyDemo.astro`.
- No backend is required for the current public site.
- Future backend/cloud services should be added only when a lab entry needs private credentials, persistence, queues, or server compute.

See [docs/adr-001-portfolio-platform-architecture.md](docs/adr-001-portfolio-platform-architecture.md) for the longer architecture decision record.

## Content Model

Content schemas are defined in [src/content/config.ts](src/content/config.ts).

- `notes`: title, language, date, category, status, problem, core idea, connection, tags.
- `projects`: title, language, status, role, stack, problem, constraint, architecture, experiment, technical core, links.
- `lab`: title, language, tier, runtime, question, inputs, outputs, status, tags.
- `cv`: title, language, summary, updated date.

Language pairing uses `translationKey`. Routes are generated from content slugs, with English pages under `/en`.

## Styling

The design system lives in [docs/design-system](docs/design-system). Production styles are token-driven CSS, not Tailwind utilities.

- [src/styles/tokens.css](src/styles/tokens.css): colors, typography, spacing, radius, shadows.
- [src/styles/global.css](src/styles/global.css): reset, body defaults, prose styles.
- [src/styles/shell.css](src/styles/shell.css): sidebar, cards, metadata, buttons, lab UI, responsive layout.

When adding UI, prefer existing semantic classes and components before adding new CSS.

## Deployment Model

The current runtime target is a static CDN deployment.

Recommended baseline:

1. Install dependencies.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Upload `dist/` to a static host or object storage bucket.
5. Serve through a CDN.

Docker can be useful for reproducible builds, but the public site does not need a long-running container. If server-backed labs become necessary later, deploy them behind a separate API boundary and keep the public portfolio static.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Astro dev server on port 3000 |
| `npm run build` | Build static site into `dist/` |
| `npm run preview` | Preview built Astro site |
| `npm run lint` | Run TypeScript type check |
| `npm run clean` | Remove generated build output |

## Maintenance Rules

- Keep source content in `src/content`.
- Keep design decisions in `docs/design-system` or an ADR.
- Do not commit `dist/`, `.astro/`, `node_modules/`, local env files, or OS metadata.
- Add backend dependencies only when an implemented lab feature requires them.
- Verify changes with `npm run build` and `npm run lint` before committing.
