import type { CollectionEntry } from 'astro:content';
import { filterByLang, sortByDateDesc, type Lang } from './collections';
import { getNoteFieldLabel, noteFieldOrder, type NoteField } from './fields';
import { toFilterKey } from './filters';

type Note = CollectionEntry<'notes'>;
type RecordEntry = CollectionEntry<'records'>;
export type RecordKind = RecordEntry['data']['kind'];

const prefix = (lang: Lang) => (lang === 'en' ? '/en' : '');

export const notesPath = (lang: Lang) => `${prefix(lang)}/notes/`;
export const recordsPath = (lang: Lang) => `${prefix(lang)}/records/`;
export const fieldPath = (field: NoteField, lang: Lang) => `${prefix(lang)}/notes/field/${field}/`;
export const seriesIndexPath = (lang: Lang) => `${prefix(lang)}/notes/series/`;
export const seriesSlug = (series: string) => toFilterKey(series);
export const seriesPath = (series: string, lang: Lang) =>
  `${prefix(lang)}/notes/series/${seriesSlug(series)}/`;

export interface FieldLink {
  field: NoteField;
  label: string;
  href: string;
  count: number;
}

/** 글이 한 편 이상 있는 분야만, 글이 많은 순(같으면 스키마 순서). */
export function getFieldLinks(notes: Note[], lang: Lang): FieldLink[] {
  const localized = filterByLang(notes, lang);
  return noteFieldOrder
    .map((field) => ({
      field,
      label: getNoteFieldLabel(field, lang),
      href: fieldPath(field, lang),
      count: localized.filter((note) => note.data.field === field).length,
    }))
    .filter((link) => link.count > 0)
    .sort((a, b) => b.count - a.count);
}

export interface SeriesSummary {
  name: string;
  slug: string;
  href: string;
  count: number;
  latest: Note;
}

/** 시리즈별 글 수와 최근 글. 최근에 글이 올라온 시리즈가 먼저 온다. */
export function getSeriesSummaries(notes: Note[], lang: Lang): SeriesSummary[] {
  const groups = new Map<string, Note[]>();
  for (const note of sortByDateDesc(filterByLang(notes, lang))) {
    const { series } = note.data;
    if (!series) continue;
    groups.set(series, [...(groups.get(series) ?? []), note]);
  }

  return [...groups.entries()].map(([name, entries]) => ({
    name,
    slug: seriesSlug(name),
    href: seriesPath(name, lang),
    count: entries.length,
    latest: entries[0],
  }));
}

/** 한 시리즈의 글을 읽는 순서(order → 날짜)로. */
export function getSeriesNotes(notes: Note[], series: string, lang: Lang): Note[] {
  return filterByLang(notes, lang)
    .filter((note) => note.data.series === series)
    .sort((a, b) =>
      (a.data.order ?? Number.POSITIVE_INFINITY) - (b.data.order ?? Number.POSITIVE_INFINITY)
      || a.data.date.getTime() - b.data.date.getTime());
}

/** 공백을 뺀 글자 수(한국어) 또는 단어 수(영어)로 어림한 읽는 시간(분). */
export function getReadingMinutes(body: string, lang: Lang): number {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  const amount = lang === 'ko'
    ? text.replace(/\s+/g, '').length / 500
    : text.split(/\s+/).filter(Boolean).length / 220;
  return Math.max(1, Math.round(amount));
}

const recordKindLabels: Record<Lang, Record<RecordKind, string>> = {
  ko: { book: '독후감', retrospective: '회고' },
  en: { book: 'Book notes', retrospective: 'Retrospective' },
};

export const getRecordKindLabel = (kind: RecordKind, lang: Lang) => recordKindLabels[lang][kind];
export const recordKindOrder: RecordKind[] = ['book', 'retrospective'];
export const recordKindPath = (kind: RecordKind, lang: Lang) => `${prefix(lang)}/records/kind/${kind}/`;

/**
 * 브라우저는 하이픈 뒤에서 줄을 바꾼다("bi-" / "level"). 짧은 하이픈 단어는 한 덩어리로 묶도록
 * 조각을 나눈다. 너무 긴 단어는 좁은 화면에서 넘치지 않게 그대로 둔다.
 */
export function splitHyphenated(text: string): Array<{ text: string; keep: boolean }> {
  const parts: Array<{ text: string; keep: boolean }> = [];
  let last = 0;
  for (const match of text.matchAll(/[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)+/gu)) {
    if (match[0].length > 24) continue;
    if (match.index > last) parts.push({ text: text.slice(last, match.index), keep: false });
    parts.push({ text: match[0], keep: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), keep: false });
  return parts;
}

export const formatDate =(date: Date) => date.toISOString().slice(0, 10);
