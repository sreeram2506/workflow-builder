import { InjectionToken } from '@angular/core';
import type { PropertiesDefaultsConfig } from '../domain/host-properties.library';

/** Global per-type library property enable map (`provideWorkflowBuilderUi({ propertiesDefaults })`). */
export const WORKFLOW_BUILDER_PROPERTIES_DEFAULTS =
  new InjectionToken<PropertiesDefaultsConfig>('WORKFLOW_BUILDER_PROPERTIES_DEFAULTS');
