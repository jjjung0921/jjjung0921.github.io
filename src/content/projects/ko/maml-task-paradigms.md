---
title: "MAML Task Paradigms — task 분포를 어떻게 묶는가"
lang: "ko"
translationKey: "maml-task-paradigms"
status: "concept"
problem: "MAML은 task 분포 p(T)를 주어진 입력으로 둡니다. 어떤 task들을 한 분포로 묶어야 초기화를 공유하는 이득이 생길까요?"
role: "개인 연구 — 연구 계획·문헌 정리"
timeRange: "2026.09 – 진행 중"
stack: ["Meta-learning", "MAML", "Bi-level Optimization", "Task Similarity"]
tags: ["AI", "Optimization", "Meta-learning"]
summary: "MAML을 그대로 두고 task를 묶는 기준만 바꿔 가며, 유사도 proxy가 초기화 공유의 이득(또는 학습 안정성)을 예측하는지 묻는 연구 계획입니다. 현재는 논문 읽기와 연구 뼈대를 세우는 단계입니다."
constraint: "task 유사도에는 합의된 기준이 없고, proxy는 query를 보지 않고 support 데이터만으로 계산되어야 합니다."
architecture: "MAML(gradient 기반 1-step 적응)은 고정하고, 묶음 기준만 독립변수로 둡니다. 후보 proxy는 적응된/최적 파라미터 거리, gradient 정렬·affinity, task 데이터 분포 divergence, task embedding 네 가지입니다."
experiment: "계획 단계입니다. 종속변수를 적응 후 손실 이득으로 둘지, 학습·수렴 안정성(seed 분산·발산율·meta-gradient norm)으로 둘지 결정한 뒤 다봉 회귀 벤치마크에서 seed ≥ 5로 비교할 예정입니다."
technicalCore:
  - "문제 정의: 묶음 G의 이득 gain(G)을 proxy로 예측할 수 있는가"
  - "proxy 네 계열 비교 — 파라미터 거리 · gradient 정렬 · 분포 divergence · task embedding"
  - "종속변수 후보 — 적응 후 손실 이득 vs 학습 안정성"
  - "12주 논문 읽기 계획으로 주제 확정 (2026.09 – 2026.12)"
researchRelevance: "staged-DDA의 플레이어 모델을 MAML로 옮기려다 '어떤 플레이어들을 한 p(T)로 둘 것인가'에서 멈춘 것이 출발점입니다. 독립 실험의 객관성을 위해 staged-DDA(Track A)와 분리해 별도 연구(Track B)로 진행합니다."
links:
  - label: "Research Roadmap — Tutorial"
    url: "/notes/roadmap-tutorial-personal-agentic-model/"
  - label: "Stage 1 · meta-learning과 MAML"
    url: "/notes/roadmap-personal-model-and-maml/"
  - label: "Stage 5 · 어떤 플레이어들을 한 task 분포로 묶는가"
    url: "/notes/roadmap-task-grouping-track-b/"
  - label: "B1 · MAML은 task 분포를 주어진 것으로 놓았다"
    url: "/notes/meta-maml-task-distribution-given/"
  - label: "실험실 · MAML 이차 task 시각화"
    url: "/lab/maml-quadratic-tasks/"
---

## 연구 질문

task 집합 $\{\mathcal{T}_i\}$가 주어졌을 때, support 데이터만으로 계산되는 유사도 proxy $d(\mathcal{T}_i, \mathcal{T}_j)$가 "초기화를 공유해서 얻는 이득"을 예측하는가.

$$
\mathrm{gain}(G) = \mathbb{E}_{\mathcal{T}\in G}\Big[\mathcal{L}_{\mathcal{T}}\big(\theta_{\text{all}} - \alpha\nabla\mathcal{L}_{\mathcal{T}}(\theta_{\text{all}})\big) - \mathcal{L}_{\mathcal{T}}\big(\theta_{G} - \alpha\nabla\mathcal{L}_{\mathcal{T}}(\theta_{G})\big)\Big]
$$

## 연구 뼈대

1. **출발점** — MAML의 Algorithm 1은 `Require: p(T)`로 시작합니다. 분포는 알고리즘의 입력일 뿐, 논문은 분포를 만들지도 고르지도 않습니다.
2. **proxy 네 계열** — 적응된/최적 파라미터 거리(Khodak et al. 2019, TSA-MAML), gradient 정렬·affinity(TAG), 데이터 분포 divergence(Jose & Simeone 2021, Per-FedAvg), task embedding(Task2Vec).
3. **다양성 통념에 대한 반례** — Kumar et al.(2022)과 Setlur et al.(2020)은 다양성을 높이는 것이 평균 성능을 올리지 않을 수 있음을 보였습니다.
4. **남은 결정** — 종속변수를 이득으로 둘지 안정성으로 둘지, 어느 proxy를 먼저 비교할지.

## 진행 기록

- 연구 로드맵: [Tutorial](/notes/roadmap-tutorial-personal-agentic-model/) · [Stage 1](/notes/roadmap-personal-model-and-maml/) · [Stage 5](/notes/roadmap-task-grouping-track-b/)
- MAML Task Paradigms 시리즈: [B1 — MAML은 task 분포를 주어진 것으로 놓았다](/notes/meta-maml-task-distribution-given/)
- 실험실: [task 수와 meta-batch 크기에 따른 meta-gradient 흩어짐](/lab/maml-quadratic-tasks/)
