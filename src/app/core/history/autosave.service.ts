import { Injectable, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';
import { UiStore } from '../stores/ui.store';

@Injectable({ providedIn: 'root' })
export class AutoSaveService {
  private readonly ui = inject(UiStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mutations$ = new Subject<void>();

  readonly dirty = signal(false);
  readonly lastSavedAt = signal<string | null>(null);

  constructor() {
    this.mutations$.pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.dirty.set(false);
      this.lastSavedAt.set(new Date().toISOString());
    });
  }

  notifyMutation(): void {
    this.dirty.set(true);
    this.mutations$.next();
  }
}
