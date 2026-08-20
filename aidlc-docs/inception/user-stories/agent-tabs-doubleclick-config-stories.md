# User Stories — Agent tabs doubleClick config

**Breakdown**: Hybrid — feature stories with host and author AC  
**Granularity**: Standard (5 stories)  
**AC style**: Gherkin  
**Personas**: P-HOST, P-AUTHOR, P-REVIEWER (`personas.md`)  
**Requirements**: `agent-tabs-doubleclick-config-requirements.md` FR-DC-01..08  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  

**Locked policies**
- Path: `agentTabs.doubleClick` (default `true`)
- Gates **canvas** Blank Agent / AIAgent double-click only
- Independent of `agentTabs.enabled`
- Both false: no nested enter from builder chrome
- Chip single-click still enters when the strip is on
- Nested canvas dblclick still does not re-enter
- Same merge: defaults → JSON → provider → `[ui]` (sticky)
- No secrets in examples

---

## Persona ↔ Story Mapping

| Story | P-HOST | P-AUTHOR | P-REVIEWER |
|---|---|---|---|
| US-DC-01 Default / omit still enters | ● | ● | ○ |
| US-DC-02 Flag false blocks canvas dblclick | ● | ● | ● |
| US-DC-03 Independent of strip; both false = no enter | ● | ● | ○ |
| US-DC-04 Chip click still enters; nested no re-enter | ○ | ● | ○ |
| US-DC-05 Embed/JSON documents the leaf | ● | ○ | ○ |

● = primary · ○ = secondary / sees result

---

## Traceability FR ↔ US

| FR | Stories |
|---|---|
| FR-DC-01 Feature leaf | US-DC-01 |
| FR-DC-02 Merge precedence | US-DC-01, US-DC-05 |
| FR-DC-03 Canvas double-click gated | US-DC-01, US-DC-02 |
| FR-DC-04 Independent of strip chrome | US-DC-03 |
| FR-DC-05 Chip single-click unchanged | US-DC-04 |
| FR-DC-06 Nested canvas no re-enter | US-DC-04 |
| FR-DC-07 View mode | US-DC-02 |
| FR-DC-08 Embed / examples | US-DC-05 |

---

## INVEST check

| Story | I | N | V | E | S | T |
|---|---|---|---|---|---|---|
| US-DC-01 | ● | ● | ● | ● | ● | ● |
| US-DC-02 | ● | ● | ● | ● | ● | ● |
| US-DC-03 | ● | ● | ● | ● | ● | ● |
| US-DC-04 | ● | ● | ● | ● | ● | ● |
| US-DC-05 | ● | ● | ● | ● | ● | ● |

---

## US-DC-01 — Omitted / true keeps canvas double-click enter

**As a** Host Integrator  
**I want** `agentTabs.doubleClick` to default to true and merge like other chrome  
**So that** existing hosts keep today’s double-click enter without a new required key  

**FR**: FR-DC-01, FR-DC-02, FR-DC-03 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```text
Given the host omitted agentTabs.doubleClick
And the solution canvas shows an AIAgent node
When the author double-clicks that node
Then the app navigates to /agent/:nodeId
And the nested agent canvas is shown
```
```text
Given the host set agentTabs.doubleClick to true via JSON, provideWorkflowBuilderUi, or [ui]
When the author double-clicks an AIAgent on the solution canvas
Then the nested canvas opens
```
```text
Given instance [ui] on wb-shell-layout includes agentTabs.doubleClick false
When the routed nested shell omits [ui]
Then the sticky overlay still applies (same as agentTabs.enabled)
```

---

## US-DC-02 — False blocks canvas double-click (edit and view)

**As a** Workflow Author  
**I want** canvas double-click not to enter an agent when the host set `doubleClick` false  
**So that** selection and drag still work without opening `/agent/:id`  

**FR**: FR-DC-03, FR-DC-07 · **Persona**: P-AUTHOR, P-REVIEWER, P-HOST  

**Acceptance criteria**
```text
Given effective agentTabs.doubleClick is false
And the solution canvas shows an AIAgent node
When the author double-clicks that node
Then the app does not navigate to /agent/:nodeId
And the solution canvas stays mounted
And node selection / drag still work
```
```text
Given editor mode is view
And effective agentTabs.doubleClick is true
When a reviewer double-clicks an AIAgent on the solution canvas
Then the nested canvas opens
And nested graph edits remain blocked
```
```text
Given editor mode is view
And effective agentTabs.doubleClick is false
When a reviewer double-clicks an AIAgent on the solution canvas
Then the app does not navigate
```

---

## US-DC-03 — Independent of the tab strip; both false means no builder enter

**As a** Host Integrator  
**I want** `agentTabs.enabled` and `agentTabs.doubleClick` to be independent  
**So that** I can hide the strip, disable dblclick, or both  

**FR**: FR-DC-04 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```text
Given agentTabs.enabled is false
And agentTabs.doubleClick is true
When the author double-clicks an AIAgent on the solution canvas
Then the nested canvas opens
And the agent tab strip is not shown
```
```text
Given agentTabs.enabled is true
And agentTabs.doubleClick is false
When the author double-clicks an AIAgent on the solution canvas
Then the app does not navigate
```
```text
Given agentTabs.enabled is false
And agentTabs.doubleClick is false
When the author double-clicks an AIAgent on the solution canvas
Then the app does not navigate
And no chip strip is shown
And no other builder chrome enters the nested agent
```

---

## US-DC-04 — Chip click still enters; nested canvas does not re-enter

**As a** Workflow Author  
**I want** tab chips to keep opening the nested canvas when the strip is on  
**So that** turning off canvas dblclick does not remove chip enter  

**FR**: FR-DC-05, FR-DC-06 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```text
Given agentTabs.enabled is true
And agentTabs.doubleClick is false
And an agent chip is visible
When the author clicks that chip
Then the app navigates to that agent's nested canvas
```
```text
Given the author is on a nested agent canvas
When they double-click a node on that canvas
Then the app does not navigate to another nested agent
```

---

## US-DC-05 — Embed docs and JSON examples include the leaf

**As a** Host Integrator  
**I want** embed docs and chrome JSON examples to list `agentTabs.doubleClick`  
**So that** a parent can pass the flag the same way as other chrome  

**FR**: FR-DC-08, FR-DC-02 · **Persona**: P-HOST  

**Acceptance criteria**
```text
Given docs/workflow-builder-ui-embed.md
When a host reads agentTabs
Then agentTabs.doubleClick is documented as canvas enter-on-dblclick (default true)
And it is independent of agentTabs.enabled
And a provideWorkflowBuilderUi example shows agentTabs: { enabled, doubleClick }
And no secrets are added to examples
```
```text
Given src/assets/examples/wb-ui-config.all-on.json and wb-ui-config.all-off.json
When a host copies those files
Then agentTabs.doubleClick is true in all-on and false in all-off
```
```text
Given the host did not register path agent/:nodeId
When canvas dblclick is allowed
Then enter still has no nested shell to mount (existing host-route requirement)
```
