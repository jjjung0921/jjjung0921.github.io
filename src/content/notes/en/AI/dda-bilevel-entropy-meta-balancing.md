---
title: "What shows up when you measure the meta with entropy?"
lang: "en"
translationKey: "dda-bilevel-entropy-meta-balancing"
date: "2026-07-30"
field: "ai"
category: "Dynamic Difficulty Adjustment"
series: "DDA Paper Review"
order: 2
status: "reading"
summary: "BiGMB treats the game meta not as a fixed win-rate table but as the entropy of an equilibrium strategy. The paper does not personalize DDA, but it gives a strong hint about how to define the upper-level objective in my own work."
problem: "In an imbalanced meta only a handful of strategies survive, so the designer's objective has to be redefined from raw win rate to diversity at equilibrium."
coreIdea: "Approximate the MSNE at the inner level, then optimize meta parameters at the outer level so that the entropy of that mixed strategy increases."
connection: "In my bi-level DDA, entropy fits more naturally as an auxiliary regularizer than as the main objective, and the lower level is better occupied by an actual player model."
tags: ["game-meta", "entropy", "mechanism-design", "cma-es", "nash"]
---

# What shows up when you measure the meta with entropy?

## Background
This post is based on my Notion write-up, [Bilevel Entropy based Mechanism Design review](https://app.notion.com/p/374fb10f6501804c8721dc1b3daad34b). The paper selection and the core interpretation come from my own notes; I used GPT to restructure and rephrase them for the blog, then reviewed the result myself against my notes and the original paper. The role of the equations and the limitations were revised after another pass over the source paper.

## Problem
In most games the real question is not "which strategy is strongest" but "which strategies end up being the only ones played."
A meta where only one or two items, decks, or strategies survive narrows the player's options and ultimately reduces the game's diversity.

This paper frames that as game meta balancing and moves the criterion for balance from win rate to the entropy of the strategy distribution.

## Core idea
### What the paper says
The core is simple.

- At the inner level, approximate the mixed strategy Nash equilibrium of a normal-form game
- At the outer level, maximize the entropy of that equilibrium strategy
- The meta parameter $\theta$ is the knob the designer can turn

The goal, in other words, is not "a meta where a particular strategy is strong" but "a meta where many strategies stay alive."

### My reading
To me the paper matters for two reasons.

1. It treats game balance as distributional diversity rather than a point estimate
2. It shows that outer-level optimization can be recast as a control problem like DDA

That diversity, however, is not the same thing as player experience.
So in my own work the paper is less a main objective than one axis to consult when designing an objective.

## Method
The paper's structure is `MSNE approximation + entropy optimization`.

### 1. Inner level: Nash Monte-Carlo Learning
The combinatorial strategy space is treated as an MDP, turning item selection into a sequential decision problem.
A Monte-Carlo method then approximates the policy to obtain a mixed strategy.

### 2. Outer level: CMA-ES
Given the equilibrium strategy distribution from the inner level, CMA-ES searches over meta parameters.
Black-box optimization fits better here than gradients.

### 3. Regularization
Maximizing entropy alone can erase designer intent, so a penalty keeps the solution from straying too far from the initial meta $\theta_0$.

The paper's central equations can be read as follows.

$$
\max_{\theta}\; \mathbb{E}_{\sigma_i^* \sim NFG2P_{\theta}}\left[H(\sigma_i^*)\right]
$$

$$
H(\sigma_i) = -\sum_{s \in S_i}\sigma_i(s)\log \sigma_i(s)
$$

$$
\max_{\theta}\; H(Y) - \|r \odot \theta - r \odot \theta_0\|_2
$$

The way I read it:

- `entropy` is the force pushing diversity up
- `regularization` is the force holding on to the designer's intent
- the balance between the two is the real target of meta balance

## Experiments / Results
The paper evaluates on RPSFW, Workshop Warfare, and Pokemon VGC.
Compressed to the essentials:

- On small strategy spaces it matched or beat ERG-based baselines on entropy
- As the combinatorial space grew, BiGMB's scaling advantage grew with it
- Entropy dropped when regularization was too strong

What I care about is the structure more than the numbers.

- The paper does not fit a target payoff matrix directly
- Instead it directly optimizes diversity at equilibrium
- Which puts it closer to meta-level balancing than to DDA

## Limitations
The paper is clearly useful, but there are parts I should not carry over as-is.

- There is no personalization
  - it does not model a specific player's preferences or affective state
- There is no human study
  - whether higher entropy actually translates into more fun is never verified
- Entropy speaks to diversity but does not by itself guarantee a good experience
  - a meta can be diverse and still be unfair or exhausting
- Approximations like $\hat{P}(Y)=P(Y^1)$ are heuristics
  - they cut computation, but they cannot be assumed to always hold

## Connection to my DDA / bi-level research
Rather than adopting the paper's entropy as my objective function directly, the natural arrangement in my work is this.

- Put a player behavior model or preference model at the lower level
- Put target difficulty, flow, fairness, and progression constraints at the upper level
- Add entropy as an auxiliary term to prevent strategy collapse

BiGMB is, in short, a good example of how to handle meta diversity mathematically.
But the end goal is not diversity itself — it is making that diversity compatible with player experience.

## References
- [Bilevel Entropy based Mechanism Design for Balancing Meta in Video Games](https://www.ifaamas.org/Proceedings/aamas2023/pdfs/p2134.pdf)
