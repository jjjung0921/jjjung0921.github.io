---
title: "Bahdanau Attention이 정렬을 다시 만든 방식"
lang: "ko"
translationKey: "language-attention-alignment"
date: "2026-07-30"
field: "ai"
category: "Natural Language Processing"
series: "Language Foundations"
order: 2
status: "reading"
summary: "additive attention이 encoder-decoder 사이의 alignment를 어떻게 학습하는지, 그리고 왜 fixed-length bottleneck을 완전히 지우지는 못하는지 정리한다."
problem: "encoder가 만든 한 개의 context vector만으로는 길고 복잡한 입력을 안정적으로 전달하기 어렵다. 그렇다면 decoder는 무엇을, 언제, 얼마나 바라봐야 할까?"
coreIdea: "Attention은 각 output step마다 입력 전체를 다시 읽게 만들어 alignment를 학습 가능한 가중치로 바꾸고, context vector를 동적으로 생성한다."
connection: "Seq2Seq의 병목을 정면으로 푼 계보를 정리한다. 이 노트는 이후 Transformer의 self-attention과 causal decoding으로 이어지는 다리 역할을 한다."
tags: ["attention", "bahdanau", "alignment", "encoder-decoder", "seq2seq"]
---

# Bahdanau Attention이 정렬을 다시 만든 방식

## 작성 배경
이 글은 내가 Notion에 남긴 원문을 바탕으로 GPT로 구조와 문장을 블로그용으로 재구성한 뒤 원문과 원 논문을 대조해 직접 검수한 버전이다. 논문 선택과 핵심 해석은 원문에서 출발했고 수식과 한계는 원 논문과 대조해 보완했다.

- [Seq2Seq](https://app.notion.com/p/340fb10f650181aea7cbe27dbe0eb212)
- [Attention](https://app.notion.com/p/340fb10f6501814fbec6d1d8a36b139a)

## 문제
Seq2Seq는 입력 전체를 하나의 context vector로 압축하는 방식 때문에 긴 문장에서 정보를 잃기 쉽다. 디코더는 매 시점마다 어떤 encoder state를 얼마나 봐야 하는지 스스로 판단해야 한다. 그 판단이 없다면 모든 출력은 같은 압축 벡터에 의존한다.

Attention은 이 문제를 정렬(alignment)의 관점에서 다시 쓴다. 입력의 어느 위치가 현재 출력에 중요한지 직접 계산하고 그 가중치를 context vector에 반영한다.

## 핵심 아이디어/발전 흐름
### 고정 context에서 동적 context로
이전 Seq2Seq에서는 모든 출력이 같은 context vector를 사용했다. Attention은 출력 token마다 다른 context vector를 만든다. 즉, 출력이 바뀌면 다시 읽을 입력 위치도 바뀐다.

### alignment를 학습 가능한 값으로
사람이 번역할 때처럼 "지금 단어가 문장의 어느 부분을 가리키는가"를 모델 안에서 계산한다. 이 정렬은 hard rule 대신 soft weight로 표현되므로 학습이 가능하다.

### encoder와 decoder를 느슨하게 연결
encoder의 모든 hidden state를 저장해 두고 decoder가 매 시점마다 필요할 때 꺼내 쓴다. 이 구조 덕분에 bottleneck이 줄고 gradient가 더 많은 경로로 흐른다.

## 방법/수식
### encoder state와 decoder state
encoder는 각 입력 위치에서 hidden state를 만든다.

$$
h_j = \mathrm{Encoder}(x_j, h_{j-1})
$$

decoder는 이전 출력과 자기 상태를 바탕으로 다음 상태를 갱신한다.

$$
s_i = f(s_{i-1}, y_{i-1}, c_i)
$$

### additive energy
Bahdanau attention은 additive score를 핵심으로 쓴다.

$$
e_{ij} = v_a^T \tanh(W_s s_{i-1} + W_h h_j)
$$

여기서 $s_{i-1}$은 현재 decoder 상태, $h_j$는 encoder의 $j$번째 hidden state다. score는 두 벡터가 얼마나 잘 맞는지 나타내는 energy로 해석할 수 있다.

### soft alignment
energy를 softmax로 정규화하면 alignment weight가 된다.

$$
\alpha_{ij} = \frac{\exp(e_{ij})}{\sum_{k=1}^{T_x} \exp(e_{ik})}
$$

이 값은 현재 출력 step $i$가 입력 위치 $j$를 얼마나 참고할지 나타낸다. 모든 $\alpha_{ij}$를 합치면 1이 된다.

### context vector
정렬 가중치를 encoder state에 적용하면 context vector를 얻는다.

$$
c_i = \sum_{j=1}^{T_x} \alpha_{ij} h_j
$$

이제 decoder는 현재 step에 맞는 정보를 받는다.

### gradient path
gradient는 $c_i$를 통해 모든 $h_j$로 흘러간다. 고정된 하나의 벡터만 통과하던 Seq2Seq와 달리 Attention은 각 출력 위치가 입력 전체와 직접 연결된다. encoder는 단순 압축기라기보다 정렬 대상 역할을 한다.

## 대표 모델 비교
| 모델 | alignment 방식 | 강점 | 남는 한계 |
|---|---|---|---|
| No attention Seq2Seq | 하나의 고정 context vector | 구조가 단순하다 | 긴 입력에서 정보 손실이 크다 |
| Bahdanau attention | additive energy로 soft alignment | 정렬을 학습 가능한 변수로 바꾼다 | 입력마다 모든 위치를 다시 본다 |
| Dot-product attention | 내적 기반 정렬 | 계산이 가볍고 후속 구조와 잘 맞는다 | 표현력이 additive보다 단순할 수 있다 |

## 참고자료
- [Bahdanau et al., 2014, Neural Machine Translation by Jointly Learning to Align and Translate](https://arxiv.org/abs/1409.0473)
- [Cho et al., 2014, Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation](https://arxiv.org/abs/1406.1078)
- [Luong et al., 2015, Effective Approaches to Attention-based Neural Machine Translation](https://arxiv.org/abs/1508.04025)

## 한계와 간단한 해결 아이디어
Attention은 병목을 줄였지만 출력마다 입력 전체를 다시 보므로 계산량이 $O(T_x T_y)$로 커진다. 또 teacher forcing에 의존하는 학습은 inference 때의 오류 누적을 완전히 막지 못해 exposure bias가 남는다. 가장 단순한 해결 아이디어는 sparse attention, coverage, scheduled sampling을 붙이는 것이다. sparse attention은 더 적은 위치만 본다. coverage는 길이 정보까지 본다. scheduled sampling은 decoder 학습 방식의 mismatch를 줄인다. 다음 계보는 여기서 self-attention으로 이어진다.
