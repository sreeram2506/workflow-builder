import { describe, expect, it } from 'vitest';
import { collectEnsoTaskFields, writeEnsoFieldValue } from './enso-task-form';

describe('enso-task-form', () => {
  it('flattens nested config into field paths', () => {
    const fields = collectEnsoTaskFields({
      task_id: 1,
      display_name: 'Ignore Keys',
      config: { data: { ignore_keys_in_paragraph: true } },
    });
    const paths = fields.map((f) => f.path);
    expect(paths).toContain('task_id');
    expect(paths).toContain('display_name');
    expect(paths).toContain('config.data.ignore_keys_in_paragraph');
    expect(fields.find((f) => f.path.endsWith('ignore_keys_in_paragraph'))?.kind).toBe('boolean');
  });

  it('writes nested values immutably', () => {
    const next = writeEnsoFieldValue({ config: { data: { a: 1 } } }, 'config.data.a', 2);
    expect(next).toEqual({ config: { data: { a: 2 } } });
  });
});
