import { InjectionToken } from '@angular/core';
import type { HostPropertiesSchema } from '../domain/host-properties.schema';
import type { WorkflowNode } from '../domain/workflow.models';

export interface WorkflowBuilderPropertiesAdapter {
  schemaFor(node: WorkflowNode): HostPropertiesSchema | null;
}

export const WORKFLOW_BUILDER_PROPERTIES = new InjectionToken<WorkflowBuilderPropertiesAdapter>(
  'WORKFLOW_BUILDER_PROPERTIES',
);
