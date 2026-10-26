---
title: If One Relation Changes, Does the Concept Change Too?
lang: en
translationKey: Ontology-Foundations-01-Conceptualization
date: 2026-10-26
field: ai
category: "Ontology"
series: Ontology Foundations
order: 1
projects: []
status: reading
summary: "Following Definitions 2.1–2.4 of Guarino, Oberle & Staab (2009), this note uses a company example to show what goes wrong when a conceptualization is treated as an extensional relational structure (D, R), and how the conceptualization C = (D, W, ℛ), built from functions over possible worlds W, fixes it." # AI 제안 — 검토 필요
problem: Every time one employee's reporting line changes, should we say that the conceptualization has changed?
coreIdea: "The meaning of a relation is not the list of tuples that currently stand in it, but a function that returns an extension for each world state. So when a reporting line changes, what changes is the world; the conceptualization stays the same." # AI 제안 — 검토 필요
connection: "In implementations, the distinction between a conceptualization and a world shows up as the split between the TBox (rules that hold in every world) and the ABox (facts about the current world). Later in this series, jobs.ttl is built on exactly this distinction." # AI 제안 — 검토 필요
tags:
  - ontology
  - conceptualization
  - possible worlds
  - knowledge representation
---

# Ontology in CS

In philosophy, Ontology (we will come back to it at the end of this series) is the discipline that studies the nature and structure of what exists. In CS (Computer Science), by contrast, an ontology is not a discipline but an information object or computational artifact — something we build and use. The word "exist" is also used pragmatically here: for an AI system, what exists is what can be represented (Gruber, quoted in Guarino et al. 2009).

Building such an artifact means analyzing the entities that emerge from observing a system, and thinking about how to generalize and specialize them into concepts.

For example, given a company, we analyze the entities inside it — employee A, employee B — and ask how to generalize them into concepts, and how to specialize those concepts back down to employee A and employee B.

The definition of an ontology starts with Gruber (1993): "explicit specification of a conceptualization". Borst (1997) added two conditions: the conceptualization must be a consensus shared among several parties (shared), and it must be expressed in a machine-readable form (formal). Studer et al. (1998) merged the two definitions into the following:

> An ontology is a formal, explicit specification of a shared conceptualization.

Guarino et al. (2009) split this definition into three parts and ask three questions:

1. What is *conceptualization*?
2. What is proper *formal, explicit specification*?
3. Why is *'shared'* of importance?

This post addresses the first question.

# What Is a *Conceptualization*?

## Conceptualization in everyday terms


Suppose a company has four employees: a, b, c, and d.

Let us define the word cooperation (*cooperates-with*) as the state in which the following two conditions hold:

1. The two people declare that they have the same goal.
2. Each of them does something to achieve that goal.

In other words, even if two people share a goal, we cannot say they "cooperate" unless they actually act toward it.

Suppose a and b cooperate, and b and c cooperate as well. The pairs $(a,b)$ and $(b,c)$ are not two different relations; they are two instances (tuples) of a single relation, cooperation. That is, underneath the word cooperation lies a shared "concept", and that concept is what decides whether two people are cooperating.

## Conceptualization in logical terms

Let us express the example above in logic. We define:

- $D$ : the set of all entities used in the discussion (the universe of discourse)
- $R$ : the set of relations defined on $D$

That is, in the example above:

- $D = \{a, b, c, d, \dots\}$
- $R = \{\text{Person}, \text{Manager}, \text{Researcher}, \text{cooperates-with}, \text{reports-to}\}$

Person, Manager, and Researcher are unary relations (concepts) over a single entity, while cooperates-with and reports-to are binary relations between two entities.

This pair $(D, R)$ is called an *extensional relational structure*. Genesereth & Nilsson defined exactly this $(D, R)$ as a conceptualization. It is called extensional because each element of $R$ is an ordinary mathematical relation. That is, it is the list of tuples that stand in that relation right now (its extension). This list reflects one particular world state.

### An extensional relational structure does not capture a conceptualization

Consider $\text{reports-to}$.

- $\text{reports-to} = \{\dots, (a,b), (b,c), \dots\}$

Now suppose a and d also enter a new $\text{reports-to}$ relationship.

- $\text{reports-to}' = \text{reports-to} \cup \{(a,d)\}$

Only one reporting line was added, yet $R' = \{\text{Person}, \text{Manager}, \text{Researcher}, \text{cooperates-with}, \text{reports-to}'\}$, so $(D, R) \neq (D, R')$. By Genesereth & Nilsson's definition, a single tuple has split the conceptualization in two.

But the concept of "reporting to" has not changed. What changed is only who currently reports to whom — the state of the world. As Guarino et al. (2009) point out, a conceptualization should not change just because the world changes.

To fix this, we define a world state ($w$), define intensional relations on top of it, and build the conceptualization from those.

### Meaning is a decision rule

Let us return to cooperation as defined above. The meaning of cooperation was not the list of pairs currently cooperating. It was a decision rule that tells, using two conditions — declaring a goal and acting on it — whether two people are cooperating. The paper treats this rule as a function: given one behavioral context of the whole company (a world state), it returns the list of pairs actually cooperating in that context.

Treating meaning as a function from worlds to extensions is a tradition that began with Carnap and continued into Montague semantics (why it has to be possible worlds is covered in Part 2). To formalize this function, we first need to pin down what a world state, its input, is.

### Define the World ($W$)

Let us start by defining a world.

Given a system ($S$) that we model, assign one value to every observed variable that characterizes $S$. The single state determined this way is called a world state. Because it fixes everything that can be observed, the paper calls it a maximal observable state of affairs.

Strictly speaking, a world is an ordered set of world states that the system passes through over time. For simplicity, however, the paper abstracts away from time and treats a world state and a world as the same thing. The set of possible worlds (a kind of set of all parallel worlds) is written $W$, and one of its elements is written $w \in W$.

> [!interpretation] My interpretation: Doesn't adding W blow up the computation?
> My first question on reading this definition was about computational cost. In the paper's example, with 50,000 employees and a single goal, each employee has two observed variables: does the employee have the goal, and is the employee actually acting to achieve it? We are not counting pairs of employees. Each employee contributes two Boolean values, so there are $50{,}000 + 50{,}000 = 100{,}000$ variables.
>
> A world state is one combination of values of these variables, so if every combination is allowed, $|W| = 2^{100000}$. The output side is large too. For finite $D$, $|D^n| = |D|^n$ and $|2^{D^n}| = 2^{|D|^n}$, so a binary relation over 50,000 employees is one of $2^{50000^2}$ candidates. If we had to fix such a relation for every world, the size would be far beyond anything computable.
> 
> On reflection, though, this is not a computation the definition asks for. $W$ and $\rho$ are mathematical objects for defining meaning, and real systems do not store $\mathbf{C}$ as a whole. Instead, they split it in two:
>
> - **ABox**: the facts known about the current world. Example: $\text{reports-to}(a, b)$. Its size is the number of facts, not $2^m$.
> - **TBox**: the rules that hold in every world. Example: $\forall x\,(\text{Researcher}(x) \rightarrow \text{Person}(x))$.
>
> When a starts reporting to d, we add one fact to the ABox. The TBox stays the same. This is the implementation-side view of what we saw earlier: what changes is the world, not the conceptualization.
>
> This does not make the computational problem disappear, however. Reasoning has to consider every interpretation that satisfies the axioms, so its cost is determined by which logical language we use (covered in Parts 4 and 7).
>
> In other words, my confusion came from treating "defining a meaning" and "computing with that meaning" as the same task.

### Intensional relation (conceptual relation, $\mathcal{R}$)

An extensional relational structure is unsuitable as a conceptualization because the definition of a relation changes with the world state. 

The paper therefore defines a relation as a function rather than a set of tuples. It is a total function that takes one world state $w$ as input and returns the single $n$-ary relation $\rho^n(w) \subseteq D^n$ that holds in that world. The paper calls this an intensional relation, or, to stress its link with conceptualizations, a conceptual relation.

- $\rho^n: W \rightarrow 2^{D^n}$

- $n$ is the arity of the relation (the number of arguments). Person has $n=1$, and reports-to has $n=2$.
- $D^n$ is the Cartesian product, and $2^{D^n} = \mathcal{P}(D^n)$ is its power set (the set of all possible $n$-ary relations on $D$). This is not the output value but the codomain the output belongs to. The actual output is one element of it.
- Because it is a total function, exactly one output is fixed for every $w$.
- The paper calls the pair $\langle D, W \rangle$ a domain space, meaning that it fixes the range over which relations on $D$ can vary with the world state.

This way, when the world changes, what changes is the function's value $\rho^n(w)$. The function $\rho^n$ itself (the concept) stays the same. If an extensional relation is "one extension", an intensional relation is "a rule that assigns an extension to each world".

### Intensional relational structure (conceptualization, $\mathbf{C}$)

Building a conceptualization from intensional relations gives 

- $\mathbf{C}=(D,W,\mathcal{R})$

Here $D$ is the universe of discourse, $W$ is the set of possible worlds, and $\mathcal{R}$ is the set of conceptual relations on the domain space $\langle D, W \rangle$.

### Back to reports-to: one conceptualization, two worlds

The two situations, before and after a starts reporting to d, are now explained as two different worlds $w_1, w_2$ within the same $\mathbf{C}$.

- $\mathcal{R} = \{\text{Person}^1, \text{Manager}^1, \text{Researcher}^1, \text{cooperates-with}^2, \text{reports-to}^2\}$
- $\text{reports-to}^2(w_1) = \{\dots, (a,b), (b,c), \dots\}$
- $\text{reports-to}^2(w_2) = \{\dots, (a,b), (b,c), (a,d), \dots\}$

The two values differ, but there is only one function $\text{reports-to}^2$. So there is only one conceptualization $\mathbf{C}$.

For simplicity, the paper assumes that unary relations such as $\text{Person}^1$, $\text{Manager}^1$, and $\text{Researcher}^1$ are rigid. That is, they have the same extension in every world. For example, $\text{Person}^1(w) = D$ for every $w \in W$. No such assumption is made for $\text{reports-to}^2$ and $\text{cooperates-with}^2$: reporting and cooperation can differ from world to world.

# Conclusion

Back to the opening question. When one employee's reporting line changes, what changes is the world, not the conceptualization.

If we view a conceptualization as $(D, R)$, a single tuple splits it in two. If we view it as $\mathbf{C} = (D, W, \mathcal{R})$, the same concept (the function $\rho$) simply returns a different extension in each world.

Still, this definition is only a mathematical structure so far. Why meaning has to be a function over possible worlds is covered in Part 2. How to refer to this structure with the symbols of a language, and how to bind those symbols to the intended concepts (the second question, formal, explicit specification), is covered in Parts 3 and 4.

# References

- [Guarino, N., Oberle, D., & Staab, S. (2009). What Is an Ontology? In S. Staab & R. Studer (Eds.), *Handbook on Ontologies* (2nd ed., pp. 1–17). Springer.](https://doi.org/10.1007/978-3-540-92673-3_0)
- [Gruber, T. R. (1993). A Translation Approach to Portable Ontology Specifications. *Knowledge Acquisition*, 5(2), 199–220.](https://doi.org/10.1006/knac.1993.1008)
- Borst, W. N. (1997). *Construction of Engineering Ontologies for Knowledge Sharing and Reuse*. PhD thesis, University of Twente.
- [Studer, R., Benjamins, V. R., & Fensel, D. (1998). Knowledge Engineering: Principles and Methods. *Data & Knowledge Engineering*, 25(1–2), 161–198.](https://doi.org/10.1016/S0169-023X(97)00056-6)
- Genesereth, M. R., & Nilsson, N. J. (1987). *Logical Foundations of Artificial Intelligence*. Morgan Kaufmann.
- Carnap, R. (1956). *Meaning and Necessity: A Study in Semantics and Modal Logic* (2nd ed.). The University of Chicago Press.
- Dowty, D. R., Wall, R. E., & Peters, S. (1981). *Introduction to Montague Semantics*. D. Reidel.
- [Baader, F., Calvanese, D., McGuinness, D. L., Nardi, D., & Patel-Schneider, P. F. (Eds.). (2007). *The Description Logic Handbook* (2nd ed.). Cambridge University Press.](https://doi.org/10.1017/CBO9780511711787)
