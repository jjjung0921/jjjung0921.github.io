---
title: "DDA 블랙잭 / 맞고"
lang: "ko"
translationKey: "dda-blackjack"
status: "active"
problem: "상대가 플레이어의 몰입도를 극대화하기 위해 전략을 어떻게 동적으로 조정할 수 있을까?"
role: "Research prototype designer"
timeRange: "Active research direction"
stack: ["Bi-level Optimization", "MCTS", "Player Modeling", "Simulation"]
tags: ["Game", "AI", "Optimization"]
summary: "동적 난이도 조절을 이중 최적화 문제로 모델링하는 연구형 프로젝트."
constraint: "승률과 심리적 압박을 조절하면서도 플레이어가 조작감을 느끼지 않도록 공정성을 유지해야 한다."
architecture: "상위 레벨 난이도 컨트롤러와 하위 레벨 플레이어/에이전트 반응 모델을 분리한다."
experiment: "정적 난이도 기준선과 비교해 승률, 몰입 유지, 공정성 지표를 함께 평가한다."
technicalCore:
  - "이중 최적화 프레임워크"
  - "플레이어 실력 추정"
  - "동적 정책 전환"
  - "시뮬레이션 기반 평가"
researchRelevance: "DDA를 상위-하위 목적이 중첩된 최적화 문제로 다루며, 플레이어 모델링과 AutoML 관점으로 확장할 수 있다."
links:
  - label: "상세 보기"
    url: "/projects/dda-blackjack/"
---

## Architecture sketch

- Upper-level difficulty controller
- Lower-level player or agent response model
- Fairness and pressure constraints
- Simulation-based evaluation loop

## Evidence target

정적 난이도 기준선과 비교해 승률, 몰입 유지, 공정성 지표를 함께 평가한다.
