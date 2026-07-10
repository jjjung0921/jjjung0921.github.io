import type { CollectionEntry } from 'astro:content';

export type Lang = 'ko' | 'en';

export function filterByLang<T extends { data: { lang: Lang } }>(entries: T[], lang: Lang): T[] {
  return entries.filter((entry) => entry.data.lang === lang);
}

export function sortByDateDesc<T extends { data: { date: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getSlugWithoutLangPrefix(slug: string): string {
  return slug.replace(/^(ko|en)\//, '');
}

type LocalizedEntry = {
  slug: string;
  data: { lang: Lang };
};

export function getLocalizedStaticPaths<TEntry extends LocalizedEntry, TPropName extends string>(
  entries: TEntry[],
  lang: Lang,
  propName: TPropName,
): Array<{ params: { slug: string }; props: Record<TPropName, TEntry> }> {
  return filterByLang(entries, lang).map((entry) => ({
    params: { slug: getSlugWithoutLangPrefix(entry.slug) },
    props: { [propName]: entry } as Record<TPropName, TEntry>,
  }));
}

export function getEntryPath(
  collection: 'notes' | 'projects' | 'lab',
  entry: CollectionEntry<'notes'> | CollectionEntry<'projects'> | CollectionEntry<'lab'>,
): string {
  const slug = getSlugWithoutLangPrefix(entry.slug);
  const prefix = entry.data.lang === 'en' ? '/en' : '';
  return `${prefix}/${collection}/${slug}/`;
}
