---
title: "GPT-1이 사전학습을 언어 모델의 중심으로 만든 이유"
lang: "ko"
translationKey: "language-gpt1-pretraining"
date: "2026-07-30"
field: "ai"
category: "Natural Language Processing"
series: "Language Foundations"
order: 4
status: "reading"
summary: "decoder-only causal LM으로 unsupervised pretraining과 supervised fine-tuning을 연결한 GPT-1의 구조와 한계를 정리한다."
problem: "task-specific NLU 모델은 라벨이 필요하고 범용성이 낮다. 라벨이 부족한 상황에서 하나의 language model을 여러 task에 재사용하려면 어떻게 해야 할까?"
coreIdea: "GPT-1은 next-token prediction으로 일반 언어 능력을 먼저 학습하고, downstream task에서는 그 표현을 fine-tuning으로 재사용한다."
connection: "사전학습-미세조정 패러다임이 어디서 출발했는지 보여 주는 전환점 노트다. 이후의 foundation model 계보는 이 decoder-only 전개에서 출발한다."
tags: ["gpt-1", "pretraining", "causal-lm", "fine-tuning", "decoder-only", "language-model"]
---

# GPT-1이 사전학습을 언어 모델의 중심으로 만든 이유

## 작성 배경
이 글은 내가 Notion에 남긴 원문을 바탕으로 GPT로 구조와 문장을 블로그용으로 재구성한 뒤, 원문과 원 논문을 대조해 직접 검수한 버전이다. 논문 선택과 핵심 해석은 원문에서 출발했고, 수식과 한계는 원 논문과 대조해 보완했다.

- [Transformer](https://app.notion.com/p/340fb10f65018105bb36c2164380ff9d)
- [GPT-1](https://app.notion.com/p/340fb10f65018186a006ec657fe8ec9d)

## 문제
기존 NLU 모델은 문장 분류, 질의응답, 의미 유사성 판단처럼 특정 task에만 맞춰져 있었다. 게다가 라벨이 붙은 데이터는 항상 부족하다. 그렇다면 하나의 모델이 먼저 일반적인 언어 감각을 배우고, 그 뒤에 각 task에 맞게 바뀌도록 만들 수는 없을까?

GPT-1은 이 질문에 대해 "먼저 language model로 배우고, 그 다음 task에 맞게 조정한다"는 답을 준다.

## 핵심 아이디어/발전 흐름
### decoder-only causal LM
GPT-1은 encoder를 쓰지 않고 decoder만으로 언어를 모델링한다. 미래 토큰을 보지 않는 causal mask를 두고, 왼쪽 문맥만으로 다음 토큰을 예측한다. 이 단순한 형태가 오히려 범용 사전학습의 출발점이 된다.

### unsupervised pretraining
문장을 생성하는 능력 자체를 먼저 학습한다. 라벨이 없어도 방대한 텍스트에서 언어의 통계적 구조를 배울 수 있기 때문이다. 이 단계가 일반 표현을 만든다.

### supervised fine-tuning
사전학습된 decoder를 각 task에 맞게 미세조정한다. 입력을 task에 맞는 ordered sequence로 바꾸고, 같은 언어 모델 위에 task-specific head를 얹는다. 이때 pretrained representation이 downstream 성능을 크게 좌우한다.

### auxiliary LM objective
fine-tuning 동안에도 language modeling objective를 보조적으로 유지하면 일반성이 유지되기 쉽다. GPT-1은 이 점을 명시적으로 사용해, task loss만으로 파라미터가 급격히 좁아지는 것을 막는다.

## 방법/수식
### causal language modeling
비지도 사전학습은 다음처럼 쓸 수 있다.

$$
L_1(\mathcal U) = \sum_i \log P(u_i \mid u_{i-k}, \ldots, u_{i-1}; \Theta)
$$

여기서 미래 토큰은 조건에 들어가지 않는다. 이것이 decoder-only causal LM의 핵심이다.

### 내부 표현
GPT-1은 토큰 embedding과 position embedding을 더해 초기 표현을 만든다.

$$
h_0 = U W_e + W_p
$$

그 다음 여러 Transformer block을 거친다.

$$
h_l = \mathrm{transformer\_block}(h_{l-1}), \qquad \forall l \in [1,n]
$$

최종적으로 다음 토큰 분포를 낸다.

$$
P(u) = \mathrm{softmax}(h_n W_e^T)
$$

여기서 $W_p$는 learned positional matrix로 볼 수 있고, GPT-1은 positional encoding도 학습의 일부로 흡수했다.

### supervised fine-tuning
downstream task에서는 다음처럼 조건부 확률을 학습한다.

$$
P(y \mid x^1, \ldots, x^m) = \mathrm{softmax}(h_l^m W_y)
$$

그리고 목적함수는

$$
L_2(\mathcal C) = \sum_{(x,y)} \log P(y \mid x^1, \ldots, x^m)
$$

처럼 쓸 수 있다.

### auxiliary objective

$$
L_3(\mathcal C) = L_2(\mathcal C) + \lambda L_1(\mathcal C_1)
$$

이 보조항은 fine-tuning 중에 language modeling 능력이 지나치게 무너지지 않도록 돕는다.

## 대표 모델 비교
| 모델 | 학습 방식 | 강점 | 남는 한계 |
|---|---|---|---|
| Task-specific NLU 모델 | task마다 별도 supervision | 문제에 맞게 직접 최적화된다 | 라벨 의존성이 크고 재사용성이 약하다 |
| Encoder-decoder 계열 | 입력-출력 변환에 강하다 | 생성과 변환을 함께 다룬다 | 범용 사전학습의 중심은 아니다 |
| GPT-1 decoder-only LM | pretrain 후 fine-tune | 라벨이 적어도 일반 표현을 재사용할 수 있다 | bidirectional context를 직접 쓰지 못한다 |

## 참고자료
- [Radford et al., 2018, Improving Language Understanding by Generative Pre-Training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Vaswani et al., 2017, Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Howard & Ruder, 2018, Universal Language Model Fine-tuning for Text Classification](https://arxiv.org/abs/1801.06146)

## 한계와 간단한 해결 아이디어
GPT-1은 decoder-only라서 양방향 문맥을 직접 쓰지 못하고, fine-tuning은 task 형식에 따라 꽤 민감하다. 또 긴 입력을 다룰 때는 causal context만으로는 정보가 부족할 수 있다. 가장 단순한 해결 아이디어는 instruction tuning, retrieval augmentation, prefix/adaptor 같은 parameter-efficient adaptation을 붙이거나, 필요한 경우 encoder branch를 다시 도입해 표현력을 보강하는 것이다. 그럼에도 GPT-1은 "사전학습이 중심이고 task는 그 위에 얹는다"는 패러다임을 분명하게 열어 놓았다.
