# Note series navigation design spec

## Goal

노트 상세 화면 하단에서 전체 글 목록이 아니라 현재 글과 같은 언어·시리즈에 속한 이전 글과 다음 글로 이동한다.

## Layout

- 위치: 본문 바로 아래, `1px` 상단 구분선 이후 `--space-section-compact` 간격
- 데스크톱: `2`열, 열 간격 `1rem`; 이전 글은 왼쪽, 다음 글은 오른쪽
- 링크 카드: 최소 폭 `0`, 내부 여백 `1.15rem`, 아이콘 `2.75rem`
- 모바일(`780px` 이하): `1`열로 전환하며 이전 글 다음에 다음 글을 배치
- 콘텐츠 최대 폭: 기존 `--content-width` (`56rem`)를 그대로 사용

## Tokens

- 배경: `--color-bg-raised`
- 본문: `--color-ink`
- 보조 라벨: `--color-muted`
- 구분선과 테두리: `--color-line`
- 화살표와 hover 강조: `--color-accent`
- radius: `--radius-lg`, 원형 아이콘은 `999px`
- shadow: `--shadow-sm`, hover 시 `--shadow-md`
- 라벨: `--font-mono`, 제목: 기존 body font

새 색상 토큰은 추가하지 않는다. 따라서 기존 light/dark theme가 모두 같은 의미 토큰으로 동작한다.

## Repeating pattern

`SeriesNavigation` organism은 최대 두 개의 링크 카드로 구성한다.

- 이전 링크: 원형 왼쪽 화살표 → 라벨 → 제목
- 다음 링크: 라벨 → 제목 → 원형 오른쪽 화살표
- 긴 제목: 두 줄 이후 생략
- 시리즈의 처음/끝: 존재하는 방향만 렌더링
- 시리즈가 없거나 같은 시리즈 글이 하나뿐인 경우: 탐색 영역 전체를 렌더링하지 않음

## Interaction states

- default: raised background, line border, accent outline icon
- hover: accent 혼합 테두리, raised shadow, `-1px` 이동, 아이콘 반전
- keyboard: native `<a>` 탐색과 전역 `:focus-visible` outline 사용
- accessible name: 방향 라벨과 대상 글 제목을 포함한 `aria-label`
- disabled: 비활성 카드를 만들지 않고 존재하지 않는 방향을 렌더링하지 않음
- loading/error: 정적 빌드 데이터이므로 런타임 상태 없음

## Information architecture

1. `getCollection('notes')`가 전체 노트를 제공한다.
2. `getNoteSeriesNavigation()`이 현재 글과 동일한 `lang`·`series`만 선택한다.
3. `order` 오름차순으로 정렬한다.
4. `order`가 없거나 같은 경우 날짜 오름차순, slug 오름차순으로 안정화한다.
5. 페이지가 `getEntryPath()`로 flat public URL을 만들고 제목과 함께 렌더링 컴포넌트에 전달한다.

## Excluded data

- 시리즈 번호나 진행률은 현재 스키마에 없으므로 표시하지 않는다.
- 썸네일과 요약은 탐색에 필요하지 않으며 레퍼런스에도 없으므로 표시하지 않는다.
- 서로 다른 언어 또는 서로 다른 시리즈의 글은 후보에 포함하지 않는다.

## Version entry

- Date: 2026-07-30
- Goal: 같은 시리즈의 이전·다음 글 탐색 추가
- Files changed: data helper, Astro component, ko/en detail routes, shared shell styles
- Verification: `npm run lint` PASS, `npm run build` PASS, 생성 HTML의 시리즈 경계와 링크 확인 PASS, 데스크톱 `1600×900`·모바일 `390×844` 브라우저 검사 PASS, 실제 다음 글 이동 PASS
- Unverified: hover의 색상 전환은 CSS 규칙으로만 확인했으며 실제 포인터 스크린샷은 남기지 않음
