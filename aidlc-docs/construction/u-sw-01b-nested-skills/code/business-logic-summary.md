# Business Logic Summary — U-SW-01b

## Created
- `mock-skills.catalog.ts` — 5 static developed skills
- `agent-skills.ts` — ensure/append/remove/withSkillsData
- `agent-skills.spec.ts` — unit + PBT Partial

## Modified
- `workflow.facade.ts` — Router; enterAgentCanvas/exitAgentCanvas; selectAgentTab/Back; nestedWorkflow persist
- `agent-graph.ts` — nested graph helpers on `AIAgent.data.nestedWorkflow`

- `ui.store.ts` — `selectedSkillId`
- Package: `@angular/router@20.3.28`

## Rules
BR-SW01B-01..11 covered at domain/facade layer
