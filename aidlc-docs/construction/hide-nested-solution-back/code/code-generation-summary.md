# Code Generation Summary — Hide nested Solution Back

**Increment**: More Changes R63 (Q3=A direct implement)

| File | Change |
|---|---|
| `src/app/features/agent/agent-skills-shell.component.ts` | Nested **Solution** Back only when `!agentTabs.enabled && !agentTabs.doubleClick`. Header overlay does not stay for that pill when it is hidden. |
| `src/app/features/agent/agent-skills-shell.nested-back.spec.ts` | Hide for embed combo; show when dblclick also off; sticky `[ui]` tabs-off + default dblclick hides pill |
| `docs/workflow-builder-ui-embed.md` | Exit rules for the combo |

Library `projects/enso-workflow-builder/src/lib` is a symlink to `src/app`.
