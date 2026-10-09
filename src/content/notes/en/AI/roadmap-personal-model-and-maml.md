---
title: "[Stage 1] To fit one person, first learn how to learn fast: meta-learning and MAML"
lang: "en"
translationKey: "roadmap-personal-model-and-maml"
date: "2026-09-21"
field: "ai"
category: "Research Roadmap"
series: "Research Roadmap"
order: 2
status: "draft"
summary: "The data we get from one person is scarce, and it differs from person to person. Train per person and there is not enough data. Train one model on everyone and it fits the average. Treat each person as a task and the dilemma becomes a meta-learning problem, which MAML solves by putting the post-adaptation loss into the objective."
problem: "Training a separate model for each person leaves too little data, while pooling everyone into one model yields a model fit to the average person."
coreIdea: "With person = task, 'how to learn a new person quickly' can be learned from many people. MAML measures the loss after adaptation rather than before, and finds a starting point from which one adaptation step improves things for each person."
connection: "MAML covers only the direction in which the model adapts to the person (→ Stage 2). Which individuals to group into one task distribution is treated as an input (→ Stage 5). The gradient computation is in MAML Task Paradigms B1."
tags: ["research-roadmap", "personalization", "meta-learning", "maml", "few-shot"]
---

# A model that fits one person must first learn how to learn fast

In the [tutorial](/en/notes/roadmap-tutorial-personal-agentic-model/) I set the goal: **build an agentic model that adapts to a single user.** Of the three verbs, this stage takes on "adapt."

> What capability does a model that fits a single user need, and what does it become when written as a learning problem?

## 0. Personal data: why ordinary learning gets stuck

The data we get from one person is scarce, and it differs from person to person. When both properties hold, ordinary supervised learning gets stuck whichever way we go.

If I train a separate model for each person, individual differences survive but the data runs out. Fit a trend to two or three observations and extrapolation blows up as soon as we step slightly outside them. If I pool everyone's data into one model, the opposite happens and data is plentiful. The model then fits the average person instead. The average person does not actually exist.

| Approach | Data | Individual differences | Result |
|---|---|---|---|
| Train per person | Insufficient | Kept | Overfits a few observations |
| Train one model | Sufficient | Erased | A model fit to the average |
| Person = task, meta-learning | Borrowed from many people | Kept through adaptation | A starting point that adapts quickly to a new person |

Today's LLM agents handle this problem with **memory**. They store the user's history and read it back into the context every time. The result does fit the person, but the parameters stay the same. As the history grows, the context to read gets longer and the compute grows with it. The model I want fits the person without reading more.

## 1. Person = task: turning the dilemma into a learning problem

So can we take only the strengths of both approaches? We can, if we view one person not as one data point but as one **task**. Then "learn, from many people, how to learn a new person quickly" becomes a learning problem.

> [!info] Meta-learning
> Learning, from many tasks, the ability to learn a new task quickly from little data. In this series, a task is one person.

```text
Many individuals (task 1 … N)
      │  meta-train: scored by performance after adaptation
      ▼
Shared starting point θ
      │  adapt with a few observations of a new individual
      ▼
That individual's parameters φ
```

## 2. MAML: putting adaptation inside the objective

Meta-learning also has branches that learn an optimizer, branches that learn a metric space, and branches that add a memory structure. Among them, **Model-Agnostic Meta-Learning** (MAML) fits my goal for two reasons. It treats adaptation as a few gradient descent steps, so it works with any model trained by gradient descent. And it puts the loss **after** adaptation into the objective. I repeat the one-sentence summary from B1 (forthcoming).

> MAML defines a good meta parameter as the point from which the fastest fine-tuning is possible, and presents MAML as the technique for finding that point.

The difference shows up in two equations. Pretraining, which trains on everything pooled together, measures the loss at $\theta$ before adaptation.

$$
\min_\theta \sum_i \mathcal{L}_i(\theta)
\qquad (1)
$$

MAML measures the same loss after one adaptation step.

$$
\min_\theta \sum_i \mathcal{L}_i'\big(\theta-\alpha\nabla_\theta\mathcal{L}_i(\theta)\big)
\qquad (2)
$$

$\mathcal{L}_i$ is the loss on person $i$'s adaptation data, and $\mathcal{L}_i'$ is the loss on the same person's evaluation data. The $\theta$ that (1) finds is "a point that is good on average." The $\theta$ that (2) finds is "a point that gets better for each person after one step." Adapting to a person requires the latter.

> [!interpretation] My interpretation
> As I wrote in the [tutorial](/en/notes/roadmap-tutorial-personal-agentic-model/), NAS had to search for an architecture per person, and that compute was out of reach. MAML finds a single starting point $\theta$ shared by everyone, and each person only takes a few steps from there. The expensive search happens once in meta-train, and the cost for one individual drops to a few gradient steps. The shape of equation (2) is also familiar. It is a two-level structure: $\theta$ on the outside, per-person $\phi_i$ on the inside. This is the same shape as DARTS splitting architecture and weights into two levels. I return to this shape in Stage 3.

## 3. Summary: what was answered and what remains

In one sentence:

> The ability to fit an individual is learning quickly from few observations, and with each individual as a task it becomes the problem of finding a starting point that makes the post-adaptation loss small, which is MAML.

### Open problem 1: only one direction

In equation (2), only the model moves. It assumes person $i$'s data stays the same no matter what the model does. MAML covers only the direction in which the model adapts to the person. But an agentic model makes decisions, and those decisions change the person.

### Open problem 2: who gets grouped into one distribution

The sum in equation (2) is taken over a distribution of people $p(\mathcal{T})$. MAML only receives this distribution as an input. It says nothing about which individuals to group into one distribution. I set this question aside and pick it up again in Stage 5.

In the next stage I take open problem 1 and look at what breaks when the model's decisions change the person's data.

## Connections

- Related project: [General staged-DDA](/en/projects/dda-blackjack/) — the second level, which treats players as tasks (Stage 4)
- Related experiments: none. I follow the two-level gradient computation in MAML Task Paradigms B1 (forthcoming).
- Next question to check: what breaks when the model's decisions change the person? → [Stage 2 — When the model decides, the person changes](/en/notes/roadmap-performative-prediction/)
