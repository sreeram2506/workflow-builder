# Unit of Work — UI Configurability (v1)

**Parent label**: UI Configurability  
**Deployment model**: Same monolith Angular SPA (no new package / no ng-packagr in v1)  
**Unit meaning**: Two logical construction modules  
**Sequencing**: **Strict** — U-UI-02 starts only after U-UI-01 Build/Test approved (Q2=A)  
**Ownership**: Same stream (Q3=A)  
**Construction per unit**: Functional Design → Code Generation; skip NFR Requirements/Design and Infrastructure Design; Build and Test after each unit (Q4=A)  
**Product boundary**: Chrome configurability only — no workflow document schema or Enso API changes (Q5=A)  
**Application Design**: `ui-configurability-application-design.md`  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A

Original U1–U9 / Solution Workflow catalogs are unchanged.

---

## Code organization (brownfield) — Q6=A

```text
src/app/
  core/ui-config/                 # NEW (U-UI-01)
    ui-features.types.ts          # UiFeatures, UiFeaturePath, load status
    merge-ui-features.ts          # pure deep-merge + defaults (PBT)
    ui-config.token.ts            # InjectionToken for host partial
    provide-workflow-builder-ui.ts
    ui-config.service.ts
    ui-config.initializer.ts      # APP_INITIALIZER JSON load
  app.config.ts                   # register initializer + optional provider
  features/shell/                 # U-UI-02 gates
  features/agent/                 # U-UI-02 gates
  features/canvas/                # U-UI-02 canvas/overlay gates
  features/theme/                 # U-UI-02 theme gate
  core/facade/workflow.facade.ts  # U-UI-02 shortcut gating via UiConfigService

public/ or src/assets/
  wb-ui-config.json               # optional demo (no secrets) — U-UI-02 / wiring in 01+02

docs/
  workflow-builder-ui-embed.md    # embed API (U-UI-02) — or aidlc-docs pointer
```

Units do not create a new Angular project or deployable.

---

## Unit Catalog

### U-UI-01 — Config core

| Field | Value |
|---|---|
| **Id** | `u-ui-01-config-core` |
| **Stories** | US-UI-01, US-UI-07 |
| **Responsibility** | Typed feature map; defaults all-on; deep-merge; `provideWorkflowBuilderUi`; `UiConfigService` (`features()`, `is()`, `loadStatus()`); APP_INITIALIZER JSON soft-fail; unit + PBT on merge |
| **Primary components** | `core/ui-config/*`, app bootstrap providers |
| **Depends on** | Existing Angular DI / HttpClient; no chrome wiring required for Done |
| **Out of scope** | Shell `@if` gates, shortcut wiring, embed docs, demo JSON polish (may stub URL constant) |
| **Internal order** | types → merge pure + PBT → token/provider → service → initializer → tests |
| **PBT** | Partial on merge/defaulting (NFR-UI-01) |
| **Done when** | Provider wins over JSON; missing/invalid JSON → defaults + status; omitted keys show; `npm test` / build green for this slice |

### U-UI-02 — Chrome wiring + docs

| Field | Value |
|---|---|
| **Id** | `u-ui-02-chrome-wiring` |
| **Stories** | US-UI-02, US-UI-03, US-UI-04, US-UI-05, US-UI-06, US-UI-08 (+ FR-UI-09 demo JSON, FR-UI-10 embed docs) |
| **Responsibility** | Gate top bar / actions, `agentTabs.enabled`, Agents/Skills libraries, Properties, canvas + overlays, theme; facade shortcuts respect flags; view mode keeps flags; demo JSON examples; embed API markdown |
| **Primary components** | Shell, agent shell, TopBar, sidebars, canvas overlays, ThemeToggle, WorkflowFacade shortcuts |
| **Depends on** | **U-UI-01** (strict) |
| **Out of scope** | Publishable library; in-app settings UI; backend flags |
| **Internal order** | shell/agent gates → top bar/actions/tabs → overlays → shortcuts → demo JSON → embed docs → tests |
| **PBT** | None required beyond 01 (unless new pure helpers) |
| **Done when** | US-UI-02..06, 08 AC pass; docs present; suites green |

---

## Construction Rule

After Units Generation approval, CONSTRUCTION runs **U-UI-01 first** (FD → CG → Build and Test), then **only after approval** starts **U-UI-02** the same way.
