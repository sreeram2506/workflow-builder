import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { WorkflowNode } from '../../core/domain/workflow.models';
import { WorkflowNodeComponent } from './workflow-node.component';

function conditionNode(data: Record<string, unknown> = {}): WorkflowNode {
  return {
    id: 'n-Condition-test',
    type: 'Condition',
    label: 'Extra If',
    subtitle: '',
    position: { x: 0, y: 0 },
    status: 'idle',
    data,
  };
}

describe('WorkflowNodeComponent host icons', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
  });
  async function mount(node: WorkflowNode): Promise<ComponentFixture<WorkflowNodeComponent>> {
    await TestBed.configureTestingModule({
      imports: [WorkflowNodeComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(WorkflowNodeComponent);
    fixture.componentRef.setInput('node', node);
    fixture.detectChanges();
    return fixture;
  }

  it('uses iconPath inside the logic shape instead of the type glyph', async () => {
    const fixture = await mount(conditionNode({ iconPath: 'M12 2 L2 22 h20 z' }));
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="node-host-icon-path"]')?.querySelector('path')?.getAttribute('d')).toBe(
      'M12 2 L2 22 h20 z',
    );
    expect(el.querySelector('.shape-glyph')).toBeNull();
    expect(el.querySelector('.shape-fill')).toBeTruthy();
  });

  it('uses iconUrl image and keeps the type frame', async () => {
    const fixture = await mount(conditionNode({ iconUrl: 'https://cdn.example/c.png' }));
    const el = fixture.nativeElement as HTMLElement;
    const img = el.querySelector('[data-testid="node-host-icon-img"]') as HTMLImageElement | null;
    expect(img?.getAttribute('src')).toBe('https://cdn.example/c.png');
    expect(el.querySelector('.shape-glyph')).toBeNull();
  });

  it('falls back to iconPath when the image errors', async () => {
    const fixture = await mount(
      conditionNode({ iconUrl: 'https://cdn.example/missing.png', iconPath: 'M0 0h10v10H0z' }),
    );
    const el = fixture.nativeElement as HTMLElement;
    const img = el.querySelector('[data-testid="node-host-icon-img"]') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="node-host-icon-img"]')).toBeNull();
    expect(el.querySelector('[data-testid="node-host-icon-path"]')).toBeTruthy();
  });
});
