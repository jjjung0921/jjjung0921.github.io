---
title: "안정점은 최적점과 얼마나 먼가: Performative Stability와 Optimality"
lang: "ko"
translationKey: "pp-stable-vs-optimal"
date: "2026-09-26"
field: "ai"
category: "Performative Prediction"
series: "Performative Prediction"
order: 2
projects: ["staged-dda"]
status: "draft"
summary: "재학습(RRM)이 데려다주는 곳은 안정점(PS)이고 우리가 원하던 곳은 최적점(PO)이다. 동전 예제로 두 해가 실제로 어긋나는 것을 보고, 안정점의 존재(Prop 4.1), 최적점을 직접 노리기 어려운 이유(Prop 4.2), 두 해 사이 거리의 상한(Thm 4.3)을 차례로 정리한다. 끝으로 전략적 분류에서 Stackelberg 균형이 곧 PO라는 결과(§5.1)를 통해 bi-level optimization과 만나는 자리를 표시한다."
problem: "재학습이 수렴한 안정점은 원하던 최적점과 얼마나 다른가? 최적점을 직접 찾을 수는 없는가?"
coreIdea: "손실이 데이터에 대해 L_z-Lipschitz이고 γ-강볼록이며 분포 사상이 ε-sensitive이면, 모든 안정점과 최적점은 2L_zε/γ 안에 있다. 반면 PR 자체는 RRM의 수렴 조건 아래에서도 오목할 수 있어 최적점을 직접 노리는 일은 더 어렵다."
connection: "PO는 전략적 분류의 Stackelberg 균형과 같다. Stackelberg는 리더가 먼저 두고 팔로워가 반응하는 두 층 구조이므로, 이 결과가 Research Roadmap Stage 3의 bi-level 공통 형태와 Track A(Personalization as Optimization)로 이어진다."
tags: ["optimization", "performative prediction", "stackelberg", "fixed-point", "distribution-shift"]
---

> 재학습이 데려다준 안정점은 우리가 원하던 최적점과 얼마나 다른가?

# 0. 앞선 글이 남긴 자리

[앞선 글](/notes/performative-prediction/)에서 우리는 한 가지 질문에 답했다. 손실이 $\gamma$-강볼록, $\beta$-jointly smooth이고 분포 사상이 $\varepsilon$-sensitive일 때, $\varepsilon<\gamma/\beta$이면 재학습(RRM)은 유일한 안정점 $\theta_{\text{PS}}$로 선형 수렴한다.

그러나 우리가 원하던 것은 $\theta_{\text{PS}}$가 아니라 $\theta_{\text{PO}}$였다. 앞선 글의 끝에서 이 간극을 세 갈래의 질문으로 남겼다. 원 논문 4장이 그 셋에 차례로 답한다.

| 앞선 글이 남긴 질문 | 원 논문 | 이 글 |
| --- | --- | --- |
| 약한 가정에서도 안정점이 존재하는가 | Proposition 4.1 | 2절 |
| 최적점을 직접 겨냥하는 것은 왜 어려운가 | Proposition 4.2 | 3절 |
| 두 해 사이의 거리에 상한을 줄 수 있는가 | Theorem 4.3 | 4절 |

그 전에 두 해가 실제로 어긋나는 모습을 작은 예제로 먼저 보자(1절).

4절까지 오면 원 논문 5장이 이 결과를 전략적 분류에 옮긴 부분이 보인다. 여기서 PO가 Stackelberg 균형과 같다는 사실이 나오고, 이것이 bi-level optimization으로 가는 다리가 된다(5절). 마지막으로 앞선 글의 '남은 문제 1'이던 유한 표본을 짧게 닫는다(6절).

# 1. 두 해는 실제로 어긋난다: 동전 예제

원 논문의 Example 2.2는 편향된 동전을 예측하는 문제다.

- 특성 $X\in\{\pm1\}$, 결과 $Y\mid X\sim\text{Bernoulli}\left(\tfrac12+\mu X+\varepsilon\theta X\right)$, $\mu\in(0,\tfrac12)$, $\varepsilon<\tfrac12-\mu$
- 모델 $f_\theta(x)=\theta x+\tfrac12$, 손실 $\ell(z;\theta)=(y-f_\theta(x))^2$

$\varepsilon\theta X$ 항이 performative한 부분이다. 모델이 $X=1$에 높은 점수를 줄수록 실제로 $Y=1$이 나올 확률이 올라간다. $\varepsilon=0$이면 평범한 지도학습이고 답은 $\theta_{\text{SL}}=\mu$이다.

원 논문은 두 해를 "직접 계산하면" 얻는다고만 적는다. 계산을 복기해보자. $Y\in\{0,1\}$이므로 $(Y-\tfrac12)^2=\tfrac14$이고 $X^2=1$이다. $\mathcal{D}(\theta')$ 아래에서 $\mathbb{E}[X(Y-\tfrac12)]=\mu+\varepsilon\theta'$이므로

$$
\text{DPR}(\theta',\theta)=\mathbb{E}_{Z\sim\mathcal{D}(\theta')}\left(Y-\theta X-\tfrac12\right)^2=\tfrac14-2\theta(\mu+\varepsilon\theta')+\theta^2
$$

이 된다.

**안정점.** $\theta'$를 고정하고 $\theta$에 대해 최소화하면 $\theta=\mu+\varepsilon\theta'$이다. 환경을 만든 모델과 채점받는 모델이 같아야 하므로 $\theta=\theta'$로 두면

$$
\theta_{\text{PS}}=\mu+\varepsilon\theta_{\text{PS}}\quad\Longrightarrow\quad\theta_{\text{PS}}=\frac{\mu}{1-\varepsilon}
$$

**최적점.** 이번에는 두 자리에 같은 $\theta$를 넣은 뒤 최소화한다.

$$
\text{PR}(\theta)=\text{DPR}(\theta,\theta)=\tfrac14-2\theta\mu+(1-2\varepsilon)\theta^2
\quad\Longrightarrow\quad
\theta_{\text{PO}}=\frac{\mu}{1-2\varepsilon}
$$

두 계산의 차이는 한 곳이다. 안정점은 $\varepsilon\theta'$를 **이미 주어진 데이터**로 보고 최소화한다. 최적점은 $\theta$를 바꾸면 그 항도 따라 움직인다는 것까지 계산에 넣는다. 그래서 PR에만 $-2\varepsilon\theta^2$ 항이 생긴다.

$\mu=0.2$로 두고 $\varepsilon$을 키워 보자. 두 해가 벌어지는 모습이 아래 표와 같다.

| $\varepsilon$ | $\theta_{\text{SL}}$ | $\theta_{\text{PS}}=\mu/(1-\varepsilon)$ | $\theta_{\text{PO}}=\mu/(1-2\varepsilon)$ | 간격 |
| --- | --- | --- | --- | --- |
| 0 | 0.200 | 0.200 | 0.200 | 0 |
| 0.1 | 0.200 | 0.222 | 0.250 | 0.028 |
| 0.2 | 0.200 | 0.250 | 0.333 | 0.083 |
| 0.29 | 0.200 | 0.282 | 0.476 | 0.194 |

두 해의 간격을 식으로 표현하면 아래와 같다.

$$
\theta_{\text{PO}}-\theta_{\text{PS}}=\frac{\mu\varepsilon}{(1-\varepsilon)(1-2\varepsilon)}
$$

$\varepsilon=0$일 때만 두 해가 같다. $\varepsilon$이 작을 때 간격은 대략 $\varepsilon$에 비례하며, 4절의 상한도 $\varepsilon$에 비례하는 꼴이다.

$\theta_{\text{PO}}$가 $\theta_{\text{PS}}$보다 크다는 점에 주목하자. **최적점은 자기 예측이 결과를 끌어당긴다는 것을 알고 더 과감하게 예측한다.**

앞선 글 0장의 GMS가 물었던 '공표된 예측이 스스로 실현되는가'가 여기서는 최적점이 적극적으로 이용하는 효과로 나타난다.

> [!warning] 원 논문은 두 해를 계산만 제시한다
> 위 DPR 전개는 원 논문 본문에 없다. 원 논문은 "a direct calculation demonstrates"라고만 적고, PR의 이차식 $\tfrac14-2\theta\mu+(1-2\varepsilon)\theta^2$은 부록 D.6(Prop 4.2의 증명)에만 나온다. 전개는 이 식과 일치하도록 우리가 복원한 것이다.

# 2. 안정점은 언제나 존재하는가

앞선 글에서 안정점의 존재는 수렴 정리의 부산물이었다. 재학습 연산자 $G$가 축약 사상이면 Banach 고정점 정리가 존재, 유일성, 그리고 찾아가는 방법(반복)까지 한 번에 준다. 대신 강볼록, smooth, $\varepsilon<\gamma/\beta$라는 강한 조건이 필요했다.

그렇다면 조건을 풀면 안정점은 사라지는가? 원 논문의 답은 '해 공간이 유계 닫힌 집합이면 아니다'이다.

> [!info] Proposition 4.1
> 분포 사상 $\mathcal{D}(\cdot)$가 $\varepsilon$-sensitive이고 $\Theta\subset\mathbb{R}^d$가 compact라 하자. 손실 $\ell(z;\theta)$가 볼록이고 $(z,\theta)$에 대해 jointly continuous이면 performatively stable point가 존재한다.

강볼록 대신 볼록이면 되고, smooth는 필요 없으며 $\varepsilon$의 크기에도 제한이 없다. 증명은 고정점 정리를 바꿔 끼우는 방식이다. 아래 4단계로 따라가 보자.

1. 집합값 사상 $g(\theta)=\argmin_{\theta'\in\Theta}\text{DPR}(\theta,\theta')$를 둔다. 이 사상의 고정점($\theta\in g(\theta)$)이 곧 안정점이다.
2. 손실이 jointly continuous이고 $\Theta$가 compact이므로 Berge의 최대 정리에 의해 $g$는 upper hemicontinuous이고 값이 공집합이 아닌 compact 집합이다.
3. 손실이 볼록이므로 $g(\theta)$는 볼록 집합이다.
4. Kakutani 고정점 정리의 조건이 모두 성립하므로 $g$에는 고정점이 있다.

강볼록이 빠지면 최소화 해가 한 점이 아니라 집합이 될 수 있다. 그래서 함수 대신 집합값 사상을 쓰고, Brouwer 정리를 집합값 사상으로 넓힌 Kakutani 정리를 쓴다.

앞선 글 0장에서 GMS가 Brouwer로 해의 존재를 보였던 것과 같은 계보다.

앞선 글의 수렴 정리와 한 눈에 비교하면 아래와 같다.

| | 앞선 글 (Thm 3.5) | Prop 4.1 |
| --- | --- | --- |
| 손실 | $\gamma$-강볼록, $\beta$-smooth | 볼록, 연속 |
| 분포 사상 | $\varepsilon<\gamma/\beta$ | $\varepsilon$-sensitive (크기 무관) |
| 해 공간 | 제한 없음 | compact |
| 고정점 정리 | Banach (축약 사상) | Kakutani (집합값) |
| 얻는 것 | 존재 · 유일성 · RRM 수렴 | 존재만 |

즉, **약한 가정에서도 안정점은 있다.** 다만 여럿일 수 있고, 찾아가는 방법은 주지 않는다.

> [!tip] 확인 필요
> 증명에서 $\varepsilon$-sensitivity가 어디에 쓰이는지는 원 논문이 적지 않는다. $\theta\mapsto\mathcal{D}(\theta)$의 연속성을 주어 Berge 정리를 쓸 수 있게 하는 것으로 보이나 원문에 명시된 문장은 없다.

# 3. 최적점을 직접 노리면 왜 어려운가

안정점을 RRM으로 찾을 수 있다면, 최적점을 찾는 RRM 같은 절차도 있을까? 원 논문의 답은 비관적이다. **최적점을 직접 찾는 일은 일반적으로 안정점을 찾는 일보다 어렵다.**

> [!info] Proposition 4.2
> 손실 $\ell(z;\theta)$가 $\beta$-jointly smooth이고 $\gamma$-강볼록이며 분포 사상이 $\varepsilon<\gamma/\beta$인 $\varepsilon$-sensitive여도, performative risk $\text{PR}(\theta)$는 $\theta$에 대해 오목일 수 있다.

반례는 1절의 동전 예제를 조금 바꾼 것이다. $\Theta=[0,1]$로 두고 $\varepsilon\ge\tfrac12$, $|\mu+\varepsilon|\le\tfrac12$로 제한한다.

제곱 손실의 조건수는 $\beta/\gamma=1$이므로 $\varepsilon<1$이면 RRM의 수렴 조건 $\varepsilon<\gamma/\beta$가 성립한다. 그런데 PR은 1절과 같은 이차식

$$
\text{PR}(\theta)=\tfrac14-2\theta\mu+(1-2\varepsilon)\theta^2
$$

이고, $\varepsilon\in[\tfrac12,1)$이면 이차항의 계수가 0 이하가 되어 오목이다.

이것이 가능한 이유는 **$\theta$가 PR 안에서 두 번 등장하기 때문**이다. $\text{DPR}(\theta',\theta)$는 두 번째 자리 $\theta$에 대해 강볼록이다. RRM이 매 단계 푸는 문제는 바로 이것이라 쉽다.

반면 PR은 첫 번째 자리(분포)와 두 번째 자리(모델)를 함께 움직인다. 분포 쪽으로 들어가는 $\theta$가 볼록성을 깨뜨릴 수 있다. 1절에서 본 $-2\varepsilon\theta^2$ 항이 바로 그 경로다.

> [!warning] RRM의 수렴 조건은 PR의 볼록성을 보장하지 않는다
> $\varepsilon<\gamma/\beta$는 '재학습이 한 점에 모인다'는 조건이지 'PR이 풀기 쉬운 모양이다'라는 조건이 아니다. 같은 조건 아래에서 RRM은 안정점으로 선형 수렴하지만 PR은 오목할 수 있다.

> [!tip] 확인 필요
> 이 반례에서 $\varepsilon\ge\tfrac12$와 $|\mu+\varepsilon|\le\tfrac12$를 함께 만족하려면 $\mu\le0$이어야 한다. 1절($\mu>0$)과 부호가 다르다. 원 논문은 이 점을 언급하지 않는다(우리의 관찰).

최적점을 직접 노리려면 $\theta$가 분포를 거쳐 손실을 바꾸는 경로, 즉 분포 사상의 미분을 다뤄야 한다. 그 방법은 원 논문의 범위 밖이다(7절).

# 4. 두 해 사이의 거리에 상한을 줄 수 있는가

최적점을 직접 찾기 어렵다면 차선은 이것이다. 안정점이 최적점 근처에 있다고 보장할 수 있다면 쉬운 쪽(RRM)을 풀어도 된다.

> [!info] Theorem 4.3
> 손실 $\ell(z;\theta)$가 $z$에 대해 $L_z$-Lipschitz이고 $\gamma$-강볼록이며 분포 사상이 $\varepsilon$-sensitive라 하자. 그러면 모든 performatively stable point $\theta_{\text{PS}}$와 모든 performative optimum $\theta_{\text{PO}}$에 대해
> $$\|\theta_{\text{PO}}-\theta_{\text{PS}}\|_2\le\frac{2L_z\varepsilon}{\gamma}$$

smooth 가정이 없고 $\varepsilon$의 크기에도 제한이 없다. 두 해가 유일하지 않아도 모든 쌍에 대해 성립한다.

증명은 아래 3가지 부등식을 잇는다. $\Delta=\theta_{\text{PO}}-\theta_{\text{PS}}$로 두자.

**① 정의로 끼우기.** $\theta_{\text{PO}}$는 PR의 최소점이고, $\theta_{\text{PS}}$는 $\text{DPR}(\theta_{\text{PS}},\cdot)$의 최소점이므로

$$
\text{DPR}(\theta_{\text{PO}},\theta_{\text{PO}})\le\text{DPR}(\theta_{\text{PS}},\theta_{\text{PS}})\le\text{DPR}(\theta_{\text{PS}},\theta_{\text{PO}})
$$

**② 강볼록성이 밀어내는 힘.** $\mathcal{D}(\theta_{\text{PS}})$라는 고정된 세계 안에서 $\theta_{\text{PS}}$는 최소점이다. 강볼록성과 1차 최적성 조건을 쓰면 최소점에서 $\Delta$만큼 떨어진 곳의 손실은 적어도 $\tfrac{\gamma}{2}\|\Delta\|^2$만큼 높다.

$$
\text{DPR}(\theta_{\text{PS}},\theta_{\text{PO}})-\text{DPR}(\theta_{\text{PS}},\theta_{\text{PS}})\ge\frac{\gamma}{2}\|\Delta\|_2^2
$$

**③ 분포가 흔들리는 폭.** 같은 모델 $\theta_{\text{PO}}$를 두 세계 $\mathcal{D}(\theta_{\text{PS}})$와 $\mathcal{D}(\theta_{\text{PO}})$에서 채점하면 손실 차이는 얼마나 날까?

손실이 $z$에 대해 $L_z$-Lipschitz이면 Kantorovich–Rubinstein 쌍대성에 의해 기댓값 차이는 $L_z\cdot W_1$을 넘지 못한다. 앞선 글 3.1에서 도입한 $\varepsilon$-sensitivity가 $W_1\le\varepsilon\|\Delta\|$를 준다.

$$
\text{DPR}(\theta_{\text{PS}},\theta_{\text{PO}})-\text{DPR}(\theta_{\text{PO}},\theta_{\text{PO}})\le L_z\varepsilon\|\Delta\|_2
$$

**잇기.** ①에서 $\text{DPR}(\theta_{\text{PS}},\theta_{\text{PS}})\ge\text{DPR}(\theta_{\text{PO}},\theta_{\text{PO}})$이므로 ②의 좌변은 ③의 좌변보다 크지 않다. 이를 이어 쓰면 아래와 같다.

$$
\frac{\gamma}{2}\|\Delta\|_2^2\le\text{DPR}(\theta_{\text{PS}},\theta_{\text{PO}})-\text{DPR}(\theta_{\text{PS}},\theta_{\text{PS}})\le\text{DPR}(\theta_{\text{PS}},\theta_{\text{PO}})-\text{DPR}(\theta_{\text{PO}},\theta_{\text{PO}})\le L_z\varepsilon\|\Delta\|_2
$$

양변을 $\|\Delta\|$로 나누면 $\|\Delta\|\le 2L_z\varepsilon/\gamma$이다. 원 논문은 같은 내용을 귀류법으로 쓴다.

앞선 글은 수렴 조건을 '분포가 도망가는 속도 $\varepsilon\beta$'와 '최적화가 당기는 속도 $\gamma$'의 비교로 읽었다. 이번 상한도 같은 두 힘으로 읽을 수 있다.

분포가 흔들어 생기는 손실 차이는 $L_z\varepsilon$에 비례하고, 곡률 $\gamma$가 클수록 그 흔들림이 해를 멀리 밀지 못한다. 즉, **세계가 모델에 덜 반응할수록($\varepsilon\to0$) 두 해는 붙고**, $\varepsilon=0$이면 1절처럼 정확히 같다.

원 논문은 이 정리 뒤에 아래 2가지를 덧붙인다.

- RRM이 안정점으로 수렴하는 경우, 그 결과는 PR을 근사적으로 최소화한다.
- 손실이 강볼록이 아니고 볼록이기만 해도, 이차 정규화 항 $\tfrac{\alpha}{2}\|\theta-\theta_0\|^2$을 더해 RRM을 돌리면 $\text{PR}(\theta^{\text{reg}}_{\text{PS}})\le\min_\theta\text{PR}(\theta)+O\left(\tfrac{\sqrt\varepsilon}{1-\varepsilon}\right)$을 얻는다(부록 E, Proposition E.1). 정규화가 강볼록성을 빌려 주고, 그 대가가 PR의 작은 차이로 남는다.

세 질문의 답을 모으면 아래와 같다.

| 질문 | 답 | 조건 |
| --- | --- | --- |
| 안정점은 존재하는가 | 존재한다 (여럿일 수 있음) | compact $\Theta$, 볼록·연속 손실 |
| 최적점을 직접 찾을 수 있는가 | 일반적으로 어렵다 (PR이 오목일 수 있음) | RRM 수렴 조건과 무관 |
| 두 해는 얼마나 먼가 | $2L_z\varepsilon/\gamma$ 이내 | $L_z$-Lipschitz, $\gamma$-강볼록 |

# 5. Stackelberg 균형은 PO다: bi-level로 가는 다리

원 논문 5장은 이 틀을 **전략적 분류(strategic classification)** 에 옮긴다. 은행이 분류기로 대출 신청자의 신용을 판정하면, 신청자는 좋은 판정을 받으려고 자기 특성을 바꾼다.

신청자는 은행이 분류기를 배포한 **뒤에** 움직이므로 이 게임은 Stackelberg 구조다. 은행이 리더, 신청자가 팔로워다.

이때 분포 사상은 다음 절차로 만들어진다(원 논문 Figure 1).

```text
입력: 기준 분포 D, 분류기 f_θ, 비용 c, 효용 u
1. (x, y) ~ D 를 뽑는다
2. 최선 반응 x_BR ← argmax_{x'} u(x', θ) − c(x', x)
3. (x_BR, y) 를 내놓는다        → 이 표본들의 분포가 D(θ)
```

은행에게 최선의 전략은 신청자들이 반응한 뒤의 분포 $\mathcal{D}(\theta)$에서 손실이 가장 작은 분류기, 즉 Stackelberg 균형 $\theta_{\text{SE}}$를 배포하는 것이다. 그런데 이 정의는 PR의 최소점과 글자 그대로 같다. 식으로 표현하면 아래와 같다.

$$
f_{\theta_{\text{SE}}}\text{ 는 Stackelberg 균형}\iff\theta_{\text{SE}}\in\argmin_\theta\text{PR}(\theta)
$$

원 논문은 별도의 증명 없이 이 동치를 정의에서 바로 읽는다. 그렇다면 현장에서 흔히 쓰는 '반복 재학습'은 RRM이고, 4절의 결과가 그대로 적용된다.

> [!info] Corollary 5.1
> 은행의 손실이 $z$와 $\theta$에 대해 각각 $L_z$-, $L_\theta$-Lipschitz이고, $\beta$-jointly smooth, $\gamma$-강볼록이며, 유도된 분포 사상이 $\varepsilon<\gamma/\beta$인 $\varepsilon$-sensitive라 하자. 그러면 RRM은 안정 분류기 $\theta_{\text{PS}}$로 선형 수렴하고, 그 목적값은 Stackelberg 균형과 $2L_z\varepsilon(L_\theta+L_z\varepsilon)\gamma^{-1}$ 이내로 가깝다.

Thm 3.5가 수렴을, Thm 4.3이 파라미터 거리를 주고, $L_\theta$와 Kantorovich–Rubinstein 쌍대성이 그 거리를 목적값의 차이로 바꾼다. 원 논문은 이것을 반복 재학습이 전략적 효과를 극복하는 **첫 충분조건**이라고 부른다.

원 논문은 Kaggle "Give me some credit" 데이터(균형 부분집합 $n=18{,}357$, 특성 10개 중 전략적 특성 3개)로 이를 시뮬레이션한다. 신청자의 최선 반응은 $x'_S=x_S-\varepsilon\theta_S$이다.

$\varepsilon$이 작으면 RRM은 몇 번의 반복으로 수렴하고, 너무 크면 발산한다. 다만 이론 조건 $\varepsilon<\gamma/\beta$가 실제로 성립한 것은 $\varepsilon=0.01$뿐이었고, 그보다 큰 값에서도 수렴이 관측되었다(부록 B.2). 즉, 이 조건은 **충분조건이지 필요조건이 아니다.**

이제 이 구조를 두 줄로 써 보자.

$$
\begin{aligned}
\min_{\theta}\ &\ \mathbb{E}_{(x,y)\sim\mathcal{D}}\,\ell\big((x_{\text{BR}}(\theta),y);\theta\big)\\
\text{s.t.}\ &\ x_{\text{BR}}(\theta)\in\argmax_{x'}\ u(x',\theta)-c(x',x)
\end{aligned}
$$

상위 문제는 리더의 결정 $\theta$를 고르고, 하위 문제는 그 결정 아래에서 팔로워의 해를 낸다. 이것이 **bi-level optimization**의 모양이다.

[Research Roadmap Stage 3](/notes/roadmap-bilevel-common-form/)에서 "PO는 Stackelberg 균형이고, Stackelberg는 bi-level의 게임 표현"이라고 적었던 연결의 원문 근거가 이 절이다. 원 논문 자체는 'bi-level'이라는 말을 쓰지 않는다. 두 줄로 쓴 것은 우리의 정리다.

> [!warning] 하위 문제가 사람의 최선 반응일 필요는 없다
> 전략적 분류의 하위 문제는 신청자가 효용을 최대화한다고, 즉 합리적이라고 가정한다. PP의 분포 사상 $\mathcal{D}(\theta)$는 이 절차를 특수한 경우로 품을 뿐이고, 사람에게 요구하는 것은 $\varepsilon$-sensitivity 하나다. DDA로 옮길 때 하위 문제를 사람의 최적 반응으로 둘지, 플레이어 모델(추정기)의 학습 문제로 둘지는 이 차이에서 갈린다.

# 6. 남은 문제 1 다시: 관측이 표본뿐일 때

앞선 글의 '남은 문제 1'은 모집단 가정이었다. 우리가 보는 것은 $\mathcal{D}(\theta_t)$가 아니라 그 분포에서 뽑힌 $n_t$개의 표본뿐이다. 원 논문 3.4절은 기댓값을 경험 분포 $\mathcal{D}^{n_t}(\theta_t)$로 바꾼 **RERM**(repeated empirical risk minimization)과 **REGD**(repeated empirical gradient descent)를 분석한다.

> [!info] Theorem 3.10 (a)
> 손실이 $\beta$-jointly smooth, $\gamma$-강볼록이고 분포가 지수 모멘트 조건($\int e^{\mu|x|^\alpha}d\mathcal{D}(\theta)<\infty$, $\alpha>1$)을 만족한다고 하자. 시점 $t$에 $n_t=O\left(\frac{1}{(\varepsilon\delta)^m}\log\frac{t}{p}\right)$개의 표본을 쓰고 $\varepsilon<\frac{\gamma}{2\beta}$이면, 확률 $1-p$로 RERM은 충분히 큰 $t$부터 $\|\theta_t-\theta_{\text{PS}}\|_2\le\delta$를 만족한다.

수렴 조건이 $\gamma/\beta$에서 $\gamma/(2\beta)$로 절반이 된 이유는 간단하다. 표본 오차가 $W_1$ 항을 하나 더 만든다. 삼각부등식으로

$$
W_1\big(\mathcal{D}^{n_t}(\theta_t),\mathcal{D}(\theta_{\text{PS}})\big)\le\underbrace{W_1\big(\mathcal{D}^{n_t}(\theta_t),\mathcal{D}(\theta_t)\big)}_{\text{표본 오차}\ \le\ \varepsilon\delta}+\underbrace{W_1\big(\mathcal{D}(\theta_t),\mathcal{D}(\theta_{\text{PS}})\big)}_{\le\ \varepsilon\|\theta_t-\theta_{\text{PS}}\|}
$$

이고, $\theta_t$가 아직 $\delta$-공 밖에 있으면 우변은 $2\varepsilon\|\theta_t-\theta_{\text{PS}}\|$ 이하다.

$\varepsilon$ 자리에 $2\varepsilon$이 들어가니 Thm 3.5의 조건도 절반이 된다. 공 안에 들어온 뒤에는 축약이 보장되지 않지만 표본이 충분해 공 밖으로 나가지도 않는다.

표본 수가 $(\varepsilon\delta)^{-m}$에 비례한다는 점도 짚어 두자. $m$은 데이터 $z$의 차원이다. 반응 로그를 풍부하게 기록할수록 경험 분포가 실제 분포에 가까워지는 데 드는 표본 수는 차원에 대해 지수적으로 늘어난다.

# 7. 정리 — 무엇을 답했고 무엇이 남았는가

지금까지의 내용을 한 문장으로 정리하자.

> 재학습이 데려다준 안정점은 최적점에서 $2L_z\varepsilon/\gamma$ 이상 떨어지지 않는다. 그리고 그 최적점은 전략적 분류에서 Stackelberg 균형이다.

앞선 글이 "재학습은 어디로 가는가"에 답했다면, 이 글은 "그곳이 원하던 곳과 얼마나 먼가"에 답했다. 세계가 모델에 덜 반응할수록 두 곳은 가깝다. 그러나 여전히 두 가지가 남는다.

## 남은 문제 1: 최적점을 직접 겨냥하려면

3절에서 본 것처럼 PR은 $\theta$가 분포를 거쳐 들어오는 경로 때문에 볼록성을 잃을 수 있다. 최적점을 직접 노리려면 이 경로, 즉 $\nabla_\theta\,\mathbb{E}_{Z\sim\mathcal{D}(\theta)}\ell(Z;\theta)$를 추정해야 한다. Izzo et al.(2021)의 PerfGD가 이 방향이다(미독).

## 남은 문제 2: 분포 사상 자체의 구조

두 글 모두 분포 사상을 '$\varepsilon$-sensitive한 함수'로만 다뤘다. 그러나 그 사상이 어떤 모양인지(기준 분포를 옮기는 꼴인지, 최선 반응인지, 사람의 상태가 시간에 따라 바뀌는지)에 따라 추정도 미분도 달라진다. 상태가 바뀌는 경우는 Brown et al.(2022)의 stateful PP가 다룬다.

다음 글에서는 분포 사상 자체를 다룬다. 정의 $\mathcal{D}:\Theta\to\Delta(\mathcal{Z})$, 거리와 민감도, 사상의 종류, 그리고 분포를 거친 미분까지. 이 답까지 갖춰야 staged-dda에서 난이도 정책이 플레이어 반응을 어떻게 움직이는지 식으로 쓸 수 있다.

# 참고문헌

- Perdomo, Juan, Tijana Zrnic, Celestine Mendler-Dünner, and Moritz Hardt. "Performative prediction." International Conference on Machine Learning. PMLR, 2020. (대조 판본: arXiv 2002.06673v4)
- Hardt, Moritz, Nimrod Megiddo, Christos Papadimitriou, and Mary Wootters. "Strategic classification." ITCS, 2016. (원 논문의 인용으로만 확인, 미독)
- Izzo, Zachary, Lexing Ying, and James Zou. "How to learn when data reacts to your model: Performative gradient descent." ICML, 2021. (미독)
- Brown, Gavin, Shlomi Hod, and Iden Kalemaj. "Performative prediction in a stateful world." AISTATS, 2022.

# 연결

- 관련 프로젝트: [범용 staged-DDA](/projects/dda-blackjack/)
- 관련 실험: 없음
- 앞선 글: [Performative Prediction: 변화를 예측하다](/notes/performative-prediction/)
- 함께 볼 글: [[Stage 3] 두 문제는 같은 모양이다: bi-level optimization](/notes/roadmap-bilevel-common-form/)
- 다음에 확인할 질문: 최적점을 직접 겨냥하려면 분포 사상을 어떻게 미분하는가?
