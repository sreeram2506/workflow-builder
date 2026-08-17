# Domain Entities — U-HUI-01 Host UI chrome inputs

Reuses U-UI-01 `UiFeatures` / `UiFeaturesPartial` / `UiFeaturePath` / `UiConfigLoadStatus`. No new workflow document entities.

---

## New / extended entities

| Entity | Kind | Notes |
|---|---|---|
| `UI_EFFECTIVE_FEATURES` | InjectionToken | Shell-scoped reader `{ features(), is() }` (Q1=A) |
| `EffectiveUiReader` | Interface (optional name) | Contract for the token |
| `createEffectiveUiReader` | Factory helper (optional) | Builds reader from `Signal<UiFeatures>` + path index |
| `ShellLayoutComponent` | Extended | `ui` input; effective computed; provides token; region gates |
| `AgentSkillsShellComponent` | Extended | Same |
| `TopBarComponent` | Extended | Inject effective reader (fallback global) |
| `ChromeShortcutsDirective` | Extended | Save gate via effective |
| `ZoomControlsComponent` | Extended | Action flags via effective |
| `CanvasViewportComponent` | Extended | Overlay flags via effective |
| `UiConfigService` | Unchanged write path | Read-only for `[ui]` consumers; still owns bootstrap + loadStatus |

---

## Effective feature map (conceptual)

| Field | Source |
|---|---|
| Global resolved | `UiConfigService.features()` |
| Instance overlay | `normalizePartial(ui() ?? {})` |
| Effective | `mergeUiFeatures(global, overlay)` — shell-local, not persisted |

---

## Relationships

```text
UiConfigService.features() ──read──► Shell
Parent [ui] partial ──normalize──► Shell
                         │
                         ▼
              effectiveFeatures (computed)
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   shell @if      UI_EFFECTIVE_FEATURES   (loadStatus stays global)
                         │
         TopBar / Shortcuts / Zoom / Viewport
```

Text alternative: Shell merges global features with normalized `[ui]`, provides the reader token to descendants, and keeps load-status on the global service.

---

## Non-entities

- No per-instance load status type  
- No new workflow / palette domain types  
- No mutation API on `UiConfigService` for overlays
