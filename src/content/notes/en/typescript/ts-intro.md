---
# Recommended paths:
# - src/content/notes/ko/<field>/<slug>.md
# - src/content/notes/en/<field>/<slug>.md
title: "Introduction to TypeScript"
lang: "en"
translationKey: "introduction-to-typescript"
date: "2026-07-13"
# field: "web" | "game" | "programming-language" | "ai"
field: "programming-language"
category: "typescript"
series: "javascript/typescript"
# status: "draft" | "reading" | "implemented" | "stable"
status: "implemented"
summary: "Compares JavaScript's dynamic typing with TypeScript's static type checking pipeline."
problem: "When do JavaScript's type-related failures surface, and how does TypeScript diagnose them before execution?"
coreIdea: "TypeScript adds a static type-checking layer on top of JavaScript and emits JavaScript with the type information erased."
connection: "JavaScript execution model, static type systems, TypeScript compiler architecture"
tags: ["typescript", "javascript"]
---

# Introduction to TypeScript

## Problem

While mentoring frontend development for the **14th cohort of LikeLion**, I added a new TypeScript session. This post covers two topics:
1. What kinds of problems can arise in plain JavaScript?
2. A brief overview of how TypeScript addresses them.

As of 2026/07/13 the dedicated JavaScript posts have not been written yet, but they will be added later, so this post assumes familiarity with JS.

## 0. What was the problem with JS?

> JS is a <strong>dynamically typed language</strong>.

At a high level, JS execution looks like this:

```
JavaScript Source Code
→ Parse
→ Scope / Binding Preparation
→ Runtime Execution
→ Expression Evaluation
   └─ perform property access / function call /
      operator application / coercion
      depending on actual value types
→ Result or Runtime Error
```

In this pipeline, **binding establishes, within a given scope, the relationship between identifiers and the variables, functions, and parameters they refer to**.

Then, during **runtime execution, declarations, assignments, and function calls run, initializing bindings or updating them with new values**.

During **expression evaluation, property access, function calls, operator application, and implicit type coercion are performed against actual values**. When an operation cannot be performed, **an exception may be thrown**.

JavaScript has no static type-checking phase that inspects how values are used after binding but before actual execution. As a result, an invalid use of a value may only surface when the expression is evaluated against a real runtime value.

For example, calling a function like `toUpperCase` on a value holding a Number primitive raises an error, because that function cannot be called on that type.

```js
const a = 10;
a.toUpperCase() //TypeError: a.toUpperCase is not a function
```
TypeScript emerged to **statically model** the possible shapes of runtime values and how they are used, diagnosing some classes of errors before the code ever runs.

## 1. Enter TypeScript

As mentioned above, TypeScript is a language designed to model the shapes of runtime values and use that model to catch, ahead of time, some of the problems that could occur during "Expression Evaluation".

Its pipeline looks like this:
```
TypeScript Source Code
→ Parse
→ Bind
→ Type Check
→ Transform
→ Emit
→ JavaScript Source Code
```

With the added **Type Check** phase — a static type-checking step — some type-related errors can be caught at compile time without ever running the program.

```ts
a = 10;
a.toUpperCase() //Property 'toUpperCase' does not exist on type '10'.
```

In a typical TypeScript compilation, type information is erased and **JavaScript source code is emitted**. The generated JavaScript then runs in a JavaScript runtime such as a browser or Node.js.

## Connection

- Next question to explore: how does TypeScript's static type checking actually work on top of JavaScript?
