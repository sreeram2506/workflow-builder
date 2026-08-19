import { Routes } from '@angular/router';
import { ShellLayoutComponent } from './features/shell/shell-layout.component';
import { AgentSkillsShellComponent } from './features/agent/agent-skills-shell.component';
import { TryUiHostComponent } from './try/try-ui-host.component';

export const routes: Routes = [
  { path: '', component: ShellLayoutComponent },
  { path: 'agent/:nodeId', component: AgentSkillsShellComponent },
  { path: 'try-ui', component: TryUiHostComponent }, // this is for testing
  { path: '**', redirectTo: '' },
];
