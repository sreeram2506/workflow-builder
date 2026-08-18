# Intent Analysis — Enter agent without tab bar

**Timestamp**: 2026-08-18T09:50:00Z  
**User request**: Double-click an agent to go inside even when the agent toolbar is hidden. Two ways in: (1) the current agent tab bar, (2) double-click on the agent. Both must work without requiring the agent bar.

| Item | Assessment |
|---|---|
| **Clarity** | Clear enhancement; one product lock (how to leave nested canvas when the bar is hidden) |
| **Type** | Enhancement |
| **Scope** | Canvas dblclick + agent-tabs chrome + nested shell back path |
| **Complexity** | Simple–moderate |
| **Depth** | Standard |

## Today

- Single-click AIAgent: `openAgentTab` (adds a chip; does **not** navigate).
- Double-click AIAgent: `selectAgentTab` → `/agent/:nodeId` (enters nested canvas).
- Agent chip click: `focusAgentTabChrome` → same navigate.
- `agentTabs.enabled === false` hides the strip. Nested **Solution** chip is also gone, so there is no in-app back when the bar is off.

## Proposed intent

Keep both entry methods. Tab bar remains optional chrome. Double-click (and tab click when the bar is on) must enter the agent even if `agentTabs.enabled` is false. Nested canvas still must not re-enter on dblclick.
