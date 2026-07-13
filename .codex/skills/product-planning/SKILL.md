---
name: product-planning
description: Portfolio product planning skill for checking whether pages, links, features, and user journeys support the site's goal: help a busy reviewer understand the person, get the CV, and reach concrete work quickly.
---

# Product Planning

Use this skill when the task is about what the portfolio should contain, how a reviewer moves through it, whether a feature is necessary, or where the site flow feels blocked.

## Project Goal

This site exists so one link is enough for a lab PI, recruiter, or collaborator to understand the user quickly and inspect concrete work.

Success path:

1. First screen communicates identity.
2. Reviewer can get the CV.
3. Reviewer can inspect projects, notes, or lab demos without a dead end.
4. Reviewer can contact or evaluate the user with minimal friction.

## Procedure

1. Read the current goal source: `AGENTS.md`, `CLAUDE.md`, `README.md`, and relevant pages.
2. Inventory the affected pages or features.
3. Map each page/feature to the success path above.
4. Identify flow breaks:
   - dead end
   - missing link
   - unclear label
   - too many clicks
   - slow or risky demo entry
   - mobile friction
5. Classify each idea as:
   - `fit`: directly supports the portfolio goal
   - `under`: necessary but missing
   - `over`: adds maintenance or complexity without helping the goal
6. Recommend the smallest next product change.

## Output Format

```md
## Product check: <target>

### Goal and reviewer
- Goal:
- Reviewer:
- Success path:

### Inventory
| Page or feature | Reviewer action | Goal contribution |
|---|---|---|

### Flow breaks
- Where:
- Problem:
- Why it blocks the goal:

### Fit / under / over
- Fit:
- Under:
- Over:

### Recommendation
- Next action:
- Expected verification:
```

## Rules

- Do not redesign the visual layer here; use `web-design-system` for that.
- Do not implement code here; use `astro-frontend-architect` after the product decision is clear.
- Push back on features that make the reviewer journey slower.
- If the goal is unclear, clarify before judging.
