# Frontend Components Summary — U-HP-01 Generic host-driven Properties

**Stories**: US-HP-01, US-HP-02, US-HP-03, US-HP-04

## Modified

| Path | Change |
|---|---|
| `src/app/features/shell/right-sidebar.component.ts` | General always; resolve host schema; render sections/fields; Save coerce + `setAtPath`; no flatten / Ignore Keys |
| `src/app/features/shell/right-sidebar.component.spec.ts` | Schema Save; taskMeta not flattened; leftover `ensoTask` unused; unknown widget disabled |
| `docs/workflow-builder-ui-embed.md` | Palette `propertiesSchema` / `taskMeta`; `provideWorkflowBuilderUi({ properties })`; first-win; no host-specific field names |

## Behavior

- Condition / Repeater / Decision built-ins still bind when the host omits a schema
- Repeater option lists stay empty; existing workflow/version ids are not cleared on bind
- Unknown `ui_component` is a disabled text control (no live widget map)
- Connector and Condition-out edge UI is unchanged
- View mode still disables the form
