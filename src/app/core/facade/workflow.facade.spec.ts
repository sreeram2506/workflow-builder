import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { WorkflowFacade } from './workflow.facade';
import { GraphStore } from '../stores/graph.store';
import { UiStore } from '../stores/ui.store';

describe('WorkflowFacade', () => {
  let facade: WorkflowFacade;
  let graph: GraphStore;
  let ui: UiStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(WorkflowFacade);
    graph = TestBed.inject(GraphStore);
    ui = TestBed.inject(UiStore);
  });

  it('loads seed document on initialize', () => {
    facade.initialize();
    expect(graph.document()).not.toBeNull();
    expect(graph.document()?.nodes.length).toBe(5);
    expect(graph.document()?.edges.length).toBe(4);
    expect(graph.document()?.status).toBe('draft');
    expect(ui.theme()).toBe('dark');
  });

  it('toggles theme', () => {
    facade.initialize();
    facade.toggleTheme();
    expect(ui.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    facade.toggleTheme();
    expect(ui.theme()).toBe('dark');
  });
});
