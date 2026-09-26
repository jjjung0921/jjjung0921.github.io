---
title: "[Stage 3] The two problems share one shape: bi-level optimization"
lang: "en"
translationKey: "roadmap-bilevel-common-form"
date: "2026-09-26"
field: "ai"
category: "Research Roadmap"
series: "Research Roadmap"
order: 4
status: "draft"
summary: "MAML's adaptation and PP's response point in opposite directions, but both can be written in the bi-level shape, where an upper-level decision returns to the objective through a lower-level solution. If the shape is the same, the tools are the same: hypergradients and the IFT."
problem: "MAML covers only the direction in which the model adapts to the person, and PP covers only the direction in which the person responds to a decision. Using the two tools separately breaks the loop of an agentic model."
coreIdea: "MAML is a bi-level problem whose lower level (per-person adaptation) is cut off after a few steps. PP enters the same language through two facts: PO is a Stackelberg equilibrium, and Stackelberg is the game-theoretic form of bi-level. Our problem is a bi-level problem in which the upper variable (the difficulty policy) enters the lower-level data distribution."
connection: "Hypergradients and the IFT connect to the Jacobian and Hessian posts in Optimization Foundations, and they overlap with the bi-level language used in HPO. Sharing a shape does not mean the problem is solved, so a testbed that can show feasibility (Stage 4) is needed."
tags: ["research-roadmap", "bi-level-optimization", "maml", "performative-prediction", "hypergradient"]
---

# The two problems have the same shape

In the [tutorial](/en/notes/roadmap-tutorial-personal-agentic-model/) I set the goal like this: **build an agentic model that adapts to a single user.** This stage ties the three verbs into one loop.

> Can MAML and PP be written in one language?

## 0. What Stage 2 left behind: two separate tools

The two tools look in opposite directions. MAML moved the model, while PP in [Stage 2](/en/notes/roadmap-performative-prediction/) moved the person. The language that connects them is bi-level optimization.

## 1. Bi-level optimization: a problem inside a problem

> [!info] Bi-level optimization
> An optimization in which the upper-level objective reaches the upper variable $\lambda$ only through the lower-level solution $w^*(\lambda)$. $w^*(\lambda)$ is the coupling variable that links the two levels.

$$
\min_{\lambda}\ F\big(\lambda,w^*(\lambda)\big)
\quad\text{s.t.}\quad
w^*(\lambda)\in\operatorname*{arg\,min}_{w}\ G(\lambda,w)
\qquad (1)
$$

Franceschi et al. (2018) unify HPO and meta-learning under this single form. They approximate the lower-level problem with $T$ steps of gradient descent and then compute the hypergradient with reverse-mode differentiation.

## 2. Rewriting the two tools as bi-level

### 2.1 MAML: a lower level cut off after one step

MAML already has this shape. The lower level is per-person adaptation $\phi_i=\theta-\alpha\nabla_\theta\mathcal{L}_i(\theta)$, and the upper level is the loss after adaptation (equation (2) in [Stage 1](/en/notes/roadmap-personal-model-and-maml/)). Because the lower level is cut off after one step, $\phi_i$ becomes an explicit expression in $\theta$, and the derivative of the coupling, $I-\alpha H_i$, can be used directly (B1(forthcoming), Jacobian and Hessian(forthcoming)).

### 2.2 PP: by way of Stackelberg

PO is a Stackelberg equilibrium ([Performative Prediction](/en/notes/performative-prediction/), Section 2.2). In a Stackelberg game, the leader decides first and the follower best-responds. The leader's problem is then $\min_{x_1}\{f_1(x_1,x_2)\mid x_2\in\arg\min_y f_2(x_1,y)\}$, which has the same bi-level form as equation (1) (Fiez et al. 2020). Lu (ICML 2023) explicitly writes a bilevel problem in which the upper-level distribution depends on the lower-level solution and the lower-level distribution depends on the upper variable. If the sensitivities of the two distribution maps are small enough, there is a unique bilevel performatively stable point, and retraining converges to it.

> [!warning] "PP itself is bi-level" is not the claim
> PS is a fixed point; what connects to bi-level is PO. Reading the follower as the person assumes that the person best-responds. Our lower-level $\arg\min$ belongs to the player model (the estimator).

## 3. The same shape: where does the upper variable enter?

| | Upper variable | Lower variable | Where the upper variable enters |
|---|---|---|---|
| HPO | Hyperparameters $\lambda$ | Weights $w$ | Lower-level loss |
| NAS (DARTS) | Architecture $\alpha$ | Weights $w$ | Lower-level loss (mixed operation) |
| MAML | Shared starting point $\theta$ | Per-person adaptation $\phi_i$ | Starting point of adaptation |
| PP | Leader's decision $\theta$ | Follower's response | Data distribution $\mathcal{D}(\theta)$ |
| Our problem | Difficulty policy $\psi$ | Player model $\phi$ | Data distribution $\mathcal{D}(\psi)$ |

Written as a formula, the last row is

$$
\phi^*(\psi)\in\operatorname*{arg\,min}_\phi\ \mathcal{L}_{\text{player}}\big(\phi;\mathcal{D}(\psi)\big),
\qquad
\psi^*\in\operatorname*{arg\,min}_\psi\ \mathcal{L}_{\text{DDA}}\big(\psi;\phi^*(\psi)\big)
\qquad (2)
$$

The lower level means "the model fits that person's logs as well as possible." All of the person's behavior lives in $\mathcal{D}(\psi)$. Solving this lower level quickly for a new player is what Stage 1 covers.

## 4. Why this language: same shape, same tools

The **hypergradient** $dF/d\lambda$, the gradient with respect to the upper variable, flows through the derivative of the coupling variable, $dw^*/d\lambda$. That derivative comes from applying the **implicit function theorem** (IFT) to the lower-level optimality condition $\partial_wG=0$.

$$
\frac{dw^*}{d\lambda}=-\big[\partial^2_{ww}G\big]^{-1}\partial^2_{w\lambda}G
\qquad (3)
$$

MAML avoided the inverse by cutting the lower level short, but a bi-level problem solved all the way through has to compute $H^{-1}v$. This language is also the foundation of AutoML and HPO research. For example, Lee et al. (ICLR 2022) distill the entire second-order term of the hypergradient into a single JVP and use it to optimize high-dimensional hyperparameters of meta-learning online, during training.

> [!interpretation] My interpretation
> Looking again at the last column of the table, the upper variable enters the lower-level loss in HPO and DARTS, and the starting point of adaptation in MAML. So the cross term $\partial^2_{w\lambda}G$ in equation (3) is obtained by differentiating the loss or the adaptation rule directly. In PP and in our problem, the upper variable enters the data distribution. To get the same cross term, I have to differentiate the process that generates the data, $\mathcal{D}(\psi)$, not a formula. Even with the same language, this one cell is where I have something new to solve.

NAS is where I first saw this language clearly. DARTS is a bi-level problem that solves the architecture $\alpha$ against the validation loss and the weights $w$ against the training loss ([The math of DARTS](/en/notes/nas-darts-bilevel-relaxation/)), and NAO moved architectures into a continuous space and moved them with gradients ([NAO](/en/notes/nas-nao-continuous-embedding/)). That is the NAS row of the table, and the language stayed with me after I left NAS.

## 5. Summary — what was answered and what remains

In one sentence:

> MAML's adaptation and PP's response can both be written as bi-level problems, where an upper-level decision comes back through a lower-level solution, and then they use the same tools: hypergradients and the IFT.

### Remaining problem: sharing a shape does not mean it is solved

The first and last rows of the table differ. In HPO, $\lambda$ enters the lower-level loss, so the cross term $\partial^2_{w\lambda}G$ comes out of the loss formula. In our problem, $\psi$ enters through the distribution, so $d\phi^*/d\psi$ requires differentiating the data-generating process. The formulas also say nothing about the size of $\varepsilon$ or the gain from personalization. A testbed is needed.

In the next stage I look at staged-dda, a testbed where both decisions and responses are observed.

## Connections

- Related project: [General-purpose staged-DDA](/en/projects/dda-blackjack/); the development of equation (2) is in Personalization as Optimization(forthcoming)
- Next question: where should equation (2) be tested? → Stage 4(forthcoming)
