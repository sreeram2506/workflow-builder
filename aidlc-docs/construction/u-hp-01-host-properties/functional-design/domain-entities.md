# Domain Entities — U-HP-01 Generic host-driven Properties

No new canvas node types. New host-facing schema types. Ignore Keys / flatten DTOs leave the host contract.

---

## New entities

### HostPropertiesSchema

```text
{
  sections: HostPropertiesSection[]
}
```

### HostPropertiesSection

```text
{
  id?: string
  title?: string
  fields: HostPropertiesField[]
}
```

### HostPropertiesField

```text
{
  type: text | number | boolean | select | multiselect | textarea
  path: string
  label: string
  required?: boolean
  hidden?: boolean
  options?: { value: string, label: string }[] | string[]
  placeholder?: string
  ui_component?: string
}
```

### WorkflowBuilderPropertiesAdapter

```text
{
  schemaFor(node: WorkflowNode): HostPropertiesSchema | null
}
```

Sync. Optional on `provideWorkflowBuilderUi({ properties })`.

---

## Changed entities

| Entity | Change |
|---|---|
| `PaletteItem` | Optional `propertiesSchema` |
| `node.data` | Optional `propertiesSchema`, `taskMeta`; factory no longer writes `ensoTask` |
| `XpmsFieldDescriptor` / Ignore Keys | Not host-facing; non-logic types have no mock boolean |
| `collectEnsoTaskFields` flatten DTO | **Delete** as a form source |

---

## Presence (Q1=A)

`propertiesSchema` wins when the value is a non-null plain object and not an array. `{}` wins (empty Configuration after sanitize).

---

## Relationships

```text
PaletteItem.propertiesSchema
    -> node.data.propertiesSchema (drop)
PaletteItem.taskMeta
    -> node.data.taskMeta (opaque)

node.data.propertiesSchema (plain object)
    -> sanitize -> sidebar Configuration (wins)

else adapter.schemaFor
    -> schema or skip on throw/non-object

else logic type
    -> built-in HostPropertiesSchema

else
    -> General only
```

Text alternative: Schema on the palette copies to the node and wins in Properties. Otherwise the adapter, then logic built-ins, then General only. Blobs stay opaque.

---

## Out of scope entities

- Live widget registry  
- Instance `[properties]` input  
- Migration of leftover `ensoTask`  
- PlatformApi / skillconfig types
