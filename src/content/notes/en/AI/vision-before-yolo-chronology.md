---
title: "A chronology before YOLO: from LeNet to Faster R-CNN"
lang: "en"
translationKey: "vision-before-yolo-chronology"
date: "2026-07-30"
field: "ai"
category: "Computer Vision"
series: "Vision Foundations"
order: 1
status: "reading"
summary: "Laying out LeNet, AlexNet, VGG, GoogLeNet, R-CNN, Fast R-CNN, and Faster R-CNN in chronological order, and separating out the fact that YOLO is not the next step on that line but a distinct one-stage choice."
problem: "Memorizing the progress of vision models as a single line makes YOLO look like the next step of all detection, when in reality the evolution of classification backbones and of two-stage detectors came first."
coreIdea: "The CNN family strengthened classification representations, and the R-CNN family solved detection by separating it into region proposal and RoI processing. YOLO is a different, one-stage axis."
connection: "This chronology is the reference axis for reading classification backbones, two-stage detectors, one-stage detectors, and transformer backbones separately."
tags: ["computer-vision", "timeline", "cnn", "rcnn", "yolo", "backbone"]
---

# A chronology before YOLO: from LeNet to Faster R-CNN

## Background
This post is based on my Notion write-ups [Convolution Network](https://app.notion.com/p/340fb10f650181e4bb75fd051bd432ae), [AlexNet](https://app.notion.com/p/340fb10f650181718180cd58468c6308), [Yolo V1](https://app.notion.com/p/340fb10f650181978f97fe76928784db), and [Computer Vision](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee), restructured and rephrased with GPT and then reviewed by me against my notes and the original papers. CNN, AlexNet, and YOLO summarize my Notion notes directly; the R-CNN section extends the same context and was revised against the source papers.

> This post exists to establish, before explaining YOLO, the order in which vision models divided classification from detection.

## Problem
Memorizing the progress of vision models as a single line makes YOLO look like the next step of all detection. The actual chronology is different. CNNs built classification representations first, and the two-stage family that carried those representations into detection settled in before YOLO. YOLO is a separate one-stage choice that came afterward.

So this post uses "before YOLO" as the boundary and reads the evolution of classification backbones separately from the evolution of detection pipelines.

## The core chronology
### 1. LeNet
LeNet is the early model that showed convolution and pooling work for image classification.
Its significance is proving first that extracting local patterns is viable instead of memorizing the whole image.

### 2. AlexNet
AlexNet made deep CNNs actually trainable at ImageNet scale. With ReLU, dropout, data augmentation, and GPU training arriving together, "deep models are theoretically possible" became "deep models can actually be trained."

### 3. VGG and GoogLeNet
Two directions emerged at once in this period.

- VGG pushed expressiveness by stacking a simpler structure deeper
- GoogLeNet pushed computational efficiency through the Inception family

Both strengthen the classification backbone, but neither redefines detection itself.

### 4. R-CNN
R-CNN went beyond "recycling" a classifier as a detector and became the starting point of two-stage detectors: extract region proposals first, then classify those candidates with CNN features.
The important point is that R-CNN took on the detection problem in earnest before YOLO.

### 5. Fast R-CNN
Fast R-CNN reduced the inefficiency of running a CNN repeatedly for each region proposal. Using RoI pooling on a single shared feature map, it classifies candidate regions quickly and performs bbox regression.

### 6. Faster R-CNN
Faster R-CNN turned region proposal itself into a learnable RPN.
The front of the detection pipeline is no longer an external algorithm but a module inside the network.

## Method and equations
### The basic intuition of a CNN
The output size of a convolution is usually written as:

$$
O = \frac{I - F + 2P}{S} + 1
$$

where $I$ is the input size, $F$ the filter size, $P$ the padding, and $S$ the stride.
The formula summarizes the CNN's intuition: process the whole image at once while preserving local structure.

### The intuition of a two-stage detector
The R-CNN family is best understood in this order:

$$
\text{region proposals} \rightarrow \text{feature extraction} \rightarrow \text{classification / bbox regression}
$$

The key is deciding "where to look" first and "what it is" second.

## Why this order matters
Read chronologically, vision models split along two axes.

- the axis that keeps strengthening classification backbones
- the two-stage / one-stage axis for detection

This post's timeline stops at Faster R-CNN. YOLO later opens a separate one-stage axis prioritizing speed and simplification, but its principles and loss function are covered in a separate post. YOLO is therefore less the "next version" of R-CNN than a re-solving of the same problem under different constraints.

## Limitations
This post is good for grasping the flow, but it cannot capture every model's specific purpose.

- LeNet, AlexNet, VGG, GoogLeNet, R-CNN, and YOLO each solved different problems
- Bundling them into a one-line chronology blurs the finer distinctions
- Treating R-CNN and YOLO as the same family makes their structural difference easy to miss

## A simple idea for solving this
It is better to read backbones and detection separately first.

- backbone: LeNet, AlexNet, VGG, GoogLeNet
- two-stage detection: R-CNN, Fast R-CNN, Faster R-CNN
- one-stage detection: YOLO
- transformer backbone: the shift after ViT

Only after splitting them this way does it become clear why YOLO should be read as "faster detection."

## References
- [Convolution Network Notion](https://app.notion.com/p/340fb10f650181e4bb75fd051bd432ae)
- [AlexNet Notion](https://app.notion.com/p/340fb10f650181718180cd58468c6308)
- [Yolo V1 Notion](https://app.notion.com/p/340fb10f650181978f97fe76928784db)
- [Computer Vision Notion](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee)
- [LeCun et al., 1998](https://yann.lecun.com/exdb/publis/pdf/lecun-98.pdf)
- [Girshick et al., 2014, R-CNN](https://arxiv.org/abs/1311.2524)
- [Girshick, 2015, Fast R-CNN](https://arxiv.org/abs/1504.08083)
- [Ren et al., 2015, Faster R-CNN](https://arxiv.org/abs/1506.01497)
