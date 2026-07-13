import type { Lang } from './collections';
import type { FilterOption } from './filters';
import { toFilterKey } from './filters';

export const noteFieldOrder = ['web', 'game', 'programming-language', 'ai'] as const;

export type NoteField = (typeof noteFieldOrder)[number];

const noteFieldLabels: Record<Lang, Record<NoteField, string>> = {
  ko: {
    ai: 'AI',
    game: '게임',
    'programming-language': '프로그래밍 언어',
    web: '웹',
  },
  en: {
    ai: 'AI',
    game: 'Game',
    'programming-language': 'Programming Language',
    web: 'Web',
  },
};

export function getNoteFieldLabel(field: NoteField, lang: Lang): string {
  return noteFieldLabels[lang][field] ?? field;
}

export function makeNoteFieldFilterOptions(fields: readonly NoteField[], lang: Lang): FilterOption[] {
  const uniqueFields = [...new Set(fields)];

  return uniqueFields
    .sort((a, b) => noteFieldOrder.indexOf(a) - noteFieldOrder.indexOf(b))
    .map((field) => ({
      value: toFilterKey(field),
      label: getNoteFieldLabel(field, lang),
    }));
}

export function makeAllNoteFieldFilterOptions(lang: Lang): FilterOption[] {
  return makeNoteFieldFilterOptions(noteFieldOrder, lang);
}
