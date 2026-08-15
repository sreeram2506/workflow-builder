# Domain Entities — U-SW-01a Palette + Agent Tabs

## Existing entities (unchanged shape)

### WorkflowNode (`AIAgent`)

| Field | Notes |
|---|---|
| `id` | Tab key |
| `type` | `'AIAgent'` |
| `label` | Default `"Blank Agent"`; drives tab title |
| `data` | Opaque; skills list is **01b** (`data.skills`) — unused in 01a |

### PaletteItem

| Field | Notes for Blank Agent |
|---|---|
| `key` / `type` | `AIAgent` |
| `label` | `Blank Agent` |
| `description` | Short blurb for library card |
| `categoryId` | `logic` or `agent` — not shown in featured strip types array |

### FEATURED_PALETTE_TYPES

- Remains `Condition | Decision | Repeater` only (no `AIAgent`)

---

## New entities (UI / session)

### AgentTab

| Field | Type | Notes |
|---|---|---|
| `nodeId` | string | References `WorkflowNode.id` |
| `openedAt` | number (epoch ms) | FIFO ordering; set once on first open |

### OpenAgentTabsState (UiStore)

| Field | Type | Notes |
|---|---|---|
| `tabs` | `AgentTab[]` | Max length 5 after FIFO enforcement |
| `focusedNodeId` | `string \| null` | Which tab is visually active |

### Constants

| Name | Value |
|---|---|
| `MAX_AGENT_TABS` | `5` |

---

## Relationships

```text
WorkflowDocument.nodes[AIAgent]
        ^
        | nodeId
OpenAgentTabsState.tabs[]  ----display----> node.label
```

Tabs do **not** own document data; deleting a node should drop its tab (BR-SW01A-09).
