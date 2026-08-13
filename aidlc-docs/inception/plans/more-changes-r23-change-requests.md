# More Changes R23 — Change Requests (direct implement)

**Source**: `more-changes-r23-clarification-questions.md`  
**Answers**: Q1=Condition / Router / Repeater as workflow SVG shapes (not rectangle cards) · Q2=A · Q3=A

## Rules

- [x] Condition → rhombus SVG shape + label
- [x] Router (`Decision`) → hexagon SVG shape + label
- [x] Repeater → rounded SVG shape + loop glyph + label (added to catalog)
- [x] Per-type sizes for ports / edges / minimap / marquee
- [x] Other node types stay rectangle cards

## Notes

- Files: `workflow-node.component.ts`, `node-visuals.ts`, `workflow.models.ts`, `palette.catalog.ts`, `connection.math.ts`, canvas host helpers
