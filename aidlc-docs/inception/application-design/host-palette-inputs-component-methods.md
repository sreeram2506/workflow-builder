# Component Methods — Host palette inputs (Syncfusion-style)

High-level interfaces. Exact `CatalogLoadOptions` fields → Functional Design.

---

## ShellLayoutComponent

| API | Input | Output | Purpose |
|---|---|---|---|
| `palettes` | `input<PaletteItem[] \| undefined>()` | — | Unbound = omit; `[]` = empty-remote; items = parent remote list |
| `defaultAgents` | `input<DefaultAgentCard[] \| undefined>()` | — | Unbound = JSON/provider; present (incl. `[]`) replaces Blank Agent |
| Template | pass both into `wb-left-sidebar` | — | Q1=A |

---

## AgentSkillsShellComponent

| API | Input | Output | Purpose |
|---|---|---|---|
| `palettes` | `input<PaletteItem[] \| undefined>()` | — | Same omit/`[]`/items for Skills Library |
| Template | pass into `wb-left-sidebar` | — | No `defaultAgents` |

---

## LeftSidebarComponent (extend)

| API | Purpose |
|---|---|
| `palettes` input | Forward to `loadCatalog` overlay |
| `defaultAgents` input | Forward on solution scope only |
| `loadCatalog` call | Include overlay when corresponding input is not `undefined` |
| Reload | Existing palette-feature effect plus overlay input changes |

Does not validate `NodeType` (Q3=A).

---

## EnsoTaskCatalogService (extend)

| Method | Change |
|---|---|
| `loadCatalog(options)` | Optional host palettes overlay + optional host defaultAgents overlay. Present palettes win over catalog token and Enso. Present defaultAgents win over `features().palette.solution.defaultAgents` |
| Compose | Drop items whose `type` is not in `ALLOWED_NODE_TYPES`; skip invalid cards |
| Empty host palettes | `emptyRemote: true`, `items: []`, `error: null` |

---

## Docs

| Artifact | Purpose |
|---|---|
| `docs/workflow-builder-ui-embed.md` | Parent `<wb-shell-layout [palettes] [defaultAgents]>` example |

---

## Notes

- `node.factory` / facade still create from `PaletteItem.type`. Dropped Stream rows never reach create.
- Allow-list `palette.*.types` still filters parent items (U-PAL-01).
