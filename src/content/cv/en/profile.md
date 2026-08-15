---
title: "Jungjin Lee CV"
lang: "en"
translationKey: "profile"
summary: "Started with Neural Architecture Search and now focused on bi-level optimization; currently building a user-interactive staged matgo game centered on Dynamic Difficulty Adjustment (DDA)."
updated: "2026-07-26"
---

# Jungjin Lee

Computer Science & Engineering student. Academically, my aim is to automate the construction of AI that fits the individual. Neural architecture search taught me to treat a model's design as something a search can discover rather than a human must hand-craft; player modeling and dynamic difficulty adjustment taught me that the target worth fitting is a specific person, not an average one. Bi-level optimization is where the two meet — an outer objective that adapts a system to its user, resolved by an inner search that builds it. The long goal is an AI model customized to an individual user, adapting dynamically as it is used — something we *synthesize*, not hand-tune.

## Philosophy

I don't trust a technique until I understand why it must exist. My default way of learning is to reconstruct a method from the limitation it answers — what the previous approach couldn't do, and why this one has to look the way it does. Understanding earned this way survives past the exam and transfers to the next problem.

To me, computer science is the work of reading the flow of data and building a city on the land called memory — one with the infrastructure that lets data travel safely, correctly, and efficiently. Every computation is data moving across memory, and you cannot reason about a program — let alone optimize it — until you can follow where that data goes and where its cost accrues. But efficient memory and efficient *programming* pull against each other: abstraction buys human clarity at the price of indirection, hand-tuning buys speed at the price of comprehension. Managing that tradeoff is the real craft — the abstractions I write at the top are only as good as how they resolve onto memory underneath.

A city, though, is never finished. Once residents move in, their patterns of movement change, and the planner redesigns the roads around them. That nested loop — an upper level shaping the environment, a lower level adapting within it — is the structure of bi-level optimization, and the reason I study it: the discipline that builds infrastructure for data should also be able to rebuild that infrastructure around a person.

## Education

| School | Program | Status |
|---|---|---|
| Dongguk University | Computer Science & Engineering | Present |

## Research Interests

- Bi-level Optimization
- Neural Architecture Search
- Player Modeling
- AI Agents & Systems
- Optimization-based Machine Learning

## Selected Projects

- **DDA Blackjack / Matgo** — research prototype framing dynamic difficulty adjustment as a bi-level optimization with player modeling; a stage-based game that drives skill improvement via performative prediction.
- **MEEA\* Retrosynthesis** — individual-research review of an MCTS-enhanced A\* search; reviewed the paper and code, reproduced the training pipeline the original repo omits, and ran cpuct / policyNet ablations.
- **NovelBot — Conversational AI for Web Novels** *(team)* — led the Spring Boot backend (auth, purchase, WebSocket chat), enforcing spoiler-safe, purchase-range access control over a RAG server.
- **Dasiro — Seoul Sinkhole Safety Map** *(team)* — deployed hackathon web app; D3.js + Kakao Maps risk visualization and safe-route guidance.
- **DGU Spring Festival Site** *(team)* — React frontend; ~2.7K active users and ~57K events (Google Analytics).

## Selected Notes

- **Performative Prediction** — anticipating the distribution shift a model itself induces
- **CMA-ES** — updating a search distribution for black-box optimization
- **BERT** — why bidirectional representation was the central problem
- **TypeScript type system** — how it statically models JavaScript

## Technical

- **Languages** — Java, Python, TypeScript / JavaScript
- **Backend** — Spring Boot, Spring Security / JWT, MySQL, Redis, WebSocket
- **AI / ML** — PyTorch, RAG (Milvus · LangChain), RDKit, MCTS · A\* search
- **Frontend** — React, Vite, Tailwind CSS, styled-components, D3.js
