---
title: "MAML은 task 분포를 주어진 것으로 놓았다"
lang: "ko"
translationKey: "meta-maml-task-distribution-given"
date: "2026-09-22"
field: "ai"
category: "Meta-Learning"
series: "MAML Task Paradigms"
order: 1
status: "draft"
summary: "MAML은 적응 뒤의 손실로 출발점을 학습하지만, 어떤 task들을 한 분포로 묶을지는 입력으로 주어진 것으로 둔다."
problem: "빨리 배우는 능력을 optimizer·metric·memory 같은 모델 밖 장치에 두거나, 적응을 목적에 넣지 않은 채 평균적으로 좋은 초기값을 찾았다."
coreIdea: "task 분포 p(T)는 알고리즘의 입력이다. 논문은 그 분포를 만들거나 고르는 기준을 다루지 않고, 실험의 task family는 실험자가 정한 단일 범위다."
connection: "알고리즘은 그대로 쓰고 task를 묶는 기준을 연구 대상으로 삼는다. 다음 글(Khodak)이 task 유사도를 최적해 집합의 지름으로 정의한다."
tags: ["meta-learning", "maml", "task-distribution", "few-shot"]
---

# MAML은 task 분포를 주어진 것으로 놓았다

## 한 문장 요약

<!-- 작성: MAML이 무엇을 학습하는지 한 문장. frontmatter summary와 같게 둔다. -->
이전 연구들은 optimizer·metric·memory처럼 모델 밖의 장치로 빠른 학습을 꾀하거나, Task들의 집합($\mathcal{T}$)에서 평균적으로 좋은 성능을 내는 parameter에서 fine-tuning을 시작했다. 하지만 MAML은 가장 빠른 fine-tuning이 가능한 지점이 좋은 meta parameter라고 정의하고 그 지점을 찾는 기법으로 MAML을 제시한다. MAML은 gradient descent를 활용하는 모델이라면 제약 없이(model-agnostic) 사용 가능하다.

## 1. 이전 방식의 한계

<!-- 공통 질문 1. 직전 방식(메트릭 기반·블랙박스/메모리 기반 메타러닝, 사전학습 후 fine-tuning)이 못 한 것을 한 문장으로. 근거는 원문 Introduction·Related Work. -->
적은 데이터로 빠른 학습(few-shot learning)을 꾀하는 기법에는 네 가지 방법이 있었다.

1. **update rule 혹은 optimizer를 학습시킨다.**

    이 방식에서 meta-learning은 meta-learning의 대상 모델이 아닌 새로운 축에 살면서 새로운 모델을 학습시킨다. 그만큼 meta-learning을 위한 파라미터가 추가로 생기고, 갱신 규칙 자체를 학습해야 하는 문제가 있다.

2. **metric 비교 기반**

    이 방식은 새로운 사영 공간을 학습하고 데이터를 그 사영 공간에 사영한다. 새롭게 등장하는 TASK를 학습된 공간에 사영하고 기존 support 예시도 같은 공간에 놓은 뒤 가장 가까운 쪽의 라벨을 받는다. 비모수 분류에는 유리하지만 RL과 같은 여러 모델에 이식하기 어려워 Transferability가 떨어진다.

3. **memory-augmented·recurrent**

    데이터를 통째로 학습하는 RNN을 만든다. RNN의 특정 구조를 요구하므로 새로운 모델 설계가 필요해 불리하다.

4. **pretraining을 통한 fine-tuning**

    "적응"이라는 개념이 배제된다. 여러 사인파에 적응한 모델은 catastrophic overfitting에 의해 적은 데이터를 통한 fine-tuning으로는 새로운 task에 적응하지 못한다.

## 2. 핵심 아이디어: 무엇을 최적화하나

<!-- 공통 질문 2의 답은 4절에 온다. 2·3절은 그 가정을 이해하는 데 필요한 만큼만. -->
모델 학습이 gradient descent based fine-tune 방식으로 진행된다면 gradient descent가 빠르게 진행될 수 있는 지점을 찾는다. 그러면 적은 step 수만으로도 새로운 task에 빠르게 적응한다. 이 방법은 gradient descent를 사용하는 모델이라면 제약 없이 동작할 수 있다.

**기호**

| 기호 | 뜻 |
|---|---|
| $f_\theta$ | 파라미터 $\theta$를 가진 모델 |
| $\theta$ | meta parameter. 모든 task가 공유하는 적응 전 초기값이고, 최적화하는 변수는 이것 하나다 |
| $\theta_i'$ | task $\mathcal{T}_i$에 적응한 뒤의 파라미터. 자유 변수가 아니라 $\theta$의 함수다 |
| $\mathcal{T}_i$ | task 하나. 손실 $\mathcal{L}$, 초기 관측 분포 $q(\mathbf{x}_1)$, 전이 분포 $q(\mathbf{x}_{t+1}\mid\mathbf{x}_t,\mathbf{a}_t)$, 에피소드 길이 $H$의 묶음 |
| $p(\mathcal{T})$ | task 분포. 알고리즘이 입력으로 받는다(`Require: p(T)`) |
| $\mathcal{L}_{\mathcal{T}_i}$ | task $\mathcal{T}_i$의 손실. 회귀는 MSE, 분류는 교차엔트로피, RL은 음의 기대 return |
| $\mathcal{D}_i$, $\mathcal{D}_i'$ | 같은 task에서 따로 뽑은 두 데이터 묶음. $\mathcal{D}_i$($K$개)로 적응하고 $\mathcal{D}_i'$로 적응 결과를 잰다. 후속 문헌은 흔히 support / query라 부른다 |
| $K$ | 적응에 쓰는 표본 수 ($K$-shot) |
| $\alpha$ | inner step size — task별 적응 한 걸음의 크기 |
| $\beta$ | outer(meta) step size — $\theta$를 옮기는 크기 |

<!-- 점검: support/query를 train/val/test와 섞지 않는다 (오개념 2). -->
bi-level optimization 형식을 가진다.

두 층으로 나뉜다.

- **하위(inner) — task별 적응**: 각 task에서 $\theta$를 출발점으로 $\mathcal{D}_i$에 대해 경사하강을 한 걸음(또는 몇 걸음) 밟아 $\theta_i'$를 얻는다.
- **상위(outer) — 출발점 이동**: 적응한 $\theta_i'$를 $\mathcal{D}_i'$로 잰 손실을 task에 대해 더하고 그 합이 줄어드는 쪽으로 $\theta$를 옮긴다.

$$
\theta_i' = \theta - \alpha \nabla_\theta \mathcal{L}_{\mathcal{T}_i}(f_\theta)
\qquad (1)
$$

$$
\min_\theta \sum_{\mathcal{T}_i \sim p(\mathcal{T})} \mathcal{L}_{\mathcal{T}_i}(f_{\theta_i'})
= \sum_{\mathcal{T}_i \sim p(\mathcal{T})} \mathcal{L}_{\mathcal{T}_i}\big(f_{\theta - \alpha \nabla_\theta \mathcal{L}_{\mathcal{T}_i}(f_\theta)}\big)
\qquad (2)
$$

$$
\theta \leftarrow \theta - \beta \nabla_\theta \sum_{\mathcal{T}_i \sim p(\mathcal{T})} \mathcal{L}_{\mathcal{T}_i}(f_{\theta_i'})
\qquad (3)
$$

MAML에서는 아래 3가지에 유의한다.

1. **변수는 $\theta$ 하나, 손실은 $\theta_i'$에서 잰다.**

    식 (1)을 식 (2)에 대입하면 목적식 전체가 $\theta$만의 식이 된다.

    식 (3)은 이 목적식을 푸는 방법이다. 매 반복마다 task 몇 개를 뽑고 그 task들에서 구한 기울기의 평균으로 $\theta$를 $\beta$만큼 옮긴다. 데이터 한 점 대신 task 하나를 표본으로 쓰는 SGD인 셈이다. 이때 기울기는 $\theta_i'$를 **거쳐** 계산된다. 그 기울기가 어떤 모양인지는 다음 절에서 살펴보자.

    > [!interpretation] 내 해석
    > 나는 이 SGD가 $\theta$를 "어떤 task가 와도 한 걸음만에 크게 좋아지는 지점", 곧 **변화에 가장 민감하게 반응하는 지점**으로 옮겨 가는 과정이라고 본다. 모든 task의 $\theta_i'$가 잘 나오도록 출발점 자체를 옮긴다는 뜻이다.
    >
    > 다만 SGD가 수렴 자체는 보장할 수 있어도, 그 수렴점이 "가장 변화율에 민감한 지점"이라는 것까지 보장하지는 못한다. SGD가 (손실이 매끄럽다는 등의 조건 아래에서) 약속하는 것은 식 (2)의 목적식이 더는 줄지 않는 정류점에 가까워진다는 것뿐이고, 목적식이 볼록이 아니니 그 점이 전역 최솟점이라는 보장도 없다. 원문 역시 수렴을 분석하지 않는다. "민감한 지점"은 SGD가 겨냥하는 목표가 아니라, 식 (2)를 줄여서 찾은 점이 왜 좋은지를 설명하는 해석이다.

2. **두 층의 손실은 같은 기호지만 데이터가 다르다.**

    Loss는 둘 다 $\mathcal{L}_{\mathcal{T}_i}$로 적지만 Algorithm 2에서 안쪽은 $\mathcal{D}_i$, 바깥쪽은 $\mathcal{D}_i'$를 쓴다. 같은 데이터로 재면 적응한 모델이 그 task의 새 데이터에서 얼마나 잘하는지 대신 적응에 쓴 데이터를 얼마나 외웠는지를 측정하게 된다. 이 두 묶음은 한 task 안의 역할 구분이다. meta-test와는 층위가 다르다. meta-test는 학습에 쓰지 않은 새 task로 성능을 잰다.

3. **pretraining과 갈리는 자리는 손실을 재는 지점이다.**

    모든 task를 합쳐 학습하는 pretraining은 적응 전 $\theta$에서 잰 손실을 줄인다.

   $$
   \min_\theta \sum_{\mathcal{T}_i \sim p(\mathcal{T})} \mathcal{L}_{\mathcal{T}_i}(f_\theta)
   \qquad (4)
   $$

   MAML은 (4)의 식을 적응 뒤에 산출되는 $\theta_i'$에서 잰다(식 (2)). 찾는 $\theta$의 의미는 "평균적으로 좋은 점"이 아니라 "한 걸음 뒤에 각 task에서 좋아지는 점"이 된다.

일반적인 bi-level 문제는 하위 문제를 끝까지 풀어 최적해를 쓰지만 MAML은 하위 문제를 정해진 몇 걸음에서 끊는다. 그래서 $\theta_i'$가 $\theta$의 명시적인 식으로 나오고 식 (2)를 그대로 미분할 수 있다.

## 3. 메타 기울기는 어떻게 계산하나

<!-- 점검: 실제 계산은 H가 아니라 HVP(Hv)다 (오개념 1). FOMAML은 αH 항을 버리는 근사이고, α→0이면 MAML 자체가 joint training으로 바뀐다 (오개념 3). -->

### 큰 흐름: chain rule의 두 조각

이제부터 두 손실은 데이터로 구분해 적응 쪽을 $\mathcal{L}_{\mathcal{D}_i}$, 평가 쪽을 $\mathcal{L}_{\mathcal{D}_i'}$로 쓴다. $f_\theta$ 대신 파라미터를 바로 인자로 넣는다.

먼저 큰 흐름부터 잡고 들어가자. 우리가 구하려는 메타 기울기는 $\theta \to \theta_i' \to \mathcal{L}_{\mathcal{D}_i'}$로 이어진 합성함수의 기울기다. chain rule을 뼈대만 쓰면 두 조각의 곱이다.

$$
\underbrace{\nabla_\theta\,\mathcal{L}_{\mathcal{D}_i'}(\theta_i')}_{\text{메타 기울기}}
= \underbrace{\Big(\frac{\partial\theta_i'}{\partial\theta}\Big)^{\!\top}}_{\text{① }\theta\text{가 }\theta_i'\text{를 움직이는 정도}}
\;\underbrace{\nabla\mathcal{L}_{\mathcal{D}_i'}(\theta_i')}_{\text{② }\theta_i'\text{에서 잰 기울기}}
$$

②는 적응한 파라미터에서 평범하게 역전파하면 나온다. 남은 일은 ①을 구하는 것이다. 아래에서 ①이 $I-\alpha H_i$가 됨을 보이고(식 (5)–(7)), 이를 대입해 식 (8)을 얻은 뒤, $H_i$를 만들지 않고 계산하는 법으로 마무리하자.

![한 step MAML의 계산 그래프 — θ가 두 경로로 θᵢ′에 들어가고, 역전파는 같은 두 경로로 돌아온다|600](maml-meta-gradient-paths.svg "그림 1. 한 step MAML의 계산 그래프. 실선은 순전파, 점선은 역전파(메타 기울기)다. θ는 항등 경로 I와 걸음 경로 −α∇ℒ(·; 𝒟ᵢ)로 θᵢ′에 들어가고, 역전파에서 v는 두 경로를 거쳐 v와 −αHᵢv로 돌아와 (I − αHᵢ)v로 합쳐진다.")

그림 1은 이 흐름을 한 장에 담은 지도다. 실선은 $\theta$가 두 경로로 $\theta_i'$에 들어가는 순전파로, ①이 바로 이 두 경로에서 나온다. 점선은 역전파다. $\theta_i'$에서 잰 기울기 $v$(②)가 같은 두 경로를 거꾸로 밟아 $\theta$로 돌아오는데, 이것이 위 식의 곱이다. 경로 1·경로 2가 무엇인지는 바로 다음 소절에서 식으로 확인하자.

### ① $\theta$가 $\theta_i'$를 움직이는 정도: 두 경로

식 (2)는 $\theta$만의 식이다. 식 (3)의 기울기도 $\theta$로 미분해야 한다. 그런데 손실을 재는 곳은 $\theta_i'$이다. 그래서 우리는 먼저 $\theta$를 조금 옮겼을 때 $\theta_i'$가 어떻게 변하는지부터 구해야 한다.

$\theta$를 작은 벡터 $\delta$만큼 옮긴다고 하자. 식 (1)을 다시 보면 $\theta$가 두 번 들어 있으니 $\delta$도 두 길을 따라 $\theta_i'$에 전해진다. 두 길을 하나씩 살펴보자.

$$
\theta_i' = \underbrace{\theta}_{\text{경로 1}} - \alpha\nabla_\theta\mathcal{L}_{\mathcal{D}_i}(\underbrace{\theta}_{\text{경로 2}})
\qquad (5)
$$

- **경로 1 — 출발점이 그대로 전해지는 길.** 앞의 $\theta$가 $\theta+\delta$가 되니 $\theta_i'$도 $\delta$만큼 그대로 따라 옮겨진다.
- **경로 2 — 걸음 방향을 거치는 길.** 출발점이 바뀌면 그 자리의 기울기, 곧 걸음 방향도 함께 바뀐다. 기울기의 변화는 Hessian $H_i = \nabla_\theta^2\mathcal{L}_{\mathcal{D}_i}(\theta)$로 $\nabla_\theta\mathcal{L}_{\mathcal{D}_i}(\theta+\delta) \approx \nabla_\theta\mathcal{L}_{\mathcal{D}_i}(\theta) + H_i\delta$이다. 따라서 걸음은 $-\alpha H_i\delta$만큼 달라진다.

두 길의 변화를 더하면

$$
\theta_i'(\theta+\delta) \approx \theta_i'(\theta) + \underbrace{\delta}_{\text{경로 1}} \underbrace{-\,\alpha H_i\delta}_{\text{경로 2}} = \theta_i'(\theta) + (I-\alpha H_i)\,\delta
\qquad (6)
$$

이다. $\delta$ 앞에 붙은 행렬이 곧 $\theta_i'$를 $\theta$로 미분한 것이다. 왜 그렇게 말할 수 있는지는 Jacobian의 정의에서 나오는데, 다음 글 [Jacobian과 Hessian: 식으로 읽고 그림으로 보기](/notes/optimization-jacobian-hessian-geometry/)에서 다룬다.

$$
\frac{\partial\theta_i'}{\partial\theta} = I - \alpha H_i
\qquad (7)
$$

### ② $\theta_i'$에서 잰 기울기를 $\theta$로 되돌리기

이제 chain rule을 적용하면 task $i$의 메타 기울기를 다음과 같이 쓸 수 있다. $H_i$가 대칭이므로 전치는 붙지 않는다.

$$
\nabla_\theta\,\mathcal{L}_{\mathcal{D}_i'}(\theta_i') = (I - \alpha H_i)\,\nabla\mathcal{L}_{\mathcal{D}_i'}(\theta_i')
\qquad (8)
$$

두 인자는 재는 자리가 서로 다르다. 뒤의 기울기는 적응한 **뒤**의 $\theta_i'$에서 $\mathcal{D}_i'$로 재고 앞의 Hessian은 적응 **전**의 $\theta$에서 $\mathcal{D}_i$로 잰다. 식 (8)은 $\theta_i'$에서 잰 기울기를 $(I-\alpha H_i)$로 $\theta$의 좌표로 되돌려 쓸 뿐이다. 

### ③ Hessian 없이 계산하기, 그리고 FOMAML

계산은 어떻게 할까? 우선 $H_i$라는 $d \times d$ 행렬은 만들지 않는다. $v = \nabla\mathcal{L}_{\mathcal{D}_i'}(\theta_i')$로 두면 식 (8)은 $v - \alpha H_i v$이므로 우리가 구할 것은 Hessian-vector product $H_i v$ 하나뿐이다. 이 값은 $H_i v = \nabla_\theta\big(\nabla_\theta\mathcal{L}_{\mathcal{D}_i}(\theta)^\top v\big)$처럼 역전파를 한 번 더 돌려 $O(d)$ 메모리로 얻는다. 원문이 식 (1) 다음 문단에서 "gradient through a gradient"와 Hessian-vector product를 언급하는 곳이 바로 이 자리다.

경로 2를 끊어 식 (7)를 $I$로 두는 방식을 **FOMAML**이라고 한다. 그러면 메타 기울기는 $\nabla\mathcal{L}_{\mathcal{D}_i'}(\theta_i')$, 곧 $\theta_i'$에서 잰 기울기를 $\theta$에 그대로 적용한 것이 된다. 2차 미분이 사라지니 계산은 싸진다. 원문은 MiniImagenet 분류 한 곳에서 이 근사를 비교했고, 신뢰구간 안에서 거의 같은 성능을 냈다고 보고한다(§5.2). 다만 논문은 이 근사가 성립하는 조건을 달지 않았다.

> [!interpretation] 내 해석
> 원문에서는 FOMAML과 MAML의 성능을 실험적으로 비교했다. 그러나 나는 FOMAML이 버리는 항이 $-\alpha H_i v$이므로, $\alpha H_i$가 작을 때($\lVert\alpha H_i\rVert \ll 1$)에만 MAML과 가깝다고 본다. 곡률이 가장 큰 방향의 고윳값을 $\lambda$라 하면 기준은 $\alpha\lambda$다. 직접 돌려 보니 손실이 볼록이어도 $\alpha\lambda\gtrsim1$이면 FOMAML이 MAML과 갈라졌는데, 이 내용은 별도 글 [FOMAML은 언제 MAML과 갈라지나](/notes/optimization-fomaml-alpha-lambda/)에 정리했다.


손실이 이차식인 여러 task에서 MAML·FOMAML·합동 학습이 각각 어느 점을 찾아가고 어떤 경로를 밟는지는 [실험실의 MAML 이차 task 예시](/lab/maml-quadratic-tasks/)에서 직접 움직여 볼 수 있다.

## 4. 논문이 주어진 것으로 놓은 것

Algorithm 1의 첫 줄은 `Require: p(T)`다. 즉, task 분포는 알고리즘이 받는 **입력**이다. 논문은 이 분포를 만들지도 고르지도 배우지도 않는다. §2.1을 살펴보면 task를 손실 $\mathcal{L}$, 초기 관측 분포 $q(\mathbf{x}_1)$, 전이 분포 $q(\mathbf{x}_{t+1}\mid\mathbf{x}_t,\mathbf{a}_t)$, 에피소드 길이 $H$의 묶음으로 정의한 뒤 "모델이 적응하길 바라는 task들의 분포 $p(\mathcal{T})$"를 생각한다고만 적혀 있다("we consider a distribution over tasks $p(\mathcal{T})$ that we want our model to be able to adapt to").

그래서 실제로는 실험자가 $p(\mathcal{T})$를 정한다. 사인파 회귀라면 진폭 $[0.1, 5.0]$과 위상 $[0, \pi]$의 범위를, 분류라면 어떤 클래스를 묶어 N-way 문제를 만들지를, 강화학습이라면 목표 위치·속도의 범위를 실험자가 정했다. 그렇다면 논문이 주어진 것으로 놓고 넘어간 것은 무엇일까? 하나씩 꼽아 보자.

1. **분포 자체.** 어떤 task들을 한 $p(\mathcal{T})$에 넣어도 되는지 판단할 기준이 없다. 범위를 정하는 순간 묶음은 이미 끝나 버린다.
2. **뽑는 방식.** 매 반복 task를 $p(\mathcal{T})$에서 독립으로 뽑는다(Algorithm 1). 어떤 task를 더 자주 볼지는 조절하지 않는다.
3. **모든 task에 같은 대우.** 모든 task가 같은 $\theta$에서 출발해 같은 $\alpha$로, 같은 걸음 수만큼 적응한다.

> [!interpretation] 내 해석
> Figure 1은 세 task의 최적해가 한 갈림길 근처에 모여 있는 모습으로 그려져 있다. 출발점 하나로 충분하다는 전제는 이 그림에 기대고 있다고 본다.


## 5. 남긴 빈틈

<!-- 점검: task family의 범위와 task별 최적해 집합의 지름을 구분한다 (오개념 4). -->

이 논문은 아래 3가지를 묻지 않고 넘어갔다.

1. **어떤 task들을 한 분포로 묶어도 되는가.** 출발점 하나를 공유해서 이득을 보려면 task 집합이 어떤 조건을 갖춰야 하는지 논문은 말하지 않는다. "범위가 넓다"와 "task별 최적해가 멀리 흩어져 있다"는 서로 다른 말이다. 진폭 범위가 넓어도 최적해들은 한 걸음 거리 안에 모여 있을 수 있고 범위가 좁아도 최적해가 흩어질 수 있다. 다음 글에서 살펴볼 Khodak et al.(2019)은 파라미터 범위 대신 task별 최적해 집합의 **지름**으로 유사도를 정의한다. 그리고 초기화를 공유했을 때의 regret 상한이 그 지름에 비례함을 보인다. 그러니 지름이 전체 파라미터 공간만큼 커지면 이득은 사라진다.
2. **분포의 구성이 meta-학습 자체에 어떻게 작용하는가.** 논문은 적응 뒤 성능(MSE·정확도·return)만 보고한다. task를 어떻게 뽑느냐에 따라 학습 과정의 분산·발산·seed 민감도가 어떻게 달라지는지는 다루지 않는다.
3. **task마다 다르게 다룰 수 있는가.** 모든 task가 같은 $\alpha$, 같은 걸음 수, 같은 $\theta$를 똑같이 믿는다. 연구실 논문인 Learning to Balance는 바로 이 자리에서 출발한다.

이 방식은 왜 잘 될까? 여기에도 원 논문은 직관(손실이 파라미터 변화에 민감한 지점을 찾는다)만 건넨다. 그 설명은 후속 연구들이 나눠서 채웠다. 메커니즘은 Nichol et al.(2018)의 Taylor 전개가, 수렴은 Fallah et al.(2020)이, 일반화는 Khodak et al.(2019)과 Raghu et al.(2020)이 맡는다.

## 같은 질문의 다른 답

- **Reptile**(Nichol et al., 2018): 1차 근사는 안쪽 학습의 **계산**만 바꿨을 뿐 task 분포 가정은 건드리지 않았다. Algorithm 1은 매 반복 task를 뽑는 데서 출발하며 분석의 기대값도 같은 $p(\tau)$ 위에서 취한다. 업데이트 $\theta \leftarrow \theta + \epsilon(\theta_i' - \theta)$는 $\theta$를 적응한 지점 쪽으로 당긴다. 안쪽이 한 걸음이면 합동 학습의 SGD와 같아진다. MAML과 나란히 놓을 짝은 Reptile이 아니라 FOMAML이다.
- **Probabilistic MAML**(Finn et al., 2018): 분포는 **초기화**에 둔다. task 분포에는 두지 않는다. $p(\mathcal{T})$는 여전히 주어지고 균등하게 뽑히며 모든 task가 하나의 Gaussian prior를 공유한다. 적은 데이터로는 task를 하나로 정할 수 없을 때가 있다. 그때의 불확실성, 곧 task 하나 안의 모호성만 달라졌다.

## 참고자료

- [Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks](https://arxiv.org/abs/1703.03400) — Finn, Abbeel, Levine. ICML 2017
- [On First-Order Meta-Learning Algorithms](https://arxiv.org/abs/1803.02999) — Nichol, Achiam, Schulman. 2018
- [Probabilistic Model-Agnostic Meta-Learning](https://arxiv.org/abs/1806.02817) — Finn, Xu, Levine. NeurIPS 2018
- [Provable Guarantees for Gradient-Based Meta-Learning](https://arxiv.org/abs/1902.10644) — Khodak, Balcan, Talwalkar. ICML 2019
