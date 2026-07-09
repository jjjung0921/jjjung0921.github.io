---
title: "AI 웹소설 QA 시스템"
lang: "ko"
translationKey: "ai-web-novel-qa"
status: "concept"
problem: "구매한 에피소드 제약을 존중하면서 스토리에 대한 질문에 AI가 어떻게 답변할 수 있을까?"
role: "System designer"
timeRange: "Concept"
stack: ["RAG", "Vector DB", "Access Control", "TypeScript"]
tags: ["AI", "Web", "System"]
summary: "접근 권한이 있는 에피소드만 검색하고 답변에 사용하도록 설계하는 제약 기반 QA 프로젝트."
constraint: "모델은 구매하지 않은 에피소드의 정보를 검색하거나 답변에 사용해서는 안 된다."
architecture: "에피소드 단위 벡터 인덱스, 사용자 접근 행렬, 검색 전후 경계 검사를 포함한 RAG 파이프라인."
experiment: "접근 프로필별 QA 정확도와 스포일러 노출률을 함께 측정한다."
technicalCore:
  - "접근 제약 하의 정보 검색"
  - "사용자 강조 엔티티 추적"
  - "컨텍스트 경계 제어"
  - "스포일러 방지 평가"
researchRelevance: "제약된 추론, 검색 제어, 사용자별 정보 접근, 상호작용형 AI 시스템 설계와 연결된다."
links:
  - label: "상세 보기"
    url: "/projects/ai-web-novel-qa/"
---

## Architecture sketch

- Episode-level vector index
- User access matrix
- Retrieval boundary check
- Spoiler leakage evaluation

## Evidence target

초기 목표는 접근 프로필별 QA 정확도와 스포일러 노출률을 함께 측정하는 것이다.
