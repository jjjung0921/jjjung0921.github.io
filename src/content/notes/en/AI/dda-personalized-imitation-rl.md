---
title: "Does imitating the player and then beating them add up to personalized DDA?"
lang: "en"
translationKey: "dda-personalized-imitation-rl"
date: "2026-07-30"
field: "ai"
category: "Dynamic Difficulty Adjustment"
series: "DDA Paper Review"
order: 3
status: "reading"
summary: "This paper attempts personalized DDA by approximating player behavior with an imitation agent and training an RL opponent to beat that proxy. The objective, however, is still close to HP-centric, and guaranteeing real personalization would need a sharper upper-level objective."
problem: "Static difficulty and simple rule-based opponents fail to track a player's current behavior and shifting skill, which can produce frustration and boredom at the same time."
coreIdea: "Clone current player behavior with an imitation learning agent, train an RL agent against that proxy, and swap it in as the real opponent at fixed intervals."
connection: "In my bi-level DDA, this paper's imitation proxy is a good starting point for the lower-level player model, but the upper level should separate target difficulty from subjective experience."
tags: ["imitation-learning", "reinforcement-learning", "personalization", "fightingice", "concept-drift"]
---

# Does imitating the player and then beating them add up to personalized DDA?

## Background
This post is based on my Notion write-up, [Personalized DDA review](https://app.notion.com/p/374fb10f65018061a4cdc77dc2603afa). The paper selection and the core interpretation come from my own notes; I used GPT to restructure and rephrase them for the blog, then reviewed the result myself against my notes and the original paper. The experimental results and the research limitations were revised after another pass over the source paper.

## Problem
Existing DDA tends to lean on static difficulty or hand-crafted rules.
That approach is too hard for beginners and too easy for experienced players.

This paper takes one more step and asks: "if we build a proxy that directly mimics the player, does personalization get easier?"

## Core idea
### What the paper says
The structure has three stages.

1. Observe the current player's behavior
2. Train an imitation learning agent to clone that behavior
3. Train an RL agent against the imitation agent, and let this RL agent replace the actual opponent

Instead of facing the player directly, the system updates the opponent by having it face a proxy that resembles the player.

### My reading
The paper's biggest strength is that it builds an intermediate layer for personalized DDA.
But the current structure does not yet explicitly optimize for

- player preference
- target difficulty
- maintaining flow
- fairness

So the potential for personalization is visible, while the objective is not yet sharp enough.

## Method
The paper uses the following pipeline in the FightingICE environment.

- Train the imitation agent with an adaptive random forest classifier
- Train the RL opponent with A2C
- Replace the actual opponent with the RL opponent at fixed intervals

The paper itself contains no explicit bi-level formulation.
Rewritten in my own terms, it comes out as follows.

$$
\phi^*(\psi) = \arg\min_{\phi}\mathcal{L}_{player}(\phi; \mathcal{D}_{play}(\psi))
$$

$$
\psi^* = \arg\min_{\psi}\mathcal{L}_{DDA}(\psi; \phi^*(\psi))
$$

What matters here:

- The lower level is a proxy model approximating player behavior
- The upper level picks an opponent policy relative to that proxy
- But the paper never states the upper-level objective

That gap is exactly what I want to fill.

## Experiments / Results
The verifiable results the paper reports are fairly clear.

- The imitation learning agent's training accuracy was roughly 82–87%
- The user study ran with 5 participants
- Each participant played three times each against the MCTS agent and the proposed agent
- Mean rating was $7.0 \pm 1.09$ for the proposed agent versus $6.6 \pm 1.01$ for MCTS

I read these results with two things in mind.

1. It includes a real player study, however small
2. It is still preliminary, and not enough to generalize from

## Limitations
The paper points in a useful direction for personalized DDA, but it is not the answer for my research as it stands.

- The reward is close to HP-centric
  - hard to argue it optimizes player experience directly
- Proxy mismatch can occur
  - if the imitation agent misses the player's long-horizon strategy or preferences, the RL opponent can end up exploiting only the proxy
- The sample size is small
  - a 5-person user study cannot support a strong claim about personalization
- The bi-level structure is never made explicit
  - the dependency between lower and upper level is not pinned down mathematically

## Connection to my DDA / bi-level research
Three things I can carry over from this paper:

- The idea of placing player behavior as a lower-level proxy
- The update scheme of background training followed by periodic replacement
- Online player modeling that accounts for concept drift

And what I need to add:

- An upper-level objective that states target difficulty explicitly
- An experience model covering player preference and flow
- Fairness and progression constraints

So this paper is useful as an implementation idea for personalized DDA, but it falls short as a final objective for my own research.

## References
- [Personalized Dynamic Difficulty Adjustment – Imitation Learning Meets Reinforcement Learning](https://arxiv.org/pdf/2408.06818)
