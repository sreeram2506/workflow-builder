# Business Logic Model — U-UI-01 Config Core

**Unit**: `u-ui-01-config-core`  
**Stories**: US-UI-01, US-UI-07  
**Locked FD**: Q1=C · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A

---

## Purpose

Resolve a complete `UiFeatures` tree at bootstrap so chrome (U-UI-02) and hosts can read flags synchronously.

---

## Core process: resolve UI features

```text
1. Start with createDefaultUiFeatures()           // all boolean leaves true
2. APP_INITIALIZER GET /assets/wb-ui-config.json
   - success + parse OK → normalizePartial(raw) → merge into base
   - 404 / network → status.missing; keep base
   - parse / body not object → status.invalid; keep base
3. Read InjectionToken host partial (if any)
   → normalizePartial → merge (wins)
4. Apply themeToggle alias normalization on final tree
5. Publish features signal + rebuild path index for is()
6. Bootstrap continues (never hard-fail)
```

---

## Transformations

| Step | Input | Output |
|---|---|---|
| `createDefaultUiFeatures` | — | Full nested `UiFeatures` (all `true`) |
| `normalizePartial` | unknown JSON/object | `PartialDeep<UiFeatures>` (+ optional top-level `themeToggle?: boolean`); unknown keys dropped; non-boolean known leaves omitted |
| `mergeUiFeatures(base, partial)` | full + partial | full tree; omitted leaves keep base |
| `buildPathIndex(features)` | full tree | `Map`/`Record` of `UiFeaturePath → boolean` for O(1) `is()` |
| `applyThemeAlias` | tree + optional `themeToggle` from layer | Sets `topBar.theme` when alias present (see business-rules) |

---

## Persistence

- No durable persistence of resolved flags in v1.
- Optional static file: `src/assets/wb-ui-config.json` (may be absent).

---

## Out of scope (this unit)

- Chrome `@if` gating, shortcut policy UI, embed docs, demo JSON content polish (file may be empty `{}` stub).
