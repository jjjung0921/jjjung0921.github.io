---
title: "How to solve black-box optimization with CMA-ES"
lang: "en"
translationKey: "cma-es-black-box-optimization"
date: "2026-07-30"
field: "ai"
category: "Optimization"
series: "Black-box Optimization"
order: 1
status: "reading"
summary: "How CMA-ES finds solutions by adapting the mean and covariance of a search distribution on objectives where gradients are unavailable or untrustworthy."
problem: "When the objective has no gradient, or can only be evaluated through something like a simulator, how can search proceed stably?"
coreIdea: "Rather than updating a good solution directly, CMA-ES learns the mean, covariance, and step-size of the sampling distribution that produced good solutions."
connection: "CMA-ES is the canonical black-box optimization reference point: it assumes nothing about differentiability and adapts the search distribution from the ranking of evaluations alone."
tags: ["optimization", "cma-es", "black-box optimization", "evolution strategy"]
---

# How to solve black-box optimization with CMA-ES

## Background
This post is based on my Notion write-up, [CMA-ES notes](https://app.notion.com/p/38bfb10f6501819b9a49db2d45825a42). The core interpretation and the order of learning come from my own notes; I used GPT to restructure and rephrase them for the blog, then reviewed the result myself against my notes and the original paper. The meaning of the equations and the comparison across methods were revised against the source paper and tutorial.

## Problem
In black-box optimization the objective often cannot be differentiated directly, or the gradient is too noisy to trust even when it exists. It is common for the function to be nonlinear, non-convex, non-separable, and evaluable only through a simulator. Gradient descent does not apply directly to such problems.

CMA-ES is a method built to survive that setting. Its core is not "moving a single point" but "changing the distribution that produces good points."

## Core idea / progression
### Optimize a distribution, not a point
Instead of picking a single current solution, CMA-ES maintains the probability distribution that generates solutions. It is usually thought of as

$$
\mathcal{N}(m, \sigma^2 C)
$$

where $m$ is the center, $\sigma$ the search scale, and $C$ the distribution's shape.

### Remember the direction of good samples
Each generation samples and evaluates several candidates, keeps only the top ones, and recomputes the mean. That mean shift means "move the center toward where good candidates appeared."

### Adapt covariance and step-size together
Covariance controls the orientation and elongation of the search cloud; step-size grows or shrinks the overall search range. Intuitively, covariance learns the shape of the landscape while step-size controls the search width.

### Judge by rank
Using rank rather than the raw values also matters, because it reduces sensitivity to the absolute scale of the function.

## Method / equations
### Sampling

$$
x_k = m + \sigma B D z_k, \qquad z_k \sim \mathcal{N}(0, I)
$$

equivalently

$$
x_k \sim \mathcal{N}(m, \sigma^2 C), \qquad C = B D^2 B^T
$$

where $B$ and $D$ hold the eigenvector and eigenvalue information of the covariance.

### Recombination

$$
m \leftarrow \sum_{i=1}^{\mu} w_i x_{i:\lambda}
$$

A weighted average of the top $\mu$ candidates forms the next center.

### Covariance adaptation

$$
C \leftarrow (1-c_{cov})C + c_{cov}p_c p_c^T
$$

This mechanism reshapes the search distribution from the accumulated direction of movement rather than from one good step.

### Step-size adaptation

$$
\sigma \leftarrow \sigma \cdot \exp\left(\frac{\|p_s\| - \chi_n}{\chi_n d}\right)
$$

Step-size shrinks when the spread grows too wide and expands again when it narrows too far.

### Flow summary
```text
initialize m, sigma, C
repeat:
  sample lambda candidates
  evaluate and rank them
  recombine the top mu candidates
  update covariance C
  update step-size sigma
return the best candidate seen so far
```

### Notation
| Symbol | Meaning |
|---|---|
| $m$ | center of the search distribution |
| $\sigma$ | global search scale |
| $C$ | shape and orientation of the search distribution |
| $\lambda$ | number of candidates drawn per generation |
| $\mu$ | number of top candidates used in recombination |
| $w_i$ | weight of a top candidate |
| $p_c$ | path used for covariance adaptation |
| $p_s$ | path used for step-size adaptation |

## Comparing the representative methods
| Method | Information required | Strength | Limitation |
|---|---|---|---|
| Random Search | function evaluations only | simplest to implement | search does not accumulate |
| Gradient Descent | gradients | fast and efficient | not directly usable on non-differentiable black boxes |
| CMA-ES | function evaluations only | searches while adapting a distribution | high evaluation count and computational cost |

## Limitations
CMA-ES needs no gradients, but it spends many function evaluations in exchange. In high dimensions the cost of a full covariance grows, and in noisy settings the ranking of good candidates can wobble. Being a stochastic search, it also offers no global-optimum guarantee in the usual sense.

## Ideas that follow from the limitations
On problems with expensive evaluations, rather than using vanilla CMA-ES as-is, one can filter promising candidates with a surrogate model first, or combine a multi-fidelity strategy that moves from low-budget to high-budget evaluations. In high dimensions, diagonal or low-rank covariance approximations help; on noisy objectives, evaluations sharing a common random seed or repeated measurements reduce the wobble in ranking.

The point of these ideas is not to treat CMA-ES as the answer to every problem. It is more realistic to scale back the scope of distribution adaptation to match the actual bottleneck — evaluation cost, dimension, or noise.

## References
- [Hansen & Ostermeier, 2001](https://doi.org/10.1023/A:1011157308460)
- [Hansen, 2016, The CMA Evolution Strategy: A Tutorial](https://arxiv.org/abs/1604.00772)
- [CMA-ES official site](https://cma-es.github.io/)
