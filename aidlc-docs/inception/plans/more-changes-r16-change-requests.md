# More Changes R16 — Change Requests (direct implement)

**Source**: `more-changes-r16-clarification-questions.md`  
**Answers**: Q1=title always visible; only body expands/contracts on icon toggle · Q2=implement · Q3=one item

## Rules

- [x] Remove separate chip ↔ panel swap (no title disappear / reappear)
- [x] Persistent header: title + toggle icon always mounted
- [x] Only body expands/contracts (`grid-template-rows` 0fr ↔ 1fr)
- [x] Same behavior on Nodes Library and Properties

## Notes

- Files: `left-sidebar.component.ts`, `right-sidebar.component.ts`
