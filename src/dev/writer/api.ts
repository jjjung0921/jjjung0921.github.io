// /_write/api — dev 서버에서만 붙는 작성 API. 이 컴퓨터(loopback)에서 온 같은 출처 요청만 받는다.
import fs from 'node:fs/promises';
import path from 'node:path';
import type { APIRoute } from 'astro';
import { noteSchema, recordSchema } from '../../content/config';
import {
  exists,
  formFields,
  joinFile,
  listContentFiles,
  listNoteFolders,
  previewUrl,
  readScalar,
  resolveContentPath,
  splitFile,
  template,
  topLevelKeys,
  writeScalar,
  type Lang,
  type WritableCollection,
} from './files';

export const prerender = false;

const schemas = { notes: noteSchema, records: recordSchema } as const;

const loopback = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);
const localHosts = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

function guard(request: Request, clientAddress: string, url: URL): Response | undefined {
  const host = request.headers.get('host') ?? '';
  if (!loopback.has(clientAddress) || !localHosts.test(host)) {
    return json({ error: '이 컴퓨터(localhost)에서만 쓸 수 있습니다.' }, 403);
  }
  if (request.method !== 'GET') {
    const origin = request.headers.get('origin');
    if (origin !== url.origin || !request.headers.get('content-type')?.startsWith('application/json')) {
      return json({ error: '같은 출처의 JSON 요청만 받습니다.' }, 403);
    }
  }
  return undefined;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

type Issue = { field: string; message: string };

/** 폼에 있는 값은 스키마로, 나머지는 필수 키가 frontmatter에 있는지만 본다. */
function validate(collection: WritableCollection, frontmatter: string): Issue[] {
  const schema = schemas[collection];
  const issues: Issue[] = [];
  const keys = new Set(topLevelKeys(frontmatter));

  for (const [key, shape] of Object.entries(schema.shape)) {
    if (!shape.isOptional() && !keys.has(key)) issues.push({ field: key, message: '필수 항목이 없습니다.' });
  }

  const values: Record<string, unknown> = {};
  for (const key of formFields[collection]) {
    const scalar = readScalar(frontmatter, key);
    if (!scalar?.editable) continue;
    values[key] = key === 'order' && scalar.value !== '' ? Number(scalar.value) : scalar.value;
  }
  const result = schema.partial().safeParse(values);
  if (!result.success) {
    for (const issue of result.error.issues) issues.push({ field: String(issue.path[0]), message: issue.message });
  }
  return issues;
}

async function readFileState(relative: string) {
  const { absolute, file } = resolveContentPath(relative);
  const raw = await fs.readFile(absolute, 'utf8');
  const { frontmatter, body } = splitFile(raw);
  const fields = Object.fromEntries(
    formFields[file.collection].map((key) => [key, readScalar(frontmatter, key) ?? { value: '', editable: true }]),
  );
  return { file, frontmatter, body, fields, previewUrl: previewUrl(file), issues: validate(file.collection, frontmatter) };
}

async function findTranslationFile(translationKey: string | undefined, lang: Lang): Promise<string | undefined> {
  if (!translationKey) return undefined;
  for (const file of await listContentFiles()) {
    if (file.collection !== 'notes' || file.lang !== lang) continue;
    const { frontmatter } = splitFile(await fs.readFile(path.resolve(file.path), 'utf8'));
    if (readScalar(frontmatter, 'translationKey')?.value === translationKey) return file.path;
  }
  return undefined;
}

/** 공개 전 검사: 검토 표시, draft 상태, 기술 노트의 영어 번역본. */
async function check(relative: string) {
  const state = await readFileState(relative);
  const raw = joinFile(state);
  const items: Array<{ label: string; ok: boolean; note?: string }> = [];

  items.push({ label: 'ai:draft 마킹·TODO 확인 표시 없음', ok: !/ai:draft|TODO: 확인 필요/.test(raw) });
  items.push({ label: '스키마 검사 통과', ok: state.issues.length === 0, note: state.issues.map((i) => `${i.field}: ${i.message}`).join(', ') || undefined });
  if (state.file.collection === 'notes') {
    items.push({ label: 'status가 draft가 아님', ok: state.fields.status?.value !== 'draft', note: '공개 상태로 바꿀지 확인' });
    if (state.file.lang === 'ko') {
      const key = readScalar(state.frontmatter, 'translationKey')?.value;
      const english = await findTranslationFile(key, 'en');
      items.push({ label: '영어 번역본 있음 (commit 스킬이 요구)', ok: Boolean(english), note: english ?? `translationKey "${key}"인 en 글 없음` });
    }
  } else {
    items.push({ label: '기록은 번역 선택', ok: true });
  }
  return { items, commands: ['npm run lint', 'npm run build'] };
}

export const GET: APIRoute = async ({ request, clientAddress, url }) => {
  const denied = guard(request, clientAddress, url);
  if (denied) return denied;

  try {
    const action = url.searchParams.get('action');
    if (action === 'list') {
      return json({ files: await listContentFiles(), folders: { ko: await listNoteFolders('ko'), en: await listNoteFolders('en') } });
    }
    if (action === 'read') return json(await readFileState(url.searchParams.get('path') ?? ''));
    if (action === 'check') return json(await check(url.searchParams.get('path') ?? ''));
    return json({ error: '알 수 없는 요청' }, 400);
  } catch (error) {
    return json({ error: (error as Error).message }, 400);
  }
};

export const POST: APIRoute = async ({ request, clientAddress, url }) => {
  const denied = guard(request, clientAddress, url);
  if (denied) return denied;

  try {
    const input = await request.json();

    if (input.action === 'save') {
      const { absolute, file } = resolveContentPath(input.path);
      const current = splitFile(await fs.readFile(absolute, 'utf8'));
      let frontmatter = typeof input.frontmatter === 'string' ? input.frontmatter : current.frontmatter;
      for (const [key, value] of Object.entries(input.fields ?? {})) {
        if (!formFields[file.collection].includes(key)) continue;
        if (readScalar(frontmatter, key)?.editable === false) continue;
        const scalar = key === 'order' && value !== '' ? Number(value) : (value as string);
        frontmatter = writeScalar(frontmatter, key, scalar);
      }
      const body = typeof input.body === 'string' ? input.body : current.body;
      await fs.writeFile(absolute, joinFile({ frontmatter, body }), 'utf8');
      return json({ savedAt: new Date().toISOString(), issues: validate(file.collection, frontmatter), frontmatter });
    }

    if (input.action === 'create') {
      const collection = input.collection as WritableCollection;
      const lang = input.lang as Lang;
      const slug = String(input.slug ?? '');
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('slug는 영문 소문자·숫자·하이픈만 씁니다.');
      const folder = collection === 'notes' ? String(input.folder ?? '').replace(/^\/+|\/+$/g, '') : '';
      const relative = ['src/content', collection, lang, folder, `${slug}.md`].filter(Boolean).join('/');
      const { absolute, file } = resolveContentPath(relative);
      if (await exists(absolute)) throw new Error(`이미 있는 파일: ${file.path}`);
      const existing = await listContentFiles();
      if (existing.some((other) => other.collection === collection && other.lang === lang && other.slug === slug)) {
        throw new Error(`같은 공개 주소를 쓰는 글이 이미 있습니다: ${previewUrl(file)}`);
      }
      await fs.mkdir(path.dirname(absolute), { recursive: true });
      const date = new Date().toISOString().slice(0, 10);
      await fs.writeFile(absolute, template(collection, lang, slug, String(input.title ?? ''), date), 'utf8');
      // 비어 있던 컬렉션은 dev 서버가 감시하지 않는다. 첫 파일은 서버를 한 번 다시 켜야 보인다.
      return json({ path: file.path, restartNeeded: !existing.some((other) => other.collection === collection) });
    }

    return json({ error: '알 수 없는 요청' }, 400);
  } catch (error) {
    return json({ error: (error as Error).message }, 400);
  }
};
