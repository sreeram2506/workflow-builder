# Requirements — Hide nested Solution Back

**Increment**: More Changes R63  
**Answers**: Q1=A · Q2=A · Q3=A · Q4=A  
**Source**: `aidlc-docs/inception/plans/more-changes-r63-clarification-questions.md`

## Functional

- **FR-01**: The nested **Solution** Back pill (`data-testid="nested-back-to-solution"`) MUST NOT render when `agentTabs.enabled` is false and `agentTabs.doubleClick` is true.
- **FR-02**: The same pill MUST still render when `agentTabs.enabled` is false and `agentTabs.doubleClick` is false (U-AE-01 hosts without parent breadcrumb).
- **FR-03**: When the agent tab strip is on (`agentTabs.enabled` true), the strip Solution chip is unchanged. This increment does not hide it.
- **FR-04**: When FR-01 hides the pill and the top bar is also off, the nested header overlay MUST NOT remain as an empty bar.

## Non-functional

- No new chrome leaf. Existing `agentTabs.enabled` + `agentTabs.doubleClick` encode the combo.
- Same merge layers as R62. No secrets in UI config or docs.

## Out of scope

- Parent-app breadcrumb implementation
- npm publish / OTP for `enso-workflow-builder@0.1.1`
