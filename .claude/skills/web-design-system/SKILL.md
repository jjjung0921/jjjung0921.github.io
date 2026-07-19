---
name: web-design-system
description: Use for visual design decisions in this portfolio — tokens, typography, spacing, responsive layout, component hierarchy, dark/light theming — preserving the quiet lab log visual language.
---

# Web Design System

Use this skill for visual design decisions: tokens, typography, spacing, responsive rules, page layout, component hierarchy, and consistency with the existing portfolio style.

## First Check

Before changing design, inspect:

- `src/styles/tokens.css` (light tokens in `:root`, dark overrides in `:root[data-theme='dark']`)
- `src/styles/global.css`
- `src/styles/shell.css`
- existing pages/components near the target, especially `src/components/ui/*`

State the current design direction briefly before proposing changes.

## Current Direction

The site is `Bit City Lab` in a quiet lab log style:

- restrained research notebook feel
- static content first
- clear reviewer path
- metadata labels and dense but readable sections
- no marketing-heavy redesign unless explicitly requested

Core tokens (light values; each has a dark counterpart in `tokens.css`):

| Role | Value | Use |
|---|---|---|
| background | `#fcfcfa` | page background |
| ink | `#1a1a18` | primary text |
| muted | `#6b6b66` | secondary text |
| line | `#e6e5e0` | borders and dividers |
| accent | `#1f5f54` | links and primary actions |

Status colors use the `--tone-*` tokens (success, progress, concept, stable, paused, draft, experiment) — reuse them instead of new one-off colors.

Typography:

- display: Noto Serif KR
- body: Pretendard
- metadata: JetBrains Mono

## Design Procedure

1. Identify reusable existing atoms/components before proposing new ones.
2. Define only the tokens or classes that need to change.
3. Any token addition or change must define both the light and the dark (`:root[data-theme='dark']`) value — the site has a theme toggle (`src/components/ui/ThemeToggle.astro`).
4. Keep responsive behavior explicit for mobile and desktop.
5. If a request conflicts with the current direction, call out the conflict and offer a minimal alternative.
6. For implementation tasks, hand the concrete design spec to `astro-frontend-architect`.

## Atomic Structure

Use this vocabulary when planning UI:

- atoms: badge, button, icon, label
- molecules: search row, metadata pair, link cluster
- organisms: side panel, project list, note list, lab entry section
- templates: page shell plus repeated content sections
- pages: localized route content

Do not multiply components when a `src/components/ui/*` primitive already covers the case.

## Output Format

```md
## Design: <target>

### Existing direction
- Current concept:
- Reused tokens/components:

### Proposed changes
- Tokens (light + dark):
- Layout:
- Responsive behavior:

### Implementation handoff
- Files likely touched:
- Verification:
```

## Rules

- Prefer token changes over one-off colors.
- Keep accent usage rare.
- Avoid decorative gradients, orbs, and unrelated palettes.
- Keep text fitting inside controls across mobile and desktop.
- Do not edit code from this skill alone unless the user request is explicitly an implementation request.
