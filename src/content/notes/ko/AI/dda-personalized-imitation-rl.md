---
title: "플레이어를 모방한 뒤 이기게 하면 개인화 DDA가 될까?"
lang: "ko"
translationKey: "dda-personalized-imitation-rl"
date: "2026-07-30"
field: "ai"
category: "Dynamic Difficulty Adjustment"
series: "DDA Paper Review"
order: 3
status: "reading"
summary: "이 논문은 플레이어 행동을 imitation agent로 근사하고, 그 proxy를 이기도록 RL opponent를 학습하는 방식으로 개인화 DDA를 시도한다. 다만 목적함수는 아직 HP 중심에 가깝고, 진짜 개인화를 보장하려면 더 선명한 upper-level objective가 필요하다."
problem: "정적 난이도나 단순 규칙 기반 opponent는 플레이어의 현재 행동과 숙련도 변화에 맞지 않아, frustration과 boredom을 동시에 낳을 수 있다."
coreIdea: "현재 player behavior를 imitation learning agent로 복제하고, 그 proxy를 상대하는 RL agent를 학습해 일정 간격마다 실제 opponent로 교체한다."
connection: "내 bi-level DDA에서는 이 논문의 imitation proxy를 lower-level player model의 출발점으로 삼되, upper-level에는 target difficulty와 subjective experience를 분리해 넣는 편이 맞다."
tags: ["imitation-learning", "reinforcement-learning", "personalization", "fightingice", "concept-drift"]
---

# 플레이어를 모방한 뒤 이기게 하면 개인화 DDA가 될까?

## 작성 배경
이 글은 내가 Notion에 작성한 [Personalized DDA 리뷰](https://app.notion.com/p/374fb10f65018061a4cdc77dc2603afa)를 바탕으로 썼다. 논문 선택과 핵심 해석은 내 원문에서 출발했으며, GPT로 블로그에 맞게 구조와 표현을 재구성한 뒤 원문과 원 논문을 대조해 직접 검수했다. 실험 결과와 연구 한계는 원 논문을 다시 대조해 보완했다.

## 문제 제기
기존 DDA는 대개 static difficulty나 hand-crafted rule에 기대기 쉽다.
그런 방식은 beginner에게는 너무 어렵고, 숙련자에게는 너무 쉽다.

이 논문은 여기서 한 걸음 더 나아가, "플레이어를 직접 흉내 내는 proxy를 만들면 개인화가 더 쉬워지지 않을까?"라고 묻는다.

## 핵심 아이디어
### 논문에서 말하는 것
논문의 구조는 세 단계다.

1. 현재 플레이어의 행동을 관찰한다
2. imitation learning agent가 그 행동을 복제하도록 학습한다
3. RL agent가 imitation agent를 상대하도록 학습하고, 이 RL agent가 실제 opponent를 대체한다

즉, 플레이어를 직접 상대하는 대신, 플레이어를 닮은 proxy를 상대하게 만들어 opponent를 갱신한다.

### 내 해석
이 논문의 가장 큰 장점은 "개인화 DDA를 위한 중간층"을 만들었다는 점이다.
하지만 지금 구조는 아직

- 플레이어 선호
- target difficulty
- flow 유지
- fairness

를 명시적으로 최적화하지는 않는다.
그래서 개인화의 가능성은 보이지만, 목적은 아직 충분히 선명하지 않다.

## 방법
논문은 FightingICE 환경에서 다음 파이프라인을 사용한다.

- adaptive random forest classifier로 imitation agent를 학습한다
- A2C로 RL opponent를 학습한다
- 일정 interval마다 RL opponent를 실제 opponent로 교체한다

논문 자체에는 명시적 bi-level 수식이 없다.
그래서 내 식으로 다시 쓰면 이렇게 정리할 수 있다.

$$
\phi^*(\psi) = \arg\min_{\phi}\mathcal{L}_{player}(\phi; \mathcal{D}_{play}(\psi))
$$

$$
\psi^* = \arg\min_{\psi}\mathcal{L}_{DDA}(\psi; \phi^*(\psi))
$$

여기서 중요한 점은 다음이다.

- lower-level은 player 행동을 근사하는 proxy model이다
- upper-level은 그 proxy를 기준으로 opponent policy를 고른다
- 하지만 논문은 아직 upper-level objective를 명시하지 않는다

이 부분이 바로 내가 보완하고 싶은 지점이다.

## 실험 / 결과
논문이 보고한 확인 가능한 결과는 비교적 분명하다.

- imitation learning agent의 training accuracy는 약 82~87%였다
- user study는 5명의 참가자로 진행됐다
- 각 참가자는 MCTS agent와 제안 agent를 상대로 각각 3번씩 플레이했다
- 평균 rating은 제안 agent가 $7.0 \pm 1.09$, MCTS가 $6.6 \pm 1.01$이었다

내가 이 결과를 읽을 때는 두 가지를 같이 본다.

1. 작지만 실제 player study를 넣었다는 점
2. 아직 preliminary 수준이라 일반화하기에는 충분하지 않다는 점

## 한계
이 논문은 개인화 DDA의 방향을 보여주지만, 그대로 내 연구의 정답이 되지는 않는다.

- reward가 HP 중심에 가깝다
  - player experience를 직접 최적화한다고 보기 어렵다
- proxy mismatch가 생길 수 있다
  - imitation agent가 player의 장기 전략이나 선호를 다 반영하지 못하면 RL opponent가 proxy만 exploit할 수 있다
- 샘플 수가 작다
  - 5명 user study만으로 개인화 효과를 강하게 주장하기 어렵다
- bi-level 구조가 명시되지 않는다
  - lower-level과 upper-level의 의존 관계를 수식적으로 고정하지 않았다

## 내 DDA·bi-level 연구와의 연결
이 논문에서 내가 가져갈 수 있는 것은 세 가지다.

- player behavior를 lower-level proxy로 두는 아이디어
- background training 후 periodic replacement 하는 update 방식
- concept drift를 고려한 online player modeling

반대로 내가 추가해야 하는 것은 다음이다.

- target difficulty를 명시한 upper-level objective
- player preference와 flow를 포함한 experience model
- fairness와 progression constraint

즉, 이 논문은 "개인화 DDA의 구현 아이디어"로는 유용하지만, "내 연구의 최종 objective"로는 아직 부족하다.

## 참고자료
- [Personalized Dynamic Difficulty Adjustment – Imitation Learning Meets Reinforcement Learning](https://arxiv.org/pdf/2408.06818)
