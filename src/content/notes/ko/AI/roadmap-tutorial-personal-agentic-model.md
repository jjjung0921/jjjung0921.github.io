---
title: "[Tutorial] 개인에게 맞춰 가는 모델을 만들고 싶다"
lang: "ko"
translationKey: "roadmap-tutorial-personal-agentic-model"
date: "2026-09-19"
field: "ai"
category: "Research Roadmap"
series: "Research Roadmap"
order: 1
status: "draft"
summary: "이 시리즈의 목적인 '사용자 한 명에게 맞춰 가는 agentic model'을 먼저 정의한다. agentic을 결정·관측·맞춤 세 동사로 정의하고, 목적을 세 질문으로 쪼개 다섯 스테이지에 배치한다."
problem: "meta-learning, performative prediction, bi-level optimization을 따로 공부하면 셋이 왜 한 연구 안에 있어야 하는지 보이지 않는다."
coreIdea: "agentic model을 '스스로 결정을 내리고, 그 결정이 바꾼 사용자의 반응을 관측해, 다음 결정을 그 사용자에게 맞춰 가는 모델'로 정의하면 맞춤은 meta-learning이, 결정과 반응은 performative prediction이, 둘을 한 문제로 쓰는 일은 bi-level optimization이 맡는다."
connection: "Stage 1~5가 이 목적에서 나온 질문을 차례로 받는다. 각 도구의 깊은 내용은 MAML Task Paradigms, Performative Prediction, Optimization Foundations, Personalization as Optimization 시리즈와 DDA 논문 지도에 있다."
tags: ["research-roadmap", "personalization", "agentic-model", "meta-learning", "performative-prediction", "bi-level-optimization", "nas"]
---

# 개인에게 맞춰 가는 모델을 만들고 싶다

> 이 시리즈가 끝에 답하려는 것은 무엇인가?

## 0. 목적: 무엇을 만들고 싶은가

이 시리즈는 목적 한 문장에서 출발한다.

**사용자 한 명에게 맞춰 가는 agentic model을 만든다.**

이 목적으로 처음에는 **Neural Architecture Search**(NAS)를 도구로 잡았다. 개인에게 맞춘다는 것을 neural network의 형태를 개인마다 자동으로 바꾸는 일로 생각했기 때문이다. DARTS는 구조를 train/validation의 bi-level 문제로 썼고 NAO는 구조를 연속 공간으로 옮겨 gradient로 움직였다([NAS Foundations](/notes/nas-darts-bilevel-relaxation/)). 구조도 최적화의 변수가 되고 그 최적화가 두 층으로 갈라지는 것을 여기서 봤다. 다만 NAS가 요구하는 연산량은 개인 한 명마다 구조를 탐색하기에는 너무 컸다. 그래서 구조 대신 **파라미터**를 개인에게 맞추는 쪽으로 관심을 옮겼다. 파라미터 쪽 도구가 MAML이고 맞추는 상대가 반응한다는 문제가 Performative Prediction이다.

| 무엇을 바꿔서 맞추는가 | 도구 | 개인 한 명당 비용 |
|---|---|---|
| 네트워크의 형태 | NAS (DARTS, NAO) | 구조 탐색 한 번 — 감당 못 한다 |
| 파라미터 | MAML | 공유 출발점에서 gradient 몇 걸음 |

bi-level이라는 언어는 그때 얻은 것이라 Stage 3에서 다시 만난다.

다섯 스테이지는 도구가 바뀌어도 같은 질문을 다룬다. 각 스테이지 첫머리에서 이 문장을 되짚는다.

## 1. Agentic model: 무엇을 agentic이라 부르는가

2026년에 agentic이라고 하면 흔히 도구를 호출하며 일을 처리하는 LLM 에이전트를 떠올린다. 이 시리즈에서 우리가 보는 agentic은 그와 달리 모델과 사용자 사이를 오가는 결정과 반응의 고리다.

> [!info] Agentic model
> 스스로 결정을 내리고, 그 결정이 바꾼 사용자의 반응을 관측해, 다음 결정을 그 사용자에게 맞춰 가는 모델.

도구의 자리는 정의에 든 동사인 결정, 관측, 맞춤으로 정해진다.

> [!interpretation] 내 해석
> 도구를 부르는 LLM 에이전트도 스스로 결정을 내린다. 다만 사용자의 반응은 메모리에 쌓아 두었다가 다시 읽을 뿐이고 모델은 그대로다. 내가 이 정의에서 붙잡고 싶은 것은 고리의 마지막 동사다. 관측한 반응이 다시 모델을 바꾸어야 고리가 닫힌다. 그래서 이 시리즈의 첫 질문은 '맞춤'이다.

## 2. 목적을 세 질문으로 쪼개기

목적 문장은 그대로 풀리지 않아서 동사를 따라 질문으로 쪼갠다.

| 동사 | 질문 | 도구 | 스테이지 |
|---|---|---|---|
| 맞춤 | 적은 관측으로 한 사람을 빨리 배우려면? | meta-learning, MAML | 1 |
| 결정 → 관측 | 내 결정이 그 사람을 바꾸면? | Performative Prediction | 2 |
| 고리 전체 | 두 방향을 한 문제로 쓰면? | bi-level optimization | 3 |

그 뒤 Stage 4는 이 모양이 돌아가는지 볼 실험장을, Stage 5는 그 실험장에 MAML을 얹으려다 만난 질문을 다룬다.

## 3. 왜 게임인가

결정과 반응이 모두 관측되는 실험장이 필요하다. 게임에서는 모델이 결정한 난이도에 대한 사용자의 반응이 승패와 행동으로 남는다. 플레이어를 시뮬레이션할 수 있으니 사람을 부르기 전에 시나리오 전체를 돌려 볼 수도 있다(Stage 4). 실험장인 staged-dda는 게임을 stage 단위로 나누어 난이도를 고른다. 이 시리즈의 스테이지도 같은 말이다.

## 4. 스테이지 지도

시리즈는 질문이 이어지는 순서로 짰다. 각 스테이지는 "이 도구가 왜 필요했나 → 도구가 준 것 → 남긴 것"으로 진행한다. 남긴 것이 다음 스테이지의 질문이 된다.

```text
[Tutorial] 사용자 한 명에게 맞춰 가는 agentic model
   ▼
[Stage 1] 한 사람을 빨리 배우려면?      → MAML
   │  남긴 것: 한 방향뿐이다
   ▼
[Stage 2] 결정이 사람을 바꾸면?         → Performative Prediction
   │  남긴 것: 두 방향이 따로 있다
   ▼
[Stage 3] 두 방향을 한 문제로?          → bi-level optimization
   │  남긴 것: 모양만으로는 안 풀린다
   ▼
[Stage 4] 가능성을 어디서 보이는가?     → staged-dda
   │  남긴 것: task 분포가 필요하다
   ▼
[Stage 5] 누구를 한 분포로 묶는가?      → Track B
```

이 시리즈는 뼈대다. 깊은 내용은 [NAS Foundations](/notes/nas-search-space-evolution/), MAML Task Paradigms(예정), [Performative Prediction](/notes/performative-prediction/), Optimization Foundations(예정), Personalization as Optimization(예정) 시리즈와 [DDA 논문 지도](/notes/dda-research-map/)에 있다. 각 편 끝의 `연결`에서 그 시리즈로 들어갈 수 있다.

## 연결

- 관련 프로젝트: [범용 staged-DDA](/projects/dda-blackjack/)
- 관련 실험: 없음(E1은 Stage 4)
- 다음에 확인할 질문: 한 사람을 빨리 배우는 능력을 학습 문제로 쓰면 무엇이 되는가? → [Stage 1](/notes/roadmap-personal-model-and-maml/)
