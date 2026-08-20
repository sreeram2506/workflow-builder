# Intent Analysis — Hide nested Solution Back

**Increment**: More Changes R63  
**Request type**: Enhancement (chrome)  
**Scope**: Single component (`wb-agent-skills-shell`) + embed docs + specs  
**Complexity**: Simple  
**Depth**: Minimal (answers locked; Q3=A direct implement)

## User request

When `agentTabs.doubleClick` is on and `agentTabs.enabled` is off, after entering an agent the nested shell must not show the **Solution** pill. The parent may already have a breadcrumb.

## Locked answers (Q1–Q4 all A)

| Q | Decision |
|---|---|
| 1 | Hide only `nested-back-to-solution`. Tab-strip Solution chip stays when the strip is on. |
| 2 | Hide when `agentTabs.enabled === false` **and** `agentTabs.doubleClick === true`. |
| 3 | Direct implement (skip stories / design / NFR stages). |
| 4 | Carry R62 extensions (Security new-code; Resiliency DR N/A; PBT Partial). |

## Show rule

Nested **Solution** Back is shown only when the strip is off **and** canvas dblclick enter is off (`!enabled && !doubleClick`).
