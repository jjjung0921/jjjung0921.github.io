---
title: "[Stage 5] 어떤 플레이어들을 한 task 분포로 묶는가: Track B"
lang: "ko"
translationKey: "roadmap-task-grouping-track-b"
date: "2026-09-24"
field: "ai"
category: "Research Roadmap"
series: "Research Roadmap"
order: 6
projects: ["staged-dda"]
status: "draft"
summary: "staged-dda의 플레이어 모델을 MAML로 옮기려면 어떤 플레이어들을 한 task 분포 p(T)로 둘지 정해야 한다. MAML은 p(T)를 입력으로 받을 뿐이고, 문헌에는 합의된 기준 대신 운용 가능한 proxy 네 가지가 있다. 이 질문을 Track B로 떼어 Track A와 따로 연구하기로 했다."
problem: "페르소나 5종, OOD 플레이어, 관측·행동 공간이 다른 두 게임을 한 p(T)로 둘 것인가. MAML 자신은 이 질문에 답하지 않는다."
coreIdea: "task 유사도에는 합의된 기준이 없고, 운용 가능한 proxy는 적응된/최적 파라미터 거리, gradient 정렬·affinity, 데이터 분포 divergence, task embedding 네 가지다. Track B는 MAML을 그대로 두고 묶는 기준만 바꿔 가며 묻는다."
connection: "Track A(Personalization as Optimization)는 결정·관측·맞춤을 한 bi-level 고리로 닫고, Track B(MAML Task Paradigms)는 그 고리에서 맞춤이 기대는 분포를 정한다. 두 트랙은 튜토리얼의 목적 문장 아래에 나란히 놓인다."
tags: ["research-roadmap", "meta-learning", "maml", "task-distribution", "task-similarity", "staged-dda"]
---

[튜토리얼](/notes/roadmap-tutorial-personal-agentic-model/)에서 목적을 이렇게 세웠다. **사용자 한 명에게 맞춰 가는 agentic model을 만든다.** 마지막 스테이지는 '맞춤'이 기대는 전제로 돌아간다.

> MAML을 얹으려면 $p(\mathcal{T})$를 정해야 한다. 무엇으로 정하는가?

# 0. Stage 4가 남긴 것: MAML로 옮기려다 멈춘 자리

[Stage 4](/notes/roadmap-staged-dda-design/)의 2층 플레이어 모델을 MAML로 옮기려면 [Stage 1](/notes/roadmap-personal-model-and-maml/) 식 (2)의 합을 어디 위에서 취할지부터 정해야 한다. 곧 어떤 플레이어들을 한 $p(\mathcal{T})$로 볼 것인가이다.

# 1. 구체적 계기: 무엇을 한 분포에 넣을 것인가

staged-dda에는 이 질문을 피할 수 없게 만드는 재료가 있다.

| 후보 | 걸리는 점 |
|---|---|
| 페르소나 5종 | gradual·fatigue·abrupt shift는 한 사람 안에서 상태가 바뀐다. 바뀌기 전과 뒤를 한 task로 볼 것인가 |
| OOD 페르소나 | 정의상 학습 범위 밖이다. 메타 학습 분포에 넣는 순간 OOD가 아니게 된다 |
| 두 게임의 플레이어 | 플레이어 모델은 난이도와 스테이지 요약만 보므로 같은 코드로 돌지만, AI 정책의 관측·행동 공간은 다르다(blackjack 입력 4차원 → $p_{\text{hit}}$, 맞고 16차원 → score). 두 게임을 하나로 구동하는 통합 모델은 아직 없다 |

E1의 메타 학습 집단은 stationary 0.2·gradual 0.4·fatigue 0.2·shift 0.2로 섞였고 OOD는 빠져 있었다. 이것이 이미 **하나의 $p(\mathcal{T})$ 선택**이다.

그렇다면 Stage 4에서 본 작은 개인화 이득은 이 분포가 너무 좁거나 넓어서였을까? 이는 가설일 뿐 검증하지 않았다. E1 문서는 먼저 승률 표면이 둔감하다는 점을 이유로 꼽았다.

위 표의 마지막 줄이 이 질문에 처음 걸렸다. 우리는 블랙잭 플레이어와 맞고 플레이어를 같은 prior로 묶어도 되는지 고민했고, 그러다 다른 게임에서 하는 학습도 하나의 task 묶음으로 둘 수 있을까라는 질문에 닿았다. 그 질문이 Track B의 출발점이다.

# 2. MAML은 task 분포를 주어진 것으로 둔다

MAML의 Algorithm 1 첫 줄은 `Require: p(T)`다. 분포는 알고리즘의 입력이고 논문은 분포를 만들지도 고르지도 않는다. 실험에서는 사인파의 진폭 $[0.1, 5.0]$·위상 $[0, \pi]$처럼 실험자가 범위를 정했다([B1](/notes/meta-maml-task-distribution-given/)). 즉, Stage 1에서 접어 둔 질문에 MAML 자신은 답하지 않는다.

# 3. 문헌: 합의된 기준 대신 proxy 네 가지

후속 연구를 정리하면 task 유사도에 **합의된 기준은 없다**. 운용 가능한 proxy는 아래 4가지로 모인다.

| proxy | 재는 것 | 예 |
|---|---|---|
| (i) 적응된/최적 파라미터 거리 | task별 해가 얼마나 모여 있는가 | Khodak et al. 2019, TSA-MAML |
| (ii) gradient 정렬·affinity | 함께 학습할 때 서로 돕는가 | TAG(multi-task learning, 한 걸음 lookahead의 손실 변화) |
| (iii) task 데이터 분포 divergence | 데이터가 얼마나 다른가 | Jose & Simeone 2021(KL·JS), Per-FedAvg(간접: TV·$W_1$이 gradient 이질성을 누름) |
| (iv) task embedding | task를 벡터로 놓은 거리 | Task2Vec(Fisher 임베딩의 cosine 거리) |

다양성이 클수록 좋다는 통념과 다른 결과도 있다. Kumar et al.(2022)에서는 태스크를 뽑는 샘플러로 태스크 다양성을 높여도 뚜렷한 이득이 없었다.

이어서 Setlur et al.(2020)은 support 예시를 고정된 풀 하나로 제한해 support set 다양성을 줄였는데도 성능이 대부분 같거나 올랐다.

다만 위 두 연구가 말하는 다양성은 태스크 수준과 support 예시 수준으로 서로 다르다.

한편 "사용자 = task"인 개인화 설정에서 이 proxy들을 비교한 연구는 조사한 범위에서 찾지 못했다.

# 4. 결정: Track B를 따로 연다

이 질문은 staged-dda 안에서 함께 풀 수도 있다. 하지만 우리는 Track B를 Track A와 합치지 않고 별도 연구로 두기로 했다. 두 트랙의 관계를 도식으로 그리면 아래와 같다.

```text
목적: 사용자 한 명에게 맞춰 가는 agentic model
│
├─ Track A · Personalization as Optimization
│    결정 → 관측 → 맞춤을 한 bi-level 고리로 (Stage 2·3·4의 연장)
│    D(ψ) 명시, ε-sensitivity 측정 / 실험장: staged-dda
│
└─ Track B · MAML Task Paradigms
     맞춤이 기대는 task 분포를 정한다 (Stage 1·5의 연장)
     MAML은 그대로, 묶는 기준만 바꾼다 / 실험장: 다봉 회귀 벤치마크(계획)
```

# 5. 정리 — 무엇을 답했고 무엇이 남았는가

한 문장으로 줄이면 이렇다.

> MAML을 개인화에 얹으려면 $p(\mathcal{T})$를 정해야 하지만 그 기준은 합의되어 있지 않고 우리는 이 질문을 Track B로 떼어 따로 묻는다.

튜토리얼의 목적 문장으로 돌아가 보자. 결정·관측·맞춤을 한 고리로 닫는 일은 Track A가 맡는다. Track B는 그 고리 안에서 '맞춤'이 기대는 분포를 정한다.

## 남은 문제

Track B에서 묶음의 좋고 나쁨을 무엇으로 채점할지는 아직 정하지 않았다. 적응 뒤 성능으로 잴 수도, 학습의 안정성(seed 분산, 발산율)으로 잴 수도 있다. Track A에는 개인화 이득이 보이는 조건을 먼저 만드는 일이 남아 있다.

Research Roadmap은 여기서 끝난다. 이어지는 이야기는 두 트랙의 시리즈에서 한다.

# 연결

- 관련 프로젝트: [범용 staged-DDA](/projects/dda-blackjack/)
- 관련 실험: E1의 메타 학습 집단 구성(OOD 제외)
- 다음에 확인할 질문: proxy로 묶은 task 분포가 MAML의 적응 뒤 성능이나 학습 안정성을 바꾸는가? → [MAML Task Paradigms](/notes/meta-maml-task-distribution-given/)
- Track A의 다음 글: [DDA를 bi-level 최적화로 쓰면 무엇이 하위 문제인가](/notes/personalization-dda-bilevel-formulation/)(예정)
