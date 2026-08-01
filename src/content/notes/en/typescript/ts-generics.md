---
# Recommended paths:
# - src/content/notes/ko/<field>/<slug>.md
# - src/content/notes/en/<field>/<slug>.md
title: "Generics are a connecting device, not a tightening one"
lang: "en"
translationKey: "parametric-polymorphism"
date: "2026-07-27"
# field: "web" | "game" | "programming-language" | "ai"
field: "programming-language"
category: "typescript"
series: "javascript/typescript"
# status: "draft" | "reading" | "implemented" | "stable"
status: "implemented"
summary: "Understanding generics as parametric polymorphism, and framing constraints — in set-theoretic terms — as a trade of what you buy for what you sell."
problem: "What did generics arrive to solve, and what exactly does a constraint like T extends X gain and lose?"
coreIdea: "Generics are the device that carries the caller's type through to the return value, and a constraint is a trade that cuts T's range to enlarge the intersection of operations usable in the body."
connection: "types as sets, parametricity, bounded quantification, variance"
tags: ["typescript", "javascript"]
---

# Parametric polymorphism and bounded quantification

## Problem

`any` disables static type checking. The problems this causes come in **two kinds**, and distinguishing them is the starting point of this post.

```ts
// (1) a value nobody knows
const data: any = JSON.parse(input);
data.foo.bar(); // passes without checking

// (2) a value the caller did know
function identity(x: any): any { return x; }
const s = identity("hello"); // s: any
```

(1) is a **checking failure**. Nobody knows the shape of `data`, yet any operation is permitted.

(2) is a different kind of problem. Whoever called `identity("hello")` clearly knew the argument was a `string`. But that information vanished on crossing the function boundary. This is a **transport failure**.

```
what the caller knows: "hello" is a string
        │
        │ crossing the function boundary
        ▼
what is known about the return value: any
```

The two problems have different causes, so they need different solutions. The solution to (1) is `unknown`; the solution to (2) is **generics**.

> How do we carry the type information available at the call site across the function boundary?

## 0. Overview

This post proceeds in the following order.

```
Parametric polymorphism  → what a generic is
Parametricity            → why the body can do nothing
Bounded quantification   → what a constraint buys and sells
Types as sets            → the mechanism behind that trade
```

## 1. Parametric polymorphism: taking a type as a parameter

The core of a generic is attaching **the same label** to the input and the output — think of it as treating a type as a kind of variable.

```ts
function identity<T>(x: T): T {
  return x;
}

const a = identity("hi"); // a: "hi"
const b = identity(10);   // b: 10
```

`T` is not a value but **a variable holding a type**. Taking a type as a parameter, just as one takes a value as a parameter, is called **parametric polymorphism**.

Written as a logical formula:

$$
\texttt{identity} : \forall T.\ T \rightarrow T
$$

"For every type $T$, take a $T$ and return a $T$." The function is prefixed with a **universal quantifier ($\forall$)**.

The difference from `any` becomes visible in comparison.

```ts
function identityAny(x: any): any { return x; }

const c = identity("hi");    // "hi"  — the known type survives
const d = identityAny("hi"); // any   — it evaporates at the boundary
```

A generic is not a device for strengthening checks; it is **a device for passing information through without losing it**.

## 2. Parametricity: the body is powerless in exchange

That `T` could be any type means, in the body, **nothing can be assumed** about `T`. You cannot arbitrarily treat `T` as a `number` or a `string`.

```ts
function bad<T>(x: T): T {
  console.log(x.length); // Error: Property 'length' does not exist on type 'T'
  return x;
}
```

`T` might be `string`, but it might also be `number`. The function must hold **for every T**, so only what all Ts have in common may be used. And what all types have in common is effectively nothing.

This property is called **parametricity**. It looks inconvenient, but it is also a powerful guarantee: essentially the only function satisfying the type `∀T. T → T` is the identity function. In other words, the type alone narrows down the behavior without looking at the implementation.

![The intersection of operations when T is unconstrained|520](generic-parametricity.svg "Each type's set of operations differs. When T covers every type, their intersection is nearly empty.")

## 3. Bounded quantification: restricting T's range

If nothing can be done in the body, there is no practical use. The function we actually want to write is this:

```ts
function longest<T>(x: T, y: T): T {
  return x.length >= y.length ? x : y; // Error
}
```

There are three options here.

```
(1) retreat to any        → back to a checking failure
(2) fix it to string (or a type with length)  → not reusable beyond the chosen type
(3) restrict T's possible range to types compatible with length
```

The approach in (3) offers the best extensibility.

```ts
function longest<T extends { length: number }>(x: T, y: T): T {
  return x.length >= y.length ? x : y; // OK
}

const s = longest("hello", "hi");    // s: string
const arr = longest([1, 2, 3], [4]); // arr: number[]

s.toUpperCase(); // string-specific operations are available too
```

`T extends X` is called **bounded quantification**.

$$
\texttt{longest} : \forall T \sqsubseteq \{\texttt{length}: \text{number}\}.\ (T, T) \rightarrow T
$$

It means "for every T under this upper bound." The body can now assume `length`, while the caller's concrete type is still carried through to the return value by the generic.

## 4. What this trade buys and sells

Adding a constraint to a generic moves the following two axes.

```ts
function f0<T>(x: T) {
  x.length;                    // Error — nothing can be assumed
}
f0("hi"); f0(10); f0({}); f0(null);          // caller: everything passes

function f1<T extends { length: number }>(x: T) {
  x.length;                    // OK
  x.toUpperCase();             // Error — string-only is still out
}
f1("hi"); f1([1, 2]); f1({ length: 3 });     // caller: only things with length
f1(10);                                       // Error

function f2<T extends string>(x: T) {
  x.toUpperCase(); x.slice(1); // OK — the whole string API
}
f2("hi");
f2([1, 2]);                                   // Error
```

Going down the list, **what the body can do grows and what the caller can pass shrinks**. Safety stays identical in all three cases.

| | What the body can do | Types it can accept |
|---|---|---|
| `<T>` | almost nothing | everything |
| `<T extends {length:number}>` | `length` | anything with length |
| `<T extends string>` | the whole string API | string |

![Range and operations move inversely with the level of constraint|520](generic-tradeoff.svg "The tighter the constraint, the smaller T's range and the more operations available in the body.")

## 5. Mechanism: a type is a set of values

The reason the two axes move in exactly opposite directions is explained by **types as sets** from the previous post.

There we reached this conclusion about union types:

$$
\text{types union, available operations intersect}
$$

The reason `toUpperCase()` was unavailable on `string | number` is that the available operations were the **intersection** of the two types'.

The same rule applies to generics.

$$
\text{operations available in the body} = \bigcap_{\tau \in \text{range}(T)} \text{ops}(\tau)
$$

| T's possible range | Intersection = what is usable |
|---|---|
| unconstrained `<T>` → every type | nothing |
| `T extends string \| number` | `toString()` only |
| `T extends {length:number}` | `length` |
| `T extends string` | the whole string API |

Checking it directly confirms this.

```ts
function h<T extends string | number>(x: T) {
  x.toString();     // OK — both have it
  x.toUpperCase();  // Error — number does not
}
```

So an unconstrained `<T>` is powerless because it amounts to "the union of every type," leaving the intersection empty.

And now it is clear why the two axes move in opposite directions. `T extends X` performs **only one action: cutting T's possible range**. That single cut produces both results at once.

```
T extends X  (cut the range down to under X)
        │
        ├─ everything left has X's members       → the body can use them
        │
        └─ the cut-away types cannot be passed in → the caller's freedom shrinks
```

<details>
<summary>My own take</summary>
This principle is not specific to generics. In the previous post I summarized the reason function parameters must be contravariant as "be generous in what you accept," and that has the same structure: the more broadly you accept, the less you can assume about the value.

Variance is this principle applied to **assignability judgments**, and generic constraints are the same principle applied to **the expressiveness of the body**. We learn them in different chapters, but I think the root is one.
</details>

## 6. Exercise

Consider how the type at each position below is determined, and which line will be an error.

```ts
function first<T extends { length: number }>(xs: T): T { return xs; }

const r1 = first("hello");
const r2 = first([1, 2, 3]);
const r3 = first({ length: 0, extra: true });
const r4 = first(42);

function g<T>(x: T) {
  if (typeof x === "string") {
    return x.toUpperCase();
  }
  return x;
}
```

## 7. Conclusion

```
Parametric polymorphism
→ A generic takes a type as a parameter. ∀T. T → T

Transport is the purpose
→ any loses the type the caller knew, at the boundary.
→ A generic binds input and output under the same name and preserves it.

Parametricity
→ In exchange, nothing can be assumed about T.
→ Constraints are not the purpose of generics; they are the price.

Bounded quantification
→ T extends X cuts T's range down under an upper bound.
→ It buys the body's ability and sells the caller's freedom. Safety is unaffected.

Types as sets
→ Operations available in the body = the intersection over the types in T's range.
→ Cutting the range enlarges the intersection. Two results of one cut.
```

In one sentence:

> A generic is a device that **connects** rather than tightens, and a constraint is a trade that cuts T's possible range to enlarge the intersection of operations usable in the body.

## Full code

The code in this post, collected into a single file. Lines expected to error carry `@ts-expect-error`, so you can check that the whole thing passes under `tsc --strict`.

```ts
// ── § Problem: the two problems with any ──────────────

const data: any = JSON.parse("{}");
data.foo.bar();

function identity<T>(x: T): T { return x; }
function identityAny(x: any): any { return x; }

const a = identity("hi");    // "hi"
const b = identity(10);      // 10
const c = identityAny("hi"); // any

// ── § Parametricity: the body is powerless ────────────

function bad<T>(x: T): T {
  // @ts-expect-error — T has no length
  console.log(x.length);
  return x;
}

// ── § Bounded quantification ──────────────────────────

function longest<T extends { length: number }>(x: T, y: T): T {
  return x.length >= y.length ? x : y;
}

const s = longest("hello", "hi");
const arr = longest([1, 2, 3], [4]);
s.toUpperCase();

// ── § Comparison by level of constraint ───────────────

function f0<T>(x: T) {
  // @ts-expect-error
  x.length;
}
f0("hi"); f0(10); f0({}); f0(null);

function f1<T extends { length: number }>(x: T) {
  x.length;
  // @ts-expect-error
  x.toUpperCase();
}
f1("hi"); f1([1, 2]); f1({ length: 3 });
// @ts-expect-error
f1(10);

function f2<T extends string>(x: T) {
  x.toUpperCase(); x.slice(1);
}
f2("hi");
// @ts-expect-error
f2([1, 2]);

// ── § Types as sets ───────────────────────────────────

function h<T extends string | number>(x: T) {
  x.toString();
  // @ts-expect-error
  x.toUpperCase();
}

// ── § Exercise ────────────────────────────────────────

function first<T extends { length: number }>(xs: T): T { return xs; }

const r1 = first("hello");
const r2 = first([1, 2, 3]);
const r3 = first({ length: 0, extra: true });
// @ts-expect-error
const r4 = first(42);

function g<T>(x: T) {
  if (typeof x === "string") {
    return x.toUpperCase();
  }
  return x;
}
```

## Connections

- Next question to check: when the type argument is omitted, as in `identity("hi")`, how does the compiler determine T?
