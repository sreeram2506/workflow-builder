# Business Rules — U-PAL-02 Catalog wiring + docs

U-PAL-01 palette rules still apply. This file adds catalog/UI rules.

---

## BR-PAL-20 — Adapter vs Enso (Q2=A)

If the matching catalog token is provided, Enso HTTP MUST NOT run for that canvas. Otherwise use current Enso URLs (`pipeline/list` solution, `task/list` skills).

## BR-PAL-21 — Adapter output (Q1=A)

Adapter returns remote rows only. Catalog composes static defaults, filters, sets `error` / `emptyRemote` / `source`.

Invalid adapter payload (not an object, `items` not an array) → ERROR path.

## BR-PAL-22 — Empty remote (Q3b=C)

When the adapter/Enso call **succeeds** and remote `items.length === 0`:

- Do **not** treat as ERROR (no `catalogError` banner).
- Emit empty `items` / `categories`.
- Library body is **empty-state only** (no featured, no defaultAgents, no lists).
- Canvas remains usable.
- Chrome `agentsLibrary` / `skillsLibrary` still controls whether the panel mounts.

This **refines** FR-PAL-05 for the success-empty case. FR-PAL-05 failure (throw/HTTP) remains BR-PAL-23.

## BR-PAL-23 — Failure (Q9=A, US-PAL-06)

Throw, Observable error, HTTP error, missing auth, or invalid shape:

- Static filtered defaults only (solution: featured + `resolveDefaultAgents`; skills: filtered `PALETTE_ITEMS`).
- Non-blocking `catalogError` banner.
- **No** `MOCK_SOLUTION_AGENTS`.
- Do not log Authorization headers or access tokens.

## BR-PAL-24 — Banner copy (Q4=A)

Reuse existing `catalogError` element. Messages MUST NOT say “mock agents”. Missing-auth / HTTP failure wording: “Showing built-in types only” (or equivalent).

## BR-PAL-25 — Default-agent origin (Q5=A)

Catalog tags rows from `resolveDefaultAgents` with `origin: 'default-agent'`. Sidebar renders those in the default-agent strip. Other `AIAgent` rows (adapter/Enso) stay in the agents list. **No** `blankAgentPaletteItem()` fallback when the item is absent.

## BR-PAL-26 — Featured strip (Q6=A)

Condition / Decision / Repeater appear only if present in filtered `allItems()`, in that order. Hide a type when disallowed; do not hide the whole strip unless none remain.

On EMPTY path the strip is hidden because `allItems` is empty.

## BR-PAL-27 — No mocks (Q7=A)

Remove mock compose. Delete `mock-agents.catalog.ts` if unused.

## BR-PAL-28 — Reload (Q8=B)

When `features().palette` changes (including JSON focus reload), reload catalog for the mounted sidebar.

## BR-PAL-29 — Default-agent DnD (Q11=A)

One CDK drop list for the default-agent strip (same pattern as featured). Each card is a drag source. `data-testid` stable: `default-agent-card-{key}`.

## BR-PAL-30 — Docs (Q10=A)

Embed/try docs describe allow-lists, `defaultAgents`, and provider-only `catalog`. Example JSON under `src/assets/examples/`. Active `wb-ui-config.json` remains `{}`. No secrets.

## BR-PAL-31 — Allow-list still applies on ERROR path

ERROR-path static items MUST still pass `filterPaletteItemsByAllowList`. EMPTY path does not apply static items (BR-PAL-22).
