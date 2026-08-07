import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { App } from './app';
import { WorkflowFacade } from './core/facade/workflow.facade';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let facade: WorkflowFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    facade = TestBed.inject(WorkflowFacade);
    fixture.detectChanges();
  });

  it('initializes and shows workflow title', () => {
    expect(facade.workflowName()).toBe('Sample Automation');
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Sample Automation');
    expect(text).toContain('draft');
    expect(text).toContain('Undo');
    expect(text).toContain('Canvas engine in Phase 2');
  });
});
