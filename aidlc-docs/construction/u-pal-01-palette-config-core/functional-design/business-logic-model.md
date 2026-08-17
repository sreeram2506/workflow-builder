# Business Logic Model — U-PAL-01 Palette config core

**Unit**: `u-pal-01-palette-config-core`  
**Stories**: US-PAL-01, US-PAL-02, US-PAL-03, US-PAL-04  
**Locked FD**: Q1=B · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A · Q10=A · Q11=A

---

## Purpose

Extend resolved `UiFeatures` with `palette` (per-canvas allow-lists + solution `defaultAgents`) and expose **pure** helpers so U-PAL-02 can filter catalog rows and replace Blank Agent. No sidebar UI in this unit.

---

## Core process: resolve palette config

Chrome boolean merge from U-UI-01 is unchanged. Palette uses **presence** semantics (Q5=A).

```text
1. createDefaultUiFeatures()
   palette.solution.types = { mode: 'all' }
   palette.agent.types    = { mode: 'all' }
   palette.solution.defaultAgents = { mode: 'omitted' }

2. APP_INITIALIZER JSON (existing)
   normalizePartial(raw) now also reads palette
   - missing/invalid file: same BR as U-UI-01; palette stays defaults
   - bad palette shape: omit that key/group (Q7=A); do not invalidate file

3. Provider partial merge (wins)
   If a layer includes `types` or `defaultAgents`, the whole array/state replaces the lower layer.

4. Publish features().palette for U-PAL-02
```

---

## Transformations

| Step | Input | Output |
|---|---|---|
| `normalizePartial` (extend) | unknown JSON | chrome partial + optional `palette.solution.types` / `defaultAgents` / `palette.agent.types` as **raw arrays** when keys present |
| `toAllowListState` | omitted vs `string[]` | `{ mode: 'all' }` or `{ mode: 'only', types: NodeType[] }` after dropping unknown keys (Q2=A, Q11=A) |
| `normalizeDefaultAgents` | omitted vs array | `{ mode: 'omitted' }` or `{ mode: 'present', cards }` (invalid cards skipped; dup keys last-wins) |
| `mergeUiFeatures` (extend) | full + partial | palette groups: omitted overlay key keeps base; present key **replaces** |
| `filterPaletteItemsByAllowList` | items + `AllowListState` | items whose `type` is allowed |
| `resolveDefaultAgents` | `DefaultAgentsState` + `aiAgentAllowed` | `PaletteItem[]` (`type: AIAgent`) |
| `applySolutionDefaultAgents` | filtered items + resolved defaults | drop static `AIAgent` rows; append resolved defaults (Q9=A) |

Helpers take **explicit args** (Q6=A). They must not inject `UiConfigService`.

---

## Allow-list algorithm

1. If `mode === 'all'` → return a shallow copy of input items (order preserved).
2. If `mode === 'only'` → keep items whose `type` is in `types` (Set lookup). Empty `types` → empty output.
3. Do not add items. Do not change labels.

`aiAgentAllowed` = allow-list `mode === 'all'` **or** (`mode === 'only'` and `types` includes `'AIAgent'`).

---

## defaultAgents algorithm

| State | `aiAgentAllowed` | Output |
|---|---|---|
| omitted | true | one built-in Blank Agent `PaletteItem` |
| omitted | false | `[]` |
| present (any length, including `[]`) | true | mapped cards only (no Blank Agent) |
| present | false | `[]` |

Card → item: `key` = card.key, `type` = `AIAgent`, `label` = card.label, `description` = card.description, `categoryId` = `logic`.

---

## Persistence

- Same JSON file as chrome: `src/assets/wb-ui-config.json`.
- Serializable only: `types` arrays and `defaultAgents` objects. No adapter functions. No tokens (NFR-PAL-02).

---

## Out of scope (this unit)

- Catalog adapter tokens, Enso HTTP, mock-agent removal, `LeftSidebarComponent`, embed docs.

---

## Testable Properties (PBT-01)

| Component | Category | Property |
|---|---|---|
| `filterPaletteItemsByAllowList` | Invariant (PBT-03) | If `mode === 'only'`, every output item’s `type` is in `types` |
| `filterPaletteItemsByAllowList` | Invariant | Output is a subsequence of input (no new keys; order preserved) |
| `filterPaletteItemsByAllowList` | Idempotence (advisory PBT-04) | `filter(filter(items, s), s) = filter(items, s)` |
| `filterPaletteItemsByAllowList` | Easy verification | `mode === 'all'` ⇒ output length equals input length |
| `normalizeDefaultAgents` / merge | Invariant (PBT-03) | Omitted overlay leaves base; present array replaces (including `[]` ≠ omitted) |
| `resolveDefaultAgents` | Invariant | Every output item has `type === 'AIAgent'` |
| `resolveDefaultAgents` | Invariant | If `aiAgentAllowed === false`, output is `[]` |
| `resolveDefaultAgents` | Invariant | Present `[]` + allowed ⇒ `[]` (not Blank Agent) |
| `toAllowListState` | Lossy parse (PBT-02) | Unknown keys / `"Router"` dropped; **not** a round-trip. Documented lossy. |
| `UiConfigService` | No PBT properties | Signal holder only; merge/helpers covered above |

**Generators (PBT-07)**: `NodeType` union; `AllowListState`; `PaletteItem[]` from known catalog keys; `DefaultAgentCard` with optional invalid/duplicate keys.

**Shrinking (PBT-08)**: fast-check default shrink on arrays/records.

**PBT-02**: No lossless serialize↔parse for allow-lists (unknown strings dropped). Round-trip N/A; lossy documented.

**PBT-05 oracle**: N/A — no separate reference implementation.

**PBT-06 stateful**: N/A — helpers are pure; service is not a command-sequence store in this unit.
