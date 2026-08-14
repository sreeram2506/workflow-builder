import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, expect, it, beforeEach } from 'vitest';
import { App } from './app';
import { WorkflowFacade } from './core/facade/workflow.facade';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let facade: WorkflowFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    facade = TestBed.inject(WorkflowFacade);
    fixture.detectChanges();
  });

  it('initializes and renders seeded canvas nodes', () => {
    expect(facade.workflowName()).toBe('Sample Automation');
    expect(facade.nodeCount()).toBe(7);
    expect(facade.edgeCount()).toBe(6);
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Drafts /');
    expect(text).toContain('Sample Automation');
    expect(text).toContain('Webhook Trigger');
    expect(text).toContain('Nodes Library');
    expect(text).toContain('Properties');
    expect(text).toContain('Search nodes');
    // Catalog items (click-to-add targets)
    expect(text).toContain('Initiate workflows');
    expect(text).toContain('Condition');
    expect(text).not.toContain('Blank Agent');
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
