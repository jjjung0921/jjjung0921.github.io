---
title: "The math of DARTS: from mixed operations to bi-level gradients"
lang: "en"
translationKey: "nas-darts-bilevel-relaxation"
date: "2026-07-30"
field: "ai"
category: "Neural Architecture Search"
series: "NAS Foundations"
order: 4
status: "reading"
summary: "Deriving DARTS's cell DAG, softmax mixed operation, train/validation bi-level objective, and the exact hypergradient separately from its one-step and first-order approximations."
problem: "The discrete choice of one operation per edge severs the gradient with respect to the architecture. How can the choice be made continuous while still ending up with a single graph?"
coreIdea: "DARTS activates every candidate operation simultaneously as a softmax-weighted sum, training network weights on the training loss and architecture parameters on the validation loss."
connection: "By stating architecture search as a train/validation bi-level problem like hyperparameter optimization, DARTS created a reference point for reading NAS as a mathematical decomposition."
tags: ["nas", "darts", "bi-level-optimization", "continuous-relaxation", "hypergradient"]
---

# The math of DARTS: from mixed operations to bi-level gradients

## Background
This post is based on my Notion write-up, [DARTS review](https://app.notion.com/p/336fb10f650180f3b126ddf4e00143a3). It starts from the derivations I wrote out while trying to understand the mathematics; I used GPT to restructure the notation and the order of explanation for the blog, then reviewed the result myself against my notes and the original paper. The distinction between the exact hypergradient and the approximation the paper actually uses was drawn after another pass over the DARTS paper.

## 1. Writing a cell as a DAG
A DARTS cell consists of nodes $x^{(i)}$ and directed edges $(i,j)$. Each edge carries a set of candidate operations $\mathcal{O}$.

$$
x^{(j)}
=
\sum_{i<j}
o^{(i,j)}
\left(x^{(i)}\right)
$$

The problem is that choosing one $o^{(i,j)}\in\mathcal{O}$ is a discrete decision.

## 2. Turning operation selection into a softmax mixture
Place an architecture logit $\alpha_o^{(i,j)}$ on each edge and operation.

$$
\bar{o}^{(i,j)}(x)
=
\sum_{o\in\mathcal{O}}
\frac{
\exp\left(\alpha_o^{(i,j)}\right)
}{
\sum_{o'\in\mathcal{O}}
\exp\left(\alpha_{o'}^{(i,j)}\right)
}
o(x)
$$

Now every operation participates in the weighted sum, so the expression is differentiable in $\alpha$. The network during search is not one discrete architecture but a supernet mixing all candidates.

## 3. Why bi-level
DARTS has two kinds of variables.

- $w$: network weights such as convolution kernels
- $\alpha$: architecture parameters indicating which operation each edge selects

Fitting $w$ and $\alpha$ to the same data lets the architecture overfit the training loss. DARTS trains $w$ on the training loss and $\alpha$ on the validation loss.

$$
\begin{aligned}
\min_\alpha\quad&
\mathcal{L}_{val}\left(w^*(\alpha),\alpha\right) \\
\text{s.t.}\quad&
w^*(\alpha)
=
\arg\min_w
\mathcal{L}_{train}(w,\alpha)
\end{aligned}
$$

Since the $w^*(\alpha)$ obtained at the lower level enters the upper-level validation loss, this is bi-level optimization.

## 4. Exact hypergradient
Writing the upper objective as

$$
F(\alpha)
=
\mathcal{L}_{val}
\left(w^*(\alpha),\alpha\right)
$$

the chain rule gives:

$$
\frac{dF}{d\alpha}
=
\frac{\partial\mathcal{L}_{val}}{\partial\alpha}
+
\frac{\partial\mathcal{L}_{val}}{\partial w}
\frac{dw^*}{d\alpha}
$$

Assuming at the lower optimum that

$$
\nabla_w\mathcal{L}_{train}(w^*,\alpha)=0
$$

and applying implicit differentiation gives

$$
\frac{dw^*}{d\alpha}
=
-
\left[
\nabla_{ww}^2\mathcal{L}_{train}
\right]^{-1}
\nabla_{w\alpha}^2\mathcal{L}_{train}
$$

This exact hypergradient requires a Hessian inverse and a fully optimized $w^*$, so it is expensive to compute in its original form.

## 5. DARTS's one-step approximation
Instead of the full lower-level optimization, DARTS unrolls a single gradient step.

$$
w'
=
w
-
\xi
\nabla_w
\mathcal{L}_{train}(w,\alpha)
$$

and then uses the following architecture gradient.

$$
\nabla_\alpha
\mathcal{L}_{val}(w',\alpha)
$$

Expanding by the chain rule yields

$$
\nabla_\alpha\mathcal{L}_{val}(w',\alpha)
-
\xi
\nabla_{\alpha w}^{2}
\mathcal{L}_{train}(w,\alpha)
\nabla_{w'}
\mathcal{L}_{val}(w',\alpha)
$$

The Hessian-vector product in the second term is approximated by finite differences.

$$
\nabla_{\alpha w}^{2}
\mathcal{L}_{train}\,v
\approx
\frac{
\nabla_\alpha\mathcal{L}_{train}(w+\epsilon v,\alpha)
-
\nabla_\alpha\mathcal{L}_{train}(w-\epsilon v,\alpha)
}{
2\epsilon
}
$$

This is the approximation usually called `second-order DARTS`. It does not mean the exact implicit gradient is being computed.

## 6. First-order DARTS
The cheaper variant ignores the path through which $w$ depends on $\alpha$.

$$
\nabla_\alpha
\mathcal{L}_{val}(w,\alpha)
$$

It looks only at the direct effect of $\alpha$ through the mixed operation, discarding how the lower-level update shifts with the architecture. It is faster but the gradient bias can be larger.

## 7. Returning to a discrete architecture
When search finishes, each edge keeps the non-zero operation with the largest $\alpha$, and only the top incoming edges of each node are retained.

$$
o^{(i,j)}_{\mathrm{final}}
=
\arg\max_{o\in\mathcal{O}\setminus\{\mathrm{zero}\}}
\alpha_o^{(i,j)}
$$

During search it was a mixture of operations; at evaluation it is a single discrete graph. That difference is the discretization gap.

## Limitations
- A mixed operation does not faithfully represent standalone operation performance
- Shared weights create co-adaptation between operations
- Operations that are easy to optimize, such as skip connections, can dominate early
- The one-step and first-order approximations can distort the true hypergradient
- Even with a good validation loss, the argmax-extracted graph may rank differently under standalone retraining

## A simple mitigation
Rather than looking only at the magnitude of $\alpha$ during search, one can also measure the perturbation that removing an operation causes in the validation loss. Hessian-sharpness-based early stopping, separating operation from topology, partial channels, and stochastic categorical relaxation each reduce a different bottleneck.

The most important verification is not the search supernet's performance but retraining the selected graph from scratch under an identical recipe and comparing against random search.

## References
- [DARTS: Differentiable Architecture Search](https://arxiv.org/abs/1806.09055)
- [Understanding and Robustifying Differentiable Architecture Search](https://arxiv.org/abs/1909.09656)
- [PC-DARTS](https://arxiv.org/abs/1907.05737)
- [NoisyDARTS: Differentiable Architecture Search Without None Operation](https://arxiv.org/abs/2005.03566)
