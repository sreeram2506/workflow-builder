# Component Methods — Host logic extras + agent metadata

High-level interfaces. Exact allowlist regex / error handling → Functional Design.

---

## icon-url.ts (new, Q1=A)

| API | Input | Output | Purpose |
|---|---|---|---|
| `sanitizeIconUrl` | `unknown` | `string \| undefined` | Allowlisted URL or undefined |

---

## palette-host.helpers (extend)

| API | Purpose |
|---|---|
| `sanitizeHostPaletteItems` | Keep `iconUrl` (if sanitized), `iconPath`, `metadata`, `taskMeta` |
| `sanitizeHostDefaultAgents` | Keep `iconUrl`, `iconPath`, `metadata` |
| `defaultAgentCardToPaletteItem` | Copy icon + metadata onto AIAgent item |
| `featuredLogicItems(items, hostPalettesPresent)` | Strip contents: first-of-type vs all remaining logic types |

---

## merge-ui-features / normalizeDefaultAgentCards

| API | Purpose |
|---|---|
| `normalizeDefaultAgentCards` | Persist optional `iconUrl`, `iconPath`, `metadata` on JSON cards |

---

## EnsoTaskCatalogService (extend)

| Method | Change |
|---|---|
| `composeSolution` / `composeSkills` | If host palettes overlay is present and non-empty after sanitize, do not include static `FEATURED_PALETTE_TYPES` rows |

`loadCatalog` overlay presence rules unchanged (U-HPI).

---

## LeftSidebarComponent (extend, Q3=A)

| API | Purpose |
|---|---|
| `logicShapeItems()` | `featuredLogicItems(allItems(), palettes() !== undefined && sanitized length &gt; 0)` — exact empty vs omit uses existing empty-remote UI |
| `iconUrl(item)` | Return sanitized URL or null |
| `iconPathD(item)` | Host `iconPath` if no URL |
| `onPaletteIconError` | Hide img; show type glyph |
| Template | Featured + default-agent + list rows |

Does not render metadata keys. Does not pass icons to canvas.

---

## node.factory (extend, Q4=A)

| API | Change |
|---|---|
| `createWorkflowNodeFromPaletteItem` | `data.metadata` shallow copy when `item.metadata` set; keep `ensoTask` |

---

## Docs

| Artifact | Purpose |
|---|---|
| `docs/workflow-builder-ui-embed.md` | Extra logic cards, replace rule, `iconUrl`/`iconPath`, `metadata` |
| try host (gitignored) | Optional samples |

---

## Notes

- Sanitize at host ingest so stored `PaletteItem.iconUrl` is already safe; sidebar still must not bind raw unsanitized strings.
- Broken image load is UI-only fallback (glyph), not a catalog reload.
