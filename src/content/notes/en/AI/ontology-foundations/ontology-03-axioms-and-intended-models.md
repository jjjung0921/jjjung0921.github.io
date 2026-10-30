---
title: "Axioms Do Not Create Meaning"
lang: "en"
translationKey: "Ontology-Foundations-03-axioms-and-intended-models"
date: "2026-10-26"
field: "ai"
category: "Ontology"
series: "Ontology Foundations"
order: 3
projects: []
status: "reading"
summary: "A commitment lives in someone's head, so the interpretation of symbols has to be constrained with axioms. This post defines an intended model as a model that describes one world, then stacks axioms one by one on the company example to see how Mod(O) approaches I_K(L) and where it falls short." # AI 제안 — 검토 필요
problem: "Do axioms give meaning to symbols, or do they filter out unintended interpretations?"
coreIdea: "Axioms do not create new meaning; they only filter out interpretations that do not fit a meaning already chosen. So axioms can be too loose or too strong, and choosing an axiom is choosing which concept to commit to." # AI 제안 — 검토 필요
connection: "The axioms stacked in this post are the TBox mentioned in Part 1. In Part 6 we write them in OWL while building jobs.ttl." # AI 제안 — 검토 필요
tags: ["ontology", "intended models", "axioms", "model theory"]
---

# The question Part 2 left

In Part 2 we fixed which concept each symbol refers to. That is the interpretation function $\mathcal{I}$ that connects the vocabulary $V$ of the language $L$ to the conceptualization $\mathbf{C}$, in other words the ontological commitment. But this $\mathcal{I}$ lives in the head of the person who fixed it. The symbols of a logical language can, by nature, be interpreted in any number of ways, so even if someone interprets `cooperates-with` as the reporting relation, nothing in the language itself prevents it.

There are two ways to show the conceptualization in our head to others.

- **Specifying by extension**: list the extensions of every relation for every possible world. Given the size of $W$ we saw in Part 1, this is impossible, let alone when $D$ is infinite. We can pick a few typical worlds and list them as examples, but that shows only a part.
- **Specifying by intension**: fix a language and write, as axioms, the conditions its interpretations must satisfy. For example, if we write "`cooperates-with` is symmetric", every interpretation that is not symmetric is filtered out.

The bundle of axioms used in the second way is an ontology. This post is about exactly what those axioms do. To get there, we first have to fix what we want to keep after filtering.

# Intended model: a model that describes one world

In Part 2 we said that one commitment $K = (\mathbf{C}, \mathcal{I})$ fixes one model for each world, because once a world $w$ is chosen, the interpretation of a predicate symbol $P$ is fixed as $\mathcal{I}(P)(w)$. This time we go the other way: given a model $M = (S, I)$, we ask whether it fits the commitment.

For a model $M$ to fit $K$, two things are needed.

$$
\forall c \in V_{\text{const}}:\ I(c) = \mathcal{I}(c), \qquad
\exists w \in W\ \ \forall P \in V_{\text{pred}}:\ I(P) = \mathcal{I}(P)(w)
$$

1. Constant symbols refer to exactly the entities the commitment refers to.
2. There is **one** world $w$ such that the interpretations of all predicate symbols match the extensions in that world.

Such a model is called an **intended model**, and the set of all of them is written $I_K(L)$. Because of the second condition, an intended model is, so to speak, **a description of one world**. For example, a model with $I(\text{reports-to}) = \text{reports-to}^2(w_1)$ and $I(\text{cooperates-with}) = \text{cooperates-with}^2(w_1)$ is a model that copies the world $w_1$ as it is.

The order of the quantifiers matters here. The condition is "$\exists w\ \forall P$" (one world shared by all predicates), not "$\forall P\ \exists w$" (it is enough for each predicate to match some world of its own). Let us check the difference with a small example. In this example only, suppose that Manager and Researcher can differ from world to world.

- $D = \{a\}$, $W = \{w_1, w_2\}$
- $\text{Manager}^1(w_1) = \{a\}$, $\text{Manager}^1(w_2) = \varnothing$: in $w_1$, a is a manager.
- $\text{Researcher}^1(w_1) = \varnothing$, $\text{Researcher}^1(w_2) = \{a\}$: in $w_2$, a is a researcher.

Now consider the model with $I(\text{Manager}) = I(\text{Researcher}) = \{a\}$. The interpretation of Manager matches $w_1$, and that of Researcher matches $w_2$. Taken one predicate at a time, each matches some world. But no world matches both predicates **at once**, because $W$ contains no world in which a is both a manager and a researcher. So this model is not an intended model: it is not a description of any world.

$$
\exists w\ \forall P\ \varphi(P, w)\ \Rightarrow\ \forall P\ \exists w\ \varphi(P, w)
$$

This direction always holds, but as the example shows, the converse does not. This is exactly the condition written in my interpretation in Part 2: "when we look at several symbols together, all symbols must be evaluated in the same world $w$."

# Ontology: filtering models with axioms

Now we can define an ontology. An ontology $O$ is a set of formulas of the language $L$, that is, a set of axioms. Let $\text{Mod}(O)$ be the set of models that satisfy all the axioms.

$$
\text{Mod}(O) = \{\, M \mid M \models \varphi \text{ for every } \varphi \in O \,\}
$$

The goal of designing an ontology is to make this set as close as possible to the set of intended models.

$$
\text{Mod}(O) \approx I_K(L)
$$

Here $\approx$ is shorthand for "as close as possible". Ideally the following would hold, but in general it is not guaranteed.

$$
M \models O \iff M \in I_K(L)
$$

In other words, what axioms (the ontology) do is, among all possible models of $L$, **keep the intended models and filter out the unintended ones**.

In this series, an ontology means this narrow definition: a set of axioms aimed at a commitment. Real ontologies also contain parts that filter no models, such as human-readable names and descriptions (annotations); these are covered in Parts 5 and 6.

# Building the company ontology

Let us stack axioms one at a time on the company example from Part 1. Each added axiom shrinks $\text{Mod}(O)$. Looking at which models each axiom filters out shows what axioms do. Let $D = \{a, b, c, d\}$.

First, let us recall what we were trying to capture. The company conceptualization of Part 1 was as follows.

- **Entities**: $D = \{a, b, c, d\}$, the four employees of the company.
- **Unary concepts**: $\text{Person}$, $\text{Manager}$, $\text{Researcher}$. Every employee is a Person, and Manager and Researcher are parts of it.
- **cooperates-with**: holds when two people declare the same goal and each acts toward that goal. This is the decision rule fixed in Part 1.
- **reports-to**: who reports to whom. In the world we have been using, it was $\{(a, b), (b, c)\}$.

The problem is exactly what we saw in Part 2. Given only the symbols $\text{Person}$, $\text{Manager}$, $\text{Researcher}$, $\text{cooperates-with}$, and $\text{reports-to}$, the interpretation function $I$ can send them to any sets and relations over $D$. Logic does not stop us from giving $\text{cooperates-with}$ the extension of the reporting relation, or from sending $\text{Researcher}$ outside Person. The goal is to keep, among all these models, only those that fit the conceptualization above, that is, the intended models. Let us see how much closer each added axiom brings us to that goal.

**1. Taxonomic information.** Researcher and Manager are subconcepts of Person.

$$
O_1 = \{\ \text{Researcher}(x) \rightarrow \text{Person}(x),\ \ \text{Manager}(x) \rightarrow \text{Person}(x)\ \}
$$

A model with $I(\text{Person}) = \{a, b\}$ but $I(\text{Researcher}) = \{c\}$ is filtered out, because it has a researcher who is not a person.

**2. Domains and ranges.** Both relations hold only between people.

$$
O_2 = O_1 \cup \{\ \text{cooperates-with}(x, y) \rightarrow \text{Person}(x) \land \text{Person}(y),\ \ \text{reports-to}(x, y) \rightarrow \text{Person}(x) \land \text{Person}(y)\ \}
$$

A model with $I(\text{Person}) = \{a, b, c\}$ but $(c, d) \in I(\text{cooperates-with})$ is filtered out, because c would be cooperating with d, who is not a person.

**3. Symmetry.** Cooperation is something both sides do together.

$$
O_3 = O_2 \cup \{\ \text{cooperates-with}(x, y) \leftrightarrow \text{cooperates-with}(y, x)\ \}
$$

A model like $I(\text{cooperates-with}) = \{(a, b)\}$, missing $(b, a)$, is filtered out.

**4. Transitivity.** If a reports to b and b reports to c, we take a to report to c as well.

$$
O_4 = O_3 \cup \{\ \text{reports-to}(x, y) \land \text{reports-to}(y, z) \rightarrow \text{reports-to}(x, z)\ \}
$$

A model like $I(\text{reports-to}) = \{(a, b), (b, c)\}$, missing $(a, c)$, is filtered out. But this is exactly the reporting relation we have been using since Part 1. If we accept this axiom, our example world is filtered out. We come back to this in the next section.

**5. Disjointness.** No one is both a manager and a researcher.

$$
O_5 = O_4 \cup \{\ \text{Manager}(x) \rightarrow \neg\,\text{Researcher}(x)\ \}
$$

A model with $I(\text{Manager}) = I(\text{Researcher}) = \{a\}$ is filtered out. This is the very model that, in the previous section, was not an intended model because "it is not a description of any world". Here the axiom actually catches an unintended model.

The way the set of models shrinks as axioms are added can be summarized as follows.

$$
\text{Mod}(O_1) \supseteq \text{Mod}(O_2) \supseteq \text{Mod}(O_3) \supseteq \text{Mod}(O_4) \supseteq \text{Mod}(O_5)
$$

# Axioms do not create meaning

We stacked five axioms, but none of them says **what** a Researcher is. $\text{Researcher}(x) \rightarrow \text{Person}(x)$ merely puts researchers inside people. As long as it is a subset of Person, Researcher can still be interpreted as any set. Axioms do not create new meaning. They only filter out interpretations that do not fit a meaning already chosen.

So axioms can miss in two directions.

- **If they are too loose**, unintended models remain. Even with $O_5$, a model in which "everyone cooperates with everyone else" is not filtered out, because it is symmetric and holds between people.
- **If they are too strong**, intended models are cut off too. The transitivity axiom filtering out our example world is a case in point.

There is more to the transitivity axiom. When Guarino et al. (2009) first explain the role of an ontology, they give as an example axioms stating that "reports-to is asymmetric and intransitive". Yet when they stack axioms one by one, they take reports-to to be transitive, "although arguable". Within one paper, opposite axioms are attached to the same symbol.

Logic does not decide which is right. If reports-to means **direct reporting**, it is not transitive; if it means **chain of command**, it is transitive. Choosing an axiom is choosing which concept the symbol commits to. Axioms are a tool for writing that choice down, not for making it for us.

Let us separate two steps here.

- **Committing** (Part 2): assign the intended concept to each symbol. This is **adopting** a meaning.
- **Specifying** (Part 3): write axioms so that only the models that fit that intent remain. This is **specifying** a meaning.

The two are connected but not the same. For the same commitment, we can stop at $O_3$ or go all the way to $O_5$. An ontology is a matter of how well it approximates the commitment.

> [!interpretation] My interpretation: Axioms take the narrowing of the mapping outside the head
> In Part 2 I read the intensional interpretation function $\mathcal{I}$ as a device that narrows a word's mapping. It meant narrowing the candidate extensions a symbol $P$ can take from all of $2^{D^n}$ down to $\{\rho_P(w) \mid w \in W\}$. But that narrowing happened only in the head of the person who fixed the commitment.
>
> Axioms seem to take the same narrowing outside, written as sentences of $L$. The axiom "`cooperates-with` is symmetric" removes non-symmetric extensions from the candidates. Since this sentence can be shown to anyone, the same narrowing applies to other people's interpretations too.
>
> The difference is precision. The narrowing in the head shrinks the candidates to exactly the extensions the concept allows, while axioms only get close to it. This is why it is $\approx$ and not $=$ in $\text{Mod}(O) \approx I_K(L)$.

# Next

If axioms only approximate a conceptualization, what is lost in the process? And how can the lost meaning be recovered? This is covered in Part 4.

In my interpretation in Part 1, I said that real systems split a conceptualization into a TBox and an ABox. The axioms stacked in this post are exactly the TBox, because they are rules that must hold in every world. The ABox is closer to the facts known about one world, a written-down part of one model. In Part 6 we write these axioms in OWL ourselves while building jobs.ttl.

# References

- [Guarino, N., Oberle, D., & Staab, S. (2009). What Is an Ontology? In S. Staab & R. Studer (Eds.), *Handbook on Ontologies* (2nd ed., pp. 1–17). Springer.](https://doi.org/10.1007/978-3-540-92673-3_0)
- Carnap, R. (1956). *Meaning and Necessity: A Study in Semantics and Modal Logic* (2nd ed.). The University of Chicago Press.
- Guarino, N. (1998). Formal Ontology in Information Systems. In N. Guarino (Ed.), *Formal Ontology in Information Systems: Proceedings of FOIS'98* (pp. 3–15). IOS Press.
