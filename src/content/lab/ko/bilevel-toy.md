---
title: "이중 최적화 토이 모델"
lang: "ko"
translationKey: "bilevel-toy"
tier: "client"
status: "prototype"
question: "상위 레벨 파라미터를 설정하는 것이 하위 레벨 최적 반응을 어떻게 제약할까?"
runtime: "browser"
inputs: ["lambda"]
outputs: ["lower optimum", "upper objective"]
tags: ["Bi-level Optimization", "DDA", "Visualization"]
summary: "상위 파라미터와 하위 최적 반응의 관계를 시각화하는 작은 실험."
---

## Model

현재 React 프로토타입은 슬라이더로 $\lambda$를 조정하고, 하위 반응과 상위 목적 값을 계산한다.

$$
x^*(\lambda) = 10\lambda
$$

$$
F(\lambda, x^*(\lambda)) = -x^*(\lambda) + \frac{1}{2}(5\lambda)^2
$$

## Astro migration note

설명은 정적 문서로 두고, 슬라이더만 island로 이식한다.
