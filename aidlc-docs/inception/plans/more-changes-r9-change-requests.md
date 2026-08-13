# More Changes R9 — Change Requests (direct implement)

**Source**: `more-changes-r9-clarification-questions.md`  
**Answers**: Q1=undo/redo icons · Q2=just implement · Q3=one item  
**Reference**: chat screenshot (curved U-turn undo / redo)

## Rules

- [x] Replace filled circular-arrow undo/redo glyphs with stroke **U-turn** icons
- [x] Keep undo/redo buttons beside Layout controls in canvas chrome
- [x] Icons match reference: horizontal stem + curve + arrowhead (left = undo, right = redo)

## Notes

- File: `src/app/features/canvas/zoom-controls.component.ts`
- Behavior unchanged (still wired to `facade.undo()` / `facade.redo()`)
