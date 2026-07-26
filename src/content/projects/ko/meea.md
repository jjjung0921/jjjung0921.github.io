---
title: "MEEA* 역합성 계획 — 리뷰 및 재현·실험"
lang: "ko"
translationKey: "meea"
status: "done"
problem: "역합성 계획에서 탐색 효율과 학습된 heuristic의 일반화 성능을 어떻게 함께 높일 수 있는가?"
role: "개별연구 — 논문·코드 리뷰 및 재현·실험"
timeRange: "2025"
stack: ["Python", "PyTorch", "RDKit", "RXNMapper", "MCTS", "A* Search"]
tags: ["AI", "Search", "Study"]
repository: "https://github.com/jjjung0921/MEEA"
reportUrl: "https://www.nature.com/articles/s42004-024-01133-2"
constraint: "방대한 building block 분자 공간에서 경로를 찾아야 하며, 학습된 heuristic이 새로운 분자에도 일반화되어야 한다."
architecture: "A* 탐색에 MCTS의 look-ahead 탐색을 결합하고(MEEA*), path consistency를 정규화로 도입해 heuristic 일반화를 개선한다."
experiment: "원 논문 결과(USPTO 100%)를 확인하고, 직접 재현한 파이프라인에서 cpuct(0 vs 15)와 policyNet(MLP·GELU·Transformer) 변형의 정확도·depth를 비교했다."
technicalCore:
  - "MCTS 탐색을 결합한 A* (pUCT + f-value selection)"
  - "Path consistency 정규화 (L_RL + λ·L_PC)"
  - "학습 파이프라인 재현 (RXNMapper · rdchiral template 추출)"
  - "cpuct · policyNet(MLP/GELU/Transformer) ablation"
researchRelevance: "MCTS 탐색을 A* 안에 중첩하는 구조가 이중 최적화·DDA의 nested search 관심과 직접 맞닿으며, 재현·ablation 경험은 탐색 알고리즘 설계로 이어진다."
links:
  - label: "논문 리뷰 발표자료 (PDF)"
    url: "/files/meea-paper-review.pdf"
  - label: "코드 리뷰 발표자료 (PDF)"
    url: "/files/meea-code-review.pdf"
  - label: "추가 실험 — Code Experience (PDF)"
    url: "/files/meea-code-experience.pdf"
summary: "개별연구 과목에서 MEEA*-PC(Zhao et al., 2024)를 논문·코드 리뷰하고, 원 저장소가 제공하지 않는 학습 파이프라인을 재현해 cpuct·policyNet·valueEnsemble 실험을 직접 수행했다. 방법·구현의 원저작은 원저자에게 있다."
---

## 개요

개별연구 과목에서 역합성 분석(retrosynthetic planning)을 공부하며 진행한 작업이다. 대상은 Zhao, Tu, Xu의 *"Efficient retrosynthetic planning with MCTS exploration enhanced A\* search"* (Communications Chemistry, 2024)이며, **방법과 원 코드는 원저자의 것**이다. 논문·코드 리뷰에서 출발해, 원 저장소가 제공하지 않는 부분을 직접 재현하고 몇 가지 실험을 돌렸다.

## 핵심 파악 (리뷰)

- **MEEA\***: MCTS의 exploration(pUCT) 성질은 유지하되, selection에서 A\*처럼 가장 낮은 f-value를 가진 후보에 우선순위를 부여한다.
- **MEEA\*-PC**: 학습 손실을 `L = L_RL + λ·L_PC`로 두고, path consistency 정규화로 heuristic의 일반화를 개선한다.
- A\*의 heuristic 의존과 MCTS의 compulsive exploration이라는 두 단점을 서로 보완하는 구조로 이해했다.

## 직접 수행한 추가 실험

- **미제공 학습 데이터 재구성**: USPTO 원본(TDC) → RXNMapper로 atom mapping → rdchiral로 template 재추출(라벨 381,302 → 219,032). MEEA\*를 USPTO 299k에 실행해 경로 데이터를 만들고 train/validate 9:1로 분할.
- **cpuct ablation**: `cpuct=0`(A\* 성향, 평균 depth 18, 정확도 80%) vs `cpuct=15`(MCTS 성향, 평균 depth 6, 정확도 94%) — USPTO가 얕은 depth를 요구한다는 점과 부합.
- **policyNet 아키텍처 변형**: MLP 기준선 대비 GELU 적용 시 USPTO precision 0.80 → 0.9474로 개선. Transformer는 오히려 저하 — Morgan fingerprint에 순서 정보가 없어 positional encoding이 이득이 없었고, SMILES 계열 시퀀스 모델이 더 적합하리라 판단.
- **valueEnsemble**: value 예측의 magic number(-7) 유무 비교 — 제거 시 loss는 작지만 hinge loss 학습에서 gradient vanishing 우려가 커 유지가 타당하다고 결론.

## 제안한 후속 방향

- **policyNet**: SMILES + Transformer로 더 풍부한 표현을 학습하거나, Morgan fingerprint에 GNN을 얹어 반응 중심 예측.
- **valueEnsemble**: 고정 magic number 대신 adaptive threshold, consistency loss에 KL-divergence 같은 분포 정규화.

## 산출물

- [논문 리뷰 발표자료 (PDF)](/files/meea-paper-review.pdf)
- [코드 리뷰 발표자료 (PDF)](/files/meea-code-review.pdf)
- [추가 실험 — Code Experience (PDF)](/files/meea-code-experience.pdf)
