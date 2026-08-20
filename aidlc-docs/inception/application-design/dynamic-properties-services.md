# Services — Dynamic Properties

**Decision (Q5=A)**: No new orchestration service.

## Orchestration (existing)

| Actor | Role |
|---|---|
| `WorkflowFacade` | `patchNode` / document updates; host observes facade/document |
| `wb-right-sidebar` | Form lifecycle; calls pure helpers; hosts Dynamic Property children |
| `resolveHostPropertiesSchema` | Metadata supply only (first-win unchanged) |
| UI effective chrome | Supplies `propertiesPanel.addProperty` |

## Patterns

- **Pure domain + UI composition** — no `PropertiesPanelService`
- **Batch Save** — properties map written on Save, not per-keystroke (Q3=A)
- **Host notify** — document/`patchNode` only (no new output event)
