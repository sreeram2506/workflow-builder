# Domain Entities — U-RAD-01 Remove APIs and dummy data

No new workflow node types. Existing `PaletteItem` / `PaletteCatalogLoad` stay. Dummy skill and Repeater catalog entities are **removed**.

---

## Changed / removed entities

| Entity | Change |
|---|---|
| `PaletteCatalogLoad` | Omit-without-adapter uses `source: 'empty'`. Never emit `'enso'`. Type union may drop `'enso'` in Code Generation. |
| `CatalogLoadOptions` | `hostPalettes` omitted no longer means Enso. `userCategories` / `includeAgentId` unused (were Enso-only); may remain on the type ignored. |
| `MockSkill` / `MOCK_SKILLS` | **Delete** |
| `RepeaterMockWorkflow` / `REPEATER_MOCK_WORKFLOWS` | **Delete** |
| Environment catalog fields | **Delete** URLs, IDs, categories, credentials |
| Enso pipeline/task mapper DTOs | **Delete** with HTTP helpers |
| `enso-task-form` field specs | **Keep** (dropped-node Properties) |

---

## Empty-remote load (Q1=A)

Canonical object (not a new type):

```text
{
  categories: [],
  items: [],
  source: 'empty',
  error: null,
  emptyRemote: true
}
```

---

## Nested list row

Uses existing `PaletteItem` (`key`, `label`, `description`, optional `taskId`). Not `MockSkill`.

---

## Repeater node data

Existing `repeater.workflowId` / `versionId` strings. No catalog entity. Empty option lists do not imply those fields are deleted (Q4=A).

---

## Relationships

```text
Omit palettes, no adapter
    -> empty-remote PaletteCatalogLoad
    -> left-sidebar empty-remote UI (featured hidden)

Defined palettes
    -> sanitizeHostPaletteItems
    -> host overlay + U-LIM featured replace

Omitted palettes + adapter
    -> adapter rows or errorLoad static

Nested [palettes]
    -> sanitize + filter
    -> addSkillFromPaletteItem
    -> agent.data.skills

Repeater node selected
    -> schema options []
    -> selects empty; node data unchanged
```

Text alternative: Omit without an adapter yields empty-remote. Bound palettes still overlay. An adapter still loads when palettes are omitted. Nested library lists palette items. Repeater pickers have no dummy catalog.

---

## Out of scope entities

- New Repeater workflow catalog  
- New skill backend  
- `SAMPLE_WORKFLOW`  
- Renamed `PaletteCatalogService`
