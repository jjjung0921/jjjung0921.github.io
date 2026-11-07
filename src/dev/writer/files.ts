// /_write/ 작성 화면의 파일 계층. 콘텐츠 경로 검증, frontmatter 한 줄 값 읽기·바꾸기, 템플릿.
// frontmatter는 통째로 다시 쓰지 않고 바꾼 키의 줄만 갈아 끼운다(주석·순서·나머지 키 보존).
import fs from 'node:fs/promises';
import path from 'node:path';

export type WritableCollection = 'notes' | 'records';
export type Lang = 'ko' | 'en';

export const formFields: Record<WritableCollection, string[]> = {
  notes: ['title', 'date', 'field', 'series', 'order', 'status', 'category', 'summary', 'problem', 'coreIdea', 'connection'],
  records: ['title', 'date', 'kind', 'source', 'summary'],
};

const root = process.cwd();
const contentRoot = path.join(root, 'src', 'content');
const collections: WritableCollection[] = ['notes', 'records'];

export interface ContentFile {
  path: string; // 저장소 기준 상대 경로 (src/content/...)
  collection: WritableCollection;
  lang: Lang;
  slug: string;
}

/** 저장소 기준 경로를 검증해 절대 경로로. notes·records의 ko/en 아래 .md만 허용한다. */
export function resolveContentPath(relative: string): { absolute: string; file: ContentFile } {
  const absolute = path.resolve(root, relative);
  const fromContent = path.relative(contentRoot, absolute);
  const [collection, lang, ...rest] = fromContent.split(path.sep);

  if (
    fromContent.startsWith('..')
    || path.isAbsolute(fromContent)
    || !collections.includes(collection as WritableCollection)
    || (lang !== 'ko' && lang !== 'en')
    || rest.length === 0
    || !absolute.endsWith('.md')
    || rest.some((segment) => segment.startsWith('.') || segment.startsWith('_'))
  ) {
    throw new Error(`편집할 수 없는 경로: ${relative}`);
  }

  return {
    absolute,
    file: {
      path: path.relative(root, absolute).split(path.sep).join('/'),
      collection: collection as WritableCollection,
      lang,
      slug: path.basename(absolute, '.md'),
    },
  };
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(entries.map((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) return [];
    return entry.isDirectory() ? walk(full) : entry.name.endsWith('.md') ? [full] : [];
  }));
  return nested.flat();
}

export async function listContentFiles(): Promise<ContentFile[]> {
  const files = (await Promise.all(collections.map((c) => walk(path.join(contentRoot, c))))).flat();
  return files
    .map((absolute) => resolveContentPath(path.relative(root, absolute)).file)
    .sort((a, b) => a.path.localeCompare(b.path));
}

/** notes의 ko 하위 폴더 목록 (새 글을 둘 자리). */
export async function listNoteFolders(lang: Lang): Promise<string[]> {
  const base = path.join(contentRoot, 'notes', lang);
  const files = await walk(base);
  return [...new Set(files.map((file) => path.relative(base, path.dirname(file)).split(path.sep).join('/')))]
    .filter(Boolean)
    .sort();
}

export function previewUrl(file: ContentFile): string {
  return `${file.lang === 'en' ? '/en' : ''}/${file.collection}/${file.slug}/`;
}

export interface SplitFile {
  frontmatter: string;
  body: string;
}

export function splitFile(raw: string): SplitFile {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontmatter: '', body: raw };
  return { frontmatter: match[1], body: match[2] };
}

export const joinFile = ({ frontmatter, body }: SplitFile) => `---\n${frontmatter}\n---\n${body}`;

const linePattern = (key: string) =>
  new RegExp(`^${key}:[ \\t]*("(?:[^"\\\\]|\\\\.)*"|'(?:[^']|'')*'|[^#\\n]*?)([ \\t]+#.*)?$`, 'm');

/** 한 줄짜리 스칼라 값만 읽는다. 여러 줄 값이면 editable=false. */
export function readScalar(frontmatter: string, key: string): { value: string; editable: boolean } | undefined {
  const keyLine = new RegExp(`^${key}:(.*)$`, 'm').exec(frontmatter);
  if (!keyLine) return undefined;

  const match = linePattern(key).exec(frontmatter);
  const rawValue = match?.[1]?.trim() ?? '';
  const multiline = !match || rawValue === '' || rawValue === '|' || rawValue === '>' || rawValue.startsWith('[');
  if (multiline) return { value: keyLine[1].trim(), editable: false };

  if (rawValue.startsWith('"')) return { value: JSON.parse(rawValue), editable: true };
  if (rawValue.startsWith("'")) return { value: rawValue.slice(1, -1).replace(/''/g, "'"), editable: true };
  return { value: rawValue, editable: true };
}

const formatScalar = (value: string | number) =>
  typeof value === 'number' ? String(value) : JSON.stringify(value);

/** 키 한 줄을 바꾸거나 없으면 끝에 붙인다. 빈 문자열이면 그 줄을 지운다(선택 필드용). 줄 끝 주석은 남긴다. */
export function writeScalar(frontmatter: string, key: string, value: string | number | null): string {
  const pattern = linePattern(key);
  const exists = pattern.test(frontmatter);

  if (value === null || value === '') {
    return exists ? frontmatter.replace(new RegExp(`^${key}:.*(?:\\r?\\n)?`, 'm'), '').replace(/\n$/, '') : frontmatter;
  }

  const line = `${key}: ${formatScalar(value)}`;
  if (exists) return frontmatter.replace(pattern, (_whole, _value, comment = '') => `${line}${comment}`);
  return frontmatter ? `${frontmatter}\n${line}` : line;
}

export const topLevelKeys = (frontmatter: string) =>
  [...frontmatter.matchAll(/^([A-Za-z][\w-]*):/gm)].map((match) => match[1]);

export function template(collection: WritableCollection, lang: Lang, slug: string, title: string, date: string): string {
  const fields = collection === 'notes'
    ? {
        title, lang, translationKey: slug, date, field: 'ai', category: '', series: '',
        status: 'draft', summary: '', problem: '', coreIdea: '', connection: '',
      }
    : { title, lang, translationKey: slug, date, kind: 'book', source: '', summary: '' };

  const frontmatter = Object.entries(fields)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n');
  return joinFile({ frontmatter, body: '\n' });
}

export async function exists(absolute: string): Promise<boolean> {
  return fs.access(absolute).then(() => true, () => false);
}
