---
title: "ViT는 CNN의 후속이 아니라 backbone 전환일까?"
lang: "ko"
translationKey: "vision-vit-transformer-backbone"
date: "2026-07-30"
field: "ai"
category: "Computer Vision"
series: "Vision Foundations"
order: 4
status: "reading"
summary: "ViT의 patch embedding, CLS token, positional embedding, Transformer encoder를 정리하고, ViT가 R-CNN에서 YOLO로 이어지는 탐지 직선의 후속이 아니라 classification backbone의 전환이라는 점을 구분한다."
problem: "CNN은 지역 패턴을 잘 잡지만, 장거리 관계를 직접 모델링하는 다른 backbone이 필요했다. ViT는 그 필요를 classification 쪽에서 먼저 풀었다."
coreIdea: "이미지를 patch sequence로 바꾸고, Transformer encoder가 그 sequence를 통합한 뒤 CLS token으로 classification을 수행한다."
connection: "이 글은 ViT가 detection 파이프라인이 아니라 backbone 패러다임의 전환이라는 점을 잡아 주는 기준점이다."
tags: ["vision-transformer", "transformer", "backbone", "classification", "detection-transfer"]
---

# ViT는 CNN의 후속이 아니라 backbone 전환일까?

## 작성 배경
이 글은 Notion의 [Convolution Network](https://app.notion.com/p/340fb10f650181e4bb75fd051bd432ae), [AlexNet](https://app.notion.com/p/340fb10f650181718180cd58468c6308), [Computer Vision](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee) 원문을 바탕으로 GPT로 구조와 표현을 재구성한 뒤 원문과 원 논문을 대조해 직접 검수한 글이다. ViT는 Notion 원문에 직접 있던 내용이 아니라 주변 맥락을 확장하고 원 논문 [ViT](https://arxiv.org/abs/2010.11929), [DETR](https://arxiv.org/abs/2005.12872), [Swin Transformer](https://arxiv.org/abs/2103.14030)를 대조해 보완했다.

> 이 글의 ViT / DETR / Swin 구간은 Notion 원문을 그대로 옮긴 것이 아니라 원문 주변 맥락을 확장하고 원 논문과 대조해 보완한 부분이다.

## 문제 제기
CNN은 이미지의 지역 구조를 잘 잡는다.
하지만 더 멀리 떨어진 패치 사이의 관계를 직접 모델링하려면 다른 백본이 필요하다.

ViT는 이 문제를 탐지보다 먼저 분류 백본에서 풀었다.
그래서 ViT는 비전에서 Transformer를 backbone으로 가져오는 별도의 전환점이다. R-CNN이나 YOLO의 직선적 후속과는 다르다.

## 핵심 아이디어
ViT의 아이디어는 아주 단순하다.

1. 이미지를 patch로 자른다
2. 각 patch를 token처럼 선형 투영한다
3. CLS token과 positional embedding을 더한다
4. Transformer encoder에 넣는다
5. CLS token의 출력을 classification head로 보낸다

ViT는 이미지를 convolution map 대신 sequence로 바꿔서 다룬다.

## 방법
### patch embedding
이미지 $x \in \mathbb{R}^{H \times W \times C}$를 $P \times P$ patch로 나누면 patch 수는 다음과 같다.

$$
N = \frac{HW}{P^2}
$$

각 patch를 펼쳐서 linear projection을 통과시키면 token이 된다.

### 입력 시퀀스
ViT의 입력은 보통 다음처럼 쓴다.

$$
z_0 = [x_{\text{cls}}; x_p^1 E; x_p^2 E; \dots; x_p^N E] + E_{\text{pos}}
$$

여기서

- $x_{\text{cls}}$는 learnable CLS token
- $E$는 patch embedding matrix
- $E_{\text{pos}}$는 positional embedding

### Transformer encoder
각 encoder block은 attention과 MLP를 residual로 쌓는다.

$$
z'_\ell = \mathrm{MSA}(\mathrm{LN}(z_{\ell-1})) + z_{\ell-1}
$$

$$
z_\ell = \mathrm{MLP}(\mathrm{LN}(z'_\ell)) + z'_\ell
$$

각 attention head는 patch들 사이의 전역 관계를 계산한다. 여러 head의 출력을 이어 붙이면 multi-head self-attention이 된다.

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

### classification head
최종 분류는 CLS token의 표현으로 수행한다.
ViT는 patch 전체를 모아 하나의 글로벌 representation으로 만든 뒤 분류한다.

## ViT가 중요한 이유
ViT는 CNN을 조금 바꾼 모델이 아니다.
ViT는 비전 백본을 Transformer로 바꿀 수 있다는 가능성을 열었다.

원 논문도 이를 분명히 말한다. pure transformer를 이미지 patch sequence에 직접 적용해도 대규모 pretraining이 있으면 strong classification backbone이 될 수 있다는 점을 보여 준다.

## detection으로 들어가는 경로
여기서 판정을 하나 내린다.

- ViT는 R-CNN → YOLO의 직선적 후속이 아니다
- ViT는 classification backbone의 전환이다
- detection 진입은 이후의 별도 설계에서 일어났다

그 후속 예가 DETR와 Swin 계열이다.

- DETR은 object detection을 set prediction으로 바꾸고 anchor와 NMS 같은 hand-designed component를 줄인다
- Swin Transformer는 hierarchical backbone과 shifted window attention으로 detection, segmentation 같은 dense prediction에 맞는다

ViT는 탐지기로 읽기보다 비전 백본의 패러다임을 바꾼 모델로 읽는 편이 맞다.

## 한계
ViT는 강하다. 하지만 그냥 CNN을 대체하는 식으로 읽으면 놓치는 점이 많다.

- data hunger가 크다
- locality inductive bias가 약하다
- 작은 데이터셋에서는 CNN보다 불리할 수 있다
- patch tokenization이 세밀한 공간 정보를 거칠게 만든다

## 간단한 해결 아이디어
ViT를 쓸 때는 완전한 대체보다 보완을 먼저 생각하는 편이 낫다.

- patch를 너무 크게 잡지 않는다
- hierarchical window나 hybrid stem을 붙인다
- detection이나 segmentation에는 ViT 단독보다 DETR, Swin 같은 후속 구성을 함께 본다

ViT는 CNN의 종말을 뜻하지 않는다. 비전 backbone 설계의 다른 출발점이다.

## 참고자료
- [Computer Vision Notion](https://app.notion.com/p/374fb10f6501808780eadc667ec72fee)
- [Convolution Network Notion](https://app.notion.com/p/340fb10f650181e4bb75fd051bd432ae)
- [AlexNet Notion](https://app.notion.com/p/340fb10f650181718180cd58468c6308)
- [Dosovitskiy et al., 2020, ViT](https://arxiv.org/abs/2010.11929)
- [Carion et al., 2020, DETR](https://arxiv.org/abs/2005.12872)
- [Liu et al., 2021, Swin Transformer](https://arxiv.org/abs/2103.14030)
