---
title: "BERT는 왜 양방향 표현을 핵심 문제로 정의했는가?"
lang: "ko"
translationKey: "bert-bidirectional"
date: "2026-03-06"
category: "AI Systems"
status: "implemented"
summary: "마스크 언어 모델링이 왜 BERT의 양방향 표현 학습을 가능하게 했는지 정리한 노트."
problem: "단방향 언어 모델은 토큰 표현을 학습할 때 좌우 문맥을 동시에 사용할 수 없다."
coreIdea: "마스크 언어 모델링은 사전학습 중 마스크된 토큰의 양쪽 문맥을 함께 조건으로 사용할 수 있게 한다."
connection: "제약된 QA와 스포일러 방지 검색에서도 표현 전략과 접근 경계는 함께 설계되어야 한다."
tags: ["BERT", "Representation", "Language Models"]
---

# BERT는 왜 양방향 표현을 핵심 문제로 정의했는가?

## 문제

단방향 언어 모델은 앞이나 뒤 한쪽 문맥만 사용한다. 의미가 뒤쪽 정보에 의해 결정되는 경우에는 표현 학습이 제한된다.

## 핵심 아이디어

BERT는 마스크 언어 모델링을 사용해 마스크된 토큰을 예측하도록 학습한다. 이때 모델은 좌우 문맥을 동시에 볼 수 있다.

$$
L(\theta) = - \sum_i \log P(x_i \mid x_{\setminus i}; \theta)
$$

## 메커니즘

```python
masked_tokens = sample(tokens, ratio=0.15)
loss = model.predict(masked_tokens, context=tokens)
loss.backward()
```

| 구성 요소 | 역할 |
|---|---|
| Masked Language Modeling | 양방향 토큰 표현 학습 |
| Transformer Encoder | 좌우 문맥 혼합 |
| Fine-tuning Head | downstream task 적응 |

## 연구 연결

웹소설 QA처럼 접근 가능한 에피소드가 제한되는 문제에서는 표현력만이 아니라 검색 경계도 중요하다. 허용된 문맥 안에서만 답하도록 만드는 구조가 필요하다.
