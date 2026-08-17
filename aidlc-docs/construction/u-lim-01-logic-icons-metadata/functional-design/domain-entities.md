# Domain Entities — U-LIM-01 Host logic extras + agent metadata

Extends existing `PaletteItem`, `DefaultAgentCard`, `WorkflowNode.data`. No new workflow node types.

---

## Extended entities

| Entity | Change |
|---|---|
| `PaletteItem` | Optional `iconUrl?: string`, `iconPath?: string`, `metadata?: Record<string, unknown>`; keep `taskMeta` |
| `DefaultAgentCard` | Optional `iconUrl`, `iconPath`, `metadata` |
| `WorkflowNode.data` | Optional `metadata` (shallow copy); existing `paletteKey`, `ensoTask` |
| `sanitizeIconUrl` | Pure function; not an entity |

---

## Field rules

| Field | Valid | Stored |
|---|---|---|
| `iconUrl` | `sanitizeIconUrl` success | Sanitized string |
| `iconPath` | non-empty string | As-is (SVG `d`) |
| `metadata` | plain object | Shallow copy |
| `taskMeta` | plain object | Shallow copy (palettes only) |

---

## Relationships

```text
Host / JSON card
    -> sanitize (icon-url + extras)
    -> PaletteItem / DefaultAgentCard
    -> catalog compose (maybe omit static featured)
    -> featuredLogicItems
    -> left-sidebar (img / path / glyph)
    -> createWorkflowNodeFromPaletteItem
    -> node.data.metadata / ensoTask
```

Text alternative: Sanitized host cards become palette items. Compose may drop built-in featured types. The sidebar shows icons. Drop copies metadata onto the node.

---

## Out of scope entities

- Canvas icon fields  
- Properties metadata schema  
- New NodeType values  
