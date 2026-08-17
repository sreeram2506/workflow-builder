# Business Logic Summary — U-UI-02

## Gates (parent shells)

- Solution: `agentsLibrary` / `propertiesPanel` / `canvas` / `topBar` / `agentTabs`
- Nested agent: `skillsLibrary` for left library; same other flags
- Q4 inset: panels not mounted ⇒ no gutter; header absent (top bar off and no open tabs) ⇒ `chromeInsetTop` → 16 (no 72px clamp)
- Palette AIAgent reuse: same library row focuses the existing node/tab instead of duplicating
- Theme flag is `topBar.theme` only in JSON examples (root `themeToggle` omitted)

## Shortcuts

- Undo/redo/copy/paste always available via `wbChromeShortcuts`
- Save (⌘/Ctrl+S): `preventDefault` + no-op when `topBar.save` false; otherwise `saveDownload`

## Banner

- `loadStatus` `missing` | `invalid` → non-blocking `ui-config-banner`
- Distinct from bootstrap error banner
