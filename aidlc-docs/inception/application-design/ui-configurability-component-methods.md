# Component Methods — UI Configurability (v1)

High-level interfaces only. Business rules and exact merge edge cases → Functional Design.

---

## UiConfigService

| Method / API | Input | Output | Purpose |
|---|---|---|---|
| `features()` | — | `Signal<UiFeatures>` | Resolved nested boolean map |
| `is(path)` | `UiFeaturePath` (dot string union) | `boolean` | Typed path helper (Q2=C) |
| `loadStatus()` | — | `Signal<UiConfigLoadStatus>` | `ok` \| `missing` \| `invalid` (+ optional message) |
| `applyProviderOverrides(partial)` | `PartialDeep<UiFeatures>` | void | Internal; used by provider factory |
| *(static / factory)* `createDefaults()` | — | `UiFeatures` | All-true map |

## provideWorkflowBuilderUi

| API | Input | Output | Purpose |
|---|---|---|---|
| `provideWorkflowBuilderUi(options)` | `{ features?: PartialDeep<UiFeatures> }` | `EnvironmentProviders` | Register host overrides (wins over JSON) |

## merge-ui-features (pure)

| Function | Input | Output | Purpose |
|---|---|---|---|
| `mergeUiFeatures(base, ...layers)` | full + partial maps | `UiFeatures` | Deep-merge; omitted keys keep base |
| `normalizePartial(raw)` | unknown JSON | `PartialDeep<UiFeatures>` \| error | Validate shape; reject secrets patterns in FD if needed |

## APP_INITIALIZER factory

| API | Input | Output | Purpose |
|---|---|---|---|
| `loadUiConfigJson()` | HttpClient + URL | `Promise<void>` | Fetch JSON; on fail set status + keep defaults; then apply provider layer |

## Shell / agent layout (extend)

| Method / template contract | Purpose |
|---|---|
| Gate `@if (ui.is('agentsLibrary.enabled'))` | Show/hide Agents Library |
| Gate `@if (ui.is('skillsLibrary.enabled'))` | Show/hide Skills Library |
| Gate `@if (ui.is('propertiesPanel.enabled'))` | Show/hide Properties |
| Gate `@if (ui.is('canvas.enabled'))` | Show/hide canvas host |
| Gate `@if (ui.is('topBar.enabled'))` | Show/hide main top bar |
| Gate `@if (ui.is('agentTabs.enabled'))` | Show/hide agent tabs (independent) |

## TopBarComponent (extend)

| Contract | Purpose |
|---|---|
| Per-control `@if (ui.is('topBar.save'))` etc. | Hide actions without removing facade methods |
| Theme / edit-view gates | Same pattern |

## WorkflowFacade (extend)

| Method | Change |
|---|---|
| Keyboard shortcut handlers (save, etc.) | Early-return when matching `ui.is('topBar.*')` is false |
| Domain APIs (`save`, `run`, …) | Remain callable from host code; UI + shortcuts respect flags |

## Canvas overlays

| Component | Gate |
|---|---|
| ZoomControls | `canvas.zoomControls` |
| Minimap | `canvas.minimap` |
| Floating actions (if any) | `canvas.floatingActions` |

---

## Notes

- No new public facade surface required for feature reads (Q1=A).
- Path union + nested object both supported (Q2=C).
- Detailed AC tests live in Construction.
