import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, type Observable } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EnsoTaskCatalogService } from '../../core/data/enso-task-catalog.service';
import type { PaletteCatalogLoad } from '../../core/data/catalog.types';
import type { PaletteItem } from '../../core/domain/palette.catalog';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { UiConfigService } from '../../core/ui-config';
import { LeftSidebarComponent } from './left-sidebar.component';

const condition: PaletteItem = {
  key: 'Condition',
  type: 'Condition',
  label: 'Condition',
  description: 'Branch',
  categoryId: 'logic',
};
const blank: PaletteItem = {
  key: 'AIAgent',
  type: 'AIAgent',
  label: 'Blank Agent',
  description: 'Add an agent',
  categoryId: 'logic',
  origin: 'default-agent',
};
const claims: PaletteItem = {
  key: 'claims',
  type: 'AIAgent',
  label: 'Claims Agent',
  description: 'Triage',
  categoryId: 'logic',
  origin: 'default-agent',
};
const remoteAgent: PaletteItem = {
  key: 'enso-agent-1',
  type: 'AIAgent',
  label: 'Remote Agent',
  description: 'From catalog',
  categoryId: 'agents',
};

function catalogLoad(partial: Partial<PaletteCatalogLoad> & { items: PaletteItem[] }): PaletteCatalogLoad {
  return {
    categories: [],
    source: 'static',
    error: null,
    emptyRemote: false,
    ...partial,
  };
}

describe('LeftSidebar palette (U-PAL-02)', () => {
  async function mount(load: () => Observable<PaletteCatalogLoad>): Promise<{
    fixture: ComponentFixture<LeftSidebarComponent>;
    loadCatalog: ReturnType<typeof vi.fn>;
    ui: UiConfigService;
  }> {
    const loadCatalog = vi.fn(load);
    await TestBed.configureTestingModule({
      imports: [LeftSidebarComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: EnsoTaskCatalogService, useValue: { loadCatalog } },
      ],
    }).compileComponents();
    TestBed.inject(WorkflowFacade).initialize();
    const ui = TestBed.inject(UiConfigService);
    const fixture = TestBed.createComponent(LeftSidebarComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return { fixture, loadCatalog, ui };
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('empty-remote shows only the empty-state testid', async () => {
    const { fixture } = await mount(() =>
      of(catalogLoad({ items: [], source: 'empty', emptyRemote: true })),
    );
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="palette-empty-remote"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="logic-shape-Condition"]')).toBeNull();
    expect(el.querySelector('[data-testid="default-agent-strip"]')).toBeNull();
  });

  it('error banner has no mock-agent labels and still shows static cards', async () => {
    const { fixture } = await mount(() =>
      of(
        catalogLoad({
          items: [condition, blank],
          error: 'Enso pipeline/list failed (HTTP 500). Showing built-in types only.',
        }),
      ),
    );
    const el = fixture.nativeElement as HTMLElement;
    const text = el.textContent ?? '';
    expect(text).toContain('Showing built-in types only');
    expect(text).not.toMatch(/mock agents/i);
    expect(text).not.toContain('Claims Intake Agent');
    expect(el.querySelector('[data-testid="logic-shape-Condition"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="default-agent-card-AIAgent"]')).toBeTruthy();
  });

  it('allow-list catalog items hide Decision from the featured strip', async () => {
    const { fixture } = await mount(() => of(catalogLoad({ items: [condition, blank] })));
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="logic-shape-Condition"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="logic-shape-Decision"]')).toBeNull();
    expect(el.querySelector('[data-testid="logic-shape-Repeater"]')).toBeNull();
  });

  it('renders one default-agent strip for tagged cards and lists adapter agents separately', async () => {
    const { fixture } = await mount(() =>
      of(catalogLoad({ items: [condition, claims, blank, remoteAgent] })),
    );
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="default-agent-strip"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="default-agent-card-claims"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="default-agent-card-AIAgent"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="solution-agent-enso-agent-1"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="solution-agent-claims"]')).toBeNull();
  });

  it('reloads catalog when palette features change', async () => {
    const { loadCatalog, ui, fixture } = await mount(() =>
      of(catalogLoad({ items: [condition, blank] })),
    );
    expect(loadCatalog).toHaveBeenCalledTimes(1);
    ui.applyLayers(
      { palette: { solution: { types: { mode: 'only', types: ['Condition'] } } } },
      { kind: 'ok', message: null },
    );
    fixture.detectChanges();
    await fixture.whenStable();
    expect(loadCatalog.mock.calls.length).toBeGreaterThan(1);
  });

  it('omits overlay keys when palettes input is unbound', async () => {
    const { loadCatalog } = await mount(() => of(catalogLoad({ items: [condition, blank] })));
    const options = loadCatalog.mock.calls[0]?.[0] as { hostPalettes?: unknown };
    expect(options.hostPalettes).toBeUndefined();
  });

  it('forwards empty palettes as hostPalettes []', async () => {
    const { fixture, loadCatalog } = await mount(() =>
      of(catalogLoad({ items: [], source: 'host', emptyRemote: true })),
    );
    fixture.componentRef.setInput('palettes', []);
    fixture.detectChanges();
    await fixture.whenStable();
    const forwarded = loadCatalog.mock.calls.some(
      (call) => Array.isArray(call[0]?.hostPalettes) && call[0].hostPalettes.length === 0,
    );
    expect(forwarded).toBe(true);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="palette-empty-remote"]')).toBeTruthy();
  });

  it('reloads catalog when palettes input changes', async () => {
    const { fixture, loadCatalog } = await mount(() => of(catalogLoad({ items: [condition, blank] })));
    const initial = loadCatalog.mock.calls.length;
    fixture.componentRef.setInput('palettes', [remoteAgent]);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(loadCatalog.mock.calls.length).toBeGreaterThan(initial);
    const last = loadCatalog.mock.calls.at(-1)?.[0] as { hostPalettes?: PaletteItem[] };
    expect(last.hostPalettes?.[0]?.key).toBe('enso-agent-1');
  });

  it('forwards defaultAgents on solution scope', async () => {
    const { fixture, loadCatalog } = await mount(() => of(catalogLoad({ items: [condition, blank] })));
    fixture.componentRef.setInput('defaultAgents', [
      { key: 'policy', label: 'Policy Agent', description: '' },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    const last = loadCatalog.mock.calls.at(-1)?.[0] as { hostDefaultAgents?: { key: string }[] };
    expect(last.hostDefaultAgents?.[0]?.key).toBe('policy');
  });

  it('agent scope forwards palettes and not defaultAgents', async () => {
    const { fixture, loadCatalog } = await mount(() => of(catalogLoad({ items: [condition] })));
    fixture.componentRef.setInput('paletteScope', 'agent');
    fixture.componentRef.setInput('palettes', [remoteAgent]);
    fixture.componentRef.setInput('defaultAgents', [
      { key: 'policy', label: 'Policy Agent', description: '' },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    const last = loadCatalog.mock.calls.at(-1)?.[0] as {
      mode?: string;
      hostPalettes?: PaletteItem[];
      hostDefaultAgents?: unknown;
    };
    expect(last.mode).toBe('agent-skills');
    expect(last.hostPalettes?.[0]?.key).toBe('enso-agent-1');
    expect(last.hostDefaultAgents).toBeUndefined();
  });
});
