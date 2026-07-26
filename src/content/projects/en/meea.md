---
title: "MEEA* Retrosynthesis — Review, Reproduction & Experiments"
lang: "en"
translationKey: "meea"
status: "done"
problem: "In retrosynthetic planning, how can search efficiency and the generalization of a learned heuristic be improved together?"
role: "Individual research — paper/code review, reproduction & experiments"
timeRange: "2025"
stack: ["Python", "PyTorch", "RDKit", "RXNMapper", "MCTS", "A* Search"]
tags: ["AI", "Search", "Study"]
repository: "https://github.com/jjjung0921/MEEA"
reportUrl: "https://www.nature.com/articles/s42004-024-01133-2"
constraint: "Routes must be found in a vast building-block molecule space, and the learned heuristic must generalize to new molecules."
architecture: "MEEA* combines MCTS look-ahead search into A* search and introduces path consistency as a regularization to improve heuristic generalization."
experiment: "Confirmed the paper's result (USPTO 100%) and, on a reproduced pipeline, compared the accuracy and depth of cpuct (0 vs 15) and policyNet (MLP · GELU · Transformer) variants."
technicalCore:
  - "A* with combined MCTS search (pUCT + f-value selection)"
  - "Path consistency regularization (L_RL + λ·L_PC)"
  - "Training-pipeline reproduction (RXNMapper · rdchiral template extraction)"
  - "cpuct · policyNet (MLP/GELU/Transformer) ablation"
researchRelevance: "Nesting MCTS search inside A* directly touches my interest in nested search within bi-level optimization and DDA, and the reproduction/ablation work carries over to designing search algorithms."
links:
  - label: "Paper-review deck (PDF)"
    url: "/files/meea-paper-review.pdf"
  - label: "Code-review deck (PDF)"
    url: "/files/meea-code-review.pdf"
  - label: "Additional experiments — Code Experience (PDF)"
    url: "/files/meea-code-experience.pdf"
summary: "For an individual-research course, reviewed the MEEA*-PC paper and code (Zhao et al., 2024), then reproduced the training pipeline the original repo omits and ran my own cpuct, policyNet, and valueEnsemble experiments. The method and implementation are the original authors'."
---

## Overview

Work done for an individual-research course while studying retrosynthetic planning. The subject is Zhao, Tu, and Xu's *"Efficient retrosynthetic planning with MCTS exploration enhanced A\* search"* (Communications Chemistry, 2024); **the method and original code belong to the authors.** Starting from a paper/code review, I reproduced the parts the original repository does not provide and ran a few experiments.

## Key takeaways (review)

- **MEEA\***: keeps the exploration (pUCT) behavior of MCTS but, like A*, prioritizes the candidate with the lowest f-value during selection.
- **MEEA\*-PC**: sets the training loss as `L = L_RL + λ·L_PC`, improving heuristic generalization with path consistency regularization.
- Understood it as a structure where A*'s heuristic dependence and MCTS's compulsive exploration compensate for each other.

## My own experiments

- **Reconstructed the missing training data**: USPTO raw data (TDC) → atom mapping with RXNMapper → template re-extraction with rdchiral (labels 381,302 → 219,032). Ran MEEA\* over USPTO 299k to build route data and split it 9:1 train/validate.
- **cpuct ablation**: `cpuct=0` (A\*-like, avg depth 18, 80% accuracy) vs `cpuct=15` (MCTS-like, avg depth 6, 94% accuracy) — consistent with USPTO requiring shallow depth.
- **policyNet architecture variants**: over the MLP baseline, GELU improved USPTO precision 0.80 → 0.9474. Transformer was worse — Morgan fingerprints carry no sequence order, so positional encoding gave no benefit; I judged SMILES-style sequence models would fit better.
- **valueEnsemble**: compared value prediction with/without the magic number (-7) — removing it lowers the loss, but under hinge-loss training the gradient-vanishing risk makes keeping it reasonable.

## Proposed follow-ups

- **policyNet**: learn richer representations with SMILES + Transformer, or add a GNN on Morgan fingerprints for reaction-centric prediction.
- **valueEnsemble**: an adaptive threshold instead of a fixed magic number, and distribution regularization such as KL-divergence in the consistency loss.

## Deliverables

- [Paper-review deck (PDF)](/files/meea-paper-review.pdf)
- [Code-review deck (PDF)](/files/meea-code-review.pdf)
- [Additional experiments — Code Experience (PDF)](/files/meea-code-experience.pdf)
