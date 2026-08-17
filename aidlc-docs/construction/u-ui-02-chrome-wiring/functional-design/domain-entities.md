# Domain Entities — U-UI-02 Chrome Wiring

Reuses U-UI-01 `UiFeatures` / `UiFeaturePath` / `UiConfigLoadStatus`. No new workflow document entities.

---

## Chrome region map

| Region | Flag path(s) | Mount owner |
|---|---|---|
| Top bar chrome | `topBar.enabled` (+ action leaves) | Shell → `wb-top-bar` |
| Agent tabs | `agentTabs.enabled` | Shell → `wb-agent-tabs` (new extract) |
| Agents Library | `agentsLibrary.enabled` | Solution shell → left sidebar |
| Skills Library | `skillsLibrary.enabled` | Agent shell → left sidebar |
| Properties | `propertiesPanel.enabled` | Both shells → right sidebar |
| Canvas | `canvas.enabled` | Both shells → canvas host |
| Zoom / minimap / floating | `canvas.zoomControls` / `minimap` / `floatingActions` | Canvas viewport |
| Theme control | `topBar.theme` | TopBar → theme toggle |
| Config warning | `loadStatus.kind` | Both shells → banner |

---

## Component entities (new/changed)

| Entity | Kind | Notes |
|---|---|---|
| `AgentTabsComponent` | New UI | Extracted from TopBar; same facade tab APIs |
| `ShellLayoutComponent` | Extended | Gates + banner + inset |
| `AgentSkillsShellComponent` | Extended | Same |
| `TopBarComponent` | Extended | Action gates; tabs removed |
| `CanvasViewportComponent` | Extended | Overlay gates |
| `ChromeInsetDirective` | Extended | Treat missing panels as collapsed |

---

## Relationships

```text
UiConfigService ──read──► Shells / TopBar / CanvasViewport / ChromeInset
WorkflowFacade  ◄──tabs/actions──  AgentTabs / TopBar
(no write-back of flags in v1)
```
