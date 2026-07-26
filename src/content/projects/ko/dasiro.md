---
title: "다시로 — 서울 싱크홀 안전지도"
lang: "ko"
translationKey: "dasiro"
status: "done"
problem: "서울시의 싱크홀 위험 정보를 시민이 지도 위에서 직관적으로 확인하고 안전한 경로를 찾을 수 있어야 한다."
role: "Frontend developer (팀)"
timeRange: "2025 해커톤"
stack: ["React", "Vite", "TypeScript", "styled-components", "Kakao Maps SDK", "D3.js", "axios"]
tags: ["Web", "Frontend", "Data Viz", "Team"]
repository: "https://github.com/LikeLion-at-DGU/2025-hackaton-8-Dasiro-frontend"
demoUrl: "https://dasiro.netlify.app/"
constraint: "해커톤의 짧은 기간 안에 지도 SDK와 D3 시각화를 함께 얹으면서 위험도 데이터를 정확히 표현해야 한다."
architecture: "Kakao Maps SDK로 지도·경로를, D3.js로 서울 구역과 위험도 등급을 렌더링하고, axios로 백엔드 데이터를 연동한다."
experiment: "싱크홀 위험도 5단계 시각화, 안전 경로 안내, 복구 상권·시민 제보 기능을 실제 배포(dasiro.netlify.app)로 검증했다."
technicalCore:
  - "D3.js 기반 서울 구역·위험도 시각화"
  - "Kakao Maps 경로 안내"
  - "위험 등급 색상 스케일"
  - "지도-데이터 연동"
researchRelevance: "지리 데이터를 위험도라는 목표로 변환해 시각화하는 작업으로, 데이터 흐름 설계 경험과 연결된다."
summary: "서울 싱크홀 위험도를 지도로 시각화하고 안전 경로를 안내하는 해커톤 웹 서비스 (팀 프로젝트, 배포됨)."
---

## 개요

서울시 싱크홀 위험도 정보를 시각화해 시민에게 안전한 이동 경로를 제공하는 웹 서비스다. 2025 해커톤 8팀 프로젝트로, 배포까지 완료했다.

## 주요 기능

- 서울 구별 싱크홀 위험도 5단계 시각화 (D3.js)
- 출발지–목적지 안전 경로 안내 (Kakao Maps)
- 복구 상권 현황, 시민 제보 시스템
