---
title: "기호는 extension이 아니라 개념을 가리킨다"
lang: "ko"
translationKey: "Ontology-Foundations-02-ontological-commitment"
date: "2026-10-26"
field: "ai"
category: "Ontology"
series: "Ontology Foundations"
order: 2
projects: []
status: "reading"
summary: "1편의 개념화를 언어의 기호로 가리키는 법을 다룬다. 모델은 기호를 extension에 묶지만 그러면 1편의 문제가 기호에서 다시 생긴다. 그래서 기호를 개념적 관계(intension)에 묶는 ontological commitment K = (C, ℐ)를 정의하고, 두 해석을 I_w(P) = ℐ(P)(w)로 잇는다." # AI 제안 — 검토 필요
problem: "기호 cooperates-with는 지금 협력 중인 쌍을 가리키는가, 협력이라는 개념을 가리키는가?"
coreIdea: "기호가 가리켜야 하는 것은 지금 세계의 extension이 아니라 세계마다 extension을 정해 주는 판정 규칙(intension)이다. commitment는 W를 지우지 않고 기호 → intension 대응을 한 층 더 붙인 것이다." # AI 제안 — 검토 필요
connection: "OWL에서 클래스 이름이 무엇을 가리키는지 정하는 일이 commitment다. 3편의 공리는 이 commitment를 다른 사람의 해석에도 걸기 위한 도구다." # AI 제안 — 검토 필요
tags: ["ontology", "ontological commitment", "intension", "first-order logic", "model theory"]
---

# 기호를 들여야 하는 순간

1편에서 개념화를 $\mathbf{C} = (D, W, \mathcal{R})$로 정의했다. 관계 $\rho$는 세계 상태마다 extension을 돌려주는 함수였고 보고 관계 하나가 바뀔 때 바뀌는 것은 개념화가 아니라 세계였다.

그런데 이 개념화는 아직 머릿속에 있는 구조다. 다른 사람이나 시스템에게 "a와 b가 협력한다"를 전하려면 이를 가리킬 기호가 필요하다. 그래서 `cooperates-with`라는 기호를 하나 들였다고 해보자.

여기서 질문이 생긴다. 영어를 모르는 사람이 이 기호를 보고 '보고 관계(`reports-to`)로 읽지 않으리라는 보장이 있을까? 기호 자체는 아무것도 말해 주지 않는다. 결국 기호를 **무엇에** 묶느냐가 문제다. 지금 협력 중인 쌍의 목록인가, 협력이라는 개념인가?

# 언어 $L$과 어휘 $V$

기호를 다루려면 먼저 언어를 정해야 한다. 이 시리즈에서는 언어 $L$을 first-order 논리 언어로 둔다. $L$이 쓰는 기호 중 $\forall$, $\land$, $\rightarrow$ 같은 논리 기호를 뺀 나머지, 즉 우리가 도메인에 맞게 들인 기호들의 집합을 어휘(vocabulary) $V$라고 한다.

$V$에는 두 종류의 기호가 있다.

- **상수 기호**: 개체 하나의 이름. 예: $a$, $b$
- **술어 기호**: 개체들 사이의 관계 이름. 예: $\text{Person}$(1항), $\text{cooperates-with}$, $\text{reports-to}$(2항)

이 글에서 $P$는 $V$에 들어 있는 $n$항 술어 기호 하나를 가리키는 자리표시다. $P$ 자리에 $\text{Person}$을 넣으면 $n=1$이고 $\text{reports-to}$를 넣으면 $n=2$다.

여기서 층위를 구분해 두자. $\text{reports-to}$라는 **기호**는 언어 $L$ 쪽에 있고, 1편의 $\text{reports-to}^2$라는 **개념적 관계**는 개념화 $\mathbf{C}$ 쪽에 있다. 둘은 이름만 같을 뿐 다른 대상이다. 이 글은 이 둘을 잇는 방법에 관한 이야기다.

# 기호를 extension에 묶기: 모델

논리학에서 기호에 의미를 주는 보통의 방법은 모델이다. 1편의 extensional relational structure $S = (D, R)$에 해석 함수 $I$를 붙인다.

$$
M = (S, I), \qquad I: V \rightarrow D \cup R
$$

$I$는 상수 기호를 $D$의 개체로, $n$항 술어 기호를 $R$에 들어 있는 $n$항 관계, 즉 tuple들의 집합으로 보낸다. 회사 예시로 보자.

- $I(\text{cooperates-with}) = \{(a,b), (b,c)\}$
- $I(\text{reports-to}) = \{(a,b), (b,c)\}$

구조 $S$와 해석 $I$를 tuple로 따로 적는 데는 이유가 있다. 같은 $S$라도 $I$가 다르면 같은 문장의 참과 거짓이 달라진다. $D = \{a, b, c\}$, $R = \{\{a,b,c\}, \{a,b\}\}$라고 하자.

- $I_1(\text{Person}) = \{a,b,c\}$, $I_1(\text{Researcher}) = \{a,b\}$이면 $\forall x\,(\text{Researcher}(x) \rightarrow \text{Person}(x))$는 참이다.
- $I_2(\text{Person}) = \{a,b\}$, $I_2(\text{Researcher}) = \{a,b,c\}$이면 같은 문장이 거짓이다.

즉, 관계들이 있다는 것만으로는 어떤 기호가 어떤 관계를 가리키는지 정해지지 않는다. 기호의 의미는 $I$가 정한다.

# 1편의 문제가 기호에서 다시 나온다

이제 a가 d에게 새로 보고하게 됐다고 가정해보자. 기호 $\text{reports-to}$의 해석은 다음처럼 바뀐다.

$$
I'(\text{reports-to}) = I(\text{reports-to}) \cup \{(a,d)\}
$$

그러면 $M = (S, I)$와 $M' = (S', I')$는 다른 모델이다. 보고 관계 하나가 바뀌었을 뿐인데 기호 $\text{reports-to}$가 가리키는 대상이 바뀌었다. 1편에서 튜플 하나 때문에 개념화가 둘로 갈라진 것과 같은 모양이다.

즉, 기호를 extension에 묶는 한 기호의 의미는 세계 상태 하나에 종속된다. 하지만 우리가 `reports-to`라고 쓸 때 뜻하는 것은 "지금 이 순간의 보고 쌍 목록"이 아니라 누가 누구에게 보고하는지를 가르는 판정 규칙이다. 1편의 말로 하면 $\rho$다.

1편에서 "왜 굳이 의미를 가능 세계에 대한 함수로 봐야 하는가"를 이 글로 넘겼다. 그 답이 여기 있다. 즉, 기호의 의미가 세계가 바뀔 때마다 흔들리지 않으려면 기호를 한 세계의 extension이 아니라 **모든 가능 세계에서 extension을 정해 주는 함수**에 묶어야 한다. 의미를 이렇게 세계 → extension 함수($I$, intension)로 보는 것이 Carnap에서 시작해 Montague 의미론으로 이어진 방식이다.

# 기호를 개념에 묶기: Ontological Commitment

그래서 해석 함수의 공역을 바꾼다. 1편의 개념화 $\mathbf{C} = (D, W, \mathcal{R})$에 새 해석 함수 $\mathcal{I}$를 붙인다.

$$
K = (\mathbf{C}, \mathcal{I}), \qquad \mathcal{I}: V \rightarrow D \cup \mathcal{R}
$$

$\mathcal{I}$는 상수 기호를 $D$의 개체로, $n$항 술어 기호를 $\mathcal{R}$에 들어 있는 $n$항 개념적 관계 $\rho$로 보낸다. 모델의 $I$와 모양은 같지만 술어 기호가 가는 곳이 다르다. $R$의 원소는 튜플 집합이고 $\mathcal{R}$의 원소는 함수다.

- $\mathcal{I}(\text{Person}) = \text{Person}^1$
- $\mathcal{I}(\text{cooperates-with}) = \text{cooperates-with}^2$
- $\mathcal{I}(\text{reports-to}) = \text{reports-to}^2$

이렇게 어휘의 기호마다 1편의 개념적 관계를 하나씩 지정하는 것을 **ontological commitment**라고 한다. 언어 $L$이 개념화 $\mathbf{C}$에 commit한다는 뜻이다. 엄밀히 말하면 commit하는 주체는 언어가 아니라 그 언어를 쓰는 사람(agent)이다. 어떤 개념화를 받아들인 사람이 언어를 제대로 쓰는 방식을 정리한 것이 commitment다.

이제 a가 d에게 새로 보고하게 돼도 $\mathcal{I}(\text{reports-to}) = \text{reports-to}^2$는 그대로다. 기호가 가리키는 것은 판정 규칙이고 바뀐 것은 그 규칙이 이번 세계에서 내놓는 값뿐이다.

# 두 해석을 잇는 식

모델의 $I$와 commitment의 $\mathcal{I}$는 어떻게 이어질까? 술어 기호 $P$ 하나를 놓고 두 단계로 나눠 보면 보인다.

$$
\mathcal{I}(P) = \rho_P
$$

먼저 $\mathcal{I}$가 기호 $P$를 개념적 관계 $\rho_P$로 보낸다. 이것이 $P$의 intension이다.

$$
I_w(P) = \mathcal{I}(P)(w) = \rho_P(w) \subseteq D^n
$$

다음으로 세계 $w$를 하나 고르면 $\rho_P$가 그 세계에서 extension $\rho_P(w)$를 내놓는다. 이것이 세계 $w$에서 $P$의 extensional 해석 $I_w(P)$다. 상수 기호 $c$는 세계와 상관없이 $I_w(c) = \mathcal{I}(c) \in D$다. 이 식은 두 해석의 정의를 이어서 풀어 쓴 것이다.

reports-to로 보면 아래와 같다.

- $\mathcal{I}(\text{reports-to}) = \text{reports-to}^2$
- $I_{w_1}(\text{reports-to}) = \text{reports-to}^2(w_1) = \{\dots, (a,b), (b,c), \dots\}$
- $I_{w_2}(\text{reports-to}) = \text{reports-to}^2(w_2) = \{\dots, (a,b), (b,c), (a,d), \dots\}$

즉, commitment 하나는 세계마다 모델 하나씩을 정해 준다. 세계를 하나 고르면 commitment에서 모델로 내려갈 수 있다. 둘의 차이를 한 줄로 쓰면 다음과 같다.

$$
\text{Extensional: } P \mapsto \rho_P(w) \qquad \text{Intensional: } P \mapsto \rho_P
$$

반대 방향, 즉 모델들만 보고 commitment를 되찾을 수 있는지는 다른 문제다. 이건 4편에서 다룬다.

> [!interpretation] 내 해석: commitment는 W를 지운 추상화인가?
> 처음 이 정의를 읽었을 때는 이렇게 이해했다. 세계 상태마다 달라지는 개념화를, 세계와 무관한 관계로 한 번 더 추상화한 것이 commitment라고.
>
> 정리해 보니 그렇지 않았다. $K = ((D, W, \mathcal{R}), \mathcal{I})$를 풀어 쓰면 $W$가 그대로 들어 있다. commitment는 개념화에서 무언가를 지운 것이 아니라, 기호 → intension이라는 대응 층을 하나 더 붙인 것이다.
>
> 그래서 "commitment는 세계 상태와 무관하다"는 말도 좁은 뜻으로만 맞다. 세계 하나로 의미가 정해지지 않는다는 뜻이지, 세계와 관계가 없다는 뜻이 아니다. 세계를 바꿔도 그대로인 것은 $\mathcal{I}$와 $\rho_P$이고, 바뀌는 것은 $\rho_P(w)$다.

> [!interpretation] 내 해석: intensional 해석 함수는 단어의 사상을 줄인다
> 기호 하나만 놓고 보면 갈 수 있는 곳이 너무 많다. $n$항 술어 기호 $P$는 모델에 따라 $D^n$의 어떤 부분집합으로든 해석될 수 있다. 즉, $I(P)$의 후보는 $2^{D^n}$ 전체다. `cooperates-with`가 보고 관계의 extension으로 해석돼도 막을 것이 없다.
>
> $\mathcal{I}$는 이 후보를 줄인다. $\mathcal{I}(P) = \rho_P$로 정해지면 $P$가 어떤 세계에서 가질 수 있는 extension은 $\rho_P(w)$ 중 하나뿐이다. 후보가 $2^{D^n}$에서 $\{\rho_P(w) \mid w \in W\}$로 좁혀지는 셈이다.
>
> 그래서 나는 intensional 해석 함수를 단어의 사상(mapping)을 축소하는 장치로 읽었다. 기호를 아무 extension으로나 보낼 수 있던 사상을, 개념 $\rho_P$가 허락하는 extension으로만 보내도록 좁힌다. 여러 기호를 함께 보면 조건이 하나 더 붙는다. 모든 기호가 같은 세계 $w$에서 평가돼야 한다.
>
> 다만 이 축소는 아직 commitment를 정한 사람 머릿속에서만 일어난다. 다른 사람의 해석에도 같은 축소를 걸려면 공리가 필요하다.

# 남은 문제: commitment는 아직 머릿속에 있다

commitment로 기호마다 어떤 개념을 가리키는지 정했다. 하지만 이 $\mathcal{I}$는 여전히 그것을 정한 사람 머릿속에 있다. `cooperates-with`를 '보고 관계'로 읽는 사람에게 내 $\mathcal{I}$를 그대로 보여 줄 방법은 없다. 논리 언어의 기호는 원래 얼마든지 다르게 해석될 수 있기 때문이다.

머릿속 개념화를 통째로 적어 보이는 방법, 즉 모든 가능 세계에서 모든 관계의 extension을 나열하는 방법은 1편에서 본 $W$의 크기 때문에 불가능하다. 남은 길은 기호의 해석을 공리로 제약하는 것이다. 의도한 해석은 남기고 의도하지 않은 해석은 걸러내는 공리들의 묶음, 그것이 ontology다. 3편에서 다룬다.

# 부록: 논리학에서의 order

first-order logic의 'order(차수)'는 **무엇에 대해 양화($\forall$, $\exists$)할 수 있느냐**로 정해진다.

- **명제 논리**: 양화가 없다. $p \land q$처럼 명제를 통째로 다룬다.
- **1차 논리(first-order)**: 개체 변수에 대해서만 양화한다. 예: $\forall x\,(\text{Researcher}(x) \rightarrow \text{Person}(x))$. $x$는 $D$의 개체를 돈다.
- **2차 논리(second-order)**: 술어(관계) 자체에 대해서도 양화한다. 예: $\forall X\,(X(a) \rightarrow X(b))$는 "a가 가진 모든 성질을 b도 가진다"는 뜻이다. $X$는 개체가 아니라 성질을 돈다.

이 글을 읽으며 헷갈리기 쉬운 지점이 세 가지 있다.

1. **arity는 order가 아니다.** $\text{reports-to}$처럼 2항 관계를 써도 양화 대상이 개체라면 1차 논리다. $\rho^n$의 $n$이나 "$n$항 술어"의 $n$은 관계의 자리 수(arity)이지 논리의 차수가 아니다.

   
   예를 들어 아래 두 문장을 비교해 보자.

   - $\forall x\,\forall y\,(\text{reports-to}(x,y) \rightarrow \neg\,\text{reports-to}(y,x))$: "a가 b에게 보고하면 b는 a에게 보고하지 않는다." 2항 관계를 쓰지만 $\forall$이 붙은 $x$, $y$는 개체다. 그래서 **1차**다.
   - $\exists X\,(X(a) \land X(b))$: "a와 b가 함께 가진 성질이 있다." $X$는 1항짜리지만 $\exists$가 술어 $X$ 자체에 붙는다. 그래서 **2차**다.

   즉, 관계의 자리 수가 커도 1차일 수 있고, 1항짜리여도 2차일 수 있다. order를 정하는 것은 $\forall$, $\exists$ 바로 뒤에 무엇이 오느냐다.

2. **intensional이라고 고차 논리가 되지는 않는다.** $\mathcal{I}$가 술어 기호를 함수 $\rho$에 대응시켜도 언어 $L$ 안에서 양화하는 대상은 여전히 개체다. first-order인지는 $L$이 무엇에 대해 양화하느냐의 문제이고, extensional/intensional은 기호를 무엇에 대응시키느냐의 문제다.
   
   같은 문장 $\varphi = \forall x\,(\text{Researcher}(x) \rightarrow \text{Person}(x))$를 두 방식으로 해석해 보자.

   - 모델 $M$: $I(\text{Researcher}) = \{a, b\}$, $I(\text{Person}) = \{a, b, c, d\}$. 집합 두 개를 놓고 $D$의 개체 $x$를 하나씩 확인한다.
   - commitment $K$: $\mathcal{I}(\text{Researcher}) = \text{Researcher}^1$이라는 함수다. 세계 $w$를 고르면 $\text{Researcher}^1(w)$라는 집합이 나오고, 그다음은 모델과 똑같이 개체 $x$를 하나씩 확인한다.

   두 경우 모두 $\varphi$ 안에서 $\forall$이 붙는 것은 $x$뿐이다. 달라진 것은 $\text{Researcher}$라는 기호를 집합에 보내느냐 함수에 보내느냐이고, 이 대응은 $L$ 바깥에서 정한다. 만약 $\forall X\,(X(a) \rightarrow X(b))$처럼 $L$ 안에서 술어 자리에 $\forall$을 붙였다면 그때는 2차가 된다.
   
   
3. **해석 함수는 $L$의 식이 아니다.** $I$와 $\mathcal{I}$, 그리고 "모델 $M$에서 문장 $\varphi$가 참이다($M \models \varphi$)" 같은 말은 $L$ 안에서 쓰는 문장이 아니라 $L$을 바깥에서 설명하는 메타언어의 말이다. 이 글에서 "모든 술어 기호 $P$에 대해"라고 쓸 때도 메타언어의 서술이지 $L$ 안의 2차 양화가 아니다.

   어느 쪽 말인지 나눠 보면 이렇다.

   | $L$ 안의 문장 (대상언어) | $L$에 대한 문장 (메타언어) |
   |---|---|
   | $\forall x\,(\text{Researcher}(x) \rightarrow \text{Person}(x))$ | $M \models \forall x\,(\text{Researcher}(x) \rightarrow \text{Person}(x))$ |
   | $\text{reports-to}(a, b)$ | $I(\text{reports-to}) = \{(a,b), (b,c)\}$ |
   | | "모든 술어 기호 $P$에 대해 $\mathcal{I}(P) \in \mathcal{R}$이다" |

   왼쪽은 $L$의 기호만으로 쓴 문장이다. 오른쪽은 그 문장이나 기호가 무엇을 뜻하는지, 참인지를 바깥에서 말한다. 프로그래밍으로 치면 `x = 3`은 Python 코드이고, "이 코드에서 `x`의 타입은 `int`다"는 Python에 대한 문장이다. 앞의 내 해석에서 "모든 기호가 같은 세계 $w$에서 평가돼야 한다"고 쓴 것도 오른쪽, 즉 메타언어의 말이다.

# 참고자료

- [Guarino, N., Oberle, D., & Staab, S. (2009). What Is an Ontology? In S. Staab & R. Studer (Eds.), *Handbook on Ontologies* (2nd ed., pp. 1–17). Springer.](https://doi.org/10.1007/978-3-540-92673-3_0)
- Carnap, R. (1956). *Meaning and Necessity: A Study in Semantics and Modal Logic* (2nd ed.). The University of Chicago Press.
- Dowty, D. R., Wall, R. E., & Peters, S. (1981). *Introduction to Montague Semantics*. D. Reidel.
