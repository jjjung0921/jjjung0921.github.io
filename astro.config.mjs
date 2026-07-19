import { defineConfig } from 'astro/config';
import remarkCallout from '@r4ai/remark-callout';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

export default defineConfig({
  site: 'https://jjjung0921.github.io',
  markdown: {
    rehypePlugins: [rehypeKatex],
    remarkPlugins: [remarkMath, remarkCallout],
  },
  output: 'static',
});
