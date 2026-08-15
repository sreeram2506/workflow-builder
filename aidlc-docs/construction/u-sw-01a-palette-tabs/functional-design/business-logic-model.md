# Business Logic Model — U-SW-01a Palette + Agent Tabs

**Unit**: `u-sw-01a-palette-tabs`  
**Stories**: US-SW-01; tab chrome prerequisite for US-SW-02 (verified in 01b)

---

## Capability overview

1. **Solution palette** — Featured strip remains Condition / Router / Repeater; **Blank Agent** card sits in a row **directly below** that strip; drag/click-to-add creates `AIAgent` labeled `"Blank Agent"` (copy-on-create).
2. **Agent tabs** — Double-click an `AIAgent` on the solution canvas opens or focuses a tab in the top bar (no nested navigation in this unit).
3. **Tab lifecycle** — Max 5 tabs; FIFO eviction on overflow; explicit close (×); label tracks node label; allowed in view mode.

---

## Primary flows

### F1 — Add Blank Agent from library

```text
Author (edit) → activate Blank Agent card (drag or click-to-add)
  → create WorkflowNode { type: AIAgent, label: "Blank Agent", data: {} }
  → place on canvas / select
  → Blank Agent remains in library
```

### F2 — Open / focus agent tab

```text
Author (edit or view) → dblclick AIAgent node
  → if tab for nodeId exists → focus it
  → else if openTabs.count < 5 → append tab { nodeId, openedAt }
  → else → FIFO: remove oldest tab by openedAt → append new tab
  → stay on solution canvas (no route change)
```

### F3 — Close agent tab

```text
Author → click × on tab
  → remove tab for nodeId
  → if it was focused → focus most recent remaining tab or none
  → canvas node unchanged
```

### F4 — Rename reflects on tab

```text
Author renames AIAgent via Properties (existing Save)
  → tab title for that nodeId reads updated label
```

---

## Transformations

| Input | Output |
|---|---|
| Palette activate `AIAgent` | New node on solution document |
| Dblclick `AIAgent` | OpenAgentTabs UI state update |
| Close tab | OpenAgentTabs without that nodeId |
| Node label patch | Tab display label refresh |

---

## Out of scope (deferred to U-SW-01b)

- Tab click → `/agent/:nodeId`
- Skills catalog / `data.skills`
- Back from nested view
