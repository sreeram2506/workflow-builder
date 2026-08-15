import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  BLANK_AGENT_TYPE,
  FEATURED_PALETTE_TYPES,
  PALETTE_ITEMS,
  blankAgentPaletteItem,
  filterPaletteItems,
  findPaletteItem,
} from './palette.catalog';
import { createWorkflowNode, isValidCreatedNodeId } from './node.factory';
import { ALLOWED_NODE_TYPES } from './workflow.models';

describe('palette.catalog', () => {
  it('empty query returns all items', () => {
    expect(filterPaletteItems(PALETTE_ITEMS, '')).toHaveLength(PALETTE_ITEMS.length);
    expect(filterPaletteItems(PALETTE_ITEMS, '   ')).toHaveLength(PALETTE_ITEMS.length);
  });

  it('filters by label / type / description', () => {
    const hits = filterPaletteItems(PALETTE_ITEMS, 'notif');
    expect(hits.map((h) => h.type)).toEqual(['Notification']);
    expect(filterPaletteItems(PALETTE_ITEMS, 'branch').some((h) => h.type === 'Condition')).toBe(
      true,
    );
  });

  it('every catalog type is allowed', () => {
    for (const item of PALETTE_ITEMS) {
      expect(ALLOWED_NODE_TYPES).toContain(item.type);
      expect(findPaletteItem(item.type)?.label).toBe(item.label);
    }
  });

  it('includes Blank Agent and keeps it out of featured strip types', () => {
    expect(blankAgentPaletteItem()?.type).toBe(BLANK_AGENT_TYPE);
    expect(blankAgentPaletteItem()?.label).toBe('Blank Agent');
    expect(FEATURED_PALETTE_TYPES).not.toContain('AIAgent');
    expect(FEATURED_PALETTE_TYPES).toEqual(['Condition', 'Decision', 'Repeater']);
  });
});

describe('node.factory', () => {
  it('creates idle node with empty data and catalog label', () => {
    const node = createWorkflowNode('Action', { x: 10, y: 20 });
    expect(node).not.toBeNull();
    expect(node!.type).toBe('Action');
    expect(node!.label).toBe('Action');
    expect(node!.position).toEqual({ x: 10, y: 20 });
    expect(node!.status).toBe('idle');
    expect(node!.data).toEqual({});
    expect(isValidCreatedNodeId(node!.id, 'Action')).toBe(true);
  });

  it('rejects unknown types', () => {
    expect(createWorkflowNode('Nope' as never, { x: 0, y: 0 })).toBeNull();
  });
});

describe('node.factory PBT', () => {
  it('created type is always in catalog and id matches pattern', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALLOWED_NODE_TYPES),
        fc.record({ x: fc.integer({ min: -5000, max: 5000 }), y: fc.integer({ min: -5000, max: 5000 }) }),
        (type, position) => {
          const node = createWorkflowNode(type, position);
          expect(node).not.toBeNull();
          expect(ALLOWED_NODE_TYPES).toContain(node!.type);
          expect(isValidCreatedNodeId(node!.id, type)).toBe(true);
          expect(node!.position).toEqual(position);
          expect(node!.status).toBe('idle');
        },
      ),
      { numRuns: 40 },
    );
  });
});
