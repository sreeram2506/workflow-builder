import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { EnsoTaskCatalogService } from '../../core/data/enso-task-catalog.service';
import type { PaletteItem } from '../../core/domain/palette.catalog';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { ShellLayoutComponent } from './shell-layout.component';

const hostItem: PaletteItem = {
  key: 'host-b',
  type: 'AIAgent',
  label: 'Host-B',
  description: 'From parent',
  categoryId: 'agents',
};

describe('ShellLayout palettes input (U-HPI-01)', () => {
  it('forwards [palettes] and [defaultAgents] to catalog load', async () => {
    const loadCatalog = vi.fn((_options?: unknown) =>
      of({
        categories: [],
        items: [hostItem],
        source: 'host' as const,
        error: null,
        emptyRemote: false,
      }),
    );
    await TestBed.configureTestingModule({
      imports: [ShellLayoutComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: EnsoTaskCatalogService, useValue: { loadCatalog } },
      ],
    }).compileComponents();
    TestBed.inject(WorkflowFacade).initialize();
    const fixture = TestBed.createComponent(ShellLayoutComponent);
    fixture.componentRef.setInput('palettes', [hostItem]);
    fixture.componentRef.setInput('defaultAgents', [
      { key: 'policy', label: 'Policy Agent', description: '' },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    const call = loadCatalog.mock.calls.at(-1)?.[0] as {
      hostPalettes?: PaletteItem[];
      hostDefaultAgents?: { key: string }[];
    } | undefined;
    expect(call?.hostPalettes?.[0]?.key).toBe('host-b');
    expect(call?.hostDefaultAgents?.[0]?.key).toBe('policy');
  });
});
