// /_write — dev 전용 작성 화면. Astro 페이지가 아니라 HTML을 직접 돌려준다.
// Astro 페이지에는 Vite HMR 클라이언트가 붙어서, 글을 저장할 때마다(콘텐츠 변경) 화면 전체가 새로고침된다.
import type { APIRoute } from 'astro';
import { noteSchema, recordSchema } from '../../content/config';
import tokens from '../../styles/tokens.css?raw';
import style from './editor.css?raw';
import template from './editor.html?raw';

export const prerender = false;

const options = {
  field: noteSchema.shape.field.options,
  status: noteSchema.shape.status.options,
  kind: recordSchema.shape.kind.options,
};

export const GET: APIRoute = () => {
  const html = template
    .replace('/*TOKENS*/', () => tokens)
    .replace('/*STYLE*/', () => style)
    .replace('__OPTIONS__', () => JSON.stringify(options).replace(/'/g, '&#39;'));
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
};
