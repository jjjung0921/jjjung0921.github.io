---
title: "MAML Takes the Task Distribution as Given"
lang: "en"
translationKey: "meta-maml-task-distribution-given"
date: "2026-09-22"
field: "ai"
category: "Meta-Learning"
series: "MAML Task Paradigms"
order: 1
status: "draft"
summary: "MAML learns its starting point from the loss measured after adaptation, but it treats which tasks belong together in one distribution as a given input."
problem: "Earlier approaches put the ability to learn fast in devices outside the model, such as optimizers, metrics, or memory, or looked for an initialization that is good on average without putting adaptation into the objective."
coreIdea: "The task distribution p(T) is an input to the algorithm. The paper does not discuss how to build or choose that distribution, and each experiment's task family is a single range chosen by the experimenter."
connection: "Keep the algorithm as is and make the rule for grouping tasks the object of study. The next post (Khodak) defines task similarity as the diameter of the set of task optima."
tags: ["meta-learning", "maml", "task-distribution", "few-shot"]
---

# MAML Takes the Task Distribution as Given

## One-sentence summary

Earlier work tried to learn fast through devices outside the model, such as optimizers, metrics, or memory, or started fine-tuning from a parameter that performs well on average over the set of tasks ($\mathcal{T}$). MAML instead defines a good meta parameter as the point from which fine-tuning is fastest, and proposes a method for finding that point. MAML can be used without restriction (model-agnostic) by any model trained with gradient descent.

## 1. Limits of earlier approaches

Methods for learning quickly from little data (few-shot learning) fell into four groups.

1. **Learn the update rule or the optimizer.**

    Here meta-learning lives on a separate axis from the model being meta-learned and trains a new model of its own. That brings additional parameters for meta-learning, and the update rule itself has to be learned.

2. **Metric-based comparison**

    This approach learns a new embedding space and projects data into it. A new task is projected into the learned space together with its support examples, and the query takes the label of the nearest one. It suits non-parametric classification but is hard to carry over to other settings such as RL, so its transferability is limited.

3. **Memory-augmented and recurrent models**

    These build an RNN that ingests the data as a whole. They require a particular RNN architecture, so each new problem needs a new model design.

4. **Fine-tuning from pretraining**

    The notion of "adaptation" is left out. A model trained on many sine waves cannot adapt to a new task by fine-tuning on a few points, because of catastrophic overfitting.

## 2. Core idea: what is optimized

If a model is trained by gradient-descent-based fine-tuning, find the point from which gradient descent makes progress fastest. Then the model adapts to a new task in only a few steps. This works without restriction for any model that uses gradient descent.

**Notation**

| Symbol | Meaning |
|---|---|
| $f_\theta$ | model with parameters $\theta$ |
| $\theta$ | meta parameter. The pre-adaptation initialization shared by all tasks, and the only variable being optimized |
| $\theta_i'$ | parameters after adapting to task $\mathcal{T}_i$. Not a free variable but a function of $\theta$ |
| $\mathcal{T}_i$ | one task: a loss $\mathcal{L}$, an initial observation distribution $q(\mathbf{x}_1)$, a transition distribution $q(\mathbf{x}_{t+1}\mid\mathbf{x}_t,\mathbf{a}_t)$, and an episode length $H$ |
| $p(\mathcal{T})$ | task distribution. The algorithm takes it as input (`Require: p(T)`) |
| $\mathcal{L}_{\mathcal{T}_i}$ | loss of task $\mathcal{T}_i$: MSE for regression, cross-entropy for classification, negative expected return for RL |
| $\mathcal{D}_i$, $\mathcal{D}_i'$ | two batches drawn separately from the same task. Adapt on $\mathcal{D}_i$ ($K$ samples) and measure the adapted model on $\mathcal{D}_i'$. Later literature usually calls them support / query |
| $K$ | number of samples used for adaptation ($K$-shot) |
| $\alpha$ | inner step size — the size of one per-task adaptation step |
| $\beta$ | outer (meta) step size — how far $\theta$ moves |

The problem has a bi-level form with two layers.

- **Inner — per-task adaptation**: for each task, start from $\theta$ and take one (or a few) gradient steps on $\mathcal{D}_i$ to obtain $\theta_i'$.
- **Outer — moving the starting point**: sum over tasks the loss of the adapted $\theta_i'$ measured on $\mathcal{D}_i'$, and move $\theta$ in the direction that decreases that sum.

$$
\theta_i' = \theta - \alpha \nabla_\theta \mathcal{L}_{\mathcal{T}_i}(f_\theta)
\qquad (1)
$$

$$
\min_\theta \sum_{\mathcal{T}_i \sim p(\mathcal{T})} \mathcal{L}_{\mathcal{T}_i}(f_{\theta_i'})
= \sum_{\mathcal{T}_i \sim p(\mathcal{T})} \mathcal{L}_{\mathcal{T}_i}\big(f_{\theta - \alpha \nabla_\theta \mathcal{L}_{\mathcal{T}_i}(f_\theta)}\big)
\qquad (2)
$$

$$
\theta \leftarrow \theta - \beta \nabla_\theta \sum_{\mathcal{T}_i \sim p(\mathcal{T})} \mathcal{L}_{\mathcal{T}_i}(f_{\theta_i'})
\qquad (3)
$$

Three points deserve attention in MAML.

1. **The only variable is $\theta$; the loss is measured at $\theta_i'$.**

    Substituting (1) into (2) turns the whole objective into a function of $\theta$ alone.

    Equation (3) is how this objective is solved. Each iteration samples a few tasks and moves $\theta$ by $\beta$ along the average of the gradients from those tasks. It is SGD that samples a task instead of a data point. The gradient is computed **through** $\theta_i'$. We look at its shape in the next section.

    > [!interpretation] My interpretation
    > I read this SGD as moving $\theta$ toward "a point that improves a lot in one step whatever task comes", that is, **the point that responds most sensitively to change**. It moves the starting point itself so that every task's $\theta_i'$ turns out well.
    >
    > SGD can guarantee convergence, but not that the limit is "the point most sensitive to change". What SGD promises (under conditions such as a smooth loss) is only that it approaches a stationary point where objective (2) stops decreasing, and since the objective is not convex, that point need not be a global minimum. The paper does not analyze convergence either. "The sensitive point" is not the target SGD aims at; it is an interpretation of why the point found by decreasing (2) is good.

2. **The two layers use the same loss symbol but different data.**

    Both losses are written $\mathcal{L}_{\mathcal{T}_i}$, but in Algorithm 2 the inner one uses $\mathcal{D}_i$ and the outer one uses $\mathcal{D}_i'$. Measuring on the same data would tell how well the adapted model memorized its adaptation data rather than how well it does on new data from the task. The two batches are roles inside a single task. That is a different level from meta-test, which measures performance on new tasks not used in training.

3. **Where MAML parts ways with pretraining is the point at which the loss is measured.**

    Pretraining on all tasks together minimizes the loss measured at the pre-adaptation $\theta$.

   $$
   \min_\theta \sum_{\mathcal{T}_i \sim p(\mathcal{T})} \mathcal{L}_{\mathcal{T}_i}(f_\theta)
   \qquad (4)
   $$

   MAML measures (4) at the post-adaptation $\theta_i'$ instead (equation (2)). The $\theta$ it looks for is then not "a point that is good on average" but "a point that gets better on each task after one step".

A general bi-level problem solves the inner problem to optimality, whereas MAML cuts the inner problem off after a fixed number of steps. That is why $\theta_i'$ comes out as an explicit expression in $\theta$ and (2) can be differentiated directly.

## 3. How the meta-gradient is computed

### The big picture: two pieces of the chain rule

From here on, the two losses are distinguished by their data: $\mathcal{L}_{\mathcal{D}_i}$ for adaptation and $\mathcal{L}_{\mathcal{D}_i'}$ for evaluation. Parameters are passed directly as arguments instead of $f_\theta$.

Let us start with the big picture. The meta-gradient we want is the gradient of the composite map $\theta \to \theta_i' \to \mathcal{L}_{\mathcal{D}_i'}$. Written as a bare chain rule, it is a product of two pieces.

$$
\underbrace{\nabla_\theta\,\mathcal{L}_{\mathcal{D}_i'}(\theta_i')}_{\text{meta-gradient}}
= \underbrace{\Big(\frac{\partial\theta_i'}{\partial\theta}\Big)^{\!\top}}_{\text{① how much }\theta\text{ moves }\theta_i'}
\;\underbrace{\nabla\mathcal{L}_{\mathcal{D}_i'}(\theta_i')}_{\text{② gradient measured at }\theta_i'}
$$

② comes from ordinary backpropagation at the adapted parameters. What remains is ①. Below we show that ① is $I-\alpha H_i$ (equations (5)–(7)), substitute it to get (8), and finish with how to compute it without forming $H_i$.

![Computation graph of one-step MAML — θ enters θᵢ′ along two paths, and backpropagation returns along the same two paths|600](maml-meta-gradient-paths.svg "Figure 1. Computation graph of one-step MAML. Solid lines are the forward pass, dashed lines the backward pass (meta-gradient). θ enters θᵢ′ through the identity path I and the step path −α∇ℒ(·; 𝒟ᵢ); in backpropagation, v returns along path 1 as v and along path 2 as −αHᵢv, and the two combine into (I − αHᵢ)v.")

Figure 1 is a map of this flow. The solid lines are the forward pass in which $\theta$ enters $\theta_i'$ along two paths; ① comes from exactly these two paths. The dashed lines are the backward pass: the gradient $v$ measured at $\theta_i'$ (②) walks back along the same two paths to $\theta$, which is the product above. The next subsection identifies path 1 and path 2 in equations.

### ① How much $\theta$ moves $\theta_i'$: two paths

Equation (2) is a function of $\theta$ alone, so the gradient in (3) must also be taken with respect to $\theta$. Yet the loss is measured at $\theta_i'$. So we first need to know how $\theta_i'$ changes when $\theta$ moves a little.

Move $\theta$ by a small vector $\delta$. Looking at (1) again, $\theta$ appears twice, so $\delta$ reaches $\theta_i'$ along two paths. Let us take them one at a time.

$$
\theta_i' = \underbrace{\theta}_{\text{path 1}} - \alpha\nabla_\theta\mathcal{L}_{\mathcal{D}_i}(\underbrace{\theta}_{\text{path 2}})
\qquad (5)
$$

- **Path 1 — the starting point passes straight through.** The leading $\theta$ becomes $\theta+\delta$, so $\theta_i'$ also shifts by exactly $\delta$.
- **Path 2 — through the step direction.** When the starting point moves, the gradient there, that is, the step direction, changes too. The Hessian $H_i = \nabla_\theta^2\mathcal{L}_{\mathcal{D}_i}(\theta)$ gives $\nabla_\theta\mathcal{L}_{\mathcal{D}_i}(\theta+\delta) \approx \nabla_\theta\mathcal{L}_{\mathcal{D}_i}(\theta) + H_i\delta$, so the step changes by $-\alpha H_i\delta$.

Adding the two changes gives

$$
\theta_i'(\theta+\delta) \approx \theta_i'(\theta) + \underbrace{\delta}_{\text{path 1}} \underbrace{-\,\alpha H_i\delta}_{\text{path 2}} = \theta_i'(\theta) + (I-\alpha H_i)\,\delta
\qquad (6)
$$

The matrix in front of $\delta$ is exactly the derivative of $\theta_i'$ with respect to $\theta$. Why we can say so follows from the definition of the Jacobian, which the next post, [Jacobian and Hessian: reading them in equations and pictures](/en/notes/optimization-jacobian-hessian-geometry/), covers.

$$
\frac{\partial\theta_i'}{\partial\theta} = I - \alpha H_i
\qquad (7)
$$

### ② Bringing the gradient measured at $\theta_i'$ back to $\theta$

Applying the chain rule now gives the meta-gradient of task $i$. Since $H_i$ is symmetric, no transpose appears.

$$
\nabla_\theta\,\mathcal{L}_{\mathcal{D}_i'}(\theta_i') = (I - \alpha H_i)\,\nabla\mathcal{L}_{\mathcal{D}_i'}(\theta_i')
\qquad (8)
$$

The two factors are measured at different places. The gradient on the right is measured **after** adaptation at $\theta_i'$ on $\mathcal{D}_i'$, while the Hessian on the left is measured **before** adaptation at $\theta$ on $\mathcal{D}_i$. Equation (8) only rewrites the gradient measured at $\theta_i'$ in the coordinates of $\theta$ through $(I-\alpha H_i)$.

### ③ Computing without the Hessian, and FOMAML

How is it computed? First, the $d \times d$ matrix $H_i$ is never formed. Writing $v = \nabla\mathcal{L}_{\mathcal{D}_i'}(\theta_i')$, (8) becomes $v - \alpha H_i v$, so all we need is the Hessian-vector product $H_i v$. It is obtained with $O(d)$ memory by one more backward pass, $H_i v = \nabla_\theta\big(\nabla_\theta\mathcal{L}_{\mathcal{D}_i}(\theta)^\top v\big)$. This is where the paper, in the paragraph after equation (1), mentions "a gradient through a gradient" and Hessian-vector products.

Cutting path 2 and replacing (7) with $I$ is called **FOMAML**. The meta-gradient then becomes $\nabla\mathcal{L}_{\mathcal{D}_i'}(\theta_i')$, the gradient measured at $\theta_i'$ applied to $\theta$ as is. Without second derivatives the computation is cheaper. The paper compared this approximation on MiniImagenet classification only and reports nearly the same performance, within the confidence intervals (§5.2). It does not, however, state any condition under which the approximation holds.

> [!interpretation] My interpretation
> The paper compared FOMAML and MAML only experimentally. Since the term FOMAML drops is $-\alpha H_i v$, I think FOMAML stays close to MAML only when $\alpha H_i$ is small ($\lVert\alpha H_i\rVert \ll 1$). If $\lambda$ is the eigenvalue of the most curved direction, the criterion is $\alpha\lambda$. When I ran it myself, FOMAML split from MAML once $\alpha\lambda\gtrsim1$, even with convex losses; I wrote this up separately in [When does FOMAML diverge from MAML](/en/notes/optimization-fomaml-alpha-lambda/).

You can see which point MAML, FOMAML, and joint training each move to, and along which path, on several tasks with quadratic losses in the [MAML quadratic task example in the lab](/en/lab/maml-quadratic-tasks/).

## 4. What the paper takes as given

The first line of Algorithm 1 is `Require: p(T)`. The task distribution is an **input** to the algorithm. The paper neither builds, chooses, nor learns it. §2.1 defines a task as a loss $\mathcal{L}$, an initial observation distribution $q(\mathbf{x}_1)$, a transition distribution $q(\mathbf{x}_{t+1}\mid\mathbf{x}_t,\mathbf{a}_t)$, and an episode length $H$, and then only says it considers "a distribution over tasks $p(\mathcal{T})$ that we want our model to be able to adapt to".

In practice, then, the experimenter sets $p(\mathcal{T})$: the amplitude range $[0.1, 5.0]$ and phase range $[0, \pi]$ for sine-wave regression, which classes are grouped into N-way problems for classification, and the range of goal positions and velocities for reinforcement learning. So what did the paper take as given and move past? Let us list it.

1. **The distribution itself.** There is no criterion for which tasks can go into one $p(\mathcal{T})$. Once the range is set, the grouping is already over.
2. **How tasks are drawn.** Each iteration draws tasks independently from $p(\mathcal{T})$ (Algorithm 1). Nothing controls which tasks are seen more often.
3. **Equal treatment of every task.** Every task starts from the same $\theta$ and adapts with the same $\alpha$ for the same number of steps.

> [!interpretation] My interpretation
> Figure 1 of the paper draws the optima of three tasks gathered near a single fork. I think the premise that one starting point is enough leans on this picture.

## 5. The gaps it left

The paper moved past three questions without asking them.

1. **Which tasks can be grouped into one distribution?** The paper does not say what conditions a set of tasks needs for a shared starting point to pay off. "The range is wide" and "the task optima are far apart" are different statements. Even with a wide amplitude range the optima may sit within one step of each other, and with a narrow range they may still be scattered. Khodak et al. (2019), covered in the next post, define similarity by the **diameter** of the set of task optima instead of the parameter range, and show that the regret bound for a shared initialization is proportional to that diameter. So when the diameter grows as large as the whole parameter space, the benefit disappears.
2. **How does the composition of the distribution act on meta-learning itself?** The paper reports only post-adaptation performance (MSE, accuracy, return). It does not discuss how the variance, divergence, or seed sensitivity of training changes with how tasks are drawn.
3. **Can tasks be treated differently?** Every task trusts the same $\alpha$, the same number of steps, and the same $\theta$ equally. Learning to Balance, a paper from the lab, starts exactly here.

Why does this approach work at all? Here too the original paper offers only an intuition (it finds a point where the loss is sensitive to parameter changes). Later work filled in the explanation piece by piece: the mechanism through the Taylor expansion of Nichol et al. (2018), convergence through Fallah et al. (2020), and generalization through Khodak et al. (2019) and Raghu et al. (2020).

## Other answers to the same question

- **Reptile** (Nichol et al., 2018): the first-order approximation changed only the **computation** of the inner loop and left the task-distribution assumption untouched. Algorithm 1 starts each iteration by drawing a task, and the expectations in the analysis are taken over the same $p(\tau)$. The update $\theta \leftarrow \theta + \epsilon(\theta_i' - \theta)$ pulls $\theta$ toward the adapted point. With a single inner step it coincides with SGD on joint training. MAML's counterpart for comparison is FOMAML, not Reptile.
- **Probabilistic MAML** (Finn et al., 2018): the distribution is placed on the **initialization**, not on tasks. $p(\mathcal{T})$ is still given and sampled uniformly, and all tasks share one Gaussian prior. Sometimes a few data points cannot pin down a single task; only that uncertainty, the ambiguity within one task, changed.

## References

- [Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks](https://arxiv.org/abs/1703.03400) — Finn, Abbeel, Levine. ICML 2017
- [On First-Order Meta-Learning Algorithms](https://arxiv.org/abs/1803.02999) — Nichol, Achiam, Schulman. 2018
- [Probabilistic Model-Agnostic Meta-Learning](https://arxiv.org/abs/1806.02817) — Finn, Xu, Levine. NeurIPS 2018
- [Provable Guarantees for Gradient-Based Meta-Learning](https://arxiv.org/abs/1902.10644) — Khodak, Balcan, Talwalkar. ICML 2019
