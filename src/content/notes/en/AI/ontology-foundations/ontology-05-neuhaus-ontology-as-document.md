---
title: "An Ontology Is a Document: The Alternative Definition of Neuhaus (2018)" # AI 제안 — 검토 필요
lang: "en"
translationKey: "Ontology-Foundations-05-neuhaus-ontology-as-document"
date: "2026-10-30"
field: "ai"
category: "Ontology"
series: "Ontology Foundations"
order: 5
projects: []
status: "reading"
summary: "This post starts from the examples of Neuhaus (2018), where theories with the same axioms but different vocabularies and annotations are different ontologies. It lays out the definition of an ontology as a document that contains a vocabulary, annotations and a logical theory and is realized by several versions, explains why sharing is not needed in the definition, and compares this lens with that of Guarino et al. (2009)." # AI 제안 — 검토 필요
problem: "If the axioms are the same, is it the same ontology?"
coreIdea: "The meaning of an ontology is fixed not by its axioms alone but by its vocabulary and annotations together with them. An ontology is therefore not a set of axioms but a document that lets users work out the intended interpretation, and it is realized by several versions." # AI 제안 — 검토 필요
connection: "When building jobs.ttl, this is the reason to manage rdfs:label and rdfs:comment with the same weight as the axioms and to check for mismatches between annotations and axioms. Part 6 applies both lenses to jobs.ttl." # AI 제안 — 검토 필요
tags: ["ontology", "annotation", "ontology versioning", "conceptualism", "realism"]
---

# What Part 4 left

Parts 1 to 4 used the formalization of Guarino et al. (2009) as their lens. A conceptualization is a structure of functions from worlds to extensions, and an ontology is a set of axioms that approximates it. Through this lens Part 4 found two limits. Even with perfect axioms, the conceptualization cannot be recovered from the models alone, and being an intended model does not guarantee matching reality.

This post changes the point of view. Neuhaus (2018) criticizes the very definition this series has followed and defines an ontology anew. The question to start from is this: if the axioms are the same, is it the same ontology?

# Same axioms, different ontologies

Let us begin with the example Neuhaus (2018) gives: four short theories written in OWL.

```text
(a) Class: P        DisjointWith: R
(b) Class: Dog      DisjointWith: GermanShepherd
(c) Class: Biolgy   DisjointWith: Chenistry
(d) Class: Biology  DisjointWith: Chemistry
```

From the logic alone, the four cannot be told apart. If there is an interpretation that satisfies one of them, an interpretation of exactly the same shape with only the names changed (`Class: x DisjointWith: y`) satisfies the others. In the terms of Part 3, the four theories filter models of the same shape.

As ontologies, however, the four are completely different.

- (a) is a logical theory, but from the document alone we cannot tell which domain it is about. Neuhaus (2018) therefore does not consider (a) an ontology. Under the definition of Guarino et al. (2009) it depends on which conceptualization the author committed to, but that commitment does not show in the text.
- (b) is an ontology about dogs, and its claim is wrong. A German Shepherd is a dog.
- (c) and (d) are ontologies about the relation between two disciplines, and they make the same claim about the same domain. (c) only has spelling mistakes.

Logically, the relation of (d) to (b) is exactly the same as its relation to (c). Yet we know that (d) and (c) talk about the same domain and that (d) and (b) talk about different ones. This distinction does not come from the axioms. It comes from **how the vocabulary was chosen**. The moment natural-language words are used as the vocabulary, what the theory is about, that is, its intended interpretation, is fixed.

The company ontology of Part 3 is no different. $\text{Manager}(x) \rightarrow \neg\,\text{Researcher}(x)$ and $P(x) \rightarrow \neg\,R(x)$ are the same axiom to a reasoner. The only thing that separates them is the **names** attached to the symbols.

# What annotations do

Besides the vocabulary, there is one more tool that fixes the intended interpretation: annotations. Neuhaus (2018) takes annotations very broadly. They include everything put into an ontology to explain its vocabulary or axioms: natural-language definitions, explanations, comments, examples, references, links and even pictures.

```text
Class: P   Annotations: rdfs:label "Dog"             DisjointWith: R
Class: R   Annotations: rdfs:label "German Shepherd"
```

The axioms are the same as in (a). Yet once the labels are attached, this theory becomes an ontology about dogs. So even when the vocabulary consists of meaningless symbols, annotations alone can establish the intended interpretation.

Annotations do not always carry the same kind of information. Neuhaus (2018) separates two kinds.

- **Assertive annotations** assert propositions that are true of the domain. For example, a warning that "this class material requires parental consent" is a claim about the domain.
- **Other annotations**: attaching a new label asserts nothing. Metadata such as the author is a claim, but a claim about the ontology itself rather than about the domain.

Axioms can only transcribe the content of assertive annotations, and in practice they often cannot transcribe even all of that, because the vocabulary would have to grow too much or the logical language lacks the expressive power. So the axioms of an ontology reflect only part of the information carried by its annotations. Viewing an ontology only as a set of axioms misses much of the information in it.

Annotations and axioms can also disagree.

```text
Class: Dog  DisjointWith: GermanShepherd
            Annotations: rdfs:comment "German Shepherd is a popular breed of dog"
```

The comment says a German Shepherd is a dog, while the axiom says the two do not overlap. Looking at the axioms alone there is no contradiction, so an OWL reasoner cannot find this problem. Neuhaus (2018) calls this a mismatch between the annotations and the logical theory.

# Why the existing definitions cannot explain this

Neuhaus (2018) explains what makes a definition good or bad with the inch. In 14th-century England an inch was the length of three grains of barley. A definition close to today's standard, an inch defined by the distance light travels in a vacuum in a fixed time, would have been more precise. But in a society without precise clocks nobody could have used that definition. People would have kept using the inch as they already knew it.

For a definition to be useful, the words that define must be better understood than the word being defined. Neuhaus (2018) argues that the Gruber-style definitions, "a specification of a conceptualization", fail here. "Conceptualization" is murkier than "ontology". So these definitions only make us feel that something has been explained, without any explanatory power.

In this criticism, Guarino et al. (2009) is named as a notable exception, because it defines conceptualizations with a formal theory. Even so, Neuhaus (2018) points out five problems.

- What "approximates" means is not defined. This is the same spot where Part 3 read $\approx$ only as "as close as possible".
- Because it identifies an ontology with a set of axioms, it cannot explain the role of choosing the vocabulary or of annotations. The four theories above are exactly such a case.
- For the same reason, it cannot explain how an ontology changes over time.
- It assumes that a conceptualization is shared by several people.
- Identifying conceptualizations with intensional first-order structures leads to technical and philosophical problems.

# The definition of Neuhaus: an ontology is a document

Put in plain words, the definition of Neuhaus (2018) is this.

> An ontology of a domain is a **document** that contains (1) a vocabulary describing the domain, (2) annotations that explain the vocabulary, and (3) a logical theory about the vocabulary (axioms and definitions). Together, these three let a user who knows how to work with the ontology figure out its intended interpretation.

The key parts are as follows.

- **Annotated logical theory** $\langle V, \Gamma, \text{Anno}, \mathcal{L} \rangle$: a bundle of a vocabulary $V$, a set of axioms $\Gamma$ over that vocabulary, a set of annotations $\text{Anno}$, and a logic $\mathcal{L}$. The logic is not fixed to OWL or first-order logic.
- **Intended interpretation**: a map that sends the axioms and assertive annotations to **propositions about the domain**. This is where it differs from Guarino et al. (2009), in which the intended interpretation was a set of models. The propositions an ontology asserts are the union of the propositions its annotations assert and the propositions its axioms entail.
- **Ontology version**: one edition of a document that specifies one annotated logical theory. The vocabulary, annotations and axioms together must let the reader work out the intended interpretation.
- **Ontology**: a document realized by several ontology versions. The versions form a network connected by relations such as adding axioms, deleting annotations, fixing spelling, translating annotations, or translating from OWL into first-order logic.

Seen this way, the phenomena above are explained. (c) and (d) assert the same propositions, so they are two versions of the same ontology. The labeled P/R theory and (b) can assert the same propositions even though their axioms look different. The mismatch between annotations and axioms is defined as the case where the propositions asserted by the two sides become contradictory when combined.

# Sharing is not needed

The third question in Studer's definition was "Why is 'shared' of importance?" The answer of Neuhaus (2018) is that sharing does not need to be in the definition. There are two reasons.

1. If a conceptualization is a mental representation built from experience, nobody but its owner can access it. It literally cannot be shared.
2. Large ontologies are built through a division of labor. The example of Neuhaus (2018) is a phone manufacturer. Experts in each field take on design, parts, assembly, and repair and recycling. The designer knows little about the assembly plan, and the person in charge of recycling knows little about the functional specifications of the parts. Nobody's conceptualization covers the whole, and the finished ontology contains more than any single person.

Then why can they still build it together? Neuhaus (2018) treats a conceptualization by the judgments it shows from the outside instead of looking inside it. That is, it does not define what a conceptualization is made of. It looks only at how a person who has adopted that conceptualization answers when given a situation and a proposition: true, false, or cannot judge. This is called the behavioral profile of the conceptualization.

Then we can define what it means for an ontology to specify the conceptualizations of several people together. No proposition the ontology asserts conflicts with anyone's judgment, and each proposition is true in the judgment of at least one person. For propositions on which people disagree, the ontology simply takes no position.

> [!interpretation] My interpretation: A joint specification is closer to a PR review than to a majority vote
> At first I thought it resembled Bitcoin, since a common record is built from many people's judgments without a central authority. But the way agreement is reached is almost the opposite. Bitcoin is a majority vote. The chain followed by the majority of hash power wins, minority opinions are ignored, and in the end everyone holds the same ledger. The joint specification of Neuhaus (2018) is closer to a veto. If even one person judges a proposition false, it cannot go in. Only the document is shared, and each person's conceptualization may stay different to the end. There is no mechanism against malicious participants either. It assumes that experts judge honestly.
>
> It is closer to a pull request review on GitHub.
>
> - The CODEOWNERS of the area approve → one expert in the field vouches that it is true in every situation they deal with.
> - Nobody requests changes → nobody judges it false.
> - Other reviewers skip an area they do not know well → other people may be unable to judge.
> - If opinions split, the PR is not merged or its scope is reduced → propositions people disagree on are left out or weakened.
>
> So sharing becomes not the strong condition "everyone has the same conceptualization" but the weak condition "include only what one person vouches for and nobody objects to".
>
> Having set up this analogy, I wondered "wouldn't a majority vote be wiser?" and "couldn't we split authority like roles in AWS?", so I looked into it. If interconnected propositions are decided one by one by majority vote, the group's conclusion can be contradictory even when every individual's judgments are consistent (List & Pettit, 2002), and the same happens with ontologies (Porello & Endriss, 2014). Even if decision rights are split by field, conflicts arise when the propositions being judged are logically tied together (Dietrich & List, 2008). So in practice people combine module separation, joint coordination of propositions that cut across the axes, and consistency checks with a reasoner. Part 6 covers this in detail after sorting out the TBox and the ABox.

# The two evaluations of Part 4 become formal

In my interpretation in Part 4, I split "Is it logically faithful?" and "Does it match reality?" into two separate evaluations. Neuhaus (2018) defines each of them.

1. **Is the specification correct?** Do the propositions the ontology asserts avoid conflicting with the judgments of the conceptualization?
2. **Is the conceptualization correct?** Do the things the conceptualization judges true or false avoid conflicting with the actual world?

It then proves as a theorem that if both hold, that is, if a correct conceptualization is correctly specified, the ontology is also correct about reality. This theorem connects the position that puts conceptualizations at the center (conceptualism) with the position that ontologies should represent reality (realism). There is still no way to remove the loss all at once. But we can check separately whether a loss came from the specification or from the conceptualization.

# Comparing the two lenses

| | Guarino et al. (2009) | Neuhaus (2018) |
|---|---|---|
| Conceptualization | $\mathbf{C} = (D, W, \mathcal{R})$, a structure of functions from worlds to extensions | Its inside is not defined. Judgments on situations and propositions (behavioral profile) |
| Ontology | A set of axioms $O$, $\text{Mod}(O) \approx I_K(L)$ | A document realized by several versions. Each version specifies an annotated logical theory |
| What fixes meaning | Axioms (and the commitment $\mathcal{I}$) | Vocabulary + annotations + axioms |
| Intended interpretation | The set of models that each describe one world | A map sending axioms and annotations to propositions |
| Sharing | Assumed | Not needed |
| What it shows well | What a reasoner does, how axioms filter models | How people read, revise and build an ontology together |

Neither definition is simply wrong. The lens of Guarino et al. (2009) shows precisely what axioms do, and the lens of Neuhaus (2018) shows the things outside the axioms that carry meaning.

> [!interpretation] My interpretation: Since LLMs, machines read annotations too
> When Neuhaus (2018) came out in October 2018, GPT-1 and BERT had just been released, and language models were not yet used for ontology work. The paper does not mention language models either. This definition was not about something new technology had made possible. It was an attempt to explain the practice of ontology engineering: annotations carry more information than axioms, the same ontology is managed in several languages and versions, and many people build it through a division of labor.
>
> Seen today, though, the definition has become even more useful. In 2018 annotations were the part that reasoners ignored and only people read. Now LLMs read `rdfs:comment` and natural-language definitions. The structure Neuhaus (2018) named as the essence of an ontology, "the vocabulary, annotations and axioms together convey the intended interpretation", now applies not only to people but also to machines. If we use a reasoner that sees only the axioms together with an LLM that also reads the annotations, mismatches between annotations and axioms are no longer a problem only for people.
>
> However, an LLM's reading has no formal guarantee like a reasoner's, so it can only assist the checks people used to do, not replace them.

# Next

Part 6 applies both lenses to jobs.ttl together. It looks at how the work of axioms filtering models, as built up in Part 3 (Guarino et al. (2009)), and the work of vocabulary and annotations conveying the intended interpretation (Neuhaus (2018)) divide up in an actual OWL file.

# References

- [Neuhaus, F. (2018). What is an Ontology? arXiv:1810.09171.](https://arxiv.org/abs/1810.09171)
- [Guarino, N., Oberle, D., & Staab, S. (2009). What Is an Ontology? In S. Staab & R. Studer (Eds.), *Handbook on Ontologies* (2nd ed., pp. 1–17). Springer.](https://doi.org/10.1007/978-3-540-92673-3_0)
- [Gruber, T. R. (1993). A Translation Approach to Portable Ontology Specifications. *Knowledge Acquisition*, 5(2), 199–220.](https://doi.org/10.1006/knac.1993.1008)
- [List, C., & Pettit, P. (2002). Aggregating Sets of Judgments: An Impossibility Result. *Economics and Philosophy*, 18(1), 89–110.](https://researchonline.lse.ac.uk/id/eprint/704)
- [Porello, D., & Endriss, U. (2014). Ontology Merging as Social Choice: Judgment Aggregation under the Open World Assumption. *Journal of Logic and Computation*, 24, 1229–1249.](https://doi.org/10.1093/logcom/exs056)
- [Dietrich, F., & List, C. (2008). A Liberal Paradox for Judgment Aggregation. *Social Choice and Welfare*, 31(1), 59–78.](https://doi.org/10.1007/s00355-007-0263-y)
