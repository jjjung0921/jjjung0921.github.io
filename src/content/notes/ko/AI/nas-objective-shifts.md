---
title: "정확도 다음의 NAS: 무엇을 새 목적함수로 삼았나?"
lang: "ko"
translationKey: "nas-objective-shifts"
date: "2026-07-30"
field: "ai"
category: "Neural Architecture Search"
series: "NAS Foundations"
order: 5
status: "reading"
summary: "분류 정확도 하나를 찾던 NAS가 latency, dense prediction topology, 다중 배포 제약, pretraining 효율, training-free proxy, training recipe까지 목적을 확장한 흐름을 정리한다."
problem: "validation accuracy가 높은 architecture라도 실제 device에서 느리거나, 다른 task에 맞지 않거나, search 자체가 지나치게 비싸면 사용할 수 없다."
coreIdea: "후속 NAS는 탐색 알고리즘만 바꾼 것이 아니라 무엇을 좋은 architecture로 정의할지 바꿨다. 그 결과 device-aware, task-aware, once-for-all, pretraining-aware, training-free, joint-search라는 새 문제가 생겼다."
connection: "NAS는 내가 bi-level optimization을 처음 또렷하게 이해하고 관심을 갖게 한 분야였고, 그 분해 방식은 이후 Staged DDA에 bi-level 구조를 접목할 계기가 되었다."
tags: ["nas", "automl", "multi-objective", "hardware-aware", "dense-prediction", "pretraining"]
---

# 정확도 다음의 NAS: 무엇을 새 목적함수로 삼았나?

## 작성 배경
이 글은 내가 Notion에 작성한 [MnasNet](https://app.notion.com/p/340fb10f650181848f00ecc267ad87a4), [ProxylessNAS](https://app.notion.com/p/340fb10f650181008f36d76369aab1f3), [FBNet](https://app.notion.com/p/340fb10f650181d2b993f13714216570), [Auto-DeepLab](https://app.notion.com/p/340fb10f6501810395b4f6fee226c88c), [OFA](https://app.notion.com/p/340fb10f6501816c9485f7cfe9c51717), [NAS-BERT](https://app.notion.com/p/340fb10f650181048a30daf64e25176b), [NASWoT](https://app.notion.com/p/340fb10f650181c18c65d688d05fcde0) 리뷰를 바탕으로 썼다. 논문 선택과 핵심 해석은 내 원문에서 출발했으며, GPT로 여러 리뷰를 하나의 문제 변화로 재구성한 뒤 원문과 원 논문을 대조해 직접 검수했다. 각 방법이 실제로 바꾼 objective와 evaluator의 범위는 원 논문을 다시 대조해 보완했다.

## 출발점: 정확도가 가장 높은 architecture
초기 NAS는 대체로 다음 문제에 가까웠다.

$$
a^*
=
\arg\max_{a\in\mathcal{A}}
\mathrm{Accuracy}_{val}(a)
$$

하지만 실제 시스템에서는 이 정의가 너무 좁다. 후속 연구는 search strategy뿐 아니라 **좋음의 정의**를 바꾸며 새로운 NAS task를 만들었다.

## 1. Device-aware NAS: 정확도와 실제 latency를 함께 본다
### MnasNet
MnasNet은 target device에서 측정한 latency를 reward에 직접 넣었다.

$$
R(a)
=
\mathrm{ACC}(a)^\alpha
\left(
\frac{\mathrm{LAT}(a)}{T}
\right)^\beta
$$

$T$는 target latency다. FLOPs가 같아도 hardware kernel과 memory access에 따라 실제 속도는 다르므로 proxy 계산량만으로는 부족하다는 문제의식이다.

### ProxylessNAS와 FBNet
ProxylessNAS는 proxy task나 작은 search network가 만드는 차이를 줄이고 target hardware 위의 latency를 고려한다. FBNet은 operation별 measured latency lookup table을 사용해 expected latency를 differentiable objective에 넣는다.

$$
\min_{\alpha,w}
\mathcal{L}_{task}
+
\lambda
\log
\mathrm{LAT}(\alpha)
$$

새 task는 "가장 정확한 network"가 아니라 **주어진 device budget 안에서 가장 좋은 network**를 찾는 것이다.

## 2. Task-aware topology NAS: 분류 cell 밖을 찾는다
### Auto-DeepLab
semantic segmentation은 high-resolution spatial detail과 low-resolution semantic feature를 함께 유지해야 한다. Auto-DeepLab은 cell operation뿐 아니라 feature resolution이 network를 따라 어떻게 오르내리는지까지 탐색한다.

$$
\min_{\alpha,\beta}
\mathcal{L}_{seg,val}
\left(
w^*(\alpha,\beta),
\alpha,\beta
\right)
$$

- $\alpha$: cell 내부 operation
- $\beta$: network-level resolution transition

여기서 새 task는 classification cell search가 아니라 **dense prediction을 위한 hierarchical topology search**다.

## 3. Once-for-all NAS: 하나가 아니라 subnet family를 만든다
OFA는 device마다 architecture를 다시 search하고 retrain하는 비용을 문제로 봤다. 큰 supernet 하나를 학습한 뒤 depth, width, kernel size, resolution이 다른 subnet을 꺼낸다.

$$
a_c^*
=
\arg\max_{a\subseteq\mathcal{N}}
\mathrm{Accuracy}(a)
\quad
\text{s.t.}
\quad
\mathrm{Cost}(a)\le c
$$

제약 $c$가 바뀔 때마다 subnet $a_c^*$도 달라진다. 목적은 단일 optimum이 아니라 **여러 deployment constraint를 덮는 model family**다.

## 4. Pretraining-aware NAS: downstream 하나가 아니라 범용 표현을 찾는다
NAS-BERT는 특정 supervised task의 accuracy만으로 architecture를 고르지 않는다. BERT-like supernet을 pretraining objective로 학습하고, knowledge distillation과 evolutionary search로 작은 architecture를 찾는다.

새 질문은 다음에 가깝다.

> 하나의 downstream task에 맞는 구조가 아니라, pretraining으로 얻은 표현을 여러 NLU task에 전이하면서도 효율적인 구조는 무엇인가?

이 변화는 NAS의 평가 대상을 task-specific classifier에서 pretrained foundation encoder로 옮긴다.

## 5. Training-free NAS: model objective보다 evaluator 비용을 바꾼다
NASWOT은 candidate를 학습한 accuracy 대신 initialization 상태에서 activation pattern의 구분 정도를 score로 사용한다.

$$
s(a)=\log\det K_a
$$

$K_a$는 sample 사이 activation code의 유사성을 담는 kernel이다. 이 방법은 downstream objective를 없앤 것이 아니다. **그 objective를 근사하는 evaluator를 training-free proxy로 바꾼 것**이다. 그래서 새 task는 "좋은 모델"뿐 아니라 "학습 없이 유망 후보를 얼마나 잘 순위화할 것인가"가 된다.

## 6. Architecture + recipe joint search: 구조만 고정해서는 부족하다
FBNetV3는 architecture와 training recipe를 함께 탐색한다.

$$
(a^*,r^*)
=
\arg\max_{a,r}
\mathrm{Accuracy}(a,r)
\quad
\text{s.t.}
\quad
\mathrm{Latency}(a)\le T
$$

같은 architecture도 optimizer, augmentation, resolution, regularization에 따라 성능이 크게 달라진다. 따라서 새 task는 architecture search를 **training policy와 결합한 joint AutoML**로 확장한다.

## 새로 세운 목표를 한 표로 보기
| 새 목표 | 대표 연구 | 최적화 대상의 변화 |
|---|---|---|
| accuracy + measured latency | MnasNet, ProxylessNAS, FBNet | 모델 품질 → device-constrained 품질 |
| dense prediction topology | Auto-DeepLab | cell → cell + network resolution path |
| many deployment constraints | OFA | 단일 architecture → subnet family |
| transferable pretraining | NAS-BERT | downstream score → pretraining과 전이 효율 |
| training-free ranking | NASWOT | full training evaluator → initialization proxy |
| architecture + recipe | FBNetV3 | 구조 → 구조와 학습 방법의 joint search |

## 한계
목표를 늘리면 자동으로 더 좋은 NAS가 되는 것은 아니다.

- scalarization coefficient가 Pareto trade-off를 숨긴다
- latency는 device와 runtime에 종속된다
- proxy ranking은 standalone accuracy와 다를 수 있다
- supernet의 subnet은 서로 간섭한다
- pretraining score가 모든 downstream task를 대표하지 않는다
- architecture와 recipe를 함께 찾으면 search space가 다시 폭발한다

그래서 한 개의 종합 점수만 보고하지 말고 accuracy, latency, memory, energy, search cost를 분리해 Pareto frontier로 남기는 편이 안전하다. target device 측정과 독립 재학습도 필요하다.

## 내가 NAS에서 가져온 것
NAS는 내가 bi-level optimization이라는 구조를 처음 또렷하게 알게 하고, 그 자체에 관심을 갖게 한 분야다. DARTS를 읽으며 "학습되는 내부 변수"와 "그 학습 결과를 보고 선택하는 외부 변수"를 분리해서 보는 관점을 얻었다.

그 관점은 이후 Staged DDA를 구상할 때도 계기가 되었다. stage 안에서 나타나는 player response와 stage 사이에서 조정하는 difficulty policy를 같은 층의 변수로 섞지 않고, lower-level과 upper-level로 나누어 formulate해 볼 수 있겠다고 생각하게 된 것이다. NAS에서 출발한 관심이 Staged DDA에 bi-level optimization을 접목하는 연구 질문으로 이어졌다.

## 참고자료
- [MnasNet](https://arxiv.org/abs/1807.11626)
- [ProxylessNAS](https://arxiv.org/abs/1812.00332)
- [FBNet](https://arxiv.org/abs/1812.03443)
- [Auto-DeepLab](https://arxiv.org/abs/1901.02985)
- [Once-for-All](https://arxiv.org/abs/1908.09791)
- [NAS-BERT](https://arxiv.org/abs/2105.14444)
- [Neural Architecture Search without Training](https://arxiv.org/abs/2006.04647)
- [FBNetV3](https://arxiv.org/abs/2006.02049)
