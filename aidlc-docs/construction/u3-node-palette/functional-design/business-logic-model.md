# Business Logic Model — U3 Node Palette

## Purpose
Enable categorized searchable Nodes Library and create nodes on the canvas via CDK drag-drop or click-to-add.

## Actors
- Workflow Author (P-AUTHOR)

## Preconditions
- U1 shell with Nodes Library host
- U2 canvas viewport + `screenToWorld` / viewport signals
- GraphStore holds document

---

## Flow 1 — Browse / search catalog

```text
User opens Nodes Library
  -> PaletteCatalog provides categories + items
User types search
  -> debounce 150–200ms
  -> filter items by label|type|description
  -> render matching items under categories (hide empty)
User clears search
  -> show full categorized catalog
User expands/collapses category
  -> toggle session collapsed flag
```

---

## Flow 2 — Drag palette item to canvas

```text
Pointer drag starts on palette item (CDK)
  -> preview = CDK default ghost
Drop on canvas viewport
  -> screen = drop client coords relative to viewport
  -> world = screenToWorld(screen, viewport)
  -> facade.createNode(type, world)
       -> GraphStore append WorkflowNode
       -> UiStore selectNodes([newId])
Drop outside viewport
  -> cancel (no create)
```

---

## Flow 3 — Click-to-add

```text
User clicks palette item (no drag)
  -> world = screenToWorld(viewportCenter, viewport)
  -> facade.createNode(type, world)
  -> select new node
```

---

## Flow 4 — createNode (facade)

```text
createNode(type, position)
  -> validate type ∈ ALLOWED_NODE_TYPES
  -> if editorMode === view: no-op (or ignore)
  -> id = n-{type}-{shortRandom}
  -> node = { id, type, label, subtitle, position, status: idle, data: {} }
  -> graph.addNode(node)
  -> ui.selectNodes([id])
```

## Error / edge cases
| Case | Behavior |
|---|---|
| Unknown type | Ignore / no-op |
| No document loaded | No-op |
| Drop outside canvas | Cancel |
| Library collapsed | User must expand to drag |

## Testable properties (advisory / Partial PBT)
| Property | Notes |
|---|---|
| Created type always in catalog | Invariant |
| Id prefix matches type | Invariant |
| Search filter: empty query ⇒ all items | Invariant |
