# User Stories — Enter agent without tab bar

**Breakdown**: Hybrid — feature stories with host and author AC  
**Granularity**: Standard (4 stories)  
**AC style**: Gherkin  
**Personas**: P-HOST, P-AUTHOR, P-REVIEWER (`personas.md`)  
**Requirements**: `agent-enter-without-tabs-requirements.md` FR-AE-01..08  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  

**Locked policies**
- Two enter paths: tab chip when `agentTabs.enabled`; double-click AIAgent on solution canvas always
- Nested canvas: double-click must not re-enter
- Single-click does not navigate
- Exit without tab strip: independent Back/Solution on nested shell
- When bar off: do not `openAgentTab`
- View mode still enters; nested edits stay blocked
- `agentTabs.enabled` hides the strip only; it does not gate `/agent/:id` routing

---

## Persona ↔ Story Mapping

| Story | P-HOST | P-AUTHOR | P-REVIEWER |
|---|---|---|---|
| US-AE-01 Double-click enter with bar off; no hidden chips | ● | ● | ○ |
| US-AE-02 Tab chips enter when bar on | ● | ● | ○ |
| US-AE-03 Nested Back; no re-enter; View still enters | ● | ● | ● |
| US-AE-04 Embed/try: bar is chrome | ● | ○ | ○ |

● = primary · ○ = secondary / sees result

---

## Traceability FR ↔ US

| FR | Stories |
|---|---|
| FR-AE-01 Double-click enters | US-AE-01 |
| FR-AE-02 Tab bar still enters | US-AE-02 |
| FR-AE-03 No re-enter inside nested | US-AE-03 |
| FR-AE-04 Back without tab strip | US-AE-03 |
| FR-AE-05 No hidden tabs when bar off | US-AE-01 |
| FR-AE-06 View mode | US-AE-03 |
| FR-AE-07 Chrome flag unchanged | US-AE-01, US-AE-04 |
| FR-AE-08 Embed / try | US-AE-04 |

---

## INVEST check

| Story | I | N | V | E | S | T |
|---|---|---|---|---|---|---|
| US-AE-01 | ● | ● | ● | ● | ● | ● |
| US-AE-02 | ● | ● | ● | ● | ● | ● |
| US-AE-03 | ● | ● | ● | ● | ● | ● |
| US-AE-04 | ● | ● | ● | ● | ● | ● |

---

## US-AE-01 — Double-click enters when the tab bar is hidden

**As a** Workflow Author  
**I want** to double-click a Blank Agent / AIAgent on the solution canvas and open its nested canvas even when the host hid the agent tab bar  
**So that** I do not need the tab strip to go inside the agent  

**FR**: FR-AE-01, FR-AE-05, FR-AE-07 · **Persona**: P-AUTHOR, P-HOST  

**Acceptance criteria**
```text
Given agentTabs.enabled is false
And the solution canvas shows an AIAgent node
When the author double-clicks that node
Then the app navigates to /agent/:nodeId
And the nested agent canvas is shown
And the agent tab strip is not shown
```
```text
Given agentTabs.enabled is false
When the author single-clicks or drops an AIAgent
Then no agent tab chips are added
And the app does not navigate (single-click / drop only)
```
```text
Given agentTabs.enabled is true
When the author double-clicks an AIAgent on the solution canvas
Then the nested canvas still opens (same as with the bar off)
```

---

## US-AE-02 — Tab chips still enter when the bar is on

**As a** Workflow Author  
**I want** the existing agent tab bar to keep opening and closing nested canvases  
**So that** the current chip workflow is unchanged when the host leaves tabs on  

**FR**: FR-AE-02 · **Persona**: P-AUTHOR, P-HOST  

**Acceptance criteria**
```text
Given agentTabs.enabled is true
And an agent chip is visible
When the author clicks that chip
Then the app navigates to that agent's nested canvas
```
```text
Given the author is on a nested agent canvas
And the tab strip is shown
When the author clicks the Solution chip
Then the app returns to the solution canvas
```

---

## US-AE-03 — Nested Back without the strip; no re-enter; View still enters

**As a** Workflow Author  
**I want** an in-app Back / Solution control on the nested shell when the tab strip is not mounted  
**So that** I can leave the agent without using the browser Back button  

**FR**: FR-AE-03, FR-AE-04, FR-AE-06 · **Persona**: P-AUTHOR, P-REVIEWER, P-HOST  

**Acceptance criteria**
```text
Given agentTabs.enabled is false
And the author is on /agent/:nodeId
When they activate the nested Back / Solution control
Then the app returns to the solution canvas
And that control does not require agent tab chips to exist
```
```text
Given the author is on a nested agent canvas
When they double-click a node on that canvas
Then the app does not navigate to another nested agent
```
```text
Given editor mode is view
When a reviewer double-clicks an AIAgent on the solution canvas
Then the nested canvas opens
And nested graph edits remain blocked
```

---

## US-AE-04 — Embed docs: tab bar is chrome, routing is not

**As a** Host Integrator  
**I want** embed (and try, if touched) to say that `agentTabs.enabled` only hides the strip  
**So that** hosts know double-click and nested Back still work with the bar off  

**FR**: FR-AE-08, FR-AE-07 · **Persona**: P-HOST  

**Acceptance criteria**
```text
Given docs/workflow-builder-ui-embed.md (and try notes if the harness is updated)
When a host reads agentTabs.enabled
Then it is described as tab-strip chrome, not a block on /agent/:id
And double-click enter and nested Back / Solution are mentioned
And no secrets are added to examples
```
