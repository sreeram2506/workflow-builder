# User Stories — Host palette inputs (Syncfusion-style)

**Breakdown**: Hybrid — feature stories with host and author AC  
**Granularity**: Standard (6 stories)  
**AC style**: Gherkin  
**Personas**: P-HOST, P-AUTHOR (`personas.md`)  
**Requirements**: `host-palette-inputs-requirements.md` FR-HPI-01..06  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A  

**Locked policies**
- `[palettes]` on `wb-shell-layout` and `wb-agent-skills-shell`
- Parent items = catalog cards; featured Condition/Router/Repeater and default agents stay when items are present
- Omit `[palettes]` = Enso or provider catalog; `[]` = empty-state only; items = parent owns remote list
- `[defaultAgents]` on solution shell; present (incl. `[]`) replaces Blank Agent; wins over JSON
- Component `[palettes]` wins over `provideWorkflowBuilderUi({ catalog })`
- Unknown `type` values dropped (no Stream node)

---

## Persona ↔ Story Mapping

| Story | P-HOST | P-AUTHOR |
|---|---|---|
| US-HPI-01 Solution `[palettes]` omit / `[]` / items | ● | ● |
| US-HPI-02 `[defaultAgents]` input | ● | ● |
| US-HPI-03 Skills `[palettes]` | ● | ● |
| US-HPI-04 Input wins over catalog provider | ● | ○ |
| US-HPI-05 Drop unknown types | ● | ● |
| US-HPI-06 Embed docs | ● | ○ |

● = primary · ○ = secondary / sees result

---

## Traceability FR ↔ US

| FR | Stories |
|---|---|
| FR-HPI-01 Host tags | US-HPI-01, US-HPI-02, US-HPI-03 |
| FR-HPI-02 Precedence | US-HPI-02, US-HPI-04 |
| FR-HPI-03 Omit / `[]` / items | US-HPI-01, US-HPI-03 |
| FR-HPI-04 defaultAgents input | US-HPI-02 |
| FR-HPI-05 Unknown types | US-HPI-05 |
| FR-HPI-06 Docs | US-HPI-06 |
| NFR-HPI-01 Omit fail-open | US-HPI-01, US-HPI-02, US-HPI-03 |
| NFR-HPI-02 No secrets in docs | US-HPI-06 |
| NFR-HPI-03 Invalid shapes skipped | US-HPI-05 |
| NFR-HPI-04 PBT omit/`[]`/drop | US-HPI-01, US-HPI-05 |

---

## US-HPI-01 — Solution `[palettes]` omit, empty, or items

**As a** Host Integrator  
**I want** to bind `[palettes]` on `wb-shell-layout` like Syncfusion SymbolPalette  
**So that** I supply catalog cards from the parent template without forking the SPA  

**FR**: FR-HPI-01, FR-HPI-03, NFR-HPI-01 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given [palettes] is omitted on wb-shell-layout
When the solution Agents Library loads
Then Enso or provideWorkflowBuilderUi catalog is used (U-PAL-02)
And featured Condition / Router / Repeater still follow the allow-list
```
```
Given the parent binds [palettes]="[]"
When the author opens the solution canvas
Then the library shows only the empty-state (palette-empty-remote)
And featured shapes and default agents are hidden
```
```
Given the parent binds [palettes] with one AIAgent card labeled Stream
When the author opens the solution canvas
Then Enso pipeline/list is not called
And featured Condition / Router / Repeater remain
And default agents remain
And a Stream catalog card appears under them
```

---

## US-HPI-02 — `[defaultAgents]` on the solution shell

**As a** Host Integrator  
**I want** `[defaultAgents]` on `wb-shell-layout`  
**So that** named default agents replace Blank Agent from the parent template  

**FR**: FR-HPI-01, FR-HPI-04, FR-HPI-02 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given [defaultAgents] is omitted
When JSON sets palette.solution.defaultAgents to Claims Agent
Then the solution library shows Claims Agent instead of Blank Agent
```
```
Given JSON sets defaultAgents to Claims Agent
When the parent binds [defaultAgents] to Policy Agent
Then Policy Agent is shown and Claims Agent is not
```
```
Given the parent binds [defaultAgents]="[]"
When the author views the Agents Library
Then no default-agent cards appear
```
```
Given the solution allow-list does not include AIAgent
When [defaultAgents] is present with cards
Then those cards do not render
```

---

## US-HPI-03 — Skills `[palettes]`

**As a** Host Integrator  
**I want** `[palettes]` on `wb-agent-skills-shell`  
**So that** nested Skills Library uses the parent skill list  

**FR**: FR-HPI-01, FR-HPI-03 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given [palettes] is omitted on wb-agent-skills-shell
When the author opens a nested agent
Then Enso task/list or the provider agent catalog is used
```
```
Given the parent binds skill [palettes] with Action-typed items
When the author opens Skills Library
Then those items appear (filtered by palette.agent.types)
And featured logic shapes still show when allowed
And Enso task/list is not called
```
```
Given skill [palettes]="[]"
When the author opens Skills Library
Then empty-state only is shown
```

---

## US-HPI-04 — Component `[palettes]` wins over catalog provider

**As a** Host Integrator  
**I want** instance `[palettes]` to beat `provideWorkflowBuilderUi({ catalog })`  
**So that** a parent page can override global catalog DI like Syncfusion instance props  

**FR**: FR-HPI-02 · **Persona**: P-HOST  

**Acceptance criteria**
```
Given provideWorkflowBuilderUi catalog.solution returns Host-A
And wb-shell-layout [palettes] is present with Host-B
When the solution library loads
Then Host-B is shown and Host-A is not
And Enso is not called
```
```
Given the catalog provider is set
And [palettes] is omitted
When the solution library loads
Then the provider catalog is used
```

---

## US-HPI-05 — Drop unknown palette item types

**As a** Host Integrator  
**I want** items with unknown `type` (e.g. Stream) dropped  
**So that** the library never offers a node the canvas cannot create  

**FR**: FR-HPI-05, NFR-HPI-03, NFR-HPI-04 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given [palettes] includes { type: 'Stream', label: 'Stream' } and { type: 'AIAgent', label: 'Host Agent' }
When the solution library renders
Then Host Agent is shown
And no card with type Stream is shown
And dropping from the library cannot create a Stream node
```
```
Given an item is missing required fields
When palettes are applied
Then that item is skipped and remaining valid items still render
```

---

## US-HPI-06 — Embed docs for parent template inputs

**As a** Host Integrator  
**I want** embed docs that show `[palettes]` and `[defaultAgents]`  
**So that** other teams copy a Syncfusion-like parent example  

**FR**: FR-HPI-06, NFR-HPI-02 · **Persona**: P-HOST  

**Acceptance criteria**
```
Given docs/workflow-builder-ui-embed.md
When a host reads the palette inputs section
Then they see a wb-shell-layout template with [palettes] and [defaultAgents]
And omit vs [] vs items is described
And input-wins-over-catalog-provider is described
And examples use only known NodeType values
And examples contain no access tokens
```
