import { DestroyRef, Injectable, inject, isDevMode, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  buildPathIndex,
  createDefaultUiFeatures,
  normalizePartial,
  resolveUiFeatures,
} from './merge-ui-features';
import type {
  UiConfigLoadStatus,
  UiFeaturePath,
  UiFeatures,
  UiFeaturesPartial,
} from './ui-features.types';
import { UI_CONFIG_JSON_URL } from './ui-features.types';
import { WORKFLOW_BUILDER_UI_FEATURES } from './ui-config.token';

@Injectable({ providedIn: 'root' })
export class UiConfigService {
  private readonly hostPartial = inject(WORKFLOW_BUILDER_UI_FEATURES, { optional: true }) ?? {};
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  private readonly featuresSignal = signal<UiFeatures>(createDefaultUiFeatures());
  private readonly loadStatusSignal = signal<UiConfigLoadStatus>({
    kind: 'ok',
    message: null,
  });
  private pathIndex = buildPathIndex(this.featuresSignal());
  private inFlight = false;
  private focusReloadEnabled = false;
  private focusReloadQueued = false;

  readonly features = this.featuresSignal.asReadonly();
  readonly loadStatus = this.loadStatusSignal.asReadonly();

  /** Apply JSON layer + host provider (provider wins). */
  applyLayers(jsonPartial: UiFeaturesPartial, status: UiConfigLoadStatus): void {
    const resolved = resolveUiFeatures(jsonPartial, this.hostPartial);
    this.featuresSignal.set(resolved);
    this.pathIndex = buildPathIndex(resolved);
    this.loadStatusSignal.set(status);
  }

  /**
   * Load `/assets/wb-ui-config.json` and apply layers.
   * On refetch failure, keep the previously resolved features (no flash to defaults).
   */
  async loadFromJson(options?: { cacheBust?: boolean; log?: boolean }): Promise<void> {
    const cacheBust = options?.cacheBust === true;
    const log = options?.log === true;
    if (this.inFlight) {
      return;
    }
    this.inFlight = true;

    let jsonPartial: UiFeaturesPartial = {};
    let status: UiConfigLoadStatus = { kind: 'ok', message: null };
    let apply = true;

    let body: unknown;
    try {
      body = cacheBust
        ? await firstValueFrom(
            this.http.get<unknown>(UI_CONFIG_JSON_URL, { params: { _: String(Date.now()) } }),
          )
        : await firstValueFrom(this.http.get<unknown>(UI_CONFIG_JSON_URL));
      if (body === null || typeof body !== 'object' || Array.isArray(body)) {
        status = {
          kind: 'invalid',
          message: 'UI config JSON root must be an object; using defaults.',
        };
        if (cacheBust) {
          apply = false;
        }
      } else {
        jsonPartial = normalizePartial(body);
      }
    } catch (err: unknown) {
      if (err instanceof HttpErrorResponse && err.status === 404) {
        status = {
          kind: 'missing',
          message: 'UI config JSON not found; using defaults.',
        };
      } else {
        status = {
          kind: 'invalid',
          message: 'UI config JSON could not be loaded or parsed; using defaults.',
        };
      }
      jsonPartial = {};
      if (cacheBust) {
        apply = false;
      }
    } finally {
      this.inFlight = false;
    }

    if (apply) {
      this.applyLayers(jsonPartial, status);
    }

    if (log && isDevMode()) {
      console.info(
        '[UiConfig]',
        `loadStatus=${this.loadStatus().kind}`,
        this.loadStatus().message ?? '',
        this.features(),
      );
    }
  }

  /** Re-fetch JSON when the window/tab becomes visible (edit file, click back). */
  enableFocusReload(): void {
    if (this.focusReloadEnabled || typeof window === 'undefined') {
      return;
    }
    this.focusReloadEnabled = true;
    const onMaybeReload = (): void => {
      if (this.focusReloadQueued) {
        return;
      }
      this.focusReloadQueued = true;
      queueMicrotask(() => {
        this.focusReloadQueued = false;
        void this.loadFromJson({ cacheBust: true });
      });
    };
    const onVisibility = (): void => {
      if (document.visibilityState === 'visible') {
        onMaybeReload();
      }
    };
    window.addEventListener('focus', onMaybeReload);
    document.addEventListener('visibilitychange', onVisibility);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('focus', onMaybeReload);
      document.removeEventListener('visibilitychange', onVisibility);
    });
  }

  is(path: UiFeaturePath): boolean;
  is(path: string): boolean;
  is(path: string): boolean {
    // Touch signal so template/effects re-evaluate after applyLayers
    this.featuresSignal();
    const value = this.pathIndex.get(path as UiFeaturePath);
    if (value === undefined) {
      if (isDevMode()) {
        console.warn(`[UiConfigService] Unknown feature path "${path}"; defaulting to true`);
      }
      return true;
    }
    return value;
  }
}
