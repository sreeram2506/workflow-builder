import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { sanitizeIconUrl } from './icon-url';

describe('sanitizeIconUrl', () => {
  it('accepts https, relative, and raster data URLs', () => {
    expect(sanitizeIconUrl('https://cdn.example/a.png')).toBe('https://cdn.example/a.png');
    expect(sanitizeIconUrl('/assets/router.svg')).toBe('/assets/router.svg');
    expect(sanitizeIconUrl('./icon.png')).toBe('./icon.png');
    expect(sanitizeIconUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc');
    expect(sanitizeIconUrl('  https://x.test/i.webp  ')).toBe('https://x.test/i.webp');
  });

  it('rejects unsafe or disallowed schemes', () => {
    expect(sanitizeIconUrl('javascript:alert(1)')).toBeUndefined();
    expect(sanitizeIconUrl('http://example/x.png')).toBeUndefined();
    expect(sanitizeIconUrl('file:///etc/passwd')).toBeUndefined();
    expect(sanitizeIconUrl('//evil.test/x.png')).toBeUndefined();
    expect(sanitizeIconUrl('../secret.png')).toBeUndefined();
    expect(sanitizeIconUrl('/foo/../bar.png')).toBeUndefined();
    expect(sanitizeIconUrl('data:text/html,<h1>x</h1>')).toBeUndefined();
    expect(sanitizeIconUrl('data:image/svg+xml,<svg>')).toBeUndefined();
    expect(sanitizeIconUrl('')).toBeUndefined();
    expect(sanitizeIconUrl(null)).toBeUndefined();
    expect(sanitizeIconUrl(1)).toBeUndefined();
  });
});

describe('sanitizeIconUrl PBT', () => {
  const acceptedArb = fc.oneof(
    fc.webUrl({ validSchemes: ['https'], withFragments: true, withQueryParameters: true }),
    fc.constantFrom('/assets/a.png', './icon.webp', '/x'),
    fc.constantFrom(
      'data:image/png;base64,xx',
      'data:image/jpeg;base64,yy',
      'data:image/gif;base64,zz',
      'data:image/webp;base64,ww',
    ),
  );

  it('accepted subset is identity (P-LIM-02)', () => {
    fc.assert(
      fc.property(acceptedArb, (s) => {
        expect(sanitizeIconUrl(s)).toBe(s);
      }),
      { numRuns: 40 },
    );
  });

  it('never returns javascript/http/file/protocol-relative/dotdot (P-LIM-01)', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 80 }), (s) => {
        const out = sanitizeIconUrl(s);
        if (out === undefined) {
          return;
        }
        const lower = out.toLowerCase();
        expect(lower.startsWith('javascript:')).toBe(false);
        expect(lower.startsWith('http:')).toBe(false);
        expect(lower.startsWith('file:')).toBe(false);
        expect(out.startsWith('//')).toBe(false);
        expect(out.includes('..')).toBe(false);
        expect(lower.startsWith('data:image/svg+xml')).toBe(false);
      }),
      { numRuns: 80 },
    );
  });
});
