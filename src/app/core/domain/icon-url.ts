/** Allowlisted host icon URLs for library `<img src>`. Lossy: rejected values become undefined. */
const RASTER_DATA = /^data:image\/(png|jpe?g|gif|webp)(;base64)?,/i;

export function sanitizeIconUrl(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined;
  }
  const s = raw.trim();
  if (!s) {
    return undefined;
  }
  const lower = s.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('http:') || lower.startsWith('file:')) {
    return undefined;
  }
  if (s.startsWith('//') || s.includes('..')) {
    return undefined;
  }
  if (RASTER_DATA.test(s)) {
    return s;
  }
  if (lower.startsWith('data:')) {
    return undefined;
  }
  if (lower.startsWith('https:')) {
    try {
      const u = new URL(s);
      if (u.protocol === 'https:') {
        return s;
      }
    } catch {
      return undefined;
    }
    return undefined;
  }
  if ((s.startsWith('/') || s.startsWith('./')) && !s.includes(':')) {
    return s;
  }
  return undefined;
}
