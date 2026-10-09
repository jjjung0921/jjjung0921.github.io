---
title: "동국대 봄 축제 웹사이트"
lang: "ko"
translationKey: "dgu-spring-festival"
status: "done"
problem: "축제 기간 방문객이 모바일에서 축제 정보를 빠르게 확인할 수 있는 웹을 제작한다."
role: "Frontend developer (팀)"
timeRange: "2026"
stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "React Router", "axios"]
tags: ["Web", "Frontend", "Team"]
repository: "https://github.com/LikeLion-at-DGU/2026-spring-festival-frontend"
constraint: "짧은 축제 기간의 트래픽과 모바일 우선 환경에서 일관된 UI를 유지해야 한다."
architecture: "features/ 도메인 단위로 컴포넌트·훅·상태를 응집하고, components/ui에 도메인 독립 UI를, lib/에 axios 인스턴스와 유틸을 래핑한다."
experiment: "팀 협업 환경에서 도메인별 폴더 분리로 코드 충돌과 중복을 줄이는 것을 목표로 했다."
technicalCore:
  - "feature 단위 폴더 아키텍처"
  - "재사용 UI 컴포넌트 (cva · tailwind-merge)"
  - "클라이언트 라우팅"
  - "axios 기반 API 연동"
outcome: "Google Analytics 기준 활성 사용자 약 2.7천 명, 총 이벤트 약 5.7만 건."
summary: "동국대 멋쟁이사자처럼 2026 봄 축제 웹사이트 프론트엔드 (팀 프로젝트)."
---

## 개요

동국대학교 멋쟁이사자처럼 2026 봄 축제 웹사이트의 프론트엔드다. React·Vite·TypeScript 기반으로, 기능(도메인) 단위 폴더 구조를 채택해 팀 협업에서 응집도와 재사용성을 높였다.

## 구조

- `features/` — 도메인별 컴포넌트·훅·상태 응집
- `components/ui/` — 도메인 독립 공용 UI
- `lib/` — axios 인스턴스·유틸 래핑
- `pages/` — 라우팅 단위 화면
