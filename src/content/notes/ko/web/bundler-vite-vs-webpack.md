---
# Recommended paths:
# - src/content/notes/ko/<field>/<slug>.md
# - src/content/notes/en/<field>/<slug>.md
title: "번들러는 무엇을 없애는가"
lang: "ko"
translationKey: "bundler-vite-vs-webpack"
date: "2026-08-08"
# field: "web" | "game" | "programming-language" | "ai" | "blog"
field: "web"
category: "아키텍처"
series: "모먼트 커피"
order: 2
# status: "draft" | "reading" | "implemented" | "stable"
status: "draft"
summary: "1편에서 미뤄 둔 질문. 번들러는 어떤 원리로 안 쓰는 코드를 제거하며, Vite와 Webpack은 그 지점에서 어떻게 갈라지는가."
problem: "번들러는 무엇을 하는 도구이며 어떤 원리로 동작하는가? 이 프로젝트의 요구에 왜 Vite가 더 맞는가?"
coreIdea: "tree-shaking은 값이 정적으로 확정될 때만 성립한다. 번들러의 능력 차이보다 중요한 것은 그 경로가 기본값인가, 그리고 N번 반복되는 빌드에서 속도가 곧 비용이 된다는 점이다."
connection: "의존성 그래프, ESM 정적 구조, 상수 폴딩, 데드코드 제거, Rolldown"
tags: ["아키텍처", "번들러", "vite", "webpack", "모먼트커피"]
---

# 번들러는 무엇을 없애는가

## 1. 1편이 남긴 질문

[1편](/notes/tenant-split-frontend-backend/)에서 프론트엔드를 사업자마다 별도 빌드하기로 했다. 근거는 명세의 C2였다.

> 비활성 모듈의 화면·탭은 **빌드에서 제외**된다

그리고 이런 제약이 따라 나왔다. **런타임 조건문으로는 이 요구를 만족할 수 없다.**

실행 중에 `if (config.enabledModules.includes("reward"))`로 판정하면 리워드 화면 코드는 어차피 번들에 들어 있다. 화면에 안 보일 뿐 사용자는 그 코드를 다운로드한다.

그래서 번들러 선택이 아키텍처 결정이 되었고 Vite를 채택했다. 이 글은 그때 미뤄 둔 세 가지를 갚는다.

1. 번들러는 대체 무엇을 하는 도구인가
2. 어떤 원리로 안 쓰는 코드를 없애는가
3. Vite와 Webpack은 그 원리의 어디에서 갈라지며, 왜 이 프로젝트에는 Vite인가

---

## 2. 번들러는 원래 무엇을 하는 도구였나

시작은 단순한 문제였다. **브라우저가 모듈 시스템을 몰랐다.**

`<script>` 태그로 파일을 순서대로 불러오던 시절, 파일이 수십 개가 되면 순서 하나만 틀려도 앱이 죽었다. 전역 네임스페이스는 서로를 덮어썼다. 그래서 CommonJS·AMD 같은 모듈 규약이 등장했는데 브라우저는 그걸 실행할 줄 몰랐다.

번들러의 최초 임무는 여기서 나왔다. **여러 모듈을 브라우저가 이해하는 하나의 파일로 합치는 일이었다.** 이름 그대로 묶는(bundle) 도구였다.

그런데 지금은 사정이 다르다. 브라우저가 ES Module을 네이티브로 지원하고 HTTP/2가 다중 요청 비용을 낮췄다. "합치는 것" 자체는 예전만큼 절박하지 않다.

대신 남은 게 있다. 번들러가 모듈 그래프 전체를 들여다보는 김에 하게 된 일들이다.

| 하는 일 | 내용 |
|---|---|
| **변환** | TypeScript·JSX를 브라우저가 아는 형태로 |
| **그래프 분석** | 무엇이 무엇을 import 하는지 전체 지도 작성 |
| **최적화** | 안 쓰는 코드 제거, 상수 인라인, 이름 축약 |
| **분할** | 초기 로드에 필요 없는 부분을 별도 청크로 |
| **자산 처리** | 이미지·CSS를 해시 붙은 파일로, 참조 경로 재작성 |

우리에게 중요한 건 세 번째다. **번들러가 그래프 전체를 알고 있어서 "이건 아무도 안 쓴다"를 판정할 수 있다는 것.**

---

## 3. 동작 원리 — 그래프를 만들고, 줄이고, 자른다

### 3.1 진입점에서 그래프를 만든다

번들러는 진입점(entry) 하나에서 출발해 `import`를 따라간다.

```
main.tsx
 ├─ import App from "./App"          → App.tsx
 │   ├─ import { Button } from "@/shared/ui"   → Button.tsx
 │   └─ import { routes } from "./routes"      → routes.ts
 │        └─ import("@/modules/reward/routes") → (동적) reward 청크 후보
 └─ import "./styles.css"            → styles.css
```

이 탐색이 끝나면 **도달 가능한 모듈의 집합**이 나온다. 여기에 없는 파일은 프로젝트에 존재해도 번들에 들어가지 않는다. 첫 번째 필터가 여기서 걸린다.

### 3.2 안 쓰는 export를 털어낸다 — tree-shaking

도달 가능한 모듈 안에서도 안 쓰는 부분이 있다.

```ts
// utils.ts
export function formatPrice(n: number) { /* ... */ }
export function formatDate(d: Date) { /* ... */ }   // 아무도 안 쓴다

// main.ts
import { formatPrice } from "./utils";
```

`formatDate`는 최종 번들에서 빠진다. 이걸 **tree-shaking**이라고 부른다. 그래프를 나무로 보고 안 쓰는 가지를 흔들어 떨어뜨린다는 비유다.

**이게 되는 이유는 ES Module이 정적이기 때문이다.** `import`/`export`는 파일 최상단에만 올 수 있고 이름이 실행 전에 확정된다. 그래서 번들러가 코드를 **실행하지 않고도** 누가 무엇을 쓰는지 알 수 있다.

CommonJS는 그렇지 않다.

```js
const name = someCondition ? "formatPrice" : "formatDate";
const fn = require("./utils")[name];   // 실행해 봐야 안다
```

무엇을 쓸지가 런타임에 정해지니 번들러는 **아무것도 지울 수 없다.** 이것이 tree-shaking의 근본 전제다 — **정적으로 확정되어야 지울 수 있다.**

### 3.3 값이 확정되면 분기도 지운다

여기서부터가 1편의 요구와 직접 닿는다. 번들러는 값이 확정된 조건문도 정리한다.

```ts
if (false) {
  doSomething();     // 도달 불가 → 통째로 제거
}
```

이걸 **데드코드 제거**라고 한다. 그런데 `if (false)`를 직접 쓰는 사람은 없다. 실제로는 **상수 폴딩**을 거쳐 이 형태가 된다.

```ts
const DEBUG = false;
if (DEBUG) { ... }        // DEBUG를 false로 접고 → if (false) → 제거
```

번들러가 값을 **접을 수 있어야** 한다. 값이 변수를 타고 흐르거나 함수 호출 결과라면 번들러는 접지 못하고 못 접으면 분기도 못 지운다.

### 3.4 청크로 자른다

`import()`를 만나면 그 지점을 경계로 별도 파일(청크)을 만든다. 초기 로드에 필요 없는 코드를 뒤로 미루는 장치다.

여기에 3.3이 겹치면 이렇게 된다.

```ts
...(SOME_LITERAL_FALSE ? [{ lazy: () => import("./reward") }] : [])
```

분기가 제거되면 그 안의 `import()`도 함께 사라진다. **그래프에서 탈락하므로 청크 자체가 생성되지 않는다.**

---

## 4. 우리 요구는 이 원리의 어디에 걸리는가

이제 1편의 C2를 원리 위에 올려놓을 수 있다. **모듈 플래그를 리터럴로 만들기만** 하면 된다.

Vite의 `define`은 런타임 조회가 아니라 **빌드 시 소스 텍스트 치환**이다.

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
// routes.ts — 동적 import가 조건 분기 "안에" 있어야 한다
const routes = [
  { path: "/",     lazy: () => import("@/modules/menu/routes") },
  { path: "/cart", lazy: () => import("@/modules/cart/routes") },

  ...(__MODULE_REWARD__ ? [{ path: "/reward", lazy: () => import("@/modules/reward/routes") }] : []),
  ...(__MODULE_STORE__  ? [{ path: "/store",  lazy: () => import("@/modules/store/routes")  }] : []),
];
```

리워드를 안 쓰는 사업자로 빌드하면 3장의 단계가 순서대로 발동한다.

```
config.json  { enabledModules: ["menu", "cart", "order"] }    // reward 없음
      ↓  define — 소스 텍스트 치환
__MODULE_REWARD__  →  리터럴 false
      ↓  3.3 상수 폴딩 + 데드코드 제거
...(false ? [...] : [])  →  분기 제거
      ↓  3.1 그래프에서 탈락
import("@/modules/reward/routes") 가 사라짐
      ↓  3.4
reward 청크가 아예 생성되지 않는다
```

**플래그는 변수가 아닌 리터럴이어야 한다. 그게 전부다.** `config.enabledModules.includes("reward")`처럼 런타임 값으로 판정하면 3.3에서 접히지 않고 접히지 않으면 그 뒤가 전부 안 일어난다. 코드는 똑같이 동작하는데 번들만 안 줄어든다.

---

## 5. 여기서 실제로 깨진다

이건 **규율로 지켜야 하는 구조**다. 라이브러리가 보장해 주지 않는다. 실패 모드가 있고 두 개가 압도적으로 흔하다.

### F1. `import.meta.env.VITE_*`로 플래그를 넘긴다

`.env` 값은 **항상 문자열**이다.

```ts
// .env: VITE_MODULE_REWARD=false
if (import.meta.env.VITE_MODULE_REWARD) { ... }   // "false"는 truthy
```

문자열 `"false"`는 참이므로 분기가 **절대** 제거되지 않는다. `define` + `JSON.stringify(boolean)`으로 진짜 불리언 리터럴을 주입해야 한다.

### F2. 동적 import를 모듈 최상단에 선언한다

```ts
// 이러면 안 된다 — import가 이미 그래프에 편입된다
const Reward = lazy(() => import("./reward"));
const routes = [...(__MODULE_REWARD__ ? [{ path: "/reward", element: <Reward /> }] : [])];
```

분기를 지워도 위쪽 선언이 남아 있으므로 3.1에서 이미 도달 가능으로 판정된다. **청크는 그대로 생성된다.** `import` 문 자체가 조건 분기 안에 있어야 한다.

> [!warning] 왜 이 둘이 특히 위험한가
> F1과 F2는 **동작이 완전히 정상이다.** 화면도 뜨고 라우팅도 맞고 테스트도 통과한다. 잘못된 건 번들 크기 하나뿐이고 그건 번들을 직접 열어봐야 보인다.

### 그래서 CI 게이트가 필요하다

사람이 매번 확인할 수 없으므로 자동화한다. 빌드 산출물에서 **비활성 모듈의 흔적이 없는지** 검사하는 단계를 파이프라인에 넣는다.

```
vite build (TENANT=b)
  → dist/ 를 스캔
  → reward 청크 파일이 존재하면 실패
  → 청크 내용에 리워드 전용 식별자가 있으면 실패
```

1편에서 "C2를 충족한다"고 주장했는데 그 주장을 **지속적으로 참으로 유지하는 장치**가 이것이다. 없으면 어느 커밋에선가 조용히 깨지고 아무도 모른다.

---

## 6. Vite와 Webpack은 어디서 갈라지는가

### 6.1 개발 서버 — 번들하느냐 마느냐

**Webpack**은 개발 중에도 번들을 만든다. 파일을 고치면 영향 범위를 다시 번들해서 서빙한다. 프로젝트가 커질수록 첫 기동과 갱신이 함께 느려진다.

**Vite**는 개발 중에 번들하지 않는다. 브라우저가 ESM을 네이티브로 지원한다는 사실을 이용해 **요청이 온 파일만 그때그때 변환해서** 돌려준다. 파일 수가 늘어도 초기 기동 시간이 크게 늘지 않는다.

이 차이가 Vite가 알려진 이유의 대부분이지만 **우리 결정과는 직접 관련이 없다.** C2는 프로덕션 빌드의 문제다.

### 6.2 프로덕션 빌드 — Vite 8에서 엔진이 바뀌었다

이 부분은 최근에 달라져서 짚어야 한다.

| | 프로덕션 빌드 엔진 |
|---|---|
| Vite 7 이하 | 개발은 esbuild, 프로덕션은 **Rollup** — 두 엔진 |
| **Vite 8** (2026년 3월 stable) | **Rolldown** 하나로 통합. Rust로 작성됐고 Rollup API의 드롭인 대체를 목표로 함 |
| Webpack | 자체 엔진 (JavaScript) |

Vite 팀이 공개한 19,000 모듈 벤치마크에서 Rollup 40.10초 → Rolldown 1.61초로 약 25배 단축됐다고 한다. 소규모 프로젝트는 2배에서 5배, 대규모는 10~30배 범위로 보고된다.

**우리 맥락에서 이 숫자가 특별한 의미를 갖는다.** 사업자가 N명이면 빌드를 N번 돌린다. 1편 8장에 "전체 빌드 15분 초과"를 재검토 트리거로 적어 뒀는데 빌드 엔진 속도가 **그 트리거에 도달하는 시점을 직접 미룬다.** 일반적인 프로젝트에서 빌드 시간은 개발 편의지만 우리 구조에서는 확장 한계선이다.

### 6.3 tree-shaking 품질

Rollup 계열은 ESM 그래프 기반 분석이 깔끔하다는 평이 오래 있었고 같은 프로젝트를 비교했을 때 Vite 산출물이 Webpack보다 작게 나오는 경향이 보고된다. Webpack도 5 이후 tree-shaking을 계속 개선했지만 CommonJS 상호운용을 넓게 지원해야 해서 판단이 보수적으로 기우는 지점이 있다.

다만 이 차이는 **정도의 문제다.** 가능·불가능을 가르지는 않는다. 아래가 더 중요하다.

### 6.4 설정 철학

**Webpack으로도 우리 요구를 만족시킬 수 있다.** `DefinePlugin`이 `define`과 같은 일을 한다.

```js
// webpack.config.js
new webpack.DefinePlugin({
  __MODULE_REWARD__: JSON.stringify(cfg.enabledModules.includes("reward")),
})
```

차이는 다른 데 있다.

| | Vite | Webpack |
|---|---|---|
| 상수 주입 | `define` — 기본 옵션 | `DefinePlugin` — 플러그인 |
| 프로덕션 최적화 | 기본값으로 활성 | `mode: 'production'` 전제 |
| TS·JSX·CSS | 기본 지원 | loader 구성 필요 |
| 설정 표면 | 작다 | 크고 세밀하다 |

Webpack의 큰 설정 표면은 **목적이 다를 뿐**이다. 복잡한 레거시 파이프라인을 다뤄야 할 때는 그 세밀함이 곧 능력이 된다.

---

## 7. 그래서 왜 이 프로젝트에는 Vite인가

두 가지다.

**첫째, 기본 경로냐 조립이냐.** 우리가 의존하는 사슬은 `define → 상수 폴딩 → 데드코드 제거 → 그래프 탈락` 네 단계다. Vite에서는 이게 전부 기본 동작이다. Webpack에서도 되지만 플러그인과 모드 설정을 맞춰야 하고 **맞춰야 할 것이 많을수록 F1·F2 같은 실수가 들어올 자리가 넓어진다.** 이 사슬은 조용히 깨지는 종류라서 표면적이 작을수록 낫다.

**둘째, 빌드를 N번 돌린다.** 1편의 구조에서는 빌드 속도가 **사업자 수를 늘릴 수 있는 상한**을 직접 결정한다. 6.2에서 본 엔진 교체가 여기에 그대로 꽂힌다.

> 결정 근거는 "Vite가 더 좋다"가 아니라 **"우리가 기대는 사슬이 Vite에서는 기본값이고, 반복 빌드에서 속도가 곧 확장 한계"** 다.

---

## 8. Vite가 불리한 경우

다음 경우에는 trade-off가 Webpack 쪽으로 기운다.

- **CommonJS 레거시 의존성이 많은 경우.** ESM 기반 분석의 이점이 줄고 상호운용 처리에서 Webpack의 축적된 대응이 유리할 수 있다
- **Webpack 생태계에만 있는 특수 loader가 필요한 경우.** 오래된 사내 툴체인에서 흔하다
- **Module Federation을 쓰는 마이크로프론트엔드.** Webpack이 이 영역의 사실상 표준이고 성숙도 차이가 있다
- **빌드 산출물을 아주 세밀하게 통제해야 하는 경우.** 설정 표면이 큰 쪽이 유리하다

우리 프로젝트는 신규이고 의존성이 현대적이며 마이크로프론트엔드가 아니다. 그래서 위 항목에 하나도 걸리지 않는다. **조건이 달랐다면 답도 달랐을 것이다.**

---

## 9. 다음 글

번들러 이야기는 여기서 닫는다. 정리하면 이렇다.

> tree-shaking은 **값이 정적으로 확정될 때만** 성립한다. 우리는 그 성질에 기대어 C2를 만족시켰고 그 사슬이 기본 경로인 도구를 골랐다.

다음 글은 상태 계층으로 넘어간다. 백엔드가 진실 소스가 되는 순간 프론트엔드가 들고 있는 데이터의 성격이 바뀐다. **서버 데이터를 값이 아니라 캐시로 취급한다는 게 무슨 뜻인지**, 그 관점이 라이브러리 선택을 어떻게 결정했는지 다룬다.

---

## 참고

- [Vite 8 Beta: The Rolldown-powered Vite](https://vite.dev/blog/announcing-vite8-beta) — Rolldown 통합과 벤치마크
- [Rolldown Integration | Vite](https://v7.vite.dev/guide/rolldown) — Vite 7 시점의 opt-in 안내
