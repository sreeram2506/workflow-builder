import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { EnsoTaskCatalogService } from '../../core/data/enso-task-catalog.service';
import { MockWorkflowRepository } from '../../core/data/mock-workflow.repository';
import {
  BLANK_AGENT_TYPE,
  FEATURED_PALETTE_TYPES,
  PALETTE_ITEMS,
} from '../../core/domain/palette.catalog';
import type { NodeType, WorkflowDocument } from '../../core/domain/workflow.models';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { AgentSkillsShellComponent } from '../agent/agent-skills-shell.component';
import { ShellLayoutComponent } from './shell-layout.component';

describe('ShellLayout embed contract', () => {
  async function createShell(): Promise<{
    fixture: ComponentFixture<ShellLayoutComponent>;
    facade: WorkflowFacade;
  }> {
    const staticItems = PALETTE_ITEMS.filter(
      (i) =>
        (FEATURED_PALETTE_TYPES as readonly NodeType[]).includes(i.type) ||
        i.type === BLANK_AGENT_TYPE,
    ).map((i) => (i.type === 'AIAgent' ? { ...i, origin: 'default-agent' as const } : i));
    await TestBed.configureTestingModule({
      imports: [ShellLayoutComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
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
        },
      ],
    }).compileComponents();
    const facade = TestBed.inject(WorkflowFacade);
    facade.initialize();
    const fixture = TestBed.createComponent(ShellLayoutComponent);
    fixture.detectChanges();
    return { fixture, facade };
  }

  it('loads [document] onto the canvas and emits documentChange', async () => {
    const { fixture, facade } = await createShell();
    const sample = TestBed.inject(MockWorkflowRepository).getSampleWorkflow();
    const emitted: WorkflowDocument[] = [];
    fixture.componentInstance.documentChange.subscribe((d) => emitted.push(d));
    fixture.componentRef.setInput('document', sample);
    fixture.detectChanges();
    expect(facade.nodes().length).toBe(sample.nodes.length);
    expect(emitted.length).toBeGreaterThan(0);
    expect(emitted[0]?.id).toBe(sample.id);
  });

  it('keeps the previous graph when [document] is invalid', async () => {
    const { fixture, facade } = await createShell();
    const sample = TestBed.inject(MockWorkflowRepository).getSampleWorkflow();
    fixture.componentRef.setInput('document', sample);
    fixture.detectChanges();
    const before = facade.nodeCount();
    fixture.componentRef.setInput('document', { not: 'a-workflow' });
    fixture.detectChanges();
    expect(facade.nodeCount()).toBe(before);
    expect(facade.canvasError()).toBeTruthy();
  });

  it('Save output receives the document and skips saveDownload', async () => {
    const { fixture, facade } = await createShell();
    const saved: WorkflowDocument[] = [];
    fixture.componentInstance.save.subscribe((d) => saved.push(d));
    const spy = vi.spyOn(facade, 'saveDownload');
    fixture.nativeElement.querySelector('[aria-label="Save"]')?.click();
    await fixture.whenStable();
    expect(saved.length).toBe(1);
    expect(spy).not.toHaveBeenCalled();
  });

  it('Export remains wired when a Save output is bound', async () => {
    const { fixture, facade } = await createShell();
    fixture.componentInstance.save.subscribe(() => undefined);
    const spy = vi.spyOn(facade, 'exportDownload');
    fixture.nativeElement.querySelector('[aria-label="Export JSON"]')?.click();
    expect(spy).toHaveBeenCalled();
  });
});

describe('shell fill-host height', () => {
  function compiledStyles(cmp: { ɵcmp?: { styles?: string[] } }): string {
    return (cmp.ɵcmp?.styles ?? []).join('\n');
  }

  it('solution and nested shells use height 100%, not 100vh', () => {
    const shell = compiledStyles(ShellLayoutComponent as unknown as { ɵcmp?: { styles?: string[] } });
    const nested = compiledStyles(
      AgentSkillsShellComponent as unknown as { ɵcmp?: { styles?: string[] } },
    );
    expect(shell).not.toMatch(/100vh/);
    expect(nested).not.toMatch(/100vh/);
    expect(shell).toMatch(/height:\s*100%/);
    expect(nested).toMatch(/height:\s*100%/);
  });
});
