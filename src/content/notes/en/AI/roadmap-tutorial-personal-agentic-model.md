---
title: "[Tutorial] I want to build a model that adapts to one person"
lang: "en"
translationKey: "roadmap-tutorial-personal-agentic-model"
date: "2026-09-19"
field: "ai"
category: "Research Roadmap"
series: "Research Roadmap"
order: 1
status: "draft"
summary: "This post first defines the goal of the series: 'an agentic model that adapts to a single user.' I define agentic with three verbs (decide, observe, adapt), split the goal into three questions, and place them across five stages."
problem: "If I study meta-learning, performative prediction, and bi-level optimization separately, I cannot see why the three belong in one piece of research."
coreIdea: "If an agentic model is defined as 'a model that makes its own decisions, observes how those decisions change the user's responses, and adapts its next decisions to that user,' then meta-learning handles adaptation, performative prediction handles decisions and responses, and bi-level optimization handles writing the two as one problem."
connection: "Stages 1–5 take up, in order, the questions that come out of this goal. The depth for each tool lives in the MAML Task Paradigms, Performative Prediction, Optimization Foundations, and Personalization as Optimization series and in the DDA paper map."
tags: ["research-roadmap", "personalization", "agentic-model", "meta-learning", "performative-prediction", "bi-level-optimization", "nas"]
---

# I want to build a model that adapts to one person

> What is this series trying to answer by the end?

## 0. Goal: what do I want to build?

This series starts from a one-sentence goal.

**Build an agentic model that adapts to a single user.**

For this goal, I first picked **Neural Architecture Search** (NAS) as the tool. I thought of adapting to a person as automatically changing the shape of the neural network for each individual. DARTS wrote architecture as a bi-level train/validation problem, and NAO moved architecture into a continuous space and moved it with gradients ([NAS Foundations](/en/notes/nas-darts-bilevel-relaxation/)). This is where I saw that architecture can also be an optimization variable, and that the optimization splits into two levels. But the compute NAS demands was far too large to search an architecture for every single person. So I moved my interest from architecture to adapting the **parameters** to the individual. The tool on the parameter side is MAML. The problem that the person I adapt to responds back is Performative Prediction.

| What is changed to adapt | Tool | Cost per person |
|---|---|---|
| The network's shape | NAS (DARTS, NAO) | One architecture search — more than I can afford |
| Parameters | MAML | A few gradient steps from a shared starting point |

I picked up the language of bi-level in that period, so I meet it again in Stage 3.

The five stages deal with the same question even as the tools change. At the start of each stage, I come back to this sentence.

## 1. Agentic model: what do I call agentic?

In 2026, "agentic" usually brings to mind LLM agents that get work done by calling tools. The agentic we look at in this series is different. It is the loop of decisions and responses that passes between the model and the user.

> [!info] Agentic model
> A model that makes its own decisions, observes how those decisions change the user's responses, and adapts its next decisions to that user.

Where each tool fits is set by the verbs in the definition: decide, observe, adapt.

> [!interpretation] My interpretation
> An LLM agent that calls tools also makes its own decisions. But it only stores the user's responses in memory and reads them back; the model itself stays the same. What I want to hold on to in this definition is the last verb of the loop. The loop closes only when the observed responses change the model in turn. That is why the first question of this series is "adapt."

## 2. Splitting the goal into three questions

The goal sentence cannot be solved as it stands, so I split it into questions along its verbs.

| Verb | Question | Tool | Stage |
|---|---|---|---|
| Adapt | How do I learn one person quickly from few observations? | meta-learning, MAML | 1 |
| Decide → observe | What if my decisions change that person? | Performative Prediction | 2 |
| The whole loop | How do I write both directions as one problem? | bi-level optimization | 3 |

After that, Stage 4 covers a testbed for checking whether this shape actually works, and Stage 5 covers the question I ran into while trying to put MAML on that testbed.

## 3. Why games?

I need a testbed where both decisions and responses are observed. In a game, the user's response to the difficulty the model chose is left behind as wins, losses, and actions. Players can be simulated, so I can also run a whole scenario before bringing in real people (Stage 4). The testbed, staged-dda, splits a game into stages and picks the difficulty for each. The "stages" of this series use the word in the same sense.

## 4. Stage map

I ordered the series by how the questions lead into one another. Each stage runs "why this tool was needed → what the tool gave → what it left." What it left becomes the next stage's question.

```text
[Tutorial] An agentic model that adapts to a single user
   ▼
[Stage 1] How to learn one person quickly?      → MAML
   │  Left: only one direction
   ▼
[Stage 2] What if decisions change the person?  → Performative Prediction
   │  Left: two directions, kept separate
   ▼
[Stage 3] Both directions as one problem?       → bi-level optimization
   │  Left: the shape alone does not solve it
   ▼
[Stage 4] Where to show it is feasible?         → staged-dda
   │  Left: a task distribution is needed
   ▼
[Stage 5] Whom to group into one distribution?  → Track B
```

This series is the skeleton. The depth lives in the [NAS Foundations](/en/notes/nas-search-space-evolution/), MAML Task Paradigms(forthcoming), [Performative Prediction](/en/notes/performative-prediction/), Optimization Foundations(forthcoming), and Personalization as Optimization(forthcoming) series, and in the [DDA paper map](/en/notes/dda-research-map/). The `Connections` section at the end of each post leads into those series.

## Connections

- Related project: [General-purpose staged-DDA](/en/projects/dda-blackjack/)
- Related experiments: none (E1 is in Stage 4)
- Next question to check: what does the ability to learn one person quickly become when written as a learning problem? → [Stage 1](/en/notes/roadmap-personal-model-and-maml/)
