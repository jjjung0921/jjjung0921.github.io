---
title: "How did YOLO v1 turn detection into a single regression problem?"
lang: "en"
translationKey: "vision-yolo-one-stage-detection"
date: "2026-07-30"
field: "ai"
category: "Computer Vision"
series: "Vision Foundations"
order: 3
status: "reading"
summary: "How a one-stage detector gains speed and simplicity, centered on YOLO v1's grid, bounding boxes, confidence, class probabilities, and multi-part loss."
problem: "Solving detection by recycling a classifier is slow and produces a complex pipeline. Real-time detection needs a structure that handles localization and classification in one pass."
coreIdea: "Divide the image into an S×S grid and have each cell regress bounding boxes and class probabilities simultaneously."
connection: "This post is the reference point for the design principles of one-stage detectors and how they differ from two-stage detectors."
tags: ["object-detection", "one-stage-detection", "yolo", "regression", "real-time"]
---

# How did YOLO v1 turn detection into a single regression problem?

## Background
This post is based on my Notion write-ups [Yolo V1](https://app.notion.com/p/340fb10f650181978f97fe76928784db) and [Computer Vision](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee), restructured and rephrased with GPT and then reviewed by me against my notes and the original papers. YOLO summarizes my Notion notes directly; the R-CNN family appears only as a comparison checked against the source papers.

## Problem
Solving detection the classifier way means producing candidates separately and then classifying them again.
That process is good for accuracy but tends to hurt real-time performance.

YOLO v1 changes that discomfort head-on.
It rewrites detection as "one regression" rather than "classify, then localize."

## Core idea
YOLO v1's idea fits in three lines.

1. Divide the image into an $S \times S$ grid
2. Have each cell predict class probabilities and bounding boxes together
3. Have one network answer for the whole image in a single pass

This structure makes YOLO a one-stage detector — candidate generation and discrimination are never separated.

## Method
### Grid
Dividing the image into a grid makes the cell containing an object's center responsible for that object.
That assignment of responsibility is YOLO's core.

### Bounding boxes and class probabilities
Each cell emits $B$ bounding boxes and $C$ class probabilities.

$$
S \times S \times (B \cdot 5 + C)
$$

Each box carries $(x, y, w, h, confidence)$.

Confidence holds both whether an object exists and the quality of the localization.

$$
\text{confidence} = \Pr(\text{Object}) \cdot \text{IoU}
$$

The class score is also read jointly with the object-existence condition.

$$
\Pr(\text{Class}_i \mid \text{Object}) \cdot \Pr(\text{Object}) \cdot \text{IoU}
$$

### Multi-part loss
YOLO v1 learns localization, confidence, and class error as a single sum. Transcribing the paper's notation simply:

$$
\begin{aligned}
L ={}&
\lambda_{\mathrm{coord}}
\sum_{i=1}^{S^2}\sum_{j=1}^{B}\mathbb{1}_{ij}^{\mathrm{obj}}
\left[(x_i-\hat{x}_i)^2+(y_i-\hat{y}_i)^2\right] \\
&+
\lambda_{\mathrm{coord}}
\sum_{i=1}^{S^2}\sum_{j=1}^{B}\mathbb{1}_{ij}^{\mathrm{obj}}
\left[
(\sqrt{w_i}-\sqrt{\hat{w}_i})^2+
(\sqrt{h_i}-\sqrt{\hat{h}_i})^2
\right] \\
&+
\sum_{i=1}^{S^2}\sum_{j=1}^{B}
\mathbb{1}_{ij}^{\mathrm{obj}}(C_i-\hat{C}_i)^2 \\
&+
\lambda_{\mathrm{noobj}}
\sum_{i=1}^{S^2}\sum_{j=1}^{B}
\mathbb{1}_{ij}^{\mathrm{noobj}}(C_i-\hat{C}_i)^2 \\
&+
\sum_{i=1}^{S^2}\mathbb{1}_{i}^{\mathrm{obj}}
\sum_{c \in \mathrm{classes}}
(p_i(c)-\hat{p}_i(c))^2.
\end{aligned}
$$

$\mathbb{1}_{ij}^{\mathrm{obj}}$ is 1 when the $j$-th box of the $i$-th cell is responsible for that object. $\lambda_{\mathrm{coord}}$ weights localization error more heavily, and $\lambda_{\mathrm{noobj}}$ keeps the confidence error of the many empty boxes from dominating training. Width and height are square-rooted so that the absolute error of large boxes does not overwhelm that of small ones.

The important point is that detection is not split into separate classification and localization pipelines; both are optimized together inside one regression objective.

## The one-stage tradeoff
What YOLO gains is clear.

- It is fast
- The pipeline is simple
- It sees the whole image context at once

So is the cost.

- A coarse grid is weak on small objects
- Closely packed objects are hard to separate
- Localization error grows on unusual aspect ratios and dense scenes

YOLO gains speed and simplicity at the price of dense precision.

## How to read the later versions
When looking at later YOLO versions, the version number itself is not what matters.
The core question is "how to reduce the coarseness of the grid and the assignment problem while keeping one-stage speed."

So the later improvements generally head in these directions.

- Making better use of multi-scale features
- Catching small objects better
- Making assignment more precise
- Strengthening the backbone and the head

## Limitations
YOLO v1's limitations follow directly from its structure.

- Grid-based responsibility assignment is rigid
- It is at a disadvantage on small objects and dense scenes
- Localization and classification are never fully separated
- Real-time performance is good, but precision can lag two-stage methods

## A simple idea for solving this
If speed comes first, keep one-stage; if accuracy matters more, reinforce these first.

- Add denser features and multi-scale representations
- Redesign assignment for small objects
- Keep one-stage simplicity but add separate correction only for dense scenes

This preserves YOLO's strengths while gradually reducing the grid's weaknesses.

## References
- [Yolo V1 Notion](https://app.notion.com/p/340fb10f650181978f97fe76928784db)
- [Computer Vision Notion](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee)
- [Redmon et al., 2015, YOLO](https://arxiv.org/abs/1506.02640)
- [Girshick et al., 2014, R-CNN](https://arxiv.org/abs/1311.2524)
