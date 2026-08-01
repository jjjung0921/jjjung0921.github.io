---
title: "The math of the Transformer: from Q, K, V to residuals"
lang: "en"
translationKey: "language-transformer-math"
date: "2026-07-30"
field: "ai"
category: "Natural Language Processing"
series: "Language Foundations"
order: 3
status: "reading"
summary: "Explaining self-attention, positional encoding, multi-head attention, masking, residual connections, layer norm, and the FFN as a connected chain of equations."
problem: "RNN-family models are hard to parallelize because of sequential computation, and grow expensive on long contexts. How can a model without recurrence handle order and dependency at the same time?"
coreIdea: "The Transformer computes token relationships directly with attention, injects position separately through an encoding, and rebuilds the whole encoder-decoder as parallelizable blocks."
connection: "This note traces the lineage that rewrote sequence modeling as attention-based blocks. Later work on sparse/linear attention and long context follows naturally from here."
tags: ["transformer", "self-attention", "positional-encoding", "mask", "layer-norm", "ffn"]
---

# The math of the Transformer: from Q, K, V to residuals

## Background
This post takes my original Notion notes, uses GPT to restructure the organization and sentences for the blog, and was then reviewed by me against my notes and the original papers. The paper selection and the core interpretation come from my notes; the equations and limitations were revised against the source papers.

- [Attention](https://app.notion.com/p/340fb10f6501814fbec6d1d8a36b139a)
- [Transformer](https://app.notion.com/p/340fb10f65018105bb36c2164380ff9d)

## Problem
RNNs and LSTMs preserve order well, but the next hidden state must be computed before moving on. That sequential dependency blocks parallelization and inflates cost on long contexts. The Transformer is an answer to whether this can be solved without recurrence.

Its core is computing relationships between tokens directly and supplying position separately. The model therefore reads order not as "computation order" but as "represented positional information."

## Core idea / progression
### Self-attention
Each token rebuilds its own representation while consulting the others — the whole sentence looks at itself to compute new representations. The same mechanism is used inside both encoder and decoder.

### Positional encoding
Having removed order, position has to be injected separately. Sin/cos positional encoding puts a different period into each dimension so the model can distinguish relative positions.

### Multi-head and block structure
Rather than one attention, several heads run in parallel. Each head looks at a different representation space, and they are concatenated at the end. Adding residuals, layer norm, and an FFN yields one Transformer block.

### Encoder-decoder flow
The input becomes global context in the encoder stack, while the decoder uses masked self-attention to avoid seeing the future and cross-attention to read the encoder output. This structure lets sequence-to-sequence problems like translation be handled in parallel.

## Method / equations
### Q, K, V projections
Writing the input representation as $X$, three linear transforms produce query, key, and value.

$$
Q = XW_Q,\qquad K = XW_K,\qquad V = XW_V
$$

Read query as "what am I looking for," key as "what do I hold," and value as "the information actually passed on."

### Scaled dot-product attention

$$
\mathrm{Attention}(Q, K, V)
=
\mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

Dividing by $\sqrt{d_k}$ is needed because the variance of the dot product grows with dimension. Without scaling, the softmax saturates too easily and training becomes unstable.

### Multi-head attention

$$
\mathrm{head}_i = \mathrm{Attention}(QW_i^Q, KW_i^K, VW_i^V)
$$

$$
\mathrm{MultiHead}(Q,K,V)
=
\mathrm{Concat}(\mathrm{head}_1,\ldots,\mathrm{head}_h)W^O
$$

Multiple heads observe different relations in parallel: one head can capture nearby syntactic relations while another catches long-range references.

### Positional encoding

$$
PE_{(pos,2i)} = \sin\left(pos / 10000^{2i/d_{model}}\right)
$$

$$
PE_{(pos,2i+1)} = \cos\left(pos / 10000^{2i/d_{model}}\right)
$$

This representation puts a different period in each dimension so absolute and relative positions can be distinguished.

### Mask
The decoder must not see future tokens, so a causal mask is added.

$$
\mathrm{softmax}\left(\frac{QK^T + M}{\sqrt{d_k}}\right)V
$$

Here $M_{ij}$ can be seen as an upper-triangular mask that is $-\infty$ when $j>i$ and 0 otherwise.

### Residual, layer norm, FFN
Each sublayer passes through a residual connection and layer normalization.

$$
x_{l+1} = \mathrm{LayerNorm}(x_l + \mathrm{Sublayer}(x_l))
$$

The position-wise feed-forward network can be written as:

$$
\mathrm{FFN}(x) = \max(0, xW_1 + b_1)W_2 + b_2
$$

Stacking these blocks forms the encoder and the decoder.

### The overall flow
Positional encoding is added to the input embedding and passed through the encoder stack; the decoder then goes through masked self-attention followed by encoder-decoder attention. A final linear projection and softmax produce the next-token distribution.

## Comparing the representative models
| Model | Computation | Strength | Remaining limitation |
|---|---|---|---|
| RNN/LSTM seq2seq | sequential state updates | reads order naturally | hard to parallelize, slow on long contexts |
| ConvS2S / ByteNet | centered on local receptive fields | easier to parallelize than RNNs | distant dependencies require many layers |
| Transformer | self-attention based | sees global relations directly and parallelizes easily | attention cost grows with length |

## References
- [Vaswani et al., 2017, Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Gehring et al., 2017, Convolutional Sequence to Sequence Learning](https://arxiv.org/abs/1705.03122)
- [Kalchbrenner et al., 2016, Neural Machine Translation in Linear Time](https://arxiv.org/abs/1610.10099)

## Limitations and a simple idea for solving them
The Transformer's biggest cost is $O(n^2)$ attention, which grows on long sequences. Injecting position separately is also not a complete answer for long contexts. The simplest fixes combine sparse attention that looks at only some positions, chunking that splits the input into regions, and retrieval that attaches external memory. At this point sequence modeling runs into the efficiency problem again.
