---
title: "Attention 이전의 언어 모델: Word2Vec에서 Seq2Seq까지"
lang: "ko"
translationKey: "language-before-attention-chronology"
date: "2026-07-30"
field: "ai"
category: "Natural Language Processing"
series: "Language Foundations"
order: 1
status: "reading"
summary: "분산 표현, RNN/LSTM, Seq2Seq로 이어지는 전개를 따라가며 Attention 이전의 언어 모델이 무엇을 해결했고 어디서 병목에 막혔는지 정리한다."
problem: "단어를 벡터로 바꾸는 데서 시작해 가변 길이 문장을 다루기까지, 언어 모델은 어떤 순서로 문제를 풀어 왔을까?"
coreIdea: "Word2Vec은 의미 공간을 만들고, RNN/LSTM은 순서를 읽고, Seq2Seq는 변환 프레임워크를 제공했지만, 모든 정보를 하나의 context vector에 압축하는 순간 병목이 생겼다."
connection: "Attention 이전의 계보를 한 번에 묶어 보는 입문 노트다. 다음 노트에서 다룰 alignment가 왜 필요한지, 어떤 부족함이 먼저 나타났는지 보여준다."
tags: ["nlp", "word2vec", "rnn", "lstm", "seq2seq"]
---

# Attention 이전의 언어 모델: Word2Vec에서 Seq2Seq까지

## 작성 배경
이 글은 내가 Notion에 남긴 원문을 바탕으로 한다. GPT로 구조와 문장을 블로그용으로 재구성한 뒤 원문과 원 논문을 대조해 직접 검수한 버전이다. 논문 선택과 핵심 해석은 원문에서 출발했고 수식과 한계는 원 논문과 대조해 보완했다.

- [Word2Vec](https://app.notion.com/p/340fb10f650181888657e7592b30bfa2)
- [Seq2Seq](https://app.notion.com/p/340fb10f650181aea7cbe27dbe0eb212)

## 문제
언어는 이산적이고 단어의 순서가 중요하며 문장의 길이도 매번 달라진다. 단순한 one-hot 표현은 단어의 정체성은 알려주지만 의미적 유사성은 담지 못한다. 또 번역이나 요약 같은 문제는 단어 하나가 아니라 문장 전체의 흐름을 다뤄야 한다.

Attention 이전의 계보는 이 세 가지 문제를 순서대로 풀어 간 과정으로 볼 수 있다. 먼저 Word2Vec이 분산 표현을 만들었다. 이어서 RNN과 LSTM이 순서를 읽는 방법을 제공했고 Seq2Seq가 입력과 출력을 통째로 연결하는 프레임워크를 제시했다.

## 핵심 아이디어/발전 흐름
### Word2Vec
Word2Vec은 비슷한 문맥에서 등장하는 단어가 비슷한 벡터를 가져야 한다고 본다. 단어의 의미를 하나의 좌표계에 놓아 재사용 가능한 표현으로 바꾸었다. CBOW는 주변 단어로 중심 단어를 예측하고 Skip-gram은 중심 단어로 주변 단어를 예측한다. 이 방식은 라벨이 없어도 학습할 수 있다는 점에서 중요한 전환점이었다.

### RNN과 LSTM
RNN은 순서를 상태에 누적하는 방식으로 문장을 읽는다. 각 시점의 hidden state가 이전 상태와 현재 입력을 함께 기억하므로 문장 내부의 순서 정보를 다룰 수 있다. 다만 긴 문장에서는 과거 정보가 희미해지고 gradient가 약해진다. LSTM은 cell state와 gate를 넣어 이 문제를 줄이려는 시도다.

### Seq2Seq
Seq2Seq는 encoder-decoder 구조로 가변 길이 입력을 가변 길이 출력으로 바꾼다. 이 일반 프레임워크는 번역처럼 입력과 출력의 길이가 다른 문제를 자연스럽게 다룬다. 하지만 입력 전체를 하나의 context vector로 압축하기 때문에 문장이 길어질수록 정보가 빠지는 bottleneck이 생긴다.

## 방법/수식
### 분산 표현
Word2Vec은 문맥 기반 목적함수로 정리할 수 있다.

$$
\max_\Theta \sum_t \log P(w_t \mid w_{t-k}, \ldots, w_{t+k})
$$

이 식은 CBOW의 형태이고 Skip-gram은 다음처럼 쓸 수 있다.

$$
\max_\Theta \sum_t \sum_{\substack{-k \le j \le k \\ j \ne 0}} \log P(w_{t+j} \mid w_t)
$$

정확한 변형보다도 단어 의미가 주변 문맥에서 학습된다는 사실이 중요하다.

### 순차 상태
RNN은 대체로 다음과 같이 쓴다.

$$
h_t = f(x_t, h_{t-1})
$$

LSTM은 여기에 gate를 넣어 장기 기억을 보호한다.

$$
c_t = f_t \odot c_{t-1} + i_t \odot \tilde{c}_t,\qquad
h_t = o_t \odot \tanh(c_t)
$$

여기서 $c_t$는 cell state, $h_t$는 hidden state다. 이 구조 덕분에 단기 순서와 장기 의존성을 함께 다루려 한다.

### Seq2Seq
Seq2Seq는 출력 시퀀스를 다음처럼 모델링한다.

$$
p(\mathbf{y}) = \prod_{t=1}^{T_y} p(y_t \mid y_{<t}, c)
$$

여기서 $c = q(h_1,\ldots,h_{T_x})$는 encoder가 만든 하나의 context vector다. 이 하나의 벡터에 source sentence의 정보가 모두 담겨야 하므로 길이가 길어질수록 압축 손실이 커진다. 디코더는 보통 이전 출력과 hidden state를 바탕으로 다음 토큰을 예측하고 탐색에는 beam search를 쓰기도 한다.

## 대표 모델 비교
| 모델 | 해결한 문제 | 강점 | 남는 한계 |
|---|---|---|---|
| Word2Vec | 단어 의미 표현 | 문맥을 통해 단어를 분산 표현으로 바꾼다 | 문맥별 의미 변화는 직접 다루지 못한다 |
| RNN/LSTM | 순서와 상태 누적 | 문장의 시간적 구조를 읽는다 | 긴 의존성과 병렬화에 약하다 |
| Seq2Seq | 가변 길이 변환 | 번역 같은 입력-출력 변환을 일반화한다 | 모든 정보를 한 벡터에 압축하는 bottleneck이 있다 |

## 참고자료
- [Mikolov et al., 2013, Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/abs/1301.3781)
- [Mikolov et al., 2013, Distributed Representations of Words and Phrases and their Compositionality](https://arxiv.org/abs/1310.4546)
- [Hochreiter & Schmidhuber, 1997, Long Short-Term Memory](https://www.bioinf.jku.at/publications/older/2604.pdf)
- [Cho et al., 2014, Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation](https://arxiv.org/abs/1406.1078)
- [Sutskever et al., 2014, Sequence to Sequence Learning with Neural Networks](https://arxiv.org/abs/1409.3215)

## 한계와 간단한 해결 아이디어
이 계보의 마지막 한계는 하나의 context vector에 모든 정보를 넣으려는 설계다. 문장이 길어질수록 정보가 눌리고 RNN 계열의 순차 계산은 병렬화도 어렵다. 가장 단순한 해결 아이디어는 디코더가 입력 전체를 다시 참조하게 만드는 것이다. 바로 그 다음 단계가 Attention이다.
