---
title: "Why did BERT define bidirectional representation as the central problem?"
lang: "en"
translationKey: "bert-bidirectional"
date: "2026-03-06"
field: "language"
category: "AI Systems"
status: "implemented"
summary: "A short note on why masked language modeling made bidirectional representation a core BERT design choice."
problem: "Unidirectional language models cannot use both left and right context when learning token representations."
coreIdea: "Masked language modeling lets the model condition on both sides of a masked token during pretraining."
connection: "The same boundary-control idea matters for constrained QA and spoiler-safe retrieval."
tags: ["BERT", "Representation", "Language Models"]
---

# Why did BERT define bidirectional representation as the central problem?

## Problem

Unidirectional language models cannot use both left and right context when learning token representations. This limits tasks where meaning depends on information that appears after the target token.

## Core idea

BERT uses masked language modeling so the model can condition on both sides of a masked token during pretraining.

$$
L(\theta) = - \sum_i \log P(x_i \mid x_{\setminus i}; \theta)
$$

## Mechanism

```python
masked_tokens = sample(tokens, ratio=0.15)
loss = model.predict(masked_tokens, context=tokens)
loss.backward()
```

| Component | Role |
|---|---|
| Masked Language Modeling | Learns bidirectional token representations |
| Transformer Encoder | Mixes left and right context |
| Fine-tuning Head | Adapts representation to downstream tasks |

## Research connection

This matters for constrained QA because the model must reason from allowed context only. The representation strategy and retrieval boundary must be designed together.
