# Services — Host logic extras + agent metadata

---

## Service / module catalog

| ID | Name | Kind | Responsibility |
|---|---|---|---|
| S-LIM-URL | `icon-url.ts` | pure | URL allowlist |
| S-LIM-HOST | `palette-host.helpers` | pure | Sanitize extras; `featuredLogicItems` |
| S-LIM-JSON | `merge-ui-features` | pure | JSON defaultAgents extras |
| S-LIM-CAT | `EnsoTaskCatalogService` | injectable root | Omit static featured types when host palettes present |
| S-LIM-LEFT | `LeftSidebarComponent` | UI | Strip + icons |
| S-LIM-NODE | `node.factory` | pure | Drop metadata copy |
| S-LIM-DOCS | Embed / try | documentation | Examples |

No new Angular service (Q5=A).

---

## Orchestration

### Host extras ingest

```text
Parent [palettes] / [defaultAgents] or JSON defaultAgents
    -> sanitizeHost* / normalizeDefaultAgentCards
         -> sanitizeIconUrl on iconUrl
         -> keep iconPath string
         -> keep plain-object metadata / taskMeta
    -> catalog compose
         -> if host palettes present non-empty: static featured types omitted
         -> append remote host items + default agents
    -> left-sidebar
         -> featuredLogicItems(...)
         -> icon: url img else path else glyph
    -> drop
         -> createWorkflowNodeFromPaletteItem
         -> data.metadata + data.ensoTask
```

Text alternative: Host cards are sanitized (URL allowlist, object metadata). When parent palettes are present, compose drops the three built-in logic shapes and keeps host logic cards. The sidebar lists those in the featured strip and shows icons. Drop copies metadata onto the node.

### Featured strip

1. `[palettes]` omitted → static three (first of type), allow-list permitting  
2. `[palettes]="[]"` → empty-remote; strip hidden (existing)  
3. `[palettes]` items → host Condition / Decision / Repeater only (all of them)

### Icon precedence (library)

1. Sanitized `iconUrl`  
2. Non-empty `iconPath`  
3. Type glyph  
4. Img error → type glyph  

---

## Non-goals

- PaletteHostExtrasService
- wb-palette-icon component
- Properties metadata UI
