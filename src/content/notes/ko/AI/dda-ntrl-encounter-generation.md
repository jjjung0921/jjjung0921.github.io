---
title: "전투 난이도를 적 조합 생성으로 바꾸면 왜 더 유연할까?"
lang: "ko"
translationKey: "dda-ntrl-encounter-generation"
date: "2026-07-30"
field: "ai"
category: "Dynamic Difficulty Adjustment"
series: "DDA Paper Review"
order: 4
projects: ["staged-dda"]
status: "reading"
summary: "NTRL은 D&D의 난이도를 단순 XP budget 조정이 아니라 encounter composition 생성 문제로 다시 쓴다. contextual bandit과 REINFORCE를 사용해 party 상태에 맞는 적 조합을 만들고, offline simulation으로 학습한 뒤 online에서는 즉시 생성한다."
problem: "DMG의 정적 XP heuristic은 party 구성, 적 synergy, 현재 자원 상태를 충분히 반영하지 못하고, 자동 playtesting은 실시간 캠페인에 쓰기엔 느리다."
coreIdea: "party matrix와 synergy vector를 context로 두고, enemy class를 순차적으로 샘플링하거나 STOP하는 policy를 학습해 전투 난이도를 생성한다."
connection: "내 bi-level DDA에서는 이 논문의 encounter generation을 card game의 opponent policy generation 또는 state-conditioned content generation으로 바꿔 읽을 수 있다."
tags: ["contextual-bandit", "reinforcement-learning", "dungeons-and-dragons", "encounter-generation", "simulation"]
---

# 전투 난이도를 적 조합 생성으로 바꾸면 왜 더 유연할까?

## 작성 배경
이 글은 내가 Notion에 작성한 [NTRL 리뷰](https://app.notion.com/p/374fb10f65018073b85bd133c3862b18)를 바탕으로 썼다. 논문 선택과 핵심 해석은 내 원문에서 출발했으며, GPT로 블로그에 맞게 구조와 표현을 재구성한 뒤 원문과 원 논문을 대조해 직접 검수했다. 수치가 불분명한 부분은 과장하지 않고 원 논문의 실험 범위와 함께 다시 정리했다.

## 문제 제기
D&D에서 encounter balancing은 단순히 "더 세게" 또는 "더 약하게"로 해결되지 않는다.
party composition, 현재 HP, 몬스터 synergy, 전투 지속 시간, TPK 위험이 함께 얽힌다.

논문은 이 문제를 DM의 수동 XP budget 조정 대신, 적 조합 생성 문제로 다시 정의한다.

## 핵심 아이디어
### 논문에서 말하는 것
NTRL의 핵심은 다음과 같다.

- party 상태를 feature matrix $P$로 인코딩한다
- 이미 선택된 enemy 조합 정보를 synergy vector $S$로 유지한다
- policy network가 다음 enemy class 또는 STOP action을 샘플링한다
- 생성된 encounter를 simulator로 평가하고 reward를 업데이트한다

즉, 난이도 조절을 "한 번에 숫자 하나를 맞추는 문제"가 아니라 "전투 장면 자체를 생성하는 문제"로 본다.

### 내 해석
이 논문이 중요한 이유는 DDA를 content generation과 연결했기 때문이다.
내가 보기에 이 관점은 카드 게임에도 잘 맞는다.

- opponent policy를 조절할 수도 있고
- card/hand/sequence를 생성할 수도 있고
- resource perturbation을 만들 수도 있다

즉, DDA를 단순 control이 아니라 생성 문제로 보는 시야를 준다.

## 방법
논문은 contextual bandit과 policy gradient를 섞어 encounter를 생성한다.

기본적인 수식은 다음과 같다.

$$
G_t = \sum_{k=0}^{\infty}\gamma^k R_{t+k}
$$

$$
J(\theta) = \mathbb{E}_{\pi_\theta}\left[\sum_{t=0}^{T}R_t\right]
$$

$$
\nabla_\theta J(\theta)=\mathbb{E}_{\pi_\theta}\left[\sum_{t=0}^{T}\nabla_\theta \log \pi_\theta(a_t|s_t)G_t\right]
$$

$$
R(p,e)=\alpha \cdot wp + \beta \cdot fl + \gamma \cdot mhp + \delta \cdot dmg + \lambda \cdot dth
$$

내가 이 구조를 읽을 때 중요하게 본 점은 두 가지다.

1. training은 offline simulation으로 밀어 넣는다
2. inference는 party status만 받아 즉시 encounter를 만든다

그래서 실시간 캠페인에서도 쓸 수 있는 형태를 노린다.

## 실험 / 결과
논문은 simulator와 human DM 비교를 모두 사용한다.

- DMG의 static heuristic보다 더 긴 전투를 만든다
- party 피해량을 늘리면서도 높은 승률을 유지하도록 학습한다
- TPK는 낮게 유지하려고 한다
- human DM과 비교한 실험도 넣었다

다만 내가 이 결과를 적을 때는 수치보다 경향만 남기는 편이 안전하다.
Notion 원문 안에서도 win probability 수치가 여러 문맥에서 다르게 적혀 있어서, 여기서는 "높게 유지된다"는 정성적 결론만 정리한다.

## 한계
이 논문은 유용하지만, 그대로 가져오면 안 되는 한계가 분명하다.

- reward가 hand-crafted proxy다
  - 실제 재미나 몰입을 직접 측정하지 않는다
- simulator-reality gap이 있다
  - heuristic combat AI와 human player는 다르게 행동한다
- player preference model이 없다
  - 현재 party 상태는 보지만, 어떤 전투를 선호하는지는 다루지 않는다
- 실험 범위가 제한적이다
  - level 5 party, 제한된 class pool을 중심으로 평가한다

## 내 DDA·bi-level 연구와의 연결
이 논문은 내 연구에 세 가지 힌트를 준다.

1. DDA를 state-conditioned content generation으로 볼 수 있다
2. expensive simulation은 offline으로 몰고, online에서는 policy만 쓴다
3. reward를 여러 proxy의 합으로 구성할 수 있다

하지만 내 연구에서는 이것만으로 부족하다.

- lower-level에는 player model이 필요하고
- upper-level에는 target difficulty와 subjective experience가 필요하며
- fairness/progression constraint가 명시돼야 한다

그래서 NTRL은 내 연구의 좋은 출발점이지만, 최종 형태는 아니다.

## 참고자료
- [NTRL: Encounter Generation via Reinforcement Learning for Dynamic Difficulty Adjustment in Dungeons and Dragons](https://arxiv.org/pdf/2506.19530)
