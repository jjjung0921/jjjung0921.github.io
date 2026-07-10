---
title: "CMA-ES는 블랙박스 최적화를 위해 어떻게 탐색 분포를 업데이트하는가?"
lang: "ko"
translationKey: "cma-es"
date: "2026-02-15"
field: "ai"
category: "Optimization"
status: "reading"
summary: "그래디언트 없이 평균과 공분산을 조정하며 탐색하는 CMA-ES의 핵심 흐름."
problem: "일부 목적 함수는 비볼록, 비미분 가능하거나 시뮬레이션을 통해서만 관측된다."
coreIdea: "CMA-ES는 다변량 정규분포의 평균과 공분산을 적응적으로 업데이트한다."
connection: "하위 반응이 시뮬레이터나 적응형 에이전트에서 나오는 DDA 상위 최적화에 유용하다."
tags: ["CMA-ES", "Black-box Optimization", "DDA"]
---

# CMA-ES는 블랙박스 최적화를 위해 어떻게 탐색 분포를 업데이트하는가?

## 문제

목적 함수가 비볼록이거나 미분 불가능하거나 시뮬레이션으로만 관측되는 경우 그래디언트를 직접 사용할 수 없다.

## 핵심 아이디어

CMA-ES는 다변량 정규 탐색 분포의 평균과 공분산을 업데이트하며 좋은 후보가 나온 방향으로 탐색 분포를 이동시킨다.

$$
m_{g+1} = \sum_{i=1}^{\mu} w_i x_{i:\lambda}
$$

## 메커니즘

```ts
const population = sampleNormal(mean, covariance, lambda);
const ranked = evaluate(population).sort(byFitness);
mean = weightedMean(ranked.slice(0, mu));
covariance = updateCovariance(ranked);
```

| 단계 | 목적 |
|---|---|
| Sample | 후보 해 탐색 |
| Evaluate | 그래디언트 없이 목적 값 측정 |
| Reweight | 성공적인 샘플 쪽으로 평균 이동 |
| Covariance update | 유용한 탐색 방향 학습 |

## 연구 연결

DDA의 상위 레벨 최적화에서는 플레이어 모델이나 시뮬레이터가 하위 반응을 만든다. 이 반응이 미분 가능하지 않을 때 CMA-ES 같은 블랙박스 최적화가 후보가 될 수 있다.
