---
title: "이정진 CV"
lang: "ko"
translationKey: "profile"
summary: "NAS(Neural Architecture Search)로 시작해 bi-level optimization에 관심을 두고 공부하고 있습니다. 현재는 DDA(Dynamic Difficulty Adjustment)를 중점으로 user-interactive staged matgo-game 프로젝트를 진행하고 있습니다."
updated: "2026-09-26"
---

## 소개

안녕하세요, 동국대학교에서 컴퓨터공학을 전공하고 있는 이정진입니다. 제 목표는 사용자 한 명에게 맞춰 가는 [agentic model](/notes/roadmap-tutorial-personal-agentic-model/), 즉 스스로 결정을 내리고 그 결정이 바꾼 사용자의 반응을 관측해 다음 결정을 그 사용자에게 맞춰 가는 모델을 만드는 것입니다. 처음에는 NAS로 모델의 구조를 개인마다 바꾸려 했고, DARTS와 NAO에서 bi-level optimization을 처음 만났습니다. 개인마다 구조를 탐색하기에는 연산량이 너무 커서 파라미터를 맞추는 [MAML](/notes/roadmap-personal-model-and-maml/)로 옮겼고, 게임의 동적 난이도 조절(DDA)에서 모델의 결정이 사용자의 반응을 바꾸는 문제를 찾다가 [Performative Prediction](/notes/roadmap-performative-prediction/)을 공부했습니다. 적응(MAML)과 반응(PP)을 한 문제로 묶는 틀이 [bi-level optimization](/notes/roadmap-bilevel-common-form/)이고, 지금은 이 고리를 staged-DDA에서 실험하고 있습니다.

## 학력

| 기간 | 학교 | 전공 | 과정 |
|---|---|---|---|
| 2022.03 – 현재 | 동국대학교 | 컴퓨터공학 | 학사 |

- **2025학년도 평점** — 3.77 / 4.5 (33학점)
- **주요 이수 과목** — 인공지능(A+), 머신러닝, 딥러닝입문, 개별연구(화합물 역합성 경로 예측 AI 모델 개발 → [MEEA\*](/projects/meea/)), 공학선형대수학, 확률및통계학, 미적분학및연습 1·2, 수치해석및실습, 이산구조
- **영어 강의 이수** — 데이터베이스설계, 소프트웨어공학, 양자컴퓨팅

## 연구 관심사

- Bi-level Optimization
- Meta-learning
- Neural Architecture Search
- Player Modeling
- Optimization-based Machine Learning
- AI Agents & Systems

## 연구 경험

- **[범용 staged-DDA](/projects/dda-blackjack/)** · 개인 연구 · 2026.06 – 진행 중
  - dynamic difficulty adjustment를 player modeling과 결합한 bi-level optimization 문제로 정식화한 연구 프로토타입입니다.
  - performative prediction으로 플레이어의 실력 향상을 이끄는 stage 기반 게임(블랙잭·맞고)을 설계하고 있습니다.
- **[MAML Task Paradigms — task 분포를 어떻게 묶는가](/projects/maml-task-paradigms/)** · 개인 연구 계획 · 2026.09 – 진행 중
  - MAML이 주어진 입력으로 두는 task 분포 $p(\mathcal{T})$를 어떤 기준으로 묶어야 초기화 공유의 이득이 생기는지 묻는 연구 뼈대를 세우고 있습니다.
  - 유사도 proxy 네 계열(파라미터 거리·gradient 정렬·분포 divergence·task embedding)을 정리하고, 12주 논문 읽기로 주제를 확정하는 중입니다.
- **[MEEA\* 역합성 계획 — 리뷰 및 재현·실험](/projects/meea/)** · 개별연구(학부 과목) · 2025.09 – 2025.12
  - MCTS로 강화한 A\* 탐색(Zhao et al., 2024)의 논문과 코드를 리뷰했습니다.
  - 원 저장소에 빠진 학습 파이프라인을 재현하고 cpuct·policyNet ablation을 수행했습니다.

## 수상·대회

| 시기 | 대회 | 결과 |
|---|---|---|
| 2026.08 – | 제2회 성남×KAIST AI 경진대회 — XAI 기반 판교권 퇴근시간 교통정체 원인 진단 | 참가 중 |
| 2025 | 멋쟁이사자처럼 해커톤 — [다시로: 서울 싱크홀 안전지도](/projects/dasiro/) | 본선 진출 |

## 자격증

| 자격증 | 발급 기관 | 취득 |
|---|---|---|
| SQLD (SQL 개발자) | 한국데이터산업진흥원 | 2026.03.27 |

## 활동

- **멋쟁이사자처럼 동국대 14기** · 프론트엔드 멘토 (2026)
  - TypeScript 세션을 새로 추가해 운영했습니다.
  - 동국대 봄 축제 웹사이트 프론트엔드를 팀으로 개발했습니다(아래 개발 프로젝트).
- **[꾸한성.site](https://xn--vv0bj54aswo.site/)** · 개발·운영
  - SOOP 스트리머 크루 꾸한성(G-CASTLE)의 비상업 팬사이트입니다. 멤버 라이브 상태와 공지를 한곳에 모아 보여 주고, 주간 일정 캘린더와 콘텐츠·팬아트 아카이브를 제공합니다.
- **기술 블로그 Bit City Lab** · 운영
  - 논문·개념 학습 노트와 프로젝트 기록을 한국어·영어로 올리고 있습니다.

## 개발 프로젝트

| 프로젝트 | 역할 | 시기 | 한 줄 요약 |
|---|---|---|---|
| [모먼트 커피 — 카페 주문 앱](/notes/tenant-split-frontend-backend/) | 개인 · 풀스택 | 2026.08 – 진행 중 | 소상공인 카페용 모듈 조합형 멀티테넌트 주문 앱. 소비자 주문 앱·사업자 콘솔·백엔드 API(React·NestJS·Drizzle·PostgreSQL) |
| 운꿰사(WKS) — 사주 기반 축제 소개팅 | 프론트엔드 (팀) | 2026.09 – 진행 중 | 대학 축제 참가자가 사주로 운세·궁합을 보고 소개팅 상대와 연결되는 웹 서비스(React·Tailwind CSS) |
| [NovelBot — 웹소설 대화형 AI](/projects/novelbot/) | 백엔드 (팀 · 주 기여자) | — | Spring Boot 백엔드(인증·구매·WebSocket 채팅)와 구매 범위 기반 스포일러 방지 접근 제어 |
| [동국대 봄 축제 웹사이트](/projects/dgu-spring-festival/) | 프론트엔드 (팀) | 2026 봄 | React 프론트엔드, 활성 사용자 약 2.7K명·이벤트 약 57K건(Google Analytics) |
| [동국대 동아리박람회 웹사이트](/projects/dgu-club-fair/) | 프론트엔드 (팀) | 2026 상반기 | 동아리 정보 탐색 흐름 구현 |
| [다시로 — 서울 싱크홀 안전지도](/projects/dasiro/) | 프론트엔드 (팀) | 2025 해커톤 | D3.js·Kakao Maps로 위험도 시각화와 안전 경로 안내, 배포 완료 |

## 기술

| 분야 | 도구 |
|---|---|
| 언어 | C / C++, C#, Java, Python, TypeScript / JavaScript |
| AI / ML | PyTorch, RAG (Milvus · LangChain), RDKit |
| 백엔드 | Spring Boot, Spring Security / JWT, NestJS, Drizzle, MySQL, PostgreSQL, Redis, WebSocket |
| 프론트엔드 | React, Vite, Tailwind CSS, styled-components, Astro |

## 주요 시리즈

- **[Ontology Foundations](/notes/ontology-01-conceptualization/)** (5편) — 개념화·존재론적 개입·공리와 의도된 모델을 따라가며 ontology가 무엇을 고정하고 무엇을 고정하지 못하는지 정리
- **[Research Roadmap](/notes/roadmap-tutorial-personal-agentic-model/)** (6편) — 개인에게 맞춰 가는 모델이라는 목표를 MAML·Performative Prediction·bi-level optimization·staged-DDA로 단계마다 좁혀 간 기록
- **[모먼트 커피](/notes/tenant-split-frontend-backend/)** (4편) — 멀티테넌트 주문 앱을 만들며 마주친 테넌트 분리·번들러·서버 상태 캐시·React 메모리 모델 판단

## 연구 철학

저는 어떤 기법이 왜 존재해야 하는지 이해하기 전까지는 그 기법을 믿지 않습니다. 제가 배우는 기본 방식은 방법이 답하는 한계에서부터 그 방법을 다시 세우는 것입니다. 이전 방식이 무엇을 하지 못했는지, 그리고 이 방식은 왜 이런 모양이어야 하는지를 따집니다. NAS에서 MAML과 Performative Prediction으로 옮겨 온 길도 앞선 도구가 남긴 한계를 따라간 결과입니다.

제가 붙잡고 있는 질문은 결정과 반응이 서로를 바꾸는 고리입니다. 모델이 결정을 내리면 사용자의 반응이 달라지고, 그 반응이 다시 모델의 다음 결정을 바꿔야 고리가 닫힙니다. 도구를 부르는 LLM 에이전트는 사용자의 반응을 메모리에 쌓아 두었다가 다시 읽을 뿐 모델은 그대로입니다. **저는 이 고리를 하나의 최적화 문제로 쓰고 싶습니다.** 상위 레벨이 결정을 고르고 하위 레벨이 그 결정 아래에서 적응하는 bi-level optimization이 그 언어입니다.

그래서 제가 먼저 묻는 것은 문제를 어떻게 정식화하느냐입니다. 상위 변수가 하위 문제의 데이터 분포로 들어갈 때 bi-level의 두 줄이 닫히는지, 하위 해가 유일하고 미분 가능하다는 가정이 어디서 깨지는지, 그리고 결과를 무엇으로 측정할지를 따집니다. 실험은 이 질문을 확인하는 수단이고, 두 연구 주제를 따로 진행하는 것도 각 실험의 결론이 섞이지 않게 하기 위해서입니다. 도시에 빗대면, 제 관심은 도시를 효율적으로 짓는 일보다 도시가 한 사람의 동선에 맞춰 스스로를 다시 설계하는 원리에 있습니다.
