---
title: "Why do DDA papers solve the same problem at different levels?"
lang: "en"
translationKey: "dda-research-map"
date: "2026-07-30"
field: "ai"
category: "Dynamic Difficulty Adjustment"
series: "DDA Paper Review"
order: 1
status: "reading"
summary: "Re-plotting five DDA papers along the axes of player state, meta balance, encounter generation, evaluation function, and AI strength control makes it clear where my bi-level DDA borrows a shared skeleton and where it has to stand apart."
problem: "Reading DDA papers, state estimation, meta balancing, encounter composition, and AI weakening all blur into one category, which makes it unclear which method should be the foundation of my own research."
coreIdea: "Splitting each paper by 'what does it adjust', 'what does it optimize', and 'at what time scale does it adjust' reduces the shared skeleton to a lower-level player model and an upper-level control policy."
connection: "For my DDA and bi-level work, this map is the starting point for separating the lower-level player model, the upper-level difficulty policy, and fairness/progression constraints."
tags: ["dda", "research-map", "bi-level-optimization", "personalization", "flow"]
---

# Putting the DDA papers on a single map

## Background
This post is based on my Notion write-ups, [DDA paper review collection](https://app.notion.com/p/374fb10f650180de9af1eea957ddd205) and [DDA research notes](https://app.notion.com/p/37bfb10f650180f9b7c2f6dd561c4fa5). The paper selection and the core interpretation come from my own notes; I used GPT to restructure and rephrase them for the blog, then reviewed the result myself against my notes and the original papers. The comparison axes and the limitations were revised after another pass over the source papers.

## Problem
Papers grouped under the name DDA often address quite different questions. Some estimate player state, some rearrange the meta, some generate enemy compositions, and some deliberately weaken the AI itself.
Once that distinction blurs, you end up comparing terminology instead of methods.

## Core idea
The five papers I read become much easier to organize along four axes.

- What is being adjusted
  - opponent strength
  - encounter composition
  - game meta
  - evaluation function
- What is being targeted
  - win rate
  - affective state
  - strategy entropy
  - tactical engagement
  - player-relative difficulty
- Where the adjustment happens
  - online inference
  - offline simulation
  - stage-level update
- What is missing
  - explicit player model
  - human study
  - fairness constraint
  - progression constraint

Laid out this way, even papers that share the DDA label split into roughly three lines of work.

1. Estimating player state and choosing actions from it
2. Regenerating enemy compositions or the meta
3. Deliberately weakening a strong AI

## Method
When reading these five papers, I worked through the following questions in order.

1. How does this paper define difficulty?
2. What is the control knob that changes that difficulty?
3. Does it model the player directly, or only through a proxy?
4. Is the adjustment real-time, stage-level, or offline?
5. Do the results look at player experience directly, or only at game metrics?

Under these criteria, the shared skeleton most useful to my own research reduces to the following.

$$
\phi^*(\psi) \in \arg\min_\phi \mathcal{L}_{player}(\phi; \mathcal{D}(\psi))
\qquad
\psi^* \in \arg\min_\psi \mathcal{L}_{DDA}(\psi; \phi^*(\psi))
$$

This formulation is my own rewriting of the structure the papers share.

- The lower level learns a player model or an outcome proxy
- The upper level looks at that result and picks a difficulty policy or content parameter
- The key is keeping the two out of a single shared loss

## Experiments / Results
Placed on this map, each paper sits somewhere different.

- `Bilevel Entropy based Mechanism Design for Balancing Meta in Video Games`
  - sits on the side that pushes up game meta diversity via entropy
  - no human study; it centers on benchmark simulators
- `Personalized Dynamic Difficulty Adjustment – Imitation Learning Meets Reinforcement Learning`
  - approximates player behavior with an imitation proxy and builds an RL opponent that plays against that proxy
  - there is a small user study, but the scale is limited
- `NTRL: Encounter Generation via Reinforcement Learning for Dynamic Difficulty Adjustment in Dungeons and Dragons`
  - recasts difficulty as an encounter composition generation problem
  - it compares simulator metrics and human DMs, but this is not a player experience study
- `Diversifying Dynamic Difficulty Adjustment Agent by Integrating Player State Models into Monte-Carlo Tree Search`
  - changes MCTS by injecting player state as a score function
  - there is a user study, and it centers on affective state
- `AlphaDDA`
  - sits on the side that weakens an already-strong AI using board state value
  - evaluation is AI-vs-AI only, with no human validation

In other words, results that look similar are in fact measured in different units.
Under the same DDA label, one paper adjusts `state`, another `meta`, another `content`, and another `strength`.

## Limitations
The map is useful, but it is not complete.

- Each paper uses different evaluation metrics
- Some have a user study and some do not
- Some look at gameplay outcomes while others look at player experience
- Equating a proxy metric with actual fun invites misreadings

So this map is better used as a tool for deciding "what belongs in the same category and what should be kept apart" than as a tool for deciding "which one is better."

## Connection to my DDA / bi-level research
Three separations matter most in my own work.

- Separate state estimation from control policy
- Separate capability difficulty from player-relative difficulty
- Separate proxy metrics from subjective experience

After reading all five together, the center of my research converges to the following.

> The lower level decides how to understand the player,
> and the upper level decides how to change difficulty based on that understanding

So this map is not just a summary; it is the reference point showing where my bi-level DDA extends the existing work and where it has to be careful.

## References
- [Bilevel Entropy based Mechanism Design for Balancing Meta in Video Games](https://www.ifaamas.org/Proceedings/aamas2023/pdfs/p2134.pdf)
- [Personalized Dynamic Difficulty Adjustment – Imitation Learning Meets Reinforcement Learning](https://arxiv.org/pdf/2408.06818)
- [NTRL: Encounter Generation via Reinforcement Learning for Dynamic Difficulty Adjustment in Dungeons and Dragons](https://arxiv.org/pdf/2506.19530)
- [Diversifying Dynamic Difficulty Adjustment Agent by Integrating Player State Models into Monte-Carlo Tree Search](https://cilab.gist.ac.kr/hp/wp-content/uploads/publications/international_journal/2022/ESWA_DDA.pdf)
- [AlphaDDA: Strategies for Adjusting the Playing Strength of a Fully Trained AlphaZero System to a Suitable Human Training Partner](https://arxiv.org/pdf/2111.06266)
