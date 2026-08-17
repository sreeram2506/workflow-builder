import { makeEnvironmentProviders, type EnvironmentProviders, type Provider } from '@angular/core';
import type { UiFeaturesPartial } from './ui-features.types';
import { WORKFLOW_BUILDER_UI_FEATURES } from './ui-config.token';
import {
  WORKFLOW_BUILDER_CATALOG_AGENT,
  WORKFLOW_BUILDER_CATALOG_SOLUTION,
  type WorkflowBuilderCatalogAdapter,
} from './catalog-adapter';

export interface ProvideWorkflowBuilderUiOptions {
  features?: UiFeaturesPartial;
  catalog?: {
    solution?: WorkflowBuilderCatalogAdapter;
    agent?: WorkflowBuilderCatalogAdapter;
  };
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
  return makeEnvironmentProviders(providers);
}
