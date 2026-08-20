import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { routes } from '../../app.routes';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { CanvasViewportComponent } from './canvas-viewport.component';

describe('CanvasViewportComponent connector dblclick', () => {
  let fixture: ComponentFixture<CanvasViewportComponent>;
  let facade: WorkflowFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasViewportComponent],
      providers: [provideHttpClient(), provideRouter(routes)],
    }).compileComponents();
    facade = TestBed.inject(WorkflowFacade);
    facade.initialize();
    const a = facade.createNode('Action', { x: 40, y: 40 })!;
    const b = facade.createNode('Action', { x: 280, y: 40 })!;
    expect(facade.createEdge(a, b)).toBeTruthy();
    fixture = TestBed.createComponent(CanvasViewportComponent);
    fixture.detectChanges();
  });

  it('does not add a waypoint when a connector is double-clicked', () => {
    const edge = facade.edges()[0];
    expect(edge).toBeTruthy();
    const before = [...edge.waypoints];
    const spy = vi.spyOn(facade, 'addWaypoint');
    const path = fixture.nativeElement.querySelector('path.edge') as SVGPathElement | null;
    expect(path).toBeTruthy();
    path?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
    expect(facade.edges().find((e) => e.id === edge.id)?.waypoints).toEqual(before);
  });

  it('still selects the connector on pointerdown', () => {
    const edge = facade.edges()[0];
    expect(edge).toBeTruthy();
    const path = fixture.nativeElement.querySelector('path.edge') as SVGPathElement | null;
    expect(path).toBeTruthy();
    path?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    expect(facade.selection().edgeIds).toContain(edge.id);
  });
});
