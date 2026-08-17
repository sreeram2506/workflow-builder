# Components — UI Configurability (v1)

**Additive to** existing shell/canvas catalogs. Does not replace prior docs.  
**Plan answers**: Q1=A · Q2=C · Q3=A · Q4=C · Q5=A  
**Units**: U-UI-01 (config core) → U-UI-02 (chrome wiring + docs)

---

## Component catalog (new / extended)

| ID | Name | Layer | Role |
|---|---|---|---|
| C-UI-CFG | `UiConfigService` + feature types | core/ui-config | Own defaults, merge, APP_INITIALIZER load, resolved features signal |
| C-UI-PROV | `provideWorkflowBuilderUi` | core/ui-config | Host DI token / provider; highest merge precedence |
| C-UI-MERGE | `merge-ui-features` (pure) | core/ui-config | Deep-merge defaults ← JSON/env ← provider |
| C-UI-SHELL | `ShellLayoutComponent` (extend) | features/shell | Gate Agents Library, Properties, canvas, top bar / tabs strip |
| C-UI-AGENT | `AgentSkillsShellComponent` (extend) | features/agent | Gate Skills Library, Properties, canvas overlays on nested route |
| C-UI-TOP | `TopBarComponent` (extend) | features/shell | Gate bar region + per-action controls; tabs only if hosted here and flags allow |
| C-UI-TABS | Agent tabs strip (TopBar region or extract) | features/shell | Visibility = **`agentTabs.enabled`** independent of `topBar.enabled` |
| C-UI-LEFT | `LeftSidebarComponent` (extend) | features/shell | Render only when `agentsLibrary.enabled` (solution) |
| C-UI-NEST-LIB | `NestedSkillsLibraryComponent` (extend) | features/agent | Render only when `skillsLibrary.enabled` |
| C-UI-RIGHT | `RightSidebarComponent` (extend) | features/shell | Render only when `propertiesPanel.enabled` |
| C-UI-CANVAS | `CanvasHostComponent` (extend) | features/canvas | Render only when `canvas.enabled` |
| C-UI-ZOOM | `ZoomControlsComponent` (extend) | features/canvas | Gate with `canvas.zoomControls` |
| C-UI-MINI | `MinimapComponent` (extend) | features/canvas | Gate with `canvas.minimap` |
| C-UI-THEME | `ThemeToggleComponent` (extend) | features/theme | Gate with `topBar.theme` / `themeToggle` |
| C-UI-FACADE | `WorkflowFacade` (extend lightly) | core/facade | Shortcut handlers respect matching UI flags via `UiConfigService` |
| C-UI-DOCS | Embed API markdown | docs / aidlc or `docs/` | How hosts call `provideWorkflowBuilderUi` (U-UI-02) |

---

## Responsibilities

### C-UI-CFG / C-UI-PROV / C-UI-MERGE
- Built-in defaults: all feature booleans **true**
- Optional JSON (e.g. `assets/wb-ui-config.json`) loaded in **APP_INITIALIZER**; invalid/missing → defaults + non-blocking status
- Host provider partial map deep-merges last (wins)
- Expose `features(): UiFeatures` (nested) and `is(path: UiFeaturePath): boolean`
- Components inject **`UiConfigService`** directly (Q1=A); facade does **not** own config

### C-UI-SHELL / C-UI-AGENT
- `@if` (or equivalent) around chrome children using `uiConfig.is(...)` / `features()`
- Nested agent route always mounts when navigated; libraries/properties/canvas follow flags
- Layout remains usable when side panels absent (canvas expands / empty shell allowed)

### C-UI-TOP + C-UI-TABS (Q4=C)
- `topBar.enabled === false` → hide main top-bar chrome (logo, title, actions, etc.)
- Agent tabs render **only if** `agentTabs.enabled === true` (independent top-level flag)
- If both `topBar.enabled` and `agentTabs.enabled` are false → no header strip
- When tabs shown without full top bar, shell may host a minimal tab-only row (implementation detail in FD; visibility contract is the independent flag)

### Per-action / overlay gates
- Top-bar actions: logo, title, status, back, save, export, import, run, reset, theme, edit/view — each has a boolean
- Canvas overlays: zoom, minimap, floating actions (if present)
- Shortcuts for Save/etc. call through facade and **no-op** when matching flag is false

---

## Locked feature key shape (v1 inventory)

```text
topBar.enabled | logo | title | status | back | save | export | import | run | reset | theme | editView
agentTabs.enabled                    ← independent of topBar.enabled (Q4=C)
agentsLibrary.enabled
skillsLibrary.enabled
propertiesPanel.enabled
canvas.enabled | zoomControls | minimap | floatingActions
themeToggle                          ← may alias topBar.theme
```

Exact TypeScript interfaces land in Functional Design; omitted keys default **true**.

---

## Out of scope (components)

- Publishable ng library packaging
- In-app settings UI to edit flags
- Backend feature-flag service
