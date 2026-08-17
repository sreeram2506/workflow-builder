# Business Rules — U-UI-01 Config Core

---

## BR-01 — Default show-all

Every known boolean leaf defaults to `true` when unspecified at any layer (US-UI-07).

## BR-02 — Merge precedence

Order: **defaults → JSON partial → provider partial**. Later layer wins per leaf. Deep-merge; objects merge recursively; leaves overwrite.

## BR-03 — Unknown keys (Q2=A)

Unknown property names in JSON/provider objects are **ignored** (do not invalidate file).

## BR-04 — Non-boolean known leaves (Q2=A)

If a known leaf path is present but not a boolean, treat as **omitted** (retain lower-layer value). Do not mark whole file invalid solely for this.

## BR-05 — Soft-fail load (Q9=A)

| Condition | `loadStatus.kind` | Features |
|---|---|---|
| File OK | `ok` | Merged |
| HTTP 404 or network error | `missing` | Defaults (+ provider still applied) |
| Non-JSON / parse error / non-object root | `invalid` | Defaults (+ provider still applied) |

Initializer must not throw; app always boots.

## BR-06 — Provider always applied

Even when JSON fails, provider token partial still merges onto defaults.

## BR-07 — `is(path)` unknown (Q5=A)

- TypeScript: `path` constrained to `UiFeaturePath` union.
- Runtime (cast/mistype): return **`true`** (fail-open); optional `console.warn` in non-production.

## BR-08 — `themeToggle` alias (Q6=A)

- Input may include top-level `themeToggle?: boolean` in JSON/provider.
- Effect: writes the same leaf as `topBar.theme`.
- **Same-layer conflict**: if both `topBar.theme` and `themeToggle` appear in one layer, apply nested `topBar.theme` first, then **`themeToggle` overwrites** (alias wins within that layer).
- `is('topBar.theme')` and reading `features().topBar.theme` reflect the resolved leaf. Optional convenience: `is('themeToggle')` resolves to the same leaf value.

## BR-09 — No secrets

Demo/committed JSON must not contain tokens, passwords, or API keys (Security — new code). Merge layer does not specially scan strings beyond boolean leaf policy.

## BR-10 — Synchronous reads (NFR-UI-04)

After initializer completes, `features()` / `is()` are sync signal reads — no per-frame HTTP.

## BR-11 — PBT invariants (Q8=A)

For random partial overlays:

1. `merge(defaults, {})` equals defaults (all true).
2. Omitted leaf in partial ⇒ result leaf equals base leaf.
3. `merge(merge(defaults, json), provider)` leaf equals provider leaf when provider sets it.
4. Nested groups merge independently (e.g. `topBar.save` vs `canvas.minimap`).
