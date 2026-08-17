import { InjectionToken } from '@angular/core';
import type { UiFeaturesPartial } from './ui-features.types';

export const WORKFLOW_BUILDER_UI_FEATURES = new InjectionToken<UiFeaturesPartial>(
  'WORKFLOW_BUILDER_UI_FEATURES',
  {
    providedIn: 'root',
    factory: () => ({}),
  },
);
