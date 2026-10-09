---
title: "DDA 논문들은 왜 같은 문제를 서로 다른 층위로 풀까?"
lang: "ko"
translationKey: "dda-research-map"
date: "2026-07-30"
lastUpdated: "2026-09-25"
field: "ai"
category: "Dynamic Difficulty Adjustment"
series: "DDA Paper Review"
order: 1
projects: ["staged-dda"]
status: "reading"
summary: "DDA 논문 다섯 편을 결정·관측·맞춤·평가 네 축의 표 하나에 놓는다. 다섯 편은 조절하는 대상도, 보는 신호도, 검증하는 방식도 모두 다르다. 명시적인 bi-level은 한 편뿐이고 개인별 플레이어 모델을 둔 논문은 없다."
problem: "DDA라는 이름 아래 상태 추정, 메타 균형, 적 조합 생성, AI 약화가 한 범주로 섞여 보여서 어떤 방법을 실험장의 기반으로 삼아야 하는지 흐려진다."
coreIdea: "각 논문을 '무엇을 결정하나, 무엇을 관측하나, 플레이어에게 어떻게 맞추나, 무엇으로 평가하나'로 나누면 다섯 편은 세 갈래로 갈리고, 공통 골격은 하위의 플레이어 모델과 상위의 난이도 정책으로 정리된다."
connection: "Research Roadmap Stage 4가 staged-dda를 실험장으로 고르면서 기댄 지형도다. 평가 열이 모두 다르다는 사실은 'DDA의 평가는 정규화되어 있지 않다'는 Stage 4의 근거가 된다."
tags: ["dda", "research-map", "bi-level-optimization", "personalization", "flow"]
---

# DDA 논문 다섯 편을 한 장의 지도에 놓기

> DDA라는 같은 이름 아래에서 이 논문들은 각각 무엇을 조절하고 무엇으로 검증하는가?

## 작성 배경

이 글은 원래 지도 글 한 편과 논문별 리뷰 다섯 편으로 나뉘어 있었다. [Research Roadmap](/notes/roadmap-tutorial-personal-agentic-model/)에서 DDA의 자리가 연구 주제에서 실험장으로 바뀌면서 필요한 것도 달라졌다. 논문 하나하나의 세부보다 "다섯 편이 서로 어디서 갈리는가"를 한눈에 보는 비교가 필요해졌다. 다섯 편의 리뷰를 이 지도 한 편에 흡수했다. 논문 선택과 해석의 출발점은 Notion에 정리한 [DDA 논문 리뷰 모음](https://app.notion.com/p/374fb10f650180de9af1eea957ddd205)과 [DDA 연구 메모](https://app.notion.com/p/37bfb10f650180f9b7c2f6dd561c4fa5)다.

다섯 편은 정해진 기준으로 뽑지 않았다. 그래서 이 글은 DDA 분야 전체의 지형이 아니라 **내가 읽은 다섯 편의 지도**다.

## 1. 네 축: 결정, 관측, 맞춤, 평가

[튜토리얼](/notes/roadmap-tutorial-personal-agentic-model/)에서 agentic model을 이렇게 정의했다. "스스로 결정을 내리고, 그 결정이 바꾼 사용자의 반응을 관측해, 다음 결정을 그 사용자에게 맞춰 가는 모델." DDA 논문도 같은 동사로 자를 수 있다. 여기에 실험장을 고를 때 가장 먼저 걸리는 평가를 한 축으로 더한다.

| 축 | 질문 |
|---|---|
| 결정 | 무엇을 조절하는가 (control knob) |
| 관측 | 무엇을 신호로 보는가 |
| 맞춤 | 플레이어를 모델링하는가, 한다면 무엇으로 |
| 평가 | 무엇으로 검증하는가 |

학습과 조절이 언제 일어나는가도 함께 적는다. offline 시뮬레이션으로 미리 학습하는지, 경기 중에 실시간으로 조절하는지에 따라 실험장에 옮길 수 있는 방식이 달라진다.

## 2. 지도

| 논문 | 결정 | 관측 | 맞춤 | 시점 | 평가 |
|---|---|---|---|---|---|
| BiGMB (AAMAS 2023) | 게임 메타 파라미터 $\theta$ | equilibrium 전략 분포의 entropy | 없음(메타 수준) | offline 탐색 | 시뮬레이터 벤치마크, human study 없음 |
| Imitation + RL (2024) | 상대 RL agent의 정책 | 플레이어 행동, HP 중심 reward | imitation proxy | 백그라운드 학습 후 주기적 교체 | 5명 user study |
| NTRL (2025) | 적 조합(encounter) | party 상태, 시뮬레이션 reward | party 상태만, 선호 모델 없음 | offline 학습, online 즉시 생성 | 시뮬레이터, human DM 비교 |
| Player State MCTS (ESWA 2022) | MCTS의 수 선택 | 예측한 Challenge·Competence·Valence·Flow | player state model(개인별 아님) | 실시간 | 20명 user study |
| AlphaDDA (2021) | 시뮬레이션 횟수, dropout, UCT score | 보드 가치 평균 $\bar v_n$ | 없음 | 실시간 | AI-vs-AI(Elo, 승·패·무) |

표를 세로로 읽으면 다섯 편은 이렇게 갈린다.

1. 플레이어 상태를 추정해 행동을 고르는 계열: Imitation + RL, Player State MCTS
2. 적 조합이나 메타를 다시 만드는 계열: NTRL, BiGMB
3. 이미 강한 AI를 일부러 약화시키는 계열: AlphaDDA

## 3. 논문별로 남길 것

### BiGMB: 메타의 다양성을 entropy로 잰다

Bilevel Entropy based Mechanism Design은 균형의 기준을 승률 표가 아니라 equilibrium 전략 분포의 다양성으로 옮긴다. inner-level에서 Nash Monte-Carlo Learning으로 mixed strategy Nash equilibrium을 근사하고 outer-level에서 CMA-ES로 메타 파라미터 $\theta$를 탐색한다. 다섯 편 가운데 **bi-level을 명시적으로 쓴 논문은 이것 하나**다.

$$
\max_{\theta}\; H(Y)-\big\|r\odot\theta-r\odot\theta_0\big\|_2,
\qquad
H(\sigma_i)=-\sum_{s\in S_i}\sigma_i(s)\log\sigma_i(s)
$$

entropy 항은 다양성을 밀어 올리고 정규화 항은 초기 메타 $\theta_0$에 담긴 설계 의도를 붙잡는다. RPSFW, Workshop Warfare, Pokémon VGC에서 평가했고 전략 공간이 커질수록 baseline 대비 이점이 커졌다. 개인화도 human study도 없고 다양한 메타가 곧 좋은 경험이라는 보장도 없다. 이 논문에서는 목적식 자체보다 전략 붕괴를 막는 보조 항으로서 entropy를 가져간다.

### Imitation + RL: 플레이어를 흉내 낸 proxy를 이기게 한다

FightingICE에서 adaptive random forest로 플레이어 행동을 모방하는 agent를 만든다. A2C로 그 agent를 상대하는 RL opponent를 학습하고 일정 간격마다 실제 상대를 교체한다. 모방 정확도는 약 82~87%였다. 5명이 참여한 user study의 평균 평점은 제안 agent $7.0\pm1.09$, MCTS $6.6\pm1.01$이었다. 논문에는 bi-level 식이 없다. 하위에 player proxy, 상위에 opponent 정책을 두는 구조는 내가 다시 읽은 것이다. reward가 HP 중심이라 경험을 직접 최적화하지 않는다. proxy가 플레이어의 장기 전략을 담지 못하면 opponent가 proxy만 공략하는 문제도 생긴다.

### NTRL: 난이도를 적 조합 생성으로 바꾼다

D&D의 encounter balancing을 XP 예산 조정이 아니라 적 조합을 생성하는 문제로 다시 쓴다. party 상태를 feature로 받은 policy network가 다음 적 클래스나 STOP을 샘플링한다. contextual bandit과 REINFORCE로 학습하고 reward는 승률을 포함한 다섯 proxy의 가중합이다.

$$
R(p,e)=\alpha\cdot wp+\beta\cdot fl+\gamma\cdot mhp+\delta\cdot dmg+\lambda\cdot dth
$$

비싼 시뮬레이션은 offline 학습으로 몰고 online에서는 party 상태만 받아 바로 생성한다. 정적 heuristic보다 긴 전투를 만들면서 승률을 높게 유지하는 경향을 보였다. Notion 원문에서 승률 수치가 문맥마다 다르게 적혀 있어 여기서는 경향만 남긴다. reward가 손으로 만든 proxy라는 점, 시뮬레이터 속 전투 AI와 사람의 차이, level 5 party로 제한된 실험 범위가 한계다.

### Player State MCTS: 이기는 수 대신 원하는 상태를 만드는 수

MCTS의 점수를 HP 차이에서 플레이어 상태 예측으로 바꾼다. 실제 플레이 로그 4.5초와 MCTS가 만든 미래 로그 0.5초를 이어 붙여 Challenge, Competence, Valence, Flow를 예측하고 그 값을 node value로 쓴다. 논문의 식을 내가 다시 쓰면 다음과 같다.

$$
\mathrm{score}_q(\tau)=P^q_\phi\big(y_q=1\mid I_p\oplus I_s\big)
$$

player state model은 43명의 로그 688개로 학습했고 예측 정확도는 Challenge 71.5%, Competence 69.4%, Valence 68.4%, Flow 73.1%였다. 20명 user study에서 Competence·Valence·Flow agent는 HP baseline보다 주관적 경험이 좋았지만 Challenge agent는 유의한 개선이 없었다. 레이블은 경기 뒤 GEQ 설문이라 순간 단위의 상태가 아니며 모델도 개인별이 아니다. 그래도 다섯 편 중 플레이어 경험을 목적에 가장 직접 넣은 논문이다.

### AlphaDDA: 강한 AI를 새로 학습하지 않고 약하게 만든다

fully trained AlphaZero를 그대로 두고 최근 보드 가치의 평균을 강도 신호로 쓴다.

$$
\bar v_n=\frac{1}{N_h}\sum_{i=0}^{N_h-1}v_{n-i}
$$

이 신호로 AlphaDDA1은 MCTS 시뮬레이션 횟수를, AlphaDDA2는 dropout 확률을, AlphaDDA3는 UCT score를 조절한다. Connect4, 6×6 Othello, Othello의 AI-vs-AI 평가에서 1과 2는 대부분의 상대에게 강도를 맞췄다. 3은 지나치게 약해졌다. human study는 없다. 보드 가치에 기대므로 숨은 정보나 확률 요소가 있는 게임에는 바로 옮기기 어렵다. 조절 knob가 가장 명확한 baseline이지만 "누구에게 어떤 강도로 맞출지"는 다루지 않는다.

## 4. 지도에서 읽히는 것

### 공통 골격은 하위의 플레이어 모델과 상위의 난이도 정책이다

명시적으로 bi-level을 쓴 것은 BiGMB뿐이지만 다섯 편의 구조는 같은 모양으로 다시 쓸 수 있다.

$$
\phi^*(\psi)\in\arg\min_\phi\mathcal{L}_{player}\big(\phi;\mathcal{D}(\psi)\big)
\qquad
\psi^*\in\arg\min_\psi\mathcal{L}_{DDA}\big(\psi;\phi^*(\psi)\big)
$$

하위는 플레이어 모델이나 결과 proxy를 학습하고 상위는 그 결과를 보고 난이도 정책이나 콘텐츠 파라미터를 고른다. 이 식은 논문들의 공통 구조를 내가 다시 쓴 것이다. 하위 데이터가 $\mathcal{D}(\psi)$로 상위 변수에 의존한다는 점은 [Stage 2](/notes/roadmap-performative-prediction/)의 performative 구조와 같다.

### 평가 열이 모두 다르다

다섯 편의 평가는 시뮬레이터 벤치마크, 5명 user study, 시뮬레이터와 human DM 비교, 20명 user study, AI-vs-AI Elo로 모두 다르다. 결과가 비슷해 보여도 측정 단위가 달라 순위를 매길 수 없다. Stage 4(예정)에서 DDA의 평가가 정규화되어 있지 않다고 본 근거가 이 열이다.

### 개인별 플레이어 모델은 없다

플레이어를 모델링하는 논문은 둘이다. Imitation + RL은 현재 플레이어를 흉내 내는 proxy를 두고 Player State MCTS는 여러 플레이어의 로그로 공용 상태 모델을 학습해 쓴다. 후자는 AI의 수가 만들 짧은 미래까지 넣어 예측하므로 결정에 대한 반응을 한 걸음 모델링하는 셈이다. 하지만 그 모델은 개인별이 아니고 반응이 쌓여 플레이어가 변하는 효과도 다루지 않는다. 두 편 모두 "새 플레이어에게 빨리 맞추는 법"은 목적에 넣지 않는다.

내 연구에서 분리해야 할 것도 세 가지로 정리된다.

- 상태 추정과 조절 정책
- 능력 기준 난이도와 플레이어 상대 난이도
- proxy 지표와 주관적 경험

> [!interpretation] 내 해석
> 이 지도를 그리고 나서 두 가지가 걸렸다. 먼저 DDA에는 정규화된 평가 지표가 없다. 평가 열의 다섯 칸이 모두 다르니 한 논문의 개선이 다른 논문보다 낫다고 말할 수 없고 내 방법을 올려놓을 공통 기준도 없다. 또 다섯 편 어디에도 모델의 독창적인 플레이가 없다. AlphaDDA는 강한 AI의 수를 약화하고 Imitation + RL은 플레이어를 흉내 낸 proxy를 상대로 배운다. NTRL은 정해진 적 클래스 안에서 조합을 고르고 BiGMB는 메타 파라미터를 옮긴다. Player State MCTS도 원하는 상태를 만들 수를 고를 뿐 자기 전략을 세우지는 않는다. 모델은 '얼마나 어렵게'만 정하고 '어떤 플레이를'은 정하지 않는다. agentic model의 정의에서 '스스로 결정을 내린다'가 난이도라는 한 축으로 줄어든 셈이다. 그래서 DDA를 실험장으로 쓰면 맞춤은 보여 줄 수 있어도 결정의 폭은 보여 주기 어렵고 결과를 비교할 기준도 따로 세워야 한다.

## 5. 한계

이 지도는 "무엇을 같은 범주로 묶고 무엇을 분리할지"를 정하는 도구다. "누가 더 낫다"를 정하는 데는 쓰지 않는다. 다섯 편을 기준 없이 골랐으니 비어 있는 칸이 분야의 빈칸이라고 말할 수는 없다. 분야 전체의 지형은 리뷰 논문을 뼈대로 다시 그려야 한다. 논문별 수치는 Notion 원문과 원 논문을 대조해 옮긴 것이지만 NTRL처럼 원문 안에서 수치가 엇갈린 경우는 경향만 남겼다.

## 연결

- 관련 프로젝트: [범용 staged-DDA](/projects/dda-blackjack/)
- 관련 시리즈: Research Roadmap Stage 4 — 가능성을 어디서 보이는가(예정)

## 참고자료

- [Bilevel Entropy based Mechanism Design for Balancing Meta in Video Games](https://www.ifaamas.org/Proceedings/aamas2023/pdfs/p2134.pdf) (AAMAS 2023)
- [Personalized Dynamic Difficulty Adjustment – Imitation Learning Meets Reinforcement Learning](https://arxiv.org/pdf/2408.06818) (arXiv 2024)
- [NTRL: Encounter Generation via Reinforcement Learning for Dynamic Difficulty Adjustment in Dungeons and Dragons](https://arxiv.org/pdf/2506.19530) (arXiv 2025)
- [Diversifying Dynamic Difficulty Adjustment Agent by Integrating Player State Models into Monte-Carlo Tree Search](https://cilab.gist.ac.kr/hp/wp-content/uploads/publications/international_journal/2022/ESWA_DDA.pdf) (ESWA 2022)
- [AlphaDDA: Strategies for Adjusting the Playing Strength of a Fully Trained AlphaZero System to a Suitable Human Training Partner](https://arxiv.org/pdf/2111.06266) (arXiv 2021)
- Notion 원문: [BiGMB 리뷰](https://app.notion.com/p/374fb10f6501804c8721dc1b3daad34b) · [Personalized DDA 리뷰](https://app.notion.com/p/374fb10f65018061a4cdc77dc2603afa) · [NTRL 리뷰](https://app.notion.com/p/374fb10f65018073b85bd133c3862b18) · [Player State MCTS 리뷰](https://app.notion.com/p/37afb10f6501804f96b7ff251493afad) · [AlphaDDA 리뷰](https://app.notion.com/p/37afb10f650180c086d1e1a16e4cbb0a)
