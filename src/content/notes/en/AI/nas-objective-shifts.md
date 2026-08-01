---
title: "NAS after accuracy: what became the new objective?"
lang: "en"
translationKey: "nas-objective-shifts"
date: "2026-07-30"
field: "ai"
category: "Neural Architecture Search"
series: "NAS Foundations"
order: 5
status: "reading"
summary: "Tracing how NAS, once a search for a single classification accuracy, expanded its objectives to latency, dense prediction topology, multiple deployment constraints, pretraining efficiency, training-free proxies, and training recipes."
problem: "An architecture with high validation accuracy is unusable if it is slow on the actual device, ill-suited to another task, or if the search itself is prohibitively expensive."
coreIdea: "Later NAS work changed not just the search algorithm but the definition of what makes an architecture good, producing new problems: device-aware, task-aware, once-for-all, pretraining-aware, training-free, and joint search."
connection: "NAS was the field that first made bi-level optimization vivid to me, and its way of decomposing the problem became the occasion for grafting a bi-level structure onto Staged DDA."
tags: ["nas", "automl", "multi-objective", "hardware-aware", "dense-prediction", "pretraining"]
---

# NAS after accuracy: what became the new objective?

## Background
This post is based on my Notion reviews of [MnasNet](https://app.notion.com/p/340fb10f650181848f00ecc267ad87a4), [ProxylessNAS](https://app.notion.com/p/340fb10f650181008f36d76369aab1f3), [FBNet](https://app.notion.com/p/340fb10f650181d2b993f13714216570), [Auto-DeepLab](https://app.notion.com/p/340fb10f6501810395b4f6fee226c88c), [OFA](https://app.notion.com/p/340fb10f6501816c9485f7cfe9c51717), [NAS-BERT](https://app.notion.com/p/340fb10f650181048a30daf64e25176b), and [NASWoT](https://app.notion.com/p/340fb10f650181c18c65d688d05fcde0). The paper selection and the core interpretation come from my own notes; I used GPT to recompose several separate reviews into a single narrative of how the problem shifted, then reviewed the result myself against my notes and the original papers. The objective each method actually changed, and the scope of its evaluator, were revised after another pass over the source papers.

## Starting point: the architecture with the highest accuracy
Early NAS was mostly close to this problem.

$$
a^*
=
\arg\max_{a\in\mathcal{A}}
\mathrm{Accuracy}_{val}(a)
$$

In real systems that definition is far too narrow. Later work created new NAS tasks by changing not just the search strategy but **the definition of good**.

## 1. Device-aware NAS: accuracy and measured latency together
### MnasNet
MnasNet put latency measured on the target device directly into the reward.

$$
R(a)
=
\mathrm{ACC}(a)^\alpha
\left(
\frac{\mathrm{LAT}(a)}{T}
\right)^\beta
$$

$T$ is the target latency. The motivating observation is that identical FLOPs can run at different speeds depending on hardware kernels and memory access, so proxy compute alone is not enough.

### ProxylessNAS and FBNet
ProxylessNAS reduces the discrepancy introduced by proxy tasks and small search networks, and accounts for latency on the target hardware. FBNet uses a per-operation measured latency lookup table to put expected latency into a differentiable objective.

$$
\min_{\alpha,w}
\mathcal{L}_{task}
+
\lambda
\log
\mathrm{LAT}(\alpha)
$$

The new task is not "the most accurate network" but **the best network within a given device budget**.

## 2. Task-aware topology NAS: searching outside the classification cell
### Auto-DeepLab
Semantic segmentation has to preserve high-resolution spatial detail and low-resolution semantic features at once. Auto-DeepLab searches not only cell operations but also how feature resolution rises and falls along the network.

$$
\min_{\alpha,\beta}
\mathcal{L}_{seg,val}
\left(
w^*(\alpha,\beta),
\alpha,\beta
\right)
$$

- $\alpha$: operations inside the cell
- $\beta$: network-level resolution transitions

The new task here is not classification cell search but **hierarchical topology search for dense prediction**.

## 3. Once-for-all NAS: producing a subnet family rather than one network
OFA identified the cost of re-searching and retraining an architecture per device as the problem. It trains one large supernet and then extracts subnets differing in depth, width, kernel size, and resolution.

$$
a_c^*
=
\arg\max_{a\subseteq\mathcal{N}}
\mathrm{Accuracy}(a)
\quad
\text{s.t.}
\quad
\mathrm{Cost}(a)\le c
$$

Whenever the constraint $c$ changes, so does the subnet $a_c^*$. The objective is not a single optimum but **a model family covering many deployment constraints**.

## 4. Pretraining-aware NAS: a general representation rather than one downstream task
NAS-BERT does not pick an architecture from the accuracy of one supervised task. It trains a BERT-like supernet on a pretraining objective and finds compact architectures via knowledge distillation and evolutionary search.

The new question is closer to:

> Not which structure fits one downstream task, but which structure transfers a pretrained representation across many NLU tasks while staying efficient?

This shift moves the object of NAS evaluation from a task-specific classifier to a pretrained foundation encoder.

## 5. Training-free NAS: changing the evaluator's cost rather than the model objective
Instead of trained accuracy, NASWOT scores a candidate by how distinguishable its activation patterns are at initialization.

$$
s(a)=\log\det K_a
$$

$K_a$ is a kernel holding the similarity of activation codes across samples. This does not remove the downstream objective. It **replaces the evaluator that approximates that objective with a training-free proxy**. So the new task becomes not just "a good model" but "how well can promising candidates be ranked without training?"

## 6. Joint architecture + recipe search: fixing the structure alone is not enough
FBNetV3 searches architecture and training recipe together.

$$
(a^*,r^*)
=
\arg\max_{a,r}
\mathrm{Accuracy}(a,r)
\quad
\text{s.t.}
\quad
\mathrm{Latency}(a)\le T
$$

The same architecture performs very differently depending on optimizer, augmentation, resolution, and regularization. The new task therefore extends architecture search into **joint AutoML combined with training policy**.

## The new objectives in one table
| New objective | Representative work | Shift in what is optimized |
|---|---|---|
| accuracy + measured latency | MnasNet, ProxylessNAS, FBNet | model quality → device-constrained quality |
| dense prediction topology | Auto-DeepLab | cell → cell + network resolution path |
| many deployment constraints | OFA | single architecture → subnet family |
| transferable pretraining | NAS-BERT | downstream score → pretraining and transfer efficiency |
| training-free ranking | NASWOT | full-training evaluator → initialization proxy |
| architecture + recipe | FBNetV3 | structure → joint search over structure and training method |

## Limitations
Adding objectives does not automatically produce better NAS.

- Scalarization coefficients hide the Pareto trade-off
- Latency is tied to a specific device and runtime
- Proxy rankings can differ from standalone accuracy
- Subnets of a supernet interfere with one another
- A pretraining score does not represent every downstream task
- Searching architecture and recipe together makes the search space explode again

So rather than reporting one aggregate score, it is safer to separate accuracy, latency, memory, energy, and search cost and leave a Pareto frontier. Target-device measurement and standalone retraining are also necessary.

## What I took from NAS
NAS is the field that first made the structure of bi-level optimization vivid to me and got me interested in it for its own sake. Reading DARTS gave me the habit of separating "the inner variables that are trained" from "the outer variables that choose based on that training."

That perspective later became the occasion for conceiving Staged DDA. It let me see that the player response arising within a stage and the difficulty policy adjusted between stages need not be mixed as variables at the same level — they can be formulated as lower level and upper level. An interest that started in NAS carried through into the research question of grafting bi-level optimization onto Staged DDA.

## References
- [MnasNet](https://arxiv.org/abs/1807.11626)
- [ProxylessNAS](https://arxiv.org/abs/1812.00332)
- [FBNet](https://arxiv.org/abs/1812.03443)
- [Auto-DeepLab](https://arxiv.org/abs/1901.02985)
- [Once-for-All](https://arxiv.org/abs/1908.09791)
- [NAS-BERT](https://arxiv.org/abs/2105.14444)
- [Neural Architecture Search without Training](https://arxiv.org/abs/2006.04647)
- [FBNetV3](https://arxiv.org/abs/2006.02049)
