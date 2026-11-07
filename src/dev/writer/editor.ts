type Scalar = { value: string; editable: boolean };
type FileState = {
  file: { path: string; collection: 'notes' | 'records'; lang: string };
  frontmatter: string;
  body: string;
  fields: Record<string, Scalar>;
  previewUrl: string;
  issues: Array<{ field: string; message: string }>;
};

const options = JSON.parse(document.body.dataset.options ?? '{}') as Record<string, string[]>;
const labels: Record<string, string> = {
  title: '제목', date: '날짜', field: '분야', series: '시리즈', order: '시리즈 순서', status: '상태',
  category: '카테고리 (화면에 안 보임)', summary: '요약', problem: '문제', coreIdea: '핵심 아이디어',
  connection: '연결', kind: '유형', source: '출처 (책·저자 / 기간)',
};
const longFields = new Set(['summary', 'problem', 'coreIdea', 'connection']);
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const fileSelect = $<HTMLSelectElement>('file-select');
const form = $<HTMLFormElement>('fields');
const body = $<HTMLTextAreaElement>('body');
const raw = $<HTMLTextAreaElement>('raw-frontmatter');
const iframe = $<HTMLIFrameElement>('preview');
const saveState = $('save-state');
let state: FileState | undefined;
let timer: number | undefined;
let dark = false;

const api = async (input: RequestInit & { query?: string; payload?: unknown }) => {
  const response = await fetch(`/_write/api${input.query ?? ''}`, input.payload ? {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input.payload),
  } : undefined);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? response.statusText);
  return data;
};

function renderFields() {
  if (!state) return;
  form.replaceChildren();
  for (const [key, scalar] of Object.entries(state.fields)) {
    const wrap = document.createElement('label');
    wrap.className = longFields.has(key) ? 'w-field wide' : 'w-field';
    wrap.dataset.field = key;
    const title = document.createElement('span');
    title.textContent = labels[key] ?? key;
    const error = document.createElement('span');
    error.className = 'w-error';
    let input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (options[key]) {
      input = document.createElement('select');
      for (const option of options[key]) input.append(new Option(option, option));
    } else if (longFields.has(key)) {
      input = document.createElement('textarea');
      input.rows = key === 'summary' ? 3 : 2;
    } else {
      input = document.createElement('input');
      if (key === 'date') input.type = 'date';
      if (key === 'order') input.type = 'number';
    }
    input.name = key;
    input.value = key === 'date' ? scalar.value.slice(0, 10) : scalar.value;
    if (!scalar.editable) {
      input.disabled = true;
      error.textContent = '여러 줄 값 — 원문에서 고치세요';
    }
    wrap.append(title, input, error);
    form.append(wrap);
  }
  showIssues(state.issues);
}

function showIssues(issues: FileState['issues']) {
  form.querySelectorAll<HTMLElement>('.w-field').forEach((wrap) => {
    const issue = issues.find((item) => item.field === wrap.dataset.field);
    const error = wrap.querySelector('.w-error') as HTMLElement;
    if (!wrap.querySelector(':disabled')) error.textContent = issue?.message ?? '';
    wrap.classList.toggle('invalid', Boolean(issue));
  });
  const other = issues.filter((issue) => !state?.fields[issue.field]);
  if (other.length) saveState.textContent = `검사: ${other.map((i) => `${i.field} ${i.message}`).join(' · ')}`;
}

// 미리보기는 dev 서버가 렌더한 실제 페이지 HTML을 받아 쓴다. Vite HMR 클라이언트·모듈 스크립트·분석 태그는 빼서
// 콘텐츠가 바뀔 때 iframe이 스스로 새로고침하지 않게 하고, 저장할 때마다 <main>만 바꿔 끼운다(스크롤 유지).
async function fetchPreview(url: string): Promise<Document | undefined> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    saveState.textContent = `미리보기 렌더 실패 (HTTP ${response.status}) — frontmatter·본문을 확인하세요`;
    return undefined;
  }
  const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
  doc.querySelectorAll('script').forEach((script) => {
    if (script.type === 'module' || script.src || script.textContent?.includes('googletagmanager')) script.remove();
  });
  doc.querySelectorAll('astro-dev-toolbar, noscript').forEach((node) => node.remove());
  return doc;
}

const mainHtml = (doc: Document | null | undefined) => doc?.querySelector('main')?.innerHTML ?? '';

async function refreshPreview({ replaceDocument }: { replaceDocument: boolean }) {
  if (!state) return;
  const url = state.previewUrl;
  const current = iframe.contentDocument;
  if (replaceDocument || !current?.querySelector('main')) {
    const doc = await fetchPreview(url);
    if (doc && state?.previewUrl === url) iframe.srcdoc = `<!doctype html>${doc.documentElement.outerHTML}`;
    return;
  }
  // 파일을 쓴 직후에는 콘텐츠 계층이 아직 옛 내용을 줄 수 있다. 바뀐 결과가 올 때까지 잠깐 다시 받는다.
  const before = mainHtml(current);
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const doc = await fetchPreview(url);
    if (!doc || state?.previewUrl !== url) return;
    const next = mainHtml(doc);
    if (next !== before || attempt === 9) {
      const main = current.querySelector('main');
      if (main && next) main.innerHTML = next;
      if (doc.title) current.title = doc.title;
      return;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 150));
  }
}

async function load(path: string) {
  state = await api({ query: `?action=read&path=${encodeURIComponent(path)}` });
  renderFields();
  body.value = state!.body;
  raw.value = state!.frontmatter;
  $('preview-url').textContent = `localhost${state!.previewUrl}`;
  await refreshPreview({ replaceDocument: true });
  saveState.textContent = '불러옴';
  localStorage.setItem('writer-last', path);
}

async function save(withRaw = false) {
  if (!state) return;
  const fields = Object.fromEntries(new FormData(form).entries());
  saveState.textContent = '저장 중…';
  try {
    const result = await api({ payload: { action: 'save', path: state.file.path, fields, body: body.value, ...(withRaw ? { frontmatter: raw.value } : {}) } });
    state.frontmatter = result.frontmatter;
    if (withRaw) await load(state.file.path);
    raw.value = result.frontmatter;
    showIssues(result.issues);
    if (!result.issues.length) saveState.textContent = `저장됨 ${new Date(result.savedAt).toLocaleTimeString()} · 미리보기 갱신`;
    await refreshPreview({ replaceDocument: false });
  } catch (error) {
    saveState.textContent = `저장 실패: ${(error as Error).message}`;
  }
}

const scheduleSave = () => {
  window.clearTimeout(timer);
  saveState.textContent = '입력 중…';
  timer = window.setTimeout(() => save(), 700);
};

iframe.addEventListener('load', () => {
  const doc = iframe.contentDocument;
  if (doc) doc.documentElement.dataset.theme = dark ? 'dark' : 'light';
});

form.addEventListener('input', scheduleSave);
body.addEventListener('input', scheduleSave);
$('raw-apply').addEventListener('click', () => save(true));
fileSelect.addEventListener('change', () => load(fileSelect.value));
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 's') {
    event.preventDefault();
    window.clearTimeout(timer);
    save();
  }
});

document.querySelectorAll<HTMLButtonElement>('[data-viewport]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-viewport]').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    iframe.classList.toggle('mobile', button.dataset.viewport === 'mobile');
  });
});
$('theme-button').addEventListener('click', (event) => {
  dark = !dark;
  (event.currentTarget as HTMLElement).setAttribute('aria-pressed', String(dark));
  if (iframe.contentDocument) iframe.contentDocument.documentElement.dataset.theme = dark ? 'dark' : 'light';
});

const newDialog = $<HTMLDialogElement>('new-dialog');
const newForm = $<HTMLFormElement>('new-form');
let folders: Record<string, string[]> = {};
const syncNewForm = () => {
  const data = new FormData(newForm);
  (newForm.querySelector('[data-notes-only]') as HTMLElement).hidden = data.get('collection') !== 'notes';
  $('folder-list').replaceChildren(...(folders[String(data.get('lang'))] ?? []).map((f) => new Option(f, f)));
};
newForm.addEventListener('change', syncNewForm);
$('new-button').addEventListener('click', () => { $('new-error').textContent = ''; syncNewForm(); newDialog.showModal(); });
newDialog.addEventListener('close', async () => {
  if (newDialog.returnValue !== 'create') return;
  try {
    const payload = Object.fromEntries(new FormData(newForm).entries());
    const { path, restartNeeded } = await api({ payload: { action: 'create', ...payload } });
    await refreshList(path);
    await load(path);
    if (restartNeeded) saveState.textContent = '이 유형의 첫 글입니다. 미리보기에 보이려면 dev 서버를 한 번 다시 켜세요.';
  } catch (error) {
    $('new-error').textContent = (error as Error).message;
    newDialog.showModal();
  }
});

const checkDialog = $<HTMLDialogElement>('check-dialog');
$('check-button').addEventListener('click', async () => {
  if (!state) return;
  window.clearTimeout(timer);
  await save();
  const result = await api({ query: `?action=check&path=${encodeURIComponent(state.file.path)}` });
  $('check-list').replaceChildren(...result.items.map((item: { label: string; ok: boolean; note?: string }) => {
    const li = document.createElement('li');
    li.className = item.ok ? 'ok' : 'todo';
    li.textContent = `${item.ok ? '✓' : '○'} ${item.label}${!item.ok && item.note ? ` — ${item.note}` : ''}`;
    return li;
  }));
  checkDialog.showModal();
});

async function refreshList(select?: string) {
  const { files, folders: folderMap } = await api({ query: '?action=list' });
  folders = folderMap;
  const groups = new Map<string, HTMLOptGroupElement>();
  fileSelect.replaceChildren();
  for (const file of files as Array<{ path: string; collection: string; lang: string }>) {
    const key = `${file.collection === 'notes' ? '기술 노트' : '기록'} · ${file.lang}`;
    if (!groups.has(key)) {
      const group = document.createElement('optgroup');
      group.label = key;
      groups.set(key, group);
      fileSelect.append(group);
    }
    groups.get(key)!.append(new Option(file.path.replace(/^src\/content\//, ''), file.path));
  }
  if (select) fileSelect.value = select;
}

const last = localStorage.getItem('writer-last');
refreshList(last ?? undefined).then(() => {
  if (fileSelect.value) load(fileSelect.value);
});

export {};
