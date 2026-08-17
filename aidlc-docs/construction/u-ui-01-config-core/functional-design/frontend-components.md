# Frontend Components — U-UI-01 Config Core

U-UI-01 has **no chrome gating**. This doc covers injectable/bootstrap “surfaces” only.

---

## Component / surface inventory

| ID | Name | Kind | Responsibility |
|---|---|---|---|
| F-UI-SVC | `UiConfigService` | Injectable | `features()`, `is()`, `loadStatus()` signals |
| F-UI-PROV | `provideWorkflowBuilderUi` | Provider factory | Register host partial token |
| F-UI-INIT | `uiConfigInitializer` | APP_INITIALIZER | Fetch `/assets/wb-ui-config.json`, merge, set status |
| F-UI-ASSET | `src/assets/wb-ui-config.json` | Static asset | Optional stub `{}` or omitted |

---

## State

| State | Owner | Consumers (this unit) |
|---|---|---|
| Resolved features | UiConfigService | Unit tests; future U-UI-02 |
| Path index | UiConfigService (private) | `is()` |
| Load status | UiConfigService | Tests; U-UI-02 banner later |

**Not in U-UI-01**: shell error banner binding (Q4=A).

---

## User interactions

None in this unit (no settings UI).

---

## API / integration

| Call | When | On failure |
|---|---|---|
| `GET /assets/wb-ui-config.json` | Bootstrap initializer | Soft-fail per BR-05 |

Host integration (documented in U-UI-02):

```typescript
provideWorkflowBuilderUi({ features: { agentsLibrary: { enabled: false } } })
```

---

## Test surfaces

- Pure: `mergeUiFeatures`, `normalizePartial`, `createDefaultUiFeatures`
- Service: defaults; mock HttpClient 404/invalid/ok; provider override wins
- PBT: fast-check on merge invariants (BR-11)
