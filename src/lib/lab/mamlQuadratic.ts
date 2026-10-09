// 이차 task 예시: L_i(θ) = ½ (θ − c_i)ᵀ A_i (θ − c_i), θ ∈ R².
// 안쪽 한 걸음 θ_i' = θ − α A_i (θ − c_i) 이므로 ∂θ_i'/∂θ = I − α A_i.
// 목적식이 모두 이차라 최적점과 등고선을 닫힌 꼴로 구한다.
// 목적식은 task 평균으로 둔다 — 합으로 두어도 최적점은 같고, 평균이면 배치 크기와 β가 섞이지 않는다.

export type Vec = [number, number];
/** 대칭 2×2 행렬 [[a, b], [b, d]] */
export type Sym = { a: number; b: number; d: number };

export interface Task {
  center: Vec;
  hessian: Sym;
}

export type Method = 'maml' | 'fomaml' | 'joint';
export const METHODS: Method[] = ['maml', 'fomaml', 'joint'];

const add = (p: Sym, q: Sym): Sym => ({ a: p.a + q.a, b: p.b + q.b, d: p.d + q.d });
const scale = (p: Sym, s: number): Sym => ({ a: p.a * s, b: p.b * s, d: p.d * s });
const mulVec = (m: Sym, v: Vec): Vec => [m.a * v[0] + m.b * v[1], m.b * v[0] + m.d * v[1]];
// 곱하는 행렬은 모두 같은 A_i의 다항식이라 서로 교환되고, 곱도 대칭이다.
const mul = (p: Sym, q: Sym): Sym => ({
  a: p.a * q.a + p.b * q.b,
  b: p.a * q.b + p.b * q.d,
  d: p.b * q.b + p.d * q.d,
});
const identityMinus = (alpha: number, m: Sym): Sym => ({ a: 1 - alpha * m.a, b: -alpha * m.b, d: 1 - alpha * m.d });

export function eigen(m: Sym): { values: [number, number]; angle: number } {
  const tr = m.a + m.d;
  const disc = Math.sqrt(((m.a - m.d) / 2) ** 2 + m.b ** 2);
  const angle = 0.5 * Math.atan2(2 * m.b, m.a - m.d); // 큰 고유값의 고유벡터 방향
  return { values: [tr / 2 + disc, tr / 2 - disc], angle };
}

const spectralRadius = (m: Sym) => Math.max(...eigen(m).values.map(Math.abs));

function solve(m: Sym, v: Vec): Vec {
  const det = m.a * m.d - m.b * m.b;
  return [(m.d * v[0] - m.b * v[1]) / det, (-m.b * v[0] + m.a * v[1]) / det];
}

function rotated(l1: number, l2: number, rad: number): Sym {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return { a: l1 * c * c + l2 * s * s, b: (l1 - l2) * c * s, d: l1 * s * s + l2 * c * c };
}

/** 재현 가능한 난수 (mulberry32) */
export function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** count개 task. 최적해는 반지름 spread 근처에 흩어지고, 곡률(고유값)과 가파른 방향은 task마다 다르다. */
export function makeTasks(count: number, spread: number, seed: number): Task[] {
  const r = rng(seed);
  const tasks: Task[] = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (2 * Math.PI * i) / count + (r() - 0.5) * 0.9;
    const radius = spread * (0.55 + 0.6 * r());
    tasks.push({
      center: [1.25 * radius * Math.cos(angle), 0.85 * radius * Math.sin(angle)],
      hessian: rotated(1.5 + 3 * r(), 0.3 + 0.5 * r(), Math.PI * r()),
    });
  }
  return tasks;
}

/** 방법별 기울기 계수 W_i: ∇ = mean_i W_i (θ − c_i) */
export function weight(task: Task, alpha: number, method: Method): Sym {
  const A = task.hessian;
  const J = identityMinus(alpha, A); // ∂θ_i'/∂θ
  if (method === 'joint') return A;
  if (method === 'fomaml') return mul(A, J); // 앞의 J 를 I 로 버림
  return mul(J, mul(A, J));
}

export function gradient(tasks: Task[], alpha: number, method: Method, theta: Vec): Vec {
  const g = tasks.reduce<Vec>((acc, t) => {
    const w = mulVec(weight(t, alpha, method), [theta[0] - t.center[0], theta[1] - t.center[1]]);
    return [acc[0] + w[0], acc[1] + w[1]];
  }, [0, 0]);
  return [g[0] / tasks.length, g[1] / tasks.length];
}

export function meanWeight(tasks: Task[], alpha: number, method: Method): Sym {
  return scale(tasks.map((t) => weight(t, alpha, method)).reduce(add), 1 / tasks.length);
}

/** 기울기가 0인 점 (fomaml 은 안장점일 수 있다) */
export function stationary(tasks: Task[], alpha: number, method: Method): Vec {
  const rhs = tasks.reduce<Vec>((acc, t) => {
    const w = mulVec(weight(t, alpha, method), t.center);
    return [acc[0] + w[0], acc[1] + w[1]];
  }, [0, 0]);
  return solve(meanWeight(tasks, alpha, method), [rhs[0] / tasks.length, rhs[1] / tasks.length]);
}

export function adapt(task: Task, alpha: number, theta: Vec): Vec {
  const g = mulVec(task.hessian, [theta[0] - task.center[0], theta[1] - task.center[1]]);
  return [theta[0] - alpha * g[0], theta[1] - alpha * g[1]];
}

export function taskLoss(task: Task, theta: Vec): number {
  const r: Vec = [theta[0] - task.center[0], theta[1] - task.center[1]];
  const Ar = mulVec(task.hessian, r);
  return 0.5 * (r[0] * Ar[0] + r[1] * Ar[1]);
}

/** 적응 전 손실의 task 평균 (식 4) */
export const lossBefore = (tasks: Task[], theta: Vec) =>
  tasks.reduce((s, t) => s + taskLoss(t, theta), 0) / tasks.length;

/** 한 걸음 적응 뒤 손실의 task 평균 (식 2) */
export const lossAfter = (tasks: Task[], alpha: number, theta: Vec) =>
  tasks.reduce((s, t) => s + taskLoss(t, adapt(t, alpha, theta)), 0) / tasks.length;

/** 모든 방법·모든 단일 task에서 안정한 바깥 step size — 배치 크기와 무관하게 같은 β를 쓴다 */
export function outerStep(tasks: Task[], alpha: number): number {
  const lmax = Math.max(...METHODS.flatMap((m) => tasks.map((t) => spectralRadius(weight(t, alpha, m)))));
  return 0.9 / lmax;
}

export interface Trajectory {
  points: Vec[];
  diverged: boolean;
}

/**
 * 바깥 경사하강. batch가 tasks.length보다 작으면 매 step 비복원으로 batch개 task를 뽑아
 * 그 평균 기울기로 움직인다 (meta-batch SGD).
 */
export function trajectory(
  tasks: Task[],
  alpha: number,
  method: Method,
  start: Vec,
  beta: number,
  options: { steps?: number; batch?: number; seed?: number; bound?: number } = {},
): Trajectory {
  const { steps = 300, batch = tasks.length, seed = 1, bound = 12 } = options;
  const r = rng(seed);
  const index = tasks.map((_, i) => i);
  const points: Vec[] = [start];
  let theta = start;
  for (let k = 0; k < steps; k += 1) {
    let chosen = tasks;
    if (batch < tasks.length) {
      for (let i = 0; i < batch; i += 1) {
        const j = i + Math.floor(r() * (tasks.length - i));
        [index[i], index[j]] = [index[j], index[i]];
      }
      chosen = index.slice(0, batch).map((i) => tasks[i]);
    }
    const g = gradient(chosen, alpha, method, theta);
    theta = [theta[0] - beta * g[0], theta[1] - beta * g[1]];
    if (!Number.isFinite(theta[0]) || Math.hypot(theta[0], theta[1]) > bound) {
      return { points, diverged: true };
    }
    points.push(theta);
  }
  return { points, diverged: false };
}

/** 끝 구간 iterate들이 기준점에서 떨어진 RMS 거리 */
export function tailSpread(points: Vec[], center: Vec, tail = 100): number {
  const last = points.slice(-tail);
  const ms = last.reduce((s, p) => s + (p[0] - center[0]) ** 2 + (p[1] - center[1]) ** 2, 0) / last.length;
  return Math.sqrt(ms);
}

/** 배치 크기 1..N 각각에서 여러 seed로 돌린 MAML 끝 구간 흩어짐의 평균 */
export function spreadByBatch(tasks: Task[], alpha: number, start: Vec, beta: number, runs = 4): number[] {
  const star = stationary(tasks, alpha, 'maml');
  return tasks.map((_, b) => {
    let sum = 0;
    for (let s = 0; s < runs; s += 1) {
      const tr = trajectory(tasks, alpha, 'maml', start, beta, { batch: b + 1, seed: 101 + s });
      sum += tailSpread(tr.points, star);
    }
    return sum / runs;
  });
}

/** ½ (x − m)ᵀ Q (x − m) = level 인 타원 (Q 양의 정부호일 때) */
export function ellipse(center: Vec, Q: Sym, level: number, n = 64): Vec[] {
  const { values, angle } = eigen(Q);
  const r1 = Math.sqrt((2 * level) / values[0]);
  const r2 = Math.sqrt((2 * level) / values[1]);
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const out: Vec[] = [];
  for (let k = 0; k <= n; k += 1) {
    const t = (2 * Math.PI * k) / n;
    const u = r1 * Math.cos(t);
    const v = r2 * Math.sin(t);
    out.push([center[0] + c * u - s * v, center[1] + s * u + c * v]);
  }
  return out;
}

/** 장축 반지름이 radius 인 등고선 수준 */
export function levelForMajorRadius(Q: Sym, radius: number): number {
  return (eigen(Q).values[1] * radius * radius) / 2;
}

export const maxCurvature = (tasks: Task[]) => Math.max(...tasks.map((t) => eigen(t.hessian).values[0]));
