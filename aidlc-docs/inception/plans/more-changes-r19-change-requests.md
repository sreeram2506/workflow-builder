# More Changes R19 — Change Requests (direct implement)

**Source**: `more-changes-r19-clarification-questions.md`  
**Answers**: Q1=gap after icon (match screenshot); add gap between text & icon; same as reference · Q2=implement · Q3=A  
**Screenshot**: reference contracted Nodes Library chip

## Root cause

Collapsed chip used `width: max-content` while the hidden body still contributed intrinsic width, so the header stretched wide and looked like a large gap after the icon.

## Rules

- [x] Collapsed width from header only (`fit-content`; body width collapsed to 0)
- [x] Add clear gap between title and icon (~0.75rem)
- [x] Balanced padding after icon (match reference chip)
- [x] Same on Nodes Library and Properties

## Notes

- Files: `left-sidebar.component.ts`, `right-sidebar.component.ts`
