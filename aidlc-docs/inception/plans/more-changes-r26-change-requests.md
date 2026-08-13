# More Changes R26 — Change Requests (direct implement)

**Source**: `more-changes-r26-clarification-questions.md`  
**Answers**: Q1=icons too large; match chat screenshot SVG · Q2=A · Q3=A  
**Reference image**: chat screenshot (compact purple rounded diamond + small branch icon + badge)

## Rules

- [x] Shrink logic node bounding box (`LOGIC_NODE_SIZE` 148 → 96)
- [x] Scale down Condition / Router / Repeater center glyphs
- [x] Refine Condition SVG: soft ring, compact left/up/right-curve icon, cutout bolt badge
- [x] Slightly smaller shaped-node handles + label under shape

## Notes

- Files: `viewport.math.ts`, `workflow-node.component.ts`
- Hard-refresh local app after pull
