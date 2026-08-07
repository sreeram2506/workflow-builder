import { Component, inject } from '@angular/core';
import { WorkflowFacade } from '../../core/facade/workflow.facade';

@Component({
  selector: 'wb-canvas-host',
  standalone: true,
  template: `
    <section class="canvas" aria-label="Workflow canvas placeholder">
      <p class="hint">Canvas engine in Phase 2</p>
      <p class="meta">
        Seed loaded: {{ facade.nodeCount() }} nodes · {{ facade.edgeCount() }} edges (store only)
      </p>
    </section>
  `,
  styles: `
    .canvas {
      position: relative;
      height: 100%;
      width: 100%;
      background-color: var(--wb-bg-canvas);
      background-image: radial-gradient(var(--wb-grid-dot) 1px, transparent 1px);
      background-size: 18px 18px;
      display: grid;
      place-content: center;
      text-align: center;
      gap: 0.35rem;
    }
    .hint {
      margin: 0;
      color: var(--wb-text-muted);
      font-size: 0.95rem;
    }
    .meta {
      margin: 0;
      color: var(--wb-text-muted);
      font-size: 0.8rem;
    }
  `,
})
export class CanvasHostComponent {
  readonly facade = inject(WorkflowFacade);
}
