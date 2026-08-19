import { InjectionToken } from '@angular/core';
import type { WorkflowDocument } from '../domain/workflow.models';

export interface WorkflowBuilderPersistAdapter {
  save?: (doc: WorkflowDocument) => void | Promise<void>;
  run?: (doc: WorkflowDocument) => void | Promise<void>;
}

export const WORKFLOW_BUILDER_PERSIST = new InjectionToken<WorkflowBuilderPersistAdapter>(
  'WORKFLOW_BUILDER_PERSIST',
);
