# Logic Node Properties — Requirement Verification Questions

**Increment**: Condition / Router / Repeater properties and edge rules (enso-suite model)  
**Phase**: INCEPTION — Requirements Analysis  
**Do not implement code until this file is answered and requirements are approved.**

Fill each `[Answer]:` with a letter (and a short note if you pick X). Reply in chat when done (e.g. `answered`).

Reference: enso-suite skill `.cursor/skills/enso-logic-nodes/SKILL.md`

---

## Question 1

What should this increment include?

A) Properties panel only (Condition, Router, Repeater fields when those nodes are selected)

B) Properties panel plus canvas/edge rules (Condition max 2 outs labeled true/false; Router outgoing edges get Name + Condition)

C) Full enso-suite parity, including save-blocking validation messages and duplicate-name rules

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2

How should a **Condition** node be configured in Properties?

A) Match enso-suite: Name (required) + Condition expression (required free-text). Drop subtitle/status/Ignore Keys for this type.

B) Keep current General fields (label, subtitle, status) and ADD a Condition expression field

C) Label only this increment (no expression field yet)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 3

How should **Router** (`Decision` type, label Router) work?

A) Match enso-suite: Router node has Name only. Each outgoing edge from a Router has Name + Condition. Clicking those edges opens Connector Properties.

B) Conditions live on the Router node as a list of routes (not on edges)

C) Same as Condition: expression on the node, true/false edges only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

Condition **outgoing edges** — what should the canvas enforce?

A) Enforce now: maximum 2 outgoing edges, auto-label `true` then `false`, no free-text condition on those edges

B) Auto-label `true`/`false` when connecting, but do not block a third edge yet

C) No special Condition edge rules this increment

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

Repeater configuration depth? (This app is still frontend-only / mock data.)

A) Mock Enso-like fields: Name (required), Workflow/Agent dropdown (mock list), Version (depends on picker), Pause toggle. No live API.

B) Name + Pause only this increment

C) Call live Enso `getSkills` (Workflow Manipulation) like enso-suite

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6

The locked v1 field **Ignore Keys in Paragraph** currently appears on every node type. For Condition / Router / Repeater:

A) Hide it; replace with the type-specific fields from Q2–Q5

B) Keep it AND add type-specific fields

C) Hide it only on those three types; keep it on all other node types

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7

Duplicate names?

A) Match enso-suite: Condition names may repeat; Router and Repeater names must be unique

B) All canvas node names must be unique

C) No uniqueness checks this increment

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8

Source of truth for behavior vs visuals?

A) enso-suite behavior and field set; keep current workflow-builder visual style (shapes already match)

B) Match workflowbuilder.io instead of enso-suite

C) Blend case-by-case (describe in X if you need a mix other than A)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9

Should existing extension configuration stay for this increment?

Current: Security Baseline = No; Resiliency Baseline = Yes (DR N/A); Property-Based Testing = Partial + fast-check.

A) Keep the current extension configuration (skip Q10–Q12)

B) Re-decide extensions in Q10–Q12

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 10

Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 11

Should the resiliency baseline be applied to this project?

A) Yes — apply the resiliency baseline as directional best practices and design-time guidance

B) No — skip the resiliency baseline

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 12

Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints

B) Partial — enforce PBT rules only for pure functions and serialization round-trips

C) No — skip all PBT rules

X) Other (please describe after [Answer]: tag below)

[Answer]: B
