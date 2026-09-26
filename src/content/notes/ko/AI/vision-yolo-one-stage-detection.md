---
title: "YOLO v1은 어떻게 탐지를 하나의 회귀 문제로 바꿨나?"
lang: "ko"
translationKey: "vision-yolo-one-stage-detection"
date: "2026-07-30"
field: "ai"
category: "Computer Vision"
series: "Vision Foundations"
order: 3
status: "reading"
summary: "YOLO v1의 grid, bounding box, confidence, class probability, multi-part loss를 중심으로 one-stage detector가 속도와 단순화를 어떻게 얻는지 정리한다."
problem: "탐지를 분류기 재활용으로 풀면 느리고 파이프라인이 복잡해진다. 실시간 탐지를 위해서는 localization과 classification을 한 번에 처리하는 구조가 필요하다."
coreIdea: "이미지를 S×S grid로 나누고, 각 cell이 bounding boxes와 class probabilities를 동시에 회귀한다."
connection: "이 글은 one-stage detector의 설계 원리와 two-stage detector와의 차이를 읽는 기준점이다."
tags: ["object-detection", "one-stage-detection", "yolo", "regression", "real-time"]
---

# YOLO v1은 어떻게 탐지를 하나의 회귀 문제로 바꿨나?

## 작성 배경
이 글은 Notion의 [Yolo V1](https://app.notion.com/p/340fb10f650181978f97fe76928784db)과 [Computer Vision](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee) 원문을 바탕으로 GPT로 구조와 표현을 재구성한 뒤 원문과 원 논문을 대조해 직접 검수한 글이다. YOLO는 Notion 원문을 직접 요약했다. 비교를 위해 R-CNN 계열은 원 논문과 대조만 했다.

## 문제 제기
탐지를 분류기 방식으로 해결하면 후보를 따로 만들고 그 후보를 다시 분류해야 한다.
그 과정은 정확도를 올리기엔 좋지만 실시간성을 해치기 쉽다.

YOLO v1은 이 불편함을 정면으로 바꾼다.
탐지를 "분류 후 위치 추정"이 아니라 "한 번의 회귀"로 다시 쓴다.

## 핵심 아이디어
YOLO v1의 아이디어는 세 줄로 요약된다.

1. 이미지를 $S \times S$ grid로 나눈다
2. 각 cell이 class probability와 bounding box를 함께 예측한다
3. 하나의 네트워크가 전체 이미지에 대해 한 번에 답한다

이 구조 덕분에 YOLO는 one-stage detector가 된다.
후보 생성과 판별을 분리하지 않는다.

## 방법
### grid
이미지를 grid로 나누면 객체의 중심이 들어 있는 cell이 그 객체를 책임진다.
이 책임 분배가 YOLO의 핵심이다.

### bounding box와 class probability
각 cell은 $B$개의 bounding box와 $C$개의 class probability를 낸다.

$$
S \times S \times (B \cdot 5 + C)
$$

여기서 각 box는 $(x, y, w, h, confidence)$를 예측한다.

confidence는 object 존재 여부와 localization 품질을 함께 담는다.

$$
\text{confidence} = \Pr(\text{Object}) \cdot \text{IoU}
$$

또한 class score는 object 존재 조건과 결합해 읽는다.

$$
\Pr(\text{Class}_i \mid \text{Object}) \cdot \Pr(\text{Object}) \cdot \text{IoU}
$$

### multi-part loss
YOLO v1은 위치, confidence, class 오차를 하나의 합으로 학습한다. 논문의 표기를 간단히 옮기면 다음과 같다.

$$
\begin{aligned}
L ={}&
\lambda_{\mathrm{coord}}
\sum_{i=1}^{S^2}\sum_{j=1}^{B}\mathbb{1}_{ij}^{\mathrm{obj}}
\left[(x_i-\hat{x}_i)^2+(y_i-\hat{y}_i)^2\right] \\
&+
\lambda_{\mathrm{coord}}
\sum_{i=1}^{S^2}\sum_{j=1}^{B}\mathbb{1}_{ij}^{\mathrm{obj}}
\left[
(\sqrt{w_i}-\sqrt{\hat{w}_i})^2+
(\sqrt{h_i}-\sqrt{\hat{h}_i})^2
\right] \\
&+
\sum_{i=1}^{S^2}\sum_{j=1}^{B}
\mathbb{1}_{ij}^{\mathrm{obj}}(C_i-\hat{C}_i)^2 \\
&+
\lambda_{\mathrm{noobj}}
\sum_{i=1}^{S^2}\sum_{j=1}^{B}
\mathbb{1}_{ij}^{\mathrm{noobj}}(C_i-\hat{C}_i)^2 \\
&+
\sum_{i=1}^{S^2}\mathbb{1}_{i}^{\mathrm{obj}}
\sum_{c \in \mathrm{classes}}
(p_i(c)-\hat{p}_i(c))^2.
\end{aligned}
$$

$\mathbb{1}_{ij}^{\mathrm{obj}}$는 $i$번째 cell의 $j$번째 box가 해당 객체를 책임질 때 1이 된다. $\lambda_{\mathrm{coord}}$는 위치 오차를 더 강하게 보고 $\lambda_{\mathrm{noobj}}$는 객체가 없는 수많은 box의 confidence 오차가 학습을 지배하지 못하게 줄인다. 너비와 높이에 제곱근을 씌우는 이유는 큰 box의 절대 오차가 작은 box의 오차를 압도하지 않게 하기 위해서다.

YOLO v1은 탐지를 분류와 localization의 별도 pipeline으로 두지 않는다. 하나의 회귀 목적함수 안에서 함께 최적화한다.

## one-stage tradeoff
YOLO가 얻은 것은 이렇다.

- 빠르다
- 파이프라인이 단순하다
- 이미지 전체 맥락을 한 번에 본다

하지만 대가도 따른다.

- grid가 거칠면 작은 물체에 약하다
- 가까이 붙은 물체를 나누기 어렵다
- 특이한 종횡비나 밀집 장면에서 localization 오차가 커진다

YOLO는 speed와 simplicity를 얻는 대신 dense precision에서는 손해를 본다.

## 후속 계열을 어떻게 봐야 하나
후속 YOLO 계열을 볼 때 버전 번호 자체는 중요하지 않다.
각 버전이 "one-stage의 속도를 유지하면서 grid의 거칠음과 assignment 문제를 어떻게 줄이느냐"에 낸 답을 본다.

그래서 후속 개선들은 대체로 다음 방향을 향한다.

- 멀티스케일 feature를 더 잘 쓰기
- 작은 객체를 더 잘 잡기
- assignment를 더 정교하게 만들기
- backbone과 head를 더 강하게 만들기

## 한계
YOLO v1의 한계는 구조에서 바로 나온다.

- grid 책임 분배가 rigid하다
- 작은 객체와 밀집 장면에서 불리하다
- localization과 classification을 완전히 분리하지 못한다
- 실시간성은 좋지만 정밀도는 two-stage보다 약할 수 있다

## 간단한 해결 아이디어
speed가 우선이면 one-stage를 유지하고 accuracy가 더 중요하면 아래를 먼저 보강하는 편이 낫다.

- 더 촘촘한 feature와 멀티스케일 표현을 넣는다
- 작은 물체를 위한 assignment를 다시 설계한다
- one-stage의 단순성은 유지하되 dense scene에서만 별도 보정을 둔다

그러면 YOLO의 장점을 살리면서 작은 물체와 밀집 장면에서 드러나는 grid의 단점을 조금씩 줄일 수 있다.

## 참고자료
- [Yolo V1 Notion](https://app.notion.com/p/340fb10f650181978f97fe76928784db)
- [Computer Vision Notion](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee)
- [Redmon et al., 2015, YOLO](https://arxiv.org/abs/1506.02640)
- [Girshick et al., 2014, R-CNN](https://arxiv.org/abs/1311.2524)
