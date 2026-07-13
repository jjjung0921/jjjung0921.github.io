---
# Recommended paths:
# - src/content/notes/ko/<field>/<slug>.md
# - src/content/notes/<field>/<slug>.md
title: "타입스크립트를 들어가며"
lang: "ko"
translationKey: "introduction-to-typescript"
date: "2026-07-13"
# field: "web" | "game" | "programming-language" | "ai"
field: "programming-language"
category: "typescript"
series: "javascript/typescript"
# status: "draft" | "reading" | "implemented" | "stable"
status: "draft"
summary: "JavaScript의 동적 타입 특성과 TypeScript의 정적 타입 검사 과정을 비교합니다."
problem: "JavaScript의 타입 관련 문제는 언제 발견되며, TypeScript는 이를 어떻게 실행 전에 진단할까요?"
coreIdea: "TypeScript는 JavaScript에 정적 타입 검사 층위를 추가하고, 타입 정보를 제거한 JavaScript를 출력한다."
connection: "JavaScript 실행 모델, 정적 타입 시스템, TypeScript 컴파일러 구조"
tags: ["typescript", "javascript"]
---

# 타입스크립트를 들어가며

## 문제

**14기 멋쟁이사자처럼 프론트엔드 멘토**를 진행하며 새롭게 TypeScript 세션을 추가하게 되었다. 해당 포스트는 아래 2가지 주제를 다룬다.
1. 기존의 JavaScript에서는 어떤 문제가 발생할 수 있는가?
2. TypeScript는 이 문제를 어떻게 해결했는지 간략하게 overview를 제공한다.

2026/07/13인 현재 Javascript의 구체적인 포스트는 아직 작성이 되지 않았지만 추후 추가할 예정이기에 JS에 대해서는 알고 있다는 가정 하에 진행한다.

## 0. JS에는 무슨 문제가 있었는가?

> JS는 <strong>동적 타입 언어(Dynamically Typed Language)</strong>이다.

큰 틀에서 JS의 동작 과정을 그려보면 아래와 같다.

```
JavaScript Source Code
→ Parse
→ Scope / Binding Preparation
→ Runtime Execution
→ Expression Evaluation
   └─ actual value types에 따라
      property access / function call / operator / coercion 수행
→ Result or Runtime Error
```

위 과정에서 **Binding은 특정 스코프에서 식별자와 그에 대응하는 변수·함수·매개변수의 관계를 구성**하는 역할을 한다.

이후 **Runtime Execution에서는 선언문, 할당문, 함수 호출 등이 실행되면서 binding이 초기화되거나 새로운 값으로 갱신**되며

**Expression Evalution에서는 실제 값을 대상으로 프로퍼티 접근, 함수 호출, 연산자 적용, 암묵적 타입 변환 등이 수행**된다. 해당 연산을 수행할 수 없는 경우 **예외가 발생**할 수 있다.

JavaScript에는 binding 이후, 실제 실행 전에 값의 사용 관계를 검사하는 정적 타입 검사 단계가 없다. 따라서 부적절한 값 사용은 표현식이 실제 런타임 값으로 평가될 때 드러날 수 있다.

예를 들어, Number 타입의 원시값(primitive value)을 가지는 데이터에서 `toUpperCase` 같은 함수를 호출할 경우 해당 type에서는 호출할 수 없는 함수이기에 에러가 발생한다.

```js
const a = 10;
a.toUpperCase() //TypeError: a.toUpperCase is not a function
```
TypeScript는 가능한 런타임 값의 형태와 사용 관계를 **정적으로 모델링**하고, 코드가 실행되기 전에 일부 오류 가능성을 진단하기 위해 등장했다.

## 1. TypeScript의 등장

TypeScript는 앞서 말했듯 런타임 값의 형태를 모델링하고 이를 통해 "Expression Evaluation"에서 발생할 수 있는 일부 문제를 미리 찾기 위해 등장한 언어이다.

동작 과정은 아래와 같다.
```
TypeScript Source Code
→ Parse
→ Bind
→ Type Check
→ Transform
→ Emit
→ JavaScript Source Code
```

위 과정에서 **Type Check**라는 정적 타입 검사 과정이 추가됨으로써 실제 프로그램을 실행하지 않더라도 compile 과정에서 미리 일부 타입 관련 오류를 체크할 수 있다.

```ts
a = 10;
a.toUpperCase() //Property 'toUpperCase' does not exist on type '10'.
```

일반적인 TypeScript 컴파일 과정에서는 타입 정보가 제거되고 **JavaScript 소스 코드가 출력**된다. 이후 생성된 JavaScript가 브라우저나 Node.js 등의 JavaScript 런타임에서 실행된다.

## 연결

- 다음에 확인할 질문: TypeScript에서의 basic type
