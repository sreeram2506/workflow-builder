import { InjectionToken } from '@angular/core';
import type { UiFeaturePath, UiFeatures } from './ui-features.types';

/** Shell-scoped effective chrome flags (global ⊕ `[ui]`). */
export interface EffectiveUiReader {
  features(): UiFeatures;
  is(path: UiFeaturePath): boolean;
  is(path: string): boolean;
}

export const UI_EFFECTIVE_FEATURES = new InjectionToken<EffectiveUiReader>('UI_EFFECTIVE_FEATURES');
