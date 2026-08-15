import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  MAX_AGENT_TABS,
  closeAgentTab,
  openAgentTab,
  pruneMissingNodeIds,
} from './agent-tabs';

describe('agent-tabs', () => {
  it('opens a new tab and focuses it', () => {
    const r = openAgentTab([], 'a', 100);
    expect(r.tabs).toEqual([{ nodeId: 'a', openedAt: 100 }]);
    expect(r.focusedNodeId).toBe('a');
  });

  it('focuses existing tab without duplicating or changing openedAt', () => {
    const r = openAgentTab([{ nodeId: 'a', openedAt: 50 }], 'a', 999);
    expect(r.tabs).toEqual([{ nodeId: 'a', openedAt: 50 }]);
    expect(r.focusedNodeId).toBe('a');
  });

  it('FIFO-evicts oldest when opening beyond max', () => {
    let tabs = openAgentTab([], 't1', 1).tabs;
    for (let i = 2; i <= MAX_AGENT_TABS; i++) {
      tabs = openAgentTab(tabs, `t${i}`, i).tabs;
    }
    expect(tabs).toHaveLength(MAX_AGENT_TABS);
    const r = openAgentTab(tabs, 't6', 100);
    expect(r.tabs.map((t) => t.nodeId)).toEqual(['t2', 't3', 't4', 't5', 't6']);
    expect(r.focusedNodeId).toBe('t6');
  });

  it('close removes tab and focuses newest remaining', () => {
    const tabs = [
      { nodeId: 'a', openedAt: 1 },
      { nodeId: 'b', openedAt: 2 },
      { nodeId: 'c', openedAt: 3 },
    ];
    const r = closeAgentTab(tabs, 'b', 'b');
    expect(r.tabs.map((t) => t.nodeId)).toEqual(['a', 'c']);
    expect(r.focusedNodeId).toBe('c');
  });

  it('pruneMissingNodeIds drops deleted nodes', () => {
    const tabs = [
      { nodeId: 'a', openedAt: 1 },
      { nodeId: 'b', openedAt: 2 },
    ];
    const r = pruneMissingNodeIds(tabs, 'a', new Set(['b']));
    expect(r.tabs.map((t) => t.nodeId)).toEqual(['b']);
    expect(r.focusedNodeId).toBe('b');
  });
});

describe('agent-tabs PBT', () => {
  it('open is idempotent for the same nodeId', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.integer({ min: 1, max: 1e6 }), (id, t) => {
        const once = openAgentTab([], id, t);
        const twice = openAgentTab(once.tabs, id, t + 100);
        expect(twice.tabs).toHaveLength(1);
        expect(twice.tabs[0]!.openedAt).toBe(t);
        expect(twice.focusedNodeId).toBe(id);
      }),
      { numRuns: 30 },
    );
  });

  it('never exceeds MAX_AGENT_TABS', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 4 }), { minLength: 0, maxLength: 20 }),
        (ids) => {
          let tabs: { nodeId: string; openedAt: number }[] = [];
          let t = 0;
          for (const id of ids) {
            t += 1;
            tabs = openAgentTab(tabs, id, t).tabs;
            expect(tabs.length).toBeLessThanOrEqual(MAX_AGENT_TABS);
          }
        },
      ),
      { numRuns: 40 },
    );
  });
});
