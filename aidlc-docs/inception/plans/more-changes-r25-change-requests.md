# More Changes R25 — Change Requests (direct implement)

**Source**: `more-changes-r25-clarification-questions.md`  
**Answers**: Q1=replace yellow SVG accents + Condition shape per chat screenshot · Q2=A · Q3=A  
**Reference image**: chat screenshot (rounded purple diamond, white branch icon, label below)

## Rules

- [x] Change logic-node accent from amber/yellow to purple (`--wb-node-condition`)
- [x] Restyle Condition as rounded diamond (rotated rounded square), solid fill, white branch glyph
- [x] Add small automation badge on Condition (matches reference)
- [x] Place shaped-node labels below the SVG (not overlaid)
- [x] Solid-fill Router (hexagon) + Repeater with white glyphs (no yellow gradient)

## Notes

- Files: `tokens.css`, `workflow-node.component.ts`, `node-visuals.ts`
- Hard-refresh local app after pull
