---
title: "모델로는 개념을 되돌릴 수 없다"
lang: "ko"
translationKey: "Ontology-Foundations-04-limits-of-models"
date: "2026-10-26"
field: "ai"
category: "Ontology"
series: "Ontology Foundations"
order: 4
projects: []
status: "reading"
summary: "개념화를 공리로 옮길 때 생기는 의미 손실을 두 겹으로 나눈다. 근사 오차는 고칠 수 있지만, 모델은 세계를 기억하지 않기 때문에 Mod(O) = I_K(L)이어도 개념화를 되찾을 수 없다. 어휘와 도메인을 늘리는 처방, intended model과 현실 사이의 간극, 실무 점검 방법을 함께 정리한다." # AI 제안 — 검토 필요
problem: "공리를 완벽하게 써도, 모델만 보고 원래의 개념화를 되찾을 수 있는가?"
coreIdea: "개념화를 공리로, 다시 모델로 펼쳐 놓는 한 의미 손실은 피할 수 없다. 개념화에서 extension의 모음으로 가는 변환은 단사가 아니므로 거꾸로 돌아갈 길이 일반적으로 없다." # AI 제안 — 검토 필요
connection: "jobs.ttl을 만들 때 competency questions로 어휘의 빈 곳을, OntoClean으로 분류 계층의 오류를 점검하는 근거가 된다. 5편에서는 Neuhaus (2018)의 렌즈로 같은 문제를 다시 본다." # AI 제안 — 검토 필요
tags: ["ontology", "identifiability", "intended models", "ontological realism", "ontology evaluation"]
---

# 3편이 남긴 질문

3편에서 ontology를 공리들의 집합으로 보고, 공리가 하는 일을 "의도한 모델은 남기고 의도하지 않은 모델은 걸러내는 것"으로 정리했다. 그리고 공리는 commitment를 정확히 옮기지 못하고 근사할 뿐이라는 데서 멈췄다.

$$
\text{Mod}(O) \approx I_K(L)
$$

이 글은 그 $\approx$에서 무엇이 빠져나가는지, 그리고 빠져나간 의미를 되찾을 수 있는지에 관한 이야기다.

> [!interpretation] 내 해석: 개념화를 공리로 옮기면 사상이 다시 확장된다
> 2편에서 intensional 해석 함수 $\mathcal{I}$를 단어의 사상을 축소하는 장치로 읽었다. 기호 $P$가 갈 수 있는 extension의 후보를 $2^{D^n}$ 전체에서 $\{\rho_P(w) \mid w \in W\}$로 줄인다는 뜻이었다. 3편에서는 공리를 그 축소를 밖으로 꺼낸 것으로 읽었다.
>
> 그런데 원래의 개념화를 공리로 옮기는 일은 머릿속에서 좁혀 둔 사상을 다시 확장하는 일이 된다. 머릿속의 $\mathcal{I}$는 후보 집합을 곧바로 가리킬 수 있지만, 공리는 그 집합을 직접 가리킬 수 없고 조건으로 둘레만 그릴 수 있기 때문이다. 둘레를 느슨하게 그리면 개념이 허락하지 않는 extension이 다시 들어오고, 너무 좁게 그리면 허락된 extension이 빠진다.
>
> 즉, 개념화를 공리로, 다시 모델로 펼쳐 놓는 한 의미 손실은 피할 수 없다.

![공리가 그리는 둘레와 사상 축소 — 머릿속 ℐ는 후보를 정확히 가리키고, 느슨한 공리는 허락 안 된 extension을 들이며, 너무 좁은 공리는 허락된 extension을 잘라 낸다|620](ontology-axiom-boundary.svg "그림 1. 사각형은 기호 P가 가질 수 있는 extension 후보 전체, 초록 영역은 개념이 허락한 extension이다. 머릿속 ℐ는 이 영역을 정확히 가리키지만, 공리는 조건으로 둘레(점선)만 그릴 수 있다. 둘레가 느슨하면 허락되지 않은 extension(주황)이 들어오고, 너무 좁으면 허락된 extension(속 빈 원)이 빠진다.")

# 손실은 두 겹이다

손실은 두 겹으로 나눠 볼 수 있다.

1. **근사 오차**: 둘레를 잘못 그려서 생기는 손실이다.
2. **근사가 완벽해도 남는 손실**: $\text{Mod}(O) = I_K(L)$이 되더라도 남는 손실이다.

근사 오차 문제는 **이론적으로** 오차를 0에 근사할 수 있다. 3편의 회사 ontology에서 $O_5$까지 쌓아도 "모든 사람이 다른 모든 사람과 협력하는" 모델이 남았다면, 그것을 막는 공리를 더하면 된다. 

만약 Transitivity가 우리의 예시 세계를 잘라 냈다면 그 공리를 빼면 된다. 이렇게 공리를 고쳐 가면 이론적으로는 $\text{Mod}(O) = I_K(L)$까지 갈 수 있다.

문제는 두 번째다. 이 글의 대부분은 두 번째에 관한 것이다.

# 모델은 세계를 기억하지 않는다

공리를 아무리 잘 써서 $\text{Mod}(O) = I_K(L)$이 되더라도 모델들만 보고 원래의 개념화를 되찾을 수 있을까? 모델은 개념화의 세계 하나하나를 기억하지 않는다. 예를 들어 협력을 "목표만 같으면 된다"로 보는 개념화와 "목표를 위해 행동까지 해야 한다"로 보는 개념화는, `cooperates-with`라는 기호 하나만으로는 모델에서 구분되지 않는다.

![협력 판정 규칙의 정의역·공역·치역 — 세계 ①은 {(a,b),(b,a)}로, ②와 ③은 모두 공집합으로 간다. 공집합에서 거꾸로 가면 어느 세계였는지 알 수 없다|620](ontology-cooperation-collapse.svg "그림 2. 협력 판정 규칙 ρ는 세계마다 extension을 하나 정한다. ②(같은 목표, b는 행동 안 함)와 ③(목표가 다름)은 둘 다 ∅로 간다. 모델에는 extension만 남으므로, ∅에서 거꾸로 가면 ②였는지 ③이었는지 알 수 없다. {(a,c)}는 공역에는 있지만 이 규칙이 내놓지 않는 extension이다.")

왜 그런지 가장 작은 예로 확인해보자. 직원은 a, b 두 명이고 가능한 세계는 $w_0$, $w_1$ 두 개다. 협력하는 쌍의 extension으로 두 가지를 놓는다.

$$
E_0 = \varnothing, \qquad E_1 = \{(a, b), (b, a)\}
$$

**첫 번째 반례: 한 세계만 보면 구분되지 않는다.** 두 개념적 관계 $\rho_A$, $\rho_B$를 다음처럼 두자.

| | $w_0$ | $w_1$ |
|---|---|---|
| $\rho_A$ | $E_0$ | $E_1$ |
| $\rho_B$ | $E_0$ | $E_0$ |

$\rho_A$는 $w_1$에서 a와 b가 협력한다고 판정하고, $\rho_B$는 어느 세계에서도 협력하지 않는다고 판정한다. 둘은 다른 판정 규칙이다. 그런데 세계 $w_0$ 하나만 보면 둘 다 $E_0$를 내놓는다. 즉, 한 세계의 extension만으로는 판정 규칙을 정할 수 없다.

**두 번째 반례: 가능한 extension을 전부 봐도 구분되지 않는다.** 이번에는 두 개념적 관계를 다음과 같이 정의한다.

| | $w_0$ | $w_1$ |
|---|---|---|
| $\rho_A$ | $E_0$ | $E_1$ |
| $\rho_B$ | $E_1$ | $E_0$ |

$\rho_A \neq \rho_B$다. 어느 세계에서 협력이 성립하는지가 정반대다. 하지만 두 관계가 내놓을 수 있는 extension의 모음은 똑같다.

$$
\{\rho_A(w) \mid w \in W\} = \{\rho_B(w) \mid w \in W\} = \{E_0, E_1\}
$$

언어에 $\text{cooperates-with}$ 하나만 있고 세계를 구분할 다른 기호가 없다면 두 commitment가 허락하는 모델은 똑같다. 하나는 협력 쌍이 없는 모델이고 다른 하나는 a와 b가 협력하는 모델이다. intended model의 집합이 같으니 그 집합을 아무리 들여다봐도 $\rho_A$와 $\rho_B$ 중 무엇이 원래의 개념화였는지 알 수 없다.

무엇이 사라졌는지 식으로 쓰면 이렇다. 개념적 관계에서 모델로 가는 길은 다음 변환을 거친다.

$$
F: \rho \mapsto \{\rho(w) \mid w \in W\}
$$

$F$는 "어느 세계에서 어떤 extension이 나오는가"라는 대응을 지우고 extension의 set만 남긴다. 그래서 서로 다른 $\rho$가 같은 결과로 보내진다. 즉, $F$는 단사가 아니며 결과에서 원래의 $\rho$로 돌아가는 역함수는 일반적으로 없다. 이러한 손실은 공리가 아무리 완벽해도 필연적으로 발생할 수밖에 없다.

협력의 두 개념화가 구분되지 않는 이유도 같다. "목표만 같으면 된다"는 개념화와 "행동까지 해야 한다"는 개념화는 세계마다 다른 쌍을 고른다. 하지만 모델에는 세계가 적혀 있지 않고 협력 쌍의 목록만 남는다. 

이를 하나의 모델이 여러 세계 상태를 하나로 뭉갠다(collapse)고 표현한다.

# 다시 어떻게 원래 의미를 되찾을까?

world state가 collapse되면서 발생하는 손실은 공리만 고침으로써 해결되지 않는다. 모델이 세계를 뭉개는 이유는 어휘가 너무 빈약해서 세계 사이의 차이를 말할 수 없기 때문이다. 그렇다면 차이를 말할 수 있게 어휘와 도메인을 늘리면 된다.

협력의 경우라면 도메인 $D$에 사람뿐 아니라 목표 $g$도 넣고, 어휘에 두 술어를 더한다.

- $\text{has-goal}(x, g)$: $x$가 목표 $g$를 가지고 있다고 선언한다.
- $\text{acts-for}(x, g)$: $x$가 목표 $g$를 위해 행동한다.

이제 두 개념화를 각각 공리로 적을 수 있다.

$$
\text{cooperates-with}(x, y) \leftrightarrow \exists g\,[\text{has-goal}(x, g) \land \text{has-goal}(y, g)]
$$

$$
\text{cooperates-with}(x, y) \leftrightarrow \exists g\,[\text{has-goal}(x, g) \land \text{has-goal}(y, g) \land \text{acts-for}(x, g) \land \text{acts-for}(y, g)]
$$

같은 목표를 가졌지만 b가 행동하지 않는 세계를 떠올려 보자. 첫 번째 공리를 따르는 모델에서는 a와 b가 협력하고, 두 번째 공리를 따르는 모델에서는 협력하지 않는다. 어휘가 늘어난 덕분에 두 개념화가 서로 다른 모델을 허락하게 됐다. 이 두 공리는 1편에서 정한 협력의 판정 규칙을 $L$로 옮겨 적은 것이다.

ontology가 개념화를 얼마나 잘 명세하는지는 다음 세 가지에 달려 있다.

1. 도메인이 얼마나 풍부한가
2. 어휘가 얼마나 풍부한가
3. 공리를 어떻게 쓰는가

3편에서 다룬 공리는 그중 하나일 뿐이다.

다만 이것이 완전한 복원을 보장하지는 않는다. 어휘를 늘리면 늘린 만큼의 차이는 말할 수 있게 된다. 하지만 관측 변수 가운데 어휘에 올리지 않은 것이 있는 한 그 변수로만 구분되는 세계들은 여전히 뭉개진다. 1편에서 world state를 관측 변수 **전부**의 값으로 정의했던 것을 떠올리면 어휘가 모든 관측 변수를 따라잡기는 어렵다. 그래서 되찾기는 언제나 "어디까지"의 문제다.

# 또 하나의 간극: intended는 '현실에서 참'이 아니다

지금까지의 손실은 개념화와 ontology 사이의 일이었다. 그런데 간극이 하나 더 있다. 개념화와 현실 사이다.

> [!interpretation] 내 해석: intended model은 현실을 보장하지 않는다
>
> intended model은 **어떤** 가능 세계 하나를 묘사하는 모델이다(3편). **지금 실제로 일어난** 세계를 묘사한다는 뜻은 아니다. 1편의 회사 예시를 살펴보자. 실제 세계에서는 a가 b에게 보고하고 있다. 그런데 아무도 누구에게 보고하지 않는 세계도 $W$에 들어 있다면 $I(\text{reports-to}) = \varnothing$인 모델도 intended model이다. 그 모델은 commitment에 맞지만 지금의 회사를 틀리게 묘사한다.
>
> 더 근본적으로는 개념화 자체가 현실을 잘못 나눴을 수도 있다. 판정 규칙이 실제 협력과 어긋난다면 $\text{Mod}(O) = I_K(L)$이 완벽하게 성립해도 ontology는 현실과 맞지 않는다. 다음 두 가지는 서로 다른 평가다.
>
> - **논리적으로 충실한가**: ontology가 개념화를 잘 근사하는가 ($\text{Mod}(O)$ 대 $I_K(L)$)
> - **현실에 맞는가**: 개념화가 실제 세계를 제대로 나누는가
>
> 즉, $\text{Mod}(O) = I_K(L)$이어도 개념화가 현실에 맞는다는 보장은 없다.
>
> 5편에서 볼 Neuhaus (2018)는 이 두 평가를 각각 정의해서 나눠 본다.

# 실무에서는 어떻게 점검하나

실무에서는 위의 두 평가에 대표적으로 아래 두 가지 방법을 쓴다.

- **Competency questions** (Grüninger & Fox (1995))
  ontology를 만들기 전에 "이 ontology가 답할 수 있어야 하는 질문"을 먼저 적는다. (eg."a는 누구와 협력하는가?", "같은 목표를 가졌지만 행동하지 않는 사람은 누구인가?") 완성된 ontology가 이 질문들에 답하지 못하면 어휘나 공리가 부족하다는 뜻이다. 앞에서 협력의 두 개념화를 구분하려면 어휘가 더 필요했던 것처럼, 질문이 어휘의 빈 곳을 드러낸다.

- **OntoClean** (Guarino & Welty (2004))
  분류 계층(taxonomy)이 잘못 만들어지지 않았는지 개념의 메타 속성으로 점검하는 방법이다. 예를 들어 Person이라는 속성은 그 인스턴스에게 가능한 모든 상황에서 반드시 해당한다(rigid). 반면 Researcher는 모든 인스턴스가 그 속성을 잃을 수 있다(anti-rigid). 사람은 연구자였다가 그만둘 수 있다. OntoClean은 이런 성질을 기준으로 "anti-rigid한 개념 아래에 rigid한 개념을 두면 안 된다" 같은 규칙을 세워 계층을 검사한다. Researcher 아래에 Person을 두면, 연구를 그만둔 사람은 Person에서도 빠져야 하는 모순이 생기기 때문이다.

둘 다 손실을 없애지는 않고 손실이 어디서 생겼는지 찾는 데 쓰인다. competency question이 잘못 적혔거나 메타 속성을 잘못 붙였다면 점검도 함께 틀린다.

# 다음 편으로

이 글은 Guarino et al. (2009)의 렌즈로 손실이 어디서 생기는지 봤다. 5편에서는 다른 렌즈를 쓴다. Neuhaus (2018)는 이 시리즈가 따라온 정의 자체를 비판하고 ontology를 다시 정의한다. Studer의 정의에 있던 세 번째 질문, "왜 'shared'가 중요한가?"도 거기서 다룬다.

# 참고자료

- [Guarino, N., Oberle, D., & Staab, S. (2009). What Is an Ontology? In S. Staab & R. Studer (Eds.), *Handbook on Ontologies* (2nd ed., pp. 1–17). Springer.](https://doi.org/10.1007/978-3-540-92673-3_0)
- Guarino, N. (1998). Formal Ontology in Information Systems. In N. Guarino (Ed.), *Formal Ontology in Information Systems: Proceedings of FOIS'98* (pp. 3–15). IOS Press.
- [Neuhaus, F. (2018). What is an Ontology? arXiv:1810.09171.](https://arxiv.org/abs/1810.09171)
- [Grüninger, M., & Fox, M. S. (1995). The Role of Competency Questions in Enterprise Engineering. In A. Rolstadås (Ed.), *Benchmarking — Theory and Practice* (pp. 22–31). Springer.](https://doi.org/10.1007/978-0-387-34847-6_3)
- [Noy, N. F., & McGuinness, D. L. (2001). Ontology Development 101: A Guide to Creating Your First Ontology. Stanford Knowledge Systems Laboratory, KSL-01-05.](https://protege.stanford.edu/publications/ontology_development/ontology101-noy-mcguinness.html)
- [Guarino, N., & Welty, C. A. (2004). An Overview of OntoClean. In S. Staab & R. Studer (Eds.), *Handbook on Ontologies* (pp. 151–171). Springer.](https://doi.org/10.1007/978-3-540-24750-0_8)
