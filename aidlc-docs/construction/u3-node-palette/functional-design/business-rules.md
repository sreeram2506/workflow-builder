# Business Rules — U3 Node Palette

## Catalog & browse

### BR-U3-01 Approved types only
- Palette lists only locked v1 `NodeType` values (US-4.1).

### BR-U3-02 Categories
- Items grouped into expandable categories (Flow / Logic / Integration / AI).
- Collapse/expand is session UI state (not persisted).

### BR-U3-03 Search
- Debounced filter (~150–200ms) on label, type, and description.
- Clear control resets query and shows full categorized list.
- Search matches across categories; empty categories may hide while filtering.

### BR-U3-04 Templates
- Templates control remains disabled / non-functional until explicitly approved later.

## Create node

### BR-U3-05 Drag-drop create
- Palette items use `@angular/cdk/drag-drop`.
- Valid drop target: **canvas viewport only**; drop elsewhere cancels.
- On drop: convert client/screen point → world via current viewport; `facade.createNode(type, worldPoint)`.
- New node selected exclusively after create.
- Default `label` = catalog label; `subtitle` = catalog description; `status: idle`; `data: {}`.

### BR-U3-06 Click-to-add
- Clicking a palette item (without completing a drag) creates a node near **viewport center** (world point under viewport center).
- Same defaults and selection as BR-U3-05.

### BR-U3-07 Ids
- `id` format: `n-{type}-{shortRandom}` (e.g. `n-Action-a3f9`).

### BR-U3-08 Edit mode
- Create only when `editorMode === 'edit'` (view mode lock fully enforced in U8; U3 should no-op create in view if mode is view).

### BR-U3-09 Canvas node move unchanged
- Existing canvas node dragging stays custom pointer logic (U2); CDK not used for canvas moves.

## Non-goals (U3)

### BR-U3-10 Out of scope
- Drawing new edges / handle drag (U4)
- Properties form editing (U5)
- Undo/history (U7)
- Opening Properties panel on create (explicitly not selected)
