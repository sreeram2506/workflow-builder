# Component Dependency — UI Configurability (v1)

---

## Dependency matrix

| Consumer | Depends on | Relationship |
|---|---|---|
| APP_INITIALIZER | HttpClient, UiConfigService, UI token | Loads JSON → merge into service |
| `provideWorkflowBuilderUi` | InjectionToken | Supplies host partial |
| UiConfigService | merge pure module, token | Owns resolved state |
| ShellLayoutComponent | UiConfigService | Gates Agents Library, Properties, canvas, top/tabs |
| AgentSkillsShellComponent | UiConfigService | Gates Skills Library, Properties, canvas |
| TopBarComponent | UiConfigService | Gates region + actions |
| LeftSidebar / NestedSkillsLibrary | UiConfigService | Parent may omit mount; component may also self-guard |
| RightSidebar | UiConfigService | Parent gate |
| CanvasHost / Zoom / Minimap | UiConfigService | Parent + overlay gates |
| ThemeToggle | UiConfigService | Theme flag |
| WorkflowFacade | UiConfigService | Shortcut policy only |
| Host app (external) | `provideWorkflowBuilderUi` | Documented embed API |

**Non-dependency**: Components do **not** read UI features from `WorkflowFacade` (Q1=A).

---

## Communication patterns

- **Push once at bootstrap**: JSON + provider → service signal.
- **Pull at render**: components read signals synchronously.
- **No event bus** for config changes in v1.

---

## Data flow

```text
[assets JSON] ──HTTP──┐
                      ├── mergeUiFeatures ──► UiConfigService.features()
[provideWorkflow…] ───┘                              │
                                                     ▼
                              Shell / Agent / TopBar / Overlays / Facade shortcuts
```

Text alternative: Defaults and optional JSON merge first; host provider overrides win; chrome and shortcuts read the resolved map from `UiConfigService`.

---

## Unit mapping

| Unit | Owns |
|---|---|
| **U-UI-01** | Types, merge pure, token, provider, UiConfigService, APP_INITIALIZER, unit/PBT tests |
| **U-UI-02** | Wire all chrome gates + shortcut gating + demo JSON + embed docs |

---

## Coupling notes

- Keep merge pure and framework-free for PBT.
- Chrome components depend only on `UiConfigService` API surface (`features` / `is` / `loadStatus`).
- Avoid circular deps: facade → ui-config; ui-config must not import facade.
