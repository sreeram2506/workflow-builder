# Component Dependency — Host UI chrome inputs (`[ui]`)

---

## Dependency matrix

| Consumer | Depends on | Relationship |
|---|---|---|
| ShellLayout / AgentSkillsShell | UiConfigService, mergeUiFeatures, `ui` input | Compute effective; provide token |
| TopBar / Shortcuts / Zoom / Viewport | `UI_EFFECTIVE_FEATURES` (opt) → UiConfigService | Effective gates |
| Host parent template | Shell `[ui]` binding | Instance overlay |
| Global initializer | UiConfigService only | Unchanged |

---

## Data flow

```text
[JSON + provideWorkflowBuilderUi] → UiConfigService
                                         │
Parent [ui]="partial" ──► Shell ──merge──┤
                                         ▼
                              effectiveFeatures + token
                                         │
                    region @if + child action/overlay gates
```

---

## Unit mapping

| Unit | Owns |
|---|---|
| **U-HUI-01** | Token, shell inputs/providers, child inject updates, docs, tests/PBT |

---

## Coupling

- ui-config must not import shell components.
- Shells may import ui-config token + merge helpers.
- Avoid writing instance overlays into root `UiConfigService` (FR-HUI-05).
