import { describe, expect, it } from 'vitest';
import { extractEnsoPipelines, mapEnsoPipelinesToAgents } from './enso-pipeline.mapper';

describe('enso-pipeline.mapper', () => {
  it('extracts pipelines from result.metadata.results', () => {
    const pipelines = extractEnsoPipelines({
      result: {
        metadata: {
          results: [{ pipeline_id: 'a1', name: 'Claims Agent', description: 'Intake' }],
        },
      },
    });
    expect(pipelines).toHaveLength(1);
    expect(pipelines[0]!.name).toBe('Claims Agent');
  });

  it('maps pipelines to AIAgent palette items', () => {
    const { categories, items } = mapEnsoPipelinesToAgents([
      { pipeline_id: 'p1', name: 'Policy Agent', description: 'Checks policy' },
      { pipeline_id: 2, name: 'Notify Agent' },
    ]);
    expect(categories).toEqual([{ id: 'agents', label: 'Agents' }]);
    expect(items).toHaveLength(2);
    expect(items[0]!.type).toBe('AIAgent');
    expect(items[0]!.key).toBe('enso-agent-p1');
    expect(items[1]!.key).toBe('enso-agent-2');
  });
});
