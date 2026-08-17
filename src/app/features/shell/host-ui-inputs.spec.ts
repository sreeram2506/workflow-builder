import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { EnsoTaskCatalogService } from '../../core/data/enso-task-catalog.service';
import {
  BLANK_AGENT_TYPE,
  FEATURED_PALETTE_TYPES,
  PALETTE_ITEMS,
} from '../../core/domain/palette.catalog';
import type { NodeType } from '../../core/domain/workflow.models';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { UiConfigService } from '../../core/ui-config';
import { AgentSkillsShellComponent } from '../agent/agent-skills-shell.component';
import { ShellLayoutComponent } from './shell-layout.component';

function catalogStub() {
  const staticItems = PALETTE_ITEMS.filter(
    (i) =>
      (FEATURED_PALETTE_TYPES as readonly NodeType[]).includes(i.type) ||
      i.type === BLANK_AGENT_TYPE,
  ).map((i) => (i.type === 'AIAgent' ? { ...i, origin: 'default-agent' as const } : i));
  return {
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
  };
}

describe('Host UI [ui] input (ShellLayout)', () => {
  let fixture: ComponentFixture<ShellLayoutComponent>;
  let ui: UiConfigService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellLayoutComponent],
      providers: [provideHttpClient(), provideRouter([]), catalogStub()],
    }).compileComponents();

    TestBed.inject(WorkflowFacade).initialize();
    ui = TestBed.inject(UiConfigService);
    fixture = TestBed.createComponent(ShellLayoutComponent);
    fixture.detectChanges();
  });

  it('omit [ui] keeps provider/JSON-only chrome', () => {
    ui.applyLayers({ agentsLibrary: { enabled: false } }, { kind: 'ok', message: null });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="nodes-library-root"]')).toBeNull();
  });

  it('[ui]="{}" does not force leaves off', () => {
    ui.applyLayers({ agentsLibrary: { enabled: true } }, { kind: 'ok', message: null });
    fixture.componentRef.setInput('ui', {});
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="nodes-library-root"]')).toBeTruthy();
  });

  it('[ui] partial wins over global provider layer', () => {
    ui.applyLayers({ agentsLibrary: { enabled: false } }, { kind: 'ok', message: null });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="nodes-library-root"]')).toBeNull();

    fixture.componentRef.setInput('ui', { agentsLibrary: { enabled: true } });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="nodes-library-root"]')).toBeTruthy();
    // Global service unchanged
    expect(ui.features().agentsLibrary.enabled).toBe(false);
  });

  it('reactive [ui] update hides properties without remount', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="properties-root"]')).toBeTruthy();
    fixture.componentRef.setInput('ui', { propertiesPanel: { enabled: false } });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="properties-root"]')).toBeNull();
  });

  it('two shells isolate overlays without mutating global', () => {
    ui.applyLayers({}, { kind: 'ok', message: null });
    const a = TestBed.createComponent(ShellLayoutComponent);
    const b = TestBed.createComponent(ShellLayoutComponent);
    a.componentRef.setInput('ui', { agentsLibrary: { enabled: false } });
    b.componentRef.setInput('ui', { agentsLibrary: { enabled: true }, propertiesPanel: { enabled: false } });
    a.detectChanges();
    b.detectChanges();

    expect(a.nativeElement.querySelector('[data-testid="nodes-library-root"]')).toBeNull();
    expect(b.nativeElement.querySelector('[data-testid="nodes-library-root"]')).toBeTruthy();
    expect(b.nativeElement.querySelector('[data-testid="properties-root"]')).toBeNull();
    expect(ui.features().agentsLibrary.enabled).toBe(true);
    expect(ui.features().propertiesPanel.enabled).toBe(true);
  });
});

describe('Host UI [ui] input (AgentSkillsShell)', () => {
  let fixture: ComponentFixture<AgentSkillsShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentSkillsShellComponent],
      providers: [
        provideHttpClient(),
        provideRouter([{ path: 'agent/:nodeId', component: AgentSkillsShellComponent }]),
        catalogStub(),
      ],
    }).compileComponents();

    const facade = TestBed.inject(WorkflowFacade);
    facade.initialize();
    await TestBed.inject(Router).navigateByUrl('/agent/test-agent');

    fixture = TestBed.createComponent(AgentSkillsShellComponent);
    fixture.detectChanges();
  });

  it('hides skills library via [ui]', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="nodes-library-root"]')).toBeTruthy();
    fixture.componentRef.setInput('ui', { skillsLibrary: { enabled: false } });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="nodes-library-root"]')).toBeNull();
  });
});
