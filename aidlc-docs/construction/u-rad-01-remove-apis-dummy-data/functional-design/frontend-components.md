# Frontend Components — U-RAD-01 Remove APIs and dummy data

---

## Hierarchy

```text
wb-shell-layout / wb-agent-skills-shell
  [palettes] (omit | [] | items)
  wb-left-sidebar
    empty-remote UI when catalog.emptyRemote
    featured / lists when overlay or adapter has rows

wb-nested-skills-library   (not composed in agent-skills-shell)
  [palettes]
  search input
  ul of PaletteItem cards
    Add -> addSkillFromPaletteItem

wb-right-sidebar  Repeater node
  Workflow select   options empty
  Version select    options empty
```

---

## LeftSidebarComponent

| Item | Detail |
|---|---|
| Omit palettes, no adapter | Catalog empty-remote; `palette-empty-remote`; featured hidden (Q2=A) |
| `[palettes]="[]"` | Unchanged empty-remote |
| Palettes with items | Unchanged U-HPI / U-LIM overlay |
| Adapter when omit | Unchanged U-PAL-02; failure still static + banner |

No new chrome. Forwarding of `hostPalettes` unchanged.

---

## NestedSkillsLibraryComponent (Q3=A, Q7=A)

| Item | Detail |
|---|---|
| `palettes` | `PaletteItem[] \| undefined` |
| `agentNodeId` | required (existing) |
| `filtered` | sanitized palettes matching query |
| Search | case-insensitive substring on label, description, key |
| Add | `addSkillFromPaletteItem`; disabled in view mode |
| Empty | empty `<ul>`; no extra empty-state copy |
| Mount | **Not** in `wb-agent-skills-shell` |

---

## RightSidebarComponent — Repeater (Q4=A)

| Item | Detail |
|---|---|
| Workflow select | No dummy Claims/Policy/Notify options; `options` empty |
| Version select | Empty |
| Existing values | Keep `workflowId` / `versionId` on the form if already on the node |

---

## User interaction

| Action | Result |
|---|---|
| Open default SPA Agents Library (no palettes, no adapter) | Empty-remote; no Enso network |
| Bind `[palettes]` with cards | Overlay as U-HPI / U-LIM |
| Open nested Developed-skills with palettes bound | Filtered list; Add adds skill ref |
| Open nested Developed-skills with omit/`[]` | Empty list |
| Select Repeater | Empty workflow/version dropdowns |

---

## State

- Catalog load from existing `loadCatalog` (no Enso source).  
- Nested: local query signal + palettes input.  
- No new global store.

---

## API integration

**No catalog HTTP.** No `/enso-api`. Nested library does not call a backend. UI-config JSON HTTP is unchanged (`UiConfigService`).
