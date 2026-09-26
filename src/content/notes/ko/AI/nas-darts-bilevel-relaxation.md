---
title: "DARTS의 수학: Mixed Operation에서 Bi-level Gradient까지"
lang: "ko"
translationKey: "nas-darts-bilevel-relaxation"
date: "2026-07-30"
field: "ai"
category: "Neural Architecture Search"
series: "NAS Foundations"
order: 4
status: "reading"
summary: "DARTS의 cell DAG, softmax mixed operation, train/validation bi-level objective, exact hypergradient와 one-step·first-order 근사를 분리해 유도한다."
problem: "각 edge에서 하나의 operation을 고르는 이산 선택 때문에 architecture에 대한 gradient가 끊긴다. 선택을 연속화하되 최종에는 다시 하나의 graph를 얻으려면 어떻게 해야 할까?"
coreIdea: "DARTS는 모든 candidate operation을 softmax 가중합으로 동시에 활성화하고, network weight는 training loss로, architecture parameter는 validation loss로 학습한다."
connection: "DARTS는 architecture search를 hyperparameter optimization과 같은 train/validation bi-level 문제로 명시해, NAS를 수학적으로 분해해 읽는 기준점을 만들었다."
tags: ["nas", "darts", "bi-level-optimization", "continuous-relaxation", "hypergradient"]
---

# DARTS의 수학: Mixed Operation에서 Bi-level Gradient까지

## 작성 배경
이 글은 내가 Notion에 작성한 [DARTS 리뷰](https://app.notion.com/p/336fb10f650180f3b126ddf4e00143a3)를 바탕으로 썼다. 수학적 부분을 이해하려고 남긴 원문 유도에서 출발했으며 GPT로 블로그에 맞게 기호와 설명 순서를 재구성한 뒤 원문과 원 논문을 대조해 직접 검수했다. exact hypergradient와 논문에서 쓰는 근사는 DARTS 원 논문을 다시 대조해 구분했다.

## 1. Cell을 DAG로 쓴다
DARTS의 cell은 node $x^{(i)}$와 directed edge $(i,j)$로 구성된다. 각 edge에는 candidate operation 집합 $\mathcal{O}$가 있다.

$$
x^{(j)}
=
\sum_{i<j}
o^{(i,j)}
\left(x^{(i)}\right)
$$

그런데 $o^{(i,j)}\in\mathcal{O}$ 중 하나를 고르는 선택은 discrete다.

## 2. Operation 선택을 softmax mixture로 바꾼다
각 edge와 operation에 architecture logit $\alpha_o^{(i,j)}$를 둔다.

$$
\bar{o}^{(i,j)}(x)
=
\sum_{o\in\mathcal{O}}
\frac{
\exp\left(\alpha_o^{(i,j)}\right)
}{
\sum_{o'\in\mathcal{O}}
\exp\left(\alpha_{o'}^{(i,j)}\right)
}
o(x)
$$

이제 모든 operation이 가중합에 참여하므로 $\alpha$에 대해 미분할 수 있다. search 단계의 network는 모든 후보가 섞인 supernet이다.

## 3. 왜 Bi-level인가
DARTS에는 두 종류의 변수가 있다.

- $w$: convolution kernel 같은 network weight
- $\alpha$: edge에서 어떤 operation을 선택할지 나타내는 architecture parameter

$w$와 $\alpha$를 같은 데이터에 맞추면 architecture가 training loss에 과적합할 수 있다. DARTS는 $w$를 training loss로, $\alpha$를 validation loss로 학습한다.

$$
\begin{aligned}
\min_\alpha\quad&
\mathcal{L}_{val}\left(w^*(\alpha),\alpha\right) \\
\text{s.t.}\quad&
w^*(\alpha)
=
\arg\min_w
\mathcal{L}_{train}(w,\alpha)
\end{aligned}
$$

lower-level에서 얻은 $w^*(\alpha)$가 upper-level validation loss 안에 들어가므로 bi-level optimization이다.

## 4. Exact hypergradient
upper objective를

$$
F(\alpha)
=
\mathcal{L}_{val}
\left(w^*(\alpha),\alpha\right)
$$

라고 하면 chain rule은 다음과 같다.

$$
\frac{dF}{d\alpha}
=
\frac{\partial\mathcal{L}_{val}}{\partial\alpha}
+
\frac{\partial\mathcal{L}_{val}}{\partial w}
\frac{dw^*}{d\alpha}
$$

lower optimum에서

$$
\nabla_w\mathcal{L}_{train}(w^*,\alpha)=0
$$

이라고 두고 implicit differentiation을 적용하면

$$
\frac{dw^*}{d\alpha}
=
-
\left[
\nabla_{ww}^2\mathcal{L}_{train}
\right]^{-1}
\nabla_{w\alpha}^2\mathcal{L}_{train}
$$

이다. 이 exact hypergradient는 Hessian inverse와 fully optimized $w^*$를 요구하므로 원래 형태로 계산하기 비싸다.

## 5. DARTS의 one-step approximation
DARTS는 lower optimization 전체 대신 한 번의 gradient step을 unroll한다.

$$
w'
=
w
-
\xi
\nabla_w
\mathcal{L}_{train}(w,\alpha)
$$

그리고 다음 architecture gradient를 사용한다.

$$
\nabla_\alpha
\mathcal{L}_{val}(w',\alpha)
$$

chain rule로 펼치면

$$
\nabla_\alpha\mathcal{L}_{val}(w',\alpha)
-
\xi
\nabla_{\alpha w}^{2}
\mathcal{L}_{train}(w,\alpha)
\nabla_{w'}
\mathcal{L}_{val}(w',\alpha)
$$

가 된다. 두 번째 항의 Hessian-vector product는 finite difference로 근사한다.

$$
\nabla_{\alpha w}^{2}
\mathcal{L}_{train}\,v
\approx
\frac{
\nabla_\alpha\mathcal{L}_{train}(w+\epsilon v,\alpha)
-
\nabla_\alpha\mathcal{L}_{train}(w-\epsilon v,\alpha)
}{
2\epsilon
}
$$

이 근사를 흔히 `second-order DARTS`라고 부른다. exact implicit gradient를 계산하지는 않는다.

## 6. First-order DARTS
더 싼 변형은 $w$가 $\alpha$에 의존하는 경로를 무시한다.

$$
\nabla_\alpha
\mathcal{L}_{val}(w,\alpha)
$$

즉, mixed operation을 통한 $\alpha$의 직접 효과만 보고 lower-level update가 architecture에 따라 어떻게 바뀌는지는 버린다. 빠르지만 gradient bias가 더 커질 수 있다.

## 7. 다시 discrete architecture로 돌아간다
search가 끝나면 edge마다 가장 큰 $\alpha$를 가진 non-zero operation을 고르고 node로 들어오는 상위 edge만 남긴다.

$$
o^{(i,j)}_{\mathrm{final}}
=
\arg\max_{o\in\mathcal{O}\setminus\{\mathrm{zero}\}}
\alpha_o^{(i,j)}
$$

search 때는 operation의 mixture였지만 evaluation 때는 하나의 discrete graph다. 이 차이가 discretization gap이다.

## 한계
- mixed operation이 standalone operation의 성능을 정확히 나타내지 않는다
- shared weight 때문에 operation 사이 co-adaptation이 생긴다
- skip connection처럼 최적화가 쉬운 operation이 일찍 우세해질 수 있다
- one-step과 first-order approximation이 true hypergradient를 왜곡할 여지가 있다
- validation loss가 좋아도 argmax로 뽑은 graph의 독립 재학습 순위는 다를 수 있다

## 간단한 해결 아이디어
탐색 중 $\alpha$ 크기만 보지 말고 operation 제거가 validation loss에 주는 perturbation을 함께 측정할 수 있다. Hessian sharpness 기반 early stopping, operation/topology 분리, partial channel, stochastic categorical relaxation도 서로 다른 병목을 줄이는 방법이다.

검증에서는 search supernet의 성능보다 뽑힌 graph를 동일한 recipe로 처음부터 다시 학습하고 random search와 비교하는 일이 가장 중요하다.

## 참고자료
- [DARTS: Differentiable Architecture Search](https://arxiv.org/abs/1806.09055)
- [Understanding and Robustifying Differentiable Architecture Search](https://arxiv.org/abs/1909.09656)
- [PC-DARTS](https://arxiv.org/abs/1907.05737)
- [NoisyDARTS: Differentiable Architecture Search Without None Operation](https://arxiv.org/abs/2005.03566)
