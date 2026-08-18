import { describe, expect, it } from 'vitest';
import {
  isUnsafeFieldPath,
  logicBuiltinPropertiesSchema,
  sanitizeHostPropertiesSchema,
  visibleHostSections,
} from './host-properties.schema';

describe('host-properties.schema', () => {
  it('skips empty path, .., and unknown type; keeps valid rest', () => {
    const out = sanitizeHostPropertiesSchema({
      sections: [
        {
          title: 'Main',
          fields: [
            { type: 'text', path: 'timeout', label: 'Timeout' },
            { type: 'text', path: '', label: 'Empty' },
            { type: 'text', path: 'a..b', label: 'Dots' },
            { type: 'mystery', path: 'x', label: 'Bad type' },
            { type: 'number', path: 'retries', label: 'Retries' },
          ],
        },
      ],
    });
    expect(out.sections[0]!.fields.map((f) => f.path)).toEqual(['timeout', 'retries']);
  });

  it('empty object sanitizes to empty sections', () => {
    expect(sanitizeHostPropertiesSchema({})).toEqual({ sections: [] });
  });

  it('isUnsafeFieldPath', () => {
    expect(isUnsafeFieldPath('')).toBe(true);
    expect(isUnsafeFieldPath('..')).toBe(true);
    expect(isUnsafeFieldPath('a..b')).toBe(true);
    expect(isUnsafeFieldPath('.a')).toBe(true);
    expect(isUnsafeFieldPath('timeout')).toBe(false);
    expect(isUnsafeFieldPath('taskMeta.foo')).toBe(false);
  });

  it('logic built-ins: Condition / empty Decision / Repeater empty options', () => {
    expect(logicBuiltinPropertiesSchema('Condition')!.sections[0]!.fields[0]!.path).toBe('condition');
    expect(visibleHostSections(logicBuiltinPropertiesSchema('Decision')!)).toEqual([]);
    const wf = logicBuiltinPropertiesSchema('Repeater')!.sections[0]!.fields.find(
      (f) => f.path === 'repeater.workflowId',
    );
    expect(wf?.options).toEqual([]);
    expect(logicBuiltinPropertiesSchema('Action')).toBeNull();
  });
});
