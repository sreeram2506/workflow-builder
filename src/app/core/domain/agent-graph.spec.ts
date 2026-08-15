import { describe, expect, it } from 'vitest';
import {
  emptyAgentNestedGraph,
  fromAgentEditableDocument,
  readAgentNestedGraph,
  toAgentEditableDocument,
  withNestedWorkflow,
} from './agent-graph';

describe('agent-graph', () => {
  it('reads empty when missing', () => {
    expect(readAgentNestedGraph(undefined).nodes).toEqual([]);
    expect(readAgentNestedGraph({}).nodes).toEqual([]);
  });

  it('round-trips nested workflow on data', () => {
    const graph = emptyAgentNestedGraph();
    graph.nodes.push({
      id: 'n1',
      type: 'Action',
      label: 'Action',
      subtitle: '',
      position: { x: 10, y: 20 },
      status: 'idle',
      data: {},
    });
    const data = withNestedWorkflow({}, graph);
    const again = readAgentNestedGraph(data);
    expect(again.nodes).toHaveLength(1);
    expect(again.nodes[0]?.id).toBe('n1');
  });

  it('builds editable document and extracts back', () => {
    const g = emptyAgentNestedGraph();
    const doc = toAgentEditableDocument('agent-1', 'Blank Agent', g);
    expect(doc.id).toBe('agent-canvas-agent-1');
    expect(doc.name).toBe('Blank Agent');
    expect(fromAgentEditableDocument(doc).nodes).toEqual([]);
  });
});
