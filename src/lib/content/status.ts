import type { Lang } from './collections';
import type { FilterOption } from './filters';
import { toFilterKey } from './filters';

type StatusTone = 'success' | 'progress' | 'concept' | 'stable' | 'paused' | 'draft';

const statusLabels: Record<Lang, Record<string, string>> = {
  ko: {
    active: '진행중',
    concept: '구상',
    done: '완료',
    draft: '초안',
    implemented: '구현됨',
    paused: '보류',
    prototype: '프로토타입',
    reading: '읽는 중',
    stable: '안정화',
  },
  en: {
    active: 'Active',
    concept: 'Concept',
    done: 'Done',
    draft: 'Draft',
    implemented: 'Implemented',
    paused: 'Paused',
    prototype: 'Prototype',
    reading: 'Reading',
    stable: 'Stable',
  },
};

const statusTones: Record<string, StatusTone> = {
  active: 'success',
  concept: 'concept',
  done: 'stable',
  draft: 'draft',
  implemented: 'success',
  paused: 'paused',
  prototype: 'progress',
  reading: 'progress',
  stable: 'stable',
};

export function getStatusLabel(status: string, lang: Lang): string {
  return statusLabels[lang][status] ?? status;
}

export function getStatusTone(status: string): StatusTone {
  return statusTones[status] ?? 'draft';
}

export function makeStatusFilterOptions(statuses: string[], lang: Lang, order: string[] = []): FilterOption[] {
  const uniqueStatuses = [...new Set(statuses)];

  return uniqueStatuses
    .sort((a, b) => {
      const aOrder = order.indexOf(a);
      const bOrder = order.indexOf(b);

      if (aOrder !== -1 || bOrder !== -1) {
        return (aOrder === -1 ? Number.POSITIVE_INFINITY : aOrder)
          - (bOrder === -1 ? Number.POSITIVE_INFINITY : bOrder);
      }

      return getStatusLabel(a, lang).localeCompare(getStatusLabel(b, lang), ['ko', 'en']);
    })
    .map((status) => ({
      value: toFilterKey(status),
      label: getStatusLabel(status, lang),
      tone: getStatusTone(status),
    }));
}
