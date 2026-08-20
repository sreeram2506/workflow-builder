# Domain Entities — U-DP-01 Dynamic Properties

---

## PropertiesMap

| Field | Type | Notes |
|---|---|---|
| (entries) | `Record<string, unknown>` | Stored at `node.data.properties` |

## DynamicControlKind

`'text' | 'number' | 'boolean' | 'readonlyJson'`

## Relationships

```text
WorkflowNode.data
  ├── propertiesSchema?     (metadata — U-HP-01)
  ├── properties?           (values — this unit)
  ├── condition / repeater… (logic built-ins — node.data paths)
  └── taskMeta? / …         (opaque — unchanged)

HostPropertiesSchema.field.path  →  path under properties map
PropertiesPanelFeatures.addProperty  →  chrome gate for Add UX
```

## No new persisted aggregate

Same in-memory workflow document; no new store.
