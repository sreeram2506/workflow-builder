# Requirements — Logic Node Properties (Condition / Router / Repeater)

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | Wire enso-suite Condition / Router / Repeater properties and edge rules into workflow-builder, through AI-DLC phases only |
| **Request type** | Enhancement (brownfield increment on U5 Properties + U2 canvas) |
| **Scope** | Multiple components: schema, Properties panel, edge panel, connection rules, tests |
| **Complexity** | Moderate |
| **Requirements depth** | Standard |
| **Answers** | Q1=B Q2=B Q3=A Q4=A Q5=A Q6=A Q7=A Q8=A Q9=A (extensions unchanged; Q10=B Q11=A Q12=B recorded) |
| **Answered by** | Agent, authorized by user ("you can aswer right ?") |

**Not in this increment:** live Enso APIs, enso toast copy, save-blocking toasts, `routeEdges` changes.

---

## 1. Goal

Make Condition, Router (`Decision`), and Repeater behave like enso-suite logic nodes: type-specific properties and connection rules. Keep workflow-builder visual style. Keep existing General fields (label, subtitle, status).

**Router is not `routeEdges`.** `routeEdges` stays orthogonal pathfinding.

---

## 2. Confirmed Decisions

| Topic | Choice |
|---|---|
| Source of truth | enso-suite behavior; current builder visuals |
| Scope | Properties + canvas/edge rules |
| Condition node | General + required free-text `condition` |
| Router node | General only (no node-level condition) |
| Router edges | Name (edge label) + required condition |
| Condition edges | Max 2 outs; auto `true` then `false`; no expression on those edges |
| Repeater | Mock Workflow/Agent, Version (depends on picker), Pause. No live API |
| Ignore Keys | Hidden on Condition / Router / Repeater; remains on other types |
| Duplicate names | Condition may repeat; Router and Repeater labels unique |
| Validation UX | Inline errors (existing U5 pattern), not enso toasts |
| Backend | None |
| Extensions | Security No; Resiliency Yes (DR N/A); PBT Partial |

---

## 3. Functional Requirements

### FR-LN-01 Condition properties

When the selected node type is `Condition`:

- Show General: label (required), subtitle, status
- Show **Condition** (required free-text), stored at `node.data.condition`
- Do not show Ignore Keys in Paragraph
- Save stays disabled while label or condition is empty

### FR-LN-02 Router properties

When the selected node type is `Decision` (UI label Router):

- Show General only
- Do not show a node-level condition field
- Do not show Ignore Keys in Paragraph
- Label required; uniqueness vs other Router and Repeater labels (not vs Conditions)

### FR-LN-03 Repeater properties

When the selected node type is `Repeater`:

- Show General: label required (unique vs other Router/Repeater labels)
- Show mock **Workflow/Agent** dropdown (static mock list)
- Show **Version** dropdown; options depend on selected Workflow/Agent; reset when parent changes
- Show **Pause** toggle (`node.data.is_paused`, default false)
- Do not show Ignore Keys in Paragraph
- Workflow/Agent and Version required

### FR-LN-04 Condition outgoing edges

When the user completes a connection whose source is a Condition:

- If the Condition already has 2 outgoing edges, reject the new edge (inline / canvas feedback, no toast required)
- Otherwise add the edge and set `edge.label` to `true` if no true out exists, else `false`
- Selecting that edge shows Connection properties with a read-only label (`true`/`false`) and **no** condition text field

### FR-LN-05 Router outgoing edges (connectors)

When the user completes a connection whose source is a Router (`Decision`):

- Initialize `edge.label` to empty (or `Blank Condition`) and `edge` condition storage empty
- Selecting that edge shows **Connector Properties**: Name (maps to `edge.label`, required) and Condition (required free-text)
- Store condition on the edge (e.g. extend `WorkflowEdge` with `condition: string`, default `''`)
- Edges whose source is **not** Router keep the current Connection panel (id, source, target, label) with no condition field

### FR-LN-06 Other node types

Trigger, Action, Delay, End, Notification, AIAgent keep the current General + Ignore Keys configuration. No change to their connection rules.

### FR-LN-07 Persistence

- Node/edge patches apply only on Properties Save (existing U5 rule)
- Condition expression, Repeater mock fields, pause, and Router-edge condition must round-trip through in-memory serialize/deserialize
- No localStorage, no API

### FR-LN-08 Editor mode

View mode: fields visible and disabled; Save hidden (existing U5).

---

## 4. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-LN-01 | Frontend-only; mock catalogs; no Enso HTTP |
| NFR-LN-02 | Relax or scope `assertRegistryV1Invariant` so logic types may have type-specific descriptors |
| NFR-LN-03 | PBT Partial: pure helpers (max-2 outs, true/false assignment, uniqueness, dependent version reset) |
| NFR-LN-04 | Existing unit tests updated; new tests for FR-LN-01..05 |
| NFR-LN-05 | No new npm libraries |
| NFR-LN-06 | Resiliency baseline: N/A for infra/DR; client validation must not leave the graph in an invalid connect state after a rejected third Condition edge |
| NFR-LN-07 | Security baseline: not enforced |

---

## 5. Out of Scope

- Live Enso `getSkills` / Workflow Manipulation
- Enso toast strings and save-diagram blocking toasts
- Changing Router/Condition/Repeater SVG shapes
- Changing `routeEdges` algorithm
- Query-builder UI for condition expressions
- Pause on non-Repeater nodes

---

## 6. Success Criteria

1. Condition selected: General + Condition expression; Ignore Keys hidden
2. Router selected: General only; Ignore Keys hidden
3. Repeater selected: General + mock Workflow/Agent, Version, Pause; Ignore Keys hidden
4. Third outgoing edge from a Condition is rejected; first two labeled true/false
5. Edge from Router shows Name + Condition; Save requires both
6. Duplicate Router or Repeater label blocks Save with inline error
7. `npm test` and `npm run build` pass

---

## 7. Traceability

| Answer | Requirement |
|---|---|
| Q1 B | FR-LN-01..05 |
| Q2 B | FR-LN-01 |
| Q3 A | FR-LN-02, FR-LN-05 |
| Q4 A | FR-LN-04 |
| Q5 A | FR-LN-03 |
| Q6 A | FR-LN-01..03, FR-LN-06 |
| Q7 A | FR-LN-02, FR-LN-03 uniqueness |
| Q8 A | Section 1, out of scope shapes |
| Q9 A | NFR-LN-03, NFR-LN-06, NFR-LN-07 |
