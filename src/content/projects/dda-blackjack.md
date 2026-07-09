---
title: "DDA Blackjack / Matgo"
lang: "en"
translationKey: "dda-blackjack"
status: "active"
problem: "How can an opponent dynamically adjust its strategy to maximize player flow?"
role: "Research prototype designer"
timeRange: "Active research direction"
stack: ["Bi-level Optimization", "MCTS", "Player Modeling", "Simulation"]
tags: ["Game", "AI", "Optimization"]
summary: "A research-oriented project that formulates dynamic difficulty adjustment as a bi-level optimization problem."
constraint: "The system must modulate win-rate and pressure while preserving fairness and avoiding a manipulated feel."
architecture: "Separate an upper-level difficulty controller from a lower-level player or agent response model."
experiment: "Compare static difficulty against win-rate, flow retention, and fairness metrics."
technicalCore:
  - "Bi-level optimization framework"
  - "Player skill estimation"
  - "Dynamic policy shifting"
  - "Simulation-based evaluation"
researchRelevance: "This treats DDA as a nested upper/lower optimization problem and extends toward player modeling and AutoML."
links:
  - label: "Details"
    url: "/en/projects/dda-blackjack/"
---

## Architecture sketch

- Upper-level difficulty controller
- Lower-level player or agent response model
- Fairness and pressure constraints
- Simulation-based evaluation loop

## Evidence target

The target evaluation compares static difficulty against win-rate, flow retention, and fairness metrics.
