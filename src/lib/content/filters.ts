export interface FilterOption {
  value: string;
  label: string;
  tone?: string;
  parentValues?: string[];
}

export function toFilterKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function makeFilterOptions(
  values: string[],
  labels: Record<string, string> = {},
  order: string[] = [],
): FilterOption[] {
  const options = new Map<string, FilterOption>();

  values.forEach((value) => {
    const key = toFilterKey(value);
    if (!options.has(key)) {
      options.set(key, {
        value: key,
        label: labels[value] ?? value,
      });
    }
  });

  return [...options.values()].sort((a, b) => {
    const aOrder = order.indexOf(a.value);
    const bOrder = order.indexOf(b.value);

    if (aOrder !== -1 || bOrder !== -1) {
      return (aOrder === -1 ? Number.POSITIVE_INFINITY : aOrder)
        - (bOrder === -1 ? Number.POSITIVE_INFINITY : bOrder);
    }

    return a.label.localeCompare(b.label, ['ko', 'en']);
  });
}

export function makeDependentFilterOptions(
  items: Array<{ value: string; parentValue: string }>,
  labels: Record<string, string> = {},
  order: string[] = [],
): FilterOption[] {
  const options = new Map<string, FilterOption>();

  items.forEach(({ value, parentValue }) => {
    const key = toFilterKey(value);
    const parentKey = toFilterKey(parentValue);
    const current = options.get(key);

    if (current) {
      current.parentValues = [...new Set([...(current.parentValues ?? []), parentKey])];
      return;
    }

    options.set(key, {
      value: key,
      label: labels[value] ?? value,
      parentValues: [parentKey],
    });
  });

  return [...options.values()].sort((a, b) => {
    const aOrder = order.indexOf(a.value);
    const bOrder = order.indexOf(b.value);

    if (aOrder !== -1 || bOrder !== -1) {
      return (aOrder === -1 ? Number.POSITIVE_INFINITY : aOrder)
        - (bOrder === -1 ? Number.POSITIVE_INFINITY : bOrder);
    }

    return a.label.localeCompare(b.label, ['ko', 'en']);
  });
}
