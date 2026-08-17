# Services — Palette / catalog host config (v1)

---

## Service / module catalog

| ID | Name | Kind | Responsibility |
|---|---|---|---|
| S-PAL-CFG | `UiConfigService` | injectable root | Resolved chrome + `palette` tree (Q1=A) |
| S-PAL-TOKEN-F | `WORKFLOW_BUILDER_UI_FEATURES` | InjectionToken | Host feature overlay including `palette` |
| S-PAL-TOKEN-CS | Catalog solution token | InjectionToken | Optional `WorkflowBuilderCatalogAdapter` for Agents Library |
| S-PAL-TOKEN-CA | Catalog agent token | InjectionToken | Optional adapter for Skills Library |
| S-PAL-PROV | `provideWorkflowBuilderUi` | EnvironmentProviders | Sets feature token + catalog tokens (Q2=C) |
| S-PAL-MERGE | `merge-ui-features.ts` | pure | Chrome merge + palette presence merge |
| S-PAL-FILTER | allow-list / defaultAgents helpers | pure domain | Filter invariant + default-agent rows (PBT) |
| S-PAL-CAT | `EnsoTaskCatalogService` | injectable root | Orchestrate Enso or host adapter; apply filter before emit |
| S-PAL-ENSO | Enso HTTP (existing) | default adapter impl | `pipeline/list` / `task/list` when tokens omitted |
| S-PAL-LEFT | `LeftSidebarComponent` | UI | Render filtered catalog; featured strip; 0..N default agents |
| S-PAL-DOCS | Embed/try + examples | documentation | Host API for palette + adapters |

---

## Orchestration

### Config (same bootstrap as chrome)

```text
defaults (show-all types; Blank Agent; no adapters)
    -> APP_INITIALIZER HTTP JSON (palette serializable fields only)
    -> provideWorkflowBuilderUi features (wins)
    -> UiConfigService.features including palette
```

1. Chrome booleans still default **true** when omitted.
2. Palette allow-lists and `defaultAgents` default to **omitted** (show-all / Blank Agent), not empty arrays.
3. Provider `features.palette` overlays JSON for the same keys.

### Catalog load (per canvas)

```text
LeftSidebar loadCatalog(mode)
    -> EnsoTaskCatalogService
        -> if catalog token for mode: host adapter.load()
        -> else: Enso HTTP
        -> on fail/empty: static defaults only (no MOCK_SOLUTION_AGENTS)
        -> compose static (featured + resolveDefaultAgents or PALETTE_ITEMS)
           + remote rows
        -> filterPaletteItemsByAllowList for that canvas
        -> emit PaletteCatalogLoad
    -> sidebar renders strip / defaults / lists from items
```

Text alternative: The sidebar asks the catalog service to load. The service uses a host adapter if the matching token exists, otherwise Enso. Failures drop remote rows and mocks. Static defaults plus remote rows are filtered by the canvas allow-list, then the sidebar displays what it receives.

### Adapter vs JSON

- Adapters are **provider-only**. JSON cannot register functions.
- One adapter per canvas. Extra APIs live **inside** the host adapter.
- Environment Enso URLs remain the **default implementation**, not a JSON override in v1.

### Failure (FR-PAL-05)

- Solution: filtered featured types + `resolveDefaultAgents` only.
- Skills: filtered `PALETTE_ITEMS` only.
- `error` string for banner; do not crash shell.

---

## Non-goals

- Remote feature-flag SaaS for palette
- Skills `defaultAgents`
- Parallel adapters (fan-in) inside Workflow Builder
- Catalog service owning chrome library visibility (`agentsLibrary.enabled` stays on shells)
