# Frontend Components — U-LIM-01 Host logic extras + agent metadata

---

## Hierarchy (library icons)

```text
wb-left-sidebar
  featured strip
    logic-shape-btn  @for featuredLogicItems
      img[iconUrl] | svg[iconPath] | type glyph
  default-agent strip
    node-icon  same icon rules
  solution / skills lists
    node-icon  same icon rules

wb-workflow-node
  logic shape frame + same host icon (or type glyph)
  agent avatar + same host icon (or initials)
```

Canvas `wb-workflow-node` uses the dropped card's `data.iconUrl` / `data.iconPath` (URL wins; img error falls back to path then type glyph). Logic nodes keep the Condition / Router / Repeater frame.

---

## LeftSidebarComponent

| Item | Detail |
|---|---|
| `logicShapeItems()` | `featuredLogicItems(allItems(), hostPalettesPresent)` |
| `hostPalettesPresent` | `palettes()` defined and sanitized length &gt; 0 (empty-remote still hides strip) |
| Icon | sanitized URL → `<img [src]>` with `(error)`; else `[attr.d]="iconPath"`; else type glyph |
| Failed set | `Set<string>` of item keys; glyph until URL input changes |
| Metadata | Not displayed |

---

## User interaction

| Action | Result |
|---|---|
| Drag/click featured extra Condition | Creates Condition node with that card's label, `data.metadata`, and the same icon |
| Img load error | Glyph for that key only |
| Omit palettes | Built-in three featured shapes |

---

## State

- Catalog `allItems` from existing `loadCatalog`.  
- Local `failedIconKeys` signal/set.  
- No new global store.

---

## API integration

No new HTTP. Icons are host-supplied URLs or paths. Enso still unused when `[palettes]` present (U-HPI).
