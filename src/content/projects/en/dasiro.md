---
title: "Dasiro — Seoul Sinkhole Safety Map"
lang: "en"
translationKey: "dasiro"
status: "done"
problem: "Citizens need to read Seoul's sinkhole risk information intuitively on a map and find safe routes."
role: "Frontend developer (team)"
timeRange: "2025 hackathon"
stack: ["React", "Vite", "TypeScript", "styled-components", "Kakao Maps SDK", "D3.js", "axios"]
tags: ["Web", "Frontend", "Data Viz", "Team"]
repository: "https://github.com/LikeLion-at-DGU/2025-hackaton-8-Dasiro-frontend"
demoUrl: "https://dasiro.netlify.app/"
constraint: "Within a short hackathon window, layer a map SDK and D3 visualization together while representing risk data accurately."
architecture: "Render maps and routes with the Kakao Maps SDK, Seoul districts and risk grades with D3.js, and integrate backend data via axios."
experiment: "Validated five-level risk visualization, safe-route guidance, recovery-district, and citizen-report features through a live deployment (dasiro.netlify.app)."
technicalCore:
  - "D3.js Seoul-district and risk visualization"
  - "Kakao Maps route guidance"
  - "Risk-grade color scale"
  - "Map–data integration"
summary: "A hackathon web service that visualizes Seoul sinkhole risk on a map and guides safe routes (team project, deployed)."
---

## Overview

A web service that visualizes Seoul's sinkhole risk information and guides citizens to safe routes. A 2025 hackathon team-8 project, deployed to production.

## Key features

- Five-level sinkhole risk visualization per Seoul district (D3.js)
- Origin–destination safe-route guidance (Kakao Maps)
- Recovery-district status and a citizen-report system
