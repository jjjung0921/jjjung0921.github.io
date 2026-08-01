import type { CollectionEntry } from 'astro:content';

export type Lang = 'ko' | 'en';
type RoutableCollection = 'notes' | 'projects' | 'lab';

export interface NoteSeriesNavigation {
  previous?: CollectionEntry<'notes'>;
  next?: CollectionEntry<'notes'>;
}

export function filterByLang<T extends { data: { lang: Lang } }>(entries: T[], lang: Lang): T[] {
  return entries.filter((entry) => entry.data.lang === lang);
}

export function sortByDateDesc<T extends { data: { date: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getSlugWithoutLangPrefix(slug: string): string {
  return slug.replace(/^(ko|en)\//, '');
}

function getLastSlugSegment(slug: string): string {
  const segments = slug.split('/').filter(Boolean);
  return segments.at(-1) ?? slug;
}

function getPublicSlugFromCollectionSlug(collection: RoutableCollection, slug: string): string {
  if (collection === 'notes') {
    return getLastSlugSegment(slug);
  }

  return getSlugWithoutLangPrefix(slug);
}

export function getPublicEntrySlug(
  collection: RoutableCollection,
  entry: CollectionEntry<'notes'> | CollectionEntry<'projects'> | CollectionEntry<'lab'>,
): string {
  return getPublicSlugFromCollectionSlug(collection, entry.slug);
}

type LocalizedEntry = {
  slug: string;
  data: { lang: Lang };
};

type TranslatableEntry = {
  data: {
    lang: Lang;
    translationKey: string;
  };
};

export function findTranslation<TEntry extends TranslatableEntry>(
  entries: TEntry[],
  entry: TEntry,
  targetLang: Lang,
): TEntry | undefined {
  return entries.find(
    (candidate) =>
      candidate.data.lang === targetLang
      && candidate.data.translationKey === entry.data.translationKey,
  );
}

export function getLocalizedStaticPaths<TEntry extends LocalizedEntry, TPropName extends string>(
  entries: TEntry[],
  lang: Lang,
  propName: TPropName,
  collection?: RoutableCollection,
): Array<{ params: { slug: string }; props: Record<TPropName, TEntry> }> {
  return filterByLang(entries, lang).map((entry) => ({
    params: {
      slug: collection ? getPublicSlugFromCollectionSlug(collection, entry.slug) : getSlugWithoutLangPrefix(entry.slug),
    },
    props: { [propName]: entry } as Record<TPropName, TEntry>,
  }));
}

export function getEntryPath(
  collection: RoutableCollection,
  entry: CollectionEntry<'notes'> | CollectionEntry<'projects'> | CollectionEntry<'lab'>,
): string {
  const slug = getPublicEntrySlug(collection, entry);
  const prefix = entry.data.lang === 'en' ? '/en' : '';
  return `${prefix}/${collection}/${slug}/`;
}

function compareNotesBySeriesOrder(
  a: CollectionEntry<'notes'>,
  b: CollectionEntry<'notes'>,
): number {
  const aOrder = a.data.order ?? Number.POSITIVE_INFINITY;
  const bOrder = b.data.order ?? Number.POSITIVE_INFINITY;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  const dateDifference = a.data.date.getTime() - b.data.date.getTime();
  return dateDifference !== 0 ? dateDifference : a.slug.localeCompare(b.slug);
}

export function getNoteSeriesNavigation(
  entries: CollectionEntry<'notes'>[],
  currentNote: CollectionEntry<'notes'>,
): NoteSeriesNavigation {
  const { lang, series } = currentNote.data;

  if (!series) {
    return {};
  }

  const orderedSeries = entries
    .filter((entry) => entry.data.lang === lang && entry.data.series === series)
    .sort(compareNotesBySeriesOrder);
  const currentIndex = orderedSeries.findIndex((entry) => entry.slug === currentNote.slug);

  if (currentIndex === -1) {
    return {};
  }

  return {
    previous: orderedSeries[currentIndex - 1],
    next: orderedSeries[currentIndex + 1],
  };
}
