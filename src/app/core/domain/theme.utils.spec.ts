import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { nextTheme } from './theme.utils';
import { isAllowedNodeType } from './theme.utils';
import { ALLOWED_NODE_TYPES } from './workflow.models';
import { SAMPLE_WORKFLOW } from '../data/mock-workflow.repository';

describe('theme.utils PBT', () => {
  it('double toggle returns original theme', () => {
    fc.assert(
      fc.property(fc.constantFrom('dark' as const, 'light' as const), (theme) => {
        expect(nextTheme(nextTheme(theme))).toBe(theme);
      }),
    );
  });
});

describe('seed node types invariant', () => {
  it('every seed node type is in the allowed catalog', () => {
    fc.assert(
      fc.property(fc.constantFrom(...SAMPLE_WORKFLOW.nodes), (node) => {
        expect(isAllowedNodeType(node.type)).toBe(true);
        expect(ALLOWED_NODE_TYPES).toContain(node.type);
      }),
    );
  });
});
