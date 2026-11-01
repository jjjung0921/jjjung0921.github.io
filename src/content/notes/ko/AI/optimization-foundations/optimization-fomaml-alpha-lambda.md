---
title: "FOMAML은 언제 MAML과 갈라지나: αλ로 보는 1차 근사의 한계"
lang: "ko"
translationKey: "optimization-fomaml-alpha-lambda"
date: "2026-10-09"
field: "ai"
category: "Optimization"
series: "Optimization Foundations"
order: 2
status: "draft"
summary: "MAML 논문은 FOMAML이 거의 같은 성능을 낸다고 보고했지만 조건은 달지 않았다. 버리는 항의 크기를 정하는 αλ를 기준으로, 볼록 이차 task에서 FOMAML이 발산하거나 다른 점으로 가는 예를 만들고, 사인파 회귀를 원 코드로 다시 돌려 학습된 MAML이 실제로 αλ≈2 근처에 있음을 확인한다."
problem: "FOMAML은 2차 항 αHv를 버리는 근사인데, 원 논문은 이 근사가 언제 성립하는지 말하지 않고 한 설정의 결과와 'ReLU 망은 거의 선형'이라는 추측만 남겼다."
coreIdea: "근사의 성패는 볼록성이 아니라 걸음과 곡률의 곱 αλ가 정한다. αλ>1인 방향이 있으면 FOMAML은 발산할 수 있고, αλ가 작지 않으면서 task마다 곡률이 다르면 고정점이 MAML과 갈라진다."
connection: "Optimization Foundations 1편(Jacobian과 Hessian)의 식 (21)이 남긴 조건 αmax|λ|≪1을 실험으로 따져 본다. MAML Task Paradigms B1의 FOMAML 문단에서 갈라져 나온 글이다."
tags: ["optimization", "maml", "fomaml", "hessian", "curvature", "meta-learning"]
---

# 0. 왜 이 질문인가

앞선 글([Jacobian과 Hessian](/notes/optimization-jacobian-hessian-geometry/))의 식 (21)에서 우리는 FOMAML이 버리는 양을 이렇게 묶었다.

$$
\lVert\alpha Hv\rVert\le\alpha\,\max_i|\lambda_i|\,\lVert v\rVert
$$

그리고 "$\alpha\max_i|\lambda_i|\ll1$이면 FOMAML은 MAML에 가까워진다"고 적었다. 이번 글에서는 그 반대쪽을 살펴보자.

> **$\alpha\lambda$가 작지 않으면 무슨 일이 생기는가? 그리고 실제로 학습된 MAML은 어느 쪽에 있는가?**

아래 6단계로 따라가 보자.

1. 논문이 FOMAML에 대해 말한 것
2. 버리는 항의 크기를 정하는 $\alpha\lambda$
3. 볼록인데도 깨지는 예
4. 실패는 두 종류다
5. 신경망에서: 사인파 회귀를 원 코드로 다시 돌리기
6. 정리 — 아직 모르는 것

# 1. 논문이 말한 것

먼저 논문이 FOMAML에 대해 무엇을 말했는지 확인해 보자. MAML 원문([B1](/notes/meta-maml-task-distribution-given/)에서 읽은 논문)은 FOMAML에 조건을 달지 않는다. 근거는 MiniImagenet 한 설정에서 정확도가 거의 같았다는 관찰이다(5-way 1-shot 48.07±1.75 vs 48.70±1.84, Table 1).

이유로는 "ReLU 망은 국소적으로 거의 선형이라 2차 미분이 대부분 0에 가까울 수 있고, 이것이 1차 근사의 좋은 성능을 **부분적으로** 설명한다"는 추측을 든다(§5.2). 곡률을 직접 재지는 않았다.

이 추측에는 짚을 점이 하나 있다. 국소 선형성은 대개 **입력**에 대한 이야기인데, FOMAML이 버리는 것은 **파라미터**에 대한 Hessian이다. 출력은 층의 가중치들이 곱해져 만들어지므로 ReLU 망이어도 파라미터 Hessian은 0이 아니다.

# 2. 버리는 항의 크기를 정하는 것: $\alpha\lambda$

두 방법의 차이부터 보자. MAML의 메타 기울기는 $(I-\alpha H)v$, FOMAML은 $v$다. 차이는 $\alpha Hv$ 한 항이다.

$H$의 한 고유방향에서 곡률을 $\lambda$라 하면, 그 방향에서 MAML은 기울기에 $(1-\alpha\lambda)$를 곱하고 FOMAML은 곱하지 않는다. 앞선 글의 식 (15)에서 본 "경사하강 한 걸음이 방향마다 오차를 $1-\alpha\lambda$배로 바꾼다"와 같은 인자다.

즉 근사가 맞는지는 **손실이 볼록인지가 아니라 $\alpha\lambda$로 정해진다.** 경우를 나누면 아래 3가지다.

- $\alpha\lambda\ll1$: $(1-\alpha\lambda)\approx1$이라 둘이 가깝다.
- $\alpha\lambda\approx1$: MAML은 그 방향의 기울기를 거의 지우고 FOMAML은 그대로 쓴다.
- $\alpha\lambda>1$: $(1-\alpha\lambda)$가 음수가 되어 MAML은 그 방향을 **뒤집어** 쓰고 FOMAML은 그대로 쓴다.

# 3. 볼록인데도 깨지는 예

1차원 예를 직접 만들어 보자. task 두 개가 $\mathcal{L}_i(\theta)=\tfrac{\lambda_i}{2}(\theta-c_i)^2$이고 $c=(-1,1)$, $\lambda=(1,3)$이라 하자. 두 task 모두 강볼록이다. 적응은 $\theta_i'=\theta-\alpha\lambda_i(\theta-c_i)$이고, 두 방법이 멈추는 점은 아래 식으로 정해진다.

$$
\text{MAML: } \sum_i \lambda_i(1-\alpha\lambda_i)^2(\theta-c_i)=0,
\qquad
\text{FOMAML: } \sum_i \lambda_i(1-\alpha\lambda_i)(\theta-c_i)=0
$$

두 식에서 task별 가중치는 $(1-\alpha\lambda_i)$ 한 번만큼 다르다. 값으로 비교하면 아래와 같다.

| $\alpha$ | $\alpha\lambda_2$ | MAML 고정점 | FOMAML 고정점 | 샘플링 SGD로 학습하면 |
| --- | --- | --- | --- | --- |
| 0.05 | 0.15 | 0.41 | 0.46 | 둘 다 근처로 수렴 |
| 0.5 | 1.5 | 0.5 | 2.0 (불안정) | MAML은 0.5로 수렴, FOMAML은 seed 5개 모두 발산 |

$\alpha=0.5$에서 FOMAML 쪽 task 2의 가중치 $\lambda_2(1-\alpha\lambda_2)=-1.5$가 음수가 된다. 가중치의 합이 $0.5-1.5=-1<0$이라, FOMAML이 따라가는 방향은 고정점에서 **멀어지는** 쪽을 가리킨다.

MAML의 목적식은 이때도 볼록이다. 문제는 FOMAML의 방향이 어떤 목적식의 기울기도 아니라는 데 있다.

# 4. 실패는 두 종류다

같은 계산을 2차원 이차 task로 해 보자($A_i$는 task $i$의 Hessian). 실패는 아래 2가지로 나뉜다.

1. **발산.** FOMAML이 따라가는 벡터장의 Jacobian은 $\tfrac{1}{N}\sum_i A_i(I-\alpha A_i)$이다. 여기에 음의 고유값이 생기면 FOMAML은 그 방향으로 발산한다. 그러려면 어떤 방향에서 $\alpha\lambda>1$이어야 한다.

   이 실패는 task들의 곡률이 **모두 같아도** 일어난다. $A_1=A_2=\mathrm{diag}(1,3)$, $\alpha=0.5$에서 두 방법의 고정점은 똑같이 $c_i$의 평균이지만, Jacobian 고유값이 $(-1.5,\,0.5)$라 FOMAML은 그 점에 머물지 못한다.
2. **엇나감(편향).** 곡률이 모든 task에서 같으면 위 식의 공통 인자가 약분되어 $\alpha$와 상관없이 고정점이 같다. 고정점이 갈라지려면 $\alpha\lambda$가 작지 않으면서 **task마다 곡률이 달라야** 한다.

   3절의 예에서 $\lambda=(1,3)$로 다르게 잡은 이유다. $A_1=\mathrm{diag}(1,3)$, $A_2=\mathrm{diag}(3,1)$로 곡률을 엇갈리게 두면 $\alpha=0.1$에서 이미 고정점이 $(0.29, 0.15)$와 $(0.40, 0.20)$으로 벌어진다.

정리하면 "FOMAML ≈ MAML"에는 조건이 두 개 필요하다. 모든 방향에서 $\alpha\lambda<1$이어서 발산하지 않아야 하고, $\alpha\lambda$가 충분히 작거나 task 간 곡률이 비슷해야 고정점이 가깝다.

# 5. 신경망에서: 사인파 회귀를 원 코드로 다시 돌리기

이차 task는 장난감이다. 실제 MAML은 어디에 있을까? 우리는 논문의 사인파 회귀를 원 코드(`cbfinn/maml`)로 다시 돌려 봤다. 설정은 아래와 같다.

- **설정**: 40-40 ReLU MLP, $\alpha=0.01$(논문 §5.1), 10-shot으로 학습하고 5-shot으로 평가했다. 평가는 원 코드가 고정한 600개 task다. FOMAML은 저장소에 있는 `--stop_grad` 플래그를 썼다. 방법마다 run 5개를 돌렸다.
- **환경**: TF 1.x 환경을 구할 수 없어 TF 2의 호환 모드에서 import 몇 줄만 바꿔 돌렸다. 원 코드가 학습 seed를 고정하지 않아 표본 단위는 run이다.

먼저 **1 step 뒤 MSE**(600 task 평균, run별)를 비교하면 아래와 같다.

| | run 5개 | 평균 ± 표준편차 |
| --- | --- | --- |
| MAML | 0.647, 0.633, 0.663, 0.652, 0.644 | $0.648\pm0.011$ |
| FOMAML | 1.07, 0.731, 0.842, 1.12, 0.698 | $0.893\pm0.194$ |

가능한 25개 run 쌍 모두에서 FOMAML이 나빴다. run 단위 순열검정의 $p$는 $0.0079$로, 5대5에서 나올 수 있는 최솟값이다. MAML 쪽 값은 논문 Table 2의 0.67과도 맞는다.

평균만 나쁜 게 아니라 FOMAML은 run마다 훨씬 들쭉날쭉하다.

**학습된 초기값의 곡률.** 이번에는 학습이 끝난 초기값에서 task 손실 Hessian의 최대 고유값 $\lambda_{\max}$를 쟀다. 우리는 HVP와 power iteration으로 task 100개를 재고 중앙값을 냈다. 서로 다른 $\alpha$($0.001$–$0.3$)로 학습한 실행 9개에서 모두 다음이 나왔다.

$$
\alpha\lambda_{\max}\approx1.7\text{–}3.5
$$

$\alpha=0.001$로 학습하면 $\lambda_{\max}\approx1771$이 되어 곱은 여전히 2 근처다. 학습이 곡률을 $2/\alpha$ 근처로 맞춰 가는 듯하다.

**적어도 이 설정에서는 "$\alpha H$가 작아서 버려도 된다"는 전제가 성립하지 않는다.** 1절의 국소 선형성 추측과도 맞지 않는다.

# 6. 정리 — 무엇을 답했고 무엇이 남았는가

정리하면 아래와 같다.

| 질문 | 답 | 근거 |
| --- | --- | --- |
| FOMAML이 버리는 것은? | 메타 기울기의 $\alpha Hv$ 항 | 식 (21), 2절 |
| 근사의 성패를 정하는 양은? | 볼록성이 아니라 $\alpha\lambda$ | 2절 |
| 볼록이면 안전한가? | 아니다. $\alpha\lambda>1$이면 발산할 수 있다 | 3절 1D 예 |
| 고정점은 언제 갈라지나? | $\alpha\lambda$가 작지 않고 task 간 곡률이 다를 때 | 4절 |
| 실제 MAML은 어디에 있나? | 사인파에서는 $\alpha\lambda_{\max}\approx2$ | 5절 |

## 아직 모르는 것

아직 확인하지 못한 것은 아래 3가지다.

- FOMAML run 중에도 0.698, 0.731처럼 MAML에 가까운 것이 있었다. $\alpha\lambda\ll1$은 충분조건이지 필요조건이 아니다. 무엇이 둘을 가르는지, 곧 곡률 이질성인지 다른 무엇인지는 확인하지 못했다.
- 처음에 우리는 "FOMAML이 곡률이 큰 곳으로 간다"고 생각했다. 하지만 MAML 초기값도 $\alpha\lambda_{\max}\approx2.5$여서 이 가설은 버렸다.
- 결과의 범위가 좁다. 문제 하나(사인파 회귀), 구조 하나, 적응 1 step이다. 원 논문의 MiniImagenet 결과와 충돌하지는 않는다. 설정이 다를 뿐이다.

> **다음에 확인할 질문:** 4절의 두 지표(FOMAML 벡터장의 최소 고유값, 그리고 $\alpha Hv$의 상대 크기)를 학습 중에 재면, FOMAML로 충분한지를 미리 판별할 수 있을까?

# 참고문헌

- Finn, Chelsea, Pieter Abbeel, and Sergey Levine. "Model-agnostic meta-learning for fast adaptation of deep networks." ICML, 2017. — §5.1(사인파 설정), §5.2(1차 근사), Table 1·2.
- Pearlmutter, Barak A. "Fast exact multiplication by the Hessian." Neural Computation 6.1 (1994): 147–160. — HVP.

# 연결

- 이전 글: [Jacobian과 Hessian: 식으로 읽고 그림으로 보기](/notes/optimization-jacobian-hessian-geometry/)
- 갈라져 나온 글: [MAML은 task 분포를 주어진 것으로 놓았다](/notes/meta-maml-task-distribution-given/)
- 관련 실험: [MAML 이차 task 예시](/lab/maml-quadratic-tasks/)
