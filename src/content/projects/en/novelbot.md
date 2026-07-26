---
title: "NovelBot — Conversational AI for Web Novels (Backend)"
lang: "en"
translationKey: "novelbot"
status: "done"
problem: "Web-novel readers need to resolve questions about a story instantly, without spoilers and within the range they have read (purchased)."
role: "Backend developer (team · primary contributor)"
timeRange: "2025"
stack: ["Java 17", "Spring Boot", "MySQL", "Redis", "Spring Security", "JWT", "WebSocket", "Google Cloud Storage", "Gradle"]
tags: ["Web", "Backend", "AI", "System", "Team"]
repository: "https://github.com/novelbot/Backend"
constraint: "The model must not retrieve or use information from episodes the user has not purchased or read — it holds the access boundary to prevent spoilers."
architecture: "React frontend ↔ Spring Boot backend (my part) ↔ Python RAG server (Milvus · LangChain, a teammate's part). The backend manages auth, web novels/episodes, purchases, and chat rooms, checks the retrieval boundary against an episode-level index and a per-user access matrix, and streams responses over WebSocket."
experiment: "Implemented the user, web-novel, episode, purchase, and chat domains, added WebSocket streaming and JWT auth, and validated integrated behavior. The target evaluation is to measure QA accuracy and spoiler-leakage rate per access profile."
technicalCore:
  - "Spring Boot · JWT/Spring Security auth & RBAC"
  - "Web-novel, episode, purchase, reading-progress domain APIs"
  - "WebSocket real-time chat streaming"
  - "Purchase-range access control · retrieval boundary check (spoiler prevention)"
  - "RAG-server integration (Milvus · LangChain)"
researchRelevance: "Access-constrained QA that never exceeds the purchased range — holding the retrieval boundary with an episode-level index and a per-user access matrix — may relate to the interactive-AI problems of constrained reasoning, retrieval control, and per-user information access. Going further, layering System 2-style deliberate reasoning (multi-hop, self-verification) onto the RAG responses nests reasoning inside retrieval, connecting to my interest in bi-level optimization and nested search."
links:
  - label: "NovelBot (organization repositories)"
    url: "https://github.com/orgs/novelbot/repositories"
summary: "A conversational AI platform where web-novel readers ask about a story without spoilers, within their purchased range. On a team project I led the Spring Boot backend (auth, web-novel/episode/purchase, WebSocket chat, access constraints, Python RAG-server integration)."
---

## Overview

NovelBot is a conversational AI platform that lets web-novel readers resolve questions about a story within the range they have read — without digging back through earlier chapters or risking spoilers. It is a team project, and I was the primary contributor on the **Spring Boot backend**.

## My part (Backend)

- Authentication/authorization and RBAC with JWT · Spring Security
- Web-novel, episode, purchase, and reading-progress domain APIs (MySQL · Redis · Google Cloud Storage)
- Real-time chat streaming over WebSocket
- Integration with the Python RAG server (Milvus · LangChain) and purchase-range access control

## Design view — access-constrained QA

The core constraint is: "never retrieve or answer with information beyond the range the user has purchased or read." To hold it:

- An episode-level vector index and a **per-user access matrix** keep only the read range in scope for retrieval
- A **boundary check** before/after retrieval blocks leakage from unpurchased episodes
- Target evaluation: measure **QA accuracy** and **spoiler-leakage rate** per access profile

## System layout

- **Frontend** (React) — a teammate's part
- **Backend** (Spring Boot) — my part: domains, auth, chat, integration, access control
- **RAG server** (Python · Milvus · LangChain) — a teammate's part: vector search, LLM responses

## Future direction

Beyond the backend, I want to strengthen the AI-response side with **System 2 deep learning (deliberate, multi-step reasoning)** — multi-hop reasoning across episodes, self-verification that an answer never crosses the spoiler boundary, and deliberate reasoning that iterates between retrieval and inference. This nests reasoning inside retrieval, meeting my interest in bi-level optimization and nested search.
