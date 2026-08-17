# Business Logic Summary — U-LIM-01 Host logic extras + agent metadata

**Stories**: US-LIM-01, US-LIM-02, US-LIM-03

## Created

| Path | Change |
|---|---|
| `src/app/core/domain/icon-url.ts` | `sanitizeIconUrl` — https, `/`/`./` relative, raster data; reject javascript/http/file/`../`/SVG data |
| `src/app/core/domain/icon-url.spec.ts` | Accept/reject examples; P-LIM-01, P-LIM-02 |

## Modified

| Path | Change |
|---|---|
| `src/app/core/domain/palette.catalog.ts` | Optional `iconUrl`, `iconPath`, `metadata` on `PaletteItem` |
| `src/app/core/ui-config/ui-features.types.ts` | Same optional fields on `DefaultAgentCard` |
| `src/app/core/domain/palette-host.helpers.ts` | Copy extras + `taskMeta` (palettes); `featuredLogicItems` |
| `src/app/core/domain/palette-host.helpers.spec.ts` | Extras, featured first-of-type vs all |
| `src/app/core/domain/palette-host.helpers.pbt.spec.ts` | P-LIM-03, P-LIM-04, P-LIM-05 |
| `src/app/core/ui-config/merge-ui-features.ts` | JSON `defaultAgents` keep sanitized extras |
| `src/app/core/ui-config/merge-ui-features.spec.ts` | Extras + rejected URL |
| `src/app/core/data/enso-task-catalog.service.ts` | Omit static featured when sanitized host palettes length is greater than 0 |
| `src/app/core/data/enso-task-catalog.service.spec.ts` | Replace vs all-unknown keep static featured |
| `src/app/core/domain/node.factory.ts` | Shallow `data.metadata` on drop; copy sanitized `iconUrl` / `iconPath` |
| `src/app/core/domain/node.factory.spec.ts` | Metadata + `ensoTask` copy |

## Rules implemented

- Omit `[palettes]`: first Condition / Decision / Repeater (built-in three)
- `[palettes]="[]"`: empty-remote unchanged
- Non-empty sanitized overlay: drop static `FEATURED_PALETTE_TYPES`; strip lists remaining logic cards
- Lossy URL sanitize; plain-object shallow `metadata`; palettes keep `taskMeta`
