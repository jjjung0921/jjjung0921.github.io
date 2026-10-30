---
title: "Symbols Point to Concepts, Not Extensions"
lang: "en"
translationKey: "Ontology-Foundations-02-ontological-commitment"
date: "2026-10-26"
field: "ai"
category: "Ontology"
series: "Ontology Foundations"
order: 2
projects: []
status: "reading"
summary: "This post covers how to refer to the conceptualization of Part 1 with the symbols of a language. A model binds symbols to extensions, but then the problem of Part 1 reappears at the level of symbols. So we define ontological commitment K = (C, ℐ), which binds symbols to conceptual relations (intensions), and connect the two interpretations with I_w(P) = ℐ(P)(w)." # AI 제안 — 검토 필요
problem: "Does the symbol cooperates-with refer to the pairs currently cooperating, or to the concept of cooperation?"
coreIdea: "What a symbol should refer to is not the extension in the current world but the decision rule (intension) that fixes an extension for each world. Commitment does not erase W; it adds one more layer, a mapping from symbols to intensions." # AI 제안 — 검토 필요
connection: "Deciding what a class name in OWL refers to is a commitment. The axioms of Part 3 are the tool for imposing this commitment on other people's interpretations as well." # AI 제안 — 검토 필요
tags: ["ontology", "ontological commitment", "intension", "first-order logic", "model theory"]
---

# The moment we need symbols

In Part 1 we defined a conceptualization as $\mathbf{C} = (D, W, \mathcal{R})$. A relation $\rho$ was a function that returns an extension for each world state, and when one reporting line changed, what changed was the world, not the conceptualization.

But this conceptualization is still a structure in someone's head. To tell another person or system that "a and b cooperate", we need a symbol that refers to it. So suppose we introduce a symbol, `cooperates-with`.

A question arises here. Is there any guarantee that someone who does not know English will not read this symbol as the reporting relation (`reports-to`)? The symbol itself says nothing. In the end, the question is **what** we bind the symbol to. The list of pairs cooperating right now, or the concept of cooperation?

# The language $L$ and the vocabulary $V$

To deal with symbols, we first have to fix a language. In this series the language $L$ is a first-order logical language. The symbols of $L$ other than logical symbols such as $\forall$, $\land$, and $\rightarrow$, that is, the set of symbols we introduced to fit the domain, are called the vocabulary $V$.

$V$ contains two kinds of symbols.

- **Constant symbols**: names of single entities. Example: $a$, $b$
- **Predicate symbols**: names of relations among entities. Example: $\text{Person}$ (unary), $\text{cooperates-with}$, $\text{reports-to}$ (binary)

In this post, $P$ is a placeholder for one $n$-ary predicate symbol in $V$. If we put $\text{Person}$ in place of $P$, then $n=1$; if we put $\text{reports-to}$, then $n=2$.

Let us separate the levels here. The **symbol** $\text{reports-to}$ lives on the side of the language $L$, while the **conceptual relation** $\text{reports-to}^2$ from Part 1 lives on the side of the conceptualization $\mathbf{C}$. They only share a name; they are different objects. This post is about how to connect the two.

# Binding symbols to extensions: models

In logic, the usual way to give symbols a meaning is a model. We attach an interpretation function $I$ to the extensional relational structure $S = (D, R)$ from Part 1.

$$
M = (S, I), \qquad I: V \rightarrow D \cup R
$$

$I$ sends constant symbols to entities in $D$, and $n$-ary predicate symbols to $n$-ary relations in $R$, that is, sets of tuples. Let us look at the company example.

- $I(\text{cooperates-with}) = \{(a,b), (b,c)\}$
- $I(\text{reports-to}) = \{(a,b), (b,c)\}$

There is a reason to write the structure $S$ and the interpretation $I$ separately as a tuple. With the same $S$, a different $I$ can change whether the same sentence is true or false. Let $D = \{a, b, c\}$ and $R = \{\{a,b,c\}, \{a,b\}\}$.

- If $I_1(\text{Person}) = \{a,b,c\}$ and $I_1(\text{Researcher}) = \{a,b\}$, then $\forall x\,(\text{Researcher}(x) \rightarrow \text{Person}(x))$ is true.
- If $I_2(\text{Person}) = \{a,b\}$ and $I_2(\text{Researcher}) = \{a,b,c\}$, the same sentence is false.

In other words, the mere existence of the relations does not fix which symbol refers to which relation. The meaning of a symbol is fixed by $I$.

# The problem of Part 1 comes back at the level of symbols

Now suppose that a newly starts reporting to d. The interpretation of the symbol $\text{reports-to}$ changes as follows.

$$
I'(\text{reports-to}) = I(\text{reports-to}) \cup \{(a,d)\}
$$

Then $M = (S, I)$ and $M' = (S', I')$ are different models. Only one reporting line changed, yet what the symbol $\text{reports-to}$ refers to has changed. This has the same shape as in Part 1, where a single tuple split the conceptualization in two.

In other words, as long as we bind symbols to extensions, the meaning of a symbol depends on a single world state. But what we mean when we write `reports-to` is not "the list of reporting pairs at this moment"; it is a decision rule that tells who reports to whom. In the terms of Part 1, it is $\rho$.

Part 1 deferred to this post the question of "why we should treat meaning as a function over possible worlds at all". The answer is here. That is, for the meaning of a symbol not to shift every time the world changes, we must bind the symbol not to the extension of one world but to **a function that fixes an extension in every possible world**. Treating meaning this way, as a function from worlds to extensions ($I$, the intension), is the approach that began with Carnap and continued into Montague semantics.

# Binding symbols to concepts: ontological commitment

So we change the codomain of the interpretation function. We attach a new interpretation function $\mathcal{I}$ to the conceptualization $\mathbf{C} = (D, W, \mathcal{R})$ of Part 1.

$$
K = (\mathbf{C}, \mathcal{I}), \qquad \mathcal{I}: V \rightarrow D \cup \mathcal{R}
$$

$\mathcal{I}$ sends constant symbols to entities in $D$, and $n$-ary predicate symbols to $n$-ary conceptual relations $\rho$ in $\mathcal{R}$. It has the same shape as the model's $I$, but predicate symbols go somewhere else. The elements of $R$ are sets of tuples, while the elements of $\mathcal{R}$ are functions.

- $\mathcal{I}(\text{Person}) = \text{Person}^1$
- $\mathcal{I}(\text{cooperates-with}) = \text{cooperates-with}^2$
- $\mathcal{I}(\text{reports-to}) = \text{reports-to}^2$

Assigning one conceptual relation from Part 1 to each symbol of the vocabulary like this is called **ontological commitment**. It means that the language $L$ commits to the conceptualization $\mathbf{C}$. Strictly speaking, what commits is not the language but the person (agent) who uses it. A commitment describes how a person who has adopted a certain conceptualization uses the language competently.

Now, even when a starts reporting to d, $\mathcal{I}(\text{reports-to}) = \text{reports-to}^2$ stays the same. What the symbol refers to is the decision rule; the only thing that changed is the value that rule produces in this world.

# The equation connecting the two interpretations

How are the model's $I$ and the commitment's $\mathcal{I}$ connected? It becomes clear if we take one predicate symbol $P$ and split the step in two.

$$
\mathcal{I}(P) = \rho_P
$$

First, $\mathcal{I}$ sends the symbol $P$ to the conceptual relation $\rho_P$. This is the intension of $P$.

$$
I_w(P) = \mathcal{I}(P)(w) = \rho_P(w) \subseteq D^n
$$

Next, once we pick a world $w$, $\rho_P$ produces the extension $\rho_P(w)$ in that world. This is the extensional interpretation $I_w(P)$ of $P$ in world $w$. A constant symbol $c$ is interpreted as $I_w(c) = \mathcal{I}(c) \in D$ regardless of the world. This equation spells out the definitions of the two interpretations by joining them.

For reports-to, it looks like this.

- $\mathcal{I}(\text{reports-to}) = \text{reports-to}^2$
- $I_{w_1}(\text{reports-to}) = \text{reports-to}^2(w_1) = \{\dots, (a,b), (b,c), \dots\}$
- $I_{w_2}(\text{reports-to}) = \text{reports-to}^2(w_2) = \{\dots, (a,b), (b,c), (a,d), \dots\}$

In other words, one commitment fixes one model for each world. Once a world is chosen, we can go down from the commitment to a model. The difference between the two fits in one line.

$$
\text{Extensional: } P \mapsto \rho_P(w) \qquad \text{Intensional: } P \mapsto \rho_P
$$

The opposite direction, recovering the commitment from the models alone, is a different question. It is covered in Part 4.

> [!interpretation] My interpretation: Is commitment an abstraction that erases W?
> When I first read this definition, I understood it like this: commitment takes a conceptualization that varies with the world state and abstracts it once more into relations that have nothing to do with worlds.
>
> On reflection, that was not the case. If we spell out $K = ((D, W, \mathcal{R}), \mathcal{I})$, $W$ is still inside. Commitment does not erase anything from the conceptualization; it adds one more layer, the mapping from symbols to intensions.
>
> So the claim "commitment is independent of the world state" is only true in a narrow sense. It means that no single world fixes the meaning, not that the meaning has nothing to do with worlds. What stays the same when the world changes are $\mathcal{I}$ and $\rho_P$; what changes is $\rho_P(w)$.

> [!interpretation] My interpretation: The intensional interpretation function narrows a word's mapping
> Taken on its own, a symbol has too many places to go. An $n$-ary predicate symbol $P$ can be interpreted, depending on the model, as any subset of $D^n$. That is, the candidates for $I(P)$ are all of $2^{D^n}$. Nothing prevents `cooperates-with` from being interpreted as the extension of the reporting relation.
>
> $\mathcal{I}$ narrows these candidates. Once $\mathcal{I}(P) = \rho_P$ is fixed, the extension $P$ can have in any world is one of the $\rho_P(w)$. The candidates shrink from $2^{D^n}$ to $\{\rho_P(w) \mid w \in W\}$.
>
> So I read the intensional interpretation function as a device that narrows a word's mapping. It narrows a mapping that could send a symbol to any extension at all down to one that sends it only to the extensions the concept $\rho_P$ allows. When we look at several symbols together, one more condition is added: all symbols must be evaluated in the same world $w$.
>
> However, this narrowing still happens only in the head of the person who fixed the commitment. To impose the same narrowing on other people's interpretations, we need axioms.

# The remaining problem: commitment is still in someone's head

With commitment, we fixed which concept each symbol refers to. But this $\mathcal{I}$ is still in the head of the person who fixed it. There is no way to show my $\mathcal{I}$ as it is to someone who reads `cooperates-with` as the reporting relation. The symbols of a logical language can, by nature, be interpreted in any number of ways.

Writing out the conceptualization in our head in full, that is, listing the extensions of every relation in every possible world, is impossible because of the size of $W$ we saw in Part 1. The remaining path is to constrain the interpretation of symbols with axioms. A bundle of axioms that keeps the intended interpretations and filters out the unintended ones is an ontology. This is covered in Part 3.

# Appendix: order in logic

The "order" in first-order logic is determined by **what we can quantify over ($\forall$, $\exists$)**.

- **Propositional logic**: no quantification. Propositions are handled as wholes, as in $p \land q$.
- **First-order logic**: quantification only over individual variables. Example: $\forall x\,(\text{Researcher}(x) \rightarrow \text{Person}(x))$. $x$ ranges over the entities of $D$.
- **Second-order logic**: quantification over predicates (relations) themselves as well. Example: $\forall X\,(X(a) \rightarrow X(b))$ means "b has every property a has". $X$ ranges not over entities but over properties.

There are three points that are easy to confuse while reading this post.

1. **Arity is not order.** Even with a binary relation like $\text{reports-to}$, if what we quantify over are entities, the logic is first-order. The $n$ in $\rho^n$ or in "$n$-ary predicate" is the number of places in the relation (arity), not the order of the logic.

   For example, compare the following two sentences.

   - $\forall x\,\forall y\,(\text{reports-to}(x,y) \rightarrow \neg\,\text{reports-to}(y,x))$: "If a reports to b, then b does not report to a." It uses a binary relation, but the $x$ and $y$ bound by $\forall$ are entities. So it is **first-order**.
   - $\exists X\,(X(a) \land X(b))$: "There is a property that a and b share." $X$ is unary, but $\exists$ binds the predicate $X$ itself. So it is **second-order**.

   That is, a relation with many places can be first-order, and a unary one can be second-order. What fixes the order is what comes right after $\forall$ or $\exists$.

2. **Being intensional does not make a logic higher-order.** Even though $\mathcal{I}$ maps predicate symbols to functions $\rho$, what we quantify over inside the language $L$ is still entities. Whether a logic is first-order is a question of what $L$ quantifies over; extensional versus intensional is a question of what we map the symbols to.

   Let us interpret the same sentence $\varphi = \forall x\,(\text{Researcher}(x) \rightarrow \text{Person}(x))$ in two ways.

   - Model $M$: $I(\text{Researcher}) = \{a, b\}$, $I(\text{Person}) = \{a, b, c, d\}$. With these two sets, we check the entities $x$ of $D$ one by one.
   - Commitment $K$: $\mathcal{I}(\text{Researcher}) = \text{Researcher}^1$ is a function. Once we pick a world $w$, we get the set $\text{Researcher}^1(w)$, and from there we check the entities $x$ one by one exactly as with the model.

   In both cases, the only thing bound by $\forall$ inside $\varphi$ is $x$. What differs is whether the symbol $\text{Researcher}$ is sent to a set or to a function, and this mapping is fixed outside $L$. If we had put $\forall$ on a predicate position inside $L$, as in $\forall X\,(X(a) \rightarrow X(b))$, then the logic would be second-order.

3. **Interpretation functions are not formulas of $L$.** $I$ and $\mathcal{I}$, and statements such as "the sentence $\varphi$ is true in the model $M$ ($M \models \varphi$)", are not sentences written inside $L$. They belong to the metalanguage that describes $L$ from the outside. When this post says "for every predicate symbol $P$", that too is a statement in the metalanguage, not second-order quantification inside $L$.

   Separating the two looks like this.

   | Sentences in $L$ (object language) | Sentences about $L$ (metalanguage) |
   |---|---|
   | $\forall x\,(\text{Researcher}(x) \rightarrow \text{Person}(x))$ | $M \models \forall x\,(\text{Researcher}(x) \rightarrow \text{Person}(x))$ |
   | $\text{reports-to}(a, b)$ | $I(\text{reports-to}) = \{(a,b), (b,c)\}$ |
   | | "For every predicate symbol $P$, $\mathcal{I}(P) \in \mathcal{R}$" |

   The left column consists of sentences written only with the symbols of $L$. The right column says from the outside what those sentences or symbols mean, or whether they are true. In programming terms, `x = 3` is Python code, while "the type of `x` in this code is `int`" is a sentence about Python. The condition in my interpretation above, "all symbols must be evaluated in the same world $w$", is also on the right side, that is, a statement in the metalanguage.

# References

- [Guarino, N., Oberle, D., & Staab, S. (2009). What Is an Ontology? In S. Staab & R. Studer (Eds.), *Handbook on Ontologies* (2nd ed., pp. 1–17). Springer.](https://doi.org/10.1007/978-3-540-92673-3_0)
- Carnap, R. (1956). *Meaning and Necessity: A Study in Semantics and Modal Logic* (2nd ed.). The University of Chicago Press.
- Dowty, D. R., Wall, R. E., & Peters, S. (1981). *Introduction to Montague Semantics*. D. Reidel.
