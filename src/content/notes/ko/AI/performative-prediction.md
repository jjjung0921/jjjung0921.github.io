---
# Recommended paths:
# - src/content/notes/ko/<field>/<slug>.md
# - src/content/notes/<field>/<slug>.md
# Folder names are authoring-only. The public URL uses the file name.
title: "Performative Prediction: 변화를 예측하다."
lang: "ko"
translationKey: "Performative-Prediction"
date: "2026-07-21"
# field: "web" | "game" | "programming-language" | "ai"
field: "ai"
category: "Performative Prediction"
series: "Performative Prediction"
# status: "draft" | "reading" | "implemented" | "stable"
status: "draft"
summary: "기존의 머신러닝은 데이터의 분포가 고정된 상태에서 설계되었다. 그러나 모델의 결정이 결정 이후의 데이터의 분포를 변화시킨다면 우리는 이를 어떻게 예측할 것인가. Performative Prediction은 이에 대한 문제를 정식화한다."
problem: "Data의 distribution이 performative할 때, 우리는 이를 어떻게 예측할 것인가."
coreIdea: ""
connection: "DDA에서 사용자의 실력을 향상 시키는 방향으로 Opponent model을 설계할 수 있는가?"
tags: ["optimizaiton", "performative prediction"]
---

# 우리의 결정은 환경을 변화시킨다.

## 0. GMS theorem: 우리의 예측이 정확할 수 있는가

기존의 Machine Learning의 기법은 **Data($Z$)의 분포($D$)가 fixed**($Z\sim D$)된 환경에서의 동작을 위해 설계되었다.

그러나 1954년, Grunberg와 Modigliani는 prediction 자체가 환경을 바꿀 수 있는 power를 가질 경우를 생각하게 된다. 이를 **public prediction**이라고 하며 우리의 예측($\hat{y}$)이 공개된 뒤 사회의 실제 반응($R(\hat{y})$)이 우리의 예측과 동일할 수 있는지에 대한 질문이다.

$$
\hat{y} = R(\hat{y})
$$

위에 대한 존재성은 $R$의 연속성과 Brouwer 고정점 정리를 통해 존재 가능하다는 것이 증명되었다.

다만 GMS는 해의 존재성만을 증명하며 스칼라값에서만 동작한다. 이를 분포로 확장하고 해를 구하는 방식으로 확장한 ML 기법이 Performative Prediction(PP)이다.

## 1. Performative Prediction: 어떻게 정확한 예측값을 찾을 수 있는가

### GMS Theorem formulate

앞서 간단하게 살펴본 GMS theorem의 문제를 정의해본다.

- 결과 공간인 $S \in [0,1]$ 이며 compact, convex 하다.
- 응답함수인 $R: S \rightarrow S$ 이며 연속이다.

이때, $\exists\hat{y}^* \in S\::\:\hat{y}^*=R(\hat{y}^*)$ 이 성립하는가?

위 문제를 ML에 직접 적용하기에는 아래와 같은 제약이 존재한다.

1. 예측이 스칼라 집계량이다.
   - GMS에서의 $\hat{y}$은 스칼라 하나다. 하지만 ML에서는 **함수인 $f_\theta$**를 에측해야 한다. 그리고 함수의 input은 여러 특성이 모인 벡터 이상의 $x$가 된다.
2. 결과가 값이지 분포가 아니다.
   - 1번과 유사하게 GMS에서 $R(\hat{y})$의 결과값인 $y$는 하나의 스칼라일 뿐이다. ML에서 요구하는 $(x,y)$ 쌍의 결합 분포가 아니다. 이를 해결하기 위해서는 분포에서 사용할 거리 개념을 다시 세워야 한다.
3. 해의 존재성만을 보여준다.
   - GMS는 해의 존재성만을 증명하기에 **"좋은 예측"이라는 개념이 부재**하다. 특히, $\hat{y}=R(\hat{y})$는 완벽한 예측을 요구하기에 ML에서의 실현은 불가능하다.
4. $R$을 안다고 가정한다.
   - GMS는 응답함수 $R$이 trivial한 상태를 가정한다. ML에서는 $\mathcal{D}(\theta)$는 알 수 없다. 배포한 뒤 유한적인 데이터만을 관측할 수 있다.

## 2. Extends GMS to PP

위 제약들을 해결하여 GMS를 ML로 확장한 것이 PP이다. 각 제약을 어떻게 풀어냈는지 살펴보자.

### **Distribution Map - "key conceptual device"**

모델 파라미터($\theta \in \Theta \subseteq \mathbb{R}^d$)를 예측하고 이에 따른 결과에 **분포**를 대입한다.

$$
R:[0,1]\rightarrow[0,1]\Rightarrow \mathcal{D}:\Theta\rightarrow
\Delta(\mathcal{X}\times\mathcal{Y})
$$

이때, $\mathcal{X}\in{\R^d}$인 input이고 $\mathcal{Y}\in\R$인 output이다. 이제 이 분포의 오차값을 측정하기 위해 Wasserstein-1 distance를 도입한다.

$$
\mathcal{W}(\mathcal{D}(\theta),\mathcal{D}(\theta '))\leq\epsilon\Vert\theta-\theta '\Vert_2
$$

이렇게 등장한 분포 $\mathcal{D(\theta)}\in\Delta(\mathcal{X}\times\mathcal{Y})$에서 모델의 성능을 측정하기 위해 새로운 목적함수 $\text{Risk}$를 도입한다.

$$
\text{Risk}(\theta, \mathcal{D(\theta)}) = \mathbb{E}_{z\sim \mathcal{D}}[\ell(\theta;z)]
$$

이제, PP에서 묻는 질문은 두 가지가 된다.

1. $D(\theta)$가 제대로 분포를 예측하는가.
2. $\text{Risk}(\theta, \mathcal{D(\theta)})$가 결과값을 잘 에측하는가.

우리는 위 두 질문에 대해 각각의 평가 기준을 세워서 평가하고자 한다.

### Performative Stability: GMS fixed Point

$$
\theta_{\text{PS}}=\argmin_\theta \mathbb{E}_{Z\sim \mathcal{D}(\theta_{\text{PS}})}\ell(Z;\theta)
$$

$\theta_{\text{PS}}$는 좌변에서 데이터($Z$)의 분포$(D(\theta_{\text{PS}}))$를 구성한다. 이와 동시에 우변에서는 $Z\sim \mathcal{D}(\theta_{\text{PS}})$ 환경에서 모델을 통한 예측 후에 분포를 구성하는 파라미터의 output이 된다.

즉, **예측 전과 예측 후의 데이터 분포가 동일**하다는 것을 의미한다. 이는, GMS fixed point와 동일한 역할을 분포라는 확장된 환경에서 수행한다.

Performative Stability는 **1) 모델이 생성된 환경**과 **2) 모델이 평가되는 환경**이 분리된다. 따라서 평가받는 모델의 환경과 평가하는 환경을 분리하여 얼만큼의 차이를 가지는 지 측정할 수 있어야 한다. 이를 **Decoupled Performative Risk(DPR)로** 정의한다.

$$
\text{DPR}(\theta,\theta ')\stackrel{\text{def}}{=}\mathbb{E}_{Z\sim \mathcal{D}(\theta)}\ell(Z;\theta')
$$

위 식에서는 **$\theta$ 모델을 통해 생성된 세계**에서 **$\theta'$로 구성된 모델**이 채점된다.

이를 $\text{PS}$에서 해석하면 $\theta_\text{PS}=\argmin_\theta\text{DPR}(\theta_{\text{PS}},\theta)$가 된다.

즉, $\theta_{\text{PS}}$가 만든 환경에서 $\theta$를 통해 생성된 모델을 평가하는데, 평가되는 환경과 모델이 생성되는 환경이 동일하다면 이는 **Performative stable**하다고 할 수 있다.

### Performative Optimality: Stackelberg equilibria

$$
\text{PR}(\theta)\stackrel{\text{def}}{=}\mathbb{E}_{Z\sim\mathcal{D}(\theta)}\ell(Z;\theta)\\
\theta_{PO}=\argmin_\theta\text{PR}(\theta)
$$

stable한 분포를 찾았다면, 이제는 기존 ML과 유사하게 해당 분포에서 최적의 성능을 보이는 모델을 찾으면 된다. 이를 정량화하기 위해 등장하는 개념이 Performative Risk(PR)이다.

**Performative Risk**는 $\theta$에 의해 정의되는 모델을 배포한 뒤, 그로 인해 탄생하는 데이터 분포($\mathcal{D}(\theta)$)에서 모델의 성능을 측정한 값이다. 이때, 모델의 형태 또한 환경과 마찬가지로 $\theta$에 관련된 함수이다.

PR은 **모델이 탄생시킨 데이터 환경에서** 모델의 성능을 측정한다는 점에서 앞서 살펴본 *DPR*과는 차이가 있다.

앞서 우리는 $\theta$가 모델-환경 쌍을 구성한다는 것을 확인했다. $\theta$가 만드는 (모델, 그 모델이 유발한 환경) 쌍들 중에서, 그 쌍의 손실이 가장 낮은 것을 우리는 **Performative Optimality**라고 한다.

### PR와 DPR의 시각적 비교

![PR vs DPR|500](image.png "그림 1. PR은 모델이 만든 환경에서, DPR은 분리된 환경에서 성능을 측정한다.")

## 3. How to find stable points?

이제 우리는 Performative Prediction 문제를 정의할 수 있게 되었다. 그렇다면 해는 어떻게 구할까? 이를 알기 위해서는 우선적으로 **수렴 가능성(convergence)** 에 대한 판단이 우선되어야 한다.

### 3.0 Repeated risk minimization

Performative Prediction의 동작 과정을 복기해보자. 우리의 최적화 대상은 $\theta$이다.

1. $\theta$를 바꾸면 모델이 예측하는 분포의 모양이 바뀌며 그에 따라 손실 지형의 최소점 또한 이동한다.
2. 모델의 변화에 따른 실제 정답 데이터의 분포가 바뀐다.

이때, "모델 배포 → 새 데이터 수집 → 그 데이터로 다시 학습 → 재배포"라는 일련의 과정을 **Repeated risk minimization(RRM)** 이라고 하며 이를 식으로 표현하면

$$
\theta_{t+1}=G(\theta_t)\stackrel{\text{def}}{=}\argmin_{\theta\in\Theta}\mathbb{E}_{\mathcal{Z}\sim\mathcal{D}(\theta_t)}\ell(Z;\theta)
$$

가 된다.

수렴을 위해서는 1번을 통한 수렴의 속도가 2번의 속도보다 빨라야 모델의 성능이 다음에 탄생하는 환경에서도 개선될 것이다.

### 3.1 $\varepsilon$-sensitivity

분포의 변화량을 확인하기 위해 Wasserstein-1 distance($W_1$)을 도입한다. 이를 $L_2$를 적용한 $\theta$ 변화량과 비교하여 분포 변화의 민감도를 구한 것이 $\varepsilon$-sensitivity이다. 정의는 아래와 같다.

$$
W_1(\mathcal{D}(\theta),\mathcal(\theta'))\leq\varepsilon\Vert\theta-\theta'\Vert_2
$$

> [!info] Wasserstein distance는 확률 분포 간의 거리를 측정하는 방법이다.

### 3.2 $\gamma$-strongly convex

> [!tip] 볼록성과 관련된 내용은 최적화와 밀접한 관련이 있기에 따로 정리해보고자 한다.

RRM은 **고정점 반복(fixed-point iteration)** 이며 **수축(contraction)** 을 보장하는 정량적 수치가 강볼록성이다.

$$
[
\ell(z;\theta)
\ge
\ell(z;\theta')
+
\nabla_{\theta}\ell(z;\theta')^{\top}(\theta-\theta')
+
\frac{\gamma}{2}\|\theta-\theta'\|_2^2,
\qquad
\forall \theta,\theta'\in\Theta,\; z\in\mathcal Z.
]
$$

### 3.3 $\beta$-jointly smooth

$$
[
\left\|
\nabla_{\theta}\ell(z;\theta)
-
\nabla_{\theta}\ell(z;\theta')
\right\|_2
\le
\beta
\left\|
\theta-\theta'
\right\|_2,
\qquad
\forall \theta,\theta'\in\Theta,\; z\in\mathcal Z,
]

[
\left\|
\nabla_{\theta}\ell(z;\theta)
-
\nabla_{\theta}\ell(z';\theta)
\right\|_2
\le
\beta
\left\|
z-z'
\right\|_2,
\qquad
\forall \theta\in\Theta,\; z,z'\in\mathcal Z.
]
$$

$\theta$와 $z$에 대한 $\nabla_\theta\ell(z;\theta)$의 $\beta$-Lipschitz를 따지는 것이다. 이는 파라미터에 의한 학습 gradient의 민감도를 따진다. 만약, 학습 gradient의 민감도가 너무 크다면(eg. $\beta=\infty$) gradient가 제멋대로 튀며 학습이 되지 않는다.

> [!tip] Lipschitz는 **축약사상(contraction map)** 에 대한 개념과 연관이 있으므로 축약 사상과 함께 따로 다뤄보겠다.

### 3.4 Proof of Convergence

이제 수렴 증명을 위한 토대를 모두 준비되었다.

## 메커니즘

```ts
// 필요하면 최소 코드 또는 의사코드를 둔다.
```

## 연결

- 관련 프로젝트:
- 관련 실험:
- 다음에 확인할 질문:
