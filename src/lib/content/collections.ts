import type { CollectionEntry } from 'astro:content';

export type Lang = 'ko' | 'en';
type RoutableCollection = 'notes' | 'projects' | 'lab';

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
