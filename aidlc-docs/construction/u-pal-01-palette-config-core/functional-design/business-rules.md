# Business Rules — U-PAL-01 Palette config core

Chrome rules from U-UI-01 (BR-01..11) still apply. This file adds palette rules.

---

## BR-PAL-01 — Default show-all / Blank Agent

Resolved defaults:

- `palette.solution.types` = `{ mode: 'all' }`
- `palette.agent.types` = `{ mode: 'all' }`
- `palette.solution.defaultAgents` = `{ mode: 'omitted' }` (Blank Agent when `AIAgent` allowed)

Omitted JSON/provider keys MUST NOT become `[]`.

## BR-PAL-02 — Merge precedence (Q5=A)

Order remains **defaults → JSON → provider**.

For `types` and `defaultAgents`: if the key is **present** on a layer (after normalize), the **entire** state **replaces** the lower layer. No concat, no element-wise union. If the key is omitted on a layer, keep the lower-layer value.

Provider still wins when it sets the same key.

## BR-PAL-03 — Known type keys only (Q2=A, Q11=A)

Allow-list entries that are not exact `NodeType` strings are **dropped**. Do not invalidate the file.

Valid keys: `Trigger`, `Action`, `Condition`, `Delay`, `End`, `Decision`, `Repeater`, `Notification`, `AIAgent`.

`"Router"` is **not** a type key (UI label only). It is dropped.

Case-sensitive: `"decision"` is unknown.

## BR-PAL-04 — Allow-list modes (Q1=B)

| JSON/provider `types` | Resolved |
|---|---|
| Key omitted | `{ mode: 'all' }` (or keep lower layer) |
| `[]` | `{ mode: 'only', types: [] }` |
| `["Condition", …]` | `{ mode: 'only', types: filtered known }` |

`filterPaletteItemsByAllowList`: `all` → pass through; `only` → keep matching `item.type`; empty `types` → no items.

## BR-PAL-05 — Independent canvases

`palette.solution.types` does not affect skills; `palette.agent.types` does not affect solution. No `defaultAgents` on agent/skills in v1.

## BR-PAL-06 — defaultAgents cards (Q3=A, Q4=A)

A card is valid when `key` and `label` are non-empty strings after trim. `description` missing or non-string → `''`. Extra fields ignored.

Invalid cards are **skipped**. If the key `defaultAgents` was present as an array and every card is skipped → `{ mode: 'present', cards: [] }` (not omitted).

Duplicate `key`: **last** valid card wins; result list is unique by `key`, stable order of first appearance of the winning card’s position (last occurrence kept, earlier duplicates removed).

## BR-PAL-07 — Blank Agent vs host cards (Q9=A)

- Omitted `defaultAgents` + `AIAgent` allowed → built-in Blank Agent item.
- Present `defaultAgents` (including `[]`) → **no** Blank Agent; only mapped cards (if allowed).
- `types` omitted (`mode: 'all'`) + present `defaultAgents` → all current solution types remain; Blank Agent **replaced** by those cards (`applySolutionDefaultAgents`).
- If allow-list `mode === 'only'` and `'AIAgent'` is absent → `resolveDefaultAgents` returns `[]` even if cards exist.

## BR-PAL-08 — Malformed palette (Q7=A)

If `palette`, `palette.solution`, or `palette.agent` is not a plain object, ignore that group.

If `types` or `defaultAgents` is present but not an array, treat that key as **omitted**.

Do **not** mark the whole JSON `invalid` solely for palette shape errors.

## BR-PAL-09 — No secrets

Palette JSON MUST NOT contain access tokens, cookies, or Authorization values (NFR-PAL-02). Same as chrome: no secret scanner beyond not accepting non-config fields into the model.

## BR-PAL-10 — Helpers are pure (Q6=A)

`filterPaletteItemsByAllowList`, `resolveDefaultAgents`, `applySolutionDefaultAgents` have no DI, no HTTP, no logging of tokens.

## BR-PAL-11 — PBT invariants (Q10=A)

1. `mode === 'only'` ⇒ ∀ item in output, `item.type ∈ types`.
2. Filter never introduces items that were not in the input.
3. Omitted `defaultAgents` ≠ present `[]`.
4. `aiAgentAllowed === false` ⇒ no default-agent items.
5. Provider present array replaces JSON array for the same key.
