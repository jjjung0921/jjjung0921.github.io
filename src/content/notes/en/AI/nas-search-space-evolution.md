---
title: "Why did NAS start searching for a cell DAG instead of a whole network?"
lang: "en"
translationKey: "nas-search-space-evolution"
date: "2026-07-30"
field: "ai"
category: "Neural Architecture Search"
series: "NAS Foundations"
order: 1
status: "reading"
summary: "Following the shift in search unit from NAS-RL's variable-length sequence to the cell DAG of NASNet and PNAS, reading the representation of the search space separately from the search algorithm."
problem: "Generating a whole network's layers and skip connections in sequence makes the search space and the evaluation cost explode together. What should be bundled into a single reusable search unit?"
coreIdea: "NASNet represented a small cell as a DAG and built the whole network by repeating it. This shrank the search space and made transfer easy, but a DAG representation does not automatically provide weight sharing."
connection: "Understanding NAS starts with separating search space, search strategy, and performance estimation. This post covers how the first of these moved from whole networks to reusable cells."
tags: ["nas", "search-space", "dag", "nasnet", "pnas", "cell"]
---

# Why did NAS start searching for a cell DAG instead of a whole network?

## Background
This post is based on my Notion reviews of [NAS-RL](https://app.notion.com/p/218fb10f6501801ea652ccda5dd9e3c8), [NASNet](https://app.notion.com/p/218fb10f65018090a1e1d59a6f15c976), and [PNAS](https://app.notion.com/p/312fb10f6501807d9505c4f5ec34485f). The paper selection and the core interpretation come from my own notes; I used GPT to restructure and rephrase them for the blog, then reviewed the result myself against my notes and the original papers. The chronology and the boundaries of each claim were revised after another pass over the source papers.

## Three things to separate first
NAS is usually split into three parts.

1. `search space`: which structures are admitted as candidates
2. `search strategy`: by what rule candidates are chosen
3. `performance estimation`: how cheaply and fairly a candidate's performance is measured

Explaining early NAS's compute problem purely as "the search algorithm was slow" hides the first change. In practice, what changed first and most was **the unit used to represent a network**.

## 1. NAS-RL: generating architectures as a sequence
NAS-RL had an RNN controller generate each layer's filter, stride, channel, and skip connection as an action sequence. The whole network is treated as a variable-length decision $a_{1:T}$, and the trained child network's validation accuracy serves as the reward.

$$
J(\theta)=
\mathbb{E}_{a_{1:T}\sim\pi_\theta}
\left[R(a_{1:T})\right]
$$

The policy gradient can be estimated in the following form.

$$
\nabla_\theta J(\theta)
\approx
\frac{1}{m}
\sum_{k=1}^{m}
\sum_{t=1}^{T}
\nabla_\theta \log \pi_\theta(a_t^{(k)}\mid a_{<t}^{(k)})
\left(R_k-b\right)
$$

This handles variable-length architectures, but every candidate requires training a child network. As depth and skip connections grow, the action sequence and the number of candidates grow with them.

## 2. NASNet: searching for a repeatable cell instead of the whole network
NASNet shrank the search unit from `whole network` to `cell`. A cell is represented as a DAG whose nodes are feature maps and whose edges are operations and connections.

$$
G=(V,E), \qquad
x^{(j)}=\sum_{i<j}o^{(i,j)}\left(x^{(i)}\right)
$$

- $x^{(i)}$: the feature map of the $i$-th node
- $o^{(i,j)}$: an operation such as convolution, pooling, or identity from node $i$ to $j$
- $i<j$: a topological order that avoids cycles

The search usually focuses on two cells.

- `normal cell`: preserves feature resolution
- `reduction cell`: reduces spatial resolution

Repeating the discovered cell yields deeper networks, and a cell found on CIFAR became easy to move to ImageNet scale. The problem shifted from finding one good whole network to finding a **reusable micro-structure**.

## 3. PNAS: not even the cell is found all at once
PNAS starts from a small cell and adds blocks one at a time. Rather than training every candidate to completion, it trains a predictor on already-evaluated cells and keeps only the promising candidates for the next stage.

$$
\hat{f}(a)=\text{Predictor}(a)
$$

Here $\hat{f}(a)$ is a surrogate standing in for architecture $a$'s true performance $f(a)$. It shrinks the search space, but if the predictor's ranking is wrong, good candidates get discarded early.

## A DAG is not the same thing as weight sharing
This is the most important distinction here.

> Representing a cell as a DAG does not automatically share weights.

NASNet also represented cells as DAGs, yet trained each candidate network separately. The mechanism that actually enabled weight sharing came later, with things like ENAS: a **supernet that contains many candidates as subgraphs of one over-parameterized DAG and reuses the parameters of the same edge operation**.

In summary:

| Change | What it gained | What remained unsolved |
|---|---|---|
| whole network → sequence | variable structure generation | per-candidate training cost |
| sequence → cell DAG | a repeatable, transferable search unit | per-candidate training cost |
| cell predictor | progressive pruning | predictor ranking error |
| supernet DAG | weight sharing across candidates | interference and ranking bias |

## Limitations and next ideas
Cell search shrinks the search space at the cost of having a human fix the macro architecture, and there is no guarantee that repeating an identical cell is best for every task. A next step could search micro cells and network-level topology jointly, combined with hierarchical search or multi-fidelity evaluation so the candidate count does not explode again.

Above all, the bias of the search space should not be mistaken for the performance of the algorithm. The same search strategy produces entirely different results depending on which DAGs and operation sets were allowed.

## References
- [Neural Architecture Search with Reinforcement Learning](https://arxiv.org/abs/1611.01578)
- [Learning Transferable Architectures for Scalable Image Recognition](https://arxiv.org/abs/1707.07012)
- [Progressive Neural Architecture Search](https://arxiv.org/abs/1712.00559)
