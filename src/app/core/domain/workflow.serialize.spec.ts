import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { SAMPLE_WORKFLOW } from '../data/mock-workflow.repository';
import {
  WORKFLOW_SCHEMA_VERSION,
  allowlistSerialized,
  parseWorkflowJson,
  serializeWorkflow,
  toDownloadFilename,
} from './workflow.serialize';
import type { WorkflowDocument, WorkflowNode } from './workflow.models';

describe('workflow.serialize', () => {
  it('round-trips sample workflow', () => {
    const json = serializeWorkflow(SAMPLE_WORKFLOW);
    const parsed = parseWorkflowJson(json);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.document.nodes.length).toBe(SAMPLE_WORKFLOW.nodes.length);
      expect(parsed.document.edges.length).toBe(SAMPLE_WORKFLOW.edges.length);
      expect(parsed.document.name).toBe(SAMPLE_WORKFLOW.name);
    }
  });

  it('rejects invalid JSON and wrong schema', () => {
    expect(parseWorkflowJson('{').ok).toBe(false);
    expect(parseWorkflowJson(JSON.stringify({ schemaVersion: 99 })).ok).toBe(false);
  });

  it('allowlist strips unknown top-level keys', () => {
    const raw = allowlistSerialized({
      schemaVersion: 1,
      id: 'x',
      name: 'n',
      status: 'draft',
      version: 1,
      updatedAt: 't',
      viewport: { x: 0, y: 0, scale: 1 },
      nodes: [],
      edges: [],
      evil: '<script>',
    });
    expect(raw).not.toBeNull();
    expect(raw!['evil']).toBeUndefined();
    expect(raw!['schemaVersion']).toBe(1);
  });

  it('toDownloadFilename sanitizes name', () => {
    expect(toDownloadFilename('Sample Automation', new Date('2026-08-12T00:00:00Z'))).toBe(
      'sample-automation-2026-08-12.json',
    );
  });

  it('PBT: serialize ↔ deserialize round-trip', () => {
    const nodeArb = fc.record({
      id: fc.stringMatching(/^n[a-z0-9]{2,6}$/),
      type: fc.constantFrom(
        'Trigger',
        'Action',
        'Condition',
        'Delay',
        'End',
        'Decision',
        'Notification',
        'AIAgent',
      ),
      label: fc.string({ minLength: 0, maxLength: 24 }),
      subtitle: fc.string({ minLength: 0, maxLength: 24 }),
      x: fc.integer({ min: -200, max: 800 }),
      y: fc.integer({ min: -200, max: 800 }),
    });

    fc.assert(
      fc.property(fc.array(nodeArb, { minLength: 1, maxLength: 6 }), (rawNodes) => {
        const seen = new Set<string>();
        const nodes: WorkflowNode[] = [];
        for (const r of rawNodes) {
          if (seen.has(r.id)) {
            continue;
          }
          seen.add(r.id);
          nodes.push({
            id: r.id,
            type: r.type as WorkflowNode['type'],
            label: r.label,
            subtitle: r.subtitle,
            position: { x: r.x, y: r.y },
            status: 'idle',
            data: {},
          });
        }
        if (nodes.length === 0) {
          return;
        }
        const edges =
          nodes.length >= 2
            ? [
                {
                  id: 'e0',
                  source: nodes[0]!.id,
                  target: nodes[1]!.id,
                  label: '',
                  waypoints: [] as { x: number; y: number }[],
                },
              ]
            : [];
        const doc: WorkflowDocument = {
          id: 'wf-pbt',
          name: 'PBT',
          status: 'draft',
          version: 1,
          updatedAt: '2026-08-12T00:00:00.000Z',
          viewport: { x: 0, y: 0, scale: 1 },
          nodes,
          edges,
        };
        const parsed = parseWorkflowJson(serializeWorkflow(doc));
        expect(parsed.ok).toBe(true);
        if (parsed.ok) {
          expect(parsed.document.nodes.length).toBe(doc.nodes.length);
          expect(parsed.document.edges.length).toBe(doc.edges.length);
          expect(WORKFLOW_SCHEMA_VERSION).toBe(1);
        }
      }),
    );
  });
});
