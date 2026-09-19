# Portfolio (Bit City Lab)

Astro 5 정적 포트폴리오 사이트. GitHub Pages 배포 (`https://jjjung0921.github.io`), `output: 'static'`.

## 명령어

```bash
npm run dev      # 개발 서버 (port 3000)
npm run lint     # tsc --noEmit
npm run build    # 정적 빌드 — 변경 후 필수 검증
```

## 구조

- `src/pages/` — 파일 기반 라우트, `src/pages/en/`이 영어 미러 (ko/en 패리티 유지)
- `src/layouts/Base.astro` — 앱 셸. props: `page`, `lang`
- `src/components/` — 도메인별(`layout/`, `content/`, `cv/`, `lab/`, `project/`) + 공용 `ui/`
- `src/content/` — 콘텐츠 컬렉션 `notes`·`projects`·`lab`·`cv`, 스키마는 `src/content/config.ts` (zod). 엔트리는 `lang`·`translationKey` frontmatter 필수
- `src/lib/` — 데이터 레이어 (컬렉션 필터·정렬·슬러그 헬퍼)
- `src/styles/tokens.css` — 디자인 토큰. 라이트 `:root` + 다크 `:root[data-theme='dark']` 쌍으로 관리
- `src/siteConfig.ts` — 사이트 전역 설정

## 원칙

- 클라이언트 JS 기본 0. 정적으로 불가능한 상호작용만 island.
- 데이터 가공은 `src/lib/`·frontmatter에, 표현은 `.astro` 컴포넌트에.
- 토큰 변경 시 라이트/다크 값 모두 정의.

## 프로젝트 스킬 (`.claude/skills/`)

작업 성격에 맞는 스킬을 Skill 도구로 로드해 따를 것:

| 스킬 | 언제 |
|---|---|
| `astro-frontend-architect` | 페이지·컴포넌트·라우팅·컬렉션 구현 |
| `web-design-system` | 토큰·타이포·레이아웃 등 비주얼 결정 |
| `product-planning` | 페이지/기능이 리뷰어 동선·사이트 목표에 맞는지 판정 |
| `backend-architect` | 동적 기능(댓글·문의·lab scores) 설계 게이트 |
| `fullstack-data-flow` | 경계를 넘는 데이터(외부 API·폼·콘텐츠 파이프라인) 계약·진단 |
| `commit` | 이 레포의 모든 커밋. post 브랜치 콘텐츠 커밋 시 ko→en 번역 동반 강제 |

여러 축에 걸치면 product-planning(무엇을) → web-design-system(어떻게 보일지) → astro-frontend-architect(구현) 순으로.

## 전역 스킬

| 스킬 | 언제 |
|---|---|
| `decision-post` | 프로젝트 레포의 `notes/`에 쌓인 CS·설계 질문을 시리즈형 기술 포스트로 변환 (모먼트 커피 시리즈 등). notes 항목 형식과 `noteSchema` 매핑, ko/en 패리티, series·order 관리를 담는다 |
| `blog-coauthor` | AI-Tutor 워크스페이스(`~/study/<subject>/`)·질문 원장 학습을 마친 복습 정리본. 개념 서술을 포함한 완성 초안을 AI가 쓰고 사용자가 검토 |
| `study-series` | 이월 스토리(`~/study/stories/story--*.md`)를 발견·개념·실험과 적용·회고 시리즈로 변환 |

세 스킬의 초안은 절마다 `<!-- ai:draft -->` … `<!-- /ai:draft -->`로 감싸고 사용자가 검토·수정한 절에서 마킹을 걷는다. **마킹이나 `<!-- TODO: 확인 필요` 가 남은 글은 이 레포로 옮기거나 커밋하지 않는다** (`commit` 스킬이 검사).

이 레포의 스킬이 아니라 계정 전역 스킬이다 — 소스 프로젝트(예: 모먼트 커피)에서 작업할 때도 같은 스킬이 잡혀야 하기 때문이다.
