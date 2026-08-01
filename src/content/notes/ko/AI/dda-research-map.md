---
title: "DDA 논문들은 왜 같은 문제를 서로 다른 층위로 풀까?"
lang: "ko"
translationKey: "dda-research-map"
date: "2026-07-30"
field: "ai"
category: "Dynamic Difficulty Adjustment"
series: "DDA Paper Review"
order: 1
status: "reading"
summary: "DDA 논문 다섯 편을 player state, meta balance, encounter generation, evaluation function, AI strength control이라는 축으로 다시 놓아 보면, 내 bi-level DDA가 어디서 공통 골격을 빌리고 어디서 구분해야 하는지가 선명해진다."
problem: "DDA 논문들을 읽다 보면 상태 추정, 메타 균형, 전투 조합 생성, AI 약화가 한 범주로 섞여 보여서, 어떤 방법을 내 연구의 기반으로 삼아야 하는지 흐려진다."
coreIdea: "각 논문을 '무엇을 조절하는가', '무엇을 최적화하는가', '어떤 시간 스케일에서 조절하는가'로 나누면, 공통 골격은 lower-level player model과 upper-level control policy로 정리된다."
connection: "내 DDA·bi-level 연구에서는 이 지도가 lower-level player model, upper-level difficulty policy, fairness/progression constraint를 분리하는 출발점이 된다."
tags: ["dda", "research-map", "bi-level-optimization", "personalization", "flow"]
---

# DDA 논문들을 한 장의 지도에 놓기

## 작성 배경
이 글은 내가 Notion에 정리한 [DDA 논문 리뷰 모음](https://app.notion.com/p/374fb10f650180de9af1eea957ddd205)과 [DDA 연구 메모](https://app.notion.com/p/37bfb10f650180f9b7c2f6dd561c4fa5)를 바탕으로 썼다. 논문 선택과 핵심 해석은 내 원문에서 출발했으며, GPT로 블로그에 맞게 구조와 표현을 재구성한 뒤 원문과 원 논문을 대조해 직접 검수했다. 비교 축과 한계는 각 원 논문을 다시 대조해 보완했다.

## 문제 제기
DDA라는 이름 아래 묶이지만, 실제로는 서로 다른 질문을 다루는 논문이 많다. 어떤 논문은 플레이어 상태를 추정하고, 어떤 논문은 메타를 재배치하고, 어떤 논문은 적 조합을 생성하고, 어떤 논문은 AI 자체를 약화시킨다.
이 구분이 흐려지면 방법론을 비교하는 대신 용어만 비교하게 된다.

## 핵심 아이디어
내가 읽은 다섯 편을 다음 네 축으로 나누면 정리가 쉽다.

- 무엇을 조절하는가
  - opponent strength
  - encounter composition
  - game meta
  - evaluation function
- 무엇을 맞추는가
  - win rate
  - affective state
  - strategy entropy
  - tactical engagement
  - player-relative difficulty
- 어디서 조절하는가
  - online inference
  - offline simulation
  - stage-level update
- 무엇이 빠져 있는가
  - explicit player model
  - human study
  - fairness constraint
  - progression constraint

이렇게 놓고 보면, DDA의 이름을 쓰더라도 실제 문제는 크게 세 갈래로 나뉜다.

1. 플레이어 상태를 추정해 행동을 고르는 계열
2. 적 조합이나 메타를 다시 만드는 계열
3. 강한 AI를 일부러 약화시키는 계열

## 방법
내가 이 다섯 편을 읽을 때는 다음 질문 순서로 정리했다.

1. 이 논문은 difficulty를 무엇으로 정의하는가
2. 그 difficulty를 바꾸는 control knob는 무엇인가
3. 플레이어를 직접 모델링하는가, 아니면 proxy로만 보는가
4. 조절은 실시간인가, stage-level인가, offline인가
5. 결과는 player experience를 직접 보나, game metric만 보나

이 기준으로 보면, 내 연구에 가장 유용한 공통 골격은 다음 식으로 요약된다.

$$
\phi^*(\psi) \in \arg\min_\phi \mathcal{L}_{player}(\phi; \mathcal{D}(\psi))
\qquad
\psi^* \in \arg\min_\psi \mathcal{L}_{DDA}(\psi; \phi^*(\psi))
$$

이 식은 논문들의 공통 구조를 내가 다시 쓴 것이다.

- lower-level은 player model 또는 outcome proxy를 학습한다
- upper-level은 그 결과를 보고 difficulty policy나 content parameter를 고른다
- 핵심은 둘을 같은 손실에 섞지 않고 분리하는 데 있다

## 실험 / 결과
원문을 이 지도 위에 놓으면 각 논문의 위치가 달라진다.

- `Bilevel Entropy based Mechanism Design for Balancing Meta in Video Games`
  - game meta의 다양성을 entropy로 밀어 올리는 쪽에 있다
  - human study는 없고, benchmark simulator 중심이다
- `Personalized Dynamic Difficulty Adjustment – Imitation Learning Meets Reinforcement Learning`
  - player behavior를 imitation proxy로 근사하고, 그 proxy를 상대하는 RL opponent를 만든다
  - small user study는 있지만 규모가 작다
- `NTRL: Encounter Generation via Reinforcement Learning for Dynamic Difficulty Adjustment in Dungeons and Dragons`
  - difficulty를 encounter composition generation 문제로 바꾼다
  - simulator metric과 human DM 비교는 있지만 player experience study는 아니다
- `Diversifying Dynamic Difficulty Adjustment Agent by Integrating Player State Models into Monte-Carlo Tree Search`
  - player state를 score function으로 넣어 MCTS를 바꾼다
  - user study가 있고, affective state 중심이다
- `AlphaDDA`
  - board state value를 이용해 이미 강한 AI를 약화시키는 쪽이다
  - AI-vs-AI 평가만 있고 human validation은 없다

즉, 결과가 비슷해 보여도 실제로는 측정 단위가 다르다.
같은 DDA라는 이름을 쓰더라도, 어떤 논문은 `state`, 어떤 논문은 `meta`, 어떤 논문은 `content`, 어떤 논문은 `strength`를 조절한다.

## 한계
이 지도는 유용하지만 완전하지 않다.

- 각 논문이 쓰는 평가 지표가 다르다
- 어떤 논문은 user study가 있고, 어떤 논문은 없다
- 어떤 논문은 gameplay outcome을 보지만, 어떤 논문은 player experience를 본다
- proxy metric을 실제 재미와 동일시하면 오해가 생긴다

그래서 이 지도는 "누가 더 낫다"를 정하는 도구가 아니라, "무엇을 같은 범주로 묶고 무엇을 분리해야 하는가"를 정리하는 도구로 쓰는 편이 맞다.

## 내 DDA·bi-level 연구와의 연결
내 연구에서 가장 중요한 분리는 세 가지다.

- state estimation과 control policy를 분리할 것
- capability difficulty와 player-relative difficulty를 분리할 것
- proxy metric과 subjective experience를 분리할 것

이 다섯 편을 같이 읽고 나면, 내 연구의 중심은 결국 다음으로 수렴한다.

> lower-level은 player를 어떻게 이해할지,
> upper-level은 그 이해를 바탕으로 difficulty를 어떻게 바꿀지

그래서 이 지도는 단순한 요약이 아니라, 내 bi-level DDA가 어디에서 확장되고 어디에서 조심해야 하는지를 보여주는 기준점이다.

## 참고자료
- [Bilevel Entropy based Mechanism Design for Balancing Meta in Video Games](https://www.ifaamas.org/Proceedings/aamas2023/pdfs/p2134.pdf)
- [Personalized Dynamic Difficulty Adjustment – Imitation Learning Meets Reinforcement Learning](https://arxiv.org/pdf/2408.06818)
- [NTRL: Encounter Generation via Reinforcement Learning for Dynamic Difficulty Adjustment in Dungeons and Dragons](https://arxiv.org/pdf/2506.19530)
- [Diversifying Dynamic Difficulty Adjustment Agent by Integrating Player State Models into Monte-Carlo Tree Search](https://cilab.gist.ac.kr/hp/wp-content/uploads/publications/international_journal/2022/ESWA_DDA.pdf)
- [AlphaDDA: Strategies for Adjusting the Playing Strength of a Fully Trained AlphaZero System to a Suitable Human Training Partner](https://arxiv.org/pdf/2111.06266)
