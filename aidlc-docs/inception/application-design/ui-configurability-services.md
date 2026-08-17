# Services — UI Configurability (v1)

---

## Service / module catalog

| ID | Name | Kind | Responsibility |
|---|---|---|---|
| S-UI-CFG | `UiConfigService` | injectable root | Hold resolved `UiFeatures` signal, load status, `is()` helper |
| S-UI-TOKEN | `WORKFLOW_BUILDER_UI_FEATURES` (or equiv.) | InjectionToken | Host partial overrides from `provideWorkflowBuilderUi` |
| S-UI-MERGE | `merge-ui-features.ts` | pure domain | Deep-merge + default factory; PBT target |
| S-UI-INIT | APP_INITIALIZER provider | bootstrap | HTTP load optional JSON before first paint; fail soft |
| S-UI-HTTP | `HttpClient` | platform | Fetch `assets/wb-ui-config.json` (path FD-locked) |
| S-UI-FACADE | `WorkflowFacade` | facade (light touch) | Shortcut gating via injected `UiConfigService` |
| S-UI-SHELL | Shell + agent layout components | UI | Consume `UiConfigService` for `@if` gates |
| S-UI-DOCS | Embed API doc | documentation | Provider usage + key inventory for hosts |

---

## Orchestration

### Bootstrap (Q3=A)

```text
defaults (all true)
    → APP_INITIALIZER HTTP JSON (optional; soft-fail)
    → inject token from provideWorkflowBuilderUi (wins)
    → UiConfigService.features.set(resolved)
```

1. Create defaults.
2. Attempt JSON load; on missing/invalid → keep defaults, set `loadStatus` non-blocking.
3. Deep-merge provider partial last.
4. App renders; chrome reads synchronous signals (NFR-UI-04).

### Runtime visibility

1. Shell/agent templates call `uiConfig.is('…')` or `uiConfig.features().…`.
2. User toggles are **not** live-edited in v1 (no settings UI); change requires rebuild/redeploy or host provider.
3. Facade shortcuts consult same service before invoking save/etc.

### Demo SPA wiring (FR-UI-09)

- Optional committed example JSON(s) under `assets/` (no secrets).
- `app.config.ts` registers initializer + optional empty/demo `provideWorkflowBuilderUi`.

---

## Non-goals

- Remote feature-flag SaaS
- Persisting user-edited flags
- Facade owning the feature map (rejected; Q1=A)
