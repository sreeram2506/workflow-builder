# User Stories — Host UI chrome inputs (`[ui]`)

**Breakdown**: 4 stories (plan Q2=A)  
**AC style**: Gherkin (Q3=A)  
**Personas**: P-HOST primary; P-AUTHOR / P-REVIEWER secondary (Q1=A)  
**Requirements**: `host-ui-inputs-requirements.md` FR-HUI-01..07  
**Isolation**: Explicit instance-local overlay (Q4=A)

---

## Persona ↔ Story Mapping

| Story | P-HOST | P-AUTHOR | P-REVIEWER |
|---|---|---|---|
| US-HUI-01 Bind `[ui]` + precedence | ● | ○ | ○ |
| US-HUI-02 Omit keeps DI/JSON | ● | ○ | ○ |
| US-HUI-03 Reactive updates | ● | ● | ○ |
| US-HUI-04 Both shells + docs | ● | ● | ● |

● = primary · ○ = secondary / sees result

---

## US-HUI-01 — Bind `[ui]` with precedence

**As a** Host Integrator  
**I want** to pass a partial chrome map via `[ui]` on the shell  
**So that** my page can override app-wide JSON/provider flags without forking the builder  

**FR**: FR-HUI-01, FR-HUI-02, FR-HUI-03 · **Persona**: P-HOST  

**Acceptance criteria**
```
Given defaults show all chrome
And JSON or provideWorkflowBuilderUi sets agentsLibrary.enabled to false
When the host binds [ui]="{ agentsLibrary: { enabled: true }, topBar: { save: false } }"
Then Agents Library is shown
And the Save control / Save shortcut respects topBar.save false
And other omitted leaves keep the lower-layer values
```
```
Given two shell instances (or sequential mounts) with different [ui] overlays
When each resolves effective features
Then neither overlay mutates the other instance’s effective map
And global UiConfigService bootstrap layers remain unchanged for omit-path consumers
```

---

## US-HUI-02 — Omit `[ui]` preserves DI/JSON behavior

**As a** Host Integrator  
**I want** unbound `[ui]` to mean “no instance overlay”  
**So that** existing SPA JSON/provider configs keep working  

**FR**: FR-HUI-01, FR-HUI-02 · **Persona**: P-HOST  

**Acceptance criteria**
```
Given provideWorkflowBuilderUi or JSON disables propertiesPanel.enabled
And [ui] is omitted on wb-shell-layout
When the shell renders
Then Properties panel stays hidden
And behavior matches pre-[ui] U-UI-02 chrome gating
```
```
Given [ui]="{}"
When the shell renders
Then no leaf is forced off solely by the empty object
And lower-layer resolved features apply unchanged
```

---

## US-HUI-03 — Reactive `[ui]` updates

**As a** Host Integrator  
**I want** chrome to update when I change the bound `[ui]` value  
**So that** host pages can toggle tools without remounting the app  

**FR**: FR-HUI-04, FR-HUI-06 · **Personas**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given the shell is showing Properties (propertiesPanel.enabled true via defaults)
When the parent changes [ui] to { propertiesPanel: { enabled: false } }
Then the Properties panel is no longer rendered
Without a full page reload
```
```
Given [ui] hid the Agents Library
When the parent clears the override (omit or remove the agentsLibrary key via a new partial that restores show)
Then the library becomes visible again per merge rules
```

---

## US-HUI-04 — Both shells and documentation

**As a** Host Integrator  
**I want** `[ui]` on solution and nested agent shells, documented like `[palettes]`  
**So that** embedders use one consistent API  

**FR**: FR-HUI-01, FR-HUI-03, FR-HUI-07 · **Personas**: P-HOST (+ authors/reviewers see chrome)  

**Acceptance criteria**
```
Given wb-agent-skills-shell with [ui]="{ skillsLibrary: { enabled: false } }"
When the Author opens /agent/:nodeId
Then the nested left library is hidden
And the nested canvas still opens
```
```
Given the embed guide and README
When a host reads the docs
Then [ui] precedence (defaults → JSON → provider → [ui]) and a full partial example are documented
```

---

## Traceability

| FR | Stories |
|---|---|
| FR-HUI-01 | US-HUI-01, US-HUI-02, US-HUI-04 |
| FR-HUI-02 | US-HUI-01, US-HUI-02 |
| FR-HUI-03 | US-HUI-01, US-HUI-04 |
| FR-HUI-04 | US-HUI-03 |
| FR-HUI-05 | US-HUI-01 (isolation AC) |
| FR-HUI-06 | US-HUI-03 |
| FR-HUI-07 | US-HUI-04 |
| NFR-HUI-01 (PBT merge) | Covered in Construction tests for US-HUI-01/02 |
