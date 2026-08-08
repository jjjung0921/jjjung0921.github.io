---
# Recommended paths:
# - src/content/notes/ko/<field>/<slug>.md
# - src/content/notes/en/<field>/<slug>.md
title: "What Does a Bundler Actually Remove?"
lang: "en"
translationKey: "bundler-vite-vs-webpack"
date: "2026-08-08"
# field: "web" | "game" | "programming-language" | "ai" | "blog"
field: "web"
category: "Architecture"
series: "Moment Coffee"
order: 2
# status: "draft" | "reading" | "implemented" | "stable"
status: "draft"
summary: "The question deferred in part 1. By what mechanism does a bundler eliminate unused code, and where exactly do Vite and Webpack diverge on that mechanism?"
problem: "What is a bundler and how does it work? Why does Vite fit this project's requirements better?"
coreIdea: "Tree-shaking only holds when values are statically determined. What matters more than raw capability is whether that path is the default, and that in a build repeated N times, speed becomes a scaling limit."
connection: "dependency graph, ESM static structure, constant folding, dead code elimination, Rolldown"
tags: ["architecture", "bundler", "vite", "webpack", "moment-coffee"]
---

# What Does a Bundler Actually Remove?

## 1. The question part 1 left open

In [part 1](/en/notes/tenant-split-frontend-backend/) we decided to build the frontend separately per merchant. The basis was clause C2 of the specification.

> Screens and tabs of inactive modules are **excluded from the build**

And a constraint followed. **The requirement cannot be met with a runtime conditional.** Judge it during execution with `if (config.enabledModules.includes("reward"))` and the reward screen's code is in the bundle regardless. It simply isn't displayed — the user still downloads it.

That is what turned the bundler choice into an architectural decision, and we adopted Vite. This post pays back the three things deferred then.

1. What a bundler actually is
2. By what mechanism it eliminates unused code
3. Where Vite and Webpack diverge on that mechanism, and why Vite for this project

---

## 2. What bundlers were originally for

It started as a simple problem: **browsers didn't understand module systems.**

Back when files were loaded in order via `<script>` tags, a few dozen files meant one wrong ordering could kill the app. Globals overwrote each other. Module conventions like CommonJS and AMD appeared in response — but browsers couldn't execute them.

The bundler's original job came from there: **merge many modules into one file the browser understands.** A tool for bundling, exactly as the name says.

The situation is different now. Browsers support ES Modules natively and HTTP/2 lowered the cost of multiple requests. Merging itself is no longer as urgent.

What remains is everything else the bundler ended up doing while it had the whole module graph in view.

| Job | Content |
|---|---|
| **Transform** | TypeScript and JSX into what browsers understand |
| **Graph analysis** | A full map of what imports what |
| **Optimization** | Remove unused code, inline constants, shorten names |
| **Splitting** | Move code not needed on initial load into separate chunks |
| **Asset handling** | Hash image and CSS filenames, rewrite references |

The third one is what matters to us: **the bundler knows the whole graph, so it can determine "nobody uses this."**

---

## 3. The mechanism — build a graph, shrink it, cut it

### 3.1 Build a graph from the entry point

A bundler starts from one entry point and follows every `import`.

```
main.tsx
 ├─ import App from "./App"          → App.tsx
 │   ├─ import { Button } from "@/shared/ui"   → Button.tsx
 │   └─ import { routes } from "./routes"      → routes.ts
 │        └─ import("@/modules/reward/routes") → (dynamic) reward chunk candidate
 └─ import "./styles.css"            → styles.css
```

When the traversal ends you have **the set of reachable modules.** A file not in that set doesn't enter the bundle even if it exists in the project. That is the first filter.

### 3.2 Shake out unused exports — tree-shaking

Even within reachable modules, some parts go unused.

```ts
// utils.ts
export function formatPrice(n: number) { /* ... */ }
export function formatDate(d: Date) { /* ... */ }   // nobody uses this

// main.ts
import { formatPrice } from "./utils";
```

`formatDate` drops out of the final bundle. This is called **tree-shaking** — the metaphor being a tree whose unused branches are shaken loose.

**This works because ES Modules are static.** `import` and `export` can only appear at the top level and their names are fixed before execution, so the bundler can tell who uses what **without running the code.**

CommonJS is not like that.

```js
const name = someCondition ? "formatPrice" : "formatDate";
const fn = require("./utils")[name];   // only known at runtime
```

What gets used is decided at runtime, so the bundler **can remove nothing.** This is the fundamental premise of tree-shaking: **it has to be statically determined before it can be removed.**

### 3.3 Once a value is fixed, branches go too

This is where part 1's requirement connects directly. Bundlers also clean up conditionals whose value is settled.

```ts
if (false) {
  doSomething();     // unreachable → removed entirely
}
```

This is **dead code elimination.** Nobody writes `if (false)` directly, of course — the form is reached through **constant folding.**

```ts
const DEBUG = false;
if (DEBUG) { ... }        // fold DEBUG to false → if (false) → removed
```

The crux is **whether it can be folded.** If the value flows through variables or comes from a function call, the bundler can't fold it — and without folding, the branch can't go.

### 3.4 Cut into chunks

On encountering `import()`, the bundler makes a separate file (chunk) at that boundary. It's the mechanism for deferring code not needed on initial load.

Layer 3.3 on top and this happens:

```ts
...(SOME_LITERAL_FALSE ? [{ lazy: () => import("./reward") }] : [])
```

Remove the branch and the `import()` inside goes with it. **It drops out of the graph, so the chunk is never generated.**

---

## 4. Where our requirement sits in this mechanism

Now C2 can be placed onto the mechanism. All it needs is one thing: **make the module flag a literal.**

Vite's `define` is not a runtime lookup but **source text substitution at build time.**

```ts
// vite.config.ts
const cfg = JSON.parse(
  fs.readFileSync(`tenants/${process.env.TENANT}/public.config.json`, "utf-8")
);

export default defineConfig({
  define: {
    __MODULE_REWARD__: JSON.stringify(cfg.enabledModules.includes("reward")),
    __MODULE_STORE__:  JSON.stringify(cfg.enabledModules.includes("store")),
  },
});
```

```ts
// routes.ts — the dynamic import must sit *inside* the conditional
const routes = [
  { path: "/",     lazy: () => import("@/modules/menu/routes") },
  { path: "/cart", lazy: () => import("@/modules/cart/routes") },

  ...(__MODULE_REWARD__ ? [{ path: "/reward", lazy: () => import("@/modules/reward/routes") }] : []),
  ...(__MODULE_STORE__  ? [{ path: "/store",  lazy: () => import("@/modules/store/routes")  }] : []),
];
```

Building for a merchant without rewards fires the stages from section 3 in order.

```
config.json  { enabledModules: ["menu", "cart", "order"] }    // no reward
      ↓  define — source text substitution
__MODULE_REWARD__  →  the literal false
      ↓  3.3 constant folding + dead code elimination
...(false ? [...] : [])  →  branch removed
      ↓  3.1 drops out of the graph
import("@/modules/reward/routes") disappears
      ↓  3.4
the reward chunk is never generated
```

**Everything hinges on the flag being a literal rather than a variable.** Judge it with a runtime value like `config.enabledModules.includes("reward")` and nothing folds at 3.3 — and without folding, none of the rest happens. The code behaves identically; only the bundle fails to shrink.

---

## 5. Where this actually breaks

This is **a structure held together by discipline**, not something a library guarantees. It has failure modes, and two are overwhelmingly common.

### F1. Passing the flag via `import.meta.env.VITE_*`

`.env` values are **always strings.**

```ts
// .env: VITE_MODULE_REWARD=false
if (import.meta.env.VITE_MODULE_REWARD) { ... }   // "false" is truthy
```

The string `"false"` is truthy, so the branch is **never** removed. You need a real boolean literal via `define` + `JSON.stringify(boolean)`.

### F2. Declaring the dynamic import at module top level

```ts
// don't — the import is already in the graph
const Reward = lazy(() => import("./reward"));
const routes = [...(__MODULE_REWARD__ ? [{ path: "/reward", element: <Reward /> }] : [])];
```

Erase the branch and the declaration above still stands, so 3.1 has already marked it reachable. **The chunk is generated anyway.** The `import` statement itself has to live inside the conditional.

> [!warning] Why these two are especially dangerous
> F1 and F2 **behave completely normally.** Screens render, routing works, tests pass. The only thing wrong is bundle size, and that is visible only by opening the bundle.

### Hence the CI gate

Nobody can check this by hand every time, so automate it. Add a pipeline stage that inspects the build output for **any trace of inactive modules.**

```
vite build (TENANT=b)
  → scan dist/
  → fail if a reward chunk file exists
  → fail if chunk contents include reward-only identifiers
```

Part 1 claimed C2 is satisfied; this is the device that **keeps that claim true over time.** Without it, some commit breaks it quietly and nobody notices.

---

## 6. Where Vite and Webpack diverge

### 6.1 Dev server — to bundle or not

**Webpack** bundles during development too. Edit a file and it rebundles the affected range before serving. As the project grows, both cold start and updates slow down together.

**Vite** does not bundle during development. It leans on native browser ESM support and **transforms only the files that are requested**, on demand. Adding files doesn't inflate startup time much.

This difference is most of why Vite is known — but **it has nothing directly to do with our decision.** C2 is a production-build problem.

### 6.2 Production build — the engine changed in Vite 8

This part shifted recently and is worth stating precisely.

| | Production build engine |
|---|---|
| Vite 7 and below | esbuild for dev, **Rollup** for production — two engines |
| **Vite 8** (stable March 2026) | Unified on **Rolldown.** Written in Rust, aiming to be a drop-in replacement for Rollup's API |
| Webpack | Its own engine (JavaScript) |

On the Vite team's published 19,000-module benchmark, a production build went from 40.10 seconds under Rollup to 1.61 seconds under Rolldown — roughly 25×. Smaller projects are reported in the 2–5× range, larger ones 10–30×.

**That number carries specific weight in our context.** With N merchants, we run the build N times. Part 1 recorded "full build exceeding 15 minutes" as a review trigger, and build engine speed **directly postpones when that trigger fires.** In a typical project build time is developer convenience; in our structure it is a scaling limit.

### 6.3 Tree-shaking quality

Rollup-family analysis over ESM graphs has long had a reputation for thoroughness, and comparisons of the same project tend to report smaller output from Vite than from Webpack. Webpack has kept improving tree-shaking since v5, but it has to support broad CommonJS interop, which pushes its judgments toward the conservative in places.

That said, this is **a difference of degree, not of possible versus impossible.** The next point matters more.

### 6.4 Configuration philosophy

**Webpack can satisfy our requirement too.** `DefinePlugin` does the same job as `define`.

```js
// webpack.config.js
new webpack.DefinePlugin({
  __MODULE_REWARD__: JSON.stringify(cfg.enabledModules.includes("reward")),
})
```

So to be honest about it: **"it's impossible with Webpack" would be false.** The difference lies elsewhere.

| | Vite | Webpack |
|---|---|---|
| Constant injection | `define` — a core option | `DefinePlugin` — a plugin |
| Production optimization | On by default | Requires `mode: 'production'` |
| TS · JSX · CSS | Supported out of the box | Loader configuration required |
| Configuration surface | Small | Large and fine-grained |

Webpack's large configuration surface is **not a weakness but a different purpose.** When you have to handle a complex legacy pipeline, that granularity is exactly the capability you want.

---

## 7. So why Vite for this project

Two reasons.

**First, default path versus assembly.** The chain we depend on has four stages: `define → constant folding → dead code elimination → dropping out of the graph`. In Vite all of it is default behavior. It works in Webpack too, but you have to line up a plugin and the mode setting — and **the more there is to line up, the more room there is for mistakes like F1 and F2.** This chain breaks silently, so a smaller surface is better.

**Second, we run the build N times.** In a typical project build speed is developer convenience; in part 1's structure it directly sets **the ceiling on how many merchants we can add.** The engine change in 6.2 lands squarely on that.

> The basis for the decision isn't "Vite is better." It's **"the chain we lean on is the default in Vite, and in a repeated build, speed is the scaling limit."**

---

## 8. When Vite is the wrong choice

The other side, for the record. If any of the following applies, don't carry this decision over.

- **Heavy CommonJS legacy dependencies.** The benefit of ESM-based analysis shrinks, and Webpack's accumulated interop handling may serve better
- **A specialized loader that exists only in the Webpack ecosystem.** Common in older in-house toolchains
- **Micro-frontends using Module Federation.** Webpack is the de facto standard there, with a maturity gap
- **Needing very fine control over build output.** The larger configuration surface wins

Our project is new, its dependencies are modern, and it isn't a micro-frontend. None of the above applies. **Under different conditions the answer would have been different.**

---

## 9. Next post

That closes the bundler thread. In summary:

> Tree-shaking holds **only when values are statically determined.** We leaned on that property to satisfy C2, and chose the tool where that chain is the default path.

The next post moves to the state layer. The moment the backend becomes the source of truth, the nature of the data the frontend holds changes. It covers **what it means to treat server data as a cache rather than a value**, and how that perspective determined the library choice.

---

## References

- [Vite 8 Beta: The Rolldown-powered Vite](https://vite.dev/blog/announcing-vite8-beta) — Rolldown integration and benchmarks
- [Rolldown Integration | Vite](https://v7.vite.dev/guide/rolldown) — the opt-in guide as of Vite 7
