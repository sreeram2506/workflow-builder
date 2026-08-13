# More Changes R15 — Change Requests (direct implement)

**Source**: `more-changes-r15-clarification-questions.md`  
**Answers**: Q1=no shrink/flicker; panel stays full-size; reveal from chip · Q2=implement · Q3=A

## Rules

- [x] Remove `scaleY` squash (content no longer shrinks on close)
- [x] Use `clip-path` reveal from top for Nodes Library + Properties
- [x] Reduce open flicker: chip hides immediately; reappears after clip closes
- [x] Same behavior on both sidebars

## Notes

- Files: `left-sidebar.component.ts`, `right-sidebar.component.ts`
