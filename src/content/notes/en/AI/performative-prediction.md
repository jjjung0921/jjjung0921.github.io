---
# Recommended paths:
# - src/content/notes/ko/<field>/<slug>.md
# - src/content/notes/<field>/<slug>.md
# Folder names are authoring-only. The public URL uses the file name.
title: "Performative Prediction: predicting change itself"
lang: "en"
translationKey: "Performative-Prediction"
date: "2026-07-21"
# field: "web" | "game" | "programming-language" | "ai"
field: "ai"
category: "Performative Prediction"
series: "Performative Prediction"
# status: "draft" | "reading" | "implemented" | "stable"
status: "implemented"
summary: "Machine learning assumes the data distribution is fixed, but that premise collapses once a model's predictions produce decisions and those decisions change the data. Starting from the question the 1954 GMS theorem posed — can a published prediction fulfill itself? — this note lays out the Performative Prediction framework that recasts it in the language of distributions and loss functions, along with the conditions under which retraining (RRM) converges."
problem: "When a model's predictions change the data distribution, does retraining converge to a single point — and under what conditions?"
coreIdea: "Retraining is not a patch over distribution shift but a dynamic seeking an equilibrium. When the speed at which the distribution runs away (εβ) is smaller than the speed at which optimization pulls back (γ), retraining becomes a contraction mapping and converges linearly to a unique stable point."
connection: "Can an opponent model in DDA be designed to improve the user's skill? — difficulty adjustment is the archetypal performative situation, since it changes the distribution of player skill itself."
tags: ["optimization", "performative prediction", "fixed-point", "convergence", "distribution-shift"]
---

# Our decisions change the environment

## 0. The GMS theorem: can our predictions be accurate?

Conventional machine learning techniques were designed to operate in an environment where the **distribution ($D$) of the data ($Z$) is fixed** ($Z\sim D$).

In 1954, however, Grunberg, Modigliani, and Simon considered the case where the prediction itself has the power to change the environment. This is called a **public prediction**, and the question is whether society's actual response ($R(\hat{y})$) after our prediction ($\hat{y}$) is published can equal that prediction.

$$
\hat{y} = R(\hat{y})
$$

The existence of such a point was proved via the continuity of $R$ and Brouwer's fixed-point theorem.

But GMS proves only existence, and only for scalar values. The ML technique that extends this to distributions and to actually finding the solution is Performative Prediction (PP).

## 1. Performative Prediction: how can we find an accurate prediction?

### Formulating the GMS theorem

Let us state the GMS problem sketched above.

- The outcome space is $S \in [0,1]$, compact and convex.
- The response function is $R: S \rightarrow S$, and it is continuous.

Does $\exists\hat{y}^* \in S\::\:\hat{y}^*=R(\hat{y}^*)$ then hold?

Applying that problem directly to ML runs into the following constraints.

1. The prediction is a scalar aggregate.
   - In GMS, $\hat{y}$ is a single scalar. In ML we have to predict **a function $f_\theta$**, and that function's input is an $x$ that is a vector of many features or more.
2. The outcome is a value, not a distribution.
   - Similarly, GMS's $y = R(\hat{y})$ is just one scalar, not the joint distribution over $(x,y)$ pairs that ML requires. Solving this means rebuilding the notion of distance to work over distributions.
3. It shows only existence.
   - Because GMS proves existence only, **the notion of a "good prediction" is absent**. In particular, $\hat{y}=R(\hat{y})$ demands a perfect prediction, which is unrealizable in ML.
4. It assumes $R$ is known.
   - GMS treats the response function $R$ as a mathematically given function. In ML, $\mathcal{D}(\theta)$ is unknown; after deployment we can only observe finite data.

## 2. Extending GMS to PP

PP is the extension of GMS into ML that resolves these constraints. Let us see how each one is handled.

### 2.0 **Distribution map — the key conceptual device**

Choosing model parameters ($\theta \in \Theta \subseteq \mathbb{R}^d$) and deploying the model ($f_\theta$) results in a data distribution $\mathcal{D}(\theta)$.

The parameter set ($\Theta$) here is a closed convex set.

$$
R:[0,1]\rightarrow[0,1]\Rightarrow \mathcal{D}:\Theta\rightarrow
\Delta(\mathcal{X}\times\mathcal{Y})
$$

Here the input is $\mathcal{X}\subseteq{\R^d}$ and the output is $\mathcal{Y}\subseteq\R$. To measure the discrepancy between these distributions we introduce the Wasserstein-1 distance.

$$
\mathcal{W}(\mathcal{D}(\theta),\mathcal{D}(\theta '))\leq\epsilon\Vert\theta-\theta '\Vert_2
$$

To measure model performance on the resulting distribution $\mathcal{D(\theta)}\in\Delta(\mathcal{X}\times\mathcal{Y})$, we introduce a new objective, the $\text{Risk}$.

$$
\text{Risk}(\theta, \mathcal{D(\theta)}) = \mathbb{E}_{z\sim \mathcal{D}(\theta)}[\ell(z;\theta )]
$$

PP now asks two questions.

1. Is this model a fixed point of the distribution it created (stability)?
2. Is it the best among all possible model-environment pairs (optimality)?

We want to evaluate each of these questions against its own criterion.

### 2.1 Performative stability: the GMS fixed point

$$
\theta_{\text{PS}}\in\argmin_\theta \mathbb{E}_{Z\sim \mathcal{D}(\theta_{\text{PS}})}\ell(Z;\theta)
$$

$\theta_{\text{PS}}$ forms the distribution $(D(\theta_{\text{PS}}))$ of the data ($Z$) on the right-hand side. At the same time, it is the output parameter of the model obtained by predicting in the $Z\sim \mathcal{D}(\theta_{\text{PS}})$ environment.

In other words, minimizing risk again on the distribution $\theta_{PS}$ created yields the same model. The fixed point lives not in distribution space but in parameter space ($\Theta$), and in this sense it inherits the role of the GMS fixed point.

To handle PS we have to be able to **hold apart** 1) 'the model that created the environment' and 2) 'the model being graded' — only then can 'the two are the same' be used as a condition. That separating device is the **Decoupled Performative Risk (DPR)**.

$$
\text{DPR}(\theta,\theta ')\stackrel{\text{def}}{=}\mathbb{E}_{Z\sim \mathcal{D}(\theta)}\ell(Z;\theta')
$$

In this expression, **the model formed by $\theta'$** is graded **in the world generated by the model $\theta$**.

Interpreted at $\text{PS}$, this becomes $\theta_\text{PS}=\argmin_\theta\text{DPR}(\theta_{\text{PS}},\theta)$.

That is, the model generated by $\theta$ is evaluated in the environment $\theta_{\text{PS}}$ created; if the environment being evaluated in and the environment the model generates are identical, we call it **performatively stable**.

### 2.2 Performative optimality: Stackelberg equilibria

$$
\begin{aligned}
\text{PR}(\theta)\stackrel{\text{def}}{=}\mathbb{E}_{Z\sim\mathcal{D}(\theta)}\ell(Z;\theta)\\
\theta_{PO}=\argmin_\theta\text{PR}(\theta)
\end{aligned}
$$

Separate from stability, there is a second solution concept asking for 'the best among what is possible'. This one is not a fixed-point condition but a global minimization problem, and it corresponds to a Stackelberg equilibrium in game theory.

**Performative risk** measures a model's performance on the data distribution ($\mathcal{D}(\theta)$) that arises after deploying the model defined by $\theta$. The form of the model, like the environment, is also a function of $\theta$.

PR differs from the *DPR* above in that it measures performance **in the data environment the model itself brought about**.

We saw earlier that $\theta$ constitutes a model-environment pair. Among the (model, environment induced by that model) pairs that $\theta$ generates, the one with the lowest loss is what we call **performative optimality**.

> [!warning] The two solution concepts generally **do not coincide.** $\theta_{\text{PO}}$ is the best, but retraining after deployment moves it elsewhere (unstable), while $\theta_{\text{PS}}$ is stable but not the best. Measuring that gap is the subject of the next post; this one focuses on the **reachable** side, $\theta_{\text{PS}}$.

### A visual comparison of PR and DPR

![PR vs DPR|500](image.png "Figure 1. PR measures performance in the environment the model created; DPR measures it in a separated environment.")

## 3. How to find stable points?

We can now state the Performative Prediction problem. But how do we find a solution? Answering that requires first judging **convergence**.

### 3.0 Repeated risk minimization

Let us recall how Performative Prediction operates. Our optimization target is $\theta$.

1. Optimization response: minimize risk on the fixed distribution $\mathcal{D}(\theta_t)$ to obtain $\theta_{t+1}$.
2. Performative response: deploying the new model $\theta_{t+1}$ shifts the next data distribution to $\mathcal{D}(\theta_{t+1})$.

The sequence "deploy the model → collect new data → retrain on that data → redeploy" is called **repeated risk minimization (RRM)**, written as

$$
\theta_{t+1}=G(\theta_t)\stackrel{\text{def}}{=}\argmin_{\phi\in\Theta}\mathbb{E}_{Z\sim\mathcal{D}(\theta_t)}\ell(Z;\phi)
$$

For convergence, the stabilizing effect provided by risk minimization on a fixed distribution has to be stronger than the disturbance from the distribution shift that deployment causes.

### 3.1 $\varepsilon$-sensitivity

To measure how much the distribution changes we introduce the Wasserstein-1 distance ($W_1$). Comparing it against the change in $\theta$ under $L_2$ gives the sensitivity of the distribution change, which is $\varepsilon$-sensitivity.

$$
W_1(\mathcal{D}(\theta),\mathcal{D}(\theta'))\leq\varepsilon\Vert\theta-\theta'\Vert_2
$$

> [!info] The Wasserstein distance is a way of measuring distance between probability distributions.

### 3.2 $\gamma$-strong convexity

> [!tip] Convexity is closely tied to optimization, so I intend to write it up separately.

RRM is a **fixed-point iteration**, and strong convexity is the quantitative measure guaranteeing **contraction**.

$$
\ell(z;\theta)
\ge
\ell(z;\theta')
+
\nabla_{\theta}\ell(z;\theta')^{\top}(\theta-\theta')
+
\frac{\gamma}{2}\|\theta-\theta'\|_2^2,
\qquad
\forall \theta,\theta'\in\Theta,\; z\in\mathcal Z.
$$

### 3.3 $\beta$-joint smoothness

$$
[
\left\|
\nabla_{\theta}\ell(z;\theta)
-
\nabla_{\theta}\ell(z;\theta')
\right\|_2
\le
\beta
\left\|
\theta-\theta'
\right\|_2,
\qquad
\forall \theta,\theta'\in\Theta,\; z\in\mathcal Z,
]

[
\left\|
\nabla_{\theta}\ell(z;\theta)
-
\nabla_{\theta}\ell(z';\theta)
\right\|_2
\le
\beta
\left\|
z-z'
\right\|_2,
\qquad
\forall \theta\in\Theta,\; z,z'\in\mathcal Z.
]
$$

This asks for $\beta$-Lipschitzness of $\nabla_\theta\ell(z;\theta)$ in both $\theta$ and $z$. It concerns the sensitivity of the training gradient to the parameters. If that sensitivity is too large (e.g. $\beta=\infty$), the gradient bounces around arbitrarily and training fails.

> [!tip] Lipschitzness relates to the concept of a **contraction map**, so I will cover it separately alongside contraction mappings.

### 3.4 Convergence of RRM

We now have all the groundwork for the convergence proof. Assume the loss function is $\beta$-jointly smooth and $\gamma$-strongly convex.

$$
\begin{align}
\;\Vert G(\theta)-G(\theta')\Vert_2\leq\varepsilon\frac{\beta}{\gamma}\Vert\theta-\theta'\Vert_2,\;for\;all \;\theta,\theta'\in\Theta
\end{align}
$$

From here on I will write $\varepsilon\frac{\beta}{\gamma}$ as $q$. In that case, equation (1) bounds how far apart the resulting models $G(\theta),G(\theta')$ can drift after deploying two models $\theta, \theta'$.

```text
current model gap
‖θ - θ′‖
     ↓ retraining operator G
next model gap
‖G(θ) - G(θ′)‖
     ≤ (εβ/γ) ‖θ - θ′‖
```

The roles of the constants above ($\varepsilon,\beta,\gamma$) can be summarized as follows.

| Constant     | Meaning                                                | Effect on ($q=\epsilon\beta/\gamma$) |
| ------------ | ------------------------------------------------------ | ------------------------------------ |
| ($\epsilon$) | how much a change in the model changes the distribution | larger is less stable                |
| ($\beta$)    | how much a change in data or model reaches the gradient | larger is less stable                |
| ($\gamma$)   | the curvature pulling the objective back to a minimizer | larger is more stable                |

$$
\begin{align}
\epsilon < \frac{\gamma}{\beta}
\quad\Longrightarrow\quad
\left\|\theta_t-\theta_{\mathrm{PS}}\right\|_2
\leq \delta
\quad
\text{for }
t
\geq
\left(
1-\frac{\epsilon\beta}{\gamma}
\right)^{-1}
\log
\left(
\frac{
\left\|\theta_0-\theta_{\mathrm{PS}}\right\|_2
}{
\delta
}
\right)
\end{align}
$$

Equation (2) adds the condition $q\lt 1$. That condition makes $G$ a **contraction mapping**, so by the *Banach fixed-point theorem* we obtain the following properties.

1. $G$ has a unique fixed point $\theta_{PS}$.
2. RRM converges to that fixed point from any initial value $\theta_0$.
3. The error shrinks by at most a factor of $q$ per iteration.

The fixed-point condition is $G(\theta_{PS})=\theta_{PS}$, which is performative stability.

Applying condition (1) to (2), the error becomes a geometric sequence shrinking by a factor $q$ each iteration, and $q^t$ is the cumulative decay after $t$ iterations. Setting a target error $\delta$ then yields the required iteration count $t$ appearing in equation (2).

>[!tip] Removing any one of the three assumptions admits a counterexample where RRM diverges (Prop 3.6). In particular, with a linear loss that is convex but not strongly convex, the iterates oscillate 1, −1, 1, −1, 1, −1, 1, −1 no matter how small the sensitivity is. Strong convexity, which in supervised learning only governed speed, is promoted to a necessary condition for convergence in a performative environment.

### 3.5 Repeated gradient descent

RRM requires an exact optimization oracle at every iteration. In practice even a single training run usually finishes only approximately, so replacing it with **one gradient descent step** gives **repeated gradient descent (RGD)**.

$$
\theta_{t+1}
=
G_{\text{gd}}(\theta_t)
\stackrel{\text{def}}{=}
\Pi_{\Theta}
\left(
\theta_t
-
\eta\,
\mathbb{E}_{Z\sim\mathcal{D}(\theta_t)}
\nabla_{\theta}\ell(Z;\theta_t)
\right)
$$

Here $\eta>0$ is the step size and $\Pi_{\Theta}$ the Euclidean projection onto $\Theta$. The projection is well defined only if $\Theta$ is convex, which is why the assumption made in section *2.0* is needed.

The important point is that this gradient descent **requires only the gradient of the loss $\ell$**. The gradient of $\text{PR}(\theta)$ — the term differentiating the distribution map $\mathcal{D}(\cdot)$ — is not needed.

Even without knowing how the world responds (the form of $\mathcal{D}$), it suffices to **run gradient descent on the observed data exactly as in conventional ML**. That is, performativity is handled while the algorithm itself remains indistinguishable from ordinary training code.

RGD is also a contraction mapping, and when the conditions hold it converges linearly to the same $\theta_{\text{PS}}$. The contraction coefficient is

$$
q_{\text{gd}}
=
1
-
\eta
\left(
\frac{\beta\gamma}{\beta+\gamma}
-
\varepsilon\left(1.5\,\eta\beta^{2}+\beta\right)
\right),
\qquad
\eta \le \frac{2}{\beta+\gamma}
$$

and the convergence condition is as follows.

$$
\varepsilon

\frac{\gamma}{(\beta+\gamma)\left(1+1.5\,\eta\beta\right)}
$$

Since $(\beta+\gamma)(1+1.5\eta\beta)>\beta$, this convergence condition is **stricter** than RRM's $\gamma/\beta$. Using a single gradient instead of a full minimization per step means **the restoring pull is weaker, and the amount of performativity that can be tolerated shrinks accordingly**.

RRM and RGD side by side:

| Item            | RRM                        | RGD                                                     |
| --------------- | -------------------------- | ------------------------------------------------------- |
| One step        | full $\arg\min$ computation | a single gradient                                       |
| What is needed  | an optimization oracle     | $\nabla_\theta\ell$ and a step size $\eta$              |
| Differentiating $\mathcal{D}$ | not needed   | not needed                                              |
| $\varepsilon$ threshold | $\dfrac{\gamma}{\beta}$ | $\dfrac{\gamma}{(\beta+\gamma)(1+1.5\eta\beta)}$ (smaller) |
| Convergence     | linear                     | linear (slower)                                         |
| $\varepsilon=0$ | converges in one step      | the classical GD rate                                   |

## 4. Summary — what was answered and what remains

This post answered one question. **"In an environment where the model changes the data distribution, does retraining converge to a single point?"**

The answer was conditionally yes. When the loss is $\gamma$-strongly convex and $\beta$-smooth and the distribution map is $\varepsilon$-sensitive, the retraining operator $G$ becomes a contraction mapping, and if

$$
\varepsilon < \frac{\gamma}{\beta}
\qquad\Longleftrightarrow\qquad
\underbrace{\varepsilon\beta}_{\text{speed at which the distribution runs away}}
\;
\underbrace{\gamma}_{\text{speed at which optimization pulls back}}
$$

it converges linearly to the unique stable point $\theta_{\text{PS}}$. Since dropping any one of the three assumptions admits a diverging counterexample, this result cannot be weakened further.

But so far this only answers **"where does retraining go?"** Two things remain.

### Remaining problem 1: the population assumption

Everything above took place at the "population level" — we assumed the expectation over $\mathcal{D}(\theta_t)$ could be computed exactly. But as noted in section 1, what we actually observe in reality is only a **finite sample** after deployment. The original paper shows that even in this case one reaches a neighborhood of the stable point with high probability and stays there (RERM/REGD).

### Remaining problem 2: $\theta_{\text{PS}}$ is not $\theta_{\text{PO}}$

A more fundamental problem remains. In section 2 we defined **two** solution concepts.

| | Definition | Character |
| --- | --- | --- |
| $\theta_{\text{PS}}$ | unchanged by retraining on the distribution it created | fixed point — **reachable** |
| $\theta_{\text{PO}}$ | minimum loss among all model-environment pairs | global optimum — **what we wanted** |

And all of section 3 dealt only with **$\theta_{\text{PS}}$**. Where we arrived is not "the best we wanted" but "wherever retraining took us."

$\theta_{\text{PS}}$ cannot be refuted by the data it itself induced. Collecting data under the current conditions and solving risk minimization again yields the same model, so **from inside, no room for improvement is visible**. But that is not equivalent to there being no better model.

Which leaves the following question.

> **How far is the stable point we reached from the optimum we wanted?**

The approach examined here is only justified if the gap between the stable point and the optimum is not large.

The next post aims to answer that question, along three lines:
1. **Does a stable point exist under weaker assumptions?**
2. **Why is aiming directly at the optimum difficult?**
3. **Can we bound the distance between the two solutions?**

Only with those answers does the framework become complete.

## References
- Hardt, Moritz, and Celestine Mendler-Dünner. "Performative prediction: Past and future." Statistical Science 40.3 (2025): 417-436.
- Perdomo, Juan, et al. "Performative prediction." International Conference on Machine Learning. PMLR, 2020.

## Connections

- Related project: staged DDA matgo
- Related experiments:
- Next question to check: can the RRM solution satisfy PO?
