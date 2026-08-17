import { isDevMode } from '@angular/core';
import { buildPathIndex } from './merge-ui-features';
import type { EffectiveUiReader } from './ui-effective.token';
import type { UiFeaturePath, UiFeatures } from './ui-features.types';

/**
 * Build an EffectiveUiReader over a features getter (e.g. shell computed).
 * Fail-open for unknown paths — same as UiConfigService.is.
 */
export function createEffectiveUiReader(getFeatures: () => UiFeatures): EffectiveUiReader {
  return {
    features: getFeatures,
    is(path: string): boolean {
      const index = buildPathIndex(getFeatures());
      const value = index.get(path as UiFeaturePath);
      if (value === undefined) {
        if (isDevMode()) {
          console.warn(`[EffectiveUi] Unknown feature path "${path}"; defaulting to true`);
        }
        return true;
      }
      return value;
    },
  };
}
