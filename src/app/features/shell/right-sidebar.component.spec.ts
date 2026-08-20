import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { routes } from '../../app.routes';
import { MockWorkflowRepository } from '../../core/data/mock-workflow.repository';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { GraphStore } from '../../core/stores/graph.store';
import { RightSidebarComponent } from './right-sidebar.component';

describe('RightSidebarComponent logic nodes', () => {
  let facade: WorkflowFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RightSidebarComponent],
      providers: [provideRouter(routes)],
    });
    facade = TestBed.inject(WorkflowFacade);
    facade.initialize();
    TestBed.inject(GraphStore).setDocument(
      TestBed.inject(MockWorkflowRepository).getSampleWorkflow(),
      { skipHistory: true, skipAutosave: true },
    );
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
    expect(cmp.form?.get('builtin.condition')?.value).toBe('payload.needsDelay === true');
    expect(cmp.configFields.some((f) => f.path.includes('ignore_keys'))).toBe(false);
    expect(cmp.boundNodeType).toBe('Condition');
  });

  it('binds Router with library default configuration fields', () => {
    facade.selectNodes(['n-router']);
    const cmp = createExpanded();
    expect(cmp.configFields.map((f) => f.path)).toEqual(['name', 'description']);
    expect(cmp.boundNodeType).toBe('Decision');
  });

  it('binds Repeater mock workflow and version', () => {
    facade.selectNodes(['n-repeater']);
    const cmp = createExpanded();
    expect(cmp.form?.get('builtin.repeater_workflowId')?.value).toBe('wf-claims-intake');
    expect(cmp.form?.get('builtin.repeater_versionId')?.value).toBe('v1');
    expect(cmp.form?.get('builtin.repeater_is_paused')?.value).toBe(false);
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

describe('RightSidebarComponent host properties', () => {
  let facade: WorkflowFacade;
  let store: GraphStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RightSidebarComponent],
      providers: [provideRouter(routes)],
    });
    facade = TestBed.inject(WorkflowFacade);
    facade.initialize();
    store = TestBed.inject(GraphStore);
    store.setDocument(TestBed.inject(MockWorkflowRepository).getSampleWorkflow(), {
      skipHistory: true,
      skipAutosave: true,
    });
  });

  function createExpanded(): RightSidebarComponent {
    const fixture = TestBed.createComponent(RightSidebarComponent);
    fixture.componentRef.setInput('collapsed', false);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('renders host schema and Saves to properties map', () => {
    store.patchNode('n-action', {
      data: {
        propertiesSchema: {
          sections: [{ fields: [{ type: 'text', path: 'timeout', label: 'Timeout' }] }],
        },
        properties: { timeout: '5', tag: 'vip' },
      },
    });
    facade.selectNodes(['n-action']);
    const cmp = createExpanded();
    expect(cmp.form?.get('host.timeout')?.value).toBe('5');
    expect(cmp.remainingKeys).toContain('tag');
    cmp.form?.get('host.timeout')?.setValue('30');
    cmp.form?.markAsDirty();
    cmp.canSave = true;
    cmp.onSaveNode();
    const data = facade.nodes().find((n) => n.id === 'n-action')?.data;
    expect((data?.['properties'] as Record<string, unknown>)?.['timeout']).toBe('30');
    expect((data?.['properties'] as Record<string, unknown>)?.['tag']).toBe('vip');
  });

  it('does not flatten taskMeta on Action; library defaults fill host fields', () => {
    store.patchNode('n-action', {
      data: { taskMeta: { foo: 1, nested: { a: true } } },
    });
    facade.selectNodes(['n-action']);
    const cmp = createExpanded();
    expect(cmp.form?.get('host.foo')).toBeNull();
    expect(cmp.form?.get('host.nested_a')).toBeNull();
    expect(cmp.form?.get('host.name')).toBeTruthy();
    expect(cmp.form?.get('host.description')).toBeTruthy();
  });

  it('leaves leftover ensoTask unused as a form source', () => {
    store.patchNode('n-action', {
      data: {
        ensoTask: { skill: 'x', nested: { a: 1 } },
      },
    });
    facade.selectNodes(['n-action']);
    const cmp = createExpanded();
    expect(cmp.configFields.map((f) => f.path)).toEqual(['name', 'description']);
    expect(cmp.form?.get('enso')).toBeNull();
    expect(cmp.form?.get('host.skill')).toBeNull();
  });

  it('unknown ui_component is a disabled text control', () => {
    store.patchNode('n-action', {
      data: {
        propertiesSchema: {
          sections: [
            {
              fields: [
                {
                  type: 'text',
                  path: 'custom',
                  label: 'Custom',
                  ui_component: 'HostCustomWidget',
                },
              ],
            },
          ],
        },
        properties: { custom: 'opaque' },
      },
    });
    facade.selectNodes(['n-action']);
    const cmp = createExpanded();
    const ctrl = cmp.form?.get('host.custom');
    expect(ctrl?.value).toBe('opaque');
    expect(ctrl?.disabled).toBe(true);
  });

  it('omits colliding condition key from dynamic list', () => {
    store.patchNode('n-condition', {
      data: {
        condition: 'true',
        properties: { condition: 'dup', tag: 'x' },
      },
    });
    facade.selectNodes(['n-condition']);
    const cmp = createExpanded();
    expect(cmp.form?.get('builtin.condition')?.value).toBe('true');
    expect(cmp.remainingKeys).toEqual(['tag']);
  });

  it('prefers live palettes schema over node snapshot for paletteKey', () => {
    store.patchNode('n-action', {
      data: {
        paletteKey: 'timeout-action',
        propertiesSchema: {
          sections: [{ fields: [{ type: 'text', path: 'stale', label: 'Stale' }] }],
        },
        properties: { note: 'from-seed' },
      },
    });
    facade.selectNodes(['n-action']);
    const fixture = TestBed.createComponent(RightSidebarComponent);
    fixture.componentRef.setInput('collapsed', false);
    fixture.componentRef.setInput('palettes', [
      {
        key: 'timeout-action',
        type: 'Action',
        label: 'Timeout Action',
        description: '',
        categoryId: 'flow',
        propertiesSchema: {
          sections: [{ fields: [{ type: 'text', path: 'note', label: 'Note' }] }],
        },
      },
    ]);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    expect(cmp.form?.get('host.note')?.value).toBe('from-seed');
    expect(cmp.form?.get('host.stale')).toBeNull();
  });

  it('uses instance [properties] map when palette row has no schema', () => {
    store.patchNode('n-action', {
      data: {
        paletteKey: 'via-properties-input',
        properties: { channel: 'email', subject: 'Hi' },
      },
    });
    facade.selectNodes(['n-action']);
    const fixture = TestBed.createComponent(RightSidebarComponent);
    fixture.componentRef.setInput('collapsed', false);
    fixture.componentRef.setInput('palettes', [
      {
        key: 'via-properties-input',
        type: 'Action',
        label: 'Via',
        description: '',
        categoryId: 'flow',
      },
    ]);
    fixture.componentRef.setInput('properties', {
      'via-properties-input': {
        sections: [
          {
            fields: [
              { type: 'text', path: 'channel', label: 'Channel' },
              { type: 'text', path: 'subject', label: 'Subject' },
            ],
          },
        ],
      },
    });
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    expect(cmp.form?.get('host.channel')?.value).toBe('email');
    expect(cmp.form?.get('host.subject')?.value).toBe('Hi');
  });
});
