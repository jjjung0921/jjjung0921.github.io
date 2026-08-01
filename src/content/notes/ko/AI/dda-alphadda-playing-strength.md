---
title: "강한 AlphaZero를 사람 파트너 수준으로 낮출 수 있을까?"
lang: "ko"
translationKey: "dda-alphadda-playing-strength"
date: "2026-07-30"
field: "ai"
category: "Dynamic Difficulty Adjustment"
series: "DDA Paper Review"
order: 6
status: "reading"
summary: "AlphaDDA는 fully trained AlphaZero의 board-state value를 이용해 simulation count, dropout probability, 또는 UCT score를 조절한다. 즉, 강한 AI를 새로 학습하지 않고도 사람과 맞는 강도로 낮추는 가장 직접적인 DDA baseline을 보여준다."
problem: "fully trained AlphaZero는 대부분의 human player에게 너무 강해서 training partner로 쓰기 어렵고, 그렇다고 처음부터 약한 AI를 다시 학습하는 것도 비효율적이다."
coreIdea: "평활화한 board-state value를 보고 MCTS search budget이나 network reliability를 줄이거나 늘려 AI playing strength를 조절한다."
connection: "내 bi-level DDA에서는 이 논문의 value-based strength knob를 opponent policy의 일부로 참고하되, 실제 목표는 player model 기반의 target experience 최적화로 옮겨야 한다."
tags: ["alphazero", "mcts", "board-game", "strength-balancing", "dropout"]
---

# 강한 AlphaZero를 사람 파트너 수준으로 낮출 수 있을까?

## 작성 배경
이 글은 내가 Notion에 작성한 [AlphaDDA 리뷰](https://app.notion.com/p/37afb10f650180c086d1e1a16e4cbb0a)를 바탕으로 썼다. 논문 선택과 핵심 해석은 내 원문에서 출발했으며, GPT로 블로그에 맞게 구조와 표현을 재구성한 뒤 원문과 원 논문을 대조해 직접 검수했다. 세 가지 강도 조절 방식과 실험 한계는 원 논문을 다시 대조해 보완했다.

## 문제 제기
강한 보드게임 AI는 언제나 좋은 training partner가 아니다.
너무 강하면 human player가 금방 지고, 너무 약하면 연습 상대가 되지 않는다.

이 논문은 "그렇다면 강한 AlphaZero를 그대로 두고, 강도만 조절할 수 없을까?"라는 질문에서 시작한다.

## 핵심 아이디어
### 논문에서 말하는 것
AlphaDDA는 새 AI를 학습하는 방식이 아니다.
fully trained AlphaZero를 그대로 쓰되, 현재 board state value에 따라 strength를 조절한다.

조절 방법은 세 가지다.

- AlphaDDA1: MCTS simulation count를 조절한다
- AlphaDDA2: dropout probability를 조절한다
- AlphaDDA3: UCT score를 수정한다

### 내 해석
이 논문의 장점은 knob가 매우 명확하다는 점이다.
하지만 반대로 말하면, 이 논문은 아직 개인화 DDA가 아니다.

- player preference는 없다
- player model도 없다
- win/loss/draw를 넘는 PX objective도 없다

즉, "강한 AI를 약하게 만드는 법"은 보여주지만, "누구에게 어떤 강도로 맞출지"는 보여주지 않는다.

## 방법
논문은 최근 value estimate를 부드럽게 평균낸 $\bar v_n$을 strength signal로 쓴다.

$$
\bar{v}_n = \frac{1}{N_h}\sum_{i=0}^{N_h-1} v_{n-i}
$$

그다음 각 variant가 이 signal을 다른 방식으로 사용한다.

### AlphaDDA1

$$
N_{sim}(\bar{v}_n)=\left\lceil 10^{-A_{sim}(\bar{v}_n c_{AlphaDDA}+B_{sim0})}\right\rceil
$$

이 방식은 유리할수록 search를 줄여 strength를 낮춘다.

### AlphaDDA2

$$
P_{drop}(\bar{v}_n)=A_{drop}(\bar{v}_n+P_{drop0})
$$

dropout을 높여 network output reliability를 의도적으로 낮춘다.

### AlphaDDA3

$$
U(s_t,a)=\frac{W(s_t,a)}{N(s_t)}+C\sqrt{\frac{2\ln(N(s_t)+1)}{n(s_t,a)+1}}
$$

$$
W(s_t,a) \leftarrow W(s_t,a)-\left|v(s_t)+\bar{v}_n c(s_t,a)c_{AlphaDDA}\right|
$$

내가 이 구조를 읽을 때 느낀 점은 단순하다.

- AlphaDDA1과 2는 strength를 조절하는 knob가 분명하다
- AlphaDDA3는 너무 공격적으로 value를 뒤틀어서 약해질 수 있다

## 실험 / 결과
논문은 Connect4, 6x6 Othello, Othello에서 AI-vs-AI 평가를 수행했다.

- metric은 Elo, win rate, loss rate, draw rate였다
- AlphaDDA1과 AlphaDDA2는 대부분의 non-random AI에 대해 strength adjustment가 가능했다
- AlphaDDA3는 Random에는 맞출 수 있지만, 다른 opponent에는 너무 약한 편이었다
- human user study는 없었다

내가 이 결과를 읽을 때 가장 중요하게 보는 점은 이것이다.

> 이 논문은 "AI를 사람 수준으로 맞춘다"는 주장보다, "강한 AI를 약화시키는 knob가 실제로 작동한다"는 사실을 보여준다.

## 한계
이 논문은 깔끔하지만, 한계도 분명하다.

- 명시적 player model이 없다
  - opponent history나 preference를 학습하지 않는다
- human PX 평가가 없다
  - win-loss-draw가 사람 경험을 직접 대변하지 않는다
- lower bound가 제한적이다
  - Random 수준까지도 못 내려가는 경우가 있다
- board-state value에 강하게 의존한다
  - hidden information이나 stochastic game에는 바로 옮기기 어렵다

## 내 DDA·bi-level 연구와의 연결
내 연구에서 이 논문이 주는 힌트는 분명하다.

- value head를 difficulty proxy로 쓸 수 있다
- search budget, dropout, policy temperature 같은 knob는 실용적이다
- 강한 policy를 다시 학습하지 않고도 조절할 수 있다

하지만 내 연구는 여기서 멈추면 안 된다.

- lower-level에는 player model이 필요하고
- upper-level에는 target difficulty와 subjective experience가 필요하며
- fairness와 progression constraint가 있어야 한다

그래서 AlphaDDA는 내 연구의 좋은 baseline이지만, 최종 목표는 아니다.

## 참고자료
- [AlphaDDA: Strategies for Adjusting the Playing Strength of a Fully Trained AlphaZero System to a Suitable Human Training Partner](https://arxiv.org/pdf/2111.06266)
