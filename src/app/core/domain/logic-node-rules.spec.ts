import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  isRouterRepeaterLabelUnique,
  nextConditionOutLabel,
  readRepeaterData,
  repeaterAfterWorkflowChange,
} from './logic-node-rules';
import { configurationFieldsFor } from './properties.schema';
import type { WorkflowNode } from './workflow.models';

function node(
  id: string,
  type: WorkflowNode['type'],
  label: string,
): WorkflowNode {
  return {
    id,
    type,
    label,
    subtitle: '',
    position: { x: 0, y: 0 },
    status: 'idle',
    data: {},
  };
}

describe('nextConditionOutLabel', () => {
  it('assigns true then false then rejects', () => {
    expect(nextConditionOutLabel([])).toBe('true');
    expect(nextConditionOutLabel(['true'])).toBe('false');
    expect(nextConditionOutLabel(['false'])).toBe('true');
    expect(nextConditionOutLabel(['true', 'false'])).toBeNull();
    expect(nextConditionOutLabel([' false ', 'true'])).toBeNull();
  });

  it('PBT: fills missing true/false then null (Partial)', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom('true', 'false', 'true ', ' false', '', 'other'), {
          minLength: 0,
          maxLength: 6,
        }),
        (labels) => {
          const next = nextConditionOutLabel(labels);
          const trimmed = labels.map((label) => label.trim());
          if (!trimmed.includes('true')) {
            expect(next).toBe('true');
          } else if (!trimmed.includes('false')) {
            expect(next).toBe('false');
          } else {
            expect(next).toBeNull();
          }
        },
      ),
      { numRuns: 40 },
    );
  });
});

describe('isRouterRepeaterLabelUnique', () => {
  const nodes = [
    node('r1', 'Decision', 'Alpha'),
    node('r2', 'Repeater', 'Beta'),
    node('c1', 'Condition', 'Alpha'),
    node('a1', 'Action', 'Alpha'),
  ];

  it('is unique vs other Router and Repeater labels only (trim, case-sensitive)', () => {
    expect(isRouterRepeaterLabelUnique('Alpha', nodes, 'r1')).toBe(true);
    expect(isRouterRepeaterLabelUnique('Alpha', nodes, 'r2')).toBe(false);
    expect(isRouterRepeaterLabelUnique(' Alpha ', nodes, 'new')).toBe(false);
    expect(isRouterRepeaterLabelUnique('alpha', nodes, 'new')).toBe(true);
    expect(isRouterRepeaterLabelUnique('Beta', nodes, 'r2')).toBe(true);
    expect(isRouterRepeaterLabelUnique('Gamma', nodes, 'new')).toBe(true);
  });

  it('PBT: collision iff another Decision/Repeater has the trimmed label', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 12 }), (raw) => {
        const label = `x${raw}`;
        const roster = [node('keep', 'Decision', label), node('other', 'Action', label)];
        expect(isRouterRepeaterLabelUnique(label, roster, 'keep')).toBe(true);
        expect(isRouterRepeaterLabelUnique(` ${label} `, roster, 'exclude')).toBe(false);
      }),
      { numRuns: 30 },
    );
  });
});

describe('repeaterAfterWorkflowChange', () => {
  it('clears versionId and keeps pause', () => {
    expect(
      repeaterAfterWorkflowChange(
        { workflowId: 'a', versionId: 'v1', is_paused: true },
        'b',
      ),
    ).toEqual({ workflowId: 'b', versionId: '', is_paused: true });
  });
});

describe('readRepeaterData', () => {
  it('defaults missing repeater object', () => {
    expect(readRepeaterData({})).toEqual({
      workflowId: '',
      versionId: '',
      is_paused: false,
    });
  });
});

describe('repeater Properties catalog', () => {
  it('has no dummy workflow options', () => {
    expect(configurationFieldsFor('Repeater').find((f) => f.config_path === 'repeater.workflowId')?.options).toEqual(
      [],
    );
  });
});
