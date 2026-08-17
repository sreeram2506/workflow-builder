# User Stories — Palette / catalog host config (v1)

**Breakdown**: Hybrid — feature stories with host and author AC  
**Granularity**: Standard (~7 stories)  
**AC style**: Gherkin  
**Personas**: P-HOST, P-AUTHOR (`personas.md`)  
**Requirements**: `palette-host-config-requirements.md` FR-PAL-01..07  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A  

**Locked policies**
- JSON + provider; provider wins; adapters provider-only
- Allow-list omitted ⇒ show all types for that canvas; present ⇒ only those types (built-in and adapter rows)
- `defaultAgents` omitted ⇒ Blank Agent (if `AIAgent` allowed); present ⇒ replaces Blank Agent
- Adapter replaces Enso for that canvas; failure ⇒ static defaults, no mocks, banner
- Router type key is `Decision`

---

## Persona ↔ Story Mapping

| Story | P-HOST | P-AUTHOR |
|---|---|---|
| US-PAL-01 Merge palette/catalog config | ● | ○ |
| US-PAL-02 Solution allow-list | ● | ● |
| US-PAL-03 Skills allow-list | ● | ● |
| US-PAL-04 defaultAgents replace Blank Agent | ● | ● |
| US-PAL-05 Catalog adapter | ● | ○ |
| US-PAL-06 Adapter failure, no mocks | ● | ● |
| US-PAL-07 Embed docs + examples | ● | ○ |

● = primary · ○ = secondary / sees result

---

## Traceability FR ↔ US

| FR | Stories |
|---|---|
| FR-PAL-01 Config layers | US-PAL-01 |
| FR-PAL-02 Allow-list | US-PAL-02, US-PAL-03 |
| FR-PAL-03 defaultAgents | US-PAL-04 |
| FR-PAL-04 Catalog adapter | US-PAL-05 |
| FR-PAL-05 Failure / empty | US-PAL-06 |
| FR-PAL-06 Featured strip | US-PAL-02, US-PAL-03 |
| FR-PAL-07 Docs | US-PAL-07 |
| NFR-PAL-01 Show-all when omitted | US-PAL-01, US-PAL-02, US-PAL-04 |
| NFR-PAL-02/03 No secrets in JSON/logs | US-PAL-01, US-PAL-05, US-PAL-07 |
| NFR-PAL-04/05 PBT filter + merge | US-PAL-02, US-PAL-04 |
| NFR-PAL-06 Failure does not crash | US-PAL-06 |

---

## US-PAL-01 — Provide palette and catalog config

**As a** Host Integrator  
**I want** to supply palette allow-lists and defaultAgents via JSON and override them with `provideWorkflowBuilderUi`  
**So that** each host can shape the library without forking the builder  

**FR**: FR-PAL-01, NFR-PAL-01, NFR-PAL-02 · **Persona**: P-HOST  

**Acceptance criteria**
```
Given built-in defaults show all current types and one Blank Agent
And JSON sets palette.solution.types to ["Condition"]
When the host provider sets palette.solution.types to ["Condition", "Repeater"]
Then the provider list wins
And JSON does not contain tokens or Authorization values
```
```
Given palette.solution.types and defaultAgents are omitted
When the app starts
Then the solution library matches today’s types including Blank Agent
```

---

## US-PAL-02 — Solution allow-list

**As a** Host Integrator  
**I want** an independent allow-list for the solution Agents Library  
**So that** a host that does not need Condition, Router, Repeater, or Blank Agent can hide them  

**FR**: FR-PAL-02, FR-PAL-06 · **Personas**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given palette.solution.types is ["AIAgent", "Repeater"]
When an Author opens the solution canvas
Then Repeater appears in the featured strip
And Condition and Router do not appear
And Blank Agent / default agents may appear because AIAgent is allowed
```
```
Given palette.solution.types is omitted
When an Author opens the solution canvas
Then Condition, Router, Repeater, and Blank Agent appear as today
```
```
Given palette.solution.types is []
When an Author opens the solution canvas
Then no built-in or adapter rows pass the type filter
And the library chrome still follows agentsLibrary.enabled
```

---

## US-PAL-03 — Skills allow-list

**As a** Host Integrator  
**I want** a separate allow-list for the nested Skills Library  
**So that** skills canvas types can differ from the solution canvas  

**FR**: FR-PAL-02, FR-PAL-06 · **Personas**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given palette.agent.types is ["Condition", "Action"]
And palette.solution.types is ["AIAgent"]
When an Author opens a nested agent canvas
Then Condition appears in the skills featured strip
And Router and Repeater do not
And solution canvas still only allows AIAgent
```

---

## US-PAL-04 — Replace Blank Agent with default agents

**As a** Host Integrator  
**I want** to supply 1..N default agent cards  
**So that** other products can rename Blank Agent or offer two named starters  

**FR**: FR-PAL-03 · **Personas**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given palette.solution.defaultAgents is
  [{ key: "claims", label: "Claims Agent", description: "Triage claims" },
   { key: "policy", label: "Policy Agent", description: "Check policy" }]
When an Author opens the solution Agents Library
Then Claims Agent and Policy Agent are shown
And the built-in Blank Agent card is not shown
```
```
Given defaultAgents is omitted
When an Author opens the solution Agents Library
Then Blank Agent is shown if AIAgent is allowed
```
```
Given defaultAgents is []
When an Author opens the solution Agents Library
Then no static default agent cards are shown
```
```
Given palette.solution.types is ["Condition"] (no AIAgent)
And defaultAgents is a non-empty list
When an Author opens the solution Agents Library
Then default agent cards are not shown
```

---

## US-PAL-05 — Catalog adapter replaces Enso

**As a** Host Integrator  
**I want** to inject a catalog adapter for solution and/or nested agent lists  
**So that** extra APIs can populate agents or skills without matching Enso URLs in JSON  

**FR**: FR-PAL-04, NFR-PAL-03 · **Persona**: P-HOST  

**Acceptance criteria**
```
Given the host provides catalog.solution that returns agent rows
When the solution Agents Library loads
Then Enso pipeline/list is not used for that canvas
And returned rows are filtered by palette.solution.types
And adapter logs do not include access tokens
```
```
Given catalog.solution and catalog.agent are omitted
When libraries load
Then the built-in Enso adapters are used
```

---

## US-PAL-06 — List failure shows static defaults, not mocks

**As a** Workflow Author  
**I want** the library to stay usable if the catalog API fails  
**So that** I can still place host default agents or allowed static types  

**FR**: FR-PAL-05, NFR-PAL-06 · **Personas**: P-AUTHOR, P-HOST  

**Acceptance criteria**
```
Given the solution catalog adapter/Enso call fails or returns no rows
And defaultAgents is omitted
When an Author views the Agents Library
Then Blank Agent is still available if AIAgent is allowed
And mock agents (Claims Intake / Policy Check / Notify Desk) are not shown
And a non-blocking error/status is visible
And the canvas still works
```
```
Given the skills catalog call fails
When an Author views the Skills Library
Then only static types that pass palette.agent.types are shown
```

---

## US-PAL-07 — Embed docs and example JSON

**As a** Host Integrator  
**I want** documented allow-lists, defaultAgents, and the TypeScript adapter hook  
**So that** another repo can configure palettes without reading source  

**FR**: FR-PAL-07, NFR-PAL-02 · **Persona**: P-HOST  

**Acceptance criteria**
```
Given the embed and try docs
When a host follows the examples
Then they can copy allow-list and defaultAgents JSON
And they see that adapters are provider-only (not JSON)
And example JSON contains no secrets
```
