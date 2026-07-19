---
# Recommended paths:
# - src/content/notes/ko/<field>/<slug>.md
# - src/content/notes/en/<field>/<slug>.md
title: "TypeScript는 JavaScript를 어떻게 정적으로 모델링하는가"
lang: "ko"
translationKey: "type-checking-in-typescript"
date: "2026-07-13"
# field: "web" | "game" | "programming-language" | "ai"
field: "programming-language"
category: "typescript"
series: "javascript/typescript"
# status: "draft" | "reading" | "implemented" | "stable"
status: "draft"
summary: "Javascript 배경 위에서 TypeScript의 정적 타입 검사 과정의 원리를 탐구합니다."
problem: "TypeScript가 정적 타입 검사를 진행하는 원리는 무엇일까요?"
coreIdea: ""
connection: ""
tags: ["typescript", "javascript"]
---

# 타입스크립트의 정적 모델링

## 문제

이전 글에서는 JavaScript에는 일반적으로 실행 전 정적 타입 검사 단계가 없으며, TypeScript가 다음과 같은 과정을 추가한다고 설명했다.

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

하지만 여기에는 다음 질문이 남는다.

> TypeScript의 Type Check는 JavaScript 프로그램의 무엇을 검사하는가?

TS를 컴파일한 JS 파일에는 우리가 TS에서 선언한 type이 남지 않는 것을 알 수 있다.

즉, TS는 JS 런타임에 새로운 타입 객체를 추가하는 방식으로 동작하지 않는다는 것을 의미한다. 대신, 프로그램이 실행될 때 각 표현식이 가질 수 있는 값을 정적으로 근사하고, 그 값에 수행하려는 연산이 안전한지를 검사한다.

위 과정을 이해하기 위해 총 6개의 단계로 나눠서 학습한다.

```
Type erasure
→ Structural typing
→ Types as sets
→ Type inference
→ Control-flow analysis
→ Soundness boundaries
```

위 6개의 단계를 아래 6개의 질문에 대한 답이다.

1. 타입은 런타임에 남는가?
2. 두 타입의 호환성은 무엇으로 결정되는가?
3. 타입은 어떤 의미를 가지는가?
4. 타입을 직접 쓰지 않으면 compiler는 어떻게 알아내는가?
5. 조건문을 통과하면서 타입은 어떻게 달라지는가?
6. TypeScript의 검사는 어디까지 신뢰할 수 있는가?

## 0. Overview
TypeScript에서 type의 탄생은 아래와 같은 과정을 가진다.
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

TS에서의 type은 js의 runtime에서의 value 혹은 type 그 자체가 아니다.

그보다는 potentially invalid한 operation을 감지하기 위해 특정 표현식이 런타임에 가질 가능성이 있는 값들을 **정적으로 추상화(static abstraction)** 한 대상으로 이해해야 한다.

예를 들어, 다음 변수의 런타임 값은 number type을 가지는 숫자 10이다.
```ts
const value:number = 10;
```
위 TS의 `number`는 별도의 런타임 객체가 아니다. `value`가 숫자 값 중 하나를 가진다는 정적 정보일 뿐이다.

## 1. Type Erasure: TS에서의 type은 런타임에 남지 않는다.
다음 TS 코드를 살펴보자.
```ts
function greet(name: string): string {
  return `Hello, ${name}`;
}
```
위 코드를 JS로 compile하면 아래가 된다.

```js
function greet(name) {
  return `Hello, ${name}`;
}
```
우리가 TS에서 정의한 type, `string`은 JS에 남지 않았다. 우리가 TS에서 작성하는 type annotation은 다음 단계에서만 사용된다.
```
TypeScript Source
        │
        ├─ name은 string인가?
        ├─ 반환값은 string인가?
        │
        ▼
Type Check
```
TS의 공식 문서에서는 이러한 개념을 **Erased Types**로 정의하며 type annotation은 JS의 일부가 아니며, TS에서 *대부분의 고유 타입 정보*는 emit 과정에서 제거된다고 설명한다. 이는 type annotation 자체가 프로그램 runtime에서의 동작에 영향을 주지 않음을 의미한다.

<details>
<summary>필자의 생각</summary>
위 특성을 알았다면, TS의 본질에 대해서 다시 고민해볼 필요가 있다. TS는 결국 컴파일 타임에서 타입에 의한 런타임 에러를 미리 감지하기 위해 등장한 언어이다. 만약 프로그래머가

1. 타입에 대한 확신을 가지고 있거나
2. JS가 가지고 있는 자유도를 활용

하고 싶다면 .ts보다는 .js를 선택하는 것이 더욱 현명할 것이다.
</details>

> [!warning] 단, 일반 `enum`처럼 runtime JS를 생성하는 기능도 존재한다.

위 `enum`은 TypeScript가 `enum`을 타입이면서 동시에 JavaScript 객체로 사용할 수 있는 기능으로 설계했기에 등장하는 예외이다.

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
## 2. Structural typing: 이름이 아니라 구조를 비교한다
TS는 type의 이름이 아닌 구조(structure)를 중심으로 동작한다. 아래 코드를 보자.
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
`labeledPoint`는 `Point`을 `implements`한다고 선언하지 않았다.

하지만 `x:number`와 `y:number`라는 멤버를 가지고 있음으로써 `Point`가 요구하는 구조를 만족한다.따라서 결과는 `10 20`이 제대로 출력된다.

우리는 이를 **structural subtyping**이라고 정의한다. 수식으로 정의하면 아래와 같다.

$$
S={x:\text{number},y:\text{number},label:\text{string}}\\
T={x:\text{number},y:\text{number}}
$$

$S$는 $T$가 요구하는 모든 멤버에 호환 가능하므로 $S\preceq T$과 같은 할당이 가능하다. 우리는 이를 $S$와 $T$ 간의 **assignability 관계**를 표현했다고 한다.

실제 JS runtime에서는 TS에서의 `Point`는 남지 않으며 `labeledPoint` 객체만 존재하고 필요한 멤버만 사용하게 된다.
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

## 3. Types as sets: 타입은 가능한 값의 집합이다
개인적으로 type에 대한 이해를 꿰뚫는 가장 중요한 문장이 아닐까 한다. 타입을 가능한 값들의 집합(set of values)로 이해하면 유연한 사고가 가능해진다.

예를 들어, `string`타입은 JS에서 가능한 모든 문자열 값의 집합으로, `number`는 JS에서 가능한 모든 숫자 값들의 집합으로 해석할 수 있다.
$$
[[\text{string}]]=\{"","hello","GET",...\}\\
[[\text{number}]]=\{0, 1, -1, 3.14, \text{NaN} ...\}
$$
이제 우리는 type을 일종의 집합 연산으로 이해하며 계산할 수 있다.
### 3.1 Union Type
```ts
type ID = string | number;
```
`ID`는 `string` 값의 집합과 `number` 값 집합의 합집합이다.
$$
[[\text{ID}]]=[[\text{string}]]\cup[[\text{number}]]
$$

따라서 아래 값들은 모두 `ID` 타입에 해당한다.

```ts
const id1: ID = 10;
const id2: ID = "user-10";
```

하지만 `number`와 `string` 모두에 속하지 않는 `object`는 `ID` 타입을 가질 수 없다.

### 3.2 type은 합집합, 연산은 교집합
```ts
function printId(id: string | number) {
  id.toUpperCase();
}
```
`toUpperCase()`는 `string`에는 존재하지만 `number`에는 존재하지 않는다.

이런 경우, `id`가 실제로는 `number`일 수 있으므로 호출이 허용되지 않는다.

안전한 연산을 위해서는 가능한 연산의 집합은 교집합이 되어야 하는 것이다.

$$
[[\text{IDOps}]]=[[\text{string}]]\cap[[\text{number}]]
$$

### 3.3 Type alias는 새로운 값 집합을 만들지 않는다
```ts
type UserId = string;
type UserName = string;
```
두 alias는 이름이 다르지만 같은 `string` 값의 집합을 표현한다.
$$
[[UserId]]=[[UserName]]=[[string]]
$$
집합의 관점에 두 alias는 동일한 집합을 의미하기에 구분할 수 없다. 따라서 아래와 같은 코드도 가능하다.

```ts
let id: UserId = "user-1";
let name: UserName = "Lee";

id = name; // No Error!
```
Type alias는 기존 타입에 이름을 붙일 뿐, 독립적인 nominal type identity를 생성하지 않는다.

## 4. Type inference: compiler는 타입을 어떻게 추론하는가
```ts
const count = 10;
````
위 코드에서 우리는 `count`를 `number`라고 지정하지 않았지만 TS는 initializer인 `10`을 분석하여 `count`의 타입이 `number`임을 추론한다.

`const`에서의 binding을 재할당이 불가능하기에 `count`를 literal type인 `10`으로 쉽게 추론할 수 있다. 하지만 binding의 재할당이 가능한 `let`의 경우를 살펴보자.

```ts
let count = 10;
count = 20;
```

이 경우 `count`가 `10`에서 `20`으로 rebinding되므로 literal type인 `10`으로 추론하면 위험하다. 즉, 더 넓은 `number`타입으로 추론해야 된다.

### 4.1 Contextual typing
타입 정보를 추론할 때 사용하는 데이터는 단방향으로 사용하지 않는다. 대신 "문맥(context)"를 사용하게 된다.
```ts
const names = ["Alice", "Bob"];

names.forEach((name) => {
  console.log(name.toUpperCase());
});
```
현재 `name`에는 명시적인 type annotation은 존재하지 않는다. 하지만 코드의 문맥을 통해 다음 과 같은 type 추론이 가능해진다.

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
이와 같이 표현식이 사용되는 시점에 타입이 정해지는 것을 **contextual typing**이라고 한다.

### 4.2 Mutability와 타입 정밀도
```ts
let method = "GET";
// string

const fixedMethod = "GET";
// "GET"
```
앞서 살펴본 `name`의 예시와 유사하다. 변수값의 변경 가능성이 클수록 TS는 타입을 넓게 추론할 수밖에 없다.
$$
\text{Mutability}\propto\frac{1}{\text{precise type}}
$$
다만, const 객체의 경우 다시 생각을 해봐야 한다. 아래 예시를 보자.
```ts
const request = {
  method: "GET",
};

request.method = "POST";
```
위 코드에는 문제가 없다. `request.method`는 `GET`이 아닌 `string`으로 추론되기 때문이다. `request`는 `const` 객체인데 어떻게 porperty인 `method`의 값은 `GET`이 아니라 더 넓은 type인 `string`으로 추론될까?

객체와 변수가 할당될 때 동작하는 재바인딩을 생각해보면 된다. `const`에 의해 재바인딩에 제약을 받는 대상은 객체인 `request`이다. `request`의 속성인 `method`에 어떤 값이 할당(`assignment`)되는지는 고려하지 않는다. 즉, `method`는 `const`의 제약 바깥에 있는 대상이라는 의미이다.

만약 property를 `literal type`으로 지정하고 싶다면 `as const` 키워드를 사용하면 된다.
```ts
request:
{
  readonly method: "GET"
}
```
`readonly`는 TS에서의 문법일 뿐이며 실제 JS 수준에서의 제약 (eg. `Object.freeze()`)을 만들지는 않는다.

## 5. Control-flow analysis: 타입은 코드 위치에 따라 달라진다
아래 코드에서 `value`의 선언 타입은 `string | number`이다.
```ts
function normalize(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); //string
  }

  return value.toFixed(2);
}
```
하지만 `typeof`라는 키워드를 통해 함수의 위치에 따라 type을 좁혀주는 모습을 보인다.
```
함수 진입
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
`typeof value === "string"`이 참인 branch에서는 value가 string으로 좁혀진다.

이와 반대의 브랜치의 경우 자연스럽게 `number` 타입으로 추론이 가능하다.

이를 **narrowing**이라고 한다.

위 예시와 같이 JS 제어 흐름을 바탕으로 각 point에서 가능한 타입을 계산하는 것을 **control-flow analysis**라고 한다.

`typeof`의 경우, 타입에 따라 호출되는 함수의 호환성이 달라지므로 JS의 runtime에 영향을 미친다. 이런 이유로 `typeof`는 JavaScript에 남아 본인의 역할을 수행한다.

## 6. Soundness boundaries: TypeScript가 모든 오류를 막지는 않는다
앞서 언급했듯, TS의 목적은 **JS의 자유성을 일부 제한하여 Runtime에서 발생할 수 있는 오류들을 미리 찾아내는 것**이다.

하지만 타입에 의한 제약이 너무 강해지면 JS가 가지는 자유도에 대한 장점이 사라진다. 즉, 자유도와 제약성 간의 tradeoff를 잘 따져야 한다.

이에 JS의 자유도를 확보하기 위해 TS의 보장이 약해지는 구간들이 일부 존재한다.

### 6.1 `any`
```ts
let value: any = 10;

value.toUpperCase(); //No compile error! Yes Runtime error!
```
`value`의 실제 런타임에서의 값은 숫자지만 TypeScript 오류가 발생하지 않는다.
```
Static checking:
value: any
→ 검사 생략

Runtime:
10.toUpperCase()
→ TypeError
```
`any`는 정적 검사를 비활성화하기에 컴파일 에러가 발생하지 않는다.

### 6.2 Type Assertions
**Type Assertions**는 컴파일러는 특정 변수 혹은 객체의 타입을 알 수 없지만 사용자는 대상의 타입을 알 수 있을 때 컴파일러에게 타입에 대한 정보를 주는 방식이다.

이는 사용자가 TS 컴파일러에게 타입에 대한 정보를 주는 것이기에 실제 JS runtime 상에서의 타입을 보장하지 않는다. 즉, 런타임 상에서의 실제 변수를 우리가 선언한 타입으로 변환하지는 않는다는 것이다.

```ts
const value = 10 as unknown as string;

value.toUpperCase();
```
에를 들어, 위 코드를 JS로 emit하면 아래와 같다.

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
`as User`가 input을 점증하지 않기에 TS는 `input` 문자열의 실제 구조를 알 수 없다. 즉, 아래와 같은 입력이 들어오는 것은 compile 시에 확인이 불가능하다.

```ts
{
  "name": 10
}
```
이러한 경우를 막기 위해서는 Runtime 상에서의 별도의 타입 검증 절차를 추가해줘야 한다.

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
## 7. 연습
아래 코드를 바탕으로 TS에서의 type이 어떻게 해석될지 생각해보자.
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

## 8. 결론
가장 중요한 점은 대부분의 경우 TS의 타입 시스템은 JS Runtime에서 새로운 타입 객체를 추가하지 않는다는 점이다.

대신, JavaScript 표현식이 가질 수 있는 값을 정적으로 추상화한다.
```text
Type erasure
→ 타입은 정적 분석 단계에만 존재한다.

Structural typing
→ 타입 호환성은 주로 멤버 구조로 결정된다.

Types as sets
→ 타입은 가능한 런타임 값의 집합으로 해석할 수 있다.

Type inference
→ compiler는 값과 사용 문맥으로부터 타입을 계산한다.

Control-flow analysis
→ 조건과 도달 가능성에 따라 program point별 타입을 좁힌다.

Soundness boundaries
→ any, assertion, 외부 입력 등에서는 정적 보장이 약해질 수 있다.
```

지금까지의 내용을 한 문장으로 정리하자.

> TypeScript는 JavaScript 프로그램의 가능한 런타임 값을 정적으로 **근사**하고, 그 근사에 비추어 안전하지 않을 가능성이 있는 연산을 실행 전에 진단한다.

TS은 새로운 런타임 시스템을 제공하기보다 JS의 엔진 위에서 구성된 **erasable structural static type system**이다. 모든 Runtime 상에서의 오류를 잡지는 못하지만 많은 부분에서의 오류를 컴파일 과정에서 찾아낼 수 있다.

## 연결

- 다음에 확인할 질문: TypeScript에서의 basic type