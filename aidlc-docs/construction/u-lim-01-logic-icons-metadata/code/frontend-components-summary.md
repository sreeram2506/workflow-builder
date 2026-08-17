# Frontend Components Summary — U-LIM-01 Host logic extras + agent metadata

**Stories**: US-LIM-01, US-LIM-02, US-LIM-04

## Modified

| Path | Change |
|---|---|
| `src/app/features/shell/left-sidebar.component.ts` | `featuredLogicItems`; host present = sanitized palettes length greater than 0; URL / path / type glyph; img error per key; metadata not shown |
| `src/app/features/shell/left-sidebar.palette.spec.ts` | Extra Conditions; img; iconPath; img error glyph; metadata hidden |
| `src/app/features/canvas/workflow-node.component.ts` | Host `iconUrl` / `iconPath` from `node.data`; same precedence and img fallback |
| `src/app/features/canvas/workflow-node.component.spec.ts` | Extra If path, URL, img error |
| `docs/workflow-builder-ui-embed.md` | Extra logic cards, featured replace, `iconUrl` / `iconPath`, `metadata` on drop, canvas same icon |
| `src/app/try/try-ui-host.component.ts` | Extra Condition, sample icons/metadata (gitignored; route not committed) |

## Created

| Path | Role |
|---|---|
| `src/app/features/canvas/workflow-node.component.spec.ts` | Canvas host icon rendering |

## Behavior

- Library: featured, default-agent, and list rows
- Canvas: same `iconUrl` / `iconPath` after drop (logic frame kept)
- URL wins, then `iconPath`, then type glyph
- Per-item img error falls back until catalog reload (library) or until URL changes (canvas)
