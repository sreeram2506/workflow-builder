# Frontend Components — U-UI-02 Chrome Wiring

---

## Hierarchy (solution)

```text
wb-shell-layout
  ├─ config warning banner (@if missing|invalid)
  └─ stage
       ├─ wb-canvas-host          @if canvas.enabled
       ├─ header-overlay
       │    ├─ wb-top-bar         @if topBar.enabled
       │    └─ wb-agent-tabs      @if agentTabs.enabled
       ├─ wb-left-sidebar         @if agentsLibrary.enabled
       └─ wb-right-sidebar        @if propertiesPanel.enabled
```

Nested agent shell mirrors this with `skillsLibrary.enabled` for left sidebar and `showBack` on top bar when mounted.

---

## AgentTabsComponent (new)

| Item | Detail |
|---|---|
| Inputs | none required (reads facade tabs) |
| Actions | select tab, close tab, solution tab |
| testids | keep `agent-tabs-strip`, `agent-tab-*` |

---

## TopBarComponent

- Remove embedded tabs markup (moved to AgentTabs).
- `@if` per action flag; theme toggle behind `topBar.theme`.
- Keydown: Save gated by `topBar.save` (BR-UI-26).

---

## ChromeInsetDirective

- Inject `UiConfigService`.
- When agents/skills library or properties disabled for current route, treat corresponding inset as collapsed/zero.

---

## Canvas overlays

In `canvas-viewport` (or host): `@if` zoom / minimap / floating actions per flags.

---

## Docs / demos

| Artifact | Action |
|---|---|
| `docs/workflow-builder-ui-embed.md` | Create full embed API + flag table |
| `docs/workflow-builder-ui-config-try.md` | Link to embed guide; keep try steps |
| `README.md` | Short pointer to embed doc |
| `src/assets/examples/*` | Keep; active `{}` |

---

## Tests (CG)

- Component/shell specs: flag off → element absent (`data-testid` queries).
- TopBar: Save shortcut no-op when `topBar.save` false.
- Banner visible for invalid/missing status (mock service).
- Existing suites stay green with defaults all-on.
