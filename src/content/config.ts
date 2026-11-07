import { defineCollection, z } from 'astro:content';

const lang = z.enum(['ko', 'en']);

export const noteSchema = z.object({
  title: z.string(),
  lang,
  translationKey: z.string(),
  date: z.coerce.date(),
  lastUpdated: z.coerce.date().optional(),
  field: z.enum(['web', 'game', 'programming-language', 'ai', 'blog']),
  category: z.string(),
  series: z.string().optional(),
  order: z.number().optional(),
  projects: z.array(z.string()).default([]),
  status: z.enum(['draft', 'reading', 'implemented', 'stable']),
  summary: z.string(),
  problem: z.string(),
  coreIdea: z.string(),
  connection: z.string(),
  tags: z.array(z.string()).default([]),
});

// 공개 독후감·회고. 기술 노트의 problem·coreIdea·connection 없이 자유 서술로 쓴다.
// 번역은 선택이다: 한국어만 있어도 된다.
export const recordSchema = z.object({
  title: z.string(),
  lang,
  translationKey: z.string(),
  date: z.coerce.date(),
  kind: z.enum(['book', 'retrospective']),
  source: z.string().optional(),
  summary: z.string(),
});

const projectSchema = z.object({
  title: z.string(),
  lang,
  translationKey: z.string(),
  status: z.enum(['concept', 'active', 'paused', 'done']),
  problem: z.string(),
  role: z.string(),
  timeRange: z.string().optional(),
  stack: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  repository: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  reportUrl: z.string().url().optional(),
  constraint: z.string(),
  architecture: z.string(),
  experiment: z.string(),
  technicalCore: z.array(z.string()).default([]),
  outcome: z.string().optional(),
  researchRelevance: z.string().optional(),
  links: z.array(z.object({
    label: z.string(),
    url: z.string(),
  })).default([]),
  summary: z.string(),
});

const labSchema = z.object({
  title: z.string(),
  lang,
  translationKey: z.string(),
  tier: z.enum(['static', 'client', 'server', 'external']),
  status: z.enum(['concept', 'prototype', 'experimentable', 'stable']),
  question: z.string(),
  runtime: z.enum(['none', 'browser', 'api', 'external']),
  inputs: z.array(z.string()).default([]),
  outputs: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  summary: z.string(),
});

const cvSchema = z.object({
  title: z.string(),
  lang,
  translationKey: z.string(),
  summary: z.string(),
  updated: z.coerce.date(),
});

export const collections = {
  notes: defineCollection({ type: 'content', schema: noteSchema }),
  records: defineCollection({ type: 'content', schema: recordSchema }),
  projects: defineCollection({ type: 'content', schema: projectSchema }),
  lab: defineCollection({ type: 'content', schema: labSchema }),
  cv: defineCollection({ type: 'content', schema: cvSchema }),
};
