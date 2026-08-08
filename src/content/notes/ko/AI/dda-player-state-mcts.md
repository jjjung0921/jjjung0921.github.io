---
title: "플레이어 상태를 점수로 쓰면 MCTS는 달라질까?"
lang: "ko"
translationKey: "dda-player-state-mcts"
date: "2026-07-30"
field: "ai"
category: "Dynamic Difficulty Adjustment"
series: "DDA Paper Review"
order: 5
projects: ["staged-dda"]
status: "reading"
summary: "이 논문은 HP 차이 대신 Challenge, Competence, Valence, Flow를 예측하는 player state model을 MCTS score로 넣는다. 그래서 DDA의 기준을 game metric에서 player experience로 옮길 수 있다는 점을 비교적 선명하게 보여준다."
problem: "HP difference, score, win rate 같은 heuristic은 플레이어가 실제로 느끼는 도전감이나 몰입을 직접 설명하지 못한다."
coreIdea: "real log와 simulated log를 합쳐 player state를 예측하고, 그 예측 점수를 MCTS의 evaluation function으로 사용한다."
connection: "내 bi-level DDA에서는 이 논문의 player state predictor를 lower-level 경험 모델로 빌리고, upper-level에는 target difficulty와 fairness constraint를 별도로 두는 쪽이 더 자연스럽다."
tags: ["mcts", "player-state-model", "affective-state", "flow", "fightingice"]
---

# 플레이어 상태를 점수로 쓰면 MCTS는 달라질까?

## 작성 배경
이 글은 내가 Notion에 작성한 [Player State MCTS 리뷰](https://app.notion.com/p/37afb10f6501804f96b7ff251493afad)를 바탕으로 썼다. 논문 선택과 핵심 해석은 내 원문에서 출발했으며, GPT로 블로그에 맞게 구조와 표현을 재구성한 뒤 원문과 원 논문을 대조해 직접 검수했다. 모델 정확도와 사용자 실험의 의미는 원 논문을 다시 대조해 보완했다.

## 문제 제기
기존 DDA는 HP difference나 win rate 같은 숫자를 많이 쓴다.
하지만 숫자가 맞는다고 해서 경험이 맞는 것은 아니다.

이 논문은 여기서 출발해, "플레이어가 실제로 느끼는 상태를 예측 점수로 쓰면 MCTS가 더 경험 지향적으로 바뀌지 않을까?"라고 묻는다.

## 핵심 아이디어
### 논문에서 말하는 것
논문의 핵심은 player state model과 MCTS를 결합하는 것이다.

- real-played log와 MCTS simulated log를 합쳐 입력을 만든다
- 그 입력으로 Challenge, Competence, Valence, Flow를 예측한다
- 예측 점수를 MCTS node value로 쓴다

즉, MCTS가 최적화하는 대상이 "이기는 수"가 아니라 "원하는 플레이 상태를 만들 가능성이 높은 수"가 된다.

### 내 해석
이 논문이 강한 이유는 DDA의 목적을 꽤 직접적으로 바꿔 보여주기 때문이다.
다만 이 방식은 아직

- 개인별 preference
- hard flow constraint
- long-term adaptation

을 직접 다루지는 않는다.
그래서 state-aware DDA에는 가깝지만, 완성된 personalized DDA는 아니다.

## 방법
### 입력과 모델
논문은 5초 길이의 game log를 사용한다.

- 4.5초의 real-played log
- 0.5초의 MCTS simulated log

FightingICE가 60fps이므로 feature를 모두 쓰면 너무 무겁다.
그래서 15 frame 간격으로 sampling해 실시간성을 맞춘다.

### MCTS score
기존 MCTS-DDA는 HP difference를 score로 썼다.
이 논문은 그 자리를 player state prediction score로 바꾼다.

기본 UCB1은 다음과 같다.

$$
UCB1_i = v_i + C\sqrt{\frac{2\ln N}{n_i}}
$$

내가 이걸 읽으면서 정리한 해석은 다음과 같다.

$$
score_q(\tau) = P_\phi^q(y_q = 1 \mid I_p \oplus I_s)
$$

여기서 이 식은 논문을 내가 다시 쓴 것이다.

- $I_p$: 실제 플레이 로그
- $I_s$: MCTS가 만든 짧은 미래 로그
- $P_\phi^q$: target state $q$를 예측하는 player state model
- $score_q(\tau)$: 그 trajectory가 target state를 유도할 가능성

즉, MCTS는 "어떤 수가 더 이기나"가 아니라 "어떤 수가 target state를 더 잘 유도하나"를 본다.

## 실험 / 결과
논문은 FightingICE에서 다음을 확인했다.

- player state model은 43명, 688개 game log로 학습했다
- user study는 20명으로 진행했다
- model accuracy는 Challenge 71.5%, Competence 69.4%, Valence 68.4%, Flow 73.1%였다
- CO, VA, FL agent는 HP baseline보다 더 좋은 subjective experience를 보였다
- CH agent는 유의한 개선을 보이지 못했다

내가 이 결과를 읽을 때의 포인트는 두 가지다.

1. player-state-aware DDA가 실제 user study로 이어졌다는 점
2. 모든 target state가 자동으로 좋은 DDA objective는 아니라는 점

## 한계
이 논문은 DDA를 경험 중심으로 옮겼지만, 한계도 분명하다.

- Flow를 hard constraint로 두지 않는다
  - target state를 선호하는 soft objective에 가깝다
- label이 post-game GEQ 기반이다
  - moment-level affective state는 아니다
- 개인별 preference model은 아니다
  - 현재 로그를 사용하지만 장기 personalization은 약하다
- state model 정확도가 완벽하지 않다
  - score 자체가 noisy할 수 있다

## 내 DDA·bi-level 연구와의 연결
이 논문은 내 연구에 가장 직접적으로 연결되는 편이다.

- lower-level player model의 역할을 이미 보여준다
- MCTS에 experience model을 넣는 방식은 objective portability의 예시다
- user study를 통해 PX를 평가해야 한다는 점도 분명하다

내가 여기서 더하고 싶은 것은 다음이다.

- skill과 difficulty를 분리한 explicit upper-level objective
- fairness와 progression constraint
- 개인별 preference trajectory

즉, 이 논문은 `player-state-aware DDA`의 좋은 기준점이고, 내 연구는 여기서 한 단계 더 나아가 `bi-level personalized DDA`로 가는 쪽이다.

## 참고자료
- [Diversifying Dynamic Difficulty Adjustment Agent by Integrating Player State Models into Monte-Carlo Tree Search](https://cilab.gist.ac.kr/hp/wp-content/uploads/publications/international_journal/2022/ESWA_DDA.pdf)
