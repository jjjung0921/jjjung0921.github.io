---
title: "ENAS는 하나의 DAG에서 어떻게 여러 네트워크의 가중치를 공유했나?"
lang: "ko"
translationKey: "nas-enas-dag-weight-sharing"
date: "2026-07-30"
field: "ai"
category: "Neural Architecture Search"
series: "NAS Foundations"
order: 2
status: "reading"
summary: "ENAS의 supernet DAG, controller가 선택하는 subgraph, shared parameter와 alternating update를 분리해 설명하고, 싸진 평가가 왜 공정한 순위를 보장하지 않는지 살펴본다."
problem: "후보 architecture를 매번 처음부터 학습하면 NAS 비용이 지나치게 크다. 서로 다른 후보가 같은 operation의 학습 결과를 재사용할 수 있을까?"
coreIdea: "ENAS는 모든 후보를 하나의 over-parameterized DAG의 subgraph로 보고, controller가 경로를 샘플링할 때 선택된 edge의 weight만 학습한다."
connection: "가중치 공유는 NAS의 계산량을 크게 줄였지만, search-time proxy score와 독립 재학습 성능을 분리해야 한다는 새로운 평가 문제를 만들었다."
tags: ["nas", "enas", "weight-sharing", "supernet", "dag", "ranking"]
---

# ENAS는 하나의 DAG에서 어떻게 여러 네트워크의 가중치를 공유했나?

## 작성 배경
이 글은 내가 Notion에 작성한 [ENAS 리뷰](https://app.notion.com/p/331fb10f650180dfb36fe480228ae9e4)를 바탕으로 썼다. 논문 선택과 핵심 해석은 내 원문에서 출발했으며, GPT로 블로그에 맞게 구조와 표현을 재구성한 뒤 원문과 원 논문을 대조해 직접 검수했다. ranking bias와 후속 방법의 의미는 원 논문 및 평가 연구와 대조해 보완했다.

## 문제: 후보마다 학습을 다시 시작한다
초기 NAS의 가장 큰 비용은 controller update 자체보다 reward를 얻는 과정에 있었다. architecture $a$를 하나 뽑을 때마다 child weight $w_a$를 학습하고 validation accuracy를 재야 했기 때문이다.

$$
R(a)=\mathrm{Accuracy}_{val}\left(w_a^*,a\right),
\qquad
w_a^*=\arg\min_{w_a}\mathcal{L}_{train}(w_a,a)
$$

ENAS의 질문은 단순하다. 후보가 convolution이나 hidden-state transformation을 공유한다면, 그 parameter도 다시 쓸 수 있지 않을까?

## Supernet DAG와 subgraph
ENAS는 가능한 architecture를 하나의 큰 DAG 안에 넣는다.

$$
\mathcal{G}_{super}=(V,E,\mathcal{O})
$$

controller가 predecessor와 operation을 고르면 하나의 subgraph $a\subset\mathcal{G}_{super}$가 활성화된다. 이때 architecture별 weight $w_a$를 따로 두지 않고, supernet의 shared weight $w$ 중 선택된 부분을 사용한다.

$$
f_a(x;w)=f(x;w\odot m_a)
$$

$m_a$는 architecture $a$가 선택한 edge와 operation만 켜는 mask로 생각할 수 있다. 서로 다른 subgraph가 같은 edge operation을 선택하면 같은 parameter를 이어서 쓴다.

## 두 종류의 parameter를 번갈아 학습한다
ENAS에는 두 parameter 집합이 있다.

- shared child weight $w$
- architecture를 샘플링하는 controller parameter $\theta$

shared weight 단계는 controller가 뽑은 architecture의 training loss를 줄인다.

$$
\min_w
\mathbb{E}_{a\sim\pi_\theta}
\left[\mathcal{L}_{train}(w,a)\right]
$$

controller 단계는 현재 shared weight로 측정한 validation reward를 높인다.

$$
\max_\theta
\mathbb{E}_{a\sim\pi_\theta}
\left[R_{val}(w,a)\right]
$$

실제로는 두 식의 optimum을 정확히 구하지 않고 mini-batch 단위로 번갈아 업데이트한다. 따라서 ENAS를 DARTS의 명시적인 differentiable bi-level objective와 완전히 같은 것으로 보면 안 된다. ENAS는 policy gradient와 shared-weight training을 교대하는 구조다.

## 무엇이 싸졌는가
ENAS가 줄인 것은 후보 생성 수가 아니라 **후보 평가 비용**이다.

- 후보마다 weight를 처음부터 학습하지 않는다
- 한 supernet 학습이 여러 architecture에 누적된다
- controller reward를 훨씬 빨리 얻는다

하지만 이 reward는 독립 학습 성능이 아니라 supernet 안에서 빌린 weight로 얻은 proxy다.

## 가중치 공유가 만든 ranking 문제
우리가 실제로 원하는 순위는 다음과 같다.

$$
r_{standalone}(a)
=
\mathrm{Rank}
\left(
\mathrm{Accuracy}_{val}(w_a^*,a)
\right)
$$

하지만 search 중에 보는 순위는 다음이다.

$$
r_{shared}(a)
=
\mathrm{Rank}
\left(
\mathrm{Accuracy}_{val}(w,a)
\right)
$$

두 순위가 같다는 보장은 없다. 원인은 여러 가지다.

- 자주 샘플링된 path가 더 많이 학습된다
- 서로 다른 후보의 gradient가 같은 weight에서 충돌한다
- 큰 subgraph와 작은 subgraph가 동일 parameter를 다르게 사용한다
- controller와 supernet이 함께 적응해 co-adaptation이 생긴다

즉, ENAS는 "모든 후보를 싸게 완성했다"가 아니라 "한 학습 과정에서 얻은 proxy로 후보를 비교했다"에 가깝다.

## 후속 연구가 고친 것
| 방법 | 핵심 수정 | 해결하려는 문제 |
|---|---|---|
| SPOS | 한 step에 single path만 활성화 | path coupling 감소 |
| FairNAS | operation별 학습 횟수를 맞춤 | sampling unfairness |
| OFA | 큰 network에서 작은 subnet으로 progressive shrinking | 다양한 크기 subnet의 동시 품질 |
| NAS-Bench-201 | 동일 후보의 독립 학습 결과 제공 | ranking과 재현성 진단 |

이 방법들도 ranking을 자동으로 보장하지는 않는다. 공정한 sampling은 필요조건에 가깝고, 최종 후보의 standalone retraining은 여전히 별도 검증이다.

## 한계와 다음 아이디어
weight sharing을 쓴 실험에서는 최소한 세 점수를 분리해서 보고해야 한다.

1. supernet 안의 search-time score
2. 동일 recipe로 독립 재학습한 score
3. 실제 device에서 측정한 latency와 memory

후보 순위의 Kendall 또는 Spearman correlation을 함께 보고, random search와 동일 예산 baseline을 남기는 것도 중요하다. 속도를 얻은 만큼 평가 계약을 더 엄격하게 만드는 것이 weight-sharing NAS의 핵심 과제다.

## 참고자료
- [Efficient Neural Architecture Search via Parameter Sharing](https://arxiv.org/abs/1802.03268)
- [Evaluating the Search Phase of Neural Architecture Search](https://arxiv.org/abs/1902.08142)
- [Single Path One-Shot Neural Architecture Search](https://arxiv.org/abs/1904.00420)
- [FairNAS: Rethinking Evaluation Fairness of Weight Sharing Neural Architecture Search](https://arxiv.org/abs/1907.01845)
- [NAS-Bench-201](https://arxiv.org/abs/2001.00326)
