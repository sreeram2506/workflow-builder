# More Changes R27 — Change Requests (direct implement)

**Source**: `more-changes-r27-clarification-questions.md`  
**Answers**: Q1=SVG colors → card theme; fix improper shapes · Q2=A · Q3=A

## Rules

- [x] Shape fills use card theme (`--wb-bg-elevated` + `--wb-border`), glyphs use accent
- [x] Condition accent aligned with theme blue (`--wb-node-condition` = accent)
- [x] Condition = classic diamond; Router = regular flat-top hexagon; Repeater = rounded square
- [x] Remove solid purple fill / ring / badge clutter

## Notes

- Files: `workflow-node.component.ts`, `tokens.css`
- Hard-refresh local app after pull
