import type { RepeaterData, WorkflowNode } from './workflow.models';

const ROUTER_REPEATER_TYPES = new Set(['Decision', 'Repeater']);

/** Next Condition outgoing label, or null when both true and false already exist. */
export function nextConditionOutLabel(labels: readonly string[]): 'true' | 'false' | null {
  const trimmed = labels.map((label) => label.trim());
  if (!trimmed.includes('true')) {
    return 'true';
  }
  if (!trimmed.includes('false')) {
    return 'false';
  }
  return null;
}

/** Router and Repeater labels must be unique (trim, case-sensitive), excluding `excludeId`. */
export function isRouterRepeaterLabelUnique(
  label: string,
  nodes: readonly WorkflowNode[],
  excludeId: string,
): boolean {
  const key = label.trim();
  return !nodes.some(
    (node) =>
      node.id !== excludeId &&
      ROUTER_REPEATER_TYPES.has(node.type) &&
      node.label.trim() === key,
  );
}

export function repeaterAfterWorkflowChange(
  repeater: RepeaterData,
  workflowId: string,
): RepeaterData {
  return {
    workflowId,
    versionId: '',
    is_paused: repeater.is_paused,
  };
}

export function readRepeaterData(data: Record<string, unknown>): RepeaterData {
  const raw = data['repeater'];
  const obj =
    raw != null && typeof raw === 'object' && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  return {
    workflowId: typeof obj['workflowId'] === 'string' ? obj['workflowId'] : '',
    versionId: typeof obj['versionId'] === 'string' ? obj['versionId'] : '',
    is_paused: obj['is_paused'] === true,
  };
}
