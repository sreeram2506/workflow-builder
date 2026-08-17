# Component Methods — Host UI chrome inputs (`[ui]`)

---

## ShellLayout / AgentSkillsShell

| API | I/O | Purpose |
|---|---|---|
| `ui` | `InputSignal<UiFeaturesPartial \| undefined>` | Instance overlay (omit = none) |
| `effectiveFeatures()` | `Signal<UiFeatures>` | Global features ⊕ ui partial |
| `is(path)` | local helper | Read from effectiveFeatures / path index |
| `providers` | `UI_EFFECTIVE_FEATURES` | Shell-scoped effective signal |

## mergeUiFeatures (reuse)

| Function | Purpose |
|---|---|
| `mergeUiFeatures(base, partial)` | Deep-merge instance partial onto resolved global map |
| `buildPathIndex` / `is` helpers | Optional shared `createEffectiveUiReader(featuresSignal)` |

## UI_EFFECTIVE_FEATURES token

| API | Purpose |
|---|---|
| `InjectionToken<Signal<UiFeatures>>` (or small reader interface with `features()` + `is(path)`) | Children read effective chrome flags |

## TopBar / ChromeShortcuts / ZoomControls / CanvasViewport

| Change | Purpose |
|---|---|
| Inject effective token (optional) → else `UiConfigService` | Action/overlay/shortcut gates honor `[ui]` |

---

## Notes

- Detailed factory wiring → Functional Design / Code Gen.
- Global service remains source of bootstrap layers only.
