/** Agent tab session state helpers (U-SW-01a) */

export const MAX_AGENT_TABS = 5;

export interface AgentTab {
  nodeId: string;
  /** Epoch ms when the tab was first opened (FIFO order). */
  openedAt: number;
}

export interface OpenAgentTabsResult {
  tabs: AgentTab[];
  focusedNodeId: string | null;
}

/** Open or focus a tab for nodeId. At capacity, FIFO-evict oldest by openedAt. */
export function openAgentTab(
  tabs: readonly AgentTab[],
  nodeId: string,
  now: number = Date.now(),
): OpenAgentTabsResult {
  const existing = tabs.find((t) => t.nodeId === nodeId);
  if (existing) {
    return { tabs: [...tabs], focusedNodeId: nodeId };
  }
  let next = [...tabs];
  if (next.length >= MAX_AGENT_TABS) {
    const oldest = next.reduce((a, b) => (a.openedAt <= b.openedAt ? a : b));
    next = next.filter((t) => t.nodeId !== oldest.nodeId);
  }
  next.push({ nodeId, openedAt: now });
  return { tabs: next, focusedNodeId: nodeId };
}

export function closeAgentTab(
  tabs: readonly AgentTab[],
  focusedNodeId: string | null,
  nodeId: string,
): OpenAgentTabsResult {
  const next = tabs.filter((t) => t.nodeId !== nodeId);
  if (focusedNodeId !== nodeId) {
    return { tabs: next, focusedNodeId };
  }
  if (next.length === 0) {
    return { tabs: next, focusedNodeId: null };
  }
  const newest = next.reduce((a, b) => (a.openedAt >= b.openedAt ? a : b));
  return { tabs: next, focusedNodeId: newest.nodeId };
}

export function focusAgentTab(
  tabs: readonly AgentTab[],
  nodeId: string,
): OpenAgentTabsResult | null {
  if (!tabs.some((t) => t.nodeId === nodeId)) {
    return null;
  }
  return { tabs: [...tabs], focusedNodeId: nodeId };
}

/** Drop tabs whose nodeId is not in aliveIds; fix focus if needed. */
export function pruneMissingNodeIds(
  tabs: readonly AgentTab[],
  focusedNodeId: string | null,
  aliveIds: ReadonlySet<string>,
): OpenAgentTabsResult {
  const next = tabs.filter((t) => aliveIds.has(t.nodeId));
  if (next.length === tabs.length && (focusedNodeId === null || aliveIds.has(focusedNodeId))) {
    return { tabs: [...tabs], focusedNodeId };
  }
  if (focusedNodeId && next.some((t) => t.nodeId === focusedNodeId)) {
    return { tabs: next, focusedNodeId };
  }
  if (next.length === 0) {
    return { tabs: next, focusedNodeId: null };
  }
  const newest = next.reduce((a, b) => (a.openedAt >= b.openedAt ? a : b));
  return { tabs: next, focusedNodeId: newest.nodeId };
}
