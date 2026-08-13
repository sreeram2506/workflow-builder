# More Changes — Sidebar resize plan (lightweight)

**Source answers**: `more-changes-r11-clarification-questions.md` (re-answered)  
**Q1**: E · **Q2**: B (plan then implement) · **Q3**: A  

**Request**: Nodes Library and Properties sidebars should be **draggable to expand** (hold and drag to resize width).

---

## Scope

| Panel | Behavior |
|-------|----------|
| Nodes Library (left) | When **expanded**, drag a resize grip on the **right** edge to change width |
| Properties (right) | When **expanded**, drag a resize grip on the **left** edge to change width |
| Collapsed | Unchanged (header chip only — no resize) |

## Proposed UX

1. Thin vertical **resize handle** on the inner edge (≈6–8px hit target, `col-resize` cursor).
2. Pointer down on handle → drag → live width update; pointer up → stop.
3. **Clamp** width: min **240px**, max **min(480px, viewport − 48px)**.
4. Default widths stay as today (~280 left / ~300 right) until the user resizes.
5. Remember widths for the session in `UiStore` (no localStorage unless you ask later).

## Out of scope (this pass)

- Dragging the whole panel around the screen (floating)
- Vertical resize / height drag
- Persisting width across page reloads

## Files (expected)

- `left-sidebar.component.ts` — resize grip + width binding
- `right-sidebar.component.ts` — same
- `ui.store.ts` (or equivalent) — `nodesLibraryWidth` / `propertiesWidth` signals

## Checklist (after approval)

- [x] Left sidebar horizontal resize (expanded only)
- [x] Right sidebar horizontal resize (expanded only)
- [x] Clamp min/max; session store widths
- [x] Quick manual verify + unit tests still green

---

**Implemented.** Choose next step below.
