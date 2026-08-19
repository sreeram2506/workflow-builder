/*
 * Public API of enso-workflow-builder.
 * Does not export the SPA App or src/app/try/.
 * `./lib` is a git symlink to ../../../src/app (single source tree).
 */

export { ShellLayoutComponent } from './lib/features/shell/shell-layout.component';
export { AgentSkillsShellComponent } from './lib/features/agent/agent-skills-shell.component';
export { WorkflowFacade } from './lib/core/facade/workflow.facade';
export type { WorkflowDocument } from './lib/core/domain/workflow.models';
export type { PaletteItem } from './lib/core/domain/palette.catalog';
export type { DefaultAgentCard, UiFeaturesPartial } from './lib/core/ui-config/ui-features.types';
export {
  provideWorkflowBuilderUi,
  type ProvideWorkflowBuilderUiOptions,
} from './lib/core/ui-config/provide-workflow-builder-ui';
export {
  WORKFLOW_BUILDER_PERSIST,
  type WorkflowBuilderPersistAdapter,
} from './lib/core/ui-config/persist-adapter';
export {
  WORKFLOW_BUILDER_CATALOG_AGENT,
  WORKFLOW_BUILDER_CATALOG_SOLUTION,
  type CatalogAdapterResult,
  type CatalogLoadMode,
  type CatalogLoadOptions,
  type WorkflowBuilderCatalogAdapter,
} from './lib/core/ui-config/catalog-adapter';
export {
  WORKFLOW_BUILDER_PROPERTIES,
  type WorkflowBuilderPropertiesAdapter,
} from './lib/core/ui-config/properties-adapter';
export { uiConfigAppInitializer } from './lib/core/ui-config/ui-config.initializer';
export { UiConfigService } from './lib/core/ui-config/ui-config.service';
