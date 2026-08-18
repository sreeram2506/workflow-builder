# Frontend Components — U-HP-01 Generic host-driven Properties

---

## Hierarchy

```text
wb-right-sidebar
  General (label, subtitle, status)     always
  host / built-in sections              when resolve != null
    section title
    fields (existing controls)
      unknown ui_component -> disabled text
  connector / Condition edge UI         unchanged (not schema)

No new chrome region. No [properties] input on shells.
```

---

## RightSidebarComponent

| Item | Detail |
|---|---|
| Resolve | `resolveHostPropertiesSchema(node, injected adapter or null)` |
| General | Always first; view mode disables |
| Sections | Heading + fields (Q7=A) |
| Save | Coerce Q3=A; `setAtPath` on `node.data`; `patchNode` |
| Ignore Keys | Not shown |
| Flatten | Not used |
| Repeater built-in | Empty workflow/version options; keep existing ids (Q6=A) |
| Host schema on Repeater | Replaces configuration fields; connectors stay |

---

## provideWorkflowBuilderUi

| Item | Detail |
|---|---|
| `properties.schemaFor` | Sync; optional |
| Throw / non-object | Treated as no adapter schema (Q2=A) |

---

## Palette / factory

| Item | Detail |
|---|---|
| Overlay sanitize | Copy plain-object `propertiesSchema` (Q4=A) |
| Drop | `data.propertiesSchema`, `data.taskMeta` |

---

## User interaction

| Action | Result |
|---|---|
| Drop item with schema; edit field; Save | Value at `path` on `node.data` |
| Select Action with `taskMeta`, no schema | General only; blob not listed as fields |
| Select Condition, no host schema | Built-in condition field; edges still work |
| Unknown `ui_component` | Disabled text; panel does not crash |
| View mode | Form disabled |

---

## State

- Existing properties draft + `patchNode`.  
- No new global store.  
- No backend Properties API.

---

## API integration

**No Properties HTTP.** Catalog adapter tokens unchanged. UI-config JSON HTTP unchanged.
