---
title: "NAS는 왜 전체 네트워크 대신 Cell DAG를 찾게 되었나?"
lang: "ko"
translationKey: "nas-search-space-evolution"
date: "2026-07-30"
field: "ai"
category: "Neural Architecture Search"
series: "NAS Foundations"
order: 1
status: "reading"
summary: "NAS-RL의 가변 길이 sequence에서 NASNet과 PNAS의 cell DAG로 탐색 단위가 바뀐 과정을 따라가며, 탐색 공간의 표현과 탐색 알고리즘을 분리해 읽는다."
problem: "전체 네트워크의 layer와 skip connection을 순서대로 생성하면 탐색 공간과 평가 비용이 함께 폭발한다. 무엇을 하나의 재사용 가능한 탐색 단위로 묶어야 할까?"
coreIdea: "NASNet은 작은 cell을 DAG로 표현하고 그 cell을 반복해 전체 네트워크를 만들었다. 이 변화는 탐색 공간을 줄이고 전이를 쉽게 했지만, DAG 표현 자체가 가중치 공유를 자동으로 제공하는 것은 아니다."
connection: "NAS를 이해하려면 먼저 search space, search strategy, performance estimation을 분리해야 한다. 이 글은 그중 search space가 어떻게 whole network에서 reusable cell로 바뀌었는지 다룬다."
tags: ["nas", "search-space", "dag", "nasnet", "pnas", "cell"]
---

# NAS는 왜 전체 네트워크 대신 Cell DAG를 찾게 되었나?

## 작성 배경
이 글은 내가 Notion에 작성한 [NAS-RL](https://app.notion.com/p/218fb10f6501801ea652ccda5dd9e3c8), [NASNet](https://app.notion.com/p/218fb10f65018090a1e1d59a6f15c976), [PNAS](https://app.notion.com/p/312fb10f6501807d9505c4f5ec34485f) 리뷰를 바탕으로 썼다. 논문 선택과 핵심 해석은 내 원문에서 출발했으며, GPT로 블로그에 맞게 구조와 표현을 재구성한 뒤 원문과 원 논문을 대조해 직접 검수했다. 연대기와 claim의 경계는 원 논문을 다시 대조해 보완했다.

## 먼저 분리할 세 가지
NAS는 보통 세 부분으로 나뉜다.

1. `search space`: 어떤 구조를 후보로 허용할 것인가
2. `search strategy`: 후보를 어떤 규칙으로 고를 것인가
3. `performance estimation`: 후보의 성능을 얼마나 싸고 공정하게 잴 것인가

초기 NAS의 계산량 문제를 모두 "탐색 알고리즘이 느렸다"라고만 설명하면 첫 번째 변화가 보이지 않는다. 실제로는 **네트워크를 표현하는 단위**가 먼저 크게 바뀌었다.

## 1. NAS-RL: 아키텍처를 sequence로 생성한다
NAS-RL은 RNN controller가 layer의 filter, stride, channel, skip connection을 action sequence로 생성하게 했다. 전체 네트워크를 $a_{1:T}$라는 가변 길이 결정으로 보고, 학습된 child network의 validation accuracy를 reward로 사용한다.

$$
J(\theta)=
\mathbb{E}_{a_{1:T}\sim\pi_\theta}
\left[R(a_{1:T})\right]
$$

정책 경사는 다음 형태로 추정할 수 있다.

$$
\nabla_\theta J(\theta)
\approx
\frac{1}{m}
\sum_{k=1}^{m}
\sum_{t=1}^{T}
\nabla_\theta \log \pi_\theta(a_t^{(k)}\mid a_{<t}^{(k)})
\left(R_k-b\right)
$$

이 방식은 variable-length architecture를 다룰 수 있지만, 후보마다 child network를 학습해야 한다. depth와 skip connection이 늘수록 action sequence와 후보 수도 함께 커진다.

## 2. NASNet: 전체 네트워크 대신 반복 가능한 cell을 찾는다
NASNet은 탐색 단위를 `whole network`에서 `cell`로 줄였다. cell은 feature map을 node로, operation과 연결을 edge로 갖는 DAG로 표현된다.

$$
G=(V,E), \qquad
x^{(j)}=\sum_{i<j}o^{(i,j)}\left(x^{(i)}\right)
$$

- $x^{(i)}$: $i$번째 node의 feature map
- $o^{(i,j)}$: node $i$에서 $j$로 가는 convolution, pooling, identity 같은 operation
- $i<j$: cycle을 만들지 않는 위상 순서

탐색은 보통 두 cell에 집중한다.

- `normal cell`: feature resolution을 유지한다
- `reduction cell`: spatial resolution을 줄인다

찾은 cell을 여러 번 반복하면 더 깊은 네트워크를 만들 수 있다. CIFAR에서 찾은 cell을 ImageNet 규모로 옮기기도 쉬워졌다. 즉, 좋은 전체 네트워크 하나보다 **재사용 가능한 미시 구조**를 찾는 문제로 바뀐 것이다.

## 3. PNAS: cell도 한 번에 다 찾지 않는다
PNAS는 작은 cell에서 시작해 block을 하나씩 늘린다. 모든 후보를 끝까지 학습하지 않고, 이미 평가한 cell로 predictor를 학습해 다음 단계의 유망 후보만 남긴다.

$$
\hat{f}(a)=\text{Predictor}(a)
$$

여기서 $\hat{f}(a)$는 architecture $a$의 실제 성능 $f(a)$를 대신하는 surrogate다. 탐색 공간을 줄였지만 predictor의 ranking이 틀리면 좋은 후보를 일찍 버릴 수 있다.

## DAG와 가중치 공유는 같은 말이 아니다
여기서 가장 중요한 구분이 있다.

> cell을 DAG로 표현했다고 해서 가중치가 자동으로 공유되지는 않는다.

NASNet도 cell을 DAG로 표현했지만 후보 network를 각각 학습했다. 가중치 공유가 가능해진 직접적인 장치는 이후 ENAS처럼 **여러 후보를 하나의 over-parameterized DAG에 subgraph로 포함하고, 같은 edge operation의 parameter를 재사용하는 supernet**이다.

정리하면 다음과 같다.

| 변화 | 얻은 것 | 아직 남은 문제 |
|---|---|---|
| whole network → sequence | 가변 구조 생성 | 후보별 학습 비용 |
| sequence → cell DAG | 반복·전이 가능한 탐색 단위 | 후보별 학습 비용 |
| cell predictor | progressive pruning | predictor ranking error |
| supernet DAG | 후보 사이 weight sharing | 간섭과 순위 편향 |

## 한계와 다음 아이디어
cell search는 탐색 공간을 줄이는 대신 macro architecture를 사람이 고정한다. 동일 cell의 반복이 모든 task에서 최선이라는 보장도 없다. 다음 단계에서는 micro cell과 network-level topology를 함께 탐색하되, 후보 수가 다시 폭발하지 않도록 hierarchical search나 multi-fidelity evaluation을 결합할 수 있다.

무엇보다 search space의 편향을 알고리즘의 성능으로 오해하지 않아야 한다. 같은 탐색 전략도 어떤 DAG와 operation set을 허용했는지에 따라 전혀 다른 결과를 낸다.

## 참고자료
- [Neural Architecture Search with Reinforcement Learning](https://arxiv.org/abs/1611.01578)
- [Learning Transferable Architectures for Scalable Image Recognition](https://arxiv.org/abs/1707.07012)
- [Progressive Neural Architecture Search](https://arxiv.org/abs/1712.00559)
