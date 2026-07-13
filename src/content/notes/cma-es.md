---
title: "How does CMA-ES update a search distribution for black-box optimization?"
lang: "en"
translationKey: "cma-es"
date: "2026-02-15"
field: "ai"
category: "Optimization"
series: "Black-box Optimization"
status: "reading"
summary: "A compact note on how CMA-ES adapts a multivariate normal search distribution without gradients."
problem: "Some objectives are non-convex, non-differentiable, or only observable through simulation."
coreIdea: "CMA-ES adapts the mean and covariance of a multivariate normal distribution."
connection: "This is useful for upper-level optimization when lower-level responses come from simulation or adaptive agents."
tags: ["CMA-ES", "Black-box Optimization", "DDA"]
---

# How does CMA-ES update a search distribution for black-box optimization?

## Problem

Some objectives are non-convex, non-differentiable, or only observable through simulation. In that setting, gradients may not be available.

## Core idea

CMA-ES searches by adapting the mean and covariance of a multivariate normal distribution.

$$
m_{g+1} = \sum_{i=1}^{\mu} w_i x_{i:\lambda}
$$

## Mechanism

```ts
const population = sampleNormal(mean, covariance, lambda);
const ranked = evaluate(population).sort(byFitness);
mean = weightedMean(ranked.slice(0, mu));
covariance = updateCovariance(ranked);
```

| Step | Purpose |
|---|---|
| Sample | Explore candidate solutions |
| Evaluate | Measure objective value without gradients |
| Reweight | Move toward successful samples |
| Covariance update | Learn useful search directions |

## Research connection

CMA-ES is useful for upper-level optimization when the lower-level response comes from a simulator, a player model, or an adaptive agent.
