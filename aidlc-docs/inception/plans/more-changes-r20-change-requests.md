# More Changes R20 — Change Requests (direct implement)

**Source**: `more-changes-r20-clarification-questions.md`  
**Answers**: Q1=animation not good — match https://app.workflowbuilder.io/ · Q2=implement · Q3=A

## Reference behavior (from app.workflowbuilder.io SDK)

- Collapsed sidebar: `height: min-content; width: auto` (chip = header only)
- Expanded sidebar: `height: 100%; width: fixed` (e.g. `--wb-sidebar-expanded-width: 20rem`)
- Body content mounted only when expanded (no long CSS morph)
- Header always present with `gap: 0.75rem` + space-between

## Rules

- [x] Remove long `grid-template-rows` open/close morph
- [x] Match reference sizing model (min-content/auto ↔ 100%/fixed)
- [x] Keep title header always; body mounts/unmounts with expand
- [x] Same on Nodes Library and Properties

## Notes

- Files: `left-sidebar.component.ts`, `right-sidebar.component.ts`
