# Business Logic Model — U-LIM-01 Host logic extras + agent metadata

**Unit**: `u-lim-01-logic-icons-metadata`  
**Stories**: US-LIM-01..04  
**Locked FD**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A

Host `[palettes]` / `[defaultAgents]` overlay (U-HPI) still applies. This unit adds **extra logic cards**, **library icons**, and **metadata on drop**.

---

## Purpose

Let a parent supply more than one Condition / Router / Repeater with icons, replace the three built-in featured shapes when `[palettes]` is non-empty, and persist `metadata` / `taskMeta` onto dropped nodes.

---

## Core process

```text
1. Sanitize host palettes / defaultAgents / JSON defaultAgents
   - sanitizeIconUrl(iconUrl)
   - keep non-empty iconPath string (SVG d)
   - shallow-copy plain-object metadata / taskMeta
2. Catalog compose
   - host palettes omitted: static featured three + defaults + remote (today)
   - host palettes []: empty-remote (today)
   - host palettes length > 0 after sanitize: omit static FEATURED_PALETTE_TYPES; append host items
3. Sidebar featuredLogicItems(allItems, hostPalettesPresent)
   - false: first of type Condition, Decision, Repeater
   - true: every remaining item of those types, catalog order
4. Library icon: sanitized iconUrl img else iconPath else type glyph
   - img error: per-item key in failed set → glyph
5. Drop: createWorkflowNodeFromPaletteItem
   - data.paletteKey
   - data.metadata shallow copy if present
   - data.ensoTask from taskMeta if present
```

---

## Transformations

| Step | Input | Output |
|---|---|---|
| `sanitizeIconUrl` | unknown | allowed string or undefined (lossy) |
| Host sanitize | raw cards | canvas-safe PaletteItem / DefaultAgentCard |
| `featuredLogicItems` | catalog items + flag | strip list |
| Drop | PaletteItem | WorkflowNode.data extras |

---

## Testable Properties (PBT Partial)

| ID | Category | Property |
|---|---|---|
| P-LIM-01 | Invariant (PBT-03) | `sanitizeIconUrl` never returns a rejected scheme (`javascript:`, `http:`, `file:`, `//`, `../`, non-raster `data:`) |
| P-LIM-02 | Round-trip on accepted subset (PBT-02, lossy documented) | For generated accepted URLs (`https:`, `/…`, `./…`, raster `data:image/*`), `sanitizeIconUrl(s) === s` |
| P-LIM-03 | Invariant | `featuredLogicItems(items, false)` has at most one of each logic type, in Condition/Decision/Repeater order when present |
| P-LIM-04 | Invariant | `featuredLogicItems(items, true)` equals all logic-typed items in input order (static three already absent from input) |
| P-LIM-05 | Invariant | Non-object `metadata` omitted; plain object shallow-copied |

Sanitize of arbitrary strings has **no inverse** (PBT-02 N/A for the full domain). Generators: URL strings, relative paths, data URIs, metadata objects vs arrays (PBT-07). `fc.assert` + seed (PBT-08). fast-check (PBT-09).

---

## Persistence

Workflow document: `node.data.metadata` and existing `node.data.ensoTask`. Icons are not stored on the canvas node this increment.
