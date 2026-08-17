# Business Rules — U-UI-02 Chrome Wiring

---

## BR-UI-20 — Parent shell gating (Q1=A)

`ShellLayout` and `AgentSkillsShell` own `@if` mounts for canvas, left library, properties, top bar, and agent tabs. Leaf sidebars/canvas are not mounted when disabled (no self-gate required).

## BR-UI-21 — TopBar action gating

When TopBar is mounted, each control respects its leaf flag: `logo`, `title`, `status`, `theme` (`topBar.theme`), `editView`. Save/Export/Import/Run/Reset live on canvas (`canvas.save` etc.). Hidden control ≠ removed facade API.

## BR-UI-22 — Independent agent tabs (Q2=B)

- Visibility = `agentTabs.enabled` only.
- Implemented as separate `wb-agent-tabs` mounted by shell.
- `topBar.enabled === false` does not hide tabs if `agentTabs.enabled === true`.

## BR-UI-23 — Library flags by route (Q6=A)

| Route | Left library flag |
|---|---|
| Solution (`/`) | `agentsLibrary.enabled` |
| Nested (`/agent/:nodeId`) | `skillsLibrary.enabled` |

Nested canvas still opens when skills library is off (FR-UI-07).

## BR-UI-24 — Properties & canvas

- `propertiesPanel.enabled` false → omit right sidebar; selection may still update store.
- `canvas.enabled` false → omit canvas host (empty stage allowed).
- Overlay flags: `canvas.zoomControls`, `canvas.minimap`, `canvas.floatingActions` — gate inside canvas viewport when canvas mounted.

## BR-UI-25 — View mode (US-UI-08)

Editor view mode does **not** override host UI flags. Hidden chrome stays hidden; visible chrome still respects view-mode mutation locks.

## BR-UI-26 — Save shortcut (Q5=A)

If `topBar.save` is false, ⌘/Ctrl+S must not call `saveDownload` (preventDefault optional; must not save).

## BR-UI-27 — Load status banner (Q3=A)

Show banner for `missing` and `invalid`. Do not use `bootstrapError` channel. Dismissible optional (default: persistent until reload with ok config).

## BR-UI-28 — Chrome inset (Q4=A)

When left/right panels are not mounted (or effectively hidden by flag), inset/padding treats them as width 0 / collapsed so content is not offset for absent chrome.

When the top bar is hidden and no agent tabs are open, `chromeInsetTop` is a small value (16px) so Agents Library and Properties use the freed vertical space. The former 72px minimum clamp is removed.

## BR-UI-29 — Defaults

Omitted flags remain true (U-UI-01); with `{}` config, full current chrome remains.

## BR-UI-30 — Docs

Embed guide + README pointer required (Q7=C). Demo JSON: examples folder + copy workflow; active stays `{}` (Q8=A).
