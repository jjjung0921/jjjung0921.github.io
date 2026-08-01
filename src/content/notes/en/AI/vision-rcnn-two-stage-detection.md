---
title: "Why did the R-CNN family become the reference for two-stage detection?"
lang: "en"
translationKey: "vision-rcnn-two-stage-detection"
date: "2026-07-30"
field: "ai"
category: "Computer Vision"
series: "Vision Foundations"
order: 2
status: "reading"
summary: "Organizing R-CNN, Fast R-CNN, Faster R-CNN, and Mask R-CNN along the axes of region proposal, RoI feature extraction, classification/regression, and instance mask."
problem: "Detection is harder than classification, because it has to find both what an object is and where it is at the same time."
coreIdea: "A two-stage detector finds candidate regions first and then performs classification and box regression on those candidates, prioritizing accuracy."
connection: "This post is the reference point for comparing one-stage detectors and transformer backbones."
tags: ["object-detection", "two-stage-detection", "rcnn", "fast-rcnn", "faster-rcnn", "mask-rcnn"]
---

# Why did the R-CNN family become the reference for two-stage detection?

## Background
This post follows the context of my Notion [Computer Vision](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee) notes, with the R-CNN family revised against the original papers [R-CNN](https://arxiv.org/abs/1311.2524), [Fast R-CNN](https://arxiv.org/abs/1504.08083), [Faster R-CNN](https://arxiv.org/abs/1506.01497), and [Mask R-CNN](https://arxiv.org/abs/1703.06870). I used GPT to restructure and rephrase, then reviewed the result myself against my notes and the source papers.

> The R-CNN / Fast R-CNN / Faster R-CNN / Mask R-CNN sections here are not transcribed from sentences that existed in my Notion notes; they extend the surrounding context and were revised against the original papers.

## Problem
Object detection is one step more complex than classification.
It is not enough to get "what is in the image" right — you have to find "where it is" at the same time.

The R-CNN family took that head-on and built a two-stage structure: find candidate regions first, then classify and refine them.

## Core idea
The core of a two-stage detector is simple.

1. Find object candidates across the whole image
2. Turn the candidate regions (RoIs) into features
3. Predict class and bbox from those features

This ordering makes detection more accurate, but it makes the pipeline heavier.
So the R-CNN family always carries an "accuracy vs speed" tension.

## The progression by version
### R-CNN
R-CNN extracts bottom-up region proposals first, then converts each proposal into CNN features for classification and bbox regression.
Its significance is going beyond "recycling detection as classification" and establishing detection itself as a proposal-based problem.

### Fast R-CNN
Fast R-CNN reduced the inefficiency of running a separate CNN per proposal by using RoI pooling on a shared convolutional feature map.

Its representative loss ties classification and bbox regression together.

$$
L = L_{cls} + \lambda L_{box}
$$

More precisely, it is a multi-task loss that applies localization loss only to positive RoIs.

### Faster R-CNN
Faster R-CNN learns region proposals with an RPN (Region Proposal Network) instead of delegating them to an external algorithm.
The RPN predicts objectness and bbox offsets at each position on the feature map.

The RPN's loss also splits into classification and regression.

$$
L_{RPN} = L_{obj} + \lambda L_{reg}
$$

The important change is that the proposal stage moved inside the network.
"Finding candidates" is now something that gets learned.

### Mask R-CNN
Mask R-CNN adds an instance mask branch on top of Faster R-CNN.
It handles instance segmentation, beyond detection, within the same framework.

To reduce RoIPool's quantization problem it uses RoIAlign, which preserves alignment through bilinear interpolation instead of coarsely rounding coordinates.

## Method and equations
At its simplest, the R-CNN family can be written as:

$$
\text{proposal} \rightarrow \text{RoI feature} \rightarrow \text{class} + \text{bbox}
$$

Faster R-CNN turns proposal generation into part of the network, and Mask R-CNN adds a mask head.

The core of the structure is "build accurate detection candidates first, then read those candidates carefully."
That is why two-stage tends to be strong on small objects and complex scenes.

## Why this family mattered
The reasons the R-CNN family became the reference are clear.

- It treated classification and localization separately while pushing toward end-to-end training
- It progressively turned proposal quality into a learnable module
- It extended naturally all the way to instance segmentation

Two-stage detection, in other words, defined detection as "a problem of first selecting careful candidates and then refining them."

## Limitations
Two-stage is accurate but costly.

- The proposal stage can become a bottleneck
- RoI pooling and anchor design are complex
- Dense scenes and small objects remain difficult
- It is at a disadvantage against one-stage methods like YOLO for real-time use

## A simple idea for solving this
If candidate region quality is the bottleneck, it is better to stabilize alignment and proposal quality first.

- Preserve positional alignment with RoIAlign
- Turn proposals into learnable modules, as the RPN does
- Revisit small objects and dense scenes together with multi-scale features

Reinforcing in that order keeps two-stage's strengths while cutting unnecessary loss.

## References
- [Computer Vision Notion](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee)
- [R-CNN, 2014](https://arxiv.org/abs/1311.2524)
- [Fast R-CNN, 2015](https://arxiv.org/abs/1504.08083)
- [Faster R-CNN, 2015](https://arxiv.org/abs/1506.01497)
- [Mask R-CNN, 2017](https://arxiv.org/abs/1703.06870)
