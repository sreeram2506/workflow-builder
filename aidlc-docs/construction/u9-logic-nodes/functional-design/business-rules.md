# Business Rules — U9 Logic Nodes

U5 rules still apply except **BR-U5-09** (no edge properties) which this unit **supersedes** for logic edges. **BR-U5-04** locked one Ignore Keys field for every type: this unit hides that field on Condition, Decision, and Repeater and adds type-specific descriptors.

## BR-U9-01 — Condition node fields
- General: label (required), subtitle, status
- Configuration: `Condition` string, required, `config_path` = `condition`
- Ignore Keys hidden
- Save disabled while label or condition is empty (inline errors)

## BR-U9-02 — Router node fields
- Type id `Decision`; UI label Router
- General only; no node-level condition
- Ignore Keys hidden
- Label required
- Label must be unique vs other Router and Repeater labels (trim, case-sensitive), excluding self
- Conditions may share labels with anyone

## BR-U9-03 — Repeater node fields
- General + uniqueness same set as Router (BR-U9-02)
- `repeater.workflowId` required (mock select)
- `repeater.versionId` required; options depend on workflowId
- Changing workflowId clears versionId
- `repeater.is_paused` boolean, default false
- Ignore Keys hidden
- No HTTP

## BR-U9-04 — Ignore Keys visibility
- Condition, Decision, Repeater: do not render Ignore Keys
- Other types: unchanged U5 descriptor

## BR-U9-05 — Condition outgoing edges
- Maximum 2 outgoing edges
- Labels only `true` and `false`
- `nextConditionOutLabel`: if no outgoing labeled `true` (after trim), next is `true`; else if no `false`, next is `false`; else reject
- Reject does not add an edge; no toast
- Selecting a Condition out: label read-only; no condition editor

## BR-U9-06 — Router outgoing edges
- Unlimited count
- On create: `label = 'Blank Condition'`, `condition = ''`
- Connector Properties: Name maps to `edge.label` (required); Condition maps to `edge.condition` (required, trim not empty)
- Save disabled while either empty
- Non-Router, non-Condition edges: existing Connection panel; no condition field

## BR-U9-07 — Persist
- Node: Save → `patchNode` only
- Router connector: Save → `patchEdge` only
- Discard unsaved on selection change
- View mode: disabled controls, no Save, no connect

## BR-U9-08 — Serialize
- `node.data.condition`, `node.data.repeater.*`, `edge.condition` round-trip in-memory serialize
- Missing `edge.condition` deserializes as `''`
- Missing repeater object: treat workflowId/versionId empty, is_paused false

## BR-U9-09 — Registry invariant
- `assertRegistryV1Invariant` applies only to non-logic types (not Condition, Decision, Repeater)
- Logic types have type-specific `configurationFields`

## BR-U9-10 — Mock catalog (Q7)
Static, no fetch. At least:
- Claims Intake (2 versions)
- Policy Check (1 version)
- Notify Desk (2 versions)

## BR-U9-11 — Errors
- Inline under controls only
- Third Condition connect: silent (no banner required)
- `routeEdges` control is not a Router node
