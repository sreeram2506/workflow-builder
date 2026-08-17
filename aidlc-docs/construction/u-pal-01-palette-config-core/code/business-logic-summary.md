# Business Logic Summary — U-PAL-01

## Created

| Path | Role |
|---|---|
| `src/app/core/domain/palette-host.helpers.ts` | `filterPaletteItemsByAllowList`, `resolveDefaultAgents`, `applySolutionDefaultAgents`, `aiAgentAllowed` |
| `src/app/core/domain/palette-host.helpers.spec.ts` | Table-driven BR-PAL-04..07 |
| `src/app/core/domain/palette-host.helpers.pbt.spec.ts` | fast-check filter + defaultAgents invariants |

## Modified

| Path | Change |
|---|---|
| `src/app/core/ui-config/ui-features.types.ts` | `AllowListState`, `DefaultAgentsState`, `UiFeatures.palette` |
| `src/app/core/ui-config/merge-ui-features.ts` | Palette defaults; presence merge; drop unknown types / `"Router"` |
| `src/app/core/ui-config/merge-ui-features.spec.ts` | omit vs `[]` vs present; provider wins; malformed ignored |
| `src/app/core/ui-config/merge-ui-features.pbt.spec.ts` | Palette omit/replace properties |

## Rules implemented

- Defaults: solution/agent `mode: 'all'`; `defaultAgents` omitted
- Present array replaces lower layer; omitted ≠ `[]`
- Unknown type keys and `"Router"` dropped
- Invalid defaultAgents cards skipped; duplicate keys last-wins
- `AIAgent` missing from allow-list ⇒ no default-agent items
