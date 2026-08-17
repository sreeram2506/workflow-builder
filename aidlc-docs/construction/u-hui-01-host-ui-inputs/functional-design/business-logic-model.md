# Business Logic Model — U-HUI-01 Host UI chrome inputs

**Unit**: `u-hui-01-host-ui-inputs`  
**Stories**: US-HUI-01..04  
**Locked FD**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A

U-UI-01 bootstrap (defaults → JSON → provider) and U-UI-02 chrome regions still apply. This unit adds a **per-shell instance overlay**.

---

## Purpose

Let a parent bind `[ui]` on `wb-shell-layout` / `wb-agent-skills-shell` (Syncfusion-style) so chrome flags can differ per instance without rewriting global `UiConfigService`.

---

## Core process: effective features

```text
1. UiConfigService.features() = defaults ⊕ JSON ⊕ provider (global; unchanged by [ui])
2. Shell exposes ui = input<UiFeaturesPartial | undefined>() with no default
3. overlayPartial = normalizePartial(ui() ?? {})   (Q3=A, Q8=A)
4. effectiveFeatures = computed(() =>
       mergeUiFeatures(uiConfig.features(), overlayPartial))
5. Shell provides UI_EFFECTIVE_FEATURES reader from effectiveFeatures (Q1=A)
6. Shell region @if uses shell-local is(path) / effectiveFeatures
7. TopBar / ChromeShortcuts / ZoomControls / CanvasViewport inject token
   (optional) with fallback to UiConfigService (Q4=A)
8. Parent changes to [ui] recompute effective without remount (Q7=A)
```

### Omit vs `{}` vs partial

| Binding | Overlay into merge | Effect |
|---|---|---|
| Unbound (`undefined`) | `{}` | Same as global (US-HUI-02) |
| `[ui]="{}"` | `{}` | No leaf overrides |
| `[ui]="{ … }"` | Normalized partial | Defined leaves win over global |

### Isolation (FR-HUI-05)

- Never call `applyLayers` / never write `UiConfigService` for `[ui]` (Q2=A).
- Two shells with different overlays each provide their own token scope; neither mutates the other or the global snapshot (Q5=A, Q9=A).

### Nested shell (Q5=A)

`wb-agent-skills-shell` does **not** inherit the solution shell’s `[ui]`. Base for nested merge is always **global** `UiConfigService.features()`, then that shell’s own `[ui]`.

---

## Transformations

| Step | Input | Output |
|---|---|---|
| Normalize | raw `[ui]` / `{}` / omit | `UiFeaturesPartial` (unknown keys dropped; bad leaves omitted) |
| Merge | global `UiFeatures` + partial | shell-local `UiFeatures` |
| Reader | effective signal | `{ features(), is(path) }` fail-open like service |
| Alias | `themeToggle` / `theme.toggle` | Same U-UI-01 normalize (Q8=A) |

---

## Load status (Q6=A)

Banner continues to read **global** `loadStatus()`. Instance overlay does not own or mutate status.

---

## Persistence

None. Overlay is in-memory component input.

---

## Out of scope

- Changing JSON/provider bootstrap order
- Deprecating `provideWorkflowBuilderUi`
- Palette `[palettes]` / `[defaultAgents]`
- Per-instance `loadStatus`
