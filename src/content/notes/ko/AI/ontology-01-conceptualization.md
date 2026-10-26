---
title: 관계가 하나 바뀌면 개념도 바뀌는가
lang: ko
translationKey: Ontology-Foundations-01-Conceptualization
date: 2026-10-26
field: ai
category: "Ontology"
series: Ontology Foundations
order: 1
projects: []
status: reading
summary: "Guarino, Oberle & Staab(2009)의 Definition 2.1–2.4를 따라, 개념화를 extensional relational structure (D, R)로 볼 때 생기는 문제와 이를 가능 세계 W 위의 함수로 고친 conceptualization C = (D, W, ℛ)를 회사 예시로 정리한다." # AI 제안 — 검토 필요
problem: 직원 한 명의 보고 관계가 바뀔 때마다 '개념화가 바뀌었다'고 해야 하는가?
coreIdea: "관계의 의미는 지금 그 관계를 맺은 튜플의 목록이 아니라, 세계 상태마다 외연을 돌려주는 함수다. 그래서 보고 관계가 바뀌어도 바뀌는 것은 세계이고 개념화는 그대로다." # AI 제안 — 검토 필요
connection: "개념화와 세계의 구분은 구현에서 TBox(모든 세계에 통하는 규칙)와 ABox(지금 세계의 사실)의 분리로 나타난다. 시리즈 뒤편에서 jobs.ttl을 만들 때 이 구분을 그대로 쓴다." # AI 제안 — 검토 필요
tags:
  - ontology
  - conceptualization
  - possible worlds
  - knowledge representation
---

# CS에서의 ontology

철학에서의 존재론(Ontology, 해당 시리즈 마지막에서 알아보겠다.)은 존재하는 것들의 본성과 구조를 탐구하는 학문이다. 반면 CS(Computer Science)에서의 ontology는 학문이 아니라 하나의 information object 혹은 computational artifact를 가리킨다. 즉, 만들어 쓰는 산출물이다. 여기서 '존재한다'는 말도 실용적으로 쓰인다. AI 시스템에게 존재하는 것은 표현할 수 있는 것이다(Gruber, Guarino et al. 2009).

이 산출물을 만드는 일은 시스템을 관찰해 드러나는 개체를 적절하게 분석하고 개념을 어떻게 일반화/구체화시킬 지에 대해 고민하는 작업이라고 할 수 있다.

예를 들어, 회사가 있다고 했을 때, 회사 안에 존재하는 직원A, 직원B라는 개체를 분석함으로써 이들을 개념적으로 어떻게 일반화시킬 것이며 일반화시킨 개념을 어떻게 다시 직원A, 직원B라는 구체화를 진행할 것인지 고민한다.

ontology의 정의는 Gruber(1993)의 "explicit specification of a conceptualization"에서 시작한다. Borst(1997)는 여기에 개념화가 여러 당사자 사이에 공유된 합의여야 한다는 조건(shared)과 기계가 읽을 수 있는 형식이어야 한다는 조건(formal)을 더했다. Studer et al.(1998)은 두 정의를 합쳐 다음과 같이 정리했다.

> An ontology is a formal, explicit specification of a shared conceptualization.

Guarino et al.(2009)은 이 정의를 세 부분으로 쪼개 3가지 질문을 던진다.

1. What is *conceptualization*?
   개념화가 무엇인지 정의하며
2. What is proper *formal, explicit specification*?
   형식적이고 명시적인 명세가 무엇이고
3. Why is *'shared'* of importance?
   왜 사람들 간의 공유가 중요한가?

본 글에서는 첫 번째 질문에 대해서 알아본다.

# 개념화(*Conceptualization*)란 무엇인가?

## 일상에서의 개념화


회사 안에 직원 a, b, c, d 4명이 있다고 하자.

협력(*cooperates-with*)이라는 단어를 아래 2개의 조건이 충족하는 상태로 정의해보자.

1. 두 사람이 동일한 목표(goal)를 가지고 있다고 선언한다.
2. 두 사람이 각자 그 목표를 달성하기 위해 무언가를 한다.

즉, 두 사람이 동일한 목표를 가지고 있더라도 그 목표를 위해 실제로 행동하지 않는다면 "협력한다"고 정의할 수 없다.

a와 b가 서로 협력하고 b와 c도 서로 협력한다고 하자. 두 쌍 $(a,b)$와 $(b,c)$는 서로 다른 관계가 아니라 협력이라는 하나의 관계에 속하는 두 사례(튜플)다. 즉, 협력이라는 단어 아래에는 공통적으로 내재된 "개념"이 존재한다. 이 개념이 어떤 두 사람이 협력 중인지를 가른다.

## 논리학으로 표현한 개념화

앞서 살펴본 예시를 논리학으로 표현한다.

- $D$ : 해당 논의에 사용되는 모든 entity의 집합 (universe of discourse)
- $R$ : $D$ 위에 정의된 관계들의 집합

으로 정의한다.

즉, 위 예시에서는

- $D = \{a, b, c, d, \dots\}$
- $R = \{\text{Person}, \text{Manager}, \text{Researcher}, \text{cooperates-with}, \text{reports-to}\}$

가 된다. Person, Manager, Researcher는 개체 하나에 대한 단항 관계(개념)이고, cooperates-with와 reports-to는 두 개체 사이의 이항 관계다.

그리고 이 $(D, R)$을 *extensional relational structure*라고 부른다. Genesereth & Nilsson은 바로 이 $(D, R)$을 개념화(conceptualization)로 정의했다. 이름에 extensional이 들어간 이유는 $R$의 원소 하나하나가 평범한 수학적 관계이기 때문이다. 즉, 지금 이 순간 그 관계를 맺고 있는 튜플들의 목록(외연, extension)이다. 이 목록은 특정한 세계 상태 하나를 반영한다.

### extensional relation structure는 개념화를 반영하지 못한다.

$\text{reports-to}$를 살펴보자.

- $\text{reports-to} = \{\dots, (a,b), (b,c), \dots\}$

이때, a와 d 또한 새롭게 $\text{reports-to}$ 관계를 맺게 됐다고 가정하자.

- $\text{reports-to}' = \text{reports-to} \cup \{(a,d)\}$

보고 관계 하나만 추가됐을 뿐인데 $R' = \{\text{Person}, \text{Manager}, \text{Researcher}, \text{cooperates-with}, \text{reports-to}'\}$이므로 $(D, R) \neq (D, R')$이다. Genesereth & Nilsson의 정의대로라면 튜플 하나 때문에 개념화 자체가 둘로 갈라진 셈이다.

하지만 '보고한다'는 개념은 바뀌지 않았다. 바뀐 것은 지금 누가 누구에게 보고하는지(세계의 상태)뿐이다. Guarino et al.(2009)이 지적하듯 개념화는 세계가 바뀐다고 해서 바뀌어서는 안 된다.

이를 해결하기 위해 세계 상태(world state, $w$)를 정의하고 그 위에서 intensional relation을 정의해 conceptualization을 한다.

### 의미는 판정 규칙이다

앞서 정의한 협력을 다시 보자. 협력의 의미는 지금 협력 중인 쌍의 목록이 아니었다. 목표 선언과 행동이라는 두 조건으로 협력 여부를 가르는 판정 규칙이었다. 원문은 이 규칙을 하나의 함수로 본다. 회사 전체의 행동 맥락(세계 상태)을 하나 받아 그 맥락에서 실제로 협력 중인 쌍의 목록을 돌려주는 함수다.

이렇게 의미를 '세계 → 외연' 함수로 보는 방식은 Carnap에서 시작해 Montague 의미론으로 이어진 전통이다(왜 가능 세계여야 하는지는 2편에서 다룬다). 이 함수를 정식화하려면 먼저 입력이 될 세계 상태가 무엇인지 정해야 한다.

### Define the World ($W$)

우선은 World에 대한 정의를 내려보자.

우리가 모델링 하는 system($S$)이 있다고 할 때, $S$를 특징짓는 관측 변수(observed variable) 전부에 값을 하나씩 할당해 보자. 이렇게 정해진 상태 하나를 world state라고 정의한다. 관측할 수 있는 것을 빠짐없이 정한 상태라는 뜻에서 원문은 이를 maximal observable state of affairs라고 부른다.

원래 world는 시스템이 시간에 따라 거쳐 가는 world state들의 순서 있는 집합이다. 하지만 원문은 단순화를 위해 시간을 추상화해 world state와 world를 같은 것으로 취급한다. 그리고 가능한 world들의 집합(일종의 평행세계 전부의 집합)을 $W$라고 쓰고 그 원소 하나를 $w \in W$로 쓴다.

> [!interpretation] 내 해석: W를 넣으면 계산량이 폭발하지 않나?
> 이 정의를 처음 읽었을 때 든 의문은 계산량이었다. 원문 예시는 직원 50,000명에 목표가 하나뿐일 때, 직원마다 관측 변수를 두 개 둔다. 그 목표를 가지고 있는가, 그리고 그 목표를 위해 실제로 행동하는가. 직원 쌍을 세지는 않는다. 직원 한 명당 Boolean 값 두 개이므로 변수는 $50{,}000 + 50{,}000 = 100{,}000$개다.
>
> world state는 이 변수들의 값 조합 하나이므로 모든 조합을 허용하면 $|W| = 2^{100000}$이다. 출력 쪽도 크다. $D$가 유한할 때 $|D^n| = |D|^n$, $|2^{D^n}| = 2^{|D|^n}$이므로 직원 50,000명 위의 이항 관계는 $2^{50000^2}$가지 후보 중 하나다. 세계마다 이런 관계를 하나씩 정해야 한다면 도저히 계산할 수 없는 크기다.
> 
> 그런데 정리해 보니 이것은 정의가 요구하는 계산이 아니었다. $W$와 $\rho$는 의미를 정의하는 수학적 대상이고, 실제 시스템은 $\mathbf{C}$를 통째로 저장하지 않는다. 대신 둘로 나눠 담는다.
>
> - **ABox**: 지금 이 세계에서 알려진 사실들. 예: $\text{reports-to}(a, b)$. 크기는 사실의 개수이지 $2^m$이 아니다.
> - **TBox**: 모든 세계에 통하는 규칙. 예: $\forall x\,(\text{Researcher}(x) \rightarrow \text{Person}(x))$.
>
> a가 d에게 새로 보고하게 되면 ABox에 사실 하나를 추가하면 된다. TBox는 그대로다. 앞에서 본 "바뀌는 것은 세계이지 개념화가 아니다"를 구현 쪽에서 본 모습이다.
>
> 다만 이것으로 계산 문제가 사라지지는 않는다. 추론은 공리를 만족하는 모든 해석을 따져야 하므로, 그 비용은 어떤 논리 언어를 쓰느냐로 정해진다(4·7편에서 다룬다).
>
> 즉, 내가 헷갈린 것은 '의미를 정의하는 일'과 '그 의미로 계산하는 일'을 같은 일로 본 부분이었다.

### Intensional relation (conceptual relation, $\mathcal{R}$)

extensional relation structure가 conceptualization에 적합하지 않은 이유는 World State에 따라서 relation의 정의가 바뀌기 때문이었다. 

원문은 relation을 튜플의 집합 대신 함수로 정의한다. world state $w$ 하나를 입력으로 받아 그 세계에서 성립하는 $n$항 관계 하나 $\rho^n(w) \subseteq D^n$을 돌려주는 total function이다. 원문은 이를 intensional relation, 또는 개념화와의 연결을 강조해 conceptual relation이라고 부른다.

- $\rho^n: W \rightarrow 2^{D^n}$

- $n$은 관계의 arity(항의 개수)다. Person은 $n=1$, reports-to는 $n=2$다.
- $D^n$은 데카르트 곱이고 $2^{D^n} = \mathcal{P}(D^n)$은 그 멱집합($D$ 위에서 가능한 모든 $n$항 관계의 집합)이다. 이것은 출력값이 아니라 출력이 속하는 공역(codomain)이다. 실제 출력은 그중 하나다.
- total function이므로 모든 $w$에 대해 출력이 정확히 하나 정해진다.
- 원문은 $\langle D, W \rangle$ 쌍을 domain space라고 부른다. 세계 상태에 따라 $D$ 위의 관계가 어떻게 달라질 수 있는지, 그 변동의 범위를 정한다는 뜻이다.

이렇게 하면 세계가 바뀔 때 바뀌는 것은 함수의 값 $\rho^n(w)$이다. 함수 $\rho^n$ 자체(개념)는 그대로다. extensional relation이 '외연 하나'라면 intensional relation은 '세계마다 외연을 정해 주는 규칙'이다.

### Intensional relational structure (conceptualization, $\mathbf{C}$)

Intensional relation을 활용하여 conceptualization을 진행한다면 

- $\mathbf{C}=(D,W,\mathcal{R})$

이 된다.

여기서 $D$는 universe of discourse, $W$는 가능한 세계들의 집합, $\mathcal{R}$은 domain space $\langle D, W \rangle$ 위의 conceptual relation들의 집합이다.

### 다시 reports-to로: 하나의 개념화, 두 개의 세계

a가 d에게 보고하기 전과 후의 두 상황은 이제 같은 $\mathbf{C}$ 안의 서로 다른 두 세계 $w_1, w_2$로 설명된다.

- $\mathcal{R} = \{\text{Person}^1, \text{Manager}^1, \text{Researcher}^1, \text{cooperates-with}^2, \text{reports-to}^2\}$
- $\text{reports-to}^2(w_1) = \{\dots, (a,b), (b,c), \dots\}$
- $\text{reports-to}^2(w_2) = \{\dots, (a,b), (b,c), (a,d), \dots\}$

두 값은 다르지만 함수 $\text{reports-to}^2$는 하나다. 그래서 개념화 $\mathbf{C}$도 하나다.

원문은 단순화를 위해 $\text{Person}^1$, $\text{Manager}^1$, $\text{Researcher}^1$ 같은 단항 관계는 rigid하다고 가정한다. 즉, 모든 세계에서 같은 외연을 갖는다. 예를 들어 모든 $w \in W$에 대해 $\text{Person}^1(w) = D$다. 반면 $\text{reports-to}^2$와 $\text{cooperates-with}^2$에는 그런 가정을 두지 않는다. 보고 관계와 협력 관계는 세계마다 달라질 수 있다.

# 결론

처음 질문으로 돌아가 보자. 직원 한 명의 보고 관계가 바뀔 때 바뀌는 것은 개념화가 아니라 세계다.

개념화를 $(D, R)$로 보면 튜플 하나에 개념화가 갈라진다. 반면 $\mathbf{C} = (D, W, \mathcal{R})$로 보면 같은 개념(함수 $\rho$)이 세계마다 다른 외연을 돌려줄 뿐이다.

다만 이 정의는 아직 수학적 구조일 뿐이다. 의미를 왜 굳이 가능 세계에 대한 함수로 봐야 하는지는 2편에서, 이 구조를 언어의 기호로 가리키고 기호가 의도한 개념에 묶이게 하는 방법(두 번째 질문인 formal, explicit specification)은 3·4편에서 다룬다.

# 참고자료

- [Guarino, N., Oberle, D., & Staab, S. (2009). What Is an Ontology? In S. Staab & R. Studer (Eds.), *Handbook on Ontologies* (2nd ed., pp. 1–17). Springer.](https://doi.org/10.1007/978-3-540-92673-3_0)
- [Gruber, T. R. (1993). A Translation Approach to Portable Ontology Specifications. *Knowledge Acquisition*, 5(2), 199–220.](https://doi.org/10.1006/knac.1993.1008)
- Borst, W. N. (1997). *Construction of Engineering Ontologies for Knowledge Sharing and Reuse*. PhD thesis, University of Twente.
- [Studer, R., Benjamins, V. R., & Fensel, D. (1998). Knowledge Engineering: Principles and Methods. *Data & Knowledge Engineering*, 25(1–2), 161–198.](https://doi.org/10.1016/S0169-023X(97)00056-6)
- Genesereth, M. R., & Nilsson, N. J. (1987). *Logical Foundations of Artificial Intelligence*. Morgan Kaufmann.
- Carnap, R. (1956). *Meaning and Necessity: A Study in Semantics and Modal Logic* (2nd ed.). The University of Chicago Press.
- Dowty, D. R., Wall, R. E., & Peters, S. (1981). *Introduction to Montague Semantics*. D. Reidel.
- [Baader, F., Calvanese, D., McGuinness, D. L., Nardi, D., & Patel-Schneider, P. F. (Eds.). (2007). *The Description Logic Handbook* (2nd ed.). Cambridge University Press.](https://doi.org/10.1017/CBO9780511711787)
