---
title: "YOLO 이전의 연대기: LeNet에서 Faster R-CNN까지"
lang: "ko"
translationKey: "vision-before-yolo-chronology"
date: "2026-07-30"
field: "ai"
category: "Computer Vision"
series: "Vision Foundations"
order: 1
status: "reading"
summary: "LeNet, AlexNet, VGG, GoogLeNet, R-CNN, Fast R-CNN, Faster R-CNN의 흐름을 시간순으로 정리하고, YOLO가 그 직선 위의 다음 단계가 아니라 별도의 one-stage 선택이라는 점을 분리한다."
problem: "비전 모델의 발전을 한 줄로 외우면 YOLO가 모든 탐지의 다음 단계처럼 보이기 쉽지만, 실제로는 분류 백본의 진화와 two-stage detector의 진화가 먼저 있었다."
coreIdea: "CNN 계열은 분류 표현을 강화했고, R-CNN 계열은 region proposal과 RoI 처리로 탐지 문제를 분리해 해결했다. YOLO는 그와 다른 one-stage 축이다."
connection: "이 연대기는 분류 백본, two-stage detector, one-stage detector, transformer 백본을 나누어 읽기 위한 기준축이다."
tags: ["computer-vision", "timeline", "cnn", "rcnn", "yolo", "backbone"]
---

# YOLO 이전의 연대기: LeNet에서 Faster R-CNN까지

## 작성 배경
이 글은 Notion의 [Convolution Network](https://app.notion.com/p/340fb10f650181e4bb75fd051bd432ae), [AlexNet](https://app.notion.com/p/340fb10f650181718180cd58468c6308), [Yolo V1](https://app.notion.com/p/340fb10f650181978f97fe76928784db), [Computer Vision](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee) 원문을 바탕으로 GPT로 구조와 표현을 재구성한 뒤, 원문과 원 논문을 대조해 직접 검수한 글이다. CNN, AlexNet, YOLO는 Notion 원문을 직접 요약했고, R-CNN 구간은 같은 맥락을 원 논문과 대조해 보완했다.

> 이 글은 YOLO를 설명하기 전에, 비전 모델이 어떤 순서로 분류와 탐지를 나눠 왔는지 먼저 잡아 두기 위한 정리다.

## 문제 제기
비전 모델의 발전을 한 줄로 외우면 YOLO가 모든 탐지의 다음 단계처럼 보이기 쉽다. 하지만 실제 시간순은 다르다. 먼저 CNN이 분류 표현을 만들었고, 그 표현을 탐지로 옮기는 two-stage 계열이 먼저 자리 잡았다. YOLO는 그 뒤에 등장한 별도의 one-stage 선택이다.

그래서 이 글에서는 "YOLO 이전"을 기준으로, 분류 백본의 발전과 탐지 파이프라인의 발전을 분리해서 본다.

## 핵심 연대기
### 1. LeNet
LeNet은 합성곱과 pooling이 이미지 분류에 유효하다는 사실을 보여 준 초창기 모델이다.  
핵심은 전체 이미지를 외우는 대신 지역 패턴을 추출하는 방식이 가능하다는 점을 먼저 증명한 데 있다.

### 2. AlexNet
AlexNet은 깊은 CNN을 ImageNet 규모에서 실제로 학습 가능하게 만들었다. ReLU, dropout, data augmentation, GPU 학습이 함께 들어가면서 "깊은 모델은 이론상 가능하다"가 아니라 "실제로 학습할 수 있다"로 바뀌었다.

### 3. VGG와 GoogLeNet
이 시기에는 두 가지 방향이 동시에 나왔다.

- VGG는 더 단순한 구조를 깊게 쌓는 방식으로 표현력을 밀었다
- GoogLeNet은 Inception 계열로 계산 효율을 밀었다

둘 다 분류 백본을 더 강하게 만드는 방향이지만, 탐지 자체를 새롭게 정의한 것은 아니다.

### 4. R-CNN
R-CNN은 분류기를 탐지기로 "재활용"하는 수준을 넘어서, region proposal을 먼저 뽑고 그 후보를 CNN feature로 분류하는 two-stage detector의 출발점이 되었다.  
여기서 중요한 점은 R-CNN이 YOLO보다 먼저 탐지 문제를 본격적으로 다뤘다는 사실이다.

### 5. Fast R-CNN
Fast R-CNN은 region proposal마다 CNN을 반복 적용하던 비효율을 줄였다. 하나의 shared feature map 위에서 RoI pooling을 써서 후보 영역을 빠르게 분류하고 bbox regression을 수행한다.

### 6. Faster R-CNN
Faster R-CNN은 region proposal 자체를 학습 가능한 RPN으로 바꿨다.  
즉, 탐지 파이프라인의 앞단이 더 이상 외부 알고리즘이 아니라 네트워크 내부의 모듈이 된다.

## 방법과 수식
### CNN의 기본 감각
합성곱의 출력 크기는 보통 다음처럼 쓴다.

$$
O = \frac{I - F + 2P}{S} + 1
$$

여기서 $I$는 입력 크기, $F$는 필터 크기, $P$는 padding, $S$는 stride다.  
이 식은 "이미지 전체를 한 번에 처리하되, 지역 구조를 유지한다"는 CNN의 감각을 요약한다.

### two-stage detector의 감각
R-CNN 계열은 다음 순서로 이해하면 된다.

$$
\text{region proposals} \rightarrow \text{feature extraction} \rightarrow \text{classification / bbox regression}
$$

핵심은 먼저 "어디를 볼지"를 정하고, 그 다음에 "무엇인지"를 판단한다는 점이다.

## 왜 이 순서가 중요한가
이 연대기를 시간순으로 보면, 비전 모델은 크게 두 축으로 갈라진다.

- 분류 백본을 계속 강하게 만드는 축
- 탐지를 위한 two-stage / one-stage 축

이 글의 시간선은 Faster R-CNN에서 멈춘다. 이후 YOLO가 속도와 단순화를 우선하는 별도의 one-stage 축을 열지만, 그 원리와 손실함수는 다음 글에서 따로 다룬다. 따라서 YOLO는 R-CNN의 "다음 버전"이 아니라, 같은 문제를 다른 제약조건 아래에서 다시 푼 선택에 가깝다.

## 한계
이 글은 흐름을 잡는 데는 좋지만, 각 모델의 세부 목적까지 모두 담지는 못한다.

- LeNet, AlexNet, VGG, GoogLeNet, R-CNN, YOLO는 모두 서로 다른 문제를 풀었다
- 한 줄 연대기로 묶으면 세부 차이가 흐려질 수 있다
- R-CNN과 YOLO를 같은 계열로 보면 구조적 차이를 놓치기 쉽다

## 간단한 해결 아이디어
먼저 백본과 탐지를 분리해서 읽는 편이 낫다.

- backbone: LeNet, AlexNet, VGG, GoogLeNet
- two-stage detection: R-CNN, Fast R-CNN, Faster R-CNN
- one-stage detection: YOLO
- transformer backbone: ViT 이후의 전환

이렇게 나눠서 본 뒤에야, 왜 YOLO가 "더 빠른 탐지"로 읽혀야 하는지 선명해진다.

## 참고자료
- [Convolution Network Notion](https://app.notion.com/p/340fb10f650181e4bb75fd051bd432ae)
- [AlexNet Notion](https://app.notion.com/p/340fb10f650181718180cd58468c6308)
- [Yolo V1 Notion](https://app.notion.com/p/340fb10f650181978f97fe76928784db)
- [Computer Vision Notion](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee)
- [LeCun et al., 1998](https://yann.lecun.com/exdb/publis/pdf/lecun-98.pdf)
- [Girshick et al., 2014, R-CNN](https://arxiv.org/abs/1311.2524)
- [Girshick, 2015, Fast R-CNN](https://arxiv.org/abs/1504.08083)
- [Ren et al., 2015, Faster R-CNN](https://arxiv.org/abs/1506.01497)
