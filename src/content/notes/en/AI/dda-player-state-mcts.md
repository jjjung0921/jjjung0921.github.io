---
title: "Does MCTS change when player state becomes the score?"
lang: "en"
translationKey: "dda-player-state-mcts"
date: "2026-07-30"
field: "ai"
category: "Dynamic Difficulty Adjustment"
series: "DDA Paper Review"
order: 5
status: "reading"
summary: "Instead of HP difference, this paper feeds MCTS a player state model that predicts Challenge, Competence, Valence, and Flow. It shows fairly clearly that DDA's criterion can move from game metrics to player experience."
problem: "Heuristics like HP difference, score, and win rate do not directly explain the challenge or immersion the player actually feels."
coreIdea: "Combine real and simulated logs to predict player state, and use that predicted score as the MCTS evaluation function."
connection: "In my bi-level DDA, borrowing this paper's player state predictor as the lower-level experience model works well, while target difficulty and fairness constraints belong separately at the upper level."
tags: ["mcts", "player-state-model", "affective-state", "flow", "fightingice"]
---

# Does MCTS change when player state becomes the score?

## Background
This post is based on my Notion write-up, [Player State MCTS review](https://app.notion.com/p/37afb10f6501804f96b7ff251493afad). The paper selection and the core interpretation come from my own notes; I used GPT to restructure and rephrase them for the blog, then reviewed the result myself against my notes and the original paper. The model accuracy figures and the meaning of the user study were revised after another pass over the source paper.

## Problem
Existing DDA leans heavily on numbers like HP difference and win rate.
But a number being right does not make the experience right.

Starting there, the paper asks: "if we use the state the player actually feels as a predicted score, does MCTS become more experience-oriented?"

## Core idea
### What the paper says
The core is combining a player state model with MCTS.

- Build the input by concatenating real-played logs and MCTS-simulated logs
- Predict Challenge, Competence, Valence, and Flow from that input
- Use the predicted score as the MCTS node value

What MCTS optimizes is no longer "the winning move" but "the move most likely to produce the desired play state."

### My reading
The paper is strong because it changes DDA's objective quite directly.
Still, the approach does not yet handle

- per-player preference
- hard flow constraints
- long-term adaptation

directly.
So it is close to state-aware DDA, but not fully personalized DDA.

## Method
### Input and model
The paper uses 5-second game logs.

- 4.5 seconds of real-played log
- 0.5 seconds of MCTS-simulated log

FightingICE runs at 60fps, so using every feature would be far too heavy.
Sampling every 15 frames keeps it within real-time budget.

### MCTS score
Earlier MCTS-DDA used HP difference as the score.
This paper replaces it with the player state prediction score.

Standard UCB1 is:

$$
UCB1_i = v_i + C\sqrt{\frac{2\ln N}{n_i}}
$$

My own reading of it comes out as:

$$
score_q(\tau) = P_\phi^q(y_q = 1 \mid I_p \oplus I_s)
$$

This equation is my rewriting of the paper.

- $I_p$: the actual play log
- $I_s$: the short future log produced by MCTS
- $P_\phi^q$: the player state model predicting target state $q$
- $score_q(\tau)$: the likelihood that this trajectory induces the target state

So MCTS asks not "which move wins more" but "which move better induces the target state."

## Experiments / Results
The paper verified the following in FightingICE.

- The player state model was trained on 688 game logs from 43 people
- The user study ran with 20 participants
- Model accuracy was 71.5% for Challenge, 69.4% for Competence, 68.4% for Valence, and 73.1% for Flow
- The CO, VA, and FL agents produced better subjective experience than the HP baseline
- The CH agent showed no significant improvement

Two points stand out to me here.

1. Player-state-aware DDA actually carried through to a user study
2. Not every target state is automatically a good DDA objective

## Limitations
The paper moves DDA toward experience, but its limits are clear.

- Flow is not a hard constraint
  - it is closer to a soft objective preferring the target state
- Labels come from post-game GEQ
  - not moment-level affective state
- It is not a per-player preference model
  - it uses the current log, but long-term personalization is weak
- State model accuracy is not perfect
  - the score itself can be noisy

## Connection to my DDA / bi-level research
This paper connects most directly to my own work.

- It already demonstrates the role of a lower-level player model
- Injecting an experience model into MCTS is an example of objective portability
- It also makes clear that PX has to be evaluated through a user study

What I want to add on top:

- An explicit upper-level objective that separates skill from difficulty
- Fairness and progression constraints
- A per-player preference trajectory

So the paper is a good reference point for `player-state-aware DDA`, and my research takes one more step toward `bi-level personalized DDA`.

## References
- [Diversifying Dynamic Difficulty Adjustment Agent by Integrating Player State Models into Monte-Carlo Tree Search](https://cilab.gist.ac.kr/hp/wp-content/uploads/publications/international_journal/2022/ESWA_DDA.pdf)
