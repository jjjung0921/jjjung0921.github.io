---
# Recommended paths:
# - src/content/notes/ko/<field>/<slug>.md
# - src/content/notes/<field>/<slug>.md
# Folder names are authoring-only. The public URL uses the file name.
title: "[Idle Thoughts] What should I do?"
lang: "en"
translationKey: "what-sould-I-do-in-ai-era"
date: "2026-08-01"
# field: "web" | "game" | "programming-language" | "ai" | "blog"
field: "blog"
category: "Blog"
series: "Idle Thoughts"
# status: "draft" | "reading" | "implemented" | "stable"
status: "draft"
summary: "Sorting out my thoughts on what I should be doing in the age of generative AI."
problem: "With generative AI advancing, what is it that I should be doing? A reflective piece where I write down, without embellishment, what I have felt while working on my projects."
coreIdea: ""
connection: ""
tags: ["ai-era", "blog"]
---

# What role can I play as generative AI advances?

Rather than using this site purely as a tech blog or a CV, I want to use it as my own space — somewhere to sort out my thoughts or write something like a short piece of fiction.

Since this is my thinking written down as it comes, the structure may be lacking. Please bear with it.

## Where the worry started
Recently, wanting to do DDA research, I started studying Performative Prediction. PP was an entirely new field to me, so I began from scratch — and as I studied, a weakness I always feel resurfaced, and with it a low mood.

>[!warning] When I run into a concept I don't know while studying, I start digging into it deeply, and it takes far too long to start or make progress on the project.

With PP alone, it took about two weeks to study convexity, sensitivity, and smoothness of functions, use those to understand compact mappings, and connect all of it through the lens of optimization. **And even then, this was study aimed at intuitive understanding, not understanding through mathematically rigorous proof.**

Meanwhile, the arrival of generative AI has accelerated the pace of new technology worldwide. Looking at the friends around me, more and more people can realize an idea very quickly as long as they have one. Watching that, along with a feeling of falling behind, the following question came naturally.

>[!tip] Is the bottom-up approach — moving slowly while understanding the underlying principles — really right? Shouldn't top-down come first: building a portfolio by moving projects along quickly?

## My track record so far

It has been roughly two and a half years since I became interested in AI. My ultimate goal was **"designing AI models that adapt to the individual user."**

I thought this required a model capable of flexible self extension and pruning, and that the research field that could serve as the foundation was NAS (Neural Architecture Search).

I have read and studied NAS papers diligently every time, but if asked whether I have a project I could use when applying to a lab, my answer is **"no."**

To work out "why do I have no portfolio?", let me lay out my track record in chronological order.

| Period | Field / topic | What I did |
|---|---|---|
| Year 1 (2024) | AI Foundation | On leave from university; studied the foundations, from the basics of linear algebra through Attention and the Transformer |
| Year 2 (2025) | meta-learning, NAS | Returning to school cut my study time, but I set the goal above. Learned about meta-learning, understood the problems in NAS, and formalized it from a bi-level perspective |
| First half of this year (2026) | NAS → bi-level | On leave again. Organized NAS papers but could not find a research topic, so I looked for research in the broader field of bi-level optimization |
| Second half of this year (2026) | DDA, Performative Prediction | Intending to solve the DDA problem, I learned about PP while formalizing DDA from a bi-level and meta-learning perspective, and am studying it now |

Looking at that table, my track record so far has been one stretch of theoretical study after another. In other words, I have no experience writing code to solve an actual problem. The reasons are my philosophy of learning and my personality.

1. I don't move to the next step before understanding the fundamental mathematical or computational principles.
2. Fear of failure in a new challenge.

Because of the first, it took far too long to get through the Foundation study in year 1 and then through studying NAS and failing to find a research topic. I was also fixated on having to understand how `numpy` and `pytorch` work in memory, and so avoided using either library until I had studied that.

As a result I ended up short of anything to show others, and it took far too long to learn a new field and get comfortable with the libraries.

So I want to reconsider the following two things.

1. What is AI?
2. Now that AI agents are advancing, **how far does the scope of what I should study** extend, and **what abilities should I be building**?

## What is AI?

I define AI as **a capable "employee" and a search tool**.
