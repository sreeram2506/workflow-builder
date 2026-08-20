import { makeEnvironmentProviders, type EnvironmentProviders, type Provider } from '@angular/core';
import type { UiFeaturesPartial } from './ui-features.types';
import { WORKFLOW_BUILDER_UI_FEATURES } from './ui-config.token';
import {
  WORKFLOW_BUILDER_CATALOG_AGENT,
  WORKFLOW_BUILDER_CATALOG_SOLUTION,
  type WorkflowBuilderCatalogAdapter,
} from './catalog-adapter';
import {
  WORKFLOW_BUILDER_PROPERTIES,
  type WorkflowBuilderPropertiesAdapter,
} from './properties-adapter';
import { WORKFLOW_BUILDER_PROPERTIES_DEFAULTS } from './properties-defaults.token';
import type { PropertiesDefaultsConfig } from '../domain/host-properties.library';
import {
  WORKFLOW_BUILDER_PERSIST,
  type WorkflowBuilderPersistAdapter,
} from './persist-adapter';

export interface ProvideWorkflowBuilderUiOptions {
  features?: UiFeaturesPartial;
  catalog?: {
    solution?: WorkflowBuilderCatalogAdapter;
    agent?: WorkflowBuilderCatalogAdapter;
  };
  properties?: WorkflowBuilderPropertiesAdapter;
  /** Per node-type enable map for package library defaults (omit/`true` = on). */
  propertiesDefaults?: PropertiesDefaultsConfig;
  persist?: WorkflowBuilderPersistAdapter;
}

/** Host override layer — wins over JSON/defaults (FR-UI-02). Catalog tokens are provider-only. */
export function provideWorkflowBuilderUi(
  options: ProvideWorkflowBuilderUiOptions = {},
): EnvironmentProviders {
  const providers: Provider[] = [
    {
      provide: WORKFLOW_BUILDER_UI_FEATURES,
      useValue: options.features ?? {},
    },
  ];
  if (options.catalog?.solution) {
    providers.push({
      provide: WORKFLOW_BUILDER_CATALOG_SOLUTION,
      useValue: options.catalog.solution,
    });
  }
  if (options.catalog?.agent) {
    providers.push({
      provide: WORKFLOW_BUILDER_CATALOG_AGENT,
      useValue: options.catalog.agent,
    });
  }
  if (options.properties) {
    providers.push({
      provide: WORKFLOW_BUILDER_PROPERTIES,
      useValue: options.properties,
    });
  }
  if (options.propertiesDefaults) {
    providers.push({
      provide: WORKFLOW_BUILDER_PROPERTIES_DEFAULTS,
      useValue: options.propertiesDefaults,
    });
  }
  if (options.persist !== undefined) {
    providers.push({
      provide: WORKFLOW_BUILDER_PERSIST,
      useValue: options.persist,
    });
  }
  return makeEnvironmentProviders(providers);
}
