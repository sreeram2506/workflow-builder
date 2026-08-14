# User Stories — Logic Node Properties Increment

**Breakdown**: Feature-based  
**Granularity**: Medium (one story per distinct capability)  
**AC style**: Gherkin for core flows; bullets for field lists  
**Personas**: P-AUTHOR, P-REVIEWER (existing `personas.md`; no new persona file)  
**Requirements**: `logic-nodes-requirements.md` FR-LN-01..08  
**Additive**: Does not replace Phase 1–10 stories in `stories.md`

**Router** means node type `Decision` (palette label Router).  
**`routeEdges`** (orthogonal pathfinding) is out of scope.

---

## Persona ↔ Story Mapping

| Story | P-AUTHOR | P-REVIEWER |
|---|---|---|
| US-LN-01 Condition properties | ● | ○ inspect in US-LN-07 |
| US-LN-02 Router properties | ● | ○ |
| US-LN-03 Repeater mock config | ● | ○ |
| US-LN-04 Condition outgoing edges | ● | Locked connect |
| US-LN-05 Router connector edges | ● | Locked connect |
| US-LN-06 Unique Router/Repeater names | ● | ○ |
| US-LN-07 View-mode inspect | ○ toggle | ● |

● = primary actor · ○ = secondary / N/A

---

## US-LN-01 — Configure a Condition node

**As a** Workflow Author  
**I want** to set a Condition name and expression in Properties  
**So that** the branch rule lives on the node, like enso-suite  

**FR**: FR-LN-01, FR-LN-06, FR-LN-07 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given I am in edit mode and I select a Condition node
When Properties opens
Then I see General fields: label, subtitle, status
And I see a Condition expression text field
And I do not see Ignore Keys in Paragraph
```
```
Given the Condition expression or label is empty
When I try to Save Properties
Then Save stays disabled
And I see an inline error (no toast)
```
```
Given I enter a label and a condition expression and Save
When the node is serialized and loaded in memory
Then node.data.condition round-trips unchanged
```
- Label maps to the node name (required)
- Expression is free-text; no query builder
- Other types (Trigger, Action, Delay, End, Notification, AIAgent) still show Ignore Keys

---

## US-LN-02 — Configure a Router node

**As a** Workflow Author  
**I want** Router Properties to hold the Router name only  
**So that** path conditions stay on outgoing connectors, not on the node  

**FR**: FR-LN-02, FR-LN-06 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given I am in edit mode and I select a Router (Decision) node
When Properties opens
Then I see General fields: label, subtitle, status
And I do not see a node-level Condition expression field
And I do not see Ignore Keys in Paragraph
```
```
Given the Router label is empty
When I try to Save Properties
Then Save stays disabled
And I see an inline error
```
- Display name in the UI is Router; type id remains Decision
- Must not be confused with the Route Edges / `routeEdges` zoom control

---

## US-LN-03 — Configure a Repeater node

**As a** Workflow Author  
**I want** to pick a mock workflow/agent, version, and pause flag  
**So that** the Repeater describes what to loop without calling Enso  

**FR**: FR-LN-03, FR-LN-07 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given I am in edit mode and I select a Repeater node
When Properties opens
Then I see General fields: label, subtitle, status
And I see a Workflow/Agent dropdown populated from a mock list
And I see a Version dropdown
And I see a Pause toggle defaulting to off
And I do not see Ignore Keys in Paragraph
```
```
Given I change Workflow/Agent
When the Version dropdown refreshes
Then the previous Version value is cleared
And Version options belong to the newly selected Workflow/Agent
```
```
Given label, Workflow/Agent, or Version is empty
When I try to Save Properties
Then Save stays disabled
And I see inline errors
```
```
Given I Save Repeater properties
When the workflow is serialized in memory
Then workflow/agent id, version, and is_paused round-trip
```
- Must not call live Enso `getSkills` or any HTTP API
- Pause applies only to Repeater in this increment

---

## US-LN-04 — Branch from a Condition with true/false edges

**As a** Workflow Author  
**I want** a Condition to allow only two outgoing edges labeled true and false  
**So that** the binary branch matches enso-suite  

**FR**: FR-LN-04 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given a Condition has no outgoing edges
When I complete a connection from that Condition to another node
Then the new edge label is true
```
```
Given a Condition already has one outgoing edge labeled true
When I complete a second connection from that Condition
Then the new edge label is false
```
```
Given a Condition already has two outgoing edges
When I try to complete a third connection from that Condition
Then the new edge is not added
And the graph is left as it was (no dangling connector)
```
```
Given I select an outgoing edge from a Condition
When Connection properties open
Then the label is read-only true or false
And there is no Condition expression field on that edge
```
- Connecting from non-Condition nodes is unchanged
- No toast required for the rejected third edge

---

## US-LN-05 — Attach named conditions to Router edges

**As a** Workflow Author  
**I want** each outgoing edge from a Router to have a name and a condition  
**So that** I can fan out to more than two paths  

**FR**: FR-LN-05, FR-LN-07 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given I complete a connection whose source is a Router
When the edge is created
Then it may have an empty name and empty condition
And I can create more than two outgoing edges from that Router
```
```
Given I select an outgoing edge whose source is a Router
When Connector Properties open
Then I see Name (edge label) required
And I see Condition (free-text) required
And Save stays disabled while either is empty
```
```
Given I Save Name and Condition on a Router edge
When the workflow is serialized in memory
Then edge.label and edge.condition round-trip
```
```
Given I select an edge whose source is not a Router and not a Condition
When Connection properties open
Then I see the existing panel (id, source, target, label)
And I do not see a Condition expression field
```
- Any number of Router outs is allowed
- Condition text is free-text; no query builder

---

## US-LN-06 — Keep Router and Repeater names unique

**As a** Workflow Author  
**I want** duplicate Router or Repeater names rejected  
**So that** those tasks stay identifiable, matching enso-suite  

**FR**: FR-LN-02, FR-LN-03 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given a Router named ClaimsRoute already exists
When I set another Router or Repeater label to ClaimsRoute and Save
Then Save stays disabled
And I see an inline uniqueness error
```
```
Given two Condition nodes share the same label
When I Save either Condition
Then uniqueness does not block Save
```
- Uniqueness compares Router and Repeater labels together
- Conditions are excluded from that uniqueness set
- No Enso toast copy

---

## US-LN-07 — Inspect logic properties in view mode

**As a** Workflow Reviewer  
**I want** to see Condition, Router, Repeater, and connector fields without editing them  
**So that** I can review branching without changing the graph  

**FR**: FR-LN-08 · **Persona**: P-REVIEWER (P-AUTHOR may toggle into view)  

**Acceptance criteria**
```
Given editor mode is view
When I select a Condition, Router, or Repeater
Then Properties shows the type-specific fields
And all controls are disabled or read-only
And Save is not available
```
```
Given editor mode is view
When I select a Router outgoing edge
Then Connector Name and Condition are visible and read-only
```
```
Given editor mode is view
When I try to draw a new edge from a Condition or Router
Then connecting is locked (existing view-mode canvas lock)
```

---

## Out of scope (must not appear as stories)

- Live Enso API / Workflow Manipulation skills
- Enso toast strings and save-diagram blocking toasts
- Changing Condition / Router / Repeater SVG shapes
- Changing `routeEdges` pathfinding
- Query-builder UI for expressions
- Pause on non-Repeater nodes

---

## INVEST check

| Story | I | N | V | E | S | T |
|---|---|---|---|---|---|---|
| US-LN-01 | Y | Y | Y | Y | Y | Y |
| US-LN-02 | Y | Y | Y | Y | Y | Y |
| US-LN-03 | Y | Y | Y | Y | Y | Y |
| US-LN-04 | Y | Y | Y | Y | Y | Y |
| US-LN-05 | Y | Y | Y | Y | Y | Y |
| US-LN-06 | Y | Y | Y | Y | Y | Y |
| US-LN-07 | Y | Y | Y | Y | Y | Y |
