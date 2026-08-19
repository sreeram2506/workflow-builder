# User Stories — Host embed contract

**Breakdown**: Hybrid — feature stories with host and author AC  
**Granularity**: Standard (4 stories)  
**AC style**: Gherkin  
**Personas**: P-HOST, P-AUTHOR, P-REVIEWER (`personas.md`)  
**Requirements**: `host-embed-contract-requirements.md` FR-HE-01..09  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  

**Locked policies**
- `[document]` in / `(documentChange)` out; facade `loadDocument` / `getDocument` / dirty
- Invalid load keeps last good graph + status (no throw)
- Save/Run host handlers when set; else blob Save + simulated Run
- Export/Import files unchanged
- Shells `height: 100%`; host supplies wrapper height
- No ng-packagr this increment

---

## Persona ↔ Story Mapping

| Story | P-HOST | P-AUTHOR | P-REVIEWER |
|---|---|---|---|
| US-HE-01 Load `[document]`; invalid keeps last good | ● | ● | ○ |
| US-HE-02 getDocument / dirty / documentChange | ● | ○ | ○ |
| US-HE-03 Save/Run handlers vs defaults | ● | ● | ● |
| US-HE-04 Fill host height; embed docs | ● | ○ | ○ |

● = primary · ○ = secondary / sees result

---

## Traceability FR ↔ US

| FR | Stories |
|---|---|
| FR-HE-01 Load document | US-HE-01 |
| FR-HE-02 Invalid load fail-safe | US-HE-01 |
| FR-HE-03 Get document and dirty | US-HE-02 |
| FR-HE-04 documentChange output | US-HE-02 |
| FR-HE-05 Save host hook | US-HE-03 |
| FR-HE-06 Run host hook | US-HE-03 |
| FR-HE-07 Export / Import files | US-HE-03 |
| FR-HE-08 Fill host height | US-HE-04 |
| FR-HE-09 Embed docs | US-HE-04 |

---

## INVEST check

| Story | I | N | V | E | S | T |
|---|---|---|---|---|---|---|
| US-HE-01 | ● | ● | ● | ● | ● | ● |
| US-HE-02 | ● | ● | ● | ● | ● | ● |
| US-HE-03 | ● | ● | ● | ● | ● | ● |
| US-HE-04 | ● | ● | ● | ● | ● | ● |

---

## US-HE-01 — Host loads a document; bad payload does not wipe the canvas

**As a** Host Integrator  
**I want** to bind `[document]` (and call `loadDocument`) so the canvas shows my workflow  
**So that** the builder is not stuck on the SPA empty/sample graph  

**FR**: FR-HE-01, FR-HE-02 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```text
Given the solution shell is mounted
When the host sets [document] to a valid WorkflowDocument
Then the canvas shows that document's nodes and edges
And nested edit state is not left pointing at a previous agent
```
```text
Given the canvas already shows a valid document
When the host sets [document] to a non-object or a payload that fails parse/validate
Then the canvas still shows the previous document
And a non-secret status or error is shown
And the host page does not receive an uncaught throw
```

---

## US-HE-02 — Host can read the current document, dirty, and change events

**As a** Host Integrator  
**I want** `getDocument()`, dirty, and `(documentChange)`  
**So that** I can persist the graph without scraping the DOM  

**FR**: FR-HE-03, FR-HE-04 · **Persona**: P-HOST  

**Acceptance criteria**
```text
Given a document is loaded
When the host calls getDocument()
Then it receives the current solution WorkflowDocument
And if a nested agent canvas is open, nested edits are flushed onto that agent first
```
```text
Given a document was just loaded
Then dirty is false
When the author makes a committed graph edit (not pointer-move pan)
Then dirty is true
And (documentChange) emits a structured clone (debounced like autosave is OK)
And the emit does not include secrets
```
```text
Given a successful loadDocument
Then (documentChange) also emits after that apply
```

---

## US-HE-03 — Save and Run call the host when hooked; otherwise keep today's behavior

**As a** Host Integrator  
**I want** optional Save and Run handlers  
**So that** I can persist and execute in my product, while the standalone SPA still downloads and simulates  

**FR**: FR-HE-05, FR-HE-06, FR-HE-07 · **Persona**: P-HOST, P-AUTHOR, P-REVIEWER  

**Acceptance criteria**
```text
Given a Save handler is provided (provider persist.save and/or shell (save), first-win documented)
When the author clicks Save or presses Cmd/Ctrl+S
Then the handler is called with getDocument()
And no blob download starts
```
```text
Given no Save handler is set
When the author clicks Save
Then today's blob download still runs
```
```text
Given a Run handler is provided
When the author clicks Run
Then the handler is called with getDocument()
And simulated Run does not start
```
```text
Given no Run handler is set
When the author clicks Run
Then today's simulated Run still runs
```
```text
Given editor mode is view
Then Save remains disabled as today (handler is not used to mutate)
```
```text
Given Export and Import chrome are enabled
Then file Export/Import still work (unchanged by [document])
```

---

## US-HE-04 — Shells fill the host box; embed docs describe the contract

**As a** Host Integrator  
**I want** the shells to fill my panel (`height: 100%`) and docs for the new bindings  
**So that** I do not fight `100vh` and I know how to load/save without publishing an npm package yet  

**FR**: FR-HE-08, FR-HE-09 · **Persona**: P-HOST  

**Acceptance criteria**
```text
Given wb-shell-layout or wb-agent-skills-shell is inside a host box with a definite height
Then the shell fills that box (height 100% / min-height 0)
And it does not use height 100vh
And there is no [height] input
```
```text
Given the standalone SPA (html/body/app-root fill the viewport)
Then the builder still looks full-page
```
```text
Given docs/workflow-builder-ui-embed.md
When a host reads the embed contract
Then [document], (documentChange), Save/Run handlers vs defaults, invalid-load fail-safe, and fill-host height are documented
And examples contain no secrets
And ng-packagr / npm publish is not required this increment
```
