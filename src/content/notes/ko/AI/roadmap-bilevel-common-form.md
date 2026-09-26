---
title: "[Stage 3] 두 문제는 같은 모양이다: bi-level optimization"
lang: "ko"
translationKey: "roadmap-bilevel-common-form"
date: "2026-09-26"
field: "ai"
category: "Research Roadmap"
series: "Research Roadmap"
order: 4
status: "draft"
summary: "MAML의 적응과 PP의 반응은 방향이 반대지만, 둘 다 상위 결정이 하위 해를 거쳐 목적에 돌아오는 bi-level의 모양으로 쓸 수 있다. 같은 모양이면 hypergradient와 IFT라는 같은 도구를 쓴다."
problem: "MAML은 모델이 사람에게 맞춰 가는 방향만, PP는 사람이 결정에 반응하는 방향만 다룬다. 두 도구를 따로 쓰면 agentic model의 고리가 끊긴다."
coreIdea: "MAML은 하위 문제(개인별 적응)를 몇 걸음에서 끊은 bi-level이다. PP는 PO가 Stackelberg 균형이고 Stackelberg가 bi-level의 게임 표현이라는 사실을 거쳐 같은 언어에 들어온다. 우리 문제는 상위 변수(난이도 정책)가 하위 데이터 분포로 들어가는 bi-level이다."
connection: "hypergradient·IFT는 Optimization Foundations의 Jacobian·Hessian 글과 이어지고, HPO에서 쓰는 bi-level 언어와 겹친다. 모양이 같다고 풀린 것은 아니므로 가능성을 보일 실험장(Stage 4)이 필요하다."
tags: ["research-roadmap", "bi-level-optimization", "maml", "performative-prediction", "hypergradient"]
---

# 두 문제는 같은 모양이다

[튜토리얼](/notes/roadmap-tutorial-personal-agentic-model/)에서 목적을 이렇게 세웠다. **사용자 한 명에게 맞춰 가는 agentic model을 만든다.** 이번 스테이지는 세 동사를 한 고리로 묶는다.

> MAML과 PP를 한 언어로 쓸 수 있는가?

## 0. Stage 2가 남긴 것: 따로 있는 두 도구

두 도구는 반대쪽을 본다. MAML이 모델을 움직였다면 [Stage 2](/notes/roadmap-performative-prediction/)의 PP는 사람을 움직였다. 둘을 잇는 언어가 bi-level optimization이다.

## 1. Bi-level optimization: 문제 안에 문제가 있다

> [!info] Bi-level optimization
> 상위 목적이 하위 문제의 해 $w^*(\lambda)$를 거쳐서만 상위 변수 $\lambda$에 닿는 최적화. $w^*(\lambda)$가 두 층을 잇는 결합 변수다.

$$
\min_{\lambda}\ F\big(\lambda,w^*(\lambda)\big)
\quad\text{s.t.}\quad
w^*(\lambda)\in\operatorname*{arg\,min}_{w}\ G(\lambda,w)
\qquad (1)
$$

Franceschi et al.(2018)은 HPO와 meta-learning을 이 형식 하나로 묶고 하위 문제를 $T$ 걸음의 경사하강으로 근사한 뒤 reverse-mode 미분으로 hypergradient를 계산한다.

## 2. 두 도구를 bi-level로 다시 쓰기

### 2.1 MAML: 한 걸음에서 끊은 하위 문제

MAML은 이미 이 모양이다. 하위는 개인별 적응 $\phi_i=\theta-\alpha\nabla_\theta\mathcal{L}_i(\theta)$, 상위는 적응 뒤의 손실이다([Stage 1](/notes/roadmap-personal-model-and-maml/) 식 (2)). 하위를 한 걸음에서 끊으므로 $\phi_i$가 $\theta$의 명시적인 식이 되고 결합의 미분 $I-\alpha H_i$를 바로 쓴다(B1(예정), Jacobian과 Hessian(예정)).

### 2.2 PP: Stackelberg를 거쳐서

PO는 Stackelberg 균형이다([Performative Prediction](/notes/performative-prediction/) 2.2절). Stackelberg 게임에서는 리더가 먼저 결정하고 팔로워가 최적 반응한다. 이때 리더의 문제는 $\min_{x_1}\{f_1(x_1,x_2)\mid x_2\in\arg\min_y f_2(x_1,y)\}$로 식 (1)과 같은 bi-level 꼴이다(Fiez et al. 2020). Lu(ICML 2023)는 상위 분포가 하위 해에, 하위 분포가 상위 변수에 의존하는 bilevel을 명시적으로 썼다. 두 분포 사상의 민감도가 충분히 작으면 유일한 bilevel performatively stable 점이 있고 재학습이 그 점으로 수렴한다.

> [!warning] "PP 자체가 bi-level"은 아니다
> PS는 고정점이고 bi-level과 이어지는 것은 PO다. 팔로워를 사람으로 읽으면 사람의 최적 반응이 가정된다. 우리의 하위 $\arg\min$은 플레이어 모델(추정기)의 것이다.

## 3. 같은 모양: 상위 변수는 어디로 들어가는가

| | 상위 변수 | 하위 변수 | 상위가 들어가는 곳 |
|---|---|---|---|
| HPO | 하이퍼파라미터 $\lambda$ | 가중치 $w$ | 하위 손실 |
| NAS (DARTS) | 구조 $\alpha$ | 가중치 $w$ | 하위 손실 (mixed operation) |
| MAML | 공유 출발점 $\theta$ | 개인별 적응 $\phi_i$ | 적응의 출발점 |
| PP | 리더의 결정 $\theta$ | 팔로워의 반응 | 데이터 분포 $\mathcal{D}(\theta)$ |
| 우리 문제 | 난이도 정책 $\psi$ | 플레이어 모델 $\phi$ | 데이터 분포 $\mathcal{D}(\psi)$ |

마지막 줄을 식으로 쓰면

$$
\phi^*(\psi)\in\operatorname*{arg\,min}_\phi\ \mathcal{L}_{\text{player}}\big(\phi;\mathcal{D}(\psi)\big),
\qquad
\psi^*\in\operatorname*{arg\,min}_\psi\ \mathcal{L}_{\text{DDA}}\big(\psi;\phi^*(\psi)\big)
\qquad (2)
$$

하위는 "모델이 그 사람의 로그에 가장 잘 맞는다"는 뜻이다. 사람의 행동은 전부 $\mathcal{D}(\psi)$에 있다. 이 하위를 새 플레이어에게 빨리 푸는 일은 Stage 1에서 다룬다.

## 4. 왜 이 언어인가: 같은 모양, 같은 도구

상위 변수로 미분한 기울기 **hypergradient** $dF/d\lambda$는 결합 변수의 미분 $dw^*/d\lambda$를 거쳐 흐르고 그 미분은 하위 최적성 조건 $\partial_wG=0$에 **음함수 정리**(IFT)를 적용해 얻는다.

$$
\frac{dw^*}{d\lambda}=-\big[\partial^2_{ww}G\big]^{-1}\partial^2_{w\lambda}G
\qquad (3)
$$

MAML은 하위를 끊어 역행렬을 피했지만 끝까지 푸는 bi-level은 $H^{-1}v$를 구해야 한다. 이 언어는 AutoML·HPO 연구의 밑바탕이기도 하다. 예를 들어 Lee et al.(ICLR 2022)은 hypergradient의 2차 항 전체를 JVP 하나로 distill해 meta-learning의 고차원 hyperparameter를 학습 도중 온라인으로 최적화한다.

> [!interpretation] 내 해석
> 표의 마지막 열을 다시 보면 HPO·DARTS에서는 상위 변수가 하위 손실에, MAML에서는 적응의 출발점에 들어간다. 그래서 식 (3)의 교차항 $\partial^2_{w\lambda}G$를 손실식이나 적응식에서 바로 미분해 얻는다. PP와 우리 문제에서는 상위 변수가 데이터 분포로 들어간다. 같은 교차항을 얻으려면 식이 아니라 데이터가 생성되는 과정 $\mathcal{D}(\psi)$를 미분해야 한다. 같은 언어를 쓰더라도 내가 새로 풀어야 할 곳은 이 한 칸이다.

NAS에서 이 언어를 처음 또렷하게 봤다. DARTS는 구조 $\alpha$를 validation loss로, 가중치 $w$를 training loss로 나눠 푸는 bi-level이고([DARTS의 수학](/notes/nas-darts-bilevel-relaxation/)), NAO는 구조를 연속 공간으로 옮겨 gradient로 움직였다([NAO](/notes/nas-nao-continuous-embedding/)). 표의 NAS 줄이 그 자리인데 NAS를 떠난 뒤에도 이 언어는 남았다.

## 5. 정리 — 무엇을 답했고 무엇이 남았는가

한 문장으로 줄이면 이렇다.

> MAML의 적응과 PP의 반응은 상위 결정이 하위 해를 거쳐 돌아오는 bi-level로 함께 쓸 수 있고 그러면 hypergradient·IFT라는 같은 도구를 쓴다.

### 남은 문제: 모양이 같다고 풀린 것은 아니다

표의 첫 줄과 끝 줄은 다르다. HPO에서는 $\lambda$가 하위 손실에 들어가 교차항 $\partial^2_{w\lambda}G$가 손실의 식에서 나온다. 우리 문제에서는 $\psi$가 분포를 거쳐 들어오므로 $d\phi^*/d\psi$에 데이터 생성 과정의 미분이 필요하다. $\varepsilon$의 크기와 개인화의 이득도 식으로는 모른다. 실험장이 필요하다.

다음 스테이지에서는 결정과 반응이 관측되는 실험장 staged-dda를 살펴본다.

## 연결

- 관련 프로젝트: [범용 staged-DDA](/projects/dda-blackjack/), 식 (2)의 전개는 Personalization as Optimization(예정)
- 다음에 확인할 질문: 식 (2)를 어디서 시험할 것인가? → Stage 4(예정)
