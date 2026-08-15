import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it, beforeEach } from 'vitest';
import { App } from './app';
import { routes } from './app.routes';
import { EnsoTaskCatalogService } from './core/data/enso-task-catalog.service';
import {
  BLANK_AGENT_TYPE,
  FEATURED_PALETTE_TYPES,
  PALETTE_ITEMS,
} from './core/domain/palette.catalog';
import type { NodeType } from './core/domain/workflow.models';
import { WorkflowFacade } from './core/facade/workflow.facade';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let facade: WorkflowFacade;

  beforeEach(async () => {
    const staticItems = PALETTE_ITEMS.filter(
      (i) =>
        (FEATURED_PALETTE_TYPES as readonly NodeType[]).includes(i.type) ||
        i.type === BLANK_AGENT_TYPE,
    );
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideRouter(routes),
        {
          provide: EnsoTaskCatalogService,
          useValue: {
            loadCatalog: () =>
              of({
                categories: [],
                items: [...staticItems],
                source: 'static' as const,
                error: null,
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    facade = TestBed.inject(WorkflowFacade);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('initializes with an empty Untitled workflow', async () => {
    expect(facade.workflowName()).toBe('Untitled Workflow');
    expect(facade.nodeCount()).toBe(0);
    expect(facade.edgeCount()).toBe(0);
    await fixture.whenStable();
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Drafts /');
    expect(text).toContain('Untitled Workflow');
    expect(text).not.toContain('Webhook Trigger');
    expect(text).toContain('Agents Library');
    expect(text).toContain('Properties');
    // Solution palette: Condition / Router / Repeater + Blank Agent (+ agents API list)
    expect(text).toContain('Condition');
    expect(text).toContain('Blank Agent');
    expect(text).not.toContain('Initiate workflows');
    expect(text).not.toContain('Canvas engine in Phase 2');
  });

  it('createNode from facade increases node count', () => {
    const before = facade.nodeCount();
    const id = facade.createNode('Notification', { x: 50, y: 60 });
    expect(id).toBeTruthy();
    expect(facade.nodeCount()).toBe(before + 1);
    fixture.detectChanges();
    expect(facade.selection().nodeIds).toContain(id!);
  });
});
