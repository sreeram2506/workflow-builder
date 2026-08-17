import { inject } from '@angular/core';
import { UiConfigService } from './ui-config.service';
import { UI_EFFECTIVE_FEATURES, type EffectiveUiReader } from './ui-effective.token';

/** Prefer shell-provided effective reader; fall back to global UiConfigService. */
export function injectEffectiveUi(): EffectiveUiReader {
  return inject(UI_EFFECTIVE_FEATURES, { optional: true }) ?? inject(UiConfigService);
}
