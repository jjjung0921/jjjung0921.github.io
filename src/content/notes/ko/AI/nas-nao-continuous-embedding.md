---
title: "NAO는 이산 아키텍처를 어떤 연속 공간에서 움직였나?"
lang: "ko"
translationKey: "nas-nao-continuous-embedding"
date: "2026-07-30"
field: "ai"
category: "Neural Architecture Search"
series: "NAS Foundations"
order: 3
status: "reading"
summary: "NAO의 encoder-predictor-decoder 구조를 따라가며, discrete architecture를 latent embedding으로 옮기고 predictor gradient로 개선한 뒤 다시 이산 구조로 복원하는 과정을 분석한다."
problem: "architecture는 operation과 connection의 이산 조합이라 직접 gradient를 계산하기 어렵다. 구조 전체를 연속 벡터로 바꿔 움직일 수 있을까?"
coreIdea: "NAO는 architecture를 latent vector로 encode하고 성능 predictor의 gradient를 따라 이동한 뒤 decoder로 새로운 architecture를 복원한다."
connection: "NAO와 DARTS는 모두 연속 최적화를 쓰지만, NAO는 architecture 전체의 learned embedding을 움직이고 DARTS는 각 edge operation의 mixture weight를 학습한다."
tags: ["nas", "nao", "continuous-optimization", "architecture-embedding", "surrogate-model"]
---

# NAO는 이산 아키텍처를 어떤 연속 공간에서 움직였나?

## 작성 배경
이 글은 내가 Notion에 작성한 [NAO 리뷰](https://app.notion.com/p/333fb10f6501803aaa88e2e4fd89fecb)를 바탕으로 썼다. 논문 선택과 핵심 해석은 내 원문에서 출발했다. GPT로 블로그에 맞게 구조와 표현을 재구성한 뒤 원문과 원 논문을 대조해 직접 검수했다. 목적함수와 gradient step의 의미는 NeurIPS 원 논문을 다시 대조해 보완했다.

## 문제: 이산 구조에는 바로 미분할 좌표가 없다
architecture $a$가 operation token과 connection token의 sequence라고 하자. $a$의 일부를 바꾸면 전혀 다른 graph가 되기 때문에 일반적인 의미의 $\nabla_a f(a)$는 정의하기 어렵다.

기존 performance predictor는 이미 생성한 후보의 성능을 예측하고 좋은 후보를 골라내는 데 주로 쓰였다. NAO는 predictor를 **새 후보를 만드는 gradient field**로 사용한다.

## 세 개의 모듈
NAO는 architecture를 다음 세 단계로 통과시킨다.

$$
a
\xrightarrow{E_\phi}
e_a
\xrightarrow{f_\psi}
\hat{s}_a,
\qquad
e_a
\xrightarrow{D_\omega}
\hat{a}
$$

- encoder $E_\phi$: discrete architecture $a$를 continuous embedding $e_a$로 바꾼다
- predictor $f_\psi$: embedding에서 validation performance $\hat{s}_a$를 예측한다
- decoder $D_\omega$: embedding을 다시 architecture token sequence로 복원한다

encoder와 decoder는 architecture-as-sequence 관점을 사용한다. predictor는 latent vector 위의 smooth surface를 근사한다.

## 학습 목적
predictor는 실제 성능과 예측 성능의 차이를 줄여야 한다.

$$
\mathcal{L}_{pred}
=
\sum_{a\in\mathcal{A}}
\left(
f_\psi(E_\phi(a))-s_a
\right)^2
$$

decoder는 원래 architecture를 복원해야 한다.

$$
\mathcal{L}_{rec}
=
-
\sum_{a\in\mathcal{A}}
\log p_\omega
\left(
a\mid E_\phi(a)
\right)
$$

둘을 함께 학습하면 latent space는 성능을 예측할 수 있으면서도 유효한 architecture로 돌아갈 수 있어야 한다.

$$
\min_{\phi,\psi,\omega}
\mathcal{L}_{pred}
+
\lambda\mathcal{L}_{rec}
$$

## gradient가 적용되는 위치
학습된 architecture $a$의 embedding을 $e_a$라고 하면, NAO는 predictor가 더 높은 성능을 예측하는 방향으로 latent vector를 움직인다.

$$
e_a'
=
e_a
+
\eta
\nabla_e f_\psi(e)
\big|_{e=e_a}
$$

성능 대신 error를 예측한다면 부호는 반대가 된다. NAO는 architecture token을 직접 미분하지 않고 **predictor가 학습한 연속 공간 안에서 gradient step을 수행한다**.

그 다음 decoder가 새 embedding을 discrete architecture로 되돌린다.

$$
a'=\arg\max_a p_\omega(a\mid e_a')
$$

평가한 $a'$를 pool에 추가하고 encoder-predictor-decoder를 다시 학습하는 과정을 반복한다.

## DARTS와 무엇이 다른가
| 구분 | NAO | DARTS |
|---|---|---|
| 연속 변수 | architecture 전체의 embedding $e$ | edge별 operation logit $\alpha$ |
| gradient 출처 | learned performance predictor | validation loss |
| 이산 복원 | decoder가 token sequence 생성 | edge별 argmax |
| 주요 위험 | predictor·decoder 외삽 | mixed-op와 discretization gap |

두 방법 모두 discrete choice를 continuous optimization으로 바꾸지만 연속 공간을 만드는 방식이 다르다.

## 한계
NAO의 gradient는 실제 accuracy surface의 gradient가 아니다. predictor가 근사한 surface의 gradient다.

- 초기 architecture pool이 좁으면 predictor가 외삽에 실패한다
- 큰 latent step은 decoder가 본 적 없는 영역으로 이동한다
- decoder가 유효하지만 원치 않는 architecture로 복원할 수 있다
- 같은 embedding 근처의 구조가 실제 성능도 비슷하다는 보장이 없다
- predictor 학습을 위한 후보 평가는 여전히 필요하다

## 간단한 해결 아이디어
latent step에 trust region을 두고 ensemble predictor의 uncertainty가 큰 후보는 실제 평가로 되돌리는 방법이 자연스럽다. decoder validity constraint와 round-trip consistency $a\rightarrow e\rightarrow\hat a$도 함께 측정해야 한다.

gradient를 얻었다는 사실보다 **그 gradient가 어떤 surrogate와 어떤 데이터 범위 안에서만 유효한지**를 기록하는 일이 더 중요하다.

## 참고자료
- [Neural Architecture Optimization](https://proceedings.neurips.cc/paper/2018/hash/933670f1ac8ba969f32989c312faba75-Abstract.html)
- [Neural Architecture Optimization PDF](https://proceedings.neurips.cc/paper/2018/file/933670f1ac8ba969f32989c312faba75-Paper.pdf)
