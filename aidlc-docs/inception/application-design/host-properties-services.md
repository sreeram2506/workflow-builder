# Services — Generic host-driven Properties

---

## Service / module catalog

| ID | Name | Kind | Responsibility |
|---|---|---|---|
| S-HP-TYPE | `host-properties.schema.ts` | pure | Types, sanitize, logic built-in schemas |
| S-HP-RES | `resolveHostPropertiesSchema` | pure | First-win |
| S-HP-ADP | Properties adapter token | optional DI | Sync `schemaFor` |
| S-HP-FAC | `createWorkflowNodeFromPaletteItem` | pure | Copy schema + `taskMeta` |
| S-HP-SIDE | `RightSidebarComponent` | UI | Render / Save |
| S-HP-UI | `provideWorkflowBuilderUi` | providers | Register features, catalog, **properties** |
| S-HP-DOCS | Embed | documentation | Public contract |

No new Angular service (Q2=A). `WorkflowFacade.patchNode` unchanged.

---

## Orchestration

### Resolve + render

```text
Select node
    -> General always (label, subtitle, status)
    -> resolveHostPropertiesSchema(node, injected adapter or null)
        -> if node.data.propertiesSchema is an object:
              sanitize; use (even if all fields skipped)
        -> else if adapter.schemaFor(node) returns schema:
              sanitize; use
        -> else if Condition / Decision / Repeater:
              logic built-in schema
        -> else:
              null -> Configuration empty (General only)
    -> render visible fields; unknown ui_component -> disabled text
    -> Save -> setAtPath on node.data -> patchNode
```

Text alternative: Properties always shows General. Configuration comes from the node schema, else the adapter, else logic built-ins, else nothing. Invalid fields are skipped. Unknown widgets are disabled text. Blobs are not walked.

### Drop copy

```text
Palette item drop
    -> createWorkflowNodeFromPaletteItem
        -> data.propertiesSchema copy if present
        -> data.taskMeta copy if present (not ensoTask)
        -> data.metadata copy if present
```

---

## Non-goals

- PropertiesSchemaService injectable
- Async adapter
- Live custom widget registry
- Flatten `taskMeta` or leftover `ensoTask`
