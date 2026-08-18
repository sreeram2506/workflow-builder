import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PaletteItem } from '../domain/palette.catalog';
import { FEATURED_PALETTE_TYPES, PALETTE_ITEMS } from '../domain/palette.catalog';
import { provideWorkflowBuilderUi } from '../ui-config';
import { UiConfigService } from '../ui-config/ui-config.service';
import { EnsoTaskCatalogService } from './enso-task-catalog.service';

const hostAgent: PaletteItem = {
  key: 'host-a',
  type: 'AIAgent',
  label: 'Host Agent',
  description: 'From adapter',
  categoryId: 'agents',
};

const staticFeaturedKeys = PALETTE_ITEMS.filter((item) =>
  (FEATURED_PALETTE_TYPES as readonly string[]).includes(item.type),
).map((item) => item.key);

describe('EnsoTaskCatalogService (U-PAL-02)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('uses solution adapter', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideWorkflowBuilderUi({
          catalog: { solution: { load: () => of({ items: [hostAgent] }) } },
        }),
      ],
    });
    const svc = TestBed.inject(EnsoTaskCatalogService);
    const result = await firstValueFrom(svc.loadCatalog({ mode: 'solution-agents' }));
    expect(result.source).toBe('adapter');
    expect(result.emptyRemote).toBe(false);
    expect(result.error).toBeNull();
    expect(result.items.some((i) => i.key === 'host-a')).toBe(true);
    expect(result.items.some((i) => i.origin === 'default-agent' && i.key === 'AIAgent')).toBe(true);
    expect(result.items.some((i) => i.key.startsWith('mock-agent'))).toBe(false);
  });

  it('empty adapter result is empty-remote with no error and no static items', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideWorkflowBuilderUi({
          catalog: { solution: { load: () => of({ items: [] }) } },
        }),
      ],
    });
    const svc = TestBed.inject(EnsoTaskCatalogService);
    const result = await firstValueFrom(svc.loadCatalog({ mode: 'solution-agents' }));
    expect(result.source).toBe('empty');
    expect(result.emptyRemote).toBe(true);
    expect(result.error).toBeNull();
    expect(result.items).toEqual([]);
  });

  it('invalid adapter shape is error path with static items and no mock keys', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideWorkflowBuilderUi({
          catalog: {
            solution: {
              load: () => of({ notItems: true } as unknown as { items: PaletteItem[] }),
            },
          },
        }),
      ],
    });
    const svc = TestBed.inject(EnsoTaskCatalogService);
    const result = await firstValueFrom(svc.loadCatalog({ mode: 'solution-agents' }));
    expect(result.source).toBe('static');
    expect(result.emptyRemote).toBe(false);
    expect(result.error).toContain('Catalog adapter failed');
    expect(result.error).not.toMatch(/mock agents/i);
    expect(result.items.some((i) => i.type === 'Condition')).toBe(true);
    expect(result.items.some((i) => i.origin === 'default-agent')).toBe(true);
    expect(result.items.some((i) => i.key.startsWith('mock-agent'))).toBe(false);
  });

  it('omit without adapter is empty-remote (no static featured)', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    const svc = TestBed.inject(EnsoTaskCatalogService);
    const result = await firstValueFrom(svc.loadCatalog({ mode: 'solution-agents' }));
    expect(result.source).toBe('empty');
    expect(result.emptyRemote).toBe(true);
    expect(result.error).toBeNull();
    expect(result.items).toEqual([]);
    expect(result.items.some((i) => staticFeaturedKeys.includes(i.key))).toBe(false);
  });

  it('allow-list filters static featured types and remote rows; remaining static still compose', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideWorkflowBuilderUi({
          catalog: { solution: { load: () => of({ items: [hostAgent] }) } },
        }),
      ],
    });
    const ui = TestBed.inject(UiConfigService);
    ui.applyLayers(
      { palette: { solution: { types: { mode: 'only', types: ['Condition'] } } } },
      { kind: 'ok', message: null },
    );
    const svc = TestBed.inject(EnsoTaskCatalogService);
    const result = await firstValueFrom(svc.loadCatalog({ mode: 'solution-agents' }));
    expect(result.emptyRemote).toBe(false);
    expect(result.items.map((i) => i.type)).toEqual(['Condition']);
    expect(result.items.some((i) => i.key === 'host-a')).toBe(false);
  });

  it('present defaultAgents replace Blank Agent and tag origin', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideWorkflowBuilderUi({
          catalog: { solution: { load: () => of({ items: [hostAgent] }) } },
        }),
      ],
    });
    TestBed.inject(UiConfigService).applyLayers(
      {
        palette: {
          solution: {
            defaultAgents: {
              mode: 'present',
              cards: [{ key: 'claims', label: 'Claims Agent', description: 'Triage' }],
            },
          },
        },
      },
      { kind: 'ok', message: null },
    );
    const result = await firstValueFrom(
      TestBed.inject(EnsoTaskCatalogService).loadCatalog({ mode: 'solution-agents' }),
    );
    const agents = result.items.filter((i) => i.type === 'AIAgent');
    expect(agents.map((i) => i.key)).toEqual(['claims', 'host-a']);
    expect(agents.find((i) => i.key === 'claims')?.origin).toBe('default-agent');
    expect(agents.find((i) => i.key === 'host-a')?.origin).toBeUndefined();
  });
});

describe('EnsoTaskCatalogService (U-HPI-01 host overlay)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  const streamCard = { key: 'stream', type: 'Stream', label: 'Stream' };
  const hostB: PaletteItem = {
    key: 'host-b',
    type: 'AIAgent',
    label: 'Host-B',
    description: 'From palettes input',
    categoryId: 'agents',
  };

  it('omit overlay still uses adapter', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideWorkflowBuilderUi({
          catalog: { solution: { load: () => of({ items: [hostAgent] }) } },
        }),
      ],
    });
    const result = await firstValueFrom(
      TestBed.inject(EnsoTaskCatalogService).loadCatalog({ mode: 'solution-agents' }),
    );
    expect(result.source).toBe('adapter');
    expect(result.items.some((i) => i.key === 'host-a')).toBe(true);
  });

  it('hostPalettes [] is empty-remote source host', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    const result = await firstValueFrom(
      TestBed.inject(EnsoTaskCatalogService).loadCatalog({
        mode: 'solution-agents',
        hostPalettes: [],
      }),
    );
    expect(result.source).toBe('host');
    expect(result.emptyRemote).toBe(true);
    expect(result.items).toEqual([]);
    expect(result.error).toBeNull();
  });

  it('present hostPalettes omits static featured, keeps defaults', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    const result = await firstValueFrom(
      TestBed.inject(EnsoTaskCatalogService).loadCatalog({
        mode: 'solution-agents',
        hostPalettes: [hostB],
      }),
    );
    expect(result.source).toBe('host');
    expect(result.emptyRemote).toBe(false);
    expect(result.items.some((i) => i.key === 'host-b')).toBe(true);
    expect(result.items.some((i) => i.type === 'Condition')).toBe(false);
    expect(result.items.some((i) => i.origin === 'default-agent')).toBe(true);
  });

  it('present hostPalettes keeps host logic extras and not the static Condition key', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    const extra: PaletteItem = {
      key: 'extra-c',
      type: 'Condition',
      label: 'Extra If',
      description: '',
      categoryId: 'logic',
    };
    const result = await firstValueFrom(
      TestBed.inject(EnsoTaskCatalogService).loadCatalog({
        mode: 'solution-agents',
        hostPalettes: [extra, hostB],
      }),
    );
    expect(result.items.filter((i) => i.type === 'Condition').map((i) => i.key)).toEqual(['extra-c']);
    expect(result.items.some((i) => i.key === 'Condition')).toBe(false);
  });

  it('agent-skills host palettes omit static featured', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    const result = await firstValueFrom(
      TestBed.inject(EnsoTaskCatalogService).loadCatalog({
        mode: 'agent-skills',
        hostPalettes: [hostB],
      }),
    );
    expect(result.source).toBe('host');
    expect(result.items.some((i) => i.type === 'Condition')).toBe(false);
    expect(result.items.some((i) => i.key === 'host-b')).toBe(true);
  });

  it('present hostPalettes wins over catalog provider token', async () => {
    const adapterLoad = vi.fn(() => of({ items: [hostAgent] }));
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideWorkflowBuilderUi({
          catalog: { solution: { load: adapterLoad } },
        }),
      ],
    });
    const result = await firstValueFrom(
      TestBed.inject(EnsoTaskCatalogService).loadCatalog({
        mode: 'solution-agents',
        hostPalettes: [hostB],
      }),
    );
    expect(adapterLoad).not.toHaveBeenCalled();
    expect(result.source).toBe('host');
    expect(result.items.some((i) => i.key === 'host-b')).toBe(true);
    expect(result.items.some((i) => i.key === 'host-a')).toBe(false);
  });

  it('drops unknown Stream type and keeps a valid sibling', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    const result = await firstValueFrom(
      TestBed.inject(EnsoTaskCatalogService).loadCatalog({
        mode: 'solution-agents',
        hostPalettes: [streamCard, hostB],
      }),
    );
    expect(result.items.some((i) => i.type === ('Stream' as PaletteItem['type']))).toBe(false);
    expect(result.items.some((i) => i.key === 'host-b')).toBe(true);
  });

  it('non-empty all-unknown host palettes is not empty-remote', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    const result = await firstValueFrom(
      TestBed.inject(EnsoTaskCatalogService).loadCatalog({
        mode: 'solution-agents',
        hostPalettes: [streamCard],
      }),
    );
    expect(result.source).toBe('host');
    expect(result.emptyRemote).toBe(false);
    expect(result.items.some((i) => i.type === 'Condition')).toBe(true);
    expect(result.items.some((i) => i.origin === 'default-agent')).toBe(true);
    expect(result.items.some((i) => i.key === 'stream')).toBe(false);
  });

  it('hostDefaultAgents present wins over JSON defaultAgents', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideWorkflowBuilderUi({
          catalog: { solution: { load: () => of({ items: [hostAgent] }) } },
        }),
      ],
    });
    TestBed.inject(UiConfigService).applyLayers(
      {
        palette: {
          solution: {
            defaultAgents: {
              mode: 'present',
              cards: [{ key: 'claims', label: 'Claims Agent', description: 'Triage' }],
            },
          },
        },
      },
      { kind: 'ok', message: null },
    );
    const result = await firstValueFrom(
      TestBed.inject(EnsoTaskCatalogService).loadCatalog({
        mode: 'solution-agents',
        hostDefaultAgents: [{ key: 'policy', label: 'Policy Agent', description: 'From input' }],
      }),
    );
    const defaults = result.items.filter((i) => i.origin === 'default-agent');
    expect(defaults.map((i) => i.key)).toEqual(['policy']);
    expect(result.items.some((i) => i.key === 'claims')).toBe(false);
  });

  it('hostPalettes [] ignores hostDefaultAgents', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    const result = await firstValueFrom(
      TestBed.inject(EnsoTaskCatalogService).loadCatalog({
        mode: 'solution-agents',
        hostPalettes: [],
        hostDefaultAgents: [{ key: 'policy', label: 'Policy Agent', description: '' }],
      }),
    );
    expect(result.emptyRemote).toBe(true);
    expect(result.items).toEqual([]);
  });
});
