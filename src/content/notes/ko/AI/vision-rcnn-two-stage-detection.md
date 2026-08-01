---
title: "R-CNN 계열은 왜 two-stage detection의 기준이 되었나?"
lang: "ko"
translationKey: "vision-rcnn-two-stage-detection"
date: "2026-07-30"
field: "ai"
category: "Computer Vision"
series: "Vision Foundations"
order: 2
status: "reading"
summary: "R-CNN, Fast R-CNN, Faster R-CNN, Mask R-CNN을 region proposal, RoI feature extraction, classification/regression, instance mask라는 축으로 나누어 정리한다."
problem: "탐지는 분류보다 어렵다. 물체가 '무엇인지'와 '어디에 있는지'를 동시에 찾아야 하기 때문이다."
coreIdea: "two-stage detector는 먼저 후보 영역을 찾고, 그 후보에 대해 분류와 박스 회귀를 수행해 정확도를 우선시한다."
connection: "이 글은 one-stage detector와 transformer backbone을 비교하기 위한 기준점이다."
tags: ["object-detection", "two-stage-detection", "rcnn", "fast-rcnn", "faster-rcnn", "mask-rcnn"]
---

# R-CNN 계열은 왜 two-stage detection의 기준이 되었나?

## 작성 배경
이 글은 Notion의 [Computer Vision](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee) 맥락을 따라가되, R-CNN 계열은 원 논문 [R-CNN](https://arxiv.org/abs/1311.2524), [Fast R-CNN](https://arxiv.org/abs/1504.08083), [Faster R-CNN](https://arxiv.org/abs/1506.01497), [Mask R-CNN](https://arxiv.org/abs/1703.06870)을 함께 대조해 보완했다. GPT로 구조와 표현을 재구성한 뒤 원문과 원 논문을 대조해 직접 검수했다.

> 이 글의 R-CNN / Fast R-CNN / Faster R-CNN / Mask R-CNN 구간은 Notion 원문에 직접 있던 문장을 옮긴 것이 아니라, 주변 맥락을 확장하고 원 논문과 대조해 보완한 부분이다.

## 문제 제기
객체 탐지는 분류보다 한 단계 더 복잡하다.  
이미지 안에 "무엇이 있는지"만 맞히면 끝이 아니라, "어디에 있는지"도 동시에 찾아야 한다.

R-CNN 계열은 이 문제를 정면으로 받아들이고, 후보 영역을 먼저 찾은 다음 그 후보를 분류하고 보정하는 two-stage 구조를 만들었다.

## 핵심 아이디어
two-stage detector의 핵심은 단순하다.

1. 이미지 전체에서 물체 후보를 먼저 찾는다
2. 후보 영역(RoI)을 feature로 바꾼다
3. 그 feature로 class와 bbox를 예측한다

이 순서 덕분에 탐지는 더 정확해지지만, pipeline은 무거워진다.  
그래서 R-CNN 계열은 항상 "정확도 vs 속도"의 긴장을 안고 간다.

## 버전별 흐름
### R-CNN
R-CNN은 bottom-up region proposal을 먼저 뽑고, 각 proposal을 CNN feature로 바꿔 분류와 bbox regression을 수행한다.  
핵심은 "탐지를 분류기로 재활용"하는 수준을 넘어서, detection 자체를 proposal 기반 문제로 세웠다는 점이다.

### Fast R-CNN
Fast R-CNN은 shared convolutional feature map 위에서 RoI pooling을 사용해 proposal마다 따로 CNN을 돌리는 비효율을 줄였다.

대표적인 손실은 분류와 bbox regression을 함께 묶는다.

$$
L = L_{cls} + \lambda L_{box}
$$

더 정확히 말하면, positive RoI에 대해서만 localization loss를 적용하는 multi-task loss로 이해하면 된다.

### Faster R-CNN
Faster R-CNN은 region proposal을 외부 알고리즘에 맡기지 않고, RPN(Region Proposal Network)으로 학습한다.  
RPN은 feature map 위의 각 위치에서 objectness와 bbox offset을 예측한다.

RPN의 손실도 기본적으로 classification과 regression으로 나뉜다.

$$
L_{RPN} = L_{obj} + \lambda L_{reg}
$$

여기서 중요한 변화는 proposal 단계가 네트워크 내부로 들어왔다는 점이다.  
이제 "후보를 찾는 일"도 학습 대상이 된다.

### Mask R-CNN
Mask R-CNN은 Faster R-CNN 위에 instance mask branch를 추가한다.  
즉, detection을 넘어서 instance segmentation까지 같은 틀에서 다룬다.

이때 RoIPool의 quantization 문제를 줄이기 위해 RoIAlign을 쓴다.  
RoIAlign은 좌표를 거칠게 반올림하지 않고 bilinear interpolation으로 정렬을 유지한다.

## 방법과 수식
R-CNN 계열을 가장 단순하게 쓰면 다음처럼 볼 수 있다.

$$
\text{proposal} \rightarrow \text{RoI feature} \rightarrow \text{class} + \text{bbox}
$$

여기에 Faster R-CNN은 proposal 생성을 네트워크화하고, Mask R-CNN은 mask head를 더한다.

이 구조의 핵심은 "탐지의 정확한 후보를 먼저 만들고, 그 후보를 정교하게 읽는다"는 점이다.  
그래서 two-stage는 일반적으로 작은 물체나 복잡한 장면에서 강점을 보이기 쉽다.

## 왜 이 계열이 중요했나
R-CNN 계열이 기준이 된 이유는 분명하다.

- 분류와 위치 추정을 분리해 다루면서도 end-to-end 학습으로 밀어올렸다
- proposal quality를 점점 학습 가능한 모듈로 바꿨다
- instance segmentation까지 자연스럽게 확장됐다

즉, two-stage detection은 탐지 문제를 "후보를 먼저 세밀하게 고른 뒤 정제하는 문제"로 정의했다.

## 한계
two-stage는 정확하지만 비용이 든다.

- proposal 단계가 병목이 될 수 있다
- RoI pooling과 anchor 설계가 복잡하다
- dense scene이나 작은 객체에서 여전히 어려움이 있다
- YOLO 같은 one-stage보다 실시간성에서 불리하다

## 간단한 해결 아이디어
후보 영역 품질이 병목이라면, 먼저 정렬과 proposal quality를 안정화하는 편이 낫다.

- RoIAlign으로 위치 정렬을 유지한다
- RPN처럼 proposal도 학습 가능한 모듈로 바꾼다
- 작은 객체나 dense scene은 멀티스케일 feature와 함께 다시 본다

이 순서로 보강하면 two-stage의 장점을 유지하면서도 불필요한 손실을 줄일 수 있다.

## 참고자료
- [Computer Vision Notion](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee)
- [R-CNN, 2014](https://arxiv.org/abs/1311.2524)
- [Fast R-CNN, 2015](https://arxiv.org/abs/1504.08083)
- [Faster R-CNN, 2015](https://arxiv.org/abs/1506.01497)
- [Mask R-CNN, 2017](https://arxiv.org/abs/1703.06870)
