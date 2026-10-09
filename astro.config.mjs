import { defineConfig } from 'astro/config';
import remarkCallout from '@r4ai/remark-callout';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import rehypeImageSize from './src/lib/markdown/rehype-image-size.mjs';
import remarkImageFigure from './src/lib/markdown/remark-image-figure.mjs';

export default defineConfig({
  site: 'https://jjjung0921.github.io',
  markdown: {
    rehypePlugins: [rehypeKatex, rehypeImageSize],
    remarkPlugins: [remarkMath, remarkCallout, remarkImageFigure],
  },
  output: 'static',
  // 2026-09-25: DDA 논문 리뷰 5편을 dda-research-map 한 편으로 합쳤다. 옛 주소는 지도 글로 보낸다.
  redirects: {
    '/notes/dda-alphadda-playing-strength': '/notes/dda-research-map/',
    '/en/notes/dda-alphadda-playing-strength': '/en/notes/dda-research-map/',
    '/notes/dda-bilevel-entropy-meta-balancing': '/notes/dda-research-map/',
    '/en/notes/dda-bilevel-entropy-meta-balancing': '/en/notes/dda-research-map/',
    '/notes/dda-ntrl-encounter-generation': '/notes/dda-research-map/',
    '/en/notes/dda-ntrl-encounter-generation': '/en/notes/dda-research-map/',
    '/notes/dda-personalized-imitation-rl': '/notes/dda-research-map/',
    '/en/notes/dda-personalized-imitation-rl': '/en/notes/dda-research-map/',
    '/notes/dda-player-state-mcts': '/notes/dda-research-map/',
    '/en/notes/dda-player-state-mcts': '/en/notes/dda-research-map/',
  },
});
