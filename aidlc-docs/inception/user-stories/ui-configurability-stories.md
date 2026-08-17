# User Stories — UI Configurability (v1)

**Breakdown**: Host config journey + author/reviewer chrome visibility  
**Granularity**: Standard (one story per proposed row)  
**AC style**: Gherkin  
**Personas**: P-AUTHOR, P-REVIEWER, P-HOST (`personas.md`)  
**Requirements**: `ui-configurability-requirements.md` FR-UI-01..10  
**Plan answers**: Q1=A · Q2=A · Q3=A (shortcuts follow flags) · Q4=A (soft-fail + status) · Q5=A  

**Locked policies**
- Shortcuts disabled when matching UI flag is false
- Invalid/missing JSON → defaults (all on) + non-blocking status

---

## Persona ↔ Story Mapping

| Story | P-HOST | P-AUTHOR | P-REVIEWER |
|---|---|---|---|
| US-UI-01 Config provide + merge | ● | ○ | ○ |
| US-UI-02 Top bar flags | ● | ● | ○ |
| US-UI-03 Agents Library | ● | ● | ○ |
| US-UI-04 Skills Library | ● | ● | ○ |
| US-UI-05 Properties | ● | ● | ○ |
| US-UI-06 Canvas / overlays / tabs / theme | ● | ● | ○ |
| US-UI-07 Defaults when omitted | ● | ○ | ○ |
| US-UI-08 View mode + flags | ○ | ○ | ● |

● = primary · ○ = secondary / N/A

---

## US-UI-01 — Provide UI feature config

**As a** Host Integrator  
**I want** to supply UI flags via JSON/env and override them with `provideWorkflowBuilderUi`  
**So that** each host app can choose chrome without forking the builder  

**FR**: FR-UI-01, FR-UI-02, FR-UI-09, FR-UI-10 · **Persona**: P-HOST  

**Acceptance criteria**
```
Given built-in defaults show all chrome
And a partial JSON config disables agentsLibrary.enabled
When the host also provides { agentsLibrary: { enabled: true } }
Then the provider value wins and Agents Library is shown
```
```
Given the JSON file is missing or invalid
When the app starts
Then chrome defaults to all-on
And a non-blocking status explains the config load issue
And no secrets appear in demo/committed JSON
```

---

## US-UI-02 — Hide/show top bar and actions

**As a** Host Integrator  
**I want** granular top-bar flags (bar, logo, title, status, Back, Save, Export, Import, Run, Reset, theme, edit/view)  
**So that** hosts can expose only the actions they support  

**FR**: FR-UI-03 · **Personas**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given topBar.save is false
When the Author uses the solution shell
Then the Save control is not visible
And the Save keyboard shortcut does not run
```
```
Given topBar.enabled is false and topBar.agentTabs is true
When agent tabs exist
Then the main top-bar chrome is hidden
And the agent tab strip still appears per FD placement rules
```

---

## US-UI-03 — Hide Agents Library

**As a** Host Integrator  
**I want** to disable the solution Agents Library  
**So that** hosts that supply nodes another way are not forced to show the left library  

**FR**: FR-UI-04 · **Personas**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given agentsLibrary.enabled is false
When the Author is on the solution route
Then the Agents Library is not rendered
And the canvas (if enabled) remains usable
```

---

## US-UI-04 — Hide Skills Library on nested agent

**As a** Host Integrator  
**I want** to disable the nested Skills Library while still opening the agent canvas  
**So that** nested editing can be canvas-only  

**FR**: FR-UI-05, FR-UI-07 · **Personas**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given skillsLibrary.enabled is false
When the Author opens /agent/:nodeId
Then the nested canvas is shown
And the Skills Library is not rendered
And Properties visibility follows propertiesPanel.enabled
```

---

## US-UI-05 — Hide Properties panel

**As a** Host Integrator  
**I want** to hide the Properties sidebar  
**So that** read-only or custom property UIs can omit the built-in panel  

**FR**: FR-UI-06 · **Personas**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given propertiesPanel.enabled is false
When the Author selects a node
Then the Properties panel is not rendered
And selection state may still update in the store
```

---

## US-UI-06 — Canvas, overlays, tabs, theme

**As a** Host Integrator  
**I want** flags for canvas, zoom, minimap, floating actions, agent tabs, and theme  
**So that** chrome density matches the host product  

**FR**: FR-UI-07, FR-UI-08 · **Personas**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given canvas.minimap is false and canvas.zoomControls is true
When the Author views the canvas
Then zoom controls are visible and the minimap is not
```
```
Given canvas.enabled is false
When the shell loads
Then the canvas host is not rendered
```

---

## US-UI-07 — Defaults show full chrome

**As a** Host Integrator  
**I want** omitted flags to default to show  
**So that** upgrading does not silently strip UI  

**FR**: FR-UI-02 · **Persona**: P-HOST  

**Acceptance criteria**
```
Given no UI config JSON and no provider overrides
When the SPA boots
Then all v1 chrome regions and actions are visible (current behavior)
```

---

## US-UI-08 — View mode respects chrome flags

**As a** Workflow Reviewer  
**I want** view mode to keep host chrome flags  
**So that** review layout matches the host’s intended surface  

**FR**: FR-UI-03…08 · **Persona**: P-REVIEWER  

**Acceptance criteria**
```
Given agentsLibrary.enabled is false and the editor is in view mode
When the Reviewer opens the solution shell
Then the Agents Library remains hidden
And view-mode mutation locks still apply to any visible chrome
```

---

## Traceability

| FR | Stories |
|---|---|
| FR-UI-01, 02, 09, 10 | US-UI-01, US-UI-07 |
| FR-UI-03 | US-UI-02, US-UI-08 |
| FR-UI-04 | US-UI-03, US-UI-08 |
| FR-UI-05, 07 | US-UI-04, US-UI-06, US-UI-08 |
| FR-UI-06 | US-UI-05, US-UI-08 |
| FR-UI-08 | US-UI-06, US-UI-08 |
| NFR-UI-03 | US-UI-01 |
| Shortcut policy Q3=A | US-UI-02 |
