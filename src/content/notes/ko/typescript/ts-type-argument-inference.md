---
# Recommended paths:
# - src/content/notes/ko/<field>/<slug>.md
# - src/content/notes/en/<field>/<slug>.md
title: "타입 인자는 어떻게 결정되는가"
lang: "ko"
translationKey: "type-argument-inference"
date: "2026-07-27"
# field: "web" | "game" | "programming-language" | "ai"
field: "programming-language"
category: "typescript"
series: "javascript/typescript"
# status: "draft" | "reading" | "implemented" | "stable"
status: "implemented"
summary: "제네릭 호출에서 타입 인자를 생략했을 때 compiler가 T를 푸는 과정과, 후보가 충돌할 때 추론이 실패하는 이유를 다룹니다."
problem: "타입 인자를 생략했을 때 T는 어떻게 결정되며, 왜 Dog와 Cat을 넘기면 Animal로 합쳐주지 않는가?"
coreIdea: "TypeScript는 T가 실제 등장한 자리에서만 후보를 모으고, 합성 규칙이 유일한 곳에서만 새 타입을 만든다."
connection: "type inference, unification, structural typing, infer"
tags: ["typescript", "javascript"]
---

# 추론과 단일화

## 문제

[앞선 글](/notes/ts-generics)에서 우리는 제네릭 함수를 정의했지만 정작 호출할 때는 타입 인자를 쓰지 않았다.

```ts
function identity<T>(x: T): T { return x; }

const explicit = identity<string>("hi"); // 명시
const inferred = identity("hi");         // T를 쓰지 않았다
```

두 번째 호출에서도 결과는 동일하게 동작한다. compiler가 `T`를 알아낸 것이다.

앞선 글에서 다룬 type inference는 초기값과 문맥으로 변수의 타입을 계산하는 것이었다. 제네릭 추론은 그것과 성격이 조금 다르다. 여기서는 **미지수를 푸는** 일에 가깝다.

> compiler는 어떤 절차로 `T`의 값을 결정하며, 그 절차는 언제 실패하는가?

## 0. 단일화(unification)

`identity("hi")`에서 벌어지는 일은 다음과 같다.

```
매개변수 선언 타입:  T
실제 인자의 타입:    "hi"
        │
        │ 두 식을 맞춰본다
        ▼
T := "hi"
```

미지수를 포함한 두 타입 식을 맞춰 미지수의 값을 구하는 것, 이를 **단일화(unification)** 라고 한다.

`T`가 여러 자리에 등장하면 각 자리에서 하나씩 **후보(candidate)** 가 모인다.

```ts
function pair<T>(x: T, y: T): T[] { return [x, y]; }

pair("a", "b"); // 후보 = { "a", "b" } → T := string
```

### 0.1 매개변수 타입은 패턴이다

방정식을 푸는 것이라면 미지수를 어디에 심느냐에 따라 답이 달라진다. 매개변수 타입을 `T`로 쓰는 것과 `T[]`로 쓰는 것은 서로 다른 방정식이다.

```ts
declare function fA<T>(xs: T[]): T;
declare function fB<T>(xs: T): T;

fA([dog, cat]); // Cat | Dog
fB([dog, cat]); // (Cat | Dog)[]
```

둘 다 정상적으로 컴파일된다. 다만 `T`가 묶이는 대상이 다르다.

```
fA:  T[]  =  (Cat | Dog)[]    →  양변의 [] 를 벗긴다  →  T = Cat | Dog
fB:  T    =  (Cat | Dog)[]    →  그대로              →  T = (Cat | Dog)[]
```

`T[]`라고 적는 것은 "**인자는 배열일 것이고, 그 원소 타입을 `T`라고 부르겠다**"는 선언이다. 미지수를 구조 안쪽에 심어 **분해해서 꺼내는** 것이다. `T`만 적으면 분해 없이 통째로 받는다.

![T[]는 분해해서 꺼내고, T는 통째로 받는다|520](inference-pattern.svg "T[]는 배열 구조를 벗겨 원소 타입을 꺼내고, T는 전체를 그대로 받는다. 같은 인자라도 미지수를 어디에 심느냐에 따라 답이 달라진다.")

그래서 원소를 반환하려는 함수는 `T[]`로 적어야 한다.

```ts
function bodyA<T>(xs: T[]): T { return xs[0]!; } // OK

function bodyB<T>(xs: T) {
  return xs[0]; // Error — T가 인덱싱 가능한지조차 알 수 없다
}
```

`xs: T`에서는 `T`가 아무 타입이나 될 수 있으므로 인덱싱을 할 수 없다. 배열이라는 정보가 시그니처에 적혀 있지 않기 때문이다. [앞선 글](/notes/ts-generics)의 parametricity가 여기서도 작동한다.

이 관점은 나중에 다룰 `infer`와 정확히 대응된다.

```ts
xs: T[]                              // 값 수준: T[] 패턴에서 T를 꺼낸다
T extends Promise<infer U> ? U : T   // 타입 수준: Promise<U> 패턴에서 U를 꺼낸다
```

`T[]`, `Map<K, V>`, `(x: T) => R` 같은 시그니처는 모두 **"이런 모양일 테니 그 조각에 이름을 붙여달라"** 는 패턴이다. 제네릭 변수를 매개변수 타입의 어느 위치에 두느냐가 곧 무엇을 꺼낼지를 정한다.

`infer`가 어떤 규칙으로 조각을 꺼내는지는 조건부 타입을 다루는 글에서 이어간다. 이 글에서는 값 수준의 추론에 집중한다.

## 1. 후보가 충돌하면 어떻게 되는가

아래 코드를 살펴보자.

```ts
pair("a", 1); // Error!
// Argument of type 'number' is not assignable to parameter of type 'string'
```

TypeScript는 타입의 후보들을 **합치지 않는다**. 대신 모인 후보들 **중에서** 하나를 고른다. 고르는 기준은 **1) "나머지 후보를 전부 받아낼 수 있는 후보"**, 즉 나머지의 상위 타입인 후보 **2) 타입의 등장 순서** 이다.

`string`과 `number`는 서로를 받아낼 수 없으므로 1)로는 답이 없고 2번으로 인해 **첫 후보인 `string`** 으로 확정된다. 에러 메시지가 "parameter of type `string`"이라고 말하는 것이 그 근거다. 인자 순서를 바꾸면 결과도 따라 바뀐다.

```ts
pair("a", 1); // parameter of type 'string'  → T := string
pair(1, "a"); // parameter of type 'number'  → T := number
```

이 경우 실패한 것은 `T`의 확정이 아니라 **두 번째 인자의 할당 검사**다.

1번의 기준을 확인할 수 있는 예제를 보자.

```ts
class Animal { a = 1 }
class Dog extends Animal { d = 1 }

const A1 = pair(new Animal(), new Dog()); // Animal[]
const B1 = pair(new Dog(), new Animal()); // Animal[]
```

만약 2)의 규칙이 먼저 적용되었다면"`B1`은 `Dog`로 확정되어 실패했어야 한다. 두 결과가 같다는 것은 **후보 집합에서 최상단을 우선적으로 찾는다**는 뜻이다.

> [!warning] 앞서 언급했듯, 동등한 자격의 후보가 여럿이면 순서가 개입한다.

위 예시는 자격을 갖춘 후보가 `Animal` 하나뿐이었다. 여러 후보가 서로를 모두 받아낼 수 있다면 그중 무엇을 고르든 안전하다. 이때는 뒤에 온 후보가 선택된다.

```ts
class DogB extends Animal { c = 2 }
class CatB extends Animal { c = 1 }
// 두 클래스의 구조가 완전히 같으므로 서로 할당 가능하다

pair(new DogB(), new CatB()); // CatB[]
pair(new CatB(), new DogB()); // DogB[]
```

"관계가 기준"이라는 원칙은 유효하되 **동점일 때의 tie-break는 구현 세부**다. 어느 쪽이 뽑혀도 타입 안전성에는 차이가 없다.

> [!tip] 위 코드에서 사실, `DogB`와 `CatB` 는 같은 타입이며 명칭만 다른 것이다.

순서가 개입하는 두 상황을 혼동하지 않도록 정리해 둔다. 방향이 서로 반대다.

| 상황 | 결과 |
|---|---|
| 자격을 갖춘 후보가 **없다** | **첫** 후보로 확정하고, 이후 인자 검사에서 실패한다 |
| 자격을 갖춘 후보가 **여럿이다** | **뒤** 후보가 선택되고, 통과한다 |

## 2. 그런데 Dog와 Cat은 왜 실패하는가

이제 핵심적인 사례다.

```ts
class Animal { a = 1 }

class Dog extends Animal { d = 1 }
class Cat extends Animal { c = 1 }

pair(new Dog(), new Cat()); // Error
```

`Dog`와 `Cat`은 모두 `Animal`을 상속한다. 공통 상위 타입이 분명히 존재하는데도 추론이 실패한다.

이유는 아래 2가지다.

### 2.1 Animal이 후보에 등록되지 않는다.

후보는 `T`가 **실제로 등장한 자리**에서만 모인다. 인자로 들어온 것은 `Dog`와 `Cat`뿐이며 `Animal`은 코드 어디에도 나타나지 않았다.

$$
\text{후보 집합} = \{\text{Dog}, \text{Cat}\}
$$

`Dog`는 `Cat`을 받을 수 없고 `Cat`도 `Dog`를 받을 수 없다. 집합 안에 답이 없다.

`Animal`은 타입 후보들의 경쟁에서 진 것이 아니라 **애초에 후보에 등록되지 않았다**.

여기서 한 가지를 분명히 해야 한다. 후보 수집은 "어떤 타입이 적절한가"를 **판단하지 않는다**. 그 자리 표현식의 타입을 받아적을 뿐이다. 아래 코드에서 이를 확인할 수 있다.

```ts
const a: Animal = new Dog();
const b: Animal = new Cat();

pair(a, b); // Animal[] — 통과한다
```

런타임에 들어가는 값은 여전히 `Dog`와 `Cat`이다. 그런데 `a`와 `b`의 **선언 타입**이 `Animal`이므로 후보 집합이 `{Animal, Animal}`이 되고 답이 존재하게 된다. 한쪽만 바꿔도 마찬가지다.

```ts
const c: Animal = new Dog();

pair(c, new Cat()); // Animal[] — 후보 집합은 { Animal, Cat }
```

수집은 값과 합당성을 보지 않는다. 보는 것은 **표현식에 적힌 타입** 뿐이다.

이를 뒷받침하는 근거는 아래 코드를 확인해보면 된다. `pair<Animal>(...)`은 통과했다.

```ts
pair<Animal>(new Dog(), new Cat()); // OK
```

만약 `Animal`이 부적절하다고 판단되어 타입 결정에서 탈락한 것이라면 명시적으로 지정해도 거부되어야 한다. 하지만 위 코드가 통과했으니 **탈락이 아니라 후보 미등록**이었던 셈이다.

### 2.2 그러면 왜 밖에서 데려오지 않는가

그렇다면 TypeScript가 자체적으로 `Animal`을 가져오면 될 일이 아닐까. 여기서 결정적인 단서가 되는 예를 하나 보자.

```ts
declare const dog: Dog, cat: Cat;

const arr = [dog, cat];   // (Cat | Dog)[]  ← union이 만들어졌다
pair(dog, cat);           // Error          ← 실패한다
```

<details>
<summary> arr type checking 방법</summary><br/>

주석에 적은 `(Cat | Dog)[]`는 주장일 뿐이므로 코드로 확인해 두자. 두 방향에서 조여 보면 된다.

```ts
const arr = [dog, cat];

const ok: (Dog | Cat)[] = arr;  // OK   — 이 타입에는 할당된다
const no1: Dog[] = arr;         // Error — Dog[]는 아니다
const no2: Cat[] = arr;         // Error — Cat[]도 아니다
```

원소에 무엇을 할 수 있는지를 보면 더 분명하다.

```ts
arr[0].a;       // OK    — Dog와 Cat이 공통으로 가진 멤버
arr[0].bark();  // Error — Dog에만 있다
arr[0].meow();  // Error — Cat에만 있다
```

[앞선 글](/notes/ts-type-check)의 **"타입은 합집합, 가능한 연산은 교집합"** 이 그대로 나타난다. 원소가 `Dog | Cat`이므로 접근할 수 있는 것은 두 타입의 교집합뿐이다.

> [!tip] 추론된 타입을 확인하는 방법

에디터에서 변수에 커서를 올리는 것이 가장 빠르지만 코드로 남기고 싶다면 위처럼 **양방향 할당**으로 조이거나, `tsc --declaration --emitDeclarationOnly`로 `.d.ts`를 뽑아 보면 된다. 이 글의 모든 타입 주석은 후자로 확인한 것이다.

```
$ tsc --declaration --emitDeclarationOnly example.ts
$ cat example.d.ts
declare const arr: (Cat | Dog)[];
```

</details>

**같은 두 타입이 나란히 놓였는데 결과가 갈린다.** 위에서는 `Cat | Dog`가 멀쩡히 만들어졌고 아래에서는 아무것도 만들어지지 않았다.

이러한 차이가 벌어지는 이유는 **이 둘이 서로 다른 단계에서 벌어지는 일**이라는 데 있다.

```ts
function fromArr<T>(xs: T[]): T { return xs[0]!; }

const exprArr = [dog, cat];         // (Cat | Dog)[]  ← 표현식 자체의 타입
const viaArr = fromArr([dog, cat]); // T := Cat | Dog ← 통과한다
```

`[dog, cat]`이 union이 되는 것은 **배열 리터럴이라는 표현식의 타입을 계산할 때**다. 이 계산은 제네릭 추론과 이전에 먼저 끝나며 제네릭 추론에서 활용된다. 따라서 `fromArr`가 `T`의 후보를 받아볼 때 그것은 이미 `(Cat | Dog)[]`라는 **하나의 타입**이고 후보 집합의 원소도 하나뿐이다.

```
fromArr([dog, cat])                    pair(dog, cat)
        │                                     │
        │ 표현식 계산                            │ 표현식 계산
        ▼                                     ▼
   (Cat | Dog)[]                          Dog,  Cat
        │                                     │
        │ 후보 수집                             │ 후보 수집
        ▼                                     ▼
   후보 = { Cat | Dog }                  후보 = { Dog, Cat }
        │  원소 하나                            │  원소 둘
        ▼                                     ▼
   T := Cat | Dog                        고를 수 없다 → Error
```

![fromArr vs pair — 같은 값, 다른 결과|520](inference-two-paths.svg "같은 dog와 cat이 배열 리터럴로 하나의 표현식이 되면 통과하고, 따로 넘기면 실패한다. 차이를 만드는 것은 후보가 몇 개로 도착하느냐다.")

추론이 후보를 합친 것이 아니라 **합쳐진 결과를 받아적었을 뿐**이다. 조건 표현식도 마찬가지다.

```ts
const exprCond = cond ? dog : cat;  // Cat | Dog  ← 여기서 이미 완성된다
pair(exprCond, exprCond);           // 후보는 Cat | Dog 하나 → 통과
```

같은 `dog`와 `cat`을 넘기는데도 **표현식 단계에서 한 덩어리로 만들어 주면 통과하고 따로 넘기면 실패한다.** 차이를 만드는 것은 타입의 내용이 아니라 그것이 몇 개의 후보로 도착하느냐다.

### 2.3 새 타입은 어느 단계에서 만들어지는가

이렇게 보면 추론의 전체 절차가 보인다.

```
0단계  표현식의 타입을 계산한다   ← 새 타입은 여기서만 만들어진다
1단계  후보 수집 — 계산된 타입을 받아적는다
2단계  선택 — 후보 중에서 고른다   ← 새로 만들지 않는다
3단계  인자 검사 — 확정된 T로 각 인자를 다시 본다
```

지금 절에서 다루는 것은 0~2단계다. 3단계와 제약의 역할은 3절에서 이어간다.

새 타입이 만들어지는 자리는 모두 0단계에 속한다.

| 자리 | 규칙 | 예 |
|---|---|---|
| 배열 리터럴 | 원소들의 union | `[dog, cat]` → `(Cat \| Dog)[]` |
| 조건 표현식 | 두 분기의 union | `cond ? dog : cat` → `Cat \| Dog` |
| 여러 `return` | 반환들의 union | `Cat \| Dog` |

> [!tip] 리터럴을 넘길 때의 widening

`["a", 1]`처럼 리터럴이 섞이면 원소가 `string`, `number`로 넓혀진 뒤 합쳐진다. 이 widening은 앞선 글에서 다룬 별개의 규칙이며 제네릭 타입 인자 자리에는 적용되지 않는다(`identity("hi")` → `"hi"`).

### 2.4 그래서 실패한다

`pair<T>`의 `T`는 **하나의 타입으로 확정**되어야 한다. 그런데 후보 집합 `{Dog, Cat}` 안에는 나머지를 받아낼 수 있는 후보가 없고 선택 단계는 새 타입을 만들지 않는다. 그래서 실패한다.

여기까지가 "왜 실패하는가"에 대한 답이다.

> [!tip] 그렇다면 왜 그런 규칙인가?

당연한 후속 질문이 남는다. `Animal`이든 `Dog | Cat`이든 넣어 주면 될 일 아닌가. 실제로 명시하면 둘 다 통과한다.

```ts
pair<Animal>(new Dog(), new Cat());    // OK
pair<Dog | Cat>(new Dog(), new Cat()); // OK
```

결국 TypeScript는 **안전한 답을 알면서도 만들지 않는다**. 왜 그런 규칙을 택했는지는 추론 알고리즘의 문제가 아니라 언어 설계의 문제이므로 별도의 글에서 다룬다.

### 2.5 곁가지: `infer`는 예외다

지금까지의 결론에는 예외가 하나 있다. 본론에서 벗어나지만 뒤에서 쓰이므로 짚어 둔다. 조건부 타입의 `infer`에는 표현식이 존재하지 않는데도 같은 이름의 후보가 여럿이면 **실제로 합쳐진다**.

```ts
type CoV<T> = T extends { x: infer U; y: infer U } ? U : never;

type I1 = CoV<{ x: Dog; y: Cat }>; // Dog | Cat
```

중요한 것은 이 예외가 남기는 함의다. **같은 컴파일러가 `infer`에서는 후보를 합칠 수 있다.** 그러니 함수 호출에서 합치지 않는 것은 능력의 한계가 아니다.

`infer`가 어떤 규칙으로 후보를 합치는지, 그리고 애초에 왜 등장했는지는 조건부 타입을 본격적으로 다루는 별도의 글에서 정리한다.

## 3. 제약은 언제 개입하는가

마지막으로 `T extends X`가 이 절차의 어디에 끼어드는지 확인하자.

```ts
class Animal { a = 1 }
class Dog extends Animal { d = 1 }
class Puppy extends Dog { p = 1 }
declare const animal: Animal, dog: Dog, puppy: Puppy;

declare function f<T extends Dog>(x: T, y: T): T[];

const r1 = f(puppy, puppy);   // Puppy[]
const r2 = f(puppy, dog);     // Dog[]
const r3 = f(puppy, animal);  // Dog[]  ← Error, 그런데 T는 Dog다
```

`r1`을 보면 후보가 제약을 만족할 때는 **그 후보가 그대로 쓰인다**. 제약이 있다고 해서 무조건 제약으로 떨어지지는 않는다.

문제는 `r3`이다. 후보는 `{Puppy, Animal}`이고 `Animal`은 제약 `Dog`를 위반한다. 여기서 두 가지 가설을 제시할 수 있다.

| 가설 | 예측 |
|---|---|
| 제약이 후보를 **걸러낸다** → `Animal` 배제 → 남은 `Puppy` 선택 | `Puppy[]` |
| 선택은 그대로 하고 **결과를 보정한다** → 최상단 `Animal` 선택 → 위반 → 제약으로 떨어짐 | `Dog[]` |

실제 결과는 `Dog[]`다. **제약은 후보를 걸러내지 않는다.** `Animal`은 경쟁에서 빠진 것이 아니라 이긴 뒤에 제약에 걸려 교체된 것이다.

확인 사살로 제약을 낮춰 보면 분명해진다.

```ts
declare function g<T extends Animal>(x: T, y: T): T[];

const r4 = g(puppy, animal);  // Animal[] — 최상단이 제약을 만족하면 그대로 쓰인다
```

### 3.1 절차에 제약의 자리를 표시하면

```
0단계  표현식의 타입을 계산한다
1단계  후보 수집          — 받아적기만 한다
2단계  선택               — 후보 중 최상단을 고른다 (제약은 여기 관여하지 않는다)
        └ 보정            — 고른 것이 제약을 위반하면 제약 자체로 떨어진다   ← 제약은 여기
3단계  인자 검사          — 확정된 T로 각 인자를 다시 본다                ← 에러는 대부분 여기서
```

후보에서 아무것도 못 골랐을 때도 같은 보정이 작동한다.

```ts
declare function h<T extends Dog>(): T[];

const r5 = h();  // Dog[] — 추론할 자리가 없으면 제약이 그대로 T가 된다
```

제약이 없는 경우에는 `unknown`으로 떨어진다.

```ts
declare function h2<T>(): T[];

const r6 = h2();  // unknown[]
```

즉 **제약은 T의 기본값 역할도 겸한다**. 후보에서 답이 나오지 않거나 나온 답이 제약을 벗어나면 제약이 그 자리를 메운다.

우리가 마주치는 에러는 대부분 3단계에서 발생한다. **후보가 탈락하는 것이 아니라 인자가 탈락하는 것**이다. `r3`에서도 `T`는 `Dog`로 무사히 확정되었고 에러는 그다음 `animal`을 `Dog` 자리에 넣으려다 난 것이다.

## 4. 결론

```
단일화(unification)
→ 미지수를 포함한 타입 식을 실제 타입과 맞춰 미지수를 푼다.

매개변수 타입은 패턴이다
→ T와 T[]는 서로 다른 방정식이다. 미지수를 어디에 심느냐가 무엇을 꺼낼지를 정한다.
→ 원소를 반환하려면 T[]로 적어야 한다. T로는 인덱싱조차 못 한다.

추론의 네 단계
→ 표현식 계산 → 후보 수집 → 선택 → 인자 검사
→ 새 타입은 0단계에서만 만들어지고, 제약은 2단계의 결과를 보정한다.
→ 에러는 대부분 3단계에서 나며, 후보가 아니라 인자가 탈락하는 것이다.

후보 수집은 판단하지 않는다
→ 표현식에 적힌 타입을 받아적을 뿐이다.
→ 선언 타입만 Animal로 바꾸면 같은 값으로도 통과한다.
→ Animal은 탈락한 것이 아니라 미출전이었다.

후보 선택
→ 나머지를 전부 받아낼 수 있는 후보를 고른다. 순서가 아니라 관계가 기준.
→ 단, 동등한 자격의 후보가 여럿이면 tie-break는 구현 세부다.

새 타입은 어느 단계에서 만들어지는가
→ 표현식의 타입을 계산하는 단계에서만 만들어진다(배열 리터럴·조건식·여러 return).
→ 수집과 선택 단계는 이미 계산된 타입을 받아적고 고를 뿐, 새로 만들지 않는다.
→ [dog, cat]이 union이 되는 것은 배열 리터럴의 타입 계산이지 추론이 아니다.

예외는 infer 하나
→ 표현식이 없는데도 같은 이름의 후보를 합친다.
→ 그러므로 함수 호출에서 안 합치는 것은 능력의 문제가 아니다.

왜 공통 상위 타입을 만들어오지 않는가
→ Animal은 후보가 아니고, 선택 단계는 새 타입을 만들지 않는다. 그래서 실패한다.
→ 다만 명시하면 Animal도 Dog|Cat도 통과한다. 안전한 답을 알면서 만들지 않는 것이다.
→ 왜 그런 규칙인지는 설계의 문제이므로 다음 글에서 다룬다.

제약의 위치
→ 후보를 걸러내지 않는다. 선택은 제약과 무관하게 진행된다.
→ 고른 결과가 제약을 벗어나면 제약으로 떨어진다(보정).
→ 그래서 제약은 T의 기본값 역할도 겸한다. 제약이 없으면 unknown으로 떨어진다.
```

한 문장으로 정리하면 다음과 같다.

> TypeScript는 T가 실제 등장한 자리에서만 후보를 받아적고, 그 안에 답이 없으면 — 밖에 안전한 답이 있더라도 그것이 유일하지 않은 한 — 추측 대신 실패를 택한다.

## 전체 코드

이 글에 등장한 코드를 하나의 파일로 모았다. 에러가 예상되는 줄에는 `@ts-expect-error`를 달아 두었으므로 `tsc --strict`로 전체가 통과하는지 확인할 수 있다.

```ts
// ── § 단일화 ────────────────────────────────────────

function identity<T>(x: T): T { return x; }

const explicit = identity<string>("hi");
const inferred = identity("hi");

function pair<T>(x: T, y: T): T[] { return [x, y]; }

pair("a", "b");

// ── § 매개변수 타입은 패턴이다 ──────────────────────

class Animal { a = 1 }
class Dog extends Animal { d = 1 }
class Cat extends Animal { c = 1 }

declare const dog: Dog, cat: Cat;

declare function fA<T>(xs: T[]): T;
declare function fB<T>(xs: T): T;

fA([dog, cat]); // Cat | Dog
fB([dog, cat]); // (Cat | Dog)[]

function bodyA<T>(xs: T[]): T { return xs[0]!; }
function bodyB<T>(xs: T) {
  // @ts-expect-error — T가 인덱싱 가능한지 알 수 없다
  return xs[0];
}

// ── § 후보 충돌 ─────────────────────────────────────

// @ts-expect-error
pair("a", 1);

const A1 = pair(new Animal(), new Dog()); // Animal[]
const B1 = pair(new Dog(), new Animal()); // Animal[]

class DogB extends Animal { c = 2 }
class CatB extends Animal { c = 1 }

pair(new DogB(), new CatB()); // CatB[]
pair(new CatB(), new DogB()); // DogB[]

// ── § Dog와 Cat은 왜 실패하는가 ─────────────────────

// @ts-expect-error
pair(new Dog(), new Cat());

const a: Animal = new Dog();
const b: Animal = new Cat();
pair(a, b); // Animal[]

const c: Animal = new Dog();
pair(c, new Cat()); // Animal[]

pair<Animal>(new Dog(), new Cat()); // OK

// ── § 표현식 계산 vs 후보 수집 ──────────────────────

declare function fromArr<T>(xs: T[]): T;

const exprArr = [dog, cat];
const viaArr = fromArr([dog, cat]); // T := Cat | Dog

const cond = Math.random() > 0.5;
const exprCond = cond ? dog : cat;
pair(exprCond, exprCond);

pair<Dog | Cat>(new Dog(), new Cat()); // OK

// ── § infer 예외 ────────────────────────────────────

type CoV<T> = T extends { x: infer U; y: infer U } ? U : never;
type I1 = CoV<{ x: Dog; y: Cat }>; // Dog | Cat

// ── § 제약 ──────────────────────────────────────────

class Puppy extends Dog { p = 1 }
declare const animal: Animal, puppy: Puppy;

declare function f<T extends Dog>(x: T, y: T): T[];

const r1 = f(puppy, puppy);  // Puppy[]
const r2 = f(puppy, dog);    // Dog[]
// @ts-expect-error
const r3 = f(puppy, animal); // Error

declare function g<T extends Animal>(x: T, y: T): T[];
const r4 = g(puppy, animal); // Animal[]

declare function h<T extends Dog>(): T[];
const r5 = h(); // Dog[]

declare function h2<T>(): T[];
const r6 = h2(); // unknown[]
```

## 연결

- 다음에 확인할 질문: TypeScript는 왜 안전한 답을 알면서도 만들어 주지 않는가? 같은 성격의 선택이 배열과 메서드에도 있다.
- 이후에 확인할 질문: 타입에 대해 **조건을 묻는** 방법과, `infer`가 어떤 규칙으로 조각을 꺼내는가 → 「타입에 조건을 묻기: 조건부 타입과 infer」
