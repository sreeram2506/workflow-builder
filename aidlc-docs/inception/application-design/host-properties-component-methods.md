# Component Methods — Generic host-driven Properties

High-level interfaces. First-win invariants and field coerce → Functional Design.

---

## host-properties.schema.ts (new, Q1=A)

| API | Input | Output | Purpose |
|---|---|---|---|
| `HostPropertiesSchema` | — | type | `sections[]` with `fields[]` |
| `HostPropertiesField` | — | type | `type`, `path`, `label`, `required`, `hidden`, `options`, `placeholder`, optional `ui_component` |
| `sanitizeHostPropertiesSchema` | unknown | `HostPropertiesSchema` | Skip invalid fields; keep sections that still have fields; never throw |
| `logicBuiltinPropertiesSchema` | `NodeType` | `HostPropertiesSchema \| null` | Condition / Decision / Repeater only |

---

## resolveHostPropertiesSchema (new, Q2=A)

| API | Input | Output | Purpose |
|---|---|---|---|
| `resolveHostPropertiesSchema` | `node`, `adapter \| null` | `HostPropertiesSchema \| null` | First-win; `null` means General only |

`null` adapter is omit. Present-but-empty sanitized node schema still wins (do not fall through).

---

## provideWorkflowBuilderUi (change, Q3=A)

| API | Input | Output | Purpose |
|---|---|---|---|
| `options.properties.schemaFor` | `WorkflowNode` | `HostPropertiesSchema \| null` | Sync host schema when node has no `propertiesSchema` |
| `WORKFLOW_BUILDER_PROPERTIES` | token | adapter | Optional DI; same pattern as catalog tokens |

No `[properties]` input on shells.

---

## PaletteItem + createWorkflowNodeFromPaletteItem (change)

| API | Change |
|---|---|
| `PaletteItem.propertiesSchema` | Optional; copied to `node.data.propertiesSchema` |
| `PaletteItem.taskMeta` | Copied to `node.data.taskMeta` (not `ensoTask`) |
| `PaletteItem.metadata` | Unchanged copy to `node.data.metadata` |

---

## RightSidebarComponent (change, Q5=A)

| API | Change |
|---|---|
| `bindNode` | Resolve schema; build form from sections/fields + General; no `collectEnsoTaskFields` |
| Save / draft | `setAtPath(node.data, field.path, coerced)` |
| Unknown `ui_component` | Disabled text with current value |
| Ignore Keys | Not shown |
| View mode | Form disabled (unchanged) |

---

## enso-task-form (Q4=A)

| API | Change |
|---|---|
| `collectEnsoTaskFields` | **Delete** (or unused and removed with the module) |
| coerce / display helpers | Keep only if sidebar still needs them; else colocate with new schema file |

---

## Docs

| Artifact | Purpose |
|---|---|
| `docs/workflow-builder-ui-embed.md` | `propertiesSchema` + `provideWorkflowBuilderUi({ properties })`; first-win; no Enso names |

---

## Notes

- `getAtPath` / `setAtPath` stay in `config-path.ts`.
- Connector / Condition edge UI is unchanged (not schema fields).
