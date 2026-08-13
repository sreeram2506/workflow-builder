# More Changes R12 — Change Requests (direct implement)

**Source**: `more-changes-r12-clarification-questions.md`  
**Answers**: Q1=theme toggle CSS + sidebar animation · Q2=just implement · Q3=A  
**Reference**: chat screenshot (near-black track, charcoal thumb, blue moon)

## Rules

- [x] Theme pill track/thumb colors match reference (dark track, lighter thumb, muted inactive, accent active)
- [x] Smooth app background transition on theme switch
- [x] Nodes Library + Properties panels animate **upward** (not sideways)
- [x] Sidebar transitions slower (~480ms) and smoother

## Notes

- Files: `theme-toggle.component.ts`, `left-sidebar.component.ts`, `right-sidebar.component.ts`, `styles.css`
