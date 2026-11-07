---
title: "MAML on quadratic tasks"
lang: "en"
translationKey: "maml-quadratic-tasks"
tier: "client"
status: "prototype"
question: "Where does measuring the loss after one adaptation step move the starting point, and how much does the path shake when tasks are sampled in batches?"
runtime: "browser"
inputs: ["alpha", "task count", "task spread", "meta-batch size", "start point"]
outputs: ["MAML optimum", "FOMAML stationary point", "loss before/after adaptation", "tail spread by batch size"]
tags: ["Meta-Learning", "MAML", "Bi-level Optimization", "Visualization"]
summary: "Compares the starting points and meta-batch paths of MAML, FOMAML and joint training on several quadratic tasks."
---

## Model

Every task $i = 1, \dots, N$ has a quadratic loss.

$$
\mathcal{L}_i(\theta) = \tfrac{1}{2}(\theta - c_i)^\top A_i (\theta - c_i), \qquad \theta \in \mathbb{R}^2
$$

$c_i$ is the optimum of task $i$ and $A_i$ its Hessian. Each task gets a random curvature (eigenvalues) and a random steep direction. Here the adaptation data and the evaluation data give the same loss. In real MAML they differ.

One inner step and its Jacobian:

$$
\theta_i' = \theta - \alpha A_i(\theta - c_i), \qquad \frac{\partial \theta_i'}{\partial \theta} = I - \alpha A_i
$$

All three gradients have the form $\frac{1}{N}\sum_i W_i(\theta - c_i)$; only the coefficient matrix changes.

| Method | Coefficient matrix | What it minimizes |
|---|---|---|
| Joint training | $W_i = A_i$ | mean loss before adaptation |
| MAML | $W_i = (I-\alpha A_i)\,A_i\,(I-\alpha A_i)$ | mean loss after adaptation |
| FOMAML | $W_i = A_i\,(I-\alpha A_i)$ | approximation that replaces the leading $(I-\alpha A_i)$ with $I$ |

Because the losses are quadratic, each point is $\theta^\star = \big(\sum_i W_i\big)^{-1}\sum_i W_i c_i$. All paths are gradient descent with the same outer step size $\beta$.

**Meta-batch.** Algorithm 1 of the paper samples a few tasks per iteration and moves $\theta$ by the mean of their gradients. Here $B$ of the $N$ tasks are drawn without replacement.

$$
\theta \leftarrow \theta - \beta \cdot \frac{1}{B}\sum_{i \in \mathcal{B}_k} W_i(\theta - c_i), \qquad |\mathcal{B}_k| = B
$$

With $B = N$ this is the full gradient. The three faint lines are batch paths drawn with different seeds.

## What to look at

- **When $\alpha \to 0$.** The three points merge. With $\theta_i' = \theta$ the MAML objective becomes the joint-training objective. Adaptation disappears; it does not turn into per-task fine-tuning.
- **When $\alpha$ grows.** The MAML point leaves the joint-training point, because the weight on an eigen-direction with eigenvalue $\lambda$ changes from $\lambda$ to $\lambda(1-\alpha\lambda)^2$. One adaptation step fixes steep directions by itself, so the start need not be accurate there, and the flat directions decide where it sits. In the output table the MAML point has a higher loss **before** adaptation than the joint point but a lower loss **after** it.
- **When FOMAML matches MAML.** The FOMAML weight is $\lambda(1-\alpha\lambda)$, off from MAML by a factor $(1-\alpha\lambda)$, so the two agree only when $\alpha\lambda \ll 1$. Once some direction has $\alpha\lambda > 1$, the mean FOMAML matrix can get a negative eigenvalue. Its stationary point is then not a minimum and the path diverges; with the default settings this starts near $\alpha \approx 0.32$. The MAML weight is a square and never goes negative.
- **Batch size $B$.** The gradient is linear in $\theta$, so the **expected** batch path equals the full path. Each iteration, however, leans toward the tasks it drew, so with a fixed $\beta$ the path keeps shaking around $\theta^\star_{\mathrm{MAML}}$ instead of settling. The variance of a batch-mean gradient drawn without replacement scales with $\frac{1}{B}\cdot\frac{N-B}{N-1}$, so the shaking shrinks as $B$ grows and vanishes at $B = N$. The bar chart on the right shows this.
- **Spread of task optima.** In a quadratic example every point scales with the spread. The post-adaptation loss grows with its square and the batch shaking grows in proportion to it. The farther apart the tasks, the less any single start reaches all of them in one step, and the more the meta-update direction depends on which tasks were drawn. The second part says that differences between task gradients (gradient diversity) make meta-training shake more.

## Limits

The Hessian is constant because the losses are quadratic. In a neural network $A_i$ changes with $\theta$, and MAML never forms $A_i$; it only computes Hessian-vector products $A_i v$. This example shows how direction, weight and batch noise interact; it does not reproduce real training dynamics. Batch shaking also grows with $\beta$, which is fixed here to suit the steepest task.

Related post: [MAML Takes the Task Distribution as Given](/en/notes/meta-maml-task-distribution-given/)
