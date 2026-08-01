---
title: "In what continuous space did NAO move discrete architectures?"
lang: "en"
translationKey: "nas-nao-continuous-embedding"
date: "2026-07-30"
field: "ai"
category: "Neural Architecture Search"
series: "NAS Foundations"
order: 3
status: "reading"
summary: "Following NAO's encoder-predictor-decoder structure to analyze how a discrete architecture is moved into a latent embedding, improved along the predictor's gradient, and restored to a discrete structure."
problem: "An architecture is a discrete combination of operations and connections, so gradients cannot be computed on it directly. Can the whole structure be turned into a continuous vector and moved?"
coreIdea: "NAO encodes an architecture as a latent vector, moves along the gradient of a performance predictor, and restores a new architecture with a decoder."
connection: "NAO and DARTS both use continuous optimization, but NAO moves a learned embedding of the whole architecture while DARTS learns mixture weights for each edge operation."
tags: ["nas", "nao", "continuous-optimization", "architecture-embedding", "surrogate-model"]
---

# In what continuous space did NAO move discrete architectures?

## Background
This post is based on my Notion write-up, [NAO review](https://app.notion.com/p/333fb10f6501803aaa88e2e4fd89fecb). The paper selection and the core interpretation come from my own notes; I used GPT to restructure and rephrase them for the blog, then reviewed the result myself against my notes and the original paper. The objective functions and the meaning of the gradient step were revised after another pass over the NeurIPS paper.

## Problem: a discrete structure has no coordinates to differentiate
Suppose an architecture $a$ is a sequence of operation tokens and connection tokens. Changing part of $a$ produces an entirely different graph, so $\nabla_a f(a)$ in the usual sense is hard to define.

Earlier performance predictors were mostly used to predict the performance of already-generated candidates and filter for good ones. NAO instead uses the predictor as a **gradient field for producing new candidates**.

## Three modules
NAO passes an architecture through three stages.

$$
a
\xrightarrow{E_\phi}
e_a
\xrightarrow{f_\psi}
\hat{s}_a,
\qquad
e_a
\xrightarrow{D_\omega}
\hat{a}
$$

- encoder $E_\phi$: turns the discrete architecture $a$ into a continuous embedding $e_a$
- predictor $f_\psi$: predicts validation performance $\hat{s}_a$ from the embedding
- decoder $D_\omega$: restores the embedding back to an architecture token sequence

The encoder and decoder use the architecture-as-sequence view. The predictor approximates a smooth surface over the latent vectors.

## Training objectives
The predictor has to reduce the gap between true and predicted performance.

$$
\mathcal{L}_{pred}
=
\sum_{a\in\mathcal{A}}
\left(
f_\psi(E_\phi(a))-s_a
\right)^2
$$

The decoder has to reconstruct the original architecture.

$$
\mathcal{L}_{rec}
=
-
\sum_{a\in\mathcal{A}}
\log p_\omega
\left(
a\mid E_\phi(a)
\right)
$$

Training both together forces the latent space to be predictive of performance while still mapping back to valid architectures.

$$
\min_{\phi,\psi,\omega}
\mathcal{L}_{pred}
+
\lambda\mathcal{L}_{rec}
$$

## Where the gradient is applied
Writing the embedding of a trained architecture $a$ as $e_a$, NAO moves the latent vector in the direction where the predictor forecasts higher performance.

$$
e_a'
=
e_a
+
\eta
\nabla_e f_\psi(e)
\big|_{e=e_a}
$$

If error is predicted instead of performance, the sign flips. The key point is that architecture tokens are never differentiated directly; the **gradient step happens inside the continuous space the predictor learned**.

The decoder then maps the new embedding back to a discrete architecture.

$$
a'=\arg\max_a p_\omega(a\mid e_a')
$$

The evaluated $a'$ is added to the pool, and the encoder-predictor-decoder is retrained, repeating the cycle.

## How this differs from DARTS
| Aspect | NAO | DARTS |
|---|---|---|
| Continuous variable | embedding $e$ of the whole architecture | per-edge operation logits $\alpha$ |
| Source of the gradient | learned performance predictor | validation loss |
| Discrete recovery | decoder generates a token sequence | per-edge argmax |
| Main risk | predictor / decoder extrapolation | mixed-op and discretization gap |

Both convert discrete choices into continuous optimization, but they build the continuous space in different ways.

## Limitations
NAO's gradient is not the gradient of the true accuracy surface. It is the gradient of the surface the predictor approximated.

- If the initial architecture pool is narrow, the predictor fails to extrapolate
- A large latent step moves into regions the decoder has never seen
- The decoder may restore a valid but undesired architecture
- Nothing guarantees that structures near the same embedding actually perform similarly
- Candidate evaluations are still needed to train the predictor

## A simple mitigation
Putting a trust region on the latent step, and sending candidates with high ensemble-predictor uncertainty back to real evaluation, is the natural approach. Decoder validity constraints and round-trip consistency $a\rightarrow e\rightarrow\hat a$ should be measured too.

The point is not that a gradient was obtained, but recording **which surrogate and which data range that gradient is valid within**.

## References
- [Neural Architecture Optimization](https://proceedings.neurips.cc/paper/2018/hash/933670f1ac8ba969f32989c312faba75-Abstract.html)
- [Neural Architecture Optimization PDF](https://proceedings.neurips.cc/paper/2018/file/933670f1ac8ba969f32989c312faba75-Paper.pdf)
