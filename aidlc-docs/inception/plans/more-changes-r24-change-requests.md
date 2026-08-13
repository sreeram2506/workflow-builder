# More Changes R24 — Change Requests (direct implement)

**Source**: `more-changes-r24-clarification-questions.md`  
**Answers**: Q1=A dragged Condition/Router/Repeater still look like cards · Q2=A · Q3=A

## Rules

- [x] Fix shape rendering reactivity (`computed()` from signal inputs)
- [x] Make SVG shapes visually distinct (gradient fill, stronger stroke; no card chrome)
- [x] Keep Condition=rhombus, Router=hexagon, Repeater=rounded+loop
- [x] Update seed/app.spec for Router + Repeater (7 nodes / 6 edges)

## Notes

- Files: `workflow-node.component.ts`, `mock-workflow.repository.ts`, `app.spec.ts`
- Hard-refresh local app after pull so HMR picks up the component rewrite
