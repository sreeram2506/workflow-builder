import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import * as fc from 'fast-check';
import { afterEach, describe, expect, it } from 'vitest';
import { FEATURED_PALETTE_TYPES, PALETTE_ITEMS } from '../domain/palette.catalog';
import { EnsoTaskCatalogService } from './enso-task-catalog.service';
import type { CatalogLoadMode } from './catalog.types';

const staticFeaturedKeys = PALETTE_ITEMS.filter((item) =>
  (FEATURED_PALETTE_TYPES as readonly string[]).includes(item.type),
).map((item) => item.key);

describe('EnsoTaskCatalogService PBT (U-RAD-01)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('omit-without-adapter is empty-remote, never enso, no static featured keys (P-RAD-01..03)', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    const svc = TestBed.inject(EnsoTaskCatalogService);
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<CatalogLoadMode>('solution-agents', 'agent-skills'),
        async (mode) => {
          const result = await firstValueFrom(svc.loadCatalog({ mode }));
          expect(result.emptyRemote).toBe(true);
          expect(result.source).toBe('empty');
          expect(String(result.source)).not.toBe('enso');
          expect(result.items.some((item) => staticFeaturedKeys.includes(item.key))).toBe(false);
        },
      ),
      { numRuns: 8, seed: 20260817 },
    );
  });
});
