# Domain Entities — U9 Logic Nodes

## Carried from prior units

| Entity | U9 use |
|---|---|
| `WorkflowNode` | `label`, `subtitle`, `status`, `type`, `data` |
| `WorkflowEdge` | `label`, `waypoints`, **new** `condition: string` |
| `NodeType` | `Condition`, `Decision` (Router), `Repeater` |
| `XpmsFieldDescriptor` | Extra descriptors on logic types |
| `EditorMode` / selection focus | Bind + view lock |

## WorkflowEdge (delta)

| Field | Meaning |
|---|---|
| `condition` | Free-text connector condition. Default `''`. Meaningful when source is Router. |

## Node data (logic)

### Condition
| Path | Type | Required |
|---|---|---|
| `condition` | string | yes |

### Repeater
| Path | Type | Required |
|---|---|---|
| `repeater.workflowId` | string | yes on Save |
| `repeater.versionId` | string | yes on Save |
| `repeater.is_paused` | boolean | no; default false |

### Router (`Decision`)
No extra `data` keys for branching. Conditions live on edges.

## RepeaterMockCatalog

```text
RepeaterMockWorkflow
  id: string
  name: string
  versions: { id: string, name: string }[]
```

Hardcoded array (3 workflows). Pure lookup `versionsForWorkflow(id)`.

## EdgePatch
| Field | Meaning |
|---|---|
| `label?` | Connector name |
| `condition?` | Connector expression |

`patchEdge(id, patch)` — view mode no-op.

## Pure function contracts

```text
nextConditionOutLabel(labels: string[]): 'true' | 'false' | null
  trim labels; if none equal 'true' -> 'true'
  else if none equal 'false' -> 'false'
  else null

isRouterRepeaterLabelUnique(label: string, nodes: WorkflowNode[], excludeId: string): boolean
  key = label.trim()
  no other node with type Decision|Repeater and id !== excludeId and node.label.trim() === key

repeaterAfterWorkflowChange(repeater: RepeaterData, workflowId: string): RepeaterData
  { workflowId, versionId: '', is_paused: repeater.is_paused }
```

## Schema registry delta

| Type | configurationFields |
|---|---|
| Condition | Condition string (`condition`), required |
| Decision | empty (or none); Ignore Keys hidden |
| Repeater | workflowId, versionId (select), is_paused (boolean) |
| Other types | U5 Ignore Keys unchanged |

## Explicitly not entities
- Enso task payloads
- Query-builder AST
- Toast/notification entities
