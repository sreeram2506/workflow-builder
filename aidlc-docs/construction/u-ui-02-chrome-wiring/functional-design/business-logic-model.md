# Business Logic Model — U-UI-02 Chrome Wiring

**Unit**: `u-ui-02-chrome-wiring`  
**Stories**: US-UI-02..06, US-UI-08 · FR-UI-09/10  
**Locked FD**: Q1=A · Q2=B · Q3=A · Q4=A · Q5=A · Q6=A · Q7=C · Q8=A

---

## Purpose

Apply resolved `UiConfigService` flags to SPA chrome so hosts can hide regions/actions without forking. Document embed API.

---

## Visibility resolution (sync)

For each chrome region, shells read `uiConfig.is(path)` / `features()` and either mount or omit children (Q1=A — parent gates; TopBar gates its own actions).

```text
UiConfigService.features()
        │
        ▼
ShellLayout / AgentSkillsShell
  ├─ canvas.enabled          → mount wb-canvas-host
  ├─ agentsLibrary.enabled   → mount left sidebar (solution)
  ├─ skillsLibrary.enabled   → mount left sidebar (agent route)
  ├─ propertiesPanel.enabled → mount right sidebar
  ├─ topBar.enabled          → mount wb-top-bar (actions chrome)
  └─ agentTabs.enabled       → mount wb-agent-tabs (extracted; Q2=B)
        │
        ▼
TopBar (when mounted): per-action flags (logo, save, …)
Canvas viewport (when canvas mounted): zoomControls, minimap, floatingActions
```

---

## Agent tabs extraction (Q2=B)

- New (or extracted) **`wb-agent-tabs`** component owns the tab strip UI currently inside TopBar.
- Shell mounts it when `agentTabs.enabled` — **independent** of `topBar.enabled`.
- TopBar no longer owns the tab strip; may still host Back/logo/actions when `topBar.enabled`.

---

## Load-status banner (Q3=A)

When `loadStatus().kind` ∈ {`missing`, `invalid`}, shells show a non-blocking banner (distinct from `bootstrapError`). Message from `loadStatus().message`.

---

## Layout inset (Q4=A)

Hidden left/right libraries count as **collapsed** for chrome-inset / padding so canvas uses available width.

---

## Shortcuts (Q5=A)

⌘/Ctrl+S no-ops when `topBar.save` is false. Undo/redo/copy/paste unchanged.

---

## Docs (Q7=C, Q8=A)

- Full embed guide: `docs/workflow-builder-ui-embed.md`
- README short pointer
- Keep try/examples workflow; active JSON stays `{}`
