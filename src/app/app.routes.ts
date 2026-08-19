import { Routes } from '@angular/router';
import { ShellLayoutComponent } from './features/shell/shell-layout.component';
import { AgentSkillsShellComponent } from './features/agent/agent-skills-shell.component';

export const routes: Routes = [
  { path: '', component: ShellLayoutComponent },
  { path: 'agent/:nodeId', component: AgentSkillsShellComponent },
  { path: '**', redirectTo: '' },
];
