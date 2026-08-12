# More Changes R8 — Change Requests (direct implement)

**Source**: `more-changes-r8-clarification-questions.md`  
**Answers**: Q1=A · Q2=A · Q3=A

## Rules

- [x] **left/top/bottom → left/top/bottom** allowed (input→input)
- [x] **right → left/top/bottom** still allowed (output→input)
- [x] **Anything → right** blocked (cannot connect to output)
- [x] While dragging nodes, edges **keep locked port sides** (no jumping)

## Notes

- Body-drop snaps only to input ports
- `lockEdgePortSides` runs on move and on create without explicit sides
