# Unit of Work Dependency — UI Configurability (v1)

**Sequencing**: Strict (plan Q2=A)

---

## Dependency matrix

| Unit | Depends on | Dependency type | Notes |
|---|---|---|---|
| U-UI-01 | Existing SPA bootstrap (HttpClient, DI) | Soft / platform | No prior UI-config unit |
| U-UI-02 | **U-UI-01** | **Hard / strict** | Needs `UiConfigService` + provider API |
| U-UI-02 | U1 shell, U-SW agent/canvas chrome | Soft / reuse | Gates existing components |

---

## Sequence

```text
U-UI-01 (FD → CG → Build/Test) ──approved──► U-UI-02 (FD → CG → Build/Test)
```

Text alternative: Complete and approve U-UI-01 Build and Test before starting U-UI-02 Functional Design.

---

## Shared resources

| Resource | Owner unit | Consumers |
|---|---|---|
| `UiFeatures` types + merge | U-UI-01 | U-UI-02 |
| `UiConfigService` | U-UI-01 | U-UI-02 chrome + facade |
| `provideWorkflowBuilderUi` | U-UI-01 | Host / SPA `app.config` (wired in 01; demos in 02) |
| Demo JSON assets | U-UI-02 | SPA bootstrap (initializer from 01) |
| Embed docs | U-UI-02 | External hosts |

---

## Non-dependencies

- No new microservice or deployable boundary between units
- No circular dependency: ui-config must not import shell/facade
