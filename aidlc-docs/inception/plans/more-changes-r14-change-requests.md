# More Changes R14 — Change Requests (direct implement)

**Source**: `more-changes-r14-clarification-questions.md`  
**Answers**: Q1=expand-from-top (not side open) for both sidebars · Q2=just implement · Q3=A  
**Reference**: https://app.workflowbuilder.io/ + closed/open screenshots

## Rules

- [x] Nodes Library expands **down from the chip** (scaleY from top), not a side drawer
- [x] Properties uses the **same expand-from-top** motion (origin top-right)
- [x] Slower expand (~680ms ease-out); chip appears after collapse
- [x] Open header uses sidebar icon (matches closed chip / reference)

## Notes

- Files: `left-sidebar.component.ts`, `right-sidebar.component.ts`
