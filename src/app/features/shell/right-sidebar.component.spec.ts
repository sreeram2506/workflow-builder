import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { RightSidebarComponent } from './right-sidebar.component';

describe('RightSidebarComponent logic nodes', () => {
  let facade: WorkflowFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RightSidebarComponent],
    });
    facade = TestBed.inject(WorkflowFacade);
    facade.initialize();
  });

  function createExpanded(): RightSidebarComponent {
    const fixture = TestBed.createComponent(RightSidebarComponent);
    fixture.componentRef.setInput('collapsed', false);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('binds Condition expression and hides Ignore Keys', () => {
    facade.selectNodes(['n-condition']);
    const cmp = createExpanded();
    expect(cmp.form?.get('configuration.condition')?.value).toBe('payload.needsDelay === true');
    expect(cmp.configFields.some((f) => f.config_path.includes('ignore_keys'))).toBe(false);
    expect(cmp.boundNodeType).toBe('Condition');
  });

  it('binds Router with no configuration fields', () => {
    facade.selectNodes(['n-router']);
    const cmp = createExpanded();
    expect(cmp.configFields).toEqual([]);
    expect(cmp.boundNodeType).toBe('Decision');
  });

  it('binds Repeater mock workflow and version', () => {
    facade.selectNodes(['n-repeater']);
    const cmp = createExpanded();
    expect(cmp.form?.get('configuration.repeater_workflowId')?.value).toBe('wf-claims-intake');
    expect(cmp.form?.get('configuration.repeater_versionId')?.value).toBe('v1');
    expect(cmp.form?.get('configuration.repeater_is_paused')?.value).toBe(false);
  });

  it('binds Router connector name and required condition', () => {
    facade.selectEdges(['e6']);
    const cmp = createExpanded();
    expect(cmp.edgeKind).toBe('connector');
    expect(cmp.form?.get('label')?.value).toBe('Blank Condition');
    expect(cmp.form?.get('condition')?.value).toBe('');
    expect(cmp.form?.valid).toBe(false);
  });

  it('binds Condition outgoing label as read-only with no Save', () => {
    facade.selectEdges(['e3']);
    const cmp = createExpanded();
    expect(cmp.edgeKind).toBe('condition-out');
    expect(cmp.form?.get('label')?.disabled).toBe(true);
    expect(cmp.form?.get('label')?.value).toBe('true');
    expect(cmp.canSave).toBe(false);
  });
});
