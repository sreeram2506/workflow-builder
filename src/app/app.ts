import { Component, OnInit, inject } from '@angular/core';
import { ShellLayoutComponent } from './features/shell/shell-layout.component';
import { WorkflowFacade } from './core/facade/workflow.facade';

@Component({
  selector: 'app-root',
  imports: [ShellLayoutComponent],
  template: `<wb-shell-layout />`,
  styles: `:host { display: block; height: 100%; }`,
})
export class App implements OnInit {
  private readonly facade = inject(WorkflowFacade);

  ngOnInit(): void {
    try {
      this.facade.initialize();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize workflow builder';
      this.facade.setBootstrapError(message);
    }
  }
}
