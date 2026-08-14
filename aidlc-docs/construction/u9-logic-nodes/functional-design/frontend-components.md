# Frontend Components — U9 Logic Nodes

## Hierarchy

```text
RightSidebar (existing)
  ├─ Node form (evolve)
  │     ├─ GeneralSection (label, subtitle, status)
  │     ├─ ConditionSection (expression)          // type Condition
  │     ├─ RepeaterSection (workflow, version, pause)
  │     └─ ConfigurationSection (Ignore Keys)    // hidden for logic types
  └─ Edge form (evolve)
        ├─ ConnectionSection (id, source, target, label)
        ├─ ConnectorSection (name + condition)   // source is Router
        └─ ConditionEdgeSection (read-only true/false)
```

Keep one right sidebar. Branch sections with `@if` on selected type / edge source type. No new feature app.

## Node form

| Type | Sections | Save validators |
|---|---|---|
| Condition | General + Condition expression | label, condition required |
| Decision | General | label required + unique vs Router/Repeater |
| Repeater | General + Workflow/Agent + Version + Pause | label unique; workflowId; versionId |
| Other | General + Ignore Keys | existing |

Workflow/Agent and Version: native select bound to mock catalog. On workflow change, clear version control.

Pause: switch or checkbox → `repeater.is_paused`.

## Edge form

| Source type | UI |
|---|---|
| Decision | Connector: Name, Condition; Save |
| Condition | Label read-only; no condition; no Save for label |
| Other | Existing Connection fields |

## Connect gesture

Canvas connect completion calls facade `tryConnect(sourceId, targetId)`:

- Condition: apply `nextConditionOutLabel`; abort if null
- Decision: create edge with Blank Condition / empty condition
- Else: existing connect

View mode: connect remains locked (U8).

## State / facade API (delta)

| API | Role |
|---|---|
| `patchNode` | Existing; writes logic `data` paths |
| `patchEdge(id, { label?, condition? })` | New; Router connector Save |
| `tryConnect(sourceId, targetId)` | New or wrap existing create-edge with BR-U9-05/06 |
| Repeater mock catalog | Static import; no service HTTP |

## Interaction notes

- Save enablement: edit + dirty + valid (BR-U5-07)
- Inline errors only
- Auto-expand on single select unchanged
- Third Condition edge: no extra UI chrome

## Non-goals (UI)
- Toasts
- Query builder
- New npm controls
- Changing logic-node SVG shapes
