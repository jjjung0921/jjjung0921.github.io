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
});
