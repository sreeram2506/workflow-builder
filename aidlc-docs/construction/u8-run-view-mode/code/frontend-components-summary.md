# Frontend Components Summary — U8 Simulated Run & View Mode

## TopBar
- **Run** / **Stop** (Stop shown while `runActive`)
- **Reset** statuses (edit or view)
- View/edit toggle with `aria-pressed`; **View** badge when `editorMode === 'view'`
- Polite `aria-live` region bound to `runAnnouncement`
- Static inline SVG icons; no `innerHTML`
- Import remains disabled in view; Export/Save/Run/Reset allowed

## View lock (verified existing + toggle)
- Mutating facade APIs no-op in view (palette add, edges, patches, undo/redo, import, copy/paste)
- Pan/zoom/minimap/selection/theme remain available
