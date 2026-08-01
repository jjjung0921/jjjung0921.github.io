---
title: "Can a strong AlphaZero be dialed down to a human partner's level?"
lang: "en"
translationKey: "dda-alphadda-playing-strength"
date: "2026-07-30"
field: "ai"
category: "Dynamic Difficulty Adjustment"
series: "DDA Paper Review"
order: 6
status: "reading"
summary: "AlphaDDA uses a fully trained AlphaZero's board-state value to adjust simulation count, dropout probability, or the UCT score. It is the most direct DDA baseline for bringing a strong AI down to a human-appropriate strength without retraining it."
problem: "A fully trained AlphaZero is too strong for most human players to use as a training partner, yet retraining a weak AI from scratch is inefficient."
coreIdea: "Read a smoothed board-state value and dial the MCTS search budget or network reliability up or down to adjust AI playing strength."
connection: "In my bi-level DDA I can borrow this paper's value-based strength knob as part of the opponent policy, but the real goal has to shift to optimizing target experience through a player model."
tags: ["alphazero", "mcts", "board-game", "strength-balancing", "dropout"]
---

# Can a strong AlphaZero be dialed down to a human partner's level?

## Background
This post is based on my Notion write-up, [AlphaDDA review](https://app.notion.com/p/37afb10f650180c086d1e1a16e4cbb0a). The paper selection and the core interpretation come from my own notes; I used GPT to restructure and rephrase them for the blog, then reviewed the result myself against my notes and the original paper. The three strength-adjustment methods and the experimental limitations were revised after another pass over the source paper.

## Problem
A strong board game AI is not always a good training partner.
Too strong and the human player loses immediately; too weak and it is not practice at all.

The paper starts from the question: "can we leave the strong AlphaZero as it is and adjust only its strength?"

## Core idea
### What the paper says
AlphaDDA does not train a new AI.
It keeps a fully trained AlphaZero and adjusts strength according to the current board state value.

There are three adjustment methods.

- AlphaDDA1: adjusts the MCTS simulation count
- AlphaDDA2: adjusts the dropout probability
- AlphaDDA3: modifies the UCT score

### My reading
The paper's strength is that the knob is extremely clear.
But by the same token, this is not yet personalized DDA.

- There is no player preference
- There is no player model
- There is no PX objective beyond win/loss/draw

It shows "how to make a strong AI weaker," not "who to match at what strength."

## Method
The paper uses $\bar v_n$, a smoothed average of recent value estimates, as the strength signal.

$$
\bar{v}_n = \frac{1}{N_h}\sum_{i=0}^{N_h-1} v_{n-i}
$$

Each variant then uses that signal differently.

### AlphaDDA1

$$
N_{sim}(\bar{v}_n)=\left\lceil 10^{-A_{sim}(\bar{v}_n c_{AlphaDDA}+B_{sim0})}\right\rceil
$$

This reduces search — and therefore strength — the more it is winning.

### AlphaDDA2

$$
P_{drop}(\bar{v}_n)=A_{drop}(\bar{v}_n+P_{drop0})
$$

Raising dropout deliberately lowers the reliability of the network output.

### AlphaDDA3

$$
U(s_t,a)=\frac{W(s_t,a)}{N(s_t)}+C\sqrt{\frac{2\ln(N(s_t)+1)}{n(s_t,a)+1}}
$$

$$
W(s_t,a) \leftarrow W(s_t,a)-\left|v(s_t)+\bar{v}_n c(s_t,a)c_{AlphaDDA}\right|
$$

My takeaway from this structure is simple.

- AlphaDDA1 and 2 have clear strength knobs
- AlphaDDA3 distorts the value so aggressively that it can end up simply weak

## Experiments / Results
The paper runs AI-vs-AI evaluation on Connect4, 6x6 Othello, and Othello.

- The metrics were Elo, win rate, loss rate, and draw rate
- AlphaDDA1 and AlphaDDA2 could adjust strength against most non-random AIs
- AlphaDDA3 could match Random but was generally too weak against other opponents
- There was no human user study

The most important thing to me when reading these results:

> The paper demonstrates that the knobs for weakening a strong AI actually work, rather than that "the AI is matched to a human level."

## Limitations
The paper is clean, but its limits are clear.

- There is no explicit player model
  - it never learns opponent history or preference
- There is no human PX evaluation
  - win-loss-draw does not stand in for human experience
- The lower bound is limited
  - in some cases it cannot even come down to the Random level
- It depends heavily on board-state value
  - which makes it hard to port directly to hidden-information or stochastic games

## Connection to my DDA / bi-level research
The hints for my research are clear.

- A value head can serve as a difficulty proxy
- Knobs like search budget, dropout, and policy temperature are practical
- A strong policy can be adjusted without retraining

But my research cannot stop here.

- The lower level needs a player model
- The upper level needs target difficulty and subjective experience
- Fairness and progression constraints have to be present

So AlphaDDA is a good baseline for my research, not its end goal.

## References
- [AlphaDDA: Strategies for Adjusting the Playing Strength of a Fully Trained AlphaZero System to a Suitable Human Training Partner](https://arxiv.org/pdf/2111.06266)
