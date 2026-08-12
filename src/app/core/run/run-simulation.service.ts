import { Injectable, inject } from '@angular/core';
import { Subject, Subscription, concatMap, delay, finalize, from, of, takeUntil, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { computeRunOrder } from '../domain/run-order';
import type { NodeStatus } from '../domain/workflow.models';
import { GraphStore } from '../stores/graph.store';
import { UiStore } from '../stores/ui.store';

const REDUCED_MOTION_DELAY_MS = 50;

@Injectable({ providedIn: 'root' })
export class RunSimulationService {
  private readonly graph = inject(GraphStore);
  private readonly ui = inject(UiStore);
  private readonly stop$ = new Subject<void>();
  private sub: Subscription | null = null;
  private stopped = false;

  /** Resolve step delay once per Run (reduced-motion wins over env). */
  resolveStepDelayMs(
    prefersReducedMotion = typeof matchMedia === 'function'
      ? matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  ): number {
    if (prefersReducedMotion) {
      return REDUCED_MOTION_DELAY_MS;
    }
    const envDelay = environment.runStepDelayMs;
    return typeof envDelay === 'number' && Number.isFinite(envDelay) && envDelay >= 0
      ? envDelay
      : 400;
  }

  stop(): void {
    this.stopped = true;
    this.stop$.next();
    this.sub?.unsubscribe();
    this.sub = null;
    this.ui.setRunActive(false);
  }

  /**
   * Start simulation. Returns false if already active or soft-aborted
   * (empty graph / no seeds).
   */
  start(): boolean {
    if (this.ui.runActive()) {
      return false;
    }
    const doc = this.graph.document();
    if (!doc || doc.nodes.length === 0) {
      this.ui.setCanvasStatus('Nothing to run');
      return false;
    }
    const order = computeRunOrder(doc);
    if (order.length === 0) {
      this.ui.setCanvasStatus('No start node');
      return false;
    }

    this.stopped = false;
    this.stop$.next();
    this.sub?.unsubscribe();

    const labels = new Map(doc.nodes.map((n) => [n.id, n.label] as const));
    const stepMs = this.resolveStepDelayMs();

    const idleAll: Record<string, NodeStatus> = {};
    for (const n of doc.nodes) {
      idleAll[n.id] = 'idle';
    }
    this.graph.patchNodeStatuses(idleAll, { skipHistory: true, skipAutosave: true });

    this.ui.setCanvasStatus(null);
    this.ui.setCanvasError(null);
    this.ui.setRunActive(true);
    this.ui.setRunAnnouncement(null);

    this.sub = from(order)
      .pipe(
        concatMap((id) =>
          of(id).pipe(
            tap(() => {
              this.graph.patchNodeStatuses({ [id]: 'running' }, { skipHistory: true, skipAutosave: true });
              const label = labels.get(id) ?? id;
              this.ui.setRunAnnouncement(`Running ${label}…`);
            }),
            delay(stepMs),
            tap(() => {
              this.graph.patchNodeStatuses({ [id]: 'success' }, { skipHistory: true, skipAutosave: true });
            }),
          ),
        ),
        takeUntil(this.stop$),
        finalize(() => {
          this.ui.setRunActive(false);
          this.sub = null;
          if (!this.stopped) {
            this.ui.setRunAnnouncement('Run complete');
          }
        }),
      )
      .subscribe({
        error: (err: unknown) => {
          this.ui.setCanvasError(err instanceof Error ? err.message : 'Run failed');
          this.ui.setRunActive(false);
          this.ui.setRunAnnouncement(null);
        },
      });

    return true;
  }
}
