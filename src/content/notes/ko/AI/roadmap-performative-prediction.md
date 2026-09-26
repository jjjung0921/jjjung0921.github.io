---
title: "[Stage 2] 모델이 결정하면 사람이 달라진다: Performative Prediction"
lang: "ko"
translationKey: "roadmap-performative-prediction"
date: "2026-09-24"
field: "ai"
category: "Research Roadmap"
series: "Research Roadmap"
order: 3
status: "draft"
summary: "개인에게 맞추는 모델이 결정을 내리면 그 결정이 사람의 데이터를 바꾼다. 고정 분포 가정이 무너진 자리를 Performative Prediction은 분포 사상 D(θ)로 쓰고, 사람에게는 합리성이 아니라 ε-sensitivity만 요구한다."
problem: "MAML은 개인의 데이터 분포를 고정으로 두지만, 모델이 난이도나 추천 같은 결정을 내리면 그 결정이 배우려던 데이터를 바꾼다."
coreIdea: "상호작용에는 두 방향이 있다. 모델이 사람에게 맞춰 가는 적응(meta-learning)과 사람의 데이터가 모델의 결정을 따라 움직이는 반응(PP). PP는 반응을 θ ↦ D(θ)로 쓰고, 결정이 조금 바뀌면 반응 분포도 조금만 바뀐다는 가정만 둔다."
connection: "DDA에서는 난이도 정책이 플레이 로그의 분포를 바꾸는 전형적 performative 상황이다. 두 방향이 따로 있는 두 도구를 한 문제로 쓰는 일은 Stage 3(bi-level)으로 넘어간다."
tags: ["research-roadmap", "performative-prediction", "distribution-shift", "personalization", "dda"]
---

# 모델이 결정하면 사람이 달라진다

[튜토리얼](/notes/roadmap-tutorial-personal-agentic-model/)에서 세운 목적은 이것이었다. **사용자 한 명에게 맞춰 가는 agentic model을 만든다.** 이번 스테이지는 결정과 그 결정이 바꾼 반응을 맡는다.

> 개인에게 맞추는 모델이 상호작용 안에 놓이면 무엇이 깨지는가?

## 0. Stage 1이 남긴 것: 움직이는 것은 모델뿐이었다

[Stage 1](/notes/roadmap-personal-model-and-maml/)의 MAML에서 개인의 데이터는 고정되어 있었다. 모델이 적응할 뿐 사람은 그대로다.

그런데 우리 모델은 결정을 내린다. 게임이라면 다음 스테이지의 난이도를 고른다. 같은 플레이어라도 난이도가 바뀌면 대응이 달라질 수 있다. 예를 들어 어려운 상대 앞에서는 더 오래 고민하거나 다른 수를 고를 수 있다. 모델이 관측하는 한 사람의 반응은 모델 자신이 내린 결정에 따라 달라진다.

## 1. 고정 분포 가정: 결정이 데이터를 바꾸면 무엇이 무효가 되는가

지도학습은 데이터 $Z$가 고정된 분포 $\mathcal{D}$를 따른다고 가정한다. 모델의 결정이 사람을 바꾸는 순간 이 가정은 무효이다. 분포가 모델 파라미터의 함수가 되기 때문이다. 이 상황을 다루는 틀이 **Performative Prediction**(PP)이다. 가정이 무너지는 과정은 [Performative Prediction: 변화를 예측하다.](/notes/performative-prediction/)에서 따라갔다. 여기서는 정의만 가져온다.

> [!info] 분포 사상(distribution map)
> 모델 $\theta$를 배포했을 때 관측되는 데이터의 분포를 돌려주는 함수 $\theta\mapsto\mathcal{D}(\theta)$.

분포가 움직이면 "좋은 모델"의 뜻도 둘로 갈린다.

$$
\theta_{\text{PS}}\in\operatorname*{arg\,min}_\theta\ \mathbb{E}_{Z\sim\mathcal{D}(\theta_{\text{PS}})}\,\ell(Z;\theta),
\qquad
\theta_{\text{PO}}\in\operatorname*{arg\,min}_\theta\ \mathbb{E}_{Z\sim\mathcal{D}(\theta)}\,\ell(Z;\theta)
\qquad (1)
$$

**Performative stability**(PS)는 고정점이다. 자기가 만든 분포에서 다시 학습해도 같은 모델이 나온다. **Performative optimality**(PO)는 모델–환경 쌍 가운데 손실이 가장 작은 점이다. 둘은 일반적으로 다르다.

## 2. 상호작용의 두 방향: 누가 움직이는가

Stage 1과 나란히 놓아 보자.

```text
          적응 · meta-learning (Stage 1)
  모델 θ ──────────────────────────▶ 사람
         ◀────────────────────────── Z ~ D(θ)
          반응 · PP (Stage 2)
```

| 방향 | 움직이는 것 | 다루지 않는 것 | 도구 |
|---|---|---|---|
| 모델 → 사람 | 모델이 사람에게 맞춰 간다 | 결정이 사람을 바꾸는 효과 | meta-learning |
| 사람 → 모델 | 사람의 데이터가 결정을 따라 움직인다 | 개인별 빠른 적응 | PP |

그렇다면 PP는 사람에 대해 무엇을 가정할까? 합리성이 아니라 **$\varepsilon$-sensitivity** 하나다.

$$
W_1\big(\mathcal{D}(\theta),\mathcal{D}(\theta')\big)\le\varepsilon\,\lVert\theta-\theta'\rVert_2
\qquad (2)
$$

결정을 조금 바꾸면 반응의 분포도 조금만 바뀐다는 뜻이다. 사람이 어떻게 반응하는지는, 최적이든 아니든, 전부 $\mathcal{D}(\theta)$ 안에 있다. 재학습이 $\theta_{\text{PS}}$로 수렴하는 조건 $\varepsilon<\gamma/\beta$도 이 $\varepsilon$ 위에 선다($\gamma$-강볼록, $\beta$-매끄러운 손실). 분포가 도망가는 속도가 최적화가 당기는 속도보다 느리면 된다.

> [!warning] 합리성 가정은 PP 전체의 가정이 아니다
> 사용자가 비용 대비 효용을 최대화하도록 특징을 바꾼다(best response)는 가정은 strategic classification의 분포 사상에만 있다.

DDA로 옮기면 $\theta$는 난이도 정책, $\mathcal{D}(\theta)$는 그 난이도 아래에서 한 플레이어가 남기는 로그의 분포다. 난이도를 바꾸면 같은 플레이어의 반응 분포가 바뀐다. 전형적인 performative 상황이다. 실력이 시간에 따라 느는 효과는 이와 층위가 다르다. stateful PP라는 틀이 이런 효과를 담는다. Brown et al.(2022)은 다음 분포가 현재 결정뿐 아니라 직전 분포에도 의존하도록 전이 사상 $d_t=\mathrm{Tr}(d_{t-1};\theta_t)$를 둔다.

> [!interpretation] 내 해석
> [Stage 1](/notes/roadmap-personal-model-and-maml/)에서는 사람 한 명을 고정된 데이터 분포 $\mathcal{D}_i$로 봤다. 그런데 같은 플레이어의 대응이 난이도에 따라 달라진다면 분포 하나로는 그 사람을 담을 수 없다. 그 사람은 결정을 받아 분포를 돌려주는 함수 $\theta\mapsto\mathcal{D}_i(\theta)$다. 개인화 모델은 그 사람이 남긴 데이터보다 그 사람이 결정에 반응하는 방식을 배워야 한다. 이렇게 보면 "개인 = task"는 "개인 = 분포 사상"이 된다. 어떤 사람들을 한 분포로 묶을지(Stage 5(예정))도 어떤 분포 사상들을 묶을지의 문제다.

PP를 찾게 된 것은 DDA 때문이었다. 게임에서 난이도는 모델의 output이고 그 output에 따라 사용자의 input과 response가 달라진다. 이 문제를 이미 다루는 분야가 있는지 찾다가 PP를 만났다.

## 3. 정리 — 무엇을 답했고 무엇이 남았는가

지금까지의 내용을 짧게 정리하자.

> 모델의 결정이 사람의 데이터를 바꾸면 고정 분포 가정은 무효이다. PP는 그 결합을 분포 사상 $\mathcal{D}(\theta)$로 쓰고 사람에게 $\varepsilon$-sensitivity만 요구한다.

### 남은 문제 1: 두 도구가 한 방향씩 따로 있다

MAML은 사람을 고정하고 모델을 움직인다. PP는 사람이 움직이는 것을 다루지만 개인별 빠른 적응이 없다. agentic model에서는 두 방향이 한 고리 안에 있다. 둘을 한 문제로 쓸 수 있을까?

### 남은 문제 2: 도달한 곳과 원하는 곳

재학습이 데려다주는 곳은 $\theta_{\text{PS}}$, 원하는 곳은 $\theta_{\text{PO}}$다. 둘의 거리는 Performative Prediction 시리즈에서 잇는다. stateful 설정에서도 이 거리에는 상한이 있다. 최적을 고정점 분포에서 잰 장기 손실로 정의하면 $\lVert\theta_{\text{OPT}}-\theta_{\text{S}}\rVert_2\le 2L_z\varepsilon/\big(\gamma(1-\varepsilon)\big)$이다(Brown et al. 2022, Theorem 6). partially performative 설정(Lee & Zrnic 2026)에서는 모델이 만든 이동에 외생적 drift가 섞인다. 이 설정에서는 고정점 대신 시간에 따라 움직이는 stable·optimal 점을 얼마나 잘 따라가는지(regret)를 본다.

다음 스테이지에서는 남은 문제 1을 들고 MAML과 PP를 같은 언어로 다시 써 본다.

## 연결

- 관련 프로젝트: [범용 staged-DDA](/projects/dda-blackjack/)
- 다음에 확인할 질문: 적응과 반응을 한 문제로 쓸 수 있는가? → [Stage 3 — 두 문제는 같은 모양이다](/notes/roadmap-bilevel-common-form/)
