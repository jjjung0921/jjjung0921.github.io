---
title: "DGU Spring Festival Website"
lang: "en"
translationKey: "dgu-spring-festival"
status: "done"
problem: "Build a mobile-first web app so festival visitors can quickly find festival information during the event."
role: "Frontend developer (team)"
timeRange: "2026"
stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "React Router", "axios"]
tags: ["Web", "Frontend", "Team"]
repository: "https://github.com/LikeLion-at-DGU/2026-spring-festival-frontend"
constraint: "Maintain a consistent UI under short-lived festival traffic and a mobile-first environment."
architecture: "Cohere components, hooks, and state per domain under features/, keep domain-agnostic UI in components/ui, and wrap the axios instance and utilities in lib/."
experiment: "Aimed to reduce merge conflicts and duplication in team collaboration through domain-based folder separation."
technicalCore:
  - "Feature-based folder architecture"
  - "Reusable UI components (cva · tailwind-merge)"
  - "Client-side routing"
  - "axios-based API integration"
outcome: "About 2.7K active users and roughly 57K total events (Google Analytics)."
summary: "Frontend for the LikeLion DGU 2026 spring festival website (team project)."
---

## Overview

Frontend for Dongguk University LikeLion's 2026 spring festival website. Built on React, Vite, and TypeScript with a feature-based folder structure to improve cohesion and reuse in team collaboration.

## Structure

- `features/` — components, hooks, and state cohered per domain
- `components/ui/` — domain-agnostic shared UI
- `lib/` — axios instance and utility wrappers
- `pages/` — route-level screens
