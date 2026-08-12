import { Injectable, inject } from '@angular/core';
import {
  parseWorkflowJson,
  serializeWorkflow,
  toDownloadFilename,
  type ParseWorkflowResult,
} from '../domain/workflow.serialize';
import type { WorkflowDocument } from '../domain/workflow.models';
import { UiStore } from '../stores/ui.store';

@Injectable({ providedIn: 'root' })
export class SerializationService {
  private readonly ui = inject(UiStore);

  serialize(doc: WorkflowDocument): string {
    return serializeWorkflow(doc);
  }

  parse(text: string): ParseWorkflowResult {
    return parseWorkflowJson(text);
  }

  download(doc: WorkflowDocument, statusMessage = 'Saved'): void {
    const json = serializeWorkflow(doc);
    const filename = toDownloadFilename(doc.name);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    this.ui.setCanvasStatus(statusMessage);
  }
}
