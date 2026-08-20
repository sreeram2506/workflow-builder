# Intent Analysis — Agent tabs doubleClick config

**Timestamp**: 2026-08-20T02:26:00Z  
**User request**: Introduce double-click-to-enter-agent as a parent-passable UI config (today it is always on).

| Item | Assessment |
|---|---|
| **Clarity** | Clear after RA answers (Q1–Q7 all A) |
| **Type** | Enhancement (brownfield chrome leaf) |
| **Scope** | `UiFeatures.agentTabs`, merge/normalize, canvas `onNodeDblClick` gate, embed docs + JSON examples |
| **Complexity** | Simple |
| **Depth** | Standard |

## Today

- Canvas dblclick on Blank Agent / AIAgent always calls `selectAgentTab` → `/agent/:id`.
- `agentTabs.enabled` only hides the chip strip; it does not gate dblclick (U-AE-01).
- Chip single-click (strip on) still enters.
- Nested canvas dblclick does not re-enter.
- Host layers: defaults → JSON → `provideWorkflowBuilderUi` → `[ui]`.

## Proposed intent

Add boolean leaf `agentTabs.doubleClick` (default `true`) so a parent can turn canvas enter-on-dblclick off without forking the library. Independent of `agentTabs.enabled`. Chip click unchanged when the strip is on. Both flags false means no nested enter from builder chrome.
