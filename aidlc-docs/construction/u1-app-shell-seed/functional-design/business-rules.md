# Business Rules — U1

## BR-U1-01 Seed is the initial graph source
- On application bootstrap, WorkflowFacade MUST load the compile-time mock seed into GraphStore exactly once (unless explicitly reloaded later).
- Seed MUST contain exactly the approved v1 node types only.

## BR-U1-02 Theme defaults and session scope
- Default theme on first load is `dark`.
- Theme changes update UiStore only for the current session.
- Theme MUST NOT be written to localStorage or any durable store.
- Page refresh resets theme to `dark`.

## BR-U1-03 Document status pill
- Top bar status pill reflects `WorkflowDocument.status`.
- Seed status MUST be `draft`.
- U1 does not transition status (no Run yet).

## BR-U1-04 Placeholder actions
- Undo, Redo, Save, Run buttons MUST render disabled.
- Each MUST expose tooltip/accessible name indicating unavailable until a later phase.
- Clicks MUST have no side effects.

## BR-U1-05 Sidebars
- Left and right sidebars are visible by default with placeholder empty-state copy.
- Collapse toggles MAY hide/show each sidebar independently via UiStore flags.

## BR-U1-06 Canvas host (U1)
- Canvas region shows dotted-grid background styling only.
- MUST NOT implement pan/zoom/minimap engines.
- MUST NOT render interactive or static node cards in U1 (nodes remain store-only).

## BR-U1-07 Seed infallibility / empty fallback
- Seed module constant is treated as infallible under normal builds.
- IF nodes array is empty after load, shell still renders; document status remains `draft`; canvas shows empty placeholder grid.

## BR-U1-08 No scope creep
- U1 MUST NOT introduce palette DnD, selection, connections, properties editing, history, serialization UI, or run simulation.
- U1 MUST NOT add node types beyond Trigger, Action, Condition, Delay, End.

## BR-U1-09 Editor mode
- U1 initializes `editorMode = edit`.
- U1 does not expose view-mode toggle (U8).
