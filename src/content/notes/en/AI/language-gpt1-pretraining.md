---
title: "Why GPT-1 made pretraining the center of language modeling"
lang: "en"
translationKey: "language-gpt1-pretraining"
date: "2026-07-30"
field: "ai"
category: "Natural Language Processing"
series: "Language Foundations"
order: 4
status: "reading"
summary: "The structure and limitations of GPT-1, which connected unsupervised pretraining and supervised fine-tuning through a decoder-only causal LM."
problem: "Task-specific NLU models need labels and generalize poorly. With labels scarce, how can one language model be reused across many tasks?"
coreIdea: "GPT-1 first learns general language ability through next-token prediction, then reuses that representation on downstream tasks via fine-tuning."
connection: "A turning-point note showing where the pretrain-finetune paradigm began. The later foundation model lineage starts from this decoder-only development."
tags: ["gpt-1", "pretraining", "causal-lm", "fine-tuning", "decoder-only", "language-model"]
---

# Why GPT-1 made pretraining the center of language modeling

## Background
This post takes my original Notion notes, uses GPT to restructure the organization and sentences for the blog, and was then reviewed by me against my notes and the original papers. The paper selection and the core interpretation come from my notes; the equations and limitations were revised against the source papers.

- [Transformer](https://app.notion.com/p/340fb10f65018105bb36c2164380ff9d)
- [GPT-1](https://app.notion.com/p/340fb10f65018186a006ec657fe8ec9d)

## Problem
Existing NLU models were fitted to a single task — sentence classification, question answering, semantic similarity. And labeled data is always scarce. Could one model instead learn a general sense of language first, and then be adapted per task?

GPT-1's answer is: "learn as a language model first, then adjust to the task."

## Core idea / progression
### Decoder-only causal LM
GPT-1 models language with a decoder alone, no encoder. A causal mask prevents seeing future tokens, and the next token is predicted from left context only. That simple form turns out to be a good starting point for general-purpose pretraining.

### Unsupervised pretraining
The ability to generate sentences is learned first, because the statistical structure of language can be learned from vast text without labels. This stage produces the general representation.

### Supervised fine-tuning
The pretrained decoder is fine-tuned per task. The input is converted into a task-appropriate ordered sequence, and a task-specific head is placed on the same language model. The pretrained representation largely determines downstream performance here.

### Auxiliary LM objective
Keeping the language modeling objective as an auxiliary term during fine-tuning helps preserve generality. GPT-1 uses this explicitly to prevent the parameters from narrowing too abruptly under the task loss alone.

## Method / equations
### Causal language modeling
Unsupervised pretraining can be written as:

$$
L_1(\mathcal U) = \sum_i \log P(u_i \mid u_{i-k}, \ldots, u_{i-1}; \Theta)
$$

Future tokens never enter the conditioning. That is the core of a decoder-only causal LM.

### Internal representation
GPT-1 forms the initial representation by adding token and position embeddings.

$$
h_0 = U W_e + W_p
$$

It then passes through several Transformer blocks.

$$
h_l = \mathrm{transformer\_block}(h_{l-1}), \qquad \forall l \in [1,n]
$$

and finally produces the next-token distribution.

$$
P(u) = \mathrm{softmax}(h_n W_e^T)
$$

Here $W_p$ can be seen as a learned positional matrix — GPT-1 absorbed positional encoding into learning as well.

### Supervised fine-tuning
On a downstream task it learns the conditional probability:

$$
P(y \mid x^1, \ldots, x^m) = \mathrm{softmax}(h_l^m W_y)
$$

with the objective written as:

$$
L_2(\mathcal C) = \sum_{(x,y)} \log P(y \mid x^1, \ldots, x^m)
$$

### Auxiliary objective

$$
L_3(\mathcal C) = L_2(\mathcal C) + \lambda L_1(\mathcal C_1)
$$

This auxiliary term helps keep language modeling ability from degrading too far during fine-tuning.

## Comparing the representative models
| Model | Training method | Strength | Remaining limitation |
|---|---|---|---|
| Task-specific NLU model | separate supervision per task | optimized directly for the problem | heavy label dependence, weak reusability |
| Encoder-decoder family | strong at input-output transformation | handles generation and transformation together | not the center of general-purpose pretraining |
| GPT-1 decoder-only LM | pretrain then fine-tune | reuses a general representation even with few labels | cannot directly use bidirectional context |

## References
- [Radford et al., 2018, Improving Language Understanding by Generative Pre-Training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Vaswani et al., 2017, Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Howard & Ruder, 2018, Universal Language Model Fine-tuning for Text Classification](https://arxiv.org/abs/1801.06146)

## Limitations and a simple idea for solving them
Being decoder-only, GPT-1 cannot use bidirectional context directly, and fine-tuning is fairly sensitive to task format. On long inputs, causal context alone can also leave too little information. The simplest fixes are instruction tuning, retrieval augmentation, and parameter-efficient adaptation such as prefixes or adapters — or reintroducing an encoder branch where the extra expressiveness is needed. Even so, GPT-1 clearly opened the paradigm in which pretraining is central and tasks are layered on top.
