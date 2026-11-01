---
title: "Ontology는 문서다: Neuhaus (2018)의 다른 정의" # AI 제안 — 검토 필요
lang: "ko"
translationKey: "Ontology-Foundations-05-neuhaus-ontology-as-document"
date: "2026-10-30"
field: "ai"
category: "Ontology"
series: "Ontology Foundations"
order: 5
projects: []
status: "reading"
summary: "공리가 같아도 어휘와 annotation이 다르면 다른 ontology가 된다는 Neuhaus (2018)의 예에서 출발한다. ontology를 어휘·annotation·논리 이론을 담고 여러 버전으로 실현되는 문서로 보는 정의를 정리하고, 공유가 정의에 필요 없는 이유와 Guarino et al. (2009)의 렌즈와의 차이를 비교한다." # AI 제안 — 검토 필요
problem: "공리가 같으면 같은 ontology인가?"
coreIdea: "ontology의 의미는 공리만이 아니라 어휘와 annotation이 함께 정한다. 그래서 ontology는 공리 집합이 아니라, 사용자가 의도한 해석을 알아낼 수 있게 하는 문서이고 여러 버전으로 실현된다." # AI 제안 — 검토 필요
connection: "jobs.ttl을 만들 때 rdfs:label·rdfs:comment를 공리와 같은 무게로 관리하고, annotation과 공리의 mismatch를 점검하는 근거가 된다. 6편에서 두 렌즈를 jobs.ttl에 함께 대 본다." # AI 제안 — 검토 필요
tags: ["ontology", "annotation", "ontology versioning", "conceptualism", "realism"]
---

# 4편이 남긴 것

1편부터 4편까지는 Guarino et al. (2009)의 형식화를 렌즈로 썼다. 개념화는 세계 → extension 함수의 구조이고 ontology는 그것을 근사하는 공리 집합이다. 이 렌즈로 4편에서 두 가지 한계를 봤다. 공리가 완벽해도 모델만으로는 개념화를 되찾을 수 없고, 의도한 모델이라고 현실에 맞는다는 보장도 없다.

이번 글은 관점을 바꾼다. Neuhaus (2018)는 이 시리즈가 따라온 정의 자체를 비판하고 ontology를 다시 정의한다. 출발점이 되는 질문은 이것이다. 공리가 같으면 같은 ontology인가?

# 같은 공리, 다른 ontology

Neuhaus (2018)가 드는 예부터 보자. OWL로 쓴 네 개의 짧은 이론이다.

```text
(a) Class: P        DisjointWith: R
(b) Class: Dog      DisjointWith: GermanShepherd
(c) Class: Biolgy   DisjointWith: Chenistry
(d) Class: Biology  DisjointWith: Chemistry
```

논리만 보면 넷은 구별되지 않는다. 어느 하나를 만족하는 해석이 있으면 이름만 바꾼 똑같은 모양의 해석(`Class: x DisjointWith: y`)이 나머지도 만족한다. 3편의 말로 하면 네 이론이 거르는 모델의 모양은 같다.

그런데 ontology로서는 넷이 완전히 다르다.

- (a)는 논리 이론이지만, 문서만 봐서는 어떤 도메인에 대한 것인지 알 수 없다. Neuhaus (2018)는 그래서 (a)를 ontology가 아니라고 본다. Guarino et al. (2009)의 정의로는 작성자가 어떤 개념화에 commit했는지에 따라 달라지지만, 그 commitment는 텍스트에 드러나지 않는다.
- (b)는 개에 관한 ontology이고 그 주장은 틀렸다. 저먼 셰퍼드는 개다.
- (c)와 (d)는 두 학문의 관계에 관한 ontology이고 같은 도메인에 대한 같은 주장이다. (c)는 철자만 틀렸다.

논리적으로는 (d)가 (b)와 맺는 관계와 (c)와 맺는 관계가 똑같다. 그런데도 우리는 (d)와 (c)는 같은 도메인을, (d)와 (b)는 다른 도메인을 말한다는 것을 안다. 이 구분은 공리에서 나오지 않는다. **어휘를 고른 방식**에서 나온다. 자연어 단어를 어휘로 쓰는 순간 그 이론이 무엇에 관한 것인지, 즉 의도한 해석이 정해진다.

3편의 회사 ontology도 마찬가지다. $\text{Manager}(x) \rightarrow \neg\,\text{Researcher}(x)$와 $P(x) \rightarrow \neg\,R(x)$는 추론기에게 같은 공리다. 둘을 가르는 것은 기호에 붙은 **이름**뿐이다.

# annotation이 하는 일

어휘 말고도 의도한 해석을 정하는 도구가 하나 더 있다. annotation이다. Neuhaus (2018)는 annotation을 아주 넓게 잡는다. 어휘나 공리를 설명하려고 ontology에 넣은 모든 것, 즉 자연어 정의, 설명, 주석, 예시, 참고 문헌, 링크, 그림까지 포함한다.

```text
Class: P   Annotations: rdfs:label "Dog"             DisjointWith: R
Class: R   Annotations: rdfs:label "German Shepherd"
```

공리는 (a)와 똑같다. 그런데 label이 붙자 이 이론은 개에 관한 ontology가 된다. 즉, 어휘가 의미 없는 기호여도 annotation만으로 의도한 해석을 세울 수 있다.

annotation이 늘 같은 종류의 정보를 담는 것은 아니다. Neuhaus (2018)는 둘을 나눈다.

- **assertive annotation**: 도메인에 대해 참인 명제를 주장한다. 예를 들어 "이 수업 자료는 보호자 동의가 필요하다"는 경고는 도메인에 대한 주장이다.
- **그 밖의 annotation**: 새 label을 붙이는 것은 아무것도 주장하지 않는다. 작성자 같은 메타데이터는 주장이긴 하지만 도메인이 아니라 ontology 자체에 대한 주장이다.

공리는 assertive annotation의 내용만 옮겨 적을 수 있다. 그리고 실제로는 그것도 다 옮기지 못하는 경우가 많다. 어휘를 지나치게 늘려야 하거나 논리 언어의 표현력이 모자라기 때문이다. 그래서 ontology의 공리는 annotation이 담은 정보의 일부만 반영한다. ontology를 공리 집합으로만 보면 그 안에 든 정보의 상당 부분을 놓친다.

annotation과 공리가 서로 어긋날 수도 있다.

```text
Class: Dog  DisjointWith: GermanShepherd
            Annotations: rdfs:comment "German Shepherd is a popular breed of dog"
```

comment는 저먼 셰퍼드가 개라고 말하는데, 공리는 둘이 겹치지 않는다고 말한다. 공리만 보면 모순이 없으니 OWL 추론기는 이 문제를 찾지 못한다. Neuhaus (2018)는 이를 annotation과 논리 이론 사이의 mismatch라고 부른다.

# 왜 기존 정의로는 설명이 안 되나

Neuhaus (2018)는 정의의 좋고 나쁨을 인치(inch)로 설명한다. 14세기 잉글랜드에서 1인치는 보리알 세 개의 길이였다. 지금 기준에 가까운 정의, 즉 빛이 진공에서 정해진 시간 동안 가는 거리로 인치를 정의했다면 더 정밀했을 것이다. 하지만 정밀한 시계가 없던 사회에서 그 정의는 아무도 쓸 수 없었다. 사람들은 계속 원래 알던 대로 인치를 썼을 것이다.

정의가 쓸모 있으려면 정의하는 말이 정의되는 말보다 더 잘 이해되어야 한다. Neuhaus (2018)는 "개념화의 명세"라는 Gruber 계열의 정의가 여기서 실패한다고 본다. "개념화"는 "ontology"보다 더 모호하다. 그래서 이 정의들은 무언가 설명한 것처럼 느끼게 할 뿐 설명력이 없다는 것이다.

이 비판에서 Guarino et al. (2009)은 주목할 만한 예외로 꼽힌다. 개념화를 형식 이론으로 정의했기 때문이다. 그래도 Neuhaus (2018)는 다섯 가지 문제를 지적한다.

- "근사한다(approximates)"가 무엇을 뜻하는지 정의되어 있지 않다. 3편에서 $\approx$를 "최대한 가깝게"로만 읽은 것과 같은 지점이다.
- ontology를 공리 집합과 동일시하기 때문에 어휘를 고르는 일과 annotation의 역할을 설명하지 못한다. 앞의 네 이론이 바로 그 예다.
- 같은 이유로 ontology가 시간에 따라 바뀌는 것을 설명하지 못한다.
- 개념화가 여러 사람에게 공유되어 있다고 전제한다.
- 개념화를 intensional 1차 구조와 동일시하면서 기술적·철학적 문제가 생긴다.

# Neuhaus의 정의: ontology는 문서다

Neuhaus (2018)의 정의를 풀어 쓰면 이렇다.

> 어떤 도메인의 ontology는 (1) 도메인을 기술하는 어휘, (2) 그 어휘를 설명하는 annotation, (3) 어휘에 대한 논리 이론(공리와 정의)을 담은 **문서**다. 이 셋이 함께, 그 ontology를 다룰 줄 아는 사용자가 의도한 해석을 알아낼 수 있게 한다.

핵심 부품은 다음과 같다.

- **annotated logical theory** $\langle V, \Gamma, \text{Anno}, \mathcal{L} \rangle$: 어휘 $V$, 그 어휘 위의 공리 집합 $\Gamma$, annotation 집합 $\text{Anno}$, 논리 $\mathcal{L}$을 묶은 것이다. 논리를 OWL이나 1차 논리로 고정하지 않는다.
- **의도한 해석**: 공리와 assertive annotation을 **도메인에 관한 명제**로 보내는 사상이다. Guarino et al. (2009)에서 의도한 해석이 모델의 집합이었던 것과 다른 지점이다. ontology가 주장하는 명제는 annotation이 주장하는 명제와 공리가 함의하는 명제를 합친 것이다.
- **ontology version**: annotated logical theory 하나를 명세하는 문서의 한 판이다. 어휘·annotation·공리가 함께 의도한 해석을 알아낼 수 있게 해 줘야 한다.
- **ontology**: 여러 ontology version으로 실현되는 문서다. 버전들은 공리 추가, annotation 삭제, 철자 수정, annotation 번역, OWL에서 1차 논리로의 번역 같은 관계로 이어진 네트워크를 이룬다.

이렇게 보면 앞의 현상이 설명된다. (c)와 (d)는 같은 명제를 주장하므로 같은 ontology의 두 버전이다. label이 붙은 P/R 이론과 (b)는 공리는 다르게 생겼어도 같은 명제를 주장할 수 있다. annotation과 공리가 어긋나는 mismatch는 두 쪽이 주장하는 명제를 합치면 모순이 되는 경우로 정의된다.

# 공유는 필요 없다

Studer의 정의에 있던 세 번째 질문은 "왜 'shared'가 중요한가?"였다. Neuhaus (2018)의 답은 공유가 정의에 들어갈 필요가 없다는 것이다. 이유는 두 가지다.

1. 개념화를 경험으로 만든 마음속 표상으로 보면 그것은 본인 말고는 접근할 수 없다. 글자 그대로 공유될 수 없다.
2. 큰 ontology는 분업으로 만든다. Neuhaus (2018)의 예는 휴대폰 제조사다. 디자인, 부품, 조립, 수리와 재활용을 각 분야 전문가가 맡는다. 디자이너는 조립 계획을 잘 모르고, 재활용 담당자는 부품의 기능 명세를 잘 모른다. 누구의 개념화도 전체를 덮지 않고 완성된 ontology는 어느 한 사람보다 많은 것을 담는다.

그래도 함께 만들 수 있는 이유는 무엇일까? Neuhaus (2018)는 개념화를 그 속을 들여다보는 대신 겉으로 드러나는 판정으로 다룬다. 즉, 개념화가 무엇으로 이루어져 있는지 정의하지 않고 그 개념화를 받아들인 사람이 상황과 명제를 받았을 때 참·거짓·판정 불가 중 무엇으로 답하는지로만 본다. 이것을 개념화의 behavioral profile이라고 부른다.

그러면 ontology가 여러 사람의 개념화를 함께 명세한다는 것을 이렇게 정의할 수 있다. ontology가 주장하는 명제가 어느 사람의 판정과도 어긋나지 않고 각 명제는 적어도 한 사람의 판정에서 참이다. 서로 의견이 갈리는 명제에 대해서는 ontology가 입장을 정하지 않으면 된다.

> [!interpretation] 내 해석: 공동 명세는 다수결이 아니라 PR 리뷰에 가깝다
> 처음에는 중앙의 권위 없이 여러 사람의 판단으로 공동의 기록을 만든다는 점에서 비트코인과 비슷하다고 생각했다. 그런데 합의하는 방식은 거의 반대다. 비트코인은 다수결이다. 해시파워 과반이 따르는 체인이 이기고 소수 의견은 무시되며, 결국 모두가 같은 장부를 갖는다. Neuhaus (2018)의 공동 명세는 거부권에 가깝다. 한 사람이라도 거짓이라고 판정하면 그 명제는 들어갈 수 없다. 공유되는 것은 문서뿐이고 각자의 개념화는 끝까지 달라도 된다. 악의적인 참여자를 막는 장치도 없다. 전문가가 정직하게 판정한다고 전제한다.
>
> 오히려 GitHub의 PR 리뷰에 가깝다.
>
> - 해당 영역의 CODEOWNERS가 승인한다 → 그 분야 전문가 한 명이 자기가 다루는 모든 상황에서 참이라고 보증한다.
> - 아무도 Request changes를 걸지 않는다 → 누구도 거짓이라고 판정하지 않는다.
> - 잘 모르는 영역이면 다른 리뷰어는 그냥 넘어간다 → 다른 사람은 판정 불가여도 된다.
> - 의견이 갈리면 머지하지 않거나 범위를 줄인다 → 의견이 갈리는 명제는 빼거나 약하게 쓴다.
>
> 즉, 공유는 "모두가 같은 개념화를 가진다"는 강한 조건이 아니라 "한 명이 보증하고 아무도 반대하지 않는 것만 담는다"는 약한 조건이 된다.
>
> 
> 이 비유를 세우고 나니 "다수결이 더 현명하지 않나?", "AWS의 role처럼 권한을 나누면 되지 않나?"가 궁금해져 찾아봤다. 서로 연결된 명제를 다수결로 정하면 개인의 판단이 모두 일관적이어도 집단의 결론은 모순일 수 있고(List & Pettit, 2002), ontology에서도 같은 일이 일어난다(Porello & Endriss, 2014). 분야별로 결정권을 나눠도 판단 대상이 논리적으로 엮여 있으면 충돌이 생긴다(Dietrich & List, 2008). 그래서 실무에서는 모듈 분리, 축을 가로지르는 명제의 공동 조정, 추론기를 통한 일관성 검사를 섞어 쓴다. TBox와 ABox를 정리한 뒤 6편에서 자세히 다룬다.


# 4편의 두 평가가 정식화된다

4편의 내 해석에서 "논리적으로 충실한가"와 "현실에 맞는가"를 서로 다른 평가로 나눴다. Neuhaus (2018)는 이 둘을 각각 정의한다.

1. **명세가 맞는가**: ontology가 주장하는 명제가 개념화의 판정과 어긋나지 않는가
2. **개념화가 맞는가**: 개념화가 참·거짓으로 판정한 것이 실제 세계와 어긋나지 않는가

그리고 둘을 모두 통과하면, 즉 올바른 개념화를 올바르게 명세하면, 그 ontology는 현실에 대해서도 올바르다는 것을 정리로 보인다. 개념화를 중심에 두는 입장(conceptualism)과 ontology가 실재를 표현해야 한다는 입장(realism)을 이 정리가 잇는다. 손실을 한 번에 없애는 방법은 여전히 없다. 다만 손실이 명세에서 생겼는지 개념화에서 생겼는지 나눠서 점검할 수 있다.

# 두 렌즈 비교

| | Guarino et al. (2009) | Neuhaus (2018) |
|---|---|---|
| 개념화 | $\mathbf{C} = (D, W, \mathcal{R})$, 세계 → extension 함수의 구조 | 속을 정의하지 않음. 상황과 명제에 대한 판정(behavioral profile) |
| ontology | 공리 집합 $O$, $\text{Mod}(O) \approx I_K(L)$ | 여러 버전으로 실현되는 문서. 각 버전이 annotated logical theory를 명세 |
| 의미를 정하는 것 | 공리 (그리고 commitment $\mathcal{I}$) | 어휘 + annotation + 공리 |
| 의도한 해석 | 한 세계를 묘사하는 모델들의 집합 | 공리와 annotation을 명제로 보내는 사상 |
| 공유 | 전제한다 | 필요 없다 |
| 잘 보이는 것 | 추론기가 하는 일, 공리가 모델을 거르는 방식 | 사람이 ontology를 읽고 고치고 함께 만드는 방식 |

두 정의는 어느 한쪽이 틀린 관계가 아니다. Guarino et al. (2009)의 렌즈는 공리가 무엇을 하는지 정밀하게 보여 주고, Neuhaus (2018)의 렌즈는 공리 바깥에서 의미를 나르는 것들을 보여 준다.

> [!interpretation] 내 해석: LLM 이후 annotation은 기계도 읽는다
> Neuhaus (2018)가 나온 2018년 10월에는 GPT-1과 BERT가 막 공개된 때였고 언어 모델이 ontology 작업에 쓰이기 전이었다. 논문도 언어 모델을 언급하지 않는다. 이 정의는 기술이 새로 가능하게 만든 것이 아니라, annotation이 공리보다 많은 정보를 담고, 같은 ontology가 여러 언어와 버전으로 관리되고, 여러 사람이 분업으로 만드는 ontology 공학의 실무를 설명하려는 시도였다.
>
> 그런데 지금 보면 이 정의는 오히려 더 쓸모 있어졌다. 2018년에 annotation은 추론기가 무시하고 사람만 읽는 부분이었다. 이제는 LLM이 `rdfs:comment`와 자연어 정의를 읽는다. Neuhaus (2018)가 ontology의 본질로 꼽은 "어휘 + annotation + 공리가 함께 의도한 해석을 전한다"는 구조가 사람뿐 아니라 기계에게도 해당하게 된 셈이다. 공리만 보는 추론기와 annotation까지 읽는 LLM을 함께 쓴다면 annotation과 공리의 mismatch는 더 이상 사람만의 문제가 아니다.
>
> 다만 LLM의 읽기에는 추론기 같은 형식적 보장이 없어서, 사람이 맡던 점검을 보조할 뿐 대신하지는 못한다.

# 다음 편으로

6편에서는 두 렌즈를 jobs.ttl에 함께 대 본다. 3편에서 쌓은 것과 같은 공리가 모델을 거르는 일(Guarino et al. (2009))과, 어휘와 annotation이 의도한 해석을 전하는 일(Neuhaus (2018))이 실제 OWL 파일에서 어떻게 나뉘는지 본다.

# 참고자료

- [Neuhaus, F. (2018). What is an Ontology? arXiv:1810.09171.](https://arxiv.org/abs/1810.09171)
- [Guarino, N., Oberle, D., & Staab, S. (2009). What Is an Ontology? In S. Staab & R. Studer (Eds.), *Handbook on Ontologies* (2nd ed., pp. 1–17). Springer.](https://doi.org/10.1007/978-3-540-92673-3_0)
- [Gruber, T. R. (1993). A Translation Approach to Portable Ontology Specifications. *Knowledge Acquisition*, 5(2), 199–220.](https://doi.org/10.1006/knac.1993.1008)
- [List, C., & Pettit, P. (2002). Aggregating Sets of Judgments: An Impossibility Result. *Economics and Philosophy*, 18(1), 89–110.](https://researchonline.lse.ac.uk/id/eprint/704)
- [Porello, D., & Endriss, U. (2014). Ontology Merging as Social Choice: Judgment Aggregation under the Open World Assumption. *Journal of Logic and Computation*, 24, 1229–1249.](https://doi.org/10.1093/logcom/exs056)
- [Dietrich, F., & List, C. (2008). A Liberal Paradox for Judgment Aggregation. *Social Choice and Welfare*, 31(1), 59–78.](https://doi.org/10.1007/s00355-007-0263-y)
