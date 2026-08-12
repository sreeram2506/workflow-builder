# Business Logic Model — U5 Schema-Driven Properties Panel

## Purpose
Show and edit the focused node’s properties via a schema-driven reactive form; persist only on explicit Save.

## Actors
- Workflow Author (P-AUTHOR) — edit mode
- Workflow Reviewer (P-REVIEWER) — view mode inspect (US-6.2 readiness)

## Preconditions
- U1 shell + selection + right Properties overlay
- U2/U3/U4 graph + node create/select
- `editorMode` signal exists (`edit` | `view`)

## Locked decisions

| Topic | Decision |
|---|---|
| Schema format | **XPMS-style field descriptors** (overrides earlier JSON Schema answer) |
| Field list (gate) | **General** (`label`, `subtitle`, `status`) + **per type one** boolean Configuration mock (`Ignore Keys in Paragraph`) |
| Value placement | General on node root; Configuration via `config_path` under `node.data` |
| Persist | **Save only**; no Cancel; leaving selection **discards** unsaved edits |
| Multi-select | Show **most recently clicked** selected node (selection focus) |
| Invalid Save | Disable Save; inline field errors only (no toast) |
| Panel open | Auto-expand Properties when **exactly one** node is selected |
| View mode | Same form **disabled/readonly**; Save hidden or disabled |
| Non-goals | No edge properties; no backend schema fetch; no undo (U7) |

---

## Flow 1 — Open / bind Properties

```text
Selection changes
  -> if nodeIds.length === 1:
       expand Properties (if collapsed)
       focusNodeId = that node id
  -> if nodeIds.length > 1:
       keep panel state; focusNodeId = most recently clicked id still in selection
  -> if nodeIds.length === 0 (or edge-only):
       clear form binding; empty state “Select a node”
       (do not force-collapse chip)

On node pointer select / Shift-toggle add:
  -> set selectionFocusNodeId = clicked node id (if ends selected)
```

---

## Flow 2 — Build form from schema

```text
focusNodeId resolved → load WorkflowNode
  -> General section: bind label, subtitle, status (root fields)
  -> Configuration section: load XPMS descriptors for node.type from registry
  -> For each descriptor: read current value via config_path on node.data
       (missing path → use descriptor.default / descriptor.value)
  -> Build Angular reactive FormGroup
  -> if editorMode === view: disable entire form; hide Save
  -> mark form pristine (baseline = last saved node snapshot)
```

---

## Flow 3 — Edit + Save

```text
User edits controls
  -> form dirty; Save enabled only if form.valid && dirty && edit mode

User clicks Save
  -> if invalid: no-op (Save disabled)
  -> map General controls → { label, subtitle, status }
  -> map Configuration controls → nested write under node.data by config_path
  -> facade.patchNode(id, { label, subtitle, status, data })
  -> mark form pristine

User changes selection / clears focus while dirty
  -> discard unsaved form values (rebuild from store for new focus)
```

---

## Flow 4 — patchNode (facade)

```text
patchNode(nodeId, partial)
  -> if editorMode === view: no-op
  -> if node missing: no-op
  -> GraphStore updates node immutably (merge root fields; replace/merge data tree)
  -> document.updatedAt / version bump per existing store conventions
```

---

## Out of scope (U5)
- Live patch / debounce
- Edge property forms
- Full per-type rich Configuration catalogs (only one boolean mock per type)
- JSON Schema Draft documents
- History / undo
- Backend-loaded schemas
