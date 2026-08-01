---
title: "How Bahdanau attention rebuilt alignment"
lang: "en"
translationKey: "language-attention-alignment"
date: "2026-07-30"
field: "ai"
category: "Natural Language Processing"
series: "Language Foundations"
order: 2
status: "reading"
summary: "How additive attention learns the alignment between encoder and decoder, and why it does not entirely erase the fixed-length bottleneck."
problem: "A single encoder-produced context vector cannot reliably carry long, complex input. So what should the decoder look at, when, and how much?"
coreIdea: "Attention makes the model reread the whole input at each output step, turning alignment into learnable weights and generating the context vector dynamically."
connection: "This traces the lineage that confronted Seq2Seq's bottleneck head-on, and bridges toward the self-attention and causal decoding of the Transformer."
tags: ["attention", "bahdanau", "alignment", "encoder-decoder", "seq2seq"]
---

# How Bahdanau attention rebuilt alignment

## Background
This post takes my original Notion notes, uses GPT to restructure the organization and sentences for the blog, and was then reviewed by me against my notes and the original papers. The paper selection and the core interpretation come from my notes; the equations and limitations were revised against the source papers.

- [Seq2Seq](https://app.notion.com/p/340fb10f650181aea7cbe27dbe0eb212)
- [Attention](https://app.notion.com/p/340fb10f6501814fbec6d1d8a36b139a)

## Problem
Because Seq2Seq compresses the entire input into a single context vector, it loses information on long sentences. The decoder has to decide for itself which encoder state to look at and how much at each step; without that decision, every output depends on the same compressed vector.

Attention rewrites this problem in terms of alignment. It directly computes which input positions matter to the current output and folds those weights into the context vector.

## Core idea / progression
### From a fixed context to a dynamic one
In earlier Seq2Seq every output used the same context vector. Attention builds a different context vector per output token. When the output changes, so do the input positions worth rereading.

### Making alignment a learnable quantity
Just as a human translator asks "which part of the sentence does this word point to," the model computes it internally. Because the alignment is expressed as soft weights rather than a hard rule, it can be learned.

### Loosely coupling encoder and decoder
All encoder hidden states are kept, and the decoder pulls what it needs at each step. This structure reduces the bottleneck and lets gradients flow along more paths.

## Method / equations
### Encoder and decoder states
The encoder produces a hidden state at each input position.

$$
h_j = \mathrm{Encoder}(x_j, h_{j-1})
$$

The decoder updates its next state from the previous output and its own state.

$$
s_i = f(s_{i-1}, y_{i-1}, c_i)
$$

### Additive energy
The core of Bahdanau attention is the additive score.

$$
e_{ij} = v_a^T \tanh(W_s s_{i-1} + W_h h_j)
$$

Here $s_{i-1}$ is the current decoder state and $h_j$ the encoder's $j$-th hidden state. The score can be read as an energy expressing how well the two vectors match.

### Soft alignment
Normalizing the energies with a softmax gives the alignment weights.

$$
\alpha_{ij} = \frac{\exp(e_{ij})}{\sum_{k=1}^{T_x} \exp(e_{ik})}
$$

This expresses how much output step $i$ attends to input position $j$. All $\alpha_{ij}$ sum to 1.

### Context vector
Applying the alignment weights to the encoder states produces the context vector.

$$
c_i = \sum_{j=1}^{T_x} \alpha_{ij} h_j
$$

The decoder now receives information tailored to the current step rather than one fixed vector.

### Gradient path
What matters is that gradients flow through $c_i$ into every $h_j$. Unlike Seq2Seq, where everything passed through one fixed vector, attention connects each output position directly to the whole input. The encoder therefore becomes a target of alignment rather than a mere compressor.

## Comparing the representative models
| Model | Alignment method | Strength | Remaining limitation |
|---|---|---|---|
| Seq2Seq without attention | one fixed context vector | simple structure | heavy information loss on long inputs |
| Bahdanau attention | soft alignment via additive energy | turns alignment into a learnable variable | rereads every position for each input |
| Dot-product attention | inner-product-based alignment | cheap to compute and fits later architectures well | expressiveness can be simpler than additive |

## References
- [Bahdanau et al., 2014, Neural Machine Translation by Jointly Learning to Align and Translate](https://arxiv.org/abs/1409.0473)
- [Cho et al., 2014, Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation](https://arxiv.org/abs/1406.1078)
- [Luong et al., 2015, Effective Approaches to Attention-based Neural Machine Translation](https://arxiv.org/abs/1508.04025)

## Limitations and a simple idea for solving them
Attention reduced the bottleneck, but rereading the whole input per output pushes computation to $O(T_x T_y)$. And training that relies on teacher forcing does not fully prevent error accumulation at inference, so exposure bias remains. The simplest fixes are sparse attention that looks at fewer positions, coverage that also tracks length, and scheduled sampling to reduce the mismatch in how the decoder is trained. The next step in the lineage leads from here to self-attention.
