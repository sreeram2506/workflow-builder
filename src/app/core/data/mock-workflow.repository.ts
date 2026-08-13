import { Injectable } from '@angular/core';
import type { WorkflowDocument } from '../domain/workflow.models';

export const SAMPLE_WORKFLOW: WorkflowDocument = {
  id: 'wf-sample-001',
  name: 'Sample Automation',
  status: 'draft',
  version: 1,
  updatedAt: '2026-08-07T10:00:00.000Z',
  viewport: { x: 0, y: 0, scale: 1 },
  nodes: [
    {
      id: 'n-trigger',
      type: 'Trigger',
      label: 'Webhook Trigger',
      subtitle: 'Start on HTTP event',
      position: { x: 80, y: 120 },
      status: 'idle',
      data: {},
    },
    {
      id: 'n-action',
      type: 'Action',
      label: 'Enrich Payload',
      subtitle: 'Normalize fields',
      position: { x: 320, y: 120 },
      status: 'idle',
      data: {},
    },
    {
      id: 'n-condition',
      type: 'Condition',
      label: 'Needs Delay?',
      subtitle: 'Branch on rule',
      position: { x: 560, y: 90 },
      status: 'idle',
      data: {},
    },
    {
      id: 'n-router',
      type: 'Decision',
      label: 'Router',
      subtitle: 'Route the workflow',
      position: { x: 780, y: 240 },
      status: 'idle',
      data: {},
    },
    {
      id: 'n-repeater',
      type: 'Repeater',
      label: 'Repeater',
      subtitle: 'Repeat a section',
      position: { x: 560, y: 300 },
      status: 'idle',
      data: {},
    },
    {
      id: 'n-delay',
      type: 'Delay',
      label: 'Wait 5m',
      subtitle: 'Timer',
      position: { x: 980, y: 40 },
      status: 'idle',
      data: {},
    },
    {
      id: 'n-end',
      type: 'End',
      label: 'Complete',
      subtitle: 'Terminal',
      position: { x: 980, y: 220 },
      status: 'idle',
      data: {},
    },
  ],
  edges: [
    { id: 'e1', source: 'n-trigger', target: 'n-action', label: '', waypoints: [] },
    { id: 'e2', source: 'n-action', target: 'n-condition', label: '', waypoints: [] },
    { id: 'e3', source: 'n-condition', target: 'n-delay', label: '', waypoints: [] },
    { id: 'e4', source: 'n-condition', target: 'n-end', label: '', waypoints: [] },
    { id: 'e5', source: 'n-condition', target: 'n-router', label: '', waypoints: [] },
    { id: 'e6', source: 'n-router', target: 'n-repeater', label: '', waypoints: [] },
  ],
};

@Injectable({ providedIn: 'root' })
export class MockWorkflowRepository {
  getSampleWorkflow(): WorkflowDocument {
    return structuredClone(SAMPLE_WORKFLOW);
  }
}
