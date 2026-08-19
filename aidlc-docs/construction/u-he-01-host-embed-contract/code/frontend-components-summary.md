# Frontend Components Summary — U-HE-01 Host embed contract

**Stories**: US-HE-01, US-HE-02, US-HE-03, US-HE-04  
**FR**: FR-HE-04, FR-HE-08, FR-HE-09

## `wb-shell-layout`

- `[document]` loads via `loadDocument` (undefined skipped for SPA boot).
- `(documentChange)` structured clone after successful load and debounced committed edits.
- `(save)` / `(run)` instance outputs; `.observed` wins over provider persist.
- `:host` and `.shell` use `height: 100%` / `min-height: 0` (not `100vh`). No `[height]` input.

## `wb-agent-skills-shell`

- Height 100% same as solution shell.
- `(save)` / `(run)` for first-win while nested is mounted.
- No `[document]` / `(documentChange)` (solution owns the document).

## Chrome

- Save button and ⌘/Ctrl+S call `requestSave()`.
- Run calls `requestRun()`.
- Export / Import unchanged.
