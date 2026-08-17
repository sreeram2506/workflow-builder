# Frontend Components — U-PAL-01 Palette config core

U-PAL-01 has **no library UI** (Q8=A). This doc covers config/helper surfaces only. `LeftSidebarComponent` stays U-PAL-02.

---

## Component / surface inventory

| ID | Name | Kind | Responsibility |
|---|---|---|---|
| F-PAL-TYPES | `UiFeatures.palette` | Domain types | Resolved allow-lists + `defaultAgents` |
| F-PAL-MERGE | `merge-ui-features` / `normalizePartial` | Pure | Presence merge for palette keys |
| F-PAL-FILTER | `filterPaletteItemsByAllowList` | Pure | Allow-list filter |
| F-PAL-DEF | `resolveDefaultAgents` | Pure | Blank Agent vs host cards |
| F-PAL-APPLY | `applySolutionDefaultAgents` | Pure | Replace static AIAgent rows with resolved defaults |
| F-PAL-SVC | `UiConfigService` | Injectable | Expose `features().palette` (existing signals) |

Suggested helper file: `src/app/core/domain/palette-host.helpers.ts` (or sibling of `palette.catalog.ts`).

---

## State

| State | Owner | Consumers (this unit) |
|---|---|---|
| `features().palette` | UiConfigService | Unit tests; U-PAL-02 catalog |
| Helper outputs | Pure functions | Tests; U-PAL-02 |

**Not in U-PAL-01**: featured strip, 0..N card layout, catalog error banner.

---

## User interactions

None.

---

## API / integration

| Call | When | On failure |
|---|---|---|
| `GET /assets/wb-ui-config.json` | Existing initializer | Unchanged U-UI-01 soft-fail; palette defaults if file missing/invalid |
| `provideWorkflowBuilderUi({ features: { palette: … } })` | Host bootstrap | Palette overlay wins; `catalog` option **not** in this unit |

JSON example (no secrets):

```json
{
  "palette": {
    "solution": {
      "types": ["Condition", "Decision", "AIAgent"],
      "defaultAgents": [
        { "key": "claims", "label": "Claims Agent", "description": "Triage claims" }
      ]
    },
    "agent": {
      "types": ["Action", "Condition"]
    }
  }
}
```

---

## Test surfaces

- Pure: normalize palette partial; merge omit vs `[]` vs present; filter invariant; `resolveDefaultAgents` table + PBT
- Service: `features().palette` after JSON + provider
- PBT: see business-logic-model Testable Properties (Q10=A)
