---
title: "CMA-ES로 블랙박스 최적화를 푸는 법"
lang: "ko"
translationKey: "cma-es-black-box-optimization"
date: "2026-07-30"
field: "ai"
category: "Optimization"
series: "Black-box Optimization"
order: 1
status: "reading"
summary: "그래디언트가 없거나 믿기 어려운 목표함수에서 CMA-ES가 탐색 분포의 평균과 공분산을 적응시키며 해를 찾아가는 방식을 정리한다."
problem: "목표함수의 그래디언트가 없거나, 시뮬레이터처럼 평가만 가능한 상황에서 어떻게 탐색을 안정적으로 진행할 수 있을까?"
coreIdea: "CMA-ES는 좋은 해를 직접 갱신하는 대신, 좋은 해를 만들어낸 샘플링 분포의 평균, 공분산, step-size를 함께 학습한다."
connection: "CMA-ES는 목적함수의 미분 가능성을 가정하지 않고, 평가값의 순위만으로 탐색 분포를 적응시키는 대표적인 black-box optimization 기준점이다."
tags: ["optimization", "cma-es", "black-box optimization", "evolution strategy"]
---

# CMA-ES로 블랙박스 최적화를 푸는 법

## 작성 배경
이 글은 내가 Notion에 작성한 [CMA-ES 정리](https://app.notion.com/p/38bfb10f6501819b9a49db2d45825a42)를 바탕으로 썼다. 핵심 해석과 학습 순서는 내 원문에서 출발했으며, GPT로 블로그에 맞게 구조와 표현을 재구성한 뒤 원문과 원 논문을 대조해 직접 검수했다. 수식의 의미와 방법 간 비교는 원 논문과 튜토리얼을 다시 대조해 보완했다.

## 문제
블랙박스 최적화에서는 목표함수를 직접 미분할 수 없거나, 미분값이 있어도 너무 noisy해서 믿기 어려운 경우가 많다. 함수가 비선형이고, 비볼록이고, 비분리적이며, 시뮬레이터를 통해서만 평가되는 상황도 흔하다. 이런 문제에서는 gradient descent를 바로 적용하기 어렵다.

CMA-ES는 이런 환경에서 살아남기 위해 나온 방법이다. 핵심은 "점 하나를 움직이는 것"이 아니라 "좋은 점을 만들어내는 분포를 바꾸는 것"이다.

## 핵심 아이디어/발전 흐름
### 점이 아니라 분포를 최적화한다
CMA-ES는 현재 해 하나를 고르는 대신, 해를 생성하는 확률분포 자체를 유지한다. 보통

$$
\mathcal{N}(m, \sigma^2 C)
$$

로 생각할 수 있다. 여기서 $m$은 중심, $\sigma$는 탐색 크기, $C$는 분포의 모양이다.

### 좋은 샘플의 방향을 기억한다
매 세대마다 여러 후보를 샘플링하고 평가한 뒤, 상위 후보들만 남겨 평균을 다시 계산한다. 이 평균 이동은 "좋은 후보가 나온 쪽으로 중심을 옮긴다"는 뜻이다.

### 공분산과 step-size를 함께 적응시킨다
공분산은 탐색 구름의 방향과 늘어남을 조절하고, step-size는 전체 탐색 범위를 키우거나 줄인다. 직관적으로는 covariance가 landscape의 형태를 배우고, step-size가 탐색 폭을 조절한다고 볼 수 있다.

### 순위로 판단한다
숫자 자체보다 순위를 쓰는 점도 중요하다. 절대적인 함수값 스케일에 덜 민감해지기 때문이다.

## 방법/수식
### 샘플링

$$
x_k = m + \sigma B D z_k, \qquad z_k \sim \mathcal{N}(0, I)
$$

동일하게

$$
x_k \sim \mathcal{N}(m, \sigma^2 C), \qquad C = B D^2 B^T
$$

로 볼 수 있다. 여기서 $B$와 $D$는 공분산의 고유벡터, 고유값 정보를 담는다.

### 재조합

$$
m \leftarrow \sum_{i=1}^{\mu} w_i x_{i:\lambda}
$$

상위 $\mu$개의 후보를 가중 평균해 다음 중심을 만든다.

### 공분산 적응

$$
C \leftarrow (1-c_{cov})C + c_{cov}p_c p_c^T
$$

이 식은 한 번의 좋은 이동이 아니라, 누적된 이동 방향을 반영해 탐색 분포의 모양을 바꾸는 장치다.

### step-size 적응

$$
\sigma \leftarrow \sigma \cdot \exp\left(\frac{\|p_s\| - \chi_n}{\chi_n d}\right)
$$

step-size는 너무 넓게 퍼지면 줄이고, 너무 좁아지면 다시 늘린다.

### 흐름 요약
```text
initialize m, sigma, C
repeat:
  sample lambda candidates
  evaluate and rank them
  recombine the top mu candidates
  update covariance C
  update step-size sigma
return the best candidate seen so far
```

### 기호 정리
| 기호 | 의미 |
|---|---|
| $m$ | 탐색 분포의 중심 |
| $\sigma$ | 전역 탐색 크기 |
| $C$ | 탐색 분포의 모양과 방향 |
| $\lambda$ | 한 세대에서 뽑는 후보 수 |
| $\mu$ | 재조합에 쓰는 상위 후보 수 |
| $w_i$ | 상위 후보의 가중치 |
| $p_c$ | covariance 적응에 쓰는 path |
| $p_s$ | step-size 적응에 쓰는 path |

## 대표 모델 비교
| 방법 | 필요한 정보 | 강점 | 한계 |
|---|---|---|---|
| Random Search | 함수 평가만 | 구현이 가장 단순하다 | 탐색이 누적되지 않는다 |
| Gradient Descent | gradient | 빠르고 효율적이다 | 미분 불가 블랙박스에는 바로 쓰기 어렵다 |
| CMA-ES | 함수 평가만 | 분포를 적응시키며 탐색한다 | 평가 횟수와 계산 비용이 크다 |

## 한계
CMA-ES는 gradient가 필요 없지만, 그만큼 function evaluation을 많이 쓴다. 고차원에서는 full covariance를 다루는 비용이 커지고, 노이즈가 큰 환경에서는 좋은 후보의 순위가 흔들릴 수 있다. 또한 stochastic search이기 때문에 일반적인 의미의 global optimum 보장은 없다.

## 한계에서 이어지는 아이디어
평가 비용이 큰 문제에서는 vanilla CMA-ES를 그대로 쓰기보다 surrogate model로 유망 후보를 먼저 거르거나, 낮은 예산 평가에서 높은 예산 평가로 넘어가는 multi-fidelity 전략을 결합할 수 있다. 고차원에서는 diagonal 또는 low-rank covariance 근사를 사용하고, noisy objective에서는 같은 random seed를 공유하는 평가나 반복 측정으로 순위의 흔들림을 줄일 수 있다.

이 아이디어들의 핵심은 CMA-ES를 모든 문제의 정답으로 두는 것이 아니다. 평가 비용, 차원, 노이즈라는 병목에 맞춰 분포 적응의 범위를 줄이는 쪽이 더 현실적이다.

## 참고자료
- [Hansen & Ostermeier, 2001](https://doi.org/10.1023/A:1011157308460)
- [Hansen, 2016, The CMA Evolution Strategy: A Tutorial](https://arxiv.org/abs/1604.00772)
- [CMA-ES official site](https://cma-es.github.io/)
