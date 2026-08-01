---
title: "Is ViT a successor to CNNs, or a backbone shift?"
lang: "en"
translationKey: "vision-vit-transformer-backbone"
date: "2026-07-30"
field: "ai"
category: "Computer Vision"
series: "Vision Foundations"
order: 4
status: "reading"
summary: "Organizing ViT's patch embedding, CLS token, positional embedding, and Transformer encoder, and distinguishing ViT as a shift in classification backbone rather than a successor on the R-CNN-to-YOLO detection line."
problem: "CNNs capture local patterns well, but a different backbone was needed to model long-range relations directly. ViT met that need on the classification side first."
coreIdea: "Turn the image into a sequence of patches, let a Transformer encoder integrate that sequence, and perform classification from the CLS token."
connection: "This post pins down the point that ViT is a shift in backbone paradigm, not in the detection pipeline."
tags: ["vision-transformer", "transformer", "backbone", "classification", "detection-transfer"]
---

# Is ViT a successor to CNNs, or a backbone shift?

## Background
This post is based on my Notion write-ups [Convolution Network](https://app.notion.com/p/340fb10f650181e4bb75fd051bd432ae), [AlexNet](https://app.notion.com/p/340fb10f650181718180cd58468c6308), and [Computer Vision](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee), restructured and rephrased with GPT and then reviewed by me against my notes and the original papers. ViT was not directly present in my Notion notes; this section extends the surrounding context and was revised against the original papers [ViT](https://arxiv.org/abs/2010.11929), [DETR](https://arxiv.org/abs/2005.12872), and [Swin Transformer](https://arxiv.org/abs/2103.14030).

> The ViT / DETR / Swin sections here are not transcribed from my Notion notes; they extend the surrounding context and were revised against the original papers.

## Problem
CNNs capture local structure in images well.
But modeling relations between more distant patches directly requires a different backbone.

ViT solved that problem on the "classification backbone" before "detection."
ViT is therefore not a linear successor to R-CNN or YOLO but a separate turning point that brought the Transformer into vision as a backbone.

## Core idea
ViT's core is very simple.

1. Cut the image into patches
2. Linearly project each patch like a token
3. Add a CLS token and positional embeddings
4. Feed it into a Transformer encoder
5. Send the CLS token's output to a classification head

The image is handled as a sequence rather than a convolution map.

## Method
### Patch embedding
Splitting an image $x \in \mathbb{R}^{H \times W \times C}$ into $P \times P$ patches gives a patch count of:

$$
N = \frac{HW}{P^2}
$$

Flattening each patch and passing it through a linear projection produces a token.

### The input sequence
ViT's input is usually written as:

$$
z_0 = [x_{\text{cls}}; x_p^1 E; x_p^2 E; \dots; x_p^N E] + E_{\text{pos}}
$$

where

- $x_{\text{cls}}$ is the learnable CLS token
- $E$ is the patch embedding matrix
- $E_{\text{pos}}$ is the positional embedding

### Transformer encoder
Each encoder block stacks attention and an MLP with residuals.

$$
z'_\ell = \mathrm{MSA}(\mathrm{LN}(z_{\ell-1})) + z_{\ell-1}
$$

$$
z_\ell = \mathrm{MLP}(\mathrm{LN}(z'_\ell)) + z'_\ell
$$

Each attention head computes global relations among patches, and concatenating multiple heads' outputs forms multi-head self-attention.

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

### Classification head
Final classification is performed from the CLS token's representation.
ViT gathers all patches into a single global representation and then classifies.

## Why ViT matters
ViT's significance is not that it is "a slightly modified CNN."
It lies in opening the possibility that a vision backbone can be a Transformer.

The original paper says as much: applying a pure transformer directly to a sequence of image patches can yield a strong classification backbone, given large-scale pretraining.

## The path into detection
There is one important judgment to make here.

- ViT is not a linear successor of R-CNN → YOLO
- ViT is a shift in classification backbone
- Entry into detection happened through separate later designs

DETR and the Swin family are those successors.

- DETR recasts object detection as set prediction, reducing hand-designed components such as anchors and NMS
- Swin Transformer fits dense prediction such as detection and segmentation through a hierarchical backbone and shifted window attention

ViT is better read as a model that changed "the paradigm of vision backbones" rather than as a "detector."

## Limitations
ViT is strong, but reading it as a straight replacement for CNNs misses a lot.

- It is data hungry
- Its locality inductive bias is weak
- It can underperform CNNs on small datasets
- Patch tokenization coarsens fine spatial information

## A simple idea for solving this
When using ViT, think complement before full replacement.

- Do not make patches too large
- Attach hierarchical windows or a hybrid stem
- For detection or segmentation, consider later designs like DETR and Swin rather than ViT alone

Seen this way, ViT is not the end of CNNs but a different starting point for vision backbone design.

## References
- [Computer Vision Notion](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee)
- [Convolution Network Notion](https://app.notion.com/p/340fb10f650181e4bb75fd051bd432ae)
- [AlexNet Notion](https://app.notion.com/p/340fb10f650181718180cd58468c6308)
- [Dosovitskiy et al., 2020, ViT](https://arxiv.org/abs/2010.11929)
- [Carion et al., 2020, DETR](https://arxiv.org/abs/2005.12872)
- [Liu et al., 2021, Swin Transformer](https://arxiv.org/abs/2103.14030)
