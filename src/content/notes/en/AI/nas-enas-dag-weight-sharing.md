---
title: "How did ENAS share weights across many networks in a single DAG?"
lang: "en"
translationKey: "nas-enas-dag-weight-sharing"
date: "2026-07-30"
field: "ai"
category: "Neural Architecture Search"
series: "NAS Foundations"
order: 2
status: "reading"
summary: "Separating ENAS's supernet DAG, the subgraph the controller selects, the shared parameters, and the alternating update — and examining why cheaper evaluation does not guarantee a fair ranking."
problem: "Training every candidate architecture from scratch makes NAS prohibitively expensive. Can different candidates reuse the training of the same operation?"
coreIdea: "ENAS views every candidate as a subgraph of one over-parameterized DAG, and trains only the weights of the selected edges when the controller samples a path."
connection: "Weight sharing cut NAS's compute dramatically, but it created a new evaluation problem: search-time proxy scores have to be separated from standalone retraining performance."
tags: ["nas", "enas", "weight-sharing", "supernet", "dag", "ranking"]
---

# How did ENAS share weights across many networks in a single DAG?

## Background
This post is based on my Notion write-up, [ENAS review](https://app.notion.com/p/331fb10f650180dfb36fe480228ae9e4). The paper selection and the core interpretation come from my own notes; I used GPT to restructure and rephrase them for the blog, then reviewed the result myself against my notes and the original paper. The discussion of ranking bias and the meaning of the follow-up methods was revised against the source paper and the evaluation literature.

## Problem: every candidate restarts training
The dominant cost in early NAS was not the controller update but the process of obtaining a reward. Each sampled architecture $a$ required training child weights $w_a$ and measuring validation accuracy.

$$
R(a)=\mathrm{Accuracy}_{val}\left(w_a^*,a\right),
\qquad
w_a^*=\arg\min_{w_a}\mathcal{L}_{train}(w_a,a)
$$

ENAS's question is simple: if candidates share convolutions or hidden-state transformations, can those parameters be reused too?

## Supernet DAG and subgraphs
ENAS places all possible architectures inside one large DAG.

$$
\mathcal{G}_{super}=(V,E,\mathcal{O})
$$

When the controller picks predecessors and operations, one subgraph $a\subset\mathcal{G}_{super}$ is activated. Rather than keeping a separate $w_a$ per architecture, it uses the selected portion of the supernet's shared weights $w$.

$$
f_a(x;w)=f(x;w\odot m_a)
$$

$m_a$ can be thought of as a mask turning on only the edges and operations that architecture $a$ selected. When different subgraphs choose the same edge operation, they continue from the same parameters.

## Two kinds of parameters, trained alternately
ENAS has two parameter sets.

- the shared child weights $w$
- the controller parameters $\theta$ that sample architectures

The shared-weight step reduces the training loss of the architecture the controller sampled.

$$
\min_w
\mathbb{E}_{a\sim\pi_\theta}
\left[\mathcal{L}_{train}(w,a)\right]
$$

The controller step raises the validation reward measured under the current shared weights.

$$
\max_\theta
\mathbb{E}_{a\sim\pi_\theta}
\left[R_{val}(w,a)\right]
$$

In practice neither optimum is solved exactly; the two are updated alternately at mini-batch granularity. ENAS should therefore not be equated with DARTS's explicit differentiable bi-level objective. ENAS alternates policy gradients with shared-weight training.

## What actually got cheaper
What ENAS reduced was not the number of candidates generated but the **cost of evaluating a candidate**.

- Weights are not trained from scratch per candidate
- One supernet training run accumulates across many architectures
- The controller reward arrives far faster

But that reward is not standalone performance; it is a proxy obtained with weights borrowed inside the supernet.

## The ranking problem weight sharing created
The ranking we actually want is:

$$
r_{standalone}(a)
=
\mathrm{Rank}
\left(
\mathrm{Accuracy}_{val}(w_a^*,a)
\right)
$$

But the ranking observed during search is:

$$
r_{shared}(a)
=
\mathrm{Rank}
\left(
\mathrm{Accuracy}_{val}(w,a)
\right)
$$

Nothing guarantees the two agree. There are several causes.

- Frequently sampled paths get trained more
- Gradients from different candidates collide on the same weights
- Large and small subgraphs use identical parameters differently
- The controller and supernet adapt together, producing co-adaptation

ENAS is therefore closer to "candidates were compared with a proxy obtained from one training run" than to "every candidate was completed cheaply."

## What the follow-up work fixed
| Method | Key change | Problem addressed |
|---|---|---|
| SPOS | activate only a single path per step | reduce path coupling |
| FairNAS | equalize training counts across operations | sampling unfairness |
| OFA | progressive shrinking from a large network to small subnets | simultaneous quality across subnet sizes |
| NAS-Bench-201 | provide standalone training results for the same candidates | diagnose ranking and reproducibility |

None of these guarantee ranking automatically either. Fair sampling is closer to a necessary condition, and standalone retraining of the final candidate remains a separate verification step.

## Limitations and next ideas
Experiments that use weight sharing should report at least three scores separately.

1. The search-time score inside the supernet
2. The score from standalone retraining under an identical recipe
3. Latency and memory measured on the actual device

It also matters to report Kendall or Spearman correlation of candidate rankings, and to keep a random-search baseline at the same budget. The central task of weight-sharing NAS is to tighten the evaluation contract in proportion to the speed gained.

## References
- [Efficient Neural Architecture Search via Parameter Sharing](https://arxiv.org/abs/1802.03268)
- [Evaluating the Search Phase of Neural Architecture Search](https://arxiv.org/abs/1902.08142)
- [Single Path One-Shot Neural Architecture Search](https://arxiv.org/abs/1904.00420)
- [FairNAS: Rethinking Evaluation Fairness of Weight Sharing Neural Architecture Search](https://arxiv.org/abs/1907.01845)
- [NAS-Bench-201](https://arxiv.org/abs/2001.00326)
