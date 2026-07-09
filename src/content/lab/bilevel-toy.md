---
title: "Bi-level Optimization Toy Model"
lang: "en"
translationKey: "bilevel-toy"
tier: "client"
status: "prototype"
question: "How does setting an upper-level parameter constrain the lower-level optimum?"
runtime: "browser"
inputs: ["lambda"]
outputs: ["lower optimum", "upper objective"]
tags: ["Bi-level Optimization", "DDA", "Visualization"]
summary: "A small experiment that visualizes the relation between an upper parameter and a lower-level optimum."
---

## Model

The current React prototype changes $\lambda$ with a slider and computes the lower response plus upper objective.

$$
x^*(\lambda) = 10\lambda
$$

$$
F(\lambda, x^*(\lambda)) = -x^*(\lambda) + \frac{1}{2}(5\lambda)^2
$$

## Astro migration note

Keep the explanation static and migrate only the slider as an island.
