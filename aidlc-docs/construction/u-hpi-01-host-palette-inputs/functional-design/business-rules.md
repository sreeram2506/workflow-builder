# Business Rules — U-HPI-01 Host palette inputs

U-PAL-02 catalog rules still apply when `[palettes]` is omitted.

---

## BR-HPI-01 — Omit vs present (Q8=A, NFR-HPI-01)

`input<T[] | undefined>()` has **no default**.

- Unbound → `undefined` → omit overlay keys → U-PAL-02 catalog (Enso or provider adapter).
- Bound `[]` → present empty.
- Bound items → present items.

Do not treat `[]` as omit.

## BR-HPI-02 — Overlay keys (Q2=A)

Sidebar sets `hostPalettes` on `CatalogLoadOptions` only when `palettes() !== undefined`. Sets `hostDefaultAgents` only when solution `defaultAgents() !== undefined`. Catalog treats a **defined key** as present, including `[]`.

## BR-HPI-03 — Present palettes win (Q1=A, FR-HPI-02)

If `hostPalettes` is present, Enso HTTP MUST NOT run and the provider catalog adapter MUST NOT run for that load.

## BR-HPI-04 — Compose when host items present (Q1=A)

Successful remote list (not empty-remote). Compose allow-listed featured types + `resolveDefaultAgents` + sanitized host rows. Featured Condition / Decision (Router) / Repeater and default agents remain.

## BR-HPI-05 — Host `[]` is empty-remote (Q7=A)

`hostPalettes: []` → EMPTY path (`emptyRemote: true`, `items: []`, `error: null`). Host `defaultAgents` are **not** shown for that load.

## BR-HPI-06 — All rows dropped (Q3=A)

If the parent bound a **non-empty** array and sanitize leaves zero rows: still **not** empty-remote. Show featured + default agents (allow-listed). No parent cards. No error banner.

## BR-HPI-07 — Sanitize palettes (Q6=A, FR-HPI-05)

Skip a row if it is not an object, `key` / `type` / `label` is missing or not a non-empty string, or `type` is not in `ALLOWED_NODE_TYPES`. Remaining valid rows still compose. No banner. Do not log tokens.

Missing `categoryId` MAY default to a canvas category (`agents` on solution, `flow` on skills). Do not invent a new `NodeType`.

## BR-HPI-08 — Host defaultAgents (Q1/Q7, FR-HPI-04)

If `hostDefaultAgents` is present (including `[]`) **and** the load is not EMPTY: use `{ mode: 'present', cards }` in `resolveDefaultAgents`; ignore JSON/provider `palette.solution.defaultAgents`. If omitted, U-PAL-01 merge applies. AIAgent allow-list still hides default agents.

Skip invalid default-agent cards (missing `key` / `label`).

## BR-HPI-09 — source (Q5=A)

Present `[palettes]` (including `[]`) → `source: 'host'`. Omit keeps `enso` / `adapter` / `static` / `empty`.

## BR-HPI-10 — Reload (Q4=A)

Reload catalog when overlay inputs change and when `features().palette` changes.

## BR-HPI-11 — Allow-list still applies

Sanitized host rows still pass `filterPaletteItemsByAllowList` for the canvas.

## BR-HPI-12 — Docs (US-HPI-06, NFR-HPI-02)

`docs/workflow-builder-ui-embed.md` shows `wb-shell-layout` with `[palettes]` and `[defaultAgents]`; omit vs `[]` vs items; input wins over catalog provider; known `NodeType` only; no access tokens.

## BR-HPI-13 — Skills

`wb-agent-skills-shell` has `[palettes]` only. No skills `[defaultAgents]` input.
