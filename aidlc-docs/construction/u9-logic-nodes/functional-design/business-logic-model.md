# Business Logic Model — U9 Logic Nodes

## Purpose
Configure Condition, Router (`Decision`), and Repeater like enso-suite: type-specific Properties, Condition binary edges, Router connector conditions. Persist on Save. No live API.

## Actors
- P-AUTHOR — edit
- P-REVIEWER — view-mode inspect

## Preconditions
- U5 Properties (Save-only, XPMS descriptors, focus node)
- U4 connect gesture
- `editorMode` edit | view
- Palette already drops Condition, Decision (Router), Repeater

## Locked decisions

| Topic | Decision |
|---|---|
| Router new edge | label `Blank Condition`, condition `''` |
| Repeater data | `data.repeater.workflowId`, `versionId`, `is_paused` |
| Uniqueness | Trim; case-sensitive; Router+Repeater shared set; Conditions excluded |
| Third Condition out | Silent reject; graph unchanged |
| Relabel | Fill missing `true` then `false` |
| Persist | Save only |
| Mock catalog | 2–3 workflows, 1–2 versions each |
| Ignore Keys | Hidden on Condition, Decision, Repeater |
| `routeEdges` | Unchanged (not this unit) |

---

## Flow 1 — Bind Properties by node type

```text
focusNodeId -> load WorkflowNode
  General: label, subtitle, status (all types)
  if type === Condition:
    show required string Condition (data.condition)
    hide Ignore Keys
  if type === Decision (Router):
    no node-level condition
    hide Ignore Keys
    uniqueness validator on label vs other Router/Repeater labels
  if type === Repeater:
    hide Ignore Keys
    uniqueness on label
    Workflow/Agent select from mock catalog
    Version select from versions of selected workflow
    Pause boolean (default false)
  else:
    existing Ignore Keys descriptor (U5)
  if editorMode === view: disable form; hide Save
```

---

## Flow 2 — Repeater dependent Version

```text
User changes Workflow/Agent
  -> set versionId to empty
  -> Version options = catalog.versions for that workflowId
  -> Version control invalid until a version is chosen
Save requires label, workflowId, versionId
```

---

## Flow 3 — Save node

```text
Save enabled iff edit && dirty && valid
  Condition valid: label non-empty, condition non-empty
  Router valid: label non-empty, unique among Router+Repeater
  Repeater valid: label unique, workflowId, versionId
patchNode with merged data
Unsaved discard on selection change (U5)
```

---

## Flow 4 — Complete connection (connect gesture)

```text
User completes edge sourceId -> targetId (edit mode only)
  source = node[sourceId]
  if source.type === Condition:
    labels = outgoing edge labels from source
    next = nextConditionOutLabel(labels)  // true if missing, else false if missing, else null
    if next is null: do not add edge (silent)
    else add edge with label = next, condition = ''
  else if source.type === Decision:
    add edge with label = 'Blank Condition', condition = ''
  else:
    existing U4 connect (no condition field)
```

---

## Flow 5 — Bind edge Properties

```text
If selection is one edge:
  source = edge.source node
  if source.type === Decision:
    Connector Properties: Name (label, required), Condition (required)
    Save -> patchEdge({ label, condition })
  if source.type === Condition:
    Connection: label read-only true|false; no condition field; no Save for those two fields
  else:
    existing Connection panel (id, source, target, label)
View mode: fields visible, disabled, no Save
```

---

## Pure helpers (testable / PBT Partial)

- `nextConditionOutLabel(existing: string[]): 'true' | 'false' | null`
- `isLogicLabelUnique(label, nodes, opts)`
- `versionsForWorkflow(catalog, workflowId)`
- `repeaterAfterWorkflowChange(data, workflowId)` — clears versionId

## Out of scope
Live Enso HTTP, toasts, query builder, SVG shape changes, `routeEdges`, pause on non-Repeater
