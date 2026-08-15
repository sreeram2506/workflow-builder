# User Stories — Solution Workflow Increment

**Breakdown**: User journey (author path) with medium feature slices  
**Granularity**: Medium (one story per distinct capability)  
**AC style**: Gherkin for core flows; bullets for catalogs / polish  
**Personas**: P-AUTHOR, P-REVIEWER (existing `personas.md`; no new persona)  
**Requirements**: `solution-workflow-requirements.md` FR-SW-01..05, NFR-SW-*  
**Additive**: Does not replace Phase 1–10 or Logic Nodes stories  
**AD sync**: 2026-08-15 — tab-first open, Angular routes, skills list/cards (not nested graph)

**Journey spine**: Add Blank Agent → dblclick opens agent tab → select tab opens nested skills view → add mock skills to list → Back (persist `data.skills`) → Properties / view mode.

---

## Persona ↔ Story Mapping

| Story | P-AUTHOR | P-REVIEWER |
|---|---|---|
| US-SW-01 Solution palette + Blank Agent | ● | ○ inspect library in view (no add) |
| US-SW-02 Agent tab + open nested skills view | ● | ○ open tab/view read-only later |
| US-SW-03 Add mock skills to agent list | ● | Locked add in view |
| US-SW-04 Back + in-session persistence | ● | ● navigate Back |
| US-SW-05 Properties + view mode on nested | ● edit | ● read-only |

● = primary actor · ○ = secondary / N/A

---

## US-SW-01 — Add Blank Agent from the solution palette

**As a** Workflow Author  
**I want** Condition, Router, and Repeater in a featured strip with Blank Agent below  
**So that** I can assemble a solution workflow that includes agents  

**FR**: FR-SW-01 · **Persona**: P-AUTHOR · **Journey step**: 1  

**Acceptance criteria**
```
Given I am editing an Untitled solution workflow
When I open the Nodes Library
Then I see Condition, Router, and Repeater in the featured shapes row
And I see a Blank Agent card directly below that row
```
```
Given I drag or click-to-add Blank Agent onto the canvas
When the node is created
Then it is type AIAgent labeled "Blank Agent"
And the Blank Agent card remains available in the library (copy-on-create)
```
- Existing Flow / Integration (+ Enso tasks if present) categories continue to work
- Logic shapes keep current drag/click behavior

---

## US-SW-02 — Open agent tab then nested skills view

**As a** Workflow Author  
**I want** double-click on a Blank Agent to open an agent tab, and selecting that tab to open the nested skills view  
**So that** I intentionally enter agent-inside-agent authoring  

**FR**: FR-SW-02, FR-SW-03 · **Persona**: P-AUTHOR · **Journey step**: 2  

**Acceptance criteria**
```
Given I am in edit mode and a Blank Agent exists on the solution canvas
When I double-click that Blank Agent
Then an agent tab for that agent appears or focuses in the top bar
And I remain on the solution canvas until I select that tab
```
```
Given an agent tab exists for a Blank Agent
When I select that tab
Then I navigate to the nested agent skills view for that agent (Angular route)
And dedicated nested shell regions show skills catalog, selected skills list/cards, and Properties
```
```
Given I single-click the Blank Agent
When Properties opens
Then I remain on the solution canvas (no tab required; no nested navigation)
```
- Nested navigation should feel immediate for local mock data (NFR-SW-01)

---

## US-SW-03 — Add developed skills to the agent list

**As a** Workflow Author  
**I want** a mock catalog of developed skills in the nested library  
**So that** I can add skills as cards/entries on the agent’s selected skills list  

**FR**: FR-SW-03, FR-SW-04 · **Persona**: P-AUTHOR · **Journey step**: 3  

**Acceptance criteria**
```
Given I am on the nested skills view for a Blank Agent
When I view the left library
Then I see a static mock list of developed skills (name + short description)
```
```
Given I click or otherwise add a mock skill from the catalog
When it is added to the agent
Then it appears in the selected skills list/cards for that agent
And it is stored on AIAgent.data.skills
And I can add multiple skills without removing them from the catalog
```
- No live skills API in this increment
- Catalog size is small but demo-ready (at least 3 mock skills)
- Skills are **not** nested canvas graph nodes in this increment

---

## US-SW-04 — Return to solution canvas with skills preserved

**As a** Workflow Author  
**I want** a Back control and in-session persistence of `data.skills`  
**So that** I can leave and re-enter the agent without losing skills I added  

**FR**: FR-SW-03, FR-SW-05 · **Persona**: P-AUTHOR (P-REVIEWER may use Back) · **Journey step**: 4  

**Acceptance criteria**
```
Given I am on the nested skills view with at least one skill in data.skills
When I activate Back in the top bar
Then I return to the solution canvas route
And the Blank Agent I opened is still present
```
```
Given I added skills and returned via Back
When I open the same Blank Agent nested view again in the same session (tab)
Then the previously added skills are still present in the list
```
- Prefer restoring selection on that Blank Agent after Back when practical
- Export/import of `data.skills` via opaque serialize is expected; gaps documented as follow-up

---

## US-SW-05 — Properties and view mode on nested skills view

**As a** Workflow Author or Reviewer  
**I want** Properties and edit/view rules to behave like the main builder  
**So that** nested authoring feels consistent and safe in view mode  

**FR**: FR-SW-03 · **NFR**: NFR-SW-02 · **Personas**: P-AUTHOR, P-REVIEWER · **Journey step**: 5  

**Acceptance criteria**
```
Given I am on the nested skills view in edit mode
When I select a skill list entry (or the agent)
Then Properties opens using the same dialog patterns as the main builder where applicable
```
```
Given the global editor mode is view
When I am on the nested skills view
Then I cannot add or remove skills from the list
And Properties presents read-only (or non-mutating) controls consistent with view mode
```
- Back remains available in view mode so reviewers can leave the nested view

---

## Out of scope (stories deferred)

- Live Enso skills API
- Nested skills graph / Skill NodeType
- Nesting deeper than one agent under a solution
- Production auth for nested URLs
