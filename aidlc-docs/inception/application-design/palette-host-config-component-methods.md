# Component Methods — Palette / catalog host config (v1)

High-level interfaces only. Omit-vs-`[]` merge edge cases and exact `AllowListState` → Functional Design.

---

## UiConfigService (extend)

| Method / API | Input | Output | Purpose |
|---|---|---|---|
| `features()` | — | `Signal<UiFeatures>` | Resolved tree **including** `palette` |
| `is(path)` | existing `UiFeaturePath` | `boolean` | Chrome paths unchanged; palette arrays are **not** boolean `is()` keys |
| `loadStatus()` | — | `Signal<UiConfigLoadStatus>` | Unchanged JSON status |

Palette reads: `features().palette.solution` / `.agent` (nested object). No new string-path union required for arrays in v1.

---

## provideWorkflowBuilderUi (extend)

| API | Input | Output | Purpose |
|---|---|---|---|
| `provideWorkflowBuilderUi(options)` | `{ features?: UiFeaturesPartial; catalog?: { solution?: Adapter; agent?: Adapter } }` | `EnvironmentProviders` | Features token as today; optional catalog tokens (Q2=C) |

Omit `catalog` ⇒ Enso default. Tests MAY provide catalog tokens without the helper.

---

## merge-ui-features (extend)

| Function | Input | Output | Purpose |
|---|---|---|---|
| `mergeUiFeatures` / `resolveUiFeatures` | defaults + JSON + provider | `UiFeatures` | Chrome merge unchanged; palette uses **presence** semantics |
| `normalizePartial` | unknown JSON | partial or error | Accept `palette.*` arrays/objects; reject secrets patterns |

**Presence (FR-PAL-02/03)**: omitted key ≠ `[]`. Provider overlay wins for the same key. Details in FD; PBT in U-PAL-01.

---

## Pure helpers (Q3=A, Q5=A)

| Function | Input | Output | Purpose |
|---|---|---|---|
| `filterPaletteItemsByAllowList` | items + allow-list state | `PaletteItem[]` | If list present, keep `item.type` in list only; `[]` ⇒ empty; omitted ⇒ all |
| `resolveDefaultAgents` | `defaultAgents` state + whether `AIAgent` allowed | `PaletteItem[]` | Omitted ⇒ Blank Agent (if allowed); `[]` ⇒ none; present ⇒ replace Blank Agent; no `AIAgent` in allow-list ⇒ none |

PBT invariants: NFR-PAL-04 (filter), NFR-PAL-05 (defaultAgents merge/defaulting).

---

## WorkflowBuilderCatalogAdapter

| Method | Input | Output | Purpose |
|---|---|---|---|
| `load(options)` | `CatalogLoadOptions` (mode, etc.) | Observable (or Promise mapped by catalog) of remote **rows** | Replace Enso HTTP for that canvas; host may call extra APIs inside |

Adapter returns palette rows (`key`, `type`, `label`, `description`, `categoryId`, optional `taskId`/`taskMeta`). Catalog service **composes** static defaults + adapter rows, then filters.

---

## EnsoTaskCatalogService (extend)

| Method | Change |
|---|---|
| `loadCatalog(options)` | Choose host adapter token vs Enso by `mode`; compose static + remote; apply allow-list + `resolveDefaultAgents`; **never** append `MOCK_SOLUTION_AGENTS` |
| Enso HTTP methods | Default adapter only when matching token omitted |
| Failure / empty remote | Static filtered defaults + `error` string; `source: 'static'`; canvas not blocked |

Sidebar continues to inject this service (no new catalog facade required in v1).

---

## LeftSidebarComponent (extend)

| Contract | Purpose |
|---|---|
| Featured strip from `allItems()` | Condition / Decision / Repeater **in filtered catalog only** (drop “always from full catalog”) |
| `defaultAgentItems()` (or equivalent) | 0..N `AIAgent` static default cards; **no** `blankAgentPaletteItem()` fallback that restores a hidden Blank Agent |
| Category lists | Remaining non-featured items from filtered catalog |
| Text search | Existing `filterPaletteItems` query filter only |

Chrome `@if (ui.is('agentsLibrary.enabled'))` / `skillsLibrary.enabled` stays on the parent shells.

---

## Docs

| Artifact | Purpose |
|---|---|
| `docs/workflow-builder-ui-embed.md` | Allow-lists, `defaultAgents`, `catalog` on `provideWorkflowBuilderUi` |
| `docs/workflow-builder-ui-config-try.md` | How to try JSON samples |
| Example JSON under `src/assets/examples/` | Allow-list + `defaultAgents` samples; **no** secrets; **no** adapter functions |

---

## Notes

- `node.factory` / `WorkflowFacade` keep creating nodes from `PaletteItem` (`paletteKey` already exists). New default-agent keys are host `key` values with `type: AIAgent`.
- Adapter logging MUST NOT include tokens (NFR-PAL-03).
