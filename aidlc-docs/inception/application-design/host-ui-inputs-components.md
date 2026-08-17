# Components — Host UI chrome inputs (`[ui]`)

**Additive to** U-UI-02 / U-HPI shell surfaces.  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A  
**Unit**: U-HUI-01

---

## Component catalog

| ID | Name | Layer | Role |
|---|---|---|---|
| C-HUI-SHELL | `ShellLayoutComponent` (extend) | features/shell | `ui` input; local effective features; provide `UI_EFFECTIVE_FEATURES`; region `@if` via effective |
| C-HUI-AGENT | `AgentSkillsShellComponent` (extend) | features/agent | Same for nested shell |
| C-HUI-TOKEN | `UI_EFFECTIVE_FEATURES` | core/ui-config | Token: `Signal<UiFeatures>` or reader; shell-scoped provider |
| C-HUI-MERGE | `mergeUiFeatures` (reuse) | core/ui-config | Pure merge global ⊕ `[ui]` partial |
| C-HUI-TOP | `TopBarComponent` (extend) | features/shell | Inject effective token (fallback global) for action gates |
| C-HUI-SHORT | `ChromeShortcutsDirective` (extend) | features/shell | Save gate via effective features |
| C-HUI-ZOOM | `ZoomControlsComponent` (extend) | features/canvas | Action flags via effective |
| C-HUI-VIEW | `CanvasViewportComponent` (extend) | features/canvas | Overlay flags via effective |
| C-HUI-DOCS | Embed + README | docs | `[ui]` section |

---

## Responsibilities

### Shells (Q1=A)
- `ui = input<UiFeaturesPartial | undefined>()`
- `effectiveFeatures = computed(() => mergeUiFeatures(uiConfig.features(), ui() ?? {}))`
- Do **not** call `applyLayers` / mutate global service for instance overlay
- Provide `UI_EFFECTIVE_FEATURES` from effective computed
- Region gates use effective `is` helper

### Token consumers (Q3=A)
- Inject `UI_EFFECTIVE_FEATURES` with optional fallback to `UiConfigService.features()` when token absent (tests / non-shell hosts)

### Out of scope
- Changing JSON/provider bootstrap order
- Palette `[palettes]` semantics
