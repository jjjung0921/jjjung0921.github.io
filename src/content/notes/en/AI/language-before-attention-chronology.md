---
title: "Language models before attention: from Word2Vec to Seq2Seq"
lang: "en"
translationKey: "language-before-attention-chronology"
date: "2026-07-30"
field: "ai"
category: "Natural Language Processing"
series: "Language Foundations"
order: 1
status: "reading"
summary: "Following the progression through distributed representations, RNN/LSTM, and Seq2Seq to see what language models solved before attention and where they hit a bottleneck."
problem: "From turning words into vectors to handling variable-length sentences, in what order did language models work through their problems?"
coreIdea: "Word2Vec built a semantic space, RNN/LSTM read order, and Seq2Seq supplied a transformation framework — but a bottleneck appeared the moment everything was compressed into a single context vector."
connection: "An introductory note tying the pre-attention lineage together in one pass, showing why the alignment covered in the next note was needed and which shortcomings surfaced first."
tags: ["nlp", "word2vec", "rnn", "lstm", "seq2seq"]
---

# Language models before attention: from Word2Vec to Seq2Seq

## Background
This post takes my original Notion notes, uses GPT to restructure the organization and sentences for the blog, and was then reviewed by me against my notes and the original papers. The paper selection and the core interpretation come from my notes; the equations and limitations were revised against the source papers.

- [Word2Vec](https://app.notion.com/p/340fb10f650181888657e7592b30bfa2)
- [Seq2Seq](https://app.notion.com/p/340fb10f650181aea7cbe27dbe0eb212)

## Problem
Language is discrete, word order matters, and sentence length varies every time. A plain one-hot representation identifies a word but carries no semantic similarity. And problems like translation or summarization have to handle the flow of a whole sentence, not a single word.

The pre-attention lineage can be read as working through these three problems in order. First Word2Vec built distributed representations, then RNNs and LSTMs supplied a way to read order, and finally Seq2Seq offered a framework connecting input and output as wholes.

## Core idea / progression
### Word2Vec
Word2Vec's core is the idea that words appearing in similar contexts should have similar vectors. It placed word meaning in a single coordinate system, turning it into a reusable representation. CBOW predicts the center word from its neighbors; Skip-gram predicts the neighbors from the center word. Being trainable without labels made this an important turning point.

### RNN and LSTM
An RNN reads a sentence by accumulating order into state. Each timestep's hidden state remembers the previous state together with the current input, so it can handle order within a sentence. In long sentences, though, past information fades and gradients weaken. LSTM is an attempt to reduce that problem with a cell state and gates.

### Seq2Seq
Seq2Seq offered a general encoder-decoder framework for turning variable-length input into variable-length output. It naturally handles problems like translation where input and output lengths differ. But because the entire input is compressed into a single context vector, a bottleneck appears as sentences get longer and information is lost.

## Method / equations
### Distributed representation
Word2Vec can be stated as a context-based objective.

$$
\max_\Theta \sum_t \log P(w_t \mid w_{t-k}, \ldots, w_{t+k})
$$

That is the CBOW form; Skip-gram can be written as:

$$
\max_\Theta \sum_t \sum_{\substack{-k \le j \le k \\ j \ne 0}} \log P(w_{t+j} \mid w_t)
$$

What matters more than the exact variant is that word meaning is learned from the surrounding context.

### Sequential state
An RNN is usually written as:

$$
h_t = f(x_t, h_{t-1})
$$

LSTM adds gates to protect long-term memory.

$$
c_t = f_t \odot c_{t-1} + i_t \odot \tilde{c}_t,\qquad
h_t = o_t \odot \tanh(c_t)
$$

Here $c_t$ is the cell state and $h_t$ the hidden state. The structure aims to handle short-range order and long-range dependency together.

### Seq2Seq
Seq2Seq models the output sequence as:

$$
p(\mathbf{y}) = \prod_{t=1}^{T_y} p(y_t \mid y_{<t}, c)
$$

where $c = q(h_1,\ldots,h_{T_x})$ is the single context vector the encoder produces. All of the source sentence's information has to fit in that one vector, so compression loss grows with length. The decoder typically predicts the next token from the previous output and the hidden state, sometimes using beam search for decoding.

## Comparing the representative models
| Model | Problem solved | Strength | Remaining limitation |
|---|---|---|---|
| Word2Vec | word meaning representation | turns words into distributed representations via context | cannot directly handle context-dependent shifts in meaning |
| RNN/LSTM | order and state accumulation | reads the temporal structure of a sentence | weak on long dependencies and parallelization |
| Seq2Seq | variable-length transformation | generalizes input-output transformation such as translation | a bottleneck from compressing everything into one vector |

## References
- [Mikolov et al., 2013, Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/abs/1301.3781)
- [Mikolov et al., 2013, Distributed Representations of Words and Phrases and their Compositionality](https://arxiv.org/abs/1310.4546)
- [Hochreiter & Schmidhuber, 1997, Long Short-Term Memory](https://www.bioinf.jku.at/publications/older/2604.pdf)
- [Cho et al., 2014, Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation](https://arxiv.org/abs/1406.1078)
- [Sutskever et al., 2014, Sequence to Sequence Learning with Neural Networks](https://arxiv.org/abs/1409.3215)

## Limitations and a simple idea for solving them
The final limitation of this lineage is the design that tries to pack all information into one context vector. Longer sentences compress harder, and the sequential computation of RNN-family models is difficult to parallelize. The simplest fix is to let the decoder look back at the entire input. That next step is attention.
