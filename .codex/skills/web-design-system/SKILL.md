---
name: web-design-system
description: Portfolio design-system skill for preserving and extending the quiet lab log visual language across Astro pages, components, tokens, and responsive layouts.
---

# Web Design System

Use this skill for visual design decisions: tokens, typography, spacing, responsive rules, page layout, component hierarchy, and consistency with the existing portfolio style.

## First Check

Before changing design, inspect:

- `AGENTS.md`
- `.design-sync/conventions.md`
- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/styles/shell.css`
- existing pages/components near the target

State the current design direction briefly before proposing changes.

## Current Direction

The current direction is `Bitwise Cities` in a quiet lab log style:

- restrained research notebook feel
- static content first
- clear reviewer path
- metadata labels and dense but readable sections
- no marketing-heavy redesign unless explicitly requested

Core tokens:

| Role | Value | Use |
|---|---|---|
| background | `#fcfcfa` | page background |
| ink | `#1a1a18` | primary text |
| muted | `#6b6b66` | secondary text |
| line | `#e6e5e0` | borders and dividers |
| accent | `#1f5f54` | links and primary actions |

Typography:

- display: Noto Serif KR
- body: Pretendard
- metadata: JetBrains Mono

## Design Procedure

1. Identify reusable existing atoms/components before proposing new ones.
2. Define only the tokens or classes that need to change.
3. Keep responsive behavior explicit for mobile and desktop.
4. If a request conflicts with the current direction, call out the conflict and offer a minimal alternative.
5. For implementation tasks, hand the concrete design spec to `astro-frontend-architect`.

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
- Tokens:
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
