---
# Recommended paths:
# - src/content/notes/ko/<field>/<slug>.md
# - src/content/notes/en/<field>/<slug>.md
title: "How TypeScript Statically Models JavaScript"
lang: "en"
translationKey: "type-checking-in-typescript"
date: "2026-07-13"
# field: "web" | "game" | "programming-language" | "ai"
field: "programming-language"
category: "typescript"
series: "javascript/typescript"
# status: "draft" | "reading" | "implemented" | "stable"
status: "draft"
summary: "Explores the principles behind TypeScript's static type checking, built on a JavaScript foundation."
problem: "What are the principles behind TypeScript's static type checking?"
coreIdea: ""
connection: ""
tags: ["typescript", "javascript"]
---

# TypeScript's Static Modeling

## Problem

The previous post explained that JavaScript generally has no static type-checking phase before execution, and that TypeScript adds the following pipeline:

```
TypeScript Source Code
→ Parse
→ Bind
→ Type Check
→ Transform
→ Emit
→ JavaScript Source Code
→ Runtime Execution
```

But one question remains:

> What exactly does TypeScript's Type Check inspect in a JavaScript program?

Looking at the JS file compiled from TS, none of the types we declared in TS remain.

In other words, TS does not work by adding new type objects to the JS runtime. Instead, it statically approximates the values each expression could take when the program runs, and checks whether the operations we attempt on those values are safe.

To understand this process, we break it down into six steps:

```
Type erasure
→ Structural typing
→ Types as sets
→ Type inference
→ Control-flow analysis
→ Soundness boundaries
```

These six steps answer the following six questions:

1. Do types survive at runtime?
2. What determines compatibility between two types?
3. What does a type actually mean?
4. If we don't write types explicitly, how does the compiler figure them out?
5. How does a type change as code passes through conditionals?
6. How far can TypeScript's checking be trusted?

## 0. Overview
In TypeScript, types come into being through the following process:
```
JavaScript runtime values
        │
        │ static abstraction
        ▼
TypeScript types
        │
        │ type checking
        ▼
Potentially invalid operations
```

A type in TS is not a JS runtime value, nor a runtime type itself.

Rather, it should be understood as a **static abstraction** over the values an expression could possibly hold at runtime, built to detect potentially invalid operations.

For example, the runtime value of the following variable is the number 10, which has the number type.
```ts
const value:number = 10;
```
The TS `number` above is not a separate runtime object. It is merely static information saying that `value` holds one of the possible number values.

## 1. Type Erasure: TS types do not survive at runtime
Consider the following TS code.
```ts
function greet(name: string): string {
  return `Hello, ${name}`;
}
```
Compiling it to JS produces:

```js
function greet(name) {
  return `Hello, ${name}`;
}
```
The type we defined in TS, `string`, did not survive into JS. The type annotations we write in TS are used only in the following phase:
```
TypeScript Source
        │
        ├─ Is name a string?
        ├─ Is the return value a string?
        │
        ▼
Type Check
```
The official TS documentation defines this concept as **Erased Types**: type annotations are not part of JS, and *most TS-specific type information* is removed during emit. This means type annotations themselves have no effect on the program's runtime behavior.

<details>
<summary>Author's note</summary>
Once you know this property, it is worth reconsidering what TS fundamentally is. TS is, in the end, a language created to detect type-induced runtime errors ahead of time, at compile time. If a programmer

1. is confident about the types involved, or
2. wants to exploit the freedom JS provides,

then choosing .js over .ts may well be the wiser move.
</details>

> [!warning] However, some features, such as regular `enum`s, do generate runtime JS.

The `enum` above is an exception that exists because TypeScript designed `enum` to be usable both as a type and as a JavaScript object at the same time.

```ts
enum Direction {
  UP,
  DOWN,
}

const direction:Direction = Direction.DOWN;
```

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
})(Direction || (Direction = {}));
const direction = Direction.DOWN;
//# sourceMappingURL=index.js.map
```
## 2. Structural typing: structure is compared, not names
TS operates on the structure of a type, not its name. Look at the code below.
```ts
interface Point {
  x: number;
  y: number;
}

function printPoint(point: Point) {
  console.log(point.x, point.y);
}

const labeledPoint = {
  x: 10,
  y: 20,
  label: "origin",
};

printPoint(labeledPoint); //10 20
```
`labeledPoint` never declares that it `implements` `Point`.

But by having the members `x:number` and `y:number`, it satisfies the structure `Point` requires. So the result `10 20` prints correctly.

We call this **structural subtyping**. Written formally:

$$
S={x:\text{number},y:\text{number},label:\text{string}}\\
T={x:\text{number},y:\text{number}}
$$

Since $S$ is compatible with every member $T$ requires, an assignment like $S\preceq T$ is allowed. We say this expresses the **assignability relation** between $S$ and $T$.

In the actual JS runtime, TS's `Point` does not survive; only the `labeledPoint` object exists, and only the needed members are used.
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function printPoint(point) {
    console.log(point.x, point.y);
}
const labeledPoint = {
    x: 10,
    y: 20,
    label: "origin",
};
printPoint(labeledPoint);
//# sourceMappingURL=index.js.map
```

## 3. Types as sets: a type is a set of possible values
Personally, I think this may be the single most important sentence for understanding types. Understanding a type as a set of possible values enables much more flexible reasoning.

For example, the `string` type can be read as the set of all possible string values in JS, and `number` as the set of all possible numeric values in JS.
$$
[[\text{string}]]=\{"","hello","GET",...\}\\
[[\text{number}]]=\{0, 1, -1, 3.14, \text{NaN} ...\}
$$
Now we can reason about types as a kind of set arithmetic.
### 3.1 Union Type
```ts
type ID = string | number;
```
`ID` is the union of the set of `string` values and the set of `number` values.
$$
[[\text{ID}]]=[[\text{string}]]\cup[[\text{number}]]
$$

So both of the following values belong to the `ID` type.

```ts
const id1: ID = 10;
const id2: ID = "user-10";
```

But an `object`, which belongs to neither `number` nor `string`, cannot have the `ID` type.

### 3.2 Types are unions, operations are intersections
```ts
function printId(id: string | number) {
  id.toUpperCase();
}
```
`toUpperCase()` exists on `string` but not on `number`.

In this case, since `id` might actually be a `number`, the call is not allowed.

For an operation to be safe, the set of allowed operations must be the intersection.

$$
[[\text{IDOps}]]=[[\text{string}]]\cap[[\text{number}]]
$$

### 3.3 Type aliases do not create new value sets
```ts
type UserId = string;
type UserName = string;
```
The two aliases have different names but denote the same set of `string` values.
$$
[[UserId]]=[[UserName]]=[[string]]
$$
From the set perspective the two aliases mean the same set, so they cannot be distinguished. Code like the following is therefore allowed.

```ts
let id: UserId = "user-1";
let name: UserName = "Lee";

id = name; // No Error!
```
A type alias merely names an existing type; it does not create an independent nominal type identity.

## 4. Type inference: how does the compiler infer types?
```ts
const count = 10;
````
We never annotated `count` as `number`, yet TS analyzes the initializer `10` and infers that the type of `count` is `number`.

Since a `const` binding cannot be reassigned, `count` can easily be inferred as the literal type `10`. But consider `let`, where the binding can be reassigned.

```ts
let count = 10;
count = 20;
```

Here `count` is rebound from `10` to `20`, so inferring the literal type `10` would be unsafe. It must be inferred as the wider `number` type instead.

### 4.1 Contextual typing
The information used for type inference does not flow in only one direction. The surrounding "context" is used as well.
```ts
const names = ["Alice", "Bob"];

names.forEach((name) => {
  console.log(name.toUpperCase());
});
```
There is no explicit type annotation on `name`. But from the context of the code, the following inference becomes possible:

```text
names: string[]
       │
       ▼
Array<string>.forEach
       │
       ▼
callback parameter: string
       │
       ▼
name: string
```
Determining a type at the point where an expression is used like this is called **contextual typing**.

### 4.2 Mutability and type precision
```ts
let method = "GET";
// string

const fixedMethod = "GET";
// "GET"
```
This is similar to the `name` example above. The more a variable's value can change, the wider TS is forced to infer its type.
$$
\text{Mutability}\propto\frac{1}{\text{precise type}}
$$
`const` objects, however, deserve a second look. Consider the following example.
```ts
const request = {
  method: "GET",
};

request.method = "POST";
```
This code has no error, because `request.method` is inferred as `string`, not `"GET"`. `request` is a `const` object — so how is its property `method` inferred as the wider type `string` rather than `"GET"`?

Think about the rebinding that happens when objects and variables are assigned. What `const` constrains against rebinding is the object `request` itself. It says nothing about what value gets assigned to `request`'s property `method`. In other words, `method` lies outside the reach of the `const` constraint.

If you want the property typed as a literal type, use the `as const` keyword.
```ts
request:
{
  readonly method: "GET"
}
```
`readonly` is TS-level syntax only; it creates no actual JS-level constraint (e.g. `Object.freeze()`).

## 5. Control-flow analysis: types vary by code location
In the code below, the declared type of `value` is `string | number`.
```ts
function normalize(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); //string
  }

  return value.toFixed(2);
}
```
But through the `typeof` keyword, the type is narrowed depending on the location within the function.
```
function entry
value: string | number
        │
        ├─ typeof value === "string"
        │       │
        │       └─ value: string
        │
        └─ else
                │
                └─ value: number
```
In the branch where `typeof value === "string"` is true, value is narrowed to string.

In the opposite branch, it can naturally be inferred as the `number` type.

This is called **narrowing**.

Computing the possible types at each point based on JS control flow, as in the example above, is called **control-flow analysis**.

In the case of `typeof`, which functions can be called depends on the type, so it affects the JS runtime. For this reason `typeof` remains in the emitted JavaScript and keeps doing its job.

## 6. Soundness boundaries: TypeScript does not prevent every error
As mentioned earlier, TS's purpose is to **restrict some of JS's freedom in order to catch, ahead of time, errors that could occur at runtime**.

But if type constraints become too strong, the advantages of JS's freedom disappear. That is, the tradeoff between freedom and restriction must be weighed carefully.

To preserve JS's flexibility, there are some zones where TS's guarantees weaken.

### 6.1 `any`
```ts
let value: any = 10;

value.toUpperCase(); //No compile error! Yes Runtime error!
```
The actual runtime value of `value` is a number, yet no TypeScript error occurs.
```
Static checking:
value: any
→ check skipped

Runtime:
10.toUpperCase()
→ TypeError
```
`any` disables static checking, so no compile error is raised.

### 6.2 Type Assertions
A **type assertion** is a way of giving the compiler type information when the compiler cannot know the type of a variable or object, but the user can.

Since this is the user informing the TS compiler about a type, it guarantees nothing about the actual type in the JS runtime. That is, it does not convert the actual runtime value into the declared type.

```ts
const value = 10 as unknown as string;

value.toUpperCase();
```
For example, emitting the code above to JS produces:

```js
const value = 10;

value.toUpperCase();
```
### 6.3 Input type mismatch

```ts
interface User {
  name: string;
}

const user = JSON.parse(input) as User;

console.log(user.name.toUpperCase());
```
Because `as User` performs no validation of the input, TS cannot know the actual structure of the `input` string. In other words, an input like the following cannot be caught at compile time:

```ts
{
  "name": 10
}
```
To guard against such cases, a separate runtime type-validation step must be added.

```ts
function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "name" in value &&
    typeof value.name === "string"
  );
}

const parsed: unknown = JSON.parse(input);

if (isUser(parsed)) {
  console.log(parsed.name.toUpperCase());
}
```
## 7. Exercise
Using the code below, think through how TS would interpret the types involved.
```ts
type Message =
  | {
      kind: "text";
      value: string;
    }
  | {
      kind: "count";
      value: number;
    };

function formatMessage(message: Message) {
  if (message.kind === "text") {
    return message.value.toUpperCase();
  }

  return message.value.toFixed(0);
}

const message = {
  kind: "text",
  value: "hello",
} as const;

console.log(formatMessage(message));
```

## 8. Conclusion
The most important point is that in most cases, TS's type system adds no new type objects to the JS runtime.

Instead, it statically abstracts the values JavaScript expressions can hold.
```text
Type erasure
→ Types exist only in the static analysis phase.

Structural typing
→ Type compatibility is determined mainly by member structure.

Types as sets
→ A type can be read as the set of possible runtime values.

Type inference
→ The compiler computes types from values and usage context.

Control-flow analysis
→ Types are narrowed per program point based on conditions and reachability.

Soundness boundaries
→ Static guarantees can weaken around any, assertions, and external input.
```

Let's condense everything so far into one sentence:

> TypeScript statically **approximates** the possible runtime values of a JavaScript program, and diagnoses, before execution, the operations that might be unsafe in light of that approximation.

Rather than providing a new runtime system, TS is an **erasable structural static type system** built on top of the JS engine. It cannot catch every runtime error, but it catches a large share of them during compilation.

## Connection

- Next question to explore: TypeScript's basic types
