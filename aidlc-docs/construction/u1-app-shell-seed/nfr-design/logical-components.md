# Logical Components — U1 (NFR Design)

## In-scope logical components

### ThemeApplicator
| Field | Detail |
|---|---|
| **Type** | Lightweight Angular service / helper |
| **Responsibility** | Apply `data-theme="dark|light"` (or equivalent class) on `document.documentElement` whenever UiStore theme changes |
| **Inputs** | Theme signal / facade theme API |
| **Outputs** | DOM attribute update; CSS variables activate |
| **Does not** | Persist theme; talk to backend |

### BootstrapErrorPresenter (UI concern, not global ErrorHandler)
| Field | Detail |
|---|---|
| **Type** | Signal + banner in `ShellLayout` / `AppComponent` |
| **Responsibility** | Display user-visible message if `initialize()` throws |
| **Trigger** | try/catch around bootstrap initialize |
| **Does not** | Implement Angular `ErrorHandler` globally (explicitly not selected) |

### Existing core (from Application Design — NFR-relevant)
- `WorkflowFacade` — orchestration including initialize
- `GraphStore` / `UiStore` — in-memory state
- `MockWorkflowRepository` — static seed

## Explicitly out of scope (N/A)
| Component | Reason |
|---|---|
| Message queues | No async backend |
| Caches (Redis/CDN) | Local SPA |
| Circuit breakers / retry brokers | No remote calls |
| Workers / service workers | Not required for U1 |
| Global `ErrorHandler` service | Q5 = ThemeApplicator only |
| API gateways / DBs / LB | Infrastructure Design skipped |

## PBT logical artifact
| Artifact | Detail |
|---|---|
| Pure helper under `core/domain/` | e.g. `isAllowedNodeType(type)` or `nextTheme(theme)` |
| Test | `fast-check` property asserting invariant (catalog membership or toggle round-trip `nextTheme(nextTheme(t)) == t` for binary theme) |

## Dependency diagram (logical)

```text
App bootstrap
  -> try WorkflowFacade.initialize()
        -> MockWorkflowRepository
        -> GraphStore / UiStore
  catch -> bootstrapError banner
UiStore.theme --> ThemeApplicator --> documentElement[data-theme]
CSS tokens --> Shell visual tree
```
