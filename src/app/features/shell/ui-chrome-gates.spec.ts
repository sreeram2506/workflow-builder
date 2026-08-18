import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EnsoTaskCatalogService } from '../../core/data/enso-task-catalog.service';
import {
  BLANK_AGENT_TYPE,
  FEATURED_PALETTE_TYPES,
  PALETTE_ITEMS,
} from '../../core/domain/palette.catalog';
import type { NodeType } from '../../core/domain/workflow.models';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { UiConfigService } from '../../core/ui-config';
import { ShellLayoutComponent } from './shell-layout.component';

describe('UI chrome gates (ShellLayout)', () => {
  let fixture: ComponentFixture<ShellLayoutComponent>;
  let facade: WorkflowFacade;
  let ui: UiConfigService;

  beforeEach(async () => {
    const staticItems = PALETTE_ITEMS.filter(
      (i) =>
        (FEATURED_PALETTE_TYPES as readonly NodeType[]).includes(i.type) ||
        i.type === BLANK_AGENT_TYPE,
    ).map((i) => (i.type === 'AIAgent' ? { ...i, origin: 'default-agent' as const } : i));
    await TestBed.configureTestingModule({
      imports: [ShellLayoutComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: EnsoTaskCatalogService,
          useValue: {
            loadCatalog: () =>
              of({
                categories: [],
                items: [...staticItems],
                source: 'static' as const,
                error: null,
                emptyRemote: false,
              }),
          },
        },
      ],
    }).compileComponents();

    facade = TestBed.inject(WorkflowFacade);
    facade.initialize();
    ui = TestBed.inject(UiConfigService);
    fixture = TestBed.createComponent(ShellLayoutComponent);
    fixture.detectChanges();
  });

  it('defaults show agents library and save control', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="nodes-library-root"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[aria-label="Save"]')).toBeTruthy();
  });

  it('hides agents library when agentsLibrary.enabled is false', () => {
    ui.applyLayers({ agentsLibrary: { enabled: false } }, { kind: 'ok', message: null });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="nodes-library-root"]')).toBeNull();
  });

  it('Save shortcut no-ops when canvas.save is false', () => {
    ui.applyLayers({ canvas: { save: false } }, { kind: 'ok', message: null });
    fixture.detectChanges();
    const spy = vi.spyOn(facade, 'saveDownload');
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 's', metaKey: true, bubbles: true }),
    );
    expect(spy).not.toHaveBeenCalled();
  });

  it('shows config banner for invalid load status', () => {
    ui.applyLayers({}, { kind: 'invalid', message: 'Invalid UI config JSON' });
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector(
      '[data-testid="ui-config-banner"]',
    ) as HTMLElement | null;
    expect(banner).toBeTruthy();
    expect(banner?.textContent).toContain('Invalid UI config JSON');
  });

  it('hides layout dropdown when canvas.layoutControls is false', () => {
    ui.applyLayers({ canvas: { layoutControls: false } }, { kind: 'ok', message: null });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="layout-select"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-label="Zoom in"]')).toBeTruthy();
  });

  it('keeps the graph when canvas.enabled is false and hides canvas chrome', () => {
    ui.applyLayers({ canvas: { enabled: false } }, { kind: 'ok', message: null });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="workflow-canvas"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[aria-label="Zoom in"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-label="Save"]')).toBeNull();
  });

  it('hides only zoom buttons when canvas.zoomControls is false', () => {
    ui.applyLayers({ canvas: { zoomControls: false } }, { kind: 'ok', message: null });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="workflow-canvas"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[aria-label="Zoom in"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-label="Save"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-testid="layout-select"]')).toBeTruthy();
  });

  it('lets libraries use the top of the stage when the top bar is hidden and no tabs are open', () => {
    ui.applyLayers(
      { topBar: { enabled: false }, agentTabs: { enabled: true } },
      { kind: 'ok', message: null },
    );
    fixture.detectChanges();
    const lib = fixture.nativeElement.querySelector(
      '[data-testid="nodes-library-root"]',
    ) as HTMLElement | null;
    const props = fixture.nativeElement.querySelector(
      '[data-testid="properties-root"]',
    ) as HTMLElement | null;
    expect(lib).toBeTruthy();
    expect(Number.parseInt(lib?.style.top ?? '', 10)).toBe(16);
    expect(props).toBeTruthy();
    expect(Number.parseInt(props?.style.top ?? '', 10)).toBe(16);
  });

  it('hides the agent tab strip when agentTabs.enabled is false', () => {
    const id = facade.createNode('AIAgent', { x: 0, y: 0 })!;
    facade.openAgentTab(id);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="agent-tabs-strip"]')).toBeTruthy();

    ui.applyLayers({ agentTabs: { enabled: false } }, { kind: 'ok', message: null });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="agent-tabs-strip"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="nodes-library-root"]')).toBeTruthy();
  });
});
