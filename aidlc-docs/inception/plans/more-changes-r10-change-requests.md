# More Changes R10 — Change Requests (direct implement)

**Source**: `more-changes-r10-clarification-questions.md`  
**Answers**: Q1=dark/light theme icons · Q2=just implement · Q3=one item  
**Reference**: chat screenshot (sun | moon pill toggle)

## Rules

- [x] Replace single sun/moon icon button with **pill theme toggle**
- [x] Left = sun, right = moon; sliding thumb highlights active side
- [x] Active icon uses accent color; inactive muted
- [x] Wired in top bar via `wb-theme-toggle`

## Notes

- Files: `theme-toggle.component.ts`, `top-bar.component.ts`
- Behavior unchanged (`facade.toggleTheme()`)
