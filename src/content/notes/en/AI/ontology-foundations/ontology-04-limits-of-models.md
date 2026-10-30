---
title: "Models Cannot Bring Back the Concept"
lang: "en"
translationKey: "Ontology-Foundations-04-limits-of-models"
date: "2026-10-26"
field: "ai"
category: "Ontology"
series: "Ontology Foundations"
order: 4
projects: []
status: "reading"
summary: "This post splits the meaning loss that occurs when a conceptualization is moved into axioms into two layers. Approximation error can be fixed, but because models do not remember worlds, the conceptualization cannot be recovered even when Mod(O) = I_K(L). It also covers the remedy of enriching the vocabulary and domain, the gap between intended models and reality, and practical ways to check an ontology." # AI 제안 — 검토 필요
problem: "Even if the axioms are written perfectly, can we recover the original conceptualization from the models alone?"
coreIdea: "As long as we unfold a conceptualization into axioms and then into models, meaning loss is unavoidable. The map from a conceptualization to its collection of extensions is not injective, so in general there is no way back." # AI 제안 — 검토 필요
connection: "This is the basis for checking jobs.ttl with competency questions for gaps in the vocabulary, and with OntoClean for errors in the taxonomy. Part 5 looks at the same problem through the lens of Neuhaus (2018)." # AI 제안 — 검토 필요
tags: ["ontology", "identifiability", "intended models", "ontological realism", "ontology evaluation"]
---

# The question Part 3 left

In Part 3 we treated an ontology as a set of axioms and summarized what axioms do as "keeping the intended models and filtering out the unintended ones". We stopped at the point that axioms cannot carry a commitment over exactly; they only approximate it.

$$
\text{Mod}(O) \approx I_K(L)
$$

This post is about what slips out through that $\approx$, and whether the meaning that slipped out can be recovered.

> [!interpretation] My interpretation: Moving a conceptualization into axioms widens the mapping again
> In Part 2 I read the intensional interpretation function $\mathcal{I}$ as a device that narrows a word's mapping. It meant narrowing the candidate extensions a symbol $P$ can take from all of $2^{D^n}$ down to $\{\rho_P(w) \mid w \in W\}$. In Part 3 I read axioms as taking that narrowing outside the head.
>
> But moving the original conceptualization into axioms turns out to widen again the mapping that had been narrowed in the head. The $\mathcal{I}$ in the head can point at the candidate set directly, but axioms cannot point at that set; they can only draw a boundary around it with conditions. If the boundary is drawn loosely, extensions the concept does not allow come back in; if it is drawn too tightly, allowed extensions drop out.
>
> In other words, as long as we unfold a conceptualization into axioms and then into models, meaning loss is unavoidable.

![The boundary drawn by axioms and the narrowing of a mapping — ℐ in the head points exactly at the candidates, loose axioms let in disallowed extensions, and axioms that are too narrow cut off allowed extensions|620](ontology-axiom-boundary.svg "Figure 1. The rectangle is the set of all candidate extensions a symbol P can have, and the green region is the extensions the concept allows. ℐ in the head points exactly at this region, but axioms can only draw a boundary (dashed) with conditions. If the boundary is loose, disallowed extensions (orange) get in; if it is too narrow, allowed extensions (hollow circles) drop out.")

# The loss comes in two layers

The loss can be split into two layers.

1. **Approximation error**: loss from drawing the boundary in the wrong place.
2. **Loss that remains even with a perfect approximation**: loss that remains even when $\text{Mod}(O) = I_K(L)$.

Approximation error can, **in theory**, be brought arbitrarily close to zero. If, in the company ontology of Part 3, a model in which "everyone cooperates with everyone else" still remains even with $O_5$, we can add an axiom that rules it out.

If transitivity cuts off our example world, we can remove that axiom. By fixing the axioms like this, we can in theory get all the way to $\text{Mod}(O) = I_K(L)$.

The problem is the second layer. Most of this post is about the second.

# Models do not remember worlds

Even if the axioms are written so well that $\text{Mod}(O) = I_K(L)$, can we recover the original conceptualization from the models alone? Models do not remember the individual worlds of a conceptualization. For example, a conceptualization in which cooperation means "sharing a goal is enough" and one in which it means "they also have to act toward the goal" cannot be told apart in the models with the single symbol `cooperates-with`.

![Domain, codomain, and range of the cooperation rule — world ① goes to {(a,b),(b,a)}, while ② and ③ both go to the empty set. Going back from the empty set, we cannot tell which world it was|620](ontology-cooperation-collapse.svg "Figure 2. The cooperation rule ρ fixes one extension for each world. ② (same goal, b does not act) and ③ (different goals) both go to ∅. Since only extensions remain in the model, going back from ∅ we cannot tell whether it was ② or ③. {(a,c)} is in the codomain but is not an extension this rule produces.")

Let us see why with the smallest example. There are two employees, a and b, and two possible worlds, $w_0$ and $w_1$. We take two extensions for the cooperating pairs.

$$
E_0 = \varnothing, \qquad E_1 = \{(a, b), (b, a)\}
$$

**First counterexample: one world alone cannot tell them apart.** Take two conceptual relations $\rho_A$ and $\rho_B$ as follows.

| | $w_0$ | $w_1$ |
|---|---|---|
| $\rho_A$ | $E_0$ | $E_1$ |
| $\rho_B$ | $E_0$ | $E_0$ |

$\rho_A$ judges that a and b cooperate in $w_1$, while $\rho_B$ judges that they cooperate in no world. They are different decision rules. Yet if we look only at the world $w_0$, both produce $E_0$. That is, the extension in one world is not enough to fix the decision rule.

**Second counterexample: even all possible extensions cannot tell them apart.** This time define the two conceptual relations as follows.

| | $w_0$ | $w_1$ |
|---|---|---|
| $\rho_A$ | $E_0$ | $E_1$ |
| $\rho_B$ | $E_1$ | $E_0$ |

$\rho_A \neq \rho_B$. The worlds in which cooperation holds are exactly opposite. But the collections of extensions the two relations can produce are identical.

$$
\{\rho_A(w) \mid w \in W\} = \{\rho_B(w) \mid w \in W\} = \{E_0, E_1\}
$$

If the language has only $\text{cooperates-with}$ and no other symbol that distinguishes worlds, the two commitments allow exactly the same models: one with no cooperating pairs, and one in which a and b cooperate. Since the sets of intended models are the same, no matter how closely we look at that set, we cannot tell whether $\rho_A$ or $\rho_B$ was the original conceptualization.

Written as a formula, what disappears is this. The path from a conceptual relation to the models goes through the following map.

$$
F: \rho \mapsto \{\rho(w) \mid w \in W\}
$$

$F$ erases the correspondence of "which extension comes out in which world" and keeps only the set of extensions. So different $\rho$ are sent to the same result. That is, $F$ is not injective, and in general there is no inverse that goes back from the result to the original $\rho$. This loss necessarily occurs, however perfect the axioms are.

The reason the two conceptualizations of cooperation cannot be told apart is the same. The conceptualization "sharing a goal is enough" and the conceptualization "they also have to act" pick different pairs in each world. But the model does not record the world; only the list of cooperating pairs remains.

This is described as one model collapsing many world states into one.

# How can the original meaning be recovered?

The loss from world states collapsing cannot be fixed by fixing the axioms alone. Models collapse worlds because the vocabulary is too poor to express the differences between worlds. So we enrich the vocabulary and the domain so that the differences can be expressed.

For cooperation, we put not only people but also goals $g$ into the domain $D$, and add two predicates to the vocabulary.

- $\text{has-goal}(x, g)$: $x$ declares that it has the goal $g$.
- $\text{acts-for}(x, g)$: $x$ acts toward the goal $g$.

Now each of the two conceptualizations can be written as an axiom.

$$
\text{cooperates-with}(x, y) \leftrightarrow \exists g\,[\text{has-goal}(x, g) \land \text{has-goal}(y, g)]
$$

$$
\text{cooperates-with}(x, y) \leftrightarrow \exists g\,[\text{has-goal}(x, g) \land \text{has-goal}(y, g) \land \text{acts-for}(x, g) \land \text{acts-for}(y, g)]
$$

Imagine a world in which a and b have the same goal but b does not act. In a model that follows the first axiom, a and b cooperate; in a model that follows the second, they do not. Thanks to the richer vocabulary, the two conceptualizations now allow different models. These two axioms write the decision rule for cooperation fixed in Part 1 in $L$.

How well an ontology specifies a conceptualization depends on the following three things.

1. How rich the domain is
2. How rich the vocabulary is
3. How the axioms are written

The axioms covered in Part 3 are only one of them.

However, this does not guarantee full recovery. Enriching the vocabulary lets us express as many differences as we added. But as long as some observed variables are not lifted into the vocabulary, worlds that differ only in those variables still collapse. Recalling that Part 1 defined a world state as the values of **all** observed variables, it is hard for the vocabulary to keep up with every observed variable. So recovery is always a question of "how far".

# One more gap: intended does not mean "true in reality"

The losses so far were between a conceptualization and an ontology. But there is one more gap: between a conceptualization and reality.

> [!interpretation] My interpretation: Intended models do not guarantee reality
>
> An intended model is a model that describes **some** possible world (Part 3). It does not mean that it describes the world **that actually happened**. Take the company example from Part 1. In the actual world, a reports to b. But if $W$ also contains a world in which no one reports to anyone, then a model with $I(\text{reports-to}) = \varnothing$ is also an intended model. That model fits the commitment but describes the current company wrongly.
>
> More fundamentally, the conceptualization itself may divide reality wrongly. If the decision rule disagrees with actual cooperation, the ontology does not fit reality even if $\text{Mod}(O) = I_K(L)$ holds perfectly. The following two are different evaluations.
>
> - **Is it logically faithful?**: does the ontology approximate the conceptualization well ($\text{Mod}(O)$ versus $I_K(L)$)
> - **Does it fit reality?**: does the conceptualization divide the actual world properly
>
> In other words, even when $\text{Mod}(O) = I_K(L)$, there is no guarantee that the conceptualization fits reality.
>
> Neuhaus (2018), whom we meet in Part 5, defines and separates these two evaluations.

# How is this checked in practice?

In practice, two methods are typically used for the two evaluations above.

- **Competency questions** (Grüninger & Fox (1995))
  Before building an ontology, first write down "the questions this ontology must be able to answer" (e.g., "Whom does a cooperate with?", "Who has the same goal but does not act?"). If the finished ontology cannot answer these questions, the vocabulary or axioms are insufficient. Just as distinguishing the two conceptualizations of cooperation required more vocabulary, the questions expose the gaps in the vocabulary.

- **OntoClean** (Guarino & Welty (2004))
  A method that checks, using meta-properties of concepts, whether a taxonomy has been built wrongly. For example, the property Person necessarily holds of its instances in every possible situation (rigid). Researcher, on the other hand, is a property every instance can lose (anti-rigid): a person can be a researcher and then stop. Based on such properties, OntoClean checks taxonomies with rules such as "a rigid concept must not be placed under an anti-rigid concept". If Person were placed under Researcher, a person who stops doing research would also have to leave Person, which is a contradiction.

Neither removes the loss; both are used to find where the loss came from. If a competency question is written wrongly or a meta-property is assigned wrongly, the check goes wrong with it.

# Next

This post looked at where the loss comes from through the lens of Guarino et al. (2009). Part 5 uses a different lens. Neuhaus (2018) criticizes the very definition this series has followed and defines an ontology anew. The third question of Studer's definition, "Why is 'shared' important?", is also covered there.

# References

- [Guarino, N., Oberle, D., & Staab, S. (2009). What Is an Ontology? In S. Staab & R. Studer (Eds.), *Handbook on Ontologies* (2nd ed., pp. 1–17). Springer.](https://doi.org/10.1007/978-3-540-92673-3_0)
- Guarino, N. (1998). Formal Ontology in Information Systems. In N. Guarino (Ed.), *Formal Ontology in Information Systems: Proceedings of FOIS'98* (pp. 3–15). IOS Press.
- [Neuhaus, F. (2018). What is an Ontology? arXiv:1810.09171.](https://arxiv.org/abs/1810.09171)
- [Grüninger, M., & Fox, M. S. (1995). The Role of Competency Questions in Enterprise Engineering. In A. Rolstadås (Ed.), *Benchmarking — Theory and Practice* (pp. 22–31). Springer.](https://doi.org/10.1007/978-0-387-34847-6_3)
- [Noy, N. F., & McGuinness, D. L. (2001). Ontology Development 101: A Guide to Creating Your First Ontology. Stanford Knowledge Systems Laboratory, KSL-01-05.](https://protege.stanford.edu/publications/ontology_development/ontology101-noy-mcguinness.html)
- [Guarino, N., & Welty, C. A. (2004). An Overview of OntoClean. In S. Staab & R. Studer (Eds.), *Handbook on Ontologies* (pp. 151–171). Springer.](https://doi.org/10.1007/978-3-540-24750-0_8)
