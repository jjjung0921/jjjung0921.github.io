---
title: "MAML 이차 task 예시"
lang: "ko"
translationKey: "maml-quadratic-tasks"
tier: "client"
status: "prototype"
question: "한 걸음 적응 뒤에 재는 손실은 출발점을 어디로 옮기고, task를 배치로 뽑으면 그 경로는 얼마나 흔들리나?"
runtime: "browser"
inputs: ["alpha", "task count", "task spread", "meta-batch size", "start point"]
outputs: ["MAML optimum", "FOMAML stationary point", "loss before/after adaptation", "tail spread by batch size"]
tags: ["Meta-Learning", "MAML", "Bi-level Optimization", "Visualization"]
summary: "이차 손실을 가진 여러 task 위에서 MAML·FOMAML·합동 학습의 출발점과 meta-batch 경로를 비교한다."
---

## 모델

task $i = 1, \dots, N$의 손실이 모두 이차식이다.

$$
\mathcal{L}_i(\theta) = \tfrac{1}{2}(\theta - c_i)^\top A_i (\theta - c_i), \qquad \theta \in \mathbb{R}^2
$$

$c_i$는 task $i$의 최적해이고 $A_i$는 Hessian이다. task마다 곡률(고유값)과 가파른 방향을 무작위로 정했다. 이 예시에서는 적응에 쓰는 데이터와 평가에 쓰는 데이터가 같은 손실을 준다고 둔다. 실제 MAML에서는 둘이 다르다.

안쪽 한 걸음과 그 Jacobian은 다음과 같다.

$$
\theta_i' = \theta - \alpha A_i(\theta - c_i), \qquad \frac{\partial \theta_i'}{\partial \theta} = I - \alpha A_i
$$

세 방법의 기울기는 모두 $\frac{1}{N}\sum_i W_i(\theta - c_i)$ 꼴이고 계수 행렬만 다르다.

| 방법 | 계수 행렬 | 무엇을 줄이나 |
|---|---|---|
| 합동 학습 | $W_i = A_i$ | 적응 전 손실의 평균 |
| MAML | $W_i = (I-\alpha A_i)\,A_i\,(I-\alpha A_i)$ | 적응 뒤 손실의 평균 |
| FOMAML | $W_i = A_i\,(I-\alpha A_i)$ | 앞의 $(I-\alpha A_i)$를 $I$로 버린 근사 |

손실이 이차라서 세 점은 $\theta^\star = \big(\sum_i W_i\big)^{-1}\sum_i W_i c_i$로 바로 구한다. 그림의 경로는 모두 같은 바깥 step size $\beta$로 돌린 경사하강이다.

**meta-batch.** 논문의 Algorithm 1은 매 반복마다 task 몇 개를 뽑아 그 기울기의 평균으로 $\theta$를 옮긴다. 여기서는 $N$개 중 $B$개를 중복 없이 뽑는다.

$$
\theta \leftarrow \theta - \beta \cdot \frac{1}{B}\sum_{i \in \mathcal{B}_k} W_i(\theta - c_i), \qquad |\mathcal{B}_k| = B
$$

$B = N$이면 전체 기울기와 같다. 흐린 선 세 개는 서로 다른 seed로 뽑은 배치 경로다.

## 볼 것

- **$\alpha \to 0$일 때.** 세 점이 한 점으로 모인다. $\theta_i' = \theta$가 되어 MAML 목적식이 합동 학습 목적식과 같아지기 때문이다. 적응이 사라지는 쪽으로 간다. task별 fine-tuning 값이 되지는 않는다.
- **$\alpha$를 키울 때.** MAML 점이 합동 학습 점에서 멀어진다. 고유값 $\lambda$ 방향의 가중치가 $\lambda$에서 $\lambda(1-\alpha\lambda)^2$로 바뀌기 때문이다. 가파른 방향은 한 걸음 적응이 알아서 고쳐 주므로 출발점이 그 방향으로 정확할 필요가 준다. 출발점 위치는 평평한 방향이 정한다. 출력 표에서 MAML 점은 적응 **전** 손실이 합동 점보다 크지만 적응 **뒤** 손실은 더 작다.
- **FOMAML이 MAML과 겹치는 조건.** FOMAML의 가중치는 $\lambda(1-\alpha\lambda)$라서 MAML과 $(1-\alpha\lambda)$배만큼 다르다. 따라서 $\alpha\lambda \ll 1$일 때만 둘이 겹친다. $\alpha\lambda$가 1을 넘는 방향이 생기면 FOMAML의 평균 계수 행렬이 음의 고유값을 가질 수 있다. 그러면 정지점이 최소점이 아니어서 경로가 발산한다. 기본 설정에서는 $\alpha \approx 0.32$ 부근부터 발산한다. MAML 가중치는 제곱이라 음수가 되지 않는다.
- **배치 크기 $B$.** 기울기가 $\theta$에 선형이라 배치 경로의 **기댓값**은 전체 경로와 같다. 대신 각 반복은 뽑힌 task 쪽으로 치우친다. 그래서 $\beta$를 고정하면 경로가 $\theta^\star_{\mathrm{MAML}}$ 근처에서 멈추지 않고 흔들린다. 배치를 비복원으로 뽑으면 평균 기울기의 분산은 $\frac{1}{B}\cdot\frac{N-B}{N-1}$에 비례한다. 흔들림은 $B$가 커질수록 줄고 $B = N$에서 0이 된다. 오른쪽 막대 그림이 이것을 보여 준다.
- **task 최적해의 흩어짐.** 이차 예시에서는 모든 점이 흩어짐에 비례해 함께 늘어난다. 그래서 적응 뒤 손실은 흩어짐의 제곱으로 커진다. 배치 경로의 흔들림은 흩어짐에 비례해 커진다. task들이 멀리 떨어질수록 한 걸음으로 모두에 닿는 출발점이 사라지고 어떤 task를 뽑느냐에 따라 meta-update 방향도 크게 달라진다. 뒤의 것은 task 간 기울기 차이(gradient diversity)가 meta-학습의 흔들림을 키운다는 말과 같다.

## 한계

손실이 이차라서 Hessian이 상수다. 신경망에서는 $A_i$가 $\theta$마다 바뀐다. MAML은 $A_i$를 만들지 않은 채 Hessian-vector product $A_i v$만 계산한다. 이 예시로는 방향·가중치·배치 잡음의 관계를 본다. 실제 학습 동역학은 재현하지 않는다. 배치 흔들림은 $\beta$가 클수록 커진다. 여기서는 $\beta$를 가장 가파른 task에 맞춰 고정했다.

관련 글: [MAML은 task 분포를 주어진 것으로 놓았다](/notes/meta-maml-task-distribution-given/)
