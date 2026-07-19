---
name: fullstack-data-flow
description: Use when data crosses a boundary — external API calls, form submissions, content pipeline to rendered page, or future frontend/backend contracts. Covers contract definition, request tracing, and CORS/auth/status-code/shape-mismatch diagnosis.
---

# Fullstack Data Flow

Use this skill when data crosses a boundary: frontend to backend, static site to external API, form submission to service, content pipeline to rendered page, or future dynamic features.

This portfolio is currently a static Astro site. Do not invent a backend. Only use this skill when an integration exists or is being designed. The main existing pipeline is content collections (`src/content/` + zod schemas in `src/content/config.ts`) flowing through `src/lib/content/` helpers into pages.

## Contract First

Find or define the contract before debugging or implementing:

- endpoint URL
- method
- request shape
- response shape
- status codes
- auth requirements
- caching behavior
- error shape

If no contract exists, reconstruct it from real code, docs, or captured requests and label it as an implementation assumption.

## Trace Procedure

1. Identify where the input originates.
2. Identify each transformation boundary.
3. Compare actual payloads to the expected contract.
4. Localize the break to one side of the boundary.
5. Propose the smallest correction.
6. Verify with a reproducible command or observed request.

## Common Failure Classes

| Class | Symptom | Check |
|---|---|---|
| URL/network | request does not reach target | URL, port, server availability |
| CORS | browser blocks response | `Access-Control-*` headers |
| auth | 401/403 | token/header/session |
| shape mismatch | 200 but empty UI | actual JSON vs expected fields |
| status handling | error shown as success | status-code branches |
| serialization | broken date/number/text | content type and encoding |
| cache/timing | stale or intermittent data | cache policy and request order |
| schema mismatch | build fails or entry missing | frontmatter vs zod schema in `src/content/config.ts` |

## Output Format

```md
## Data-flow check: <target>

### Contract
| Boundary | Input | Output | Status/auth |
|---|---|---|---|

### Trace
- Source:
- Transformations:
- Consumer:

### Finding
- Broken contract:
- Side responsible:
- Evidence:

### Fix
- Minimal change:
- Verification:
```

## Rules

- Do not guess payloads when real requests or code can be inspected.
- Do not redesign frontend or backend internals here; hand off to the relevant skill.
- Label assumptions clearly.
