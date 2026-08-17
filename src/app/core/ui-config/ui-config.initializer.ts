import { inject, isDevMode } from '@angular/core';
import { UiConfigService } from './ui-config.service';

/**
 * APP_INITIALIZER entry. Must run in an injection context.
 * Injects before any await (BR-05, Q9=A).
 */
export function uiConfigAppInitializer(): Promise<void> {
  const uiConfig = inject(UiConfigService);

  return (async () => {
    await uiConfig.loadFromJson({ log: isDevMode() });
    uiConfig.enableFocusReload();
  })();
}
