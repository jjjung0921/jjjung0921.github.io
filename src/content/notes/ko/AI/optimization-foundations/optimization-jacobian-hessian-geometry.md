---
title: "Jacobian과 Hessian: 식으로 읽고 그림으로 보기"
lang: "ko"
translationKey: "optimization-jacobian-hessian-geometry"
date: "2026-09-24"
field: "ai"
category: "Optimization"
series: "Optimization Foundations"
order: 1
status: "draft"
summary: "MAML의 메타 기울기에 등장한 I − αH를 읽기 위해 Jacobian과 Hessian을 해석학(선형 근사·Taylor 전개)과 기하학(원이 타원으로 바뀌는 모습·등고선)의 두 눈으로 본다. 경사하강 한 걸음의 Jacobian이 곧 I − αH라는 데서 MAML로 돌아간다."
problem: "MAML의 ∂θ′/∂θ = I − αH와 Hessian-vector product를 식으로만 받아들이면 왜 그 모양인지, 언제 근사가 깨지는지 직관이 서지 않는다."
coreIdea: "Jacobian은 작은 변화를 옮기는 선형 지도이고 Hessian은 기울기가 움직이는 방식이다. 경사하강 한 걸음의 Jacobian은 I − αH이며, 그 고윳값 1 − αλ가 방향마다 오차를 얼마나 줄이는지를 정한다."
connection: "MAML Task Paradigms B1의 식 (7)·(8)을 뒷받침하는 기초 글이다. 하위 문제를 끝까지 푸는 bi-level(implicit gradient)로 넘어갈 때도 같은 도구를 쓴다."
tags: ["optimization", "jacobian", "hessian", "hvp", "maml", "geometry"]
---

# 0. 왜 다시 미분인가: MAML이 남긴 두 행렬

앞선 글([MAML은 task 분포를 주어진 것으로 놓았다](/notes/meta-maml-task-distribution-given/))에서 메타 기울기를 구하던 우리는 도중에 낯선 물건 두 개와 마주쳤다. 하나는 적응한 파라미터를 출발점으로 미분한 행렬 $I-\alpha H$이다. 다른 하나는 그 행렬을 직접 만들지 않고 곱만 하는 Hessian-vector product(HVP)다. 식은 따라갔지만 정작 이 질문에는 답하지 못했다.

> **$I-\alpha H$는 도대체 무엇을 하는 행렬인가?**

이 질문에 답하려고 Jacobian과 Hessian, 두 행렬을 두 가지 눈으로 살펴보자. 해석학의 눈으로는 "작은 변화를 식으로 어떻게 근사하는가"를 묻는다. 기하학의 눈으로는 "그 근사가 공간을 어떻게 휘고 늘리는가"를 본다.

글은 아래 5단계로 진행한다.

1. Jacobian: 작은 변화를 옮기는 선형 지도
2. Hessian: 기울기가 움직이는 방식, 그리고 지형의 모양
3. 경사하강 한 걸음을 Jacobian으로 보면 $I-\alpha H$가 나온다
4. HVP: Hessian을 만들지 않고 곱하기
5. MAML로 돌아가기

# 1. Jacobian: 입력의 작은 변화는 출력에서 어떻게 보이는가

## 1.1 해석학: 가장 좋은 선형 근사

함수 $F:\mathbb{R}^n\to\mathbb{R}^m$이 있다고 하자. 점 $x$에서 입력을 작은 벡터 $\delta$만큼 흔들면 출력도 얼마간 움직인다. 이 움직임을 선형으로 가장 잘 흉내 내는 행렬을 **Jacobian** $J_F(x)\in\mathbb{R}^{m\times n}$이라고 한다.

$$
\lim_{\delta\to 0}\frac{\lVert F(x+\delta)-F(x)-J_F(x)\,\delta\rVert}{\lVert\delta\rVert}=0
\qquad (1)
$$

가까운 곳에서는

$$
F(x+\delta)\approx F(x)+J_F(x)\,\delta
\qquad (2)
$$

가 된다. 성분으로 풀어 쓰면 $[J_F]_{ij}=\partial F_i/\partial x_j$이다. 행은 출력 성분을, 열은 입력 좌표를 맡는다. $j$번째 열은 입력을 $e_j$ 방향으로만 조금 밀었을 때 출력이 어느 방향으로 얼마나 움직이는지를 담는다.

구체적인 예로 확인해 보자. $F(x)=(x_1^2-x_2,\;3x_1x_2)$이면

$$
J_F(x)=\begin{pmatrix}2x_1 & -1\\ 3x_2 & 3x_1\end{pmatrix},
\qquad
J_F(1,1)=\begin{pmatrix}2 & -1\\ 3 & 3\end{pmatrix}
\qquad (3)
$$

이다.

> [!warning] 스칼라 함수의 Jacobian은 행벡터다
> $f:\mathbb{R}^n\to\mathbb{R}$이면 $J_f$는 $1\times n$ 행벡터이고 기울기 $\nabla f$는 그 전치인 열벡터다. 입력 공간과 출력 공간이 서로 다르니 이 행벡터에는 고윳값을 물을 수 없다.

## 1.2 기하학: 작은 원은 타원이 된다

식 (2)를 그림으로 옮기면 Jacobian의 정체가 한층 분명해진다. 입력에서 $x$ 주변에 아주 작은 원을 그리고 $F$로 보내면 출력에서는 근사적으로 타원이 된다. 선형 사상 $J_F(x)$는 이렇게 원을 타원으로 비튼다.

- 두 기저 방향 $e_1,e_2$는 각각 $J$의 두 열 $Je_1, Je_2$로 옮겨 간다. 식 (3)의 예에서는 $(2,3)$과 $(-1,3)$이다.
- 타원의 두 반지름은 $J$의 특이값만큼 늘거나 준다.
- 넓이는 $|\det J|$배가 된다. 식 (3)에서는 $|\det J| = 2\cdot3-(-1)\cdot3 = 9$이다.

![Jacobian은 작은 원을 타원으로, Hessian은 등고선 타원의 축과 반지름을 정한다|620](jacobian-hessian-geometry.svg "그림 1. (a) J = [2 −1; 3 3]은 입력의 작은 원을 타원으로 보내고 기저 방향을 J의 열로 옮긴다. 넓이는 |det J| = 9배가 된다. (b) 고윳값이 4와 1인 Hessian의 등고선. 고유벡터가 타원의 축이고, 곡률이 큰 방향일수록 반지름이 짧다.")

## 1.3 연쇄법칙은 Jacobian의 곱이다

함수를 이어 붙이면 작은 변화도 차례로 건너간다. $\delta$는 먼저 $G$를 지나 $J_G\,\delta$가 되고 그다음 $F$를 지나 $J_F J_G\,\delta$가 된다.

$$
J_{F\circ G}(x)=J_F\big(G(x)\big)\,J_G(x)
\qquad (4)
$$

이 곱을 벡터에 적용하는 길은 두 가지다. 오른쪽부터 곱하는 $J v$는 순전파 방향이며 이를 **JVP**(Jacobian-vector product)라고 한다. 왼쪽부터 곱하는 $u^\top J$, 곧 $J^\top u$는 역전파 방향이며 이를 **VJP**(vector-Jacobian product)라고 한다. 스칼라 손실 $\mathcal{L}(F(x))$의 기울기는

$$
\nabla_x\mathcal{L}=J_F(x)^\top\,\nabla\mathcal{L}\big(F(x)\big)
\qquad (5)
$$

이므로 역전파는 VJP를 층마다 이어 붙이는 일이다.

> [!info] 역전파가 싼 이유
> VJP 한 번에 드는 비용은 순전파의 상수 배 정도라고 알려져 있다. 파라미터가 수백만 개가 되어도 기울기 하나를 구하는 데 드는 비용은 크게 늘지 않는다. 뒤에서 볼 HVP가 싼 이유도 여기에 있다.

# 2. Hessian: 기울기는 어떻게 움직이는가

## 2.1 해석학: 기울기의 Jacobian, 방향별 곡률

스칼라 함수 $f:\mathbb{R}^n\to\mathbb{R}$의 **Hessian**은 기울기 $\nabla f$의 Jacobian이다.

$$
H=\nabla^2 f=J[\nabla f],
\qquad
[H]_{ij}=\frac{\partial^2 f}{\partial x_i\,\partial x_j}
\qquad (6)
$$

이 행렬을 읽는 방법은 두 가지다. 첫째, 식 (2)를 기울기에 그대로 적용하면 **기울기의 1차 변화**가 된다.

$$
\nabla f(x+\delta)\approx\nabla f(x)+H\,\delta
\qquad (7)
$$

둘째, 방향 $d$를 하나 골라 단면 $g(t)=f(x+td)$를 잘라 보면 **그 방향의 곡률**이 된다.

$$
g''(0)=d^\top H\,d
\qquad (8)
$$

이 두 읽기를 한데 합치면 2차 Taylor 전개가 나온다.

$$
f(x+\delta)\approx f(x)+\nabla f(x)^\top\delta+\tfrac12\,\delta^\top H\,\delta
\qquad (9)
$$

$f$의 2계 편미분이 연속이라면 편미분 순서를 바꿔도 결과가 같다(Schwarz 정리). 곧 $H$는 대칭이다. 대칭 행렬의 고윳값은 실수이고 고유벡터는 서로 직교하므로

$$
H=Q\Lambda Q^\top,
\qquad
\Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_n)
\qquad (10)
$$

로 쪼갤 수 있다. 앞서 우리는 Jacobian이 대칭일 이유가 없다고 했지만 Hessian은 기울기의 Jacobian이라서 대칭이 된다.

> [!warning] 축 방향만 보면 안장점을 놓친다
> $f=x_1^2+x_2^2-3x_1x_2$의 원점에서 $H=\begin{pmatrix}2&-3\\-3&2\end{pmatrix}$이다. 축 방향 곡률은 둘 다 $+2$인데 대각선 방향 $d=(1,1)/\sqrt2$의 곡률은 $d^\top Hd=-1$이다. 고윳값이 $5$와 $-1$이므로 원점은 최소점이 아니라 안장점이다.

## 2.2 기하학: 등고선 타원은 Hessian이 그린다

최소점 $x^\star$ 근처에서는 $\nabla f(x^\star)=0$이므로 식 (9)가

$$
f(x^\star+\delta)\approx f(x^\star)+\tfrac12\,\delta^\top H\,\delta
\qquad (11)
$$

가 된다. 등고선 $\{\delta:\tfrac12\delta^\top H\delta=c\}$는 타원이고 이 타원의 모양을 정하는 것은 전부 $H$다.

- 타원의 축은 고유벡터 $q_i$ 방향이다.
- 축 방향 반지름은 $\sqrt{2c/\lambda_i}$, 곧 $1/\sqrt{\lambda_i}$에 비례한다. 곡률이 큰 방향일수록 등고선이 촘촘하고 반지름이 짧다(그림 1(b)).
- 가장 긴 축과 가장 짧은 축의 비는 $\sqrt{\kappa}$이다. 여기서 $\kappa=\lambda_{\max}/\lambda_{\min}$을 **조건수**라고 한다.
- 고윳값에 음수가 하나라도 섞이면 등고선은 쌍곡선이 되고 그 점은 안장점이다.

> [!interpretation] 내 해석
> Jacobian은 공간을 어떻게 비트는지 알려 준다. Hessian으로는 지형이 어떻게 생겼는지를 읽는다. 공을 놓으면 가파른 방향으로는 빠르게 굴러떨어지고 평평한 방향으로는 느릿느릿 끌려온다. 조건수는 그 속도 차이가 얼마나 큰지 재는 수 하나다.

# 3. 경사하강 한 걸음을 Jacobian으로 보면

경사하강 한 걸음을 하나의 함수로 보면

$$
T(\theta)=\theta-\alpha\nabla\mathcal{L}(\theta)
\qquad (12)
$$

이다. 이 함수의 Jacobian을 식 (6)으로 계산해 보면

$$
J_T(\theta)=I-\alpha H(\theta)
\qquad (13)
$$

가 된다. 앞선 글에서 우리를 멈춰 세웠던 $I-\alpha H$가 바로 이것이다. 즉 **$I-\alpha H$는 경사하강 한 걸음이라는 사상의 Jacobian**이다.

손실이 이차식 $\mathcal{L}(\theta)=\tfrac12(\theta-c)^\top A(\theta-c)$이면 근사가 아니라 정확히

$$
\theta'-c=(I-\alpha A)(\theta-c)
\qquad (14)
$$

이다. 고유벡터 좌표로 옮겨 보면 방향마다 오차가 따로따로 $1-\alpha\lambda_i$배가 된다.

$$
\big(\theta'-c\big)_i=(1-\alpha\lambda_i)\,(\theta-c)_i
\qquad (15)
$$

**경사하강의 성질은 거의 다 이 한 줄에서 나온다.** 범위별로 정리하면 아래와 같다.

| $\alpha\lambda_i$의 범위 | 그 방향에서 일어나는 일 |
| --- | --- |
| $0<\alpha\lambda_i<1$ | 같은 쪽에서 조금씩 다가간다 |
| $\alpha\lambda_i=1$ | 한 걸음에 그 방향의 최적값에 닿는다 |
| $1<\alpha\lambda_i<2$ | 반대편으로 넘어가며 진동하면서 다가간다 |
| $\alpha\lambda_i\ge 2$ | 넘어갈 때마다 멀어져 발산한다 |

수렴하려면 모든 방향에서 $|1-\alpha\lambda_i|<1$이 성립해야 하며 이 조건은

$$
0<\alpha<\frac{2}{\lambda_{\max}}
\qquad (16)
$$

와 같다. 즉 **가장 가파른 방향이 걸음 크기를 정하고 가장 평평한 방향이 수렴 속도를 정한다.**

가파른 방향이 강하게 당겨지는 동안 평평한 방향은 $1-\alpha\lambda_{\min}$에 가까운 비율로 천천히 끌려온다. $\alpha$를 하나로 고정한다면 가장 좋은 $\alpha=2/(\lambda_{\max}+\lambda_{\min})$을 고르더라도 오차는 매 걸음 $(\kappa-1)/(\kappa+1)$배밖에 줄지 않는다.

조건수가 크면 경사하강이 지그재그로 느려지는 것도 이 때문이다.

> [!tip] 실험실에서 직접 보기
> [실험실의 MAML 이차 task 예시](/lab/maml-quadratic-tasks/)에서 $\alpha$를 키우면 $\alpha\lambda$가 1을 넘는 방향이 생기는 순간 FOMAML 경로가 흔들리다 발산한다. 식 (15)의 $1-\alpha\lambda$가 음수가 되는 자리다.

# 4. HVP: Hessian을 만들지 않고 곱하기

$H$는 어떻게 계산할까? **아예 만들지 않는다.** 파라미터가 $d$개면 $H$는 $d\times d$라서 $d=10^6$이면 성분이 $10^{12}$개나 된다. 계산은커녕 저장부터 불가능하다.

그런데 우리가 실제로 쓰는 것은 $H$ 자체가 아니다. 어떤 벡터 $v$에 곱한 결과 $Hv$만 있으면 된다.

$v$를 고정하면 $\nabla\mathcal{L}(\theta)^\top v$는 스칼라다. 이 스칼라를 $\theta$로 한 번 더 미분하면

$$
Hv=\nabla_\theta\big(\nabla_\theta\mathcal{L}(\theta)^\top v\big)
\qquad (17)
$$

가 된다. 즉 **역전파를 두 번 하면 $Hv$가 나온다.** 메모리는 기울기를 구할 때와 같은 $O(d)$만 들고 계산량도 기울기 계산의 상수 배 수준이다.

이 방법은 Pearlmutter(1994)가 체계화했다.

한편 식 (7)을 거꾸로 읽으면 유한차분 근사도 덤으로 얻는다.

$$
Hv\approx\frac{\nabla\mathcal{L}(\theta+\varepsilon v)-\nabla\mathcal{L}(\theta)}{\varepsilon}
\qquad (18)
$$

여기서 $Hv$는 "$v$ 방향으로 조금 움직였을 때 기울기가 변하는 양"이다. 즉 식 (7)을 곱의 형태로 다시 쓴 것이다.

# 5. MAML로 돌아가기

앞선 글의 식들을 다시 읽어 보자.

**한 걸음 적응.** 안쪽 적응 $\theta'=\theta-\alpha\nabla\mathcal{L}_{\mathcal{D}}(\theta)$는 식 (12)의 $T$ 그 자체이므로 $\partial\theta'/\partial\theta=I-\alpha H$는 식 (13)이고 메타 기울기는 식 (5)의 VJP다.

$$
\nabla_\theta\mathcal{L}_{\mathcal{D}'}(\theta')=(I-\alpha H)\,v=v-\alpha Hv,
\qquad
v=\nabla\mathcal{L}_{\mathcal{D}'}(\theta')
\qquad (19)
$$

여기에는 식 (17)의 HVP 한 번이면 된다.

**$K$ 걸음 적응.** 안쪽을 $K$번 밟으면 $\theta_{k+1}=T_k(\theta_k)$가 $K$번 이어진다. 연쇄법칙 (4)를 적용하면

$$
\frac{\partial\theta_K}{\partial\theta_0}=(I-\alpha H_{K-1})\cdots(I-\alpha H_1)(I-\alpha H_0),
\qquad
H_k=H(\theta_k)
\qquad (20)
$$

가 된다. 역전파는 $v$에 $(I-\alpha H_{K-1})$부터 하나씩 곱해 내려오므로 HVP가 $K$번 필요하다. 중간 파라미터 $\theta_0,\dots,\theta_K$도 모두 기억해 두어야 한다.

앞서 식 (15)에서 보았듯 각 인수는 방향마다 $1-\alpha\lambda$를 곱한다. 이 곱이 길어지면 메타 기울기는 방향에 따라 크게 줄어들거나 커질 수 있다.

**FOMAML.** 경로 2를 끊는 일은 식 (19)에서 $-\alpha Hv$를 버리는 것과 같다. 버린 양의 크기는

$$
\lVert\alpha Hv\rVert\le\alpha\,\max_i|\lambda_i|\,\lVert v\rVert
\qquad (21)
$$

로 묶인다. $\alpha\max_i|\lambda_i|\ll1$일 때, 곧 한 걸음이 곡률에 비해 작을 때 FOMAML은 MAML에 가까워진다.

> [!warning] 근사가 정확해지는 것과 MAML이 사라지는 것은 다르다
> $\alpha\to0$이면 식 (21)의 오차도 0으로 가지만 동시에 $\theta'=\theta$가 되어 적응 자체가 사라진다. FOMAML이 잘 맞는 조건과 MAML이 합동 학습으로 무너지는 조건은 구분해서 봐야 한다.

# 6. 정리 — 무엇을 답했고 무엇이 남았는가

이번 글이 답한 질문은 하나다. **"$I-\alpha H$는 무엇을 하는 행렬인가?"** 답은 경사하강 한 걸음의 Jacobian이었다. 이 행렬은 방향마다 오차를 $1-\alpha\lambda$배로 바꾸는 선형 지도이고 메타 기울기는 이 지도를 거꾸로 따라가는 VJP다.

한 눈에 정리하면 아래와 같다.

| 개념 | 해석학의 눈 | 기하학의 눈 | MAML에서의 자리 |
| --- | --- | --- | --- |
| Jacobian $J$ | 가장 좋은 선형 근사, 식 (1)·(2) | 작은 원을 타원으로 | $\partial\theta'/\partial\theta$ |
| 연쇄법칙 | Jacobian의 곱, 식 (4) | 비틀기를 차례로 겹치기 | $K$ 걸음의 곱, 식 (20) |
| Hessian $H$ | 기울기의 Jacobian, 2차 Taylor, 식 (6)·(9) | 등고선 타원의 축과 반지름 | 경로 2의 $-\alpha H$ |
| 고윳값 $\lambda$ | 방향별 곡률, 식 (8) | 반지름 $\propto 1/\sqrt{\lambda}$ | 적응이 방향마다 $1-\alpha\lambda$배 |
| HVP | 기울기를 한 번 더 미분, 식 (17) | 방향으로 움직일 때 기울기의 변화 | 메타 기울기 계산, 식 (19) |

## 남은 문제: 하위 문제를 끝까지 풀면?

MAML은 안쪽 적응을 몇 걸음에서 끊으므로 $\theta'$가 $\theta$의 명시적인 식으로 주어졌다. 하지만 일반적인 bi-level 문제에는 이런 식이 없다. 하위 문제를 끝까지 풀어 최적해 $\theta^\star(\lambda)$를 얻고 그 최적해를 쓰기 때문이다.

이때는 최적성 조건 $\nabla_\theta\mathcal{L}(\theta^\star,\lambda)=0$을 음함수로 보고 미분해야 한다. 그 과정에서 $H^{-1}$에 벡터를 곱해야 한다. 여기서 다음 질문이 나온다.

> **Hessian을 만들지 않고 $H^{-1}v$를 구할 수 있는가?**

다음 글에서는 이 질문을 들고 implicit function theorem으로 hypergradient를 구하는 방법을 살펴보자.

# 참고문헌

- Pearlmutter, Barak A. "Fast exact multiplication by the Hessian." Neural Computation 6.1 (1994): 147–160.
- Finn, Chelsea, Pieter Abbeel, and Sergey Levine. "Model-agnostic meta-learning for fast adaptation of deep networks." ICML, 2017.
- Nocedal, Jorge, and Stephen J. Wright. Numerical Optimization. 2nd ed., Springer, 2006.
- Boyd, Stephen, and Lieven Vandenberghe. Convex Optimization. Cambridge University Press, 2004. Appendix A.

# 연결

- 이전 글: [MAML은 task 분포를 주어진 것으로 놓았다](/notes/meta-maml-task-distribution-given/)
- 관련 실험: [MAML 이차 task 예시](/lab/maml-quadratic-tasks/)
- 다음 글: [FOMAML은 언제 MAML과 갈라지나](/notes/optimization-fomaml-alpha-lambda/) — 식 (21)의 조건이 깨질 때
- 다음에 확인할 질문: 하위 문제를 끝까지 풀 때 $H^{-1}v$를 어떻게 구하는가?
