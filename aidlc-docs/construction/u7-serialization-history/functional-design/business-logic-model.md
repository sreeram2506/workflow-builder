# Business Logic Model — U7 Serialization, Autosave, History, Clipboard

## Purpose
Export/import workflow JSON, debounced in-memory autosave signaling, undo/redo via document snapshots, and copy/paste of selected subgraph — all session-only (no backend / no localStorage).

## Actors
- Workflow Author (P-AUTHOR)

## Preconditions
- U1–U6 graph model mutations via `WorkflowFacade` / GraphStore
- Top-bar Undo / Redo / Save placeholders exist (currently disabled)

## Locked decisions

| Topic | Decision |
|---|---|
| Export | Download `.json` file only |
| Import | File picker **and** paste dialog; replace entire document on success |
| Invalid import | Reject; preserve prior state; clear error message |
| Autosave | Mutations already live in GraphStore; debounce **500 ms** updates in-memory “saved” snapshot/status |
| Save button / ⌘S | Explicit **download JSON** (same payload as Export) + brief “Saved” status |
| History | Document **snapshots**; graph mutations only (not pan/zoom/selection/theme) |
| Depth | Cap **100**; coalesce node-drag to one entry on pointer-up |
| Copy/paste | Selected nodes + edges with both ends selected; new ids; offset **+40,+40**; select pasted |
| Shortcuts | ⌘/Ctrl+Z undo; ⌘/Ctrl+Shift+Z (+ Ctrl+Y) redo; ⌘/Ctrl+C/V copy/paste; ⌘/Ctrl+S save/download; ignore in inputs |
| JSON | `schemaVersion: 1` + `WorkflowDocument` fields; reject unknown major / invalid shape |
| Non-goals | No localStorage/IndexedDB; no backend; no U8 run/view |

---

## Flow 1 — Export / Save download

```text
User Export or Save (⌘S)
  -> serialize(document) → JSON string (schemaVersion: 1)
  -> trigger browser download (.json)
  -> optional canvasStatus “Saved” / “Exported”
```

---

## Flow 2 — Import

```text
User picks file OR pastes JSON in dialog
  -> parse + validate (schemaVersion, structure, node/edge integrity)
  -> OK: replace GraphStore document; clear history stacks; select none
  -> Fail: keep prior document; set canvasError with clear message
```

---

## Flow 3 — Autosave debounce

```text
Graph mutation committed
  -> start/reset 500ms timer
  -> on fire: update AutoSave lastSnapshot / “dirty cleared” status (in-memory only)
  -> refresh still loses everything (documented)
```

---

## Flow 4 — Undo / Redo

```text
Before committed graph mutation (except during undo/redo apply):
  -> push deep snapshot of document onto undo stack (cap 100)
  -> clear redo stack
  -> coalesce: node-drag records one snapshot at gesture start (or commit on pointer-up only)

Undo:
  -> pop undo → push current to redo → restore snapshot to GraphStore

Redo:
  -> pop redo → push current to undo → restore
```

---

## Flow 5 — Copy / Paste

```text
Copy (selected nodes):
  -> clipboard = nodes + edges where source∈sel ∧ target∈sel

Paste:
  -> remap ids; offset positions +40,+40
  -> add to document; select new nodes; push history
```

---

## Out of scope (U7)
- localStorage / IndexedDB / backend
- System OS clipboard JSON fragment (Q9≠C)
- Command-pattern inverse ops
- History for pan/zoom/theme/Properties keystrokes
- U8 Run / view-mode lock
