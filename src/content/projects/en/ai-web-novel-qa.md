---
title: "AI Web Novel QA System"
lang: "en"
translationKey: "ai-web-novel-qa"
status: "concept"
problem: "How can an AI answer user questions about a story while respecting purchased-episode constraints?"
role: "System designer"
timeRange: "Concept"
stack: ["RAG", "Vector DB", "Access Control", "TypeScript"]
tags: ["AI", "Web", "System"]
summary: "A constrained QA project that only retrieves and answers from episodes the user is allowed to access."
constraint: "The model must not retrieve or answer from episodes the user has not purchased."
architecture: "A RAG pipeline with episode-level vector indexes, a user access matrix, and boundary checks before and after retrieval."
experiment: "Measure QA accuracy and spoiler leakage across different access profiles."
technicalCore:
  - "Retrieval under access constraints"
  - "User-highlighted entity tracking"
  - "Context boundary control"
  - "Spoiler leakage evaluation"
researchRelevance: "This connects to constrained reasoning, retrieval control, user-specific access, and interactive AI systems."
links:
  - label: "Details"
    url: "/en/projects/ai-web-novel-qa/"
---

## Architecture sketch

- Episode-level vector index
- User access matrix
- Retrieval boundary check
- Spoiler leakage evaluation

## Evidence target

The first evaluation target is QA accuracy versus spoiler leakage across different access profiles.
