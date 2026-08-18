import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PaletteItem } from '../../core/domain/palette.catalog';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { NestedSkillsLibraryComponent } from './nested-skills-library.component';

const policy: PaletteItem = {
  key: 'policy',
  type: 'AIAgent',
  label: 'Policy Check',
  description: 'Validate policy rules',
  categoryId: 'flow',
};

describe('NestedSkillsLibraryComponent', () => {
  const addSkillFromPaletteItem = vi.fn(() => true);
  const facadeStub = {
    editorMode: () => 'edit' as const,
    addSkillFromPaletteItem,
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    addSkillFromPaletteItem.mockClear();
  });

  async function mount(
    palettes: PaletteItem[] | undefined,
  ): Promise<ComponentFixture<NestedSkillsLibraryComponent>> {
    await TestBed.configureTestingModule({
      imports: [NestedSkillsLibraryComponent],
      providers: [{ provide: WorkflowFacade, useValue: facadeStub }],
    }).compileComponents();
    const fixture = TestBed.createComponent(NestedSkillsLibraryComponent);
    fixture.componentRef.setInput('agentNodeId', 'agent-1');
    fixture.componentRef.setInput('palettes', palettes);
    fixture.detectChanges();
    return fixture;
  }

  it('omit palettes shows an empty list', async () => {
    const fixture = await mount(undefined);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.card')).toHaveLength(0);
  });

  it('empty palettes shows an empty list', async () => {
    const fixture = await mount([]);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.card')).toHaveLength(0);
  });

  it('lists sanitized palettes and Add calls facade', async () => {
    const fixture = await mount([policy]);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Policy Check');
    const add = el.querySelector('[data-testid="nested-skill-add-policy"]') as HTMLButtonElement;
    add.click();
    expect(addSkillFromPaletteItem).toHaveBeenCalledWith('agent-1', {
      key: 'policy',
      label: 'Policy Check',
      description: 'Validate policy rules',
      taskId: undefined,
    });
  });

  it('search filters on label', async () => {
    const other: PaletteItem = {
      key: 'notify',
      type: 'AIAgent',
      label: 'Notify Desk',
      description: 'Send a note',
      categoryId: 'flow',
    };
    const fixture = await mount([policy, other]);
    fixture.componentInstance.query.set('policy');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Policy Check');
    expect(el.textContent).not.toContain('Notify Desk');
  });
});
