---
# Recommended paths:
# - src/content/notes/ko/<field>/<slug>.md
# - src/content/notes/en/<field>/<slug>.md
title: "Server Data Is a Cache, Not a Value"
lang: "en"
translationKey: "server-state-as-cache"
date: "2026-08-08"
# field: "web" | "game" | "programming-language" | "ai" | "blog"
field: "web"
category: "react"
series: "Moment Coffee"
order: 3
# status: "draft" | "reading" | "implemented" | "stable"
status: "reading"
summary: "When an AI recommended TanStack Query in a design document, I had no idea what it was. It turned out to be less about library features and more about what you consider server data to be."
problem: "What actually goes wrong when you call an API with useEffect + useState? Which of those problems does TanStack Query solve, and by what mechanism?"
coreIdea: "Server data is not a value you own but a copy without authority. So it carries a freshness state, goes stale by time or by event, and when stale it is still shown while being reconciled in the background."
connection: "stale-while-revalidate, cache invalidation, observer pattern, state ownership"
tags: ["react", "tanstack-query", "state-management", "moment-coffee"]
---

# Server Data Is a Cache, Not a Value

## 1. I adopted this library before I understood it

While writing up the frontend design for Moment Coffee, a cafe ordering app, I put together an ADR. I gave an AI the requirements specification and had it lay out the rationale for each stack decision. Under server state, this came back:

> **D6. Server state — TanStack Query v5**
>
> - **C8 (order status updates):** poll with `refetchInterval` on the order status screen only. Start at 5 seconds. Stop polling once the status is "picked up."
> - **C7 (loading indicators):** `isPending` / `isError` are first-class states, so the requirement becomes a matter of use rather than implementation.
> - **FR-103 (200ms search):** the menu list is already cached, so filtering happens client-side with no server request.

The specification had these requirements. Order status moves through received → preparing → ready → picked up **driven by store-side processing**, search results must appear within 200ms, and a loading state must be shown while waiting. The AI proposed a library on the basis of those three.

The reasoning was sound. But I didn't know **what the library actually did.** The name has "Query" in it, so I assumed it was a data-fetching tool, and after looking at a code sample I guessed this:

```ts
const { data, isPending, isError } = useQuery({ ... });
```

> Is this a library that lets you destructure the server response directly without building a separate DTO?

Wrong. What gets destructured there — `{ data, isPending, isError }` — is **not the data the server sent but a result object TanStack Query built**. `data` is exactly whatever the `queryFn` I passed returned; the library never opens or transforms the response.

This note starts from that misunderstanding and follows the library down to the mechanism that actually solves the problem.

> [!note] Scope of this note
> Moment Coffee is still at the design-document stage and has not been implemented. So this is **a conceptual write-up, not a result verified by working code.** There are no benchmarks or measurements here.

---

## 2. The problems in the hand-rolled era

Let's set the baseline first. Without TanStack Query, calling an API in React usually looks like this.

```ts
function MenuList({ storeId }: { storeId: string }) {
  const [data, setData] = useState<Menu[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    api.getMenus(storeId)
      .then(d => { if (!cancelled) setData(d); })
      .catch(e => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [storeId]);

  // ...
}
```

It works. The problem is that this code **repeats once per screen**, and every repetition copies the defects below along with it.

### 2.1 Three states synchronized by hand

`data` · `loading` · `error` are really one state machine. If loading is in progress there should be no error; if there is an error, loading should be finished. But the code above keeps them as **three independent `useState` calls** and orders them by hand. Miss the `finally` and loading never ends. Forget `setError(null)` on refetch and a stale error lingers.

### 2.2 A race condition hides quietly

If `storeId` flips from A to B quickly, two requests go out. Response order is not guaranteed.

```
request A ───────────────────────> response A arrives (late)
request B ──────> response B arrives

setData(B)  →  setData(A)   result: the screen says B, the data is A
```

That is why the code above carries a `cancelled` flag. But this defense **has to be written by hand every time, and omitting it still works most of the time.** It won't reproduce on a fast development network and only goes wrong occasionally in real user conditions. That is the least pleasant class of bug to chase.

### 2.3 There is no cache

If both the cart screen and the menu screen need the same menu list, two requests go out. Switch tabs and come back, the component remounts and another one goes out. From the user's side, it's a screen they've already seen, showing a spinner again.

The spec's "search results within 200ms" is a network problem in this state. With a cache you never reach the server, so it **shrinks to a rendering problem**. That's the difference at stake.

### 2.4 Nothing in the code knows when to invalidate

Paying changes the reward balance. But in the structure above, **no code exists that knows** the reward screen's `data` is now stale. The checkout screen and the reward screen don't know about each other.

So you usually reach for one of two workarounds: refetch unconditionally every time the reward screen mounts (which worsens 2.3), or lift the response into a global store and update it directly at checkout. Choosing the latter leads into the next section.

### 2.5 Lifting it into a global store makes it worse

Putting server responses into a client state store like Redux does solve 2.3 and 2.4 for the moment. In exchange, these questions appear.

- **How old is this data?** Ten seconds, or ten minutes?
- Does it need refetching? Who decides?
- What if two screens are looking at data from different points in time?
- What about when the user leaves the tab and comes back?

There's a reason these have no good answer. The data was put in the wrong place to begin with.

---

## 3. The root cause — treating server data like client state

The defects in section 2 look like separate mistakes, but they share one cause: **treating data that came from the server as a value I own.**

Put two things side by side and the difference in nature shows.

| | Is the cart sheet open? | Menu list |
|---|---|---|
| Owner | Me (client) | Server |
| Accuracy of my value | **Always correct** | May be stale at any time |
| What changes it | Only me | Things I don't see |
| Nature | A value | **A copy** |

I am the sole owner of whether the cart sheet is open. If I set it to `true`, it is true. There is nothing to verify.

The menu list is different. The original lives on the server and what I hold is **a snapshot from some point in time**. The owner may have just marked an item sold out. My value can become wrong without me doing anything.

In other words, server data carries **a time dimension: when is this from?** `useState` has no such dimension. That is why every problem in section 2 fell to "manage it yourself." A concept missing from the tool was being filled in by hand, every time.

> [!tip] This note in one sentence
> **Server data is not a value but a copy without authority.** Accept that, and the necessary features follow from it.

### 3.1 This is not "attach an expiry to temporary data"

At first I understood this as a TTL cache: it's temporary data, so attach an expiry and discard it when the time passes. Two things are off.

**First, it isn't "temporary."** You hold onto it for a long time. The issue isn't retention, it's the **absence of authority**.

**Second, expiry doesn't mean discard.** A TTL cache drops the entry on expiry and the next request starts empty — so the screen falls back to a spinner at that moment. TanStack Query's `staleTime` behaves differently.

```
staleTime elapses
  → it is only marked "stale"
  → the stale data is still rendered immediately
  → a refetch runs in the background at the same time
  → when it lands, it is swapped in quietly
```

This pattern is called **stale-while-revalidate**. The user never sees the screen go blank. It's exactly this behavior that satisfies the spec's "screen transitions within 1 second."

So there are two clocks.

| | Meaning | When it elapses |
|---|---|---|
| `staleTime` | Freshness | **Not discarded.** Revalidated at the next opportunity |
| `gcTime` | Memory lifetime | Removed from cache once nothing subscribes to it |

**Third, time alone isn't enough.** When you pay, the reward balance goes stale **at that instant**, whether one second has passed or not. An expiry model can't express that. That's why `invalidateQueries` exists separately — a channel for going stale by **event** rather than by time.

Putting it together:

> Server data is a copy without authority. So it carries a **freshness** state, goes stale by **time or by event**, and when stale it is **still shown while being reconciled in the background.**

---

## 4. How it solves the problems in section 2

Translating section 3's perspective into code yields two tools: **giving the cache an address** (`queryKey`) and **giving the cache a lifetime** (`staleTime`). Here is how each defect disappears.

```ts
const { data, isPending, isError } = useQuery({
  queryKey: queryKeys.menus(tenantKey, storeId),
  queryFn: () => api.getMenus(storeId),
  staleTime: 5 * 60 * 1000,
});
```

### 4.1 The library owns the state machine (2.1)

`isPending` · `isError` · `data` are derived from a single state machine. I never synchronize the three. This is where a requirement becomes a matter of **use** rather than implementation.

### 4.2 The race condition disappears structurally (2.2)

When `storeId` changes, the `queryKey` changes. A different key is **a different cache entry**, so A's response has no path into B's slot. The hand-written `cancelled` guard is absorbed into key design.

That's the first role of `queryKey`. A key is not an argument, it's **an address**.

### 4.3 Screens on the same key see the same data (2.3)

Same `queryKey` means the same cache entry. Therefore:

- two components mounting at once still fire **one** request (dedup)
- leaving and returning to a tab paints the cached value **immediately**
- the menu is already cached, so search never hits the server — 200ms shrinks from a network problem to a rendering problem

### 4.4 Invalidation gets a channel (2.4, 2.5)

```ts
// on checkout completion
queryClient.invalidateQueries({ queryKey: ["tenant", tenantKey, "reward"] });
```

**Declaring** that "the data at this address is stale" makes every screen subscribed to that key refresh itself. The checkout screen doesn't need to know the reward screen exists. They meet through **the key**, not through each other.

The unanswered questions from 2.5 resolve here too. "How old is it" is held by `dataUpdatedAt`, "does it need refetching" is decided by `staleTime`, and "two screens on different points in time" can't arise because they share one cache entry.

### 4.5 The mental model shifts from imperative to declarative

This ends up being the biggest change.

| | What you write | Who decides when to fetch |
|---|---|---|
| Before | "Fetch now and put it in state" | Me (`useEffect` dependency array) |
| After | "This screen needs the data at this key" | **The library** |

The same reason explains why `refetchInterval: 5000` is all it takes for order-status polling. I write only **what is needed**, and the cache's freshness rules decide when to fetch it.

### 4.6 Conversely, what it does not do

Drawing the boundary is part of making the perspective precise.

- **It does not transform.** `data` is exactly the `queryFn` return value. Mapping a DTO into a view model is still my job
- **It does not guarantee runtime types.** The generic in `useQuery<Menu[]>` is a compile-time assertion. If the server sends something else, nothing happens
- **It does not handle client state.** The cart has no original on the server, so it cannot go stale. It isn't an invalidation target — it's a value you simply reset

So in the Moment Coffee design, three axes stand apart.

| Question | Owner |
|---|---|
| When to fetch, where to cache, when to refetch | TanStack Query |
| Is what arrived actually that shape (at runtime) | Zod — amount/status responses only |
| Server shape → view shape | Pure functions in `model/` |

---

## 5. The mechanism — what is a singleton and what isn't

Here I got it wrong a second time. Having learned the cache is shared, I thought:

> So what `useQuery` returns must be a singleton object holding singleton data

It isn't. Some layers are singletons and some aren't, and knowing that boundary was the last piece of understanding this library.

### 5.1 The object graph

```
QueryClient                       ← one per app (singleton)
 └ QueryCache                     ← one per app (singleton)
    └ Query                       ← one per queryKey (shared)
       │  · data, error, status
       │  · dataUpdatedAt
       │  · in-flight promise
       │  └ observers[]           ← observers currently subscribed
       │
       ├── QueryObserver          ← one per useQuery call
       │      └ result object     ← rebuilt each render  ⟵ useQuery's return value
       └── QueryObserver
              └ result object
```

Summarized:

| Layer | Count | Shared? |
|---|---|---|
| `QueryClient` / `QueryCache` | One per app | Singleton |
| `Query` | **One per queryKey** | Shared across components using that key |
| `QueryObserver` | One per `useQuery` call | Not shared |
| `useQuery`'s return value | Rebuilt each render | Not shared |

**The data is shared; the result object is not.** That is precisely where I was confused.

### 5.2 Where it lives

The cache lives in an ordinary JavaScript object **outside** the React tree.

```ts
const queryClient = new QueryClient();   // ← the cache lives here

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

There's a structurally important detail here. **What `QueryClientProvider` passes down through Context is only the client instance; the data does not travel through Context.**

Putting data directly into Context re-renders the entire subscribing tree whenever the value changes — the classic problem with using Context API for shared state. TanStack Query passes down **only the address** through Context and has each `useQuery` subscribe to its own key, structurally sidestepping that trap. When the menu cache updates, the reward screen does not re-render.

### 5.3 What the observer layer makes possible

Because `Query` (shared) and `QueryObserver` (per-call) are separate, components can look at the same data and still behave differently.

```ts
// Screen A — needs the whole list
const { data } = useQuery({ queryKey: k, queryFn: f });

// Screen B — needs only the count. Same cache, different shape
const { data: count } = useQuery({
  queryKey: k,
  queryFn: f,
  select: (menus) => menus.length,
});
```

Options like `staleTime` · `enabled` · `refetchInterval` are per-observer too. That's why **polling on the order status screen only** works while other screens don't. Polling isn't a property of the data — it's a property of how that screen looks at the data.

### 5.4 Structural sharing

If a refetch comes back **deeply equal** to the previous value, the previous reference is kept. The reference doesn't change, so subtrees behind `React.memo` or a `useMemo` dependency don't re-render.

A design that checks staleness often also revalidates often, and if every revalidation minted a new object the whole screen would flicker. This optimization is closer to a precondition for using stale-while-revalidate in practice.

### 5.5 It disappears on refresh

The cache lives in memory, so a page refresh empties it. But this isn't a defect — it's the **natural consequence** of section 3's perspective. The original is on the server, so there's no reason to pin a copy to disk. Fetching again is enough, and it's more accurate anyway.

The same reason splits the persistence policy in the Moment Coffee design.

| State | Owner | Persistence |
|---|---|---|
| Menus · stores · coupons · rewards · orders | TanStack Query | **Memory** (server holds the original) |
| Cart · selected store | Zustand + persist | **localStorage** (the original is here) |

---

## 6. What's left

New questions appeared where the understanding ended. I don't have answers yet.

- **The boundary of the `session` query.** I got stuck while listing invalidation targets for checkout completion. If `session` holds only auth information it doesn't go stale on payment; if it returns a user profile carrying the point balance, it does. **When it's unclear what a key holds, the invalidation scope is unclear too.** Giving a cache an address turns out to also mean defining that address's boundary
- **On what basis do you pick a `staleTime` value?** Five minutes feels right for menus, but that five minutes is a hunch
- How far the rollback handling actually reaches when using optimistic updates in a real implementation

## 7. Closing

Most of the time it took to understand this library was not spent learning the API. It was spent changing my view of **what server data is**.

Seen as a value, caching, invalidation, and revalidation all look like add-on features. Seen as a copy without authority, they become **the things you must have in order to handle a copy at all**. Same feature list, opposite order of derivation.

When the AI recommended a library in the design document, I read the rationale but not the perspective. The rationale was a sentence connecting requirements to features; the perspective sat underneath it and never made it into the document. **Accepting a recommendation and understanding it are different things** — that's what I took away this time.
