import { getAtPath, setAtPath } from './config-path';

export type DynamicFieldKind = 'text' | 'textarea' | 'boolean' | 'number' | 'json';

export interface DynamicFieldSpec {
  path: string;
  label: string;
  kind: DynamicFieldKind;
}

/** Flatten ensoTask (and nested objects) into editable field specs. Arrays → JSON. */
export function collectEnsoTaskFields(
  ensoTask: Record<string, unknown>,
  prefix = '',
): DynamicFieldSpec[] {
  const fields: DynamicFieldSpec[] = [];
  for (const [key, value] of Object.entries(ensoTask)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      fields.push(...collectEnsoTaskFields(value as Record<string, unknown>, path));
      continue;
    }
    if (Array.isArray(value)) {
      fields.push({ path, label: path, kind: 'json' });
    } else if (typeof value === 'boolean') {
      fields.push({ path, label: path, kind: 'boolean' });
    } else if (typeof value === 'number') {
      fields.push({ path, label: path, kind: 'number' });
    } else if (typeof value === 'string' && value.length > 120) {
      fields.push({ path, label: path, kind: 'textarea' });
    } else {
      fields.push({ path, label: path, kind: 'text' });
    }
  }
  return fields;
}

export function readEnsoFieldValue(
  ensoTask: Record<string, unknown>,
  path: string,
): unknown {
  return getAtPath(ensoTask, path);
}

export function writeEnsoFieldValue(
  ensoTask: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  return setAtPath(ensoTask, path, value);
}

export function coerceDynamicValue(kind: DynamicFieldKind, raw: string): unknown {
  if (kind === 'boolean') {
    return raw === 'true';
  }
  if (kind === 'number') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }
  if (kind === 'json') {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return raw;
    }
  }
  return raw;
}

export function displayDynamicValue(kind: DynamicFieldKind, value: unknown): string {
  if (kind === 'json') {
    try {
      return JSON.stringify(value ?? null, null, 2);
    } catch {
      return String(value);
    }
  }
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
}
