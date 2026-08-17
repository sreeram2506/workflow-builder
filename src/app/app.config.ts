import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { uiConfigAppInitializer } from './core/ui-config';
// Optional host override (wins over JSON) — see docs/workflow-builder-ui-config-try.md
// import { provideWorkflowBuilderUi } from './core/ui-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    // provideWorkflowBuilderUi({ features: { agentsLibrary: { enabled: false } } }),
    provideAppInitializer(uiConfigAppInitializer),
  ],
};
