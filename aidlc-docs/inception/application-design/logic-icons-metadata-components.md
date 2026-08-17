# Components — Host logic extras + agent metadata

**Additive to** host palette inputs (U-HPI) and catalog compose.  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Unit**: U-LIM-01 (sanitizers + strip/icons + drop + docs)

---

## Component catalog (new / extended)

| ID | Name | Layer | Role |
|---|---|---|---|
| C-LIM-TYPES | `PaletteItem` / `DefaultAgentCard` | core/domain + ui-config | Optional `iconUrl`, `iconPath`, `metadata`; palettes keep `taskMeta` |
| C-LIM-URL | `icon-url.ts` | core/domain | Pure `sanitizeIconUrl`; allowlist; reject unsafe schemes |
| C-LIM-HOST | `palette-host.helpers` | core/domain | Sanitize host palettes/defaultAgents; keep extras; `featuredLogicItems` |
| C-LIM-JSON | `normalizeDefaultAgentCards` | core/ui-config | Same optional fields on JSON defaultAgents |
| C-LIM-LEFT | `LeftSidebarComponent` | features/shell | Featured strip via helper; library icons; img error → glyph |
| C-LIM-NODE | `createWorkflowNodeFromPaletteItem` | core/domain | `data.metadata` shallow copy; existing `ensoTask` |
| C-LIM-CAT | `EnsoTaskCatalogService` | core/data | When host palettes present (non-empty), omit static featured types from compose |
| C-LIM-DOCS | Embed markdown + try host | docs / try | Examples; no secrets |

No new Angular injectable (Q5=A). No `wb-palette-icon` child (Q3=A).

---

## Responsibilities

### C-LIM-TYPES

- `PaletteItem`: optional `iconUrl`, `iconPath`, `metadata`; keep `taskMeta`.
- `DefaultAgentCard`: optional `iconUrl`, `iconPath`, `metadata`.
- Mapping `defaultAgentCardToPaletteItem` copies those fields onto the AIAgent palette row.

### C-LIM-URL (Q1=A)

- `sanitizeIconUrl(raw: unknown): string | undefined`
- Accept: `https:`, same-origin relative (`/` or `./` without scheme), raster `data:image/png|jpeg|jpg|gif|webp`
- Reject: `javascript:`, `http:`, `file:`, empty, other schemes, `data:image/svg+xml`, non-image `data:`
- Return undefined when rejected (caller treats as absent)

### C-LIM-HOST (Q2=A)

- `sanitizeHostPaletteItems` / `sanitizeHostDefaultAgents`: keep valid icon fields (URL only if sanitize succeeds; keep `iconPath` if non-empty string) and plain-object `metadata`; palettes also copy plain-object `taskMeta`.
- `featuredLogicItems(allItems, hostPalettesPresent)`:
  - omitted host palettes: today’s first-of-type Condition, Decision, Repeater
  - present (non-empty): every remaining item whose type is those three, catalog order (static three already omitted from compose)

### C-LIM-CAT

- When `hostPalettes` is defined and sanitized length &gt; 0: compose static list **without** `FEATURED_PALETTE_TYPES` (keep default-agent / Blank Agent path as today). Remote host items still appended.
- Omit / `[]` compose unchanged (empty-remote still hides featured).

### C-LIM-LEFT (Q3=A)

- `logicShapeItems()` delegates to `featuredLogicItems`.
- Icon: sanitized `iconUrl` → `<img>`; else `iconPath` SVG; else type glyph. `(error)` → glyph.
- Featured, default-agent, and list rows. Canvas / Properties unchanged.

### C-LIM-NODE (Q4=A)

- If `item.metadata` present, `data.metadata = { ...item.metadata }`.
- Keep `data.ensoTask` from `taskMeta`.

### C-LIM-DOCS

- Embed: extra logic cards, replace rule, icon fields, metadata; known types; no tokens.
- Try host (gitignored) may demo extras.

---

## Out of scope

- Canvas / Properties host icons
- Properties metadata editor
- New injectable / `wb-palette-icon`
- `http:` icon URLs
- Unknown node types (e.g. Stream)
