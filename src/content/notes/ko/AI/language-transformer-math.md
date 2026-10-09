---
title: "Transformer의 수학: Q, K, V부터 residual까지"
lang: "ko"
translationKey: "language-transformer-math"
date: "2026-07-30"
field: "ai"
category: "Natural Language Processing"
series: "Language Foundations"
order: 3
status: "reading"
summary: "self-attention, positional encoding, multi-head, mask, residual connection, layer norm, FFN을 수식으로 이어 설명한다."
problem: "RNN 계열은 순차 계산 때문에 병렬화가 어렵고 긴 문맥에서 비용이 커진다. recurrence를 버린 모델은 어떻게 순서와 의존성을 동시에 다룰 수 있을까?"
coreIdea: "Transformer는 token 간 관계를 attention으로 직접 계산하고, 위치 정보는 encoding으로 따로 주입하며, encoder-decoder 전체를 병렬 가능한 블록으로 재구성한다."
connection: "이 노트는 sequence modeling을 attention 기반 블록으로 다시 쓴 계보를 정리한다. 이후의 sparse/linear attention과 long-context 연구는 여기서 자연스럽게 이어진다."
tags: ["transformer", "self-attention", "positional-encoding", "mask", "layer-norm", "ffn"]
---

# Transformer의 수학: Q, K, V부터 residual까지

## 작성 배경
이 글의 바탕은 내가 Notion에 남긴 원문이다. GPT로 구조와 문장을 블로그용으로 재구성했다. 그 뒤 원문과 원 논문을 대조해 직접 검수했다. 논문 선택과 핵심 해석은 원문에서 출발했다. 수식과 한계는 원 논문과 대조해 보완했다.

- [Attention](https://app.notion.com/p/340fb10f6501814fbec6d1d8a36b139a)
- [Transformer](https://app.notion.com/p/340fb10f65018105bb36c2164380ff9d)

## 문제
RNN과 LSTM은 순서를 잘 보존한다. 하지만 다음 hidden state를 계산해야 다음 단계로 갈 수 있다. 이 순차 의존성은 병렬화를 막는다. 긴 문맥에서는 계산 비용을 키운다. Transformer는 이 문제를 recurrence 없이 풀 수 있는가라는 질문에 대한 답이다.

Transformer는 token 사이의 관계를 직접 계산한다. 위치는 별도로 넣어 준다. 그래서 모델은 순서를 "계산 순서"로 읽지 않고 "표현된 위치 정보"로 읽는다.

## 핵심 아이디어/발전 흐름
### self-attention
각 token은 다른 token을 참고하면서 자신의 표현을 다시 만든다. 문장 전체가 서로를 참고해 새 표현을 계산한다. self-attention은 encoder와 decoder 내부에서 모두 같은 방식으로 쓰인다.

### positional encoding
순서를 없앤 대신 위치를 따로 넣어야 한다. sin/cos 기반 positional encoding은 token 위치를 각 차원에 다른 주기로 주입한다. 모델은 이 값으로 상대적 위치를 구분할 수 있다.

### multi-head와 block 구조
하나의 attention만 쓰지 않고 여러 head를 병렬로 둔다. 각 head는 서로 다른 표현 공간을 보고 마지막에 concat된다. 여기에 residual, layer norm, FFN을 쌓으면 하나의 Transformer block이 된다.

### encoder-decoder 흐름
입력은 encoder stack에서 전역 문맥으로 바뀐다. decoder는 masked self-attention으로 미래를 보지 않으면서 cross-attention으로 encoder 출력을 읽는다. 이 구조 덕분에 번역과 같은 sequence-to-sequence 문제를 병렬적으로 다룰 수 있다.

## 방법/수식
### Q, K, V projection
입력 표현을 $X$라고 하면 세 개의 선형 변환으로 query, key, value를 만든다.

$$
Q = XW_Q,\qquad K = XW_K,\qquad V = XW_V
$$

query는 "무엇을 찾는가", key는 "무엇을 가지고 있는가", value는 "실제로 전달할 정보"로 읽으면 된다.

### scaled dot-product attention

$$
\mathrm{Attention}(Q, K, V)
=
\mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

$\sqrt{d_k}$로 나누는 이유는 dot product의 분산이 차원 수에 따라 커지기 때문이다. 스케일링이 없으면 softmax가 너무 쉽게 포화되어 학습이 불안정해진다.

### multi-head attention

$$
\mathrm{head}_i = \mathrm{Attention}(QW_i^Q, KW_i^K, VW_i^V)
$$

$$
\mathrm{MultiHead}(Q,K,V)
=
\mathrm{Concat}(\mathrm{head}_1,\ldots,\mathrm{head}_h)W^O
$$

여러 head를 쓰면 서로 다른 관계를 병렬로 본다. 한 head는 근접한 구문 관계를, 다른 head는 장거리 참조를 잡을 수 있다.

### positional encoding

$$
PE_{(pos,2i)} = \sin\left(pos / 10000^{2i/d_{model}}\right)
$$

$$
PE_{(pos,2i+1)} = \cos\left(pos / 10000^{2i/d_{model}}\right)
$$

각 차원에 다른 주기를 넣기 때문에 모델은 위치와 상대 위치를 구별할 수 있다.

### mask
Decoder에서는 미래 토큰을 보면 안 된다. 그래서 causal mask를 넣는다.

$$
\mathrm{softmax}\left(\frac{QK^T + M}{\sqrt{d_k}}\right)V
$$

여기서 $M_{ij}$는 $j>i$일 때 $-\infty$, 그렇지 않으면 0인 상삼각 마스크라고 보면 된다.

### residual, layer norm, FFN
각 sublayer는 residual connection과 layer normalization을 거친다.

$$
x_{l+1} = \mathrm{LayerNorm}(x_l + \mathrm{Sublayer}(x_l))
$$

position-wise feed-forward network는 다음처럼 쓸 수 있다.

$$
\mathrm{FFN}(x) = \max(0, xW_1 + b_1)W_2 + b_2
$$

이 블록이 여러 층 쌓여 encoder와 decoder를 이룬다.

### 전체 흐름
입력 embedding에 positional encoding을 더해 encoder stack을 통과시킨다. 그다음 decoder는 masked self-attention과 encoder-decoder attention을 차례로 거친다. 마지막에는 linear projection과 softmax로 다음 토큰 분포를 낸다.

## 대표 모델 비교
| 모델 | 계산 방식 | 강점 | 남는 한계 |
|---|---|---|---|
| RNN/LSTM seq2seq | 순차적 상태 갱신 | 순서 정보를 자연스럽게 읽는다 | 병렬화가 어렵고 긴 문맥에서 느리다 |
| ConvS2S / ByteNet | 국소 receptive field 중심 | RNN보다 병렬화가 쉽다 | 멀리 떨어진 의존성은 여러 층을 거쳐야 한다 |
| Transformer | self-attention 기반 | 전역 관계를 직접 보고 병렬화가 쉽다 | attention cost가 길이에 따라 커진다 |

## 참고자료
- [Vaswani et al., 2017, Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Gehring et al., 2017, Convolutional Sequence to Sequence Learning](https://arxiv.org/abs/1705.03122)
- [Kalchbrenner et al., 2016, Neural Machine Translation in Linear Time](https://arxiv.org/abs/1610.10099)

## 한계와 간단한 해결 아이디어
Transformer의 가장 큰 비용은 긴 시퀀스에서 커지는 $O(n^2)$ attention이다. 위치 정보를 따로 넣는 방식도 긴 문맥에서는 완전한 해답이 아니다. 해결 아이디어로는 sparse attention, chunking, retrieval을 조합하는 방법이 가장 단순하다. sparse attention은 일부 위치만 보고 chunking은 영역을 나눠 처리한다. retrieval은 외부 기억을 붙인다. sequence modeling에서는 효율성이 다시 문제가 된다.
