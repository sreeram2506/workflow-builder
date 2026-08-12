import { Injectable } from '@angular/core';

/**
 * Coalesces high-frequency callbacks onto a single requestAnimationFrame flush.
 */
@Injectable({ providedIn: 'root' })
export class CanvasPerformanceScheduler {
  private pending: (() => void) | null = null;
  private rafId: number | null = null;

  schedule(fn: () => void): void {
    this.pending = fn;
    if (this.rafId != null) {
      return;
    }
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      const job = this.pending;
      this.pending = null;
      job?.();
    });
  }

  cancel(): void {
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pending = null;
  }
}
