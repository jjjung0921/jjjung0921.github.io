---
title: "Why is combat difficulty more flexible when recast as enemy composition generation?"
lang: "en"
translationKey: "dda-ntrl-encounter-generation"
date: "2026-07-30"
field: "ai"
category: "Dynamic Difficulty Adjustment"
series: "DDA Paper Review"
order: 4
status: "reading"
summary: "NTRL rewrites D&D difficulty as an encounter composition generation problem rather than a matter of tuning the XP budget. It uses a contextual bandit and REINFORCE to build enemy groups suited to the party's state, trains on offline simulation, and generates instantly online."
problem: "The DMG's static XP heuristic does not adequately reflect party composition, enemy synergy, or current resource state, and automated playtesting is too slow for a live campaign."
coreIdea: "Take the party matrix and synergy vector as context, and learn a policy that sequentially samples enemy classes or STOPs, thereby generating combat difficulty."
connection: "In my bi-level DDA, this paper's encounter generation can be reread as opponent policy generation or state-conditioned content generation for a card game."
tags: ["contextual-bandit", "reinforcement-learning", "dungeons-and-dragons", "encounter-generation", "simulation"]
---

# Why is combat difficulty more flexible when recast as enemy composition generation?

## Background
This post is based on my Notion write-up, [NTRL review](https://app.notion.com/p/374fb10f65018073b85bd133c3862b18). The paper selection and the core interpretation come from my own notes; I used GPT to restructure and rephrase them for the blog, then reviewed the result myself against my notes and the original paper. Where the numbers were ambiguous I avoided overstating them and instead re-summarized them alongside the paper's experimental scope.

## Problem
Encounter balancing in D&D is not solved by simply going "stronger" or "weaker."
Party composition, current HP, monster synergy, combat duration, and TPK risk are all tangled together.

The paper redefines this as an enemy composition generation problem instead of the DM's manual XP budget tuning.

## Core idea
### What the paper says
NTRL's core is as follows.

- Encode party state as a feature matrix $P$
- Maintain information about already-chosen enemies as a synergy vector $S$
- Have a policy network sample the next enemy class or a STOP action
- Evaluate the generated encounter in a simulator and update the reward

Difficulty adjustment, then, is not "hitting one number once" but "generating the combat scene itself."

### My reading
The paper matters because it connects DDA to content generation.
To me that perspective fits card games well too.

- You can adjust the opponent policy
- You can generate the card / hand / sequence
- You can introduce resource perturbations

It gives you the framing to see DDA as a generation problem rather than plain control.

## Method
The paper mixes a contextual bandit with policy gradients to generate encounters.

The basic equations:

$$
G_t = \sum_{k=0}^{\infty}\gamma^k R_{t+k}
$$

$$
J(\theta) = \mathbb{E}_{\pi_\theta}\left[\sum_{t=0}^{T}R_t\right]
$$

$$
\nabla_\theta J(\theta)=\mathbb{E}_{\pi_\theta}\left[\sum_{t=0}^{T}\nabla_\theta \log \pi_\theta(a_t|s_t)G_t\right]
$$

$$
R(p,e)=\alpha \cdot wp + \beta \cdot fl + \gamma \cdot mhp + \delta \cdot dmg + \lambda \cdot dth
$$

Two things stood out to me while reading this structure.

1. Training is pushed entirely into offline simulation
2. Inference takes only the party status and produces an encounter immediately

That shape is what makes it usable in a live campaign.

## Experiments / Results
The paper uses both simulator evaluation and a comparison against human DMs.

- It produces longer fights than the DMG's static heuristic
- It learns to raise party damage taken while keeping win rate high
- It tries to keep TPK low
- It also includes an experiment comparing against human DMs

When writing these results down, though, it is safer to keep the trend and drop the numbers.
Even in my original Notion write-up the win probability figures appear differently in different contexts, so here I keep only the qualitative conclusion that it "stays high."

## Limitations
The paper is useful, but it has clear limitations that block direct reuse.

- The reward is a hand-crafted proxy
  - it never directly measures actual fun or immersion
- There is a simulator-reality gap
  - heuristic combat AI and human players behave differently
- There is no player preference model
  - it looks at the current party state but not at what kind of combat the player prefers
- The experimental scope is narrow
  - evaluation centers on a level 5 party and a limited class pool

## Connection to my DDA / bi-level research
The paper gives my research three hints.

1. DDA can be seen as state-conditioned content generation
2. Expensive simulation can be pushed offline, leaving only the policy online
3. A reward can be composed as a sum of several proxies

But that alone is not enough for my work.

- The lower level needs a player model
- The upper level needs target difficulty and subjective experience
- Fairness and progression constraints have to be made explicit

So NTRL is a good starting point for my research, but not its final form.

## References
- [NTRL: Encounter Generation via Reinforcement Learning for Dynamic Difficulty Adjustment in Dungeons and Dragons](https://arxiv.org/pdf/2506.19530)
