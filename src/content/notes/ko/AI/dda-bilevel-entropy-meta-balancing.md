---
title: "메타를 엔트로피로 재면 무엇이 보일까?"
lang: "ko"
translationKey: "dda-bilevel-entropy-meta-balancing"
date: "2026-07-30"
field: "ai"
category: "Dynamic Difficulty Adjustment"
series: "DDA Paper Review"
order: 2
status: "reading"
summary: "BiGMB는 game meta를 고정된 승률 표가 아니라 equilibrium strategy의 entropy로 바라본다. 이 논문은 DDA를 개인화하지는 않지만, 내 연구에서 upper-level objective를 어떻게 정의해야 하는지 강한 힌트를 준다."
problem: "imbalanced meta에서는 소수의 strategy만 살아남기 때문에, designer가 다루는 objective를 단순 win rate가 아니라 equilibrium에서의 다양성으로 다시 정의할 필요가 있다."
coreIdea: "inner-level에서 MSNE를 근사하고, outer-level에서 그 mixed strategy entropy가 커지도록 meta parameter를 최적화한다."
connection: "내 bi-level DDA에서 entropy는 main objective가 아니라 auxiliary regularizer로 쓰는 편이 자연스럽고, lower-level에는 실제 player model을 두는 쪽이 더 맞다."
tags: ["game-meta", "entropy", "mechanism-design", "cma-es", "nash"]
---

# 메타를 엔트로피로 재면 무엇이 보일까?

## 작성 배경
이 글은 내가 Notion에 작성한 [Bilevel Entropy based Mechanism Design 리뷰](https://app.notion.com/p/374fb10f6501804c8721dc1b3daad34b)를 바탕으로 썼다. 논문 선택과 핵심 해석은 내 원문에서 출발했으며, GPT로 블로그에 맞게 구조와 표현을 재구성한 뒤 원문과 원 논문을 대조해 직접 검수했다. 수식의 역할과 한계는 원 논문을 다시 대조해 보완했다.

## 문제 제기
대부분의 게임에서 문제는 "어떤 전략이 제일 강한가"가 아니라 "어떤 전략만 계속 쓰이게 되는가"에 가깝다.
한두 개의 item, deck, strategy만 살아남는 meta는 플레이어 선택지를 좁히고, 결국 게임의 다양성을 줄인다.

이 논문은 이 문제를 game meta balancing으로 보고, 균형의 기준을 win rate가 아니라 strategy distribution의 entropy로 옮긴다.

## 핵심 아이디어
### 논문에서 말하는 것
논문의 핵심은 단순하다.

- inner-level에서 normal-form game의 mixed strategy Nash equilibrium을 근사한다
- outer-level에서 그 equilibrium strategy의 entropy를 최대화한다
- meta parameter $\theta$는 designer가 조절할 수 있는 knob다

즉, 목표는 "특정 전략이 강한 meta"가 아니라 "여러 전략이 살아 있는 meta"다.

### 내 해석
내가 보기에는 이 논문이 중요한 이유가 두 가지다.

1. game balance를 point estimate가 아니라 distributional diversity로 본다
2. outer-level optimization을 DDA와 같은 control 문제로 바꿀 수 있음을 보여준다

하지만 이 다양성은 곧바로 player experience와 동일하지는 않다.
그래서 이 논문은 내 연구에서 main objective라기보다, objective를 설계할 때 참고하는 한 축에 가깝다.

## 방법
논문의 구조는 `MSNE 근사 + entropy 최적화`다.

### 1. inner-level: Nash Monte-Carlo Learning
조합 전략 공간을 MDP처럼 보고, item selection을 순차적 decision problem으로 바꾼다.
그 다음 Monte-Carlo 방식으로 policy를 근사해 mixed strategy를 얻는다.

### 2. outer-level: CMA-ES
inner-level에서 얻은 equilibrium strategy distribution을 바탕으로, CMA-ES가 meta parameter를 탐색한다.
여기서는 gradient보다 black-box optimization이 더 잘 맞는다.

### 3. regularization
entropy만 최대화하면 designer intent가 사라질 수 있으므로, 초기 meta $\theta_0$에서 너무 멀어지지 않도록 penalty를 둔다.

이 논문의 핵심 수식은 다음처럼 볼 수 있다.

$$
\max_{\theta}\; \mathbb{E}_{\sigma_i^* \sim NFG2P_{\theta}}\left[H(\sigma_i^*)\right]
$$

$$
H(\sigma_i) = -\sum_{s \in S_i}\sigma_i(s)\log \sigma_i(s)
$$

$$
\max_{\theta}\; H(Y) - \|r \odot \theta - r \odot \theta_0\|_2
$$

내가 읽은 방식은 이렇다.

- `entropy`는 diversity를 밀어 올리는 힘이다
- `regularization`은 designer의 의도를 붙잡는 힘이다
- 둘 사이의 균형이 meta balance의 실제 목표다

## 실험 / 결과
논문은 RPSFW, Workshop Warfare, Pokemon VGC에서 평가했다.
핵심 결과만 압축하면 다음과 같다.

- 작은 strategy space에서는 ERG 기반 baseline과 비슷하거나 더 나은 entropy 성능을 보였다
- combinatorial space가 커질수록 BiGMB의 scaling 이점이 커졌다
- regularization이 너무 강하면 entropy가 떨어졌다

내가 중요하게 보는 포인트는 성능 숫자보다 구조다.

- 이 논문은 target payoff matrix를 직접 맞추지 않는다
- 대신 equilibrium에서의 diversity를 직접 최적화한다
- 그래서 DDA보다는 meta-level balancing에 더 가깝다

## 한계
이 논문은 분명 유용하지만, 내 연구에 그대로 가져오면 안 되는 부분도 분명하다.

- personalization이 없다
  - 특정 player의 preference나 affective state를 직접 모델링하지 않는다
- human study가 없다
  - entropy 증가가 실제 재미 증가로 이어지는지는 확인하지 않는다
- entropy는 다양성을 말해주지만 좋은 경험을 직접 보장하지 않는다
  - 다양해도 불공정하거나 피곤한 메타일 수 있다
- $\hat{P}(Y)=P(Y^1)$ 같은 근사는 heuristic이다
  - 계산량은 줄이지만 항상 성립한다고 보기 어렵다

## 내 DDA·bi-level 연구와의 연결
내 연구에서는 이 논문의 entropy를 그대로 목적함수로 두기보다, 다음처럼 배치하는 편이 자연스럽다.

- lower-level에는 player behavior model 또는 preference model을 둔다
- upper-level에는 target difficulty, flow, fairness, progression constraint를 둔다
- entropy는 auxiliary term으로 넣어 strategy collapse를 막는다

즉, BiGMB는 내 연구에서 "메타의 다양성을 어떻게 수학적으로 다룰지"를 보여주는 좋은 예시다.
다만 최종 목표는 다양성 자체가 아니라, 그 다양성이 player experience와 양립하도록 만드는 것이다.

## 참고자료
- [Bilevel Entropy based Mechanism Design for Balancing Meta in Video Games](https://www.ifaamas.org/Proceedings/aamas2023/pdfs/p2134.pdf)
