# Application Design Summary — UI Configurability (v1)

Consolidates `ui-configurability-*.md` design artifacts.

## Decisions locked (plan)

| Q | Answer | Design implication |
|---|---|---|
| Q1 | **A** | `UiConfigService` owns config; components inject it |
| Q2 | **C** | Nested `features()` + typed `is('dot.path')` |
| Q3 | **A** | APP_INITIALIZER loads JSON; soft-fail to defaults |
| Q4 | **C** | `agentTabs.enabled` independent of `topBar.enabled` |
| Q5 | **A** | U-UI-01 then U-UI-02 |

## Artifacts

| File | Content |
|---|---|
| `ui-configurability-components.md` | Catalog + responsibilities + key inventory |
| `ui-configurability-component-methods.md` | Service/layout/facade contracts |
| `ui-configurability-services.md` | Merge/bootstrap orchestration |
| `ui-configurability-component-dependency.md` | Matrix, data flow, unit split |

## Traceability

| FR / Story | Design coverage |
|---|---|
| FR-UI-01, 02 · US-UI-01, 07 | Merge + defaults + provider |
| FR-UI-03 · US-UI-02 | TopBar + action gates; shortcuts via facade |
| FR-UI-04 · US-UI-03 | Agents Library gate |
| FR-UI-05, 07 · US-UI-04 | Skills Library gate; nested canvas always openable |
| FR-UI-06 · US-UI-05 | Properties gate |
| FR-UI-07, 08 · US-UI-06 | Canvas + overlays + `agentTabs.enabled` |
| FR-UI-09, 10 | Demo JSON + embed docs (U-UI-02) |
| US-UI-08 | Flags apply in view mode unchanged |

## Next

Units Generation → Construction (FD → Code Gen per unit → Build and Test). NFR Requirements/Design and Infrastructure Design skipped per execution plan.
