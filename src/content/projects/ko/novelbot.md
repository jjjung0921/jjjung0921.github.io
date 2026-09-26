---
title: "NovelBot — 웹소설 대화형 AI 플랫폼 (Backend)"
lang: "ko"
translationKey: "novelbot"
status: "done"
problem: "웹소설 독자가 스포일러 없이, 자신이 읽은(구매한) 범위 안에서 작품에 대한 궁금증을 즉시 해소할 수 있어야 한다."
role: "Backend developer (팀 · 주 기여자)"
timeRange: "2025"
stack: ["Java 17", "Spring Boot", "MySQL", "Redis", "Spring Security", "JWT", "WebSocket", "Google Cloud Storage", "Gradle"]
tags: ["Web", "Backend", "AI", "System", "Team"]
repository: "https://github.com/novelbot/Backend"
constraint: "모델은 사용자가 구매·열람하지 않은 에피소드의 정보를 검색하거나 답변에 사용해서는 안 된다 — 접근 경계를 지켜 스포일러를 차단한다."
architecture: "React 프론트엔드 ↔ Spring Boot 백엔드(내 담당) ↔ Python RAG 서버(Milvus·LangChain, 팀원 담당). 백엔드는 인증·웹소설/에피소드·구매·채팅방을 관리하고, 에피소드 단위 인덱스와 사용자 접근 행렬을 기준으로 검색 경계를 검사하며, WebSocket으로 응답을 스트리밍한다."
experiment: "회원·웹소설·에피소드·구매·채팅 도메인을 구현하고 WebSocket 스트리밍과 JWT 인증을 붙여 통합 동작을 검증했다. 목표 평가는 접근 프로필별 QA 정확도와 스포일러 노출률을 함께 측정하는 것."
technicalCore:
  - "Spring Boot · JWT/Spring Security 인증·RBAC"
  - "웹소설·에피소드·구매·독서 진행도 도메인 API"
  - "WebSocket 기반 실시간 채팅 스트리밍"
  - "구매 범위 접근 제어 · 검색 경계 검사 (스포일러 방지)"
  - "RAG 서버 연동 (Milvus · LangChain)"
researchRelevance: "구매 범위를 넘지 않는 접근 제약 QA — 에피소드 단위 인덱스와 사용자 접근 행렬로 검색 경계를 지켜 스포일러를 차단하는 설계는, 제약된 추론·검색 제어·사용자별 정보 접근이라는 상호작용형 AI 시스템 문제와 연관될 수 있다. 나아가 RAG 응답에 System 2형 숙고 추론(multi-hop·self-verification)을 얹으면 검색 안에 추론이 중첩되는 구조가 되어, 내가 관심을 둔 bi-level optimization·nested search와 이어진다."
links:
  - label: "NovelBot (조직 저장소)"
    url: "https://github.com/orgs/novelbot/repositories"
summary: "웹소설 독자가 구매한 범위 안에서 스포일러 없이 작품에 대해 질문하는 대화형 AI 플랫폼. 팀 프로젝트에서 Spring Boot 백엔드를 주도적으로 구현했다 (인증·웹소설/에피소드·구매·WebSocket 채팅, 접근 제약, Python RAG 서버 연동)."
---

## 개요

NovelBot은 웹소설 독자를 위한 대화형 AI 플랫폼이다. 이전 화를 직접 뒤지거나 스포일러를 감수하지 않고도 자신이 읽은 범위 안에서 작품에 대한 궁금증을 바로 해소하도록 돕는다. 팀 프로젝트다. 나는 **Spring Boot 백엔드**를 주 기여자로 맡았다.

## 담당 (Backend)

- JWT · Spring Security 기반 인증·인가와 RBAC
- 웹소설·에피소드·구매·독서 진행도 도메인 API (MySQL · Redis · Google Cloud Storage)
- WebSocket 기반 실시간 채팅 스트리밍
- Python RAG 서버(Milvus · LangChain) 연동 및 구매 범위 접근 제어

## 설계 관점 — 접근 제약 QA

핵심 제약은 "사용자가 구매·열람한 범위를 넘는 정보는 검색·답변에 쓰지 않는다"이다. 이를 위해:

- 에피소드 단위 벡터 인덱스와 **사용자 접근 행렬**로 열람 범위만 검색 대상에 포함
- 검색 전후 **경계 검사**로 미구매 에피소드 정보 유출 차단
- 목표 평가: 접근 프로필별 **QA 정확도**와 **스포일러 노출률**을 함께 측정

## 시스템 구성

- **Frontend** (React) — 팀원 담당
- **Backend** (Spring Boot) — 내 담당: 도메인·인증·채팅·연동·접근 제어
- **RAG server** (Python · Milvus · LangChain) — 팀원 담당: 벡터 검색·LLM 응답

## 향후 방향

백엔드 참여에 더해 AI 응답 부분도 **System 2 딥러닝(숙고형 다단계 추론)** 으로 강화하고 싶다 — 에피소드 간 multi-hop 추론, 답변이 스포일러 경계를 넘지 않는지에 대한 self-verification, 검색과 추론을 반복하는 deliberate reasoning. 검색 안에 추론이 중첩되는 이 구조는 내가 관심을 둔 bi-level optimization·nested search와 맞닿는다.
