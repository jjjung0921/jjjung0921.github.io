---
title: "[Stage 2] When the model decides, people change: Performative Prediction"
lang: "en"
translationKey: "roadmap-performative-prediction"
date: "2026-09-24"
field: "ai"
category: "Research Roadmap"
series: "Research Roadmap"
order: 3
status: "draft"
summary: "When a model that adapts to an individual makes decisions, those decisions change that person's data. Performative Prediction writes the broken fixed-distribution assumption as a distribution map D(θ), and it asks of people not rationality but only ε-sensitivity."
problem: "MAML treats an individual's data distribution as fixed, but once the model makes decisions such as difficulty or recommendations, those decisions change the very data it was trying to learn."
coreIdea: "Interaction has two directions. Adaptation, where the model fits itself to the person (meta-learning), and response, where the person's data moves with the model's decisions (PP). PP writes the response as θ ↦ D(θ) and assumes only that a small change in the decision produces only a small change in the response distribution."
connection: "In DDA, a difficulty policy changing the distribution of play logs is the archetypal performative situation. Writing two tools, each covering one direction, as a single problem is deferred to Stage 3 (bi-level)."
tags: ["research-roadmap", "performative-prediction", "distribution-shift", "personalization", "dda"]
---

# When the model decides, people change

The goal I set in the [tutorial](/en/notes/roadmap-tutorial-personal-agentic-model/) was this. **Build an agentic model that adapts to a single user.** This stage takes on decisions and the responses those decisions change.

> What breaks when a model that adapts to an individual is placed inside an interaction?

## 0. What Stage 1 left behind: only the model was moving

In the MAML of [Stage 1](/en/notes/roadmap-personal-model-and-maml/), the individual's data was fixed. The model adapts, and the person stays the same.

But our model makes decisions. In a game, it picks the difficulty of the next stage. The same player can respond differently when the difficulty changes. For example, facing a hard opponent, they may think longer or choose different moves. The responses the model observes from one person depend on the decisions the model itself made.

## 1. The fixed-distribution assumption: what becomes invalid when decisions change the data

Supervised learning assumes the data $Z$ follows a fixed distribution $\mathcal{D}$. The moment the model's decisions change people, this assumption is invalid. The distribution becomes a function of the model parameters. The framework that handles this situation is **Performative Prediction** (PP). I traced how the assumption collapses in [Performative Prediction: predicting change itself](/en/notes/performative-prediction/). Here I only bring over the definitions.

> [!info] distribution map
> The function $\theta\mapsto\mathcal{D}(\theta)$ that returns the distribution of the data observed when model $\theta$ is deployed.

Once the distribution moves, the meaning of a "good model" splits in two.

$$
\theta_{\text{PS}}\in\operatorname*{arg\,min}_\theta\ \mathbb{E}_{Z\sim\mathcal{D}(\theta_{\text{PS}})}\,\ell(Z;\theta),
\qquad
\theta_{\text{PO}}\in\operatorname*{arg\,min}_\theta\ \mathbb{E}_{Z\sim\mathcal{D}(\theta)}\,\ell(Z;\theta)
\qquad (1)
$$

**Performative stability** (PS) is a fixed point. Retraining on the distribution it created yields the same model again. **Performative optimality** (PO) is the point with the smallest loss among model–environment pairs. The two generally differ.

## 2. The two directions of interaction: who is moving?

Let me put this side by side with Stage 1.

```text
          adaptation · meta-learning (Stage 1)
  model θ ─────────────────────────▶ person
         ◀────────────────────────── Z ~ D(θ)
          response · PP (Stage 2)
```

| Direction | What moves | What it does not handle | Tool |
|---|---|---|---|
| Model → person | The model fits itself to the person | The effect of decisions changing the person | meta-learning |
| Person → model | The person's data moves with the decisions | Fast per-individual adaptation | PP |

So what does PP assume about people? Not rationality, but a single condition: **$\varepsilon$-sensitivity**.

$$
W_1\big(\mathcal{D}(\theta),\mathcal{D}(\theta')\big)\le\varepsilon\,\lVert\theta-\theta'\rVert_2
\qquad (2)
$$

It means that changing the decision a little changes the response distribution only a little. How a person responds, optimal or not, is entirely contained in $\mathcal{D}(\theta)$. The condition $\varepsilon<\gamma/\beta$ under which retraining converges to $\theta_{\text{PS}}$ also rests on this $\varepsilon$ ($\gamma$-strongly convex, $\beta$-smooth loss). It is enough that the distribution runs away more slowly than optimization pulls back.

> [!warning] The rationality assumption is not an assumption of PP as a whole
> The assumption that users change their features to maximize utility relative to cost (best response) exists only in the distribution map of strategic classification.

Carried over to DDA, $\theta$ is the difficulty policy, and $\mathcal{D}(\theta)$ is the distribution of logs a single player leaves under that difficulty. Changing the difficulty changes the same player's response distribution. This is the archetypal performative situation. The effect of skill improving over time sits at a different level. A framework called stateful PP captures such effects. Brown et al. (2022) introduce a transition map $d_t=\mathrm{Tr}(d_{t-1};\theta_t)$ so that the next distribution depends not only on the current decision but also on the previous distribution.

> [!interpretation] My interpretation
> In [Stage 1](/en/notes/roadmap-personal-model-and-maml/) I treated one person as a fixed data distribution $\mathcal{D}_i$. But if the same player responds differently depending on the difficulty, a single distribution cannot hold that person. That person is a function $\theta\mapsto\mathcal{D}_i(\theta)$ that takes a decision and returns a distribution. A personalized model has to learn how that person responds to decisions, more than the data that person left behind. Seen this way, "individual = task" becomes "individual = distribution map". Which people to group into one distribution (Stage 5 (forthcoming)) is also a question of which distribution maps to group.

I came to PP because of DDA. In a game, difficulty is the model's output, and the user's input and response change with that output. I went looking for a field that already handles this problem and found PP.

## 3. Summary: what was answered and what remains

Let me briefly sum up what we have covered.

> If the model's decisions change people's data, the fixed-distribution assumption is invalid. PP writes that coupling as a distribution map $\mathcal{D}(\theta)$ and asks of people only $\varepsilon$-sensitivity.

### Open problem 1: the two tools each cover one direction separately

MAML fixes the person and moves the model. PP handles the person moving but has no fast per-individual adaptation. In an agentic model, both directions sit inside one loop. Can the two be written as a single problem?

### Open problem 2: where we arrive and where we want to be

Retraining takes us to $\theta_{\text{PS}}$; where we want to be is $\theta_{\text{PO}}$. The distance between them continues in the Performative Prediction series. Even in the stateful setting, this distance has an upper bound. If the optimum is defined by the long-term loss measured on the fixed-point distribution, then $\lVert\theta_{\text{OPT}}-\theta_{\text{S}}\rVert_2\le 2L_z\varepsilon/\big(\gamma(1-\varepsilon)\big)$ (Brown et al. 2022, Theorem 6). In the partially performative setting (Lee & Zrnic 2026), exogenous drift mixes into the shift the model creates. In this setting, instead of a fixed point, we look at how well we track stable and optimal points that move over time (regret).

In the next stage I take open problem 1 and rewrite MAML and PP in the same language.

## Connections

- Related project: [General-purpose staged-DDA](/en/projects/dda-blackjack/)
- Question to check next: can adaptation and response be written as a single problem? → [Stage 3 — The two problems have the same shape](/en/notes/roadmap-bilevel-common-form/)
