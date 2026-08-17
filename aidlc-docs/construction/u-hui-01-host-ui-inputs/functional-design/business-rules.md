# Business Rules — U-HUI-01 Host UI chrome inputs

---

## BR-HUI-01 — Precedence (FR-HUI-02)

Effective features for a shell instance:

1. Built-in defaults (all show)  
2. Optional JSON  
3. `provideWorkflowBuilderUi({ features })`  
4. **`[ui]` partial** — wins per leaf  

Steps 1–3 are global (`UiConfigService`). Step 4 is shell-local only.

## BR-HUI-02 — Omit and empty object (US-HUI-02)

- Unbound `[ui]` ⇒ treat overlay as `{}` (no instance overlay).  
- Bound `[ui]="{}"` ⇒ no leaf overrides; lower layers unchanged.  
- Input uses `input<UiFeaturesPartial | undefined>()` with **no default**.

## BR-HUI-03 — Normalize before merge (Q3=A)

Apply `normalizePartial` (or equivalent) to the bound value before `mergeUiFeatures`:

- Unknown property names ignored.  
- Non-boolean known leaves treated as omitted.  
- Do **not** set `loadStatus` to invalid/missing because of `[ui]`.  
- No error banner for bad instance leaves.

## BR-HUI-04 — No global write (FR-HUI-05, Q2=A)

Instance overlay MUST NOT call `applyLayers`, mutate `featuresSignal`, or otherwise rewrite `UiConfigService` state. Other instances and omit-path consumers keep bootstrap-resolved features.

## BR-HUI-05 — Reader token (Q1=A)

`UI_EFFECTIVE_FEATURES` provides `{ features(): UiFeatures; is(path): boolean }`:

- `is` uses the same path index / fail-open semantics as `UiConfigService.is` (unknown path → `true`).  
- Backed by the shell’s `effectiveFeatures` computed signal.

## BR-HUI-06 — Who reads effective (Q4=A)

| Consumer | Source |
|---|---|
| Shell region `@if` | Shell-local `is` / `effectiveFeatures` |
| TopBar, ChromeShortcuts, ZoomControls, CanvasViewport | Inject `UI_EFFECTIVE_FEATURES` optional → else `UiConfigService` |
| Load-status banner | Always global `UiConfigService.loadStatus()` (Q6=A) |

## BR-HUI-07 — Nested independence (Q5=A)

Nested agent shell merge base is global features, not the parent solution shell’s effective map. Host must bind `[ui]` on the nested shell to override nested chrome.

## BR-HUI-08 — Reactive updates (Q7=A, FR-HUI-04)

When the parent replaces the `[ui]` object (including clearing keys), `computed` recalculates effective features and chrome updates without full page reload or forced remount.

## BR-HUI-09 — themeToggle alias (Q8=A)

Same U-UI-01 rules: `themeToggle` and/or `theme.toggle` on `[ui]` normalize so either affects the theme gate.

## BR-HUI-10 — Chrome gate semantics unchanged

U-UI-02 region/action rules still apply; only the **feature source** changes from bootstrap-only to effective (global ⊕ `[ui]`).

## BR-HUI-11 — Docs (FR-HUI-07)

Embed guide documents `[ui]` + precedence; README pointer updated.

## BR-HUI-12 — PBT (Q9=A, NFR-HUI-01)

Property tests: for arbitrary base + partial, merged leaf equals partial when defined else base; merging must not mutate a cloned global snapshot. Example tests cover omit/`{}`/partial, isolation, reactive, both shells.
