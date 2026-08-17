import { Component, inject } from '@angular/core';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { CanvasViewportComponent } from './canvas-viewport.component';

@Component({
  selector: 'wb-canvas-host',
  standalone: true,
  imports: [CanvasViewportComponent],
  template: `
    <section class="canvas-host" aria-label="Workflow canvas" data-testid="workflow-canvas">
      @if (facade.canvasError(); as err) {
        <div class="canvas-error" role="status">{{ err }}</div>
      }
      @if (facade.canvasStatus(); as status) {
        <div class="canvas-status" role="status">{{ status }}</div>
      }
      <wb-canvas-viewport />
    </section>
  `,
  styles: `
    .canvas-host {
      position: relative;
      height: 100%;
      width: 100%;
      min-height: 0;
    }
    .canvas-error {
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 6;
      max-width: min(480px, 90%);
      padding: 0.45rem 0.75rem;
      border-radius: 8px;
      background: color-mix(in srgb, var(--wb-danger) 18%, var(--wb-bg-elevated));
      border: 1px solid var(--wb-danger);
      color: var(--wb-danger);
      font-size: 0.8rem;
      pointer-events: none;
    }
    .canvas-status {
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 5;
      max-width: min(480px, 90%);
      padding: 0.45rem 0.75rem;
      border-radius: 8px;
      background: color-mix(in srgb, var(--wb-accent) 14%, var(--wb-bg-elevated));
      border: 1px solid var(--wb-border);
      color: var(--wb-text);
      font-size: 0.8rem;
      pointer-events: none;
    }
    .canvas-error + .canvas-status {
      top: 48px;
    }
  `,
})
export class CanvasHostComponent {
  readonly facade = inject(WorkflowFacade);
}
