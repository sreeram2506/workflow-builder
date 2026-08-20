import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { routes } from '../../app.routes';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { UiConfigService } from '../../core/ui-config';
import { CanvasViewportComponent } from './canvas-viewport.component';

describe('CanvasViewportComponent agent dblclick', () => {
  let fixture: ComponentFixture<CanvasViewportComponent>;
  let facade: WorkflowFacade;
  let ui: UiConfigService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasViewportComponent],
      providers: [provideHttpClient(), provideRouter(routes)],
    }).compileComponents();
    facade = TestBed.inject(WorkflowFacade);
    ui = TestBed.inject(UiConfigService);
    facade.initialize();
    fixture = TestBed.createComponent(CanvasViewportComponent);
    fixture.detectChanges();
  });

  function dblclick(nodeId: string): void {
    fixture.componentInstance.onNodeDblClick({
      event: new MouseEvent('dblclick'),
      nodeId,
    });
  }

  it('calls selectAgentTab when agentTabs.doubleClick is omitted (default true)', () => {
    const id = facade.createNode('AIAgent', { x: 40, y: 40 })!;
    const spy = vi.spyOn(facade, 'selectAgentTab');
    dblclick(id);
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('does not call selectAgentTab when agentTabs.doubleClick is false', () => {
    ui.applyLayers({ agentTabs: { doubleClick: false } }, { kind: 'ok', message: null });
    fixture.detectChanges();
    const id = facade.createNode('AIAgent', { x: 40, y: 40 })!;
    const spy = vi.spyOn(facade, 'selectAgentTab');
    dblclick(id);
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not re-enter when already on a nested agent canvas', () => {
    const id = facade.createNode('AIAgent', { x: 0, y: 0 })!;
    expect(facade.enterAgentCanvas(id)).toBe(true);
    const spy = vi.spyOn(facade, 'selectAgentTab');
    dblclick(id);
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not navigate in view mode when doubleClick is false', () => {
    ui.applyLayers({ agentTabs: { doubleClick: false } }, { kind: 'ok', message: null });
    fixture.detectChanges();
    const id = facade.createNode('AIAgent', { x: 40, y: 40 })!;
    facade.setEditorMode('view');
    const spy = vi.spyOn(facade, 'selectAgentTab');
    dblclick(id);
    expect(spy).not.toHaveBeenCalled();
  });
});
