---
title: "[Stage 4] staged-dda: 결정과 반응이 보이는 실험장"
lang: "ko"
translationKey: "roadmap-staged-dda-design"
date: "2026-09-24"
field: "ai"
category: "Research Roadmap"
series: "Research Roadmap"
order: 5
projects: ["staged-dda"]
status: "draft"
summary: "staged-dda는 난이도(결정)와 승수·일치율·반응시간(관측)이 보이는 두 층 실험장이다. 1층은 집단 평균 플레이어에 대한 open-loop bilevel 스케줄, 2층은 플레이어를 task로 둔 meta 개인화다. E1에서 meta prior는 prior 없는 모델을 이겼지만, 적응 없는 집단 prior 대비 개인화의 이득은 아직 작다."
problem: "Stage 3의 bi-level 식은 식일 뿐이다. 결정과 반응이 관측되고 시뮬레이션으로 반복할 수 있는 실험장이 있어야 개인에게 맞춰 가는 모델의 가능성을 볼 수 있다."
coreIdea: "게임의 DDA에서 결정은 난이도(AI 정책의 역온도), 반응은 스테이지 관측 y = (승수, 일치율, 반응시간)이다. 2층은 meta-prior와 GRU posterior(amortized)로 새 플레이어에게 적응하고, 불확실성을 고려한 목적식으로 다음 난이도를 고른다."
connection: "저장소는 게임 DDA 문제로 쓰여 있고, 상위 변수가 하위 데이터 분포 D(ψ)로 들어가는 재정식화는 Personalization as Optimization 시리즈에서 진행 중이다. 2층을 MAML로 옮기려는 설계가 Stage 5의 질문을 낳는다."
tags: ["research-roadmap", "dda", "staged-dda", "meta-learning", "personalization", "bi-level-optimization"]
---

[튜토리얼](/notes/roadmap-tutorial-personal-agentic-model/)에서 목적을 이렇게 세웠다. **사용자 한 명에게 맞춰 가는 agentic model을 만든다.** 이번 스테이지는 세 동사가 실제로 돌아가는 실험장을 다룬다.

> 세 도구로 "개인에게 맞춰 가는 모델"의 가능성을 보이는 최소 실험은 무엇인가?

# 0. Stage 3이 남긴 것: 식은 있는데 무대가 없다

앞선 [Stage 3](/notes/roadmap-bilevel-common-form/)에서 목적을 bi-level 식으로 썼다. 식이 돌아가는지 보려면 돌려 볼 곳이 필요하다.

이 자리는 결정과 반응이 모두 관측되고 사람을 부르기 전에 시뮬레이션으로 반복할 수 있어야 한다. 이 조건에 맞는 자리가 게임의 **동적 난이도 조절**(DDA)이고 저장소가 staged-dda다. DDA 논문들의 지형은 [DDA 논문들은 왜 같은 문제를 서로 다른 층위로 풀까?](/notes/dda-research-map/)에 정리했다.

게임을 고른 이유는 하나다. 게임은 **닫힌 환경**이라 모델의 반응에 따른 사용자의 반응을 관찰하기에 가장 좋다고 생각했다. 닫힌 환경의 조건은 아래 3가지다.

1. 규칙이 고정돼 있다.
2. 결정과 반응이 모두 로그로 남는다.
3. 사람 대신 시뮬레이션 플레이어를 돌릴 수 있다.

실험장에는 게임이 두 가지 있고 승률 표면을 구하는 방식이 서로 다르다. Duel Blackjack은 정확한 DP로 계산하고 맞고는 Monte Carlo와 surrogate로 근사한다. 다만 같은 방법을 두 게임에서 검증한다.

게임 뒤에는 같은 고리가 도는 자리가 있다. 예를 들어 gamification이나 게임 기반 학습, 사용자에 따라 다르게 반응하는 NPC가 그렇다.

# 1. 왜 게임인가: 세 동사가 모두 보인다

| agentic의 동사 | staged-dda에서 |
|---|---|
| 결정 | 스테이지 난이도 $d$. AI 정책의 역온도로, $d=0$이면 균등 무작위, 커질수록 최적 플레이에 가깝다 |
| 관측 | 스테이지 관측 $y$ = (승수, 일치율, 반응시간), 스테이지당 약 10판 |
| 맞춤 | 플레이어를 task로 두고 새 플레이어에게 적응하는 2층 |

승패만으로는 플레이어를 식별할 수 없어 참조 정책 일치율과 반응시간을 함께 본다. 게임은 Duel Blackjack과 맞고 두 가지, 플레이어는 시뮬레이션 페르소나 5종(stationary, gradual, fatigue, abrupt shift, OOD)이다.

# 2. 두 층 구조: 무엇이 bi-level이고 무엇이 개인화인가

```text
1층  population 스케줄 (open-loop bilevel)
     승률 표면 W(x, u) + hand-coded 플레이어 dynamics
       → unroll · backprop → 단계별 난이도 스케줄
       = 집단 평균 플레이어의 해, 2층의 baseline(static)

2층  meta 개인화 (closed-loop, 플레이어 = task)
     meta-prior p(z₁) → GRU posterior q(z_s | H) → latent transition → decoder
       → 난이도 후보 스윕 → 식 (1) 최소화 → 다음 스테이지 난이도
```

1층의 승률 표면은 블랙잭에서 정확한 DP로, 맞고에서 Monte Carlo와 surrogate로 계산한다. 2층은 매 스테이지 posterior를 전이시킨 뒤 다음 목적을 최소화하는 난이도를 고른다. 이 목적을 식으로 표현하면 아래와 같다.

$$
\mathbb{E}\big[(\hat W(z,d)-w^*)^2\big]+\beta_{\text{unc}}\mathrm{Var}[\hat W]+\beta_{\text{chg}}(d-d_{\text{prev}})^2+\rho\max(0,d_{\text{prev}}-d)
\qquad (1)
$$

위 식은 목표 승률과의 차이, 예측의 불확실성, 난이도 급변, 난이도 하락에 각각 벌점을 준다.

> [!warning] 2층은 MAML이 아니다
> 2층의 적응은 이력을 GRU에 한 번 통과시키는 amortized posterior다. gradient step이 없다. 플레이어 모델을 MAML로 옮기는 일은 설계 중이다.

# 3. E1은 무엇을 보였나

E1은 플레이어 모델만 떼어 새 플레이어의 $k$번째 스테이지 뒤 예측 오차를 비교했다(기존 학습본 seed 3개, 재학습 없음, 페르소나 5종 × 40명). 결과를 정리하면 아래와 같다.

| 비교 | 결과 |
|---|---|
| meta vs prior 없는 scratch ($k=1$) | 0.02 vs 0.09 |
| meta vs 적응 없는 집단 prior | 차이 blackjack ≤0.01, matgo 0.01–0.02 |
| 개인화가 집단 prior를 이기는 곳 | stationary·OOD, 0.02–0.06 |
| 기존 closed-loop 평가의 target error (blackjack) | meta .038 vs static .034 |

위 표에서 보듯 **이득의 대부분은 "prior가 있다"에서 오고** 개인별 적응이 더하는 몫은 아직 작다. 컨트롤러 단에서는 meta가 static보다 나빴다.

E1 문서는 승률 표면이 실력에 둔감하다는 점($\partial W/\partial x$가 작다)을 이유로 꼽지만 이 가설은 확인하지 않았다.

사람 플레이 하니스는 있지만 사람 실험은 아직 하지 않았다. 즉, 모든 결과는 시뮬레이션 페르소나 위의 것이다.

# 4. 정리 — 무엇을 답했고 무엇이 남았는가

한 문장으로 줄이면 이렇다.

> staged-dda는 결정(난이도)과 반응(승수·일치율·반응시간)이 관측되는 두 층 실험장이고 지금까지의 결과는 meta prior의 이득은 보이지만 개인화의 이득은 아직 작다.

## 남은 문제 1: 저장소는 아직 Stage 3의 식이 아니다

README는 게임 DDA 문제로 쓰여 있다. 상위 변수(난이도 정책 $\psi$)가 하위 데이터 분포 $\mathcal{D}(\psi)$로 들어가는 재정식화, 곧 분포 사상을 명시하고 $\varepsilon$-sensitivity를 시뮬레이터에서 재는 일은 진행 중이다. 이 작업은 Track A 시리즈 [Personalization as Optimization](/notes/personalization-dda-bilevel-formulation/)(예정)에서 잇는다.

## 남은 문제 2: MAML로 옮기려니 분포가 필요하다

2층을 MAML로 옮기려고 설계하다 보면 곧 한 질문에 걸린다. 메타 학습에 어떤 플레이어들을 넣을 것인가.

다음 스테이지에서는 이 질문을 들고 MAML이 입력으로 받는 task 분포를 무엇으로 정할지 살펴본다.

# 연결

- 관련 프로젝트: [범용 staged-DDA](/projects/dda-blackjack/)
- 관련 실험: E1 적응 속도(meta·집단 prior·scratch), closed-loop static vs meta
- 다음에 확인할 질문: 어떤 플레이어들을 한 task 분포로 묶는가? → [Stage 5](/notes/roadmap-task-grouping-track-b/)
