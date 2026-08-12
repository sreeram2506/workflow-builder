/** Immutable nested get/set under node.data via dot paths. */

export function getAtPath(data: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.').filter(Boolean);
  if (parts.length === 0) {
    return data;
  }
  let cur: unknown = data;
  for (const key of parts) {
    if (cur == null || typeof cur !== 'object' || Array.isArray(cur)) {
      return undefined;
    }
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}

/** Returns a new object tree with `value` written at `path` (does not mutate `data`). */
export function setAtPath(
  data: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  const parts = path.split('.').filter(Boolean);
  if (parts.length === 0) {
    return { ...data };
  }

  const root: Record<string, unknown> = { ...data };
  let cur = root;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!;
    const existing = cur[key];
    const child =
      existing != null && typeof existing === 'object' && !Array.isArray(existing)
        ? { ...(existing as Record<string, unknown>) }
        : {};
    cur[key] = child;
    cur = child;
  }

  cur[parts[parts.length - 1]!] = value;
  return root;
}
