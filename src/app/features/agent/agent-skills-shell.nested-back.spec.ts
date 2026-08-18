import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EnsoTaskCatalogService } from '../../core/data/enso-task-catalog.service';
import {
  BLANK_AGENT_TYPE,
  FEATURED_PALETTE_TYPES,
  PALETTE_ITEMS,
} from '../../core/domain/palette.catalog';
import type { NodeType } from '../../core/domain/workflow.models';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { AgentSkillsShellComponent } from './agent-skills-shell.component';

function catalogStub() {
  const staticItems = PALETTE_ITEMS.filter(
    (i) =>
      (FEATURED_PALETTE_TYPES as readonly NodeType[]).includes(i.type) ||
      i.type === BLANK_AGENT_TYPE,
  ).map((i) => (i.type === 'AIAgent' ? { ...i, origin: 'default-agent' as const } : i));
  return {
    provide: EnsoTaskCatalogService,
    useValue: {
      loadCatalog: () =>
        of({
          categories: [],
          items: [...staticItems],
          source: 'static' as const,
          error: null,
          emptyRemote: false,
        }),
    },
  };
}

describe('AgentSkillsShell nested Back', () => {
  let fixture: ComponentFixture<AgentSkillsShellComponent>;
  let facade: WorkflowFacade;
  let agentId: string;
  const paramMap$ = new BehaviorSubject(convertToParamMap({ nodeId: '' }));

  beforeEach(async () => {
    paramMap$.next(convertToParamMap({ nodeId: '' }));
    await TestBed.configureTestingModule({
      imports: [AgentSkillsShellComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        catalogStub(),
        { provide: ActivatedRoute, useValue: { paramMap: paramMap$.asObservable() } },
      ],
    }).compileComponents();

    facade = TestBed.inject(WorkflowFacade);
    facade.initialize();
    agentId = facade.createNode('AIAgent', { x: 0, y: 0 })!;
    paramMap$.next(convertToParamMap({ nodeId: agentId }));
  });

  it('shows nested Back when the tab strip is off and click returns to solution', () => {
    fixture = TestBed.createComponent(AgentSkillsShellComponent);
    fixture.componentRef.setInput('ui', { agentTabs: { enabled: false } });
    fixture.detectChanges();

    const back = fixture.nativeElement.querySelector(
      '[data-testid="nested-back-to-solution"]',
    ) as HTMLButtonElement | null;
    expect(back).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-testid="agent-tabs-strip"]')).toBeNull();
    expect(facade.agentTabs()).toHaveLength(0);

    const spy = vi.spyOn(facade, 'navigateBackToSolution');
    back?.click();
    expect(spy).toHaveBeenCalled();
  });

  it('does not show nested Back when the tab strip is on', () => {
    fixture = TestBed.createComponent(AgentSkillsShellComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="nested-back-to-solution"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="agent-tabs-strip"]')).toBeTruthy();
  });
});
