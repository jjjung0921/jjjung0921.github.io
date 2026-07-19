---
name: commit
description: Use whenever committing in this repo ("커밋해줘", "commit"). Enforces the ko→en content translation rule for src/content/ on the post branch, runs lint/build verification, and follows the repo commit message convention.
---

# Commit

Use this skill for every commit in this repo. It exists mainly to guarantee that Korean content committed on the `post` branch ships with its English translation.

## Procedure

1. Inspect what is being committed:
   ```bash
   git branch --show-current
   git status --short
   git diff HEAD -- src/content/
   ```
2. List Korean entries added or changed in this commit: paths under `src/content/` containing a `/ko/` segment (or frontmatter `lang: "ko"`).
3. For each Korean entry, check its English counterpart:
   - Path: replace the `ko/` segment with `en/` (`notes/ko/<field>/<slug>.md` → `notes/en/<field>/<slug>.md`; same pattern for `projects/`, `lab/`, `cv/`).
   - Pairing: same `translationKey`, `lang: "en"`.
4. If the counterpart is missing, or stale relative to the Korean changes, create or update it following `astro-frontend-architect` → "Content Translation on `post` Branch": translate every text frontmatter field and the body into natural technical English; keep non-text fields, code blocks, math, and links identical.
5. Verify:
   ```bash
   npm run lint
   npm run build
   ```
6. Stage the Korean and English files together, then commit. Do not push unless asked.

## Commit Message Convention

Match the existing history style: `[Feat]` / `[Fix]` + concise Korean summary (e.g. `[Feat] typescript everyday type post 추가`).

## Scope Notes

- The translation requirement applies to `src/content/` changes on the `post` branch. Non-content commits (styles, config, skills) commit normally after step 5.
- This skill governs commits made through the agent. Commits run directly in the terminal bypass it — if a past commit slipped through, backfill the missing English entry in the next commit.
