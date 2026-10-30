---
title: "공리는 의미를 만들지 않는다"
lang: "ko"
translationKey: "Ontology-Foundations-03-axioms-and-intended-models"
date: "2026-10-26"
field: "ai"
category: "Ontology"
series: "Ontology Foundations"
order: 3
projects: []
status: "reading"
summary: "commitment는 머릿속에 있으므로 공리로 기호의 해석을 제약해야 한다. intended model을 한 세계를 묘사하는 모델로 정의하고, 회사 예시에 공리를 하나씩 쌓으며 Mod(O)가 I_K(L)에 다가가는 과정과 그 한계를 본다." # AI 제안 — 검토 필요
problem: "공리는 기호에 의미를 주는가, 의도하지 않은 해석을 걸러내는가?"
coreIdea: "공리는 의미를 새로 만들지 않고, 이미 정한 의미에 맞지 않는 해석을 걸러낼 뿐이다. 그래서 공리는 너무 느슨하거나 너무 셀 수 있고, 어떤 공리를 고르는지가 곧 어떤 개념에 commit하는지를 고르는 일이다." # AI 제안 — 검토 필요
connection: "이 글에서 쌓은 공리가 1편에서 말한 TBox다. 6편에서 jobs.ttl을 만들 때 OWL로 직접 써 본다." # AI 제안 — 검토 필요
tags: ["ontology", "intended models", "axioms", "model theory"]
---

# 2편이 남긴 질문

2편에서 기호마다 어떤 개념을 가리키는지 정했다. 언어 $L$의 어휘 $V$를 개념화 $\mathbf{C}$에 잇는 해석 함수 $\mathcal{I}$, 즉 ontological commitment다. 하지만 이 $\mathcal{I}$는 그것을 정한 사람 머릿속에 있다. 논리 언어의 기호는 원래 얼마든지 다르게 해석될 수 있어서 누군가 `cooperates-with`를 '보고 관계'로 해석해도 언어 자체에는 그것을 막을 장치가 없다.

머릿속 개념화를 남에게 보여 주는 방법은 두 가지다.

- **extension으로 명세하기**: 모든 가능 세계마다 모든 관계의 extension을 나열한다. 1편에서 본 $W$의 크기를 생각하면 불가능하다. $D$가 무한하면 더 말할 것도 없다. 대표적인 세계 몇 개를 골라 예시로 나열하는 정도는 할 수 있지만 그건 일부를 보여 줄 뿐이다.
- **intension으로 명세하기**: 언어를 정하고, 그 언어의 해석이 따라야 할 조건을 공리로 적는다. 예를 들어 "`cooperates-with`는 대칭이다"라고 적으면 대칭이 아닌 해석은 모두 걸러진다.

두 번째 방법에서 쓰는 공리의 묶음이 ontology다. 이 글은 그 공리가 정확히 무엇을 하는지에 관한 이야기다. 그러려면 먼저 "걸러서 남기고 싶은 것"이 무엇인지부터 정해야 한다.

# Intended model: 한 세계를 묘사하는 모델

2편에서 commitment $K = (\mathbf{C}, \mathcal{I})$ 하나는 세계마다 모델을 하나씩 정해 준다고 했다. 세계 $w$를 고르면 술어 기호 $P$의 해석이 $\mathcal{I}(P)(w)$로 정해지기 때문이다. 이번에는 방향을 거꾸로 해서 모델 $M = (S, I)$가 하나 주어졌을 때 그것이 commitment에 맞는 모델인지를 묻는다.

모델 $M$이 $K$에 맞으려면 두 가지가 필요하다.

$$
\forall c \in V_{\text{const}}:\ I(c) = \mathcal{I}(c), \qquad
\exists w \in W\ \ \forall P \in V_{\text{pred}}:\ I(P) = \mathcal{I}(P)(w)
$$

1. 상수 기호는 commitment가 가리키는 개체를 그대로 가리킨다.
2. 어떤 **하나의** 세계 $w$가 있어서 모든 술어 기호의 해석이 그 세계에서의 extension과 맞아떨어진다.

이런 모델을 **intended model(의도한 모델)** 이라고 하고 그 전체 집합을 $I_K(L)$로 쓴다. 두 번째 조건 때문에 intended model은 말하자면 **한 세계를 묘사한 것**이다. 예를 들어 $I(\text{reports-to}) = \text{reports-to}^2(w_1)$이고 $I(\text{cooperates-with}) = \text{cooperates-with}^2(w_1)$인 모델은 세계 $w_1$을 그대로 옮겨 적은 모델이다.

여기서 양화의 순서가 중요하다. 조건은 "$\exists w\ \forall P$"(한 세계가 모든 술어에 공통)이지, "$\forall P\ \exists w$"(술어마다 맞는 세계가 하나씩 있으면 됨)가 아니다. 둘의 차이는 작은 예로 확인해보자. 이 예에서만 Manager와 Researcher가 세계마다 달라질 수 있다고 하자.

- $D = \{a\}$, $W = \{w_1, w_2\}$
- $\text{Manager}^1(w_1) = \{a\}$, $\text{Manager}^1(w_2) = \varnothing$: $w_1$에서 a는 매니저다.
- $\text{Researcher}^1(w_1) = \varnothing$, $\text{Researcher}^1(w_2) = \{a\}$: $w_2$에서 a는 연구자다.

이제 $I(\text{Manager}) = I(\text{Researcher}) = \{a\}$인 모델을 보자. Manager의 해석은 $w_1$과 맞고 Researcher의 해석은 $w_2$와 맞는다. 술어마다 따로 보면 모두 어떤 세계와 맞는다. 하지만 두 술어를 **동시에** 맞춰 주는 세계는 없다. a가 매니저이면서 연구자인 세계는 $W$에 없기 때문이다. 그래서 이 모델은 intended model이 아니다. 어느 세계의 묘사도 아니기 때문이다.

$$
\exists w\ \forall P\ \varphi(P, w)\ \Rightarrow\ \forall P\ \exists w\ \varphi(P, w)
$$

위 방향은 항상 성립하지만 이 예가 보여 주듯 반대 방향은 성립하지 않는다. 2편의 내 해석에서 "여러 기호를 함께 보면 모든 기호가 같은 세계 $w$에서 평가돼야 한다"고 적은 조건이 바로 이것이다.

# Ontology: 공리로 모델을 거른다

이제 ontology를 정의할 수 있다. ontology $O$는 언어 $L$의 식들, 즉 공리들의 집합이다. 공리를 모두 만족하는 모델들의 집합을 $\text{Mod}(O)$라고 쓰자.

$$
\text{Mod}(O) = \{\, M \mid \text{모든 } \varphi \in O \text{에 대해 } M \models \varphi \,\}
$$

ontology를 설계하는 목표는 이 집합이 intended model들의 집합에 최대한 가까워지게 하는 것이다.

$$
\text{Mod}(O) \approx I_K(L)
$$

여기서 $\approx$는 "최대한 가깝게"를 줄여 쓴 기호이다. 이상적으로는 다음이 성립하면 좋겠지만 일반적으로 보장되지 않는다.

$$
M \models O \iff M \in I_K(L)
$$

즉, 공리(ontology)가 하는 일은 $L$의 가능한 모든 모델 가운데 **의도한 모델은 남기고 의도하지 않은 모델은 걸러내는 것**이다.

이 시리즈에서 ontology는 좁은 정의, 즉 commitment를 겨냥한 공리 집합을 뜻한다. 실제 ontology에는 사람이 읽는 이름과 설명(annotation)처럼 모델을 거르지 않는 부분도 들어가는데, 이건 5·6편에서 다룬다.

# 회사 ontology 쌓기

1편의 회사 예시로 공리를 하나씩 쌓아 보자. 공리가 하나 늘 때마다 $\text{Mod}(O)$는 줄어든다. 공리마다 어떤 모델이 걸러지는지 보면 공리가 하는 일이 보인다. $D = \{a, b, c, d\}$로 둔다.

먼저 무엇을 담으려 했는지 복기해 보자. 1편의 회사 개념화는 이랬다.

- **개체**: $D = \{a, b, c, d\}$, 회사의 직원 네 명이다.
- **단항 개념**: $\text{Person}$, $\text{Manager}$, $\text{Researcher}$. 직원은 모두 Person이고, Manager와 Researcher는 그 일부다.
- **cooperates-with**: 두 사람이 같은 목표를 선언하고, 각자 그 목표를 위해 행동할 때 성립한다. 1편에서 정한 판정 규칙이다.
- **reports-to**: 누가 누구에게 보고하는가. 우리가 써 온 세계에서는 $\{(a, b), (b, c)\}$였다.

문제는 2편에서 본 그대로다. 기호 $\text{Person}$, $\text{Manager}$, $\text{Researcher}$, $\text{cooperates-with}$, $\text{reports-to}$만 주어지면 해석 함수 $I$는 이 기호들을 $D$ 위의 아무 집합과 관계로나 보낼 수 있다. $\text{cooperates-with}$에 보고 관계의 extension을 줘도, $\text{Researcher}$를 Person 밖으로 보내도 논리는 막지 않는다. 이 많은 모델 가운데 위의 개념화에 맞는 것, 즉 intended model만 남기는 것이 목표다. 공리를 하나 더할 때마다 그 목표에 얼마나 다가가는지 보자.

**1. 분류(Taxonomic Information).** Researcher와 Manager는 Person의 하위 개념이다.

$$
O_1 = \{\ \text{Researcher}(x) \rightarrow \text{Person}(x),\ \ \text{Manager}(x) \rightarrow \text{Person}(x)\ \}
$$

$I(\text{Person}) = \{a, b\}$인데 $I(\text{Researcher}) = \{c\}$인 모델은 걸러진다. 사람이 아닌 연구자가 생기기 때문이다.

**2. 정의역과 치역(Domians and Ranges).** 두 관계는 사람과 사람 사이에서만 성립한다.

$$
O_2 = O_1 \cup \{\ \text{cooperates-with}(x, y) \rightarrow \text{Person}(x) \land \text{Person}(y),\ \ \text{reports-to}(x, y) \rightarrow \text{Person}(x) \land \text{Person}(y)\ \}
$$

$I(\text{Person}) = \{a, b, c\}$인데 $(c, d) \in I(\text{cooperates-with})$인 모델은 걸러진다. 사람이 아닌 d와 협력하는 셈이기 때문이다.

**3. 대칭(Symmetry).** 협력은 양쪽이 함께 하는 것이다.

$$
O_3 = O_2 \cup \{\ \text{cooperates-with}(x, y) \leftrightarrow \text{cooperates-with}(y, x)\ \}
$$

$I(\text{cooperates-with}) = \{(a, b)\}$처럼 $(b, a)$가 빠진 모델은 걸러진다.

**4. 추이(Transitivity).** a가 b에게, b가 c에게 보고하면 a는 c에게도 보고한다고 본다.

$$
O_4 = O_3 \cup \{\ \text{reports-to}(x, y) \land \text{reports-to}(y, z) \rightarrow \text{reports-to}(x, z)\ \}
$$

$I(\text{reports-to}) = \{(a, b), (b, c)\}$처럼 $(a, c)$가 빠진 모델은 걸러진다. 그런데 이 모델은 1편부터 우리가 써 온 바로 그 보고 관계다. 이 공리를 받아들이면 우리의 예시 세계가 걸러진다. 이 문제는 다음 절에서 다시 본다.

**5. 배타(Disjointness).** 매니저이면서 연구자인 사람은 없다.

$$
O_5 = O_4 \cup \{\ \text{Manager}(x) \rightarrow \neg\,\text{Researcher}(x)\ \}
$$

$I(\text{Manager}) = I(\text{Researcher}) = \{a\}$인 모델은 걸러진다. 앞 절에서 "어느 세계의 묘사도 아니라서" intended model이 아니었던 그 모델이다. 공리가 의도하지 않은 모델을 실제로 잡아낸 것이다.

공리를 쌓을 때마다 모델의 집합이 줄어드는 과정을 정리하면 아래와 같다.

$$
\text{Mod}(O_1) \supseteq \text{Mod}(O_2) \supseteq \text{Mod}(O_3) \supseteq \text{Mod}(O_4) \supseteq \text{Mod}(O_5)
$$
# 공리는 의미를 만들지 않는다

공리를 다섯 개 쌓았지만 그중 어느 것도 Researcher가 **무엇인지** 말하지 않았다. $\text{Researcher}(x) \rightarrow \text{Person}(x)$는 연구자를 사람 안에 넣을 뿐이다. Person의 부분집합이기만 하면 Researcher는 여전히 어떤 집합으로든 해석될 수 있다. 공리는 의미를 새로 만들지 않는다. 이미 정해 둔 의미에 맞지 않는 해석을 걸러낼 뿐이다.

그래서 공리는 두 방향으로 빗나갈 수 있다.

- **너무 느슨하면** 의도하지 않은 모델이 남는다. $O_5$까지 쌓아도 "모든 사람이 다른 모든 사람과 협력하는" 모델은 걸러지지 않는다. 대칭이고 사람 사이의 관계이기 때문이다.
- **너무 세면** 의도한 모델까지 잘린다. 추이 공리가 우리의 예시 세계를 걸러낸 것이 그 예다.

추이 공리에는 사연이 더 있다. Guarino et al. (2009)은 ontology의 역할을 처음 설명하는 대목에서 "reports-to는 비대칭이고 추이적이지 않다"는 공리를 예로 든다. 그런데 공리를 하나씩 쌓는 대목에서는 "논란이 있지만" reports-to를 추이적이라고 둔다. 한 논문 안에서 같은 기호에 반대되는 공리를 붙인 셈이다.

둘 중 무엇이 맞는지는 논리가 정해 주지 않는다. reports-to가 **직속 보고**를 뜻한다면 추이적이지 않고 **지휘 계통**을 뜻한다면 추이적이다. 어떤 공리를 고르느냐는 곧 기호가 어떤 개념에 commit하느냐를 고르는 일이다. 공리는 그 선택을 적어 두는 도구이지, 선택을 대신해 주지는 않는다.

여기서 두 단계를 구분해 두자.

- **committing** (2편): 기호마다 의도한 개념을 지정한다. 의미를 **채택**하는 일이다.
- **specifying** (3편): 그 의도에 맞는 모델만 남도록 공리를 쓴다. 의미를 **명세**하는 일이다.

둘은 이어져 있지만 같은 일이 아니다. 같은 commitment에 대해서도 $O_3$에서 멈출 수도, $O_5$까지 갈 수도 있다. ontology는 commitment를 얼마나 잘 근사하느냐의 문제다.

> [!interpretation] 내 해석: 공리는 사상 축소를 밖으로 꺼낸 것이다
> 2편에서 intensional 해석 함수 $\mathcal{I}$를 단어의 사상을 축소하는 장치로 읽었다. 기호 $P$가 갈 수 있는 extension의 후보를 $2^{D^n}$ 전체에서 $\{\rho_P(w) \mid w \in W\}$로 줄인다는 뜻이었다. 다만 그 축소는 commitment를 정한 사람 머릿속에서만 일어났다.
>
> 공리는 같은 축소를 $L$의 문장으로 적어 밖으로 꺼낸 것으로 보인다. "`cooperates-with`는 대칭이다"라는 공리는 대칭이 아닌 extension을 후보에서 지운다. 이 문장은 누구에게나 보여 줄 수 있으니 다른 사람의 해석에도 같은 축소가 걸린다.
>
> 차이는 정확도다. 머릿속 축소는 후보를 정확히 개념이 허락하는 extension으로 줄이지만 공리는 그 근처까지만 줄인다. $\text{Mod}(O) \approx I_K(L)$에서 $=$가 아니라 $\approx$인 이유가 여기 있다.

# 다음 편으로

공리가 개념화를 근사할 뿐이라면, 그 과정에서 무엇을 잃는가? 그리고 잃은 의미는 어떻게 되찾을 수 있을까? 4편에서 다룬다.

1편의 내 해석에서 실제 시스템은 개념화를 TBox와 ABox로 나눠 담는다고 했다. 이 글에서 쌓은 공리들이 바로 TBox다. 모든 세계에 통해야 하는 규칙이기 때문이다. ABox는 한 세계에서 알려진 사실들이나 한 모델의 일부를 적어 둔 것에 가깝다. 6편에서 jobs.ttl을 만들 때 이 공리들을 OWL로 직접 써 본다.

# 참고자료

- [Guarino, N., Oberle, D., & Staab, S. (2009). What Is an Ontology? In S. Staab & R. Studer (Eds.), *Handbook on Ontologies* (2nd ed., pp. 1–17). Springer.](https://doi.org/10.1007/978-3-540-92673-3_0)
- Carnap, R. (1956). *Meaning and Necessity: A Study in Semantics and Modal Logic* (2nd ed.). The University of Chicago Press.
- Guarino, N. (1998). Formal Ontology in Information Systems. In N. Guarino (Ed.), *Formal Ontology in Information Systems: Proceedings of FOIS'98* (pp. 3–15). IOS Press.
