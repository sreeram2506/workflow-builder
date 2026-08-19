import { reflectComponentType } from '@angular/core';
import {
  AgentSkillsShellComponent,
  ShellLayoutComponent,
  WorkflowFacade,
  provideWorkflowBuilderUi,
} from 'enso-workflow-builder';

describe('enso-workflow-builder public API', () => {
  it('exports shells, provider, and facade', () => {
    expect(ShellLayoutComponent).toBeDefined();
    expect(AgentSkillsShellComponent).toBeDefined();
    expect(typeof provideWorkflowBuilderUi).toBe('function');
    expect(WorkflowFacade).toBeDefined();
  });

  it('uses wb-shell-layout and wb-agent-skills-shell selectors', () => {
    expect(reflectComponentType(ShellLayoutComponent)?.selector).toBe('wb-shell-layout');
    expect(reflectComponentType(AgentSkillsShellComponent)?.selector).toBe('wb-agent-skills-shell');
  });
});
