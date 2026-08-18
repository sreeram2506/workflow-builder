# User Stories — Remove APIs and dummy data

**Breakdown**: Hybrid — feature stories with host and author AC  
**Granularity**: Standard (4 stories)  
**AC style**: Gherkin  
**Personas**: P-HOST, P-AUTHOR (`personas.md`)  
**Requirements**: `remove-apis-dummy-data-requirements.md` FR-RAD-01..06  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  

**Locked policies**
- No Enso `task/list` / `pipeline/list`; no `/enso-api` proxy; no catalog URLs or stored credentials in `environment.ts` / `environment.prod.ts`
- Omit `[palettes]` with no catalog adapter = `emptyRemote` (`palette-empty-remote`), same as `[palettes]="[]"`
- Optional `provideWorkflowBuilderUi({ catalog })` adapter remains when palettes are omitted (U-PAL-02); it is not Enso HTTP
- `[palettes]` with items keeps U-HPI / U-LIM overlay (featured replace, icons, metadata)
- Nested Skills Library uses the same sanitized `[palettes]` overlay as `wb-agent-skills-shell`; no `MOCK_SKILLS`
- Repeater Properties has no `REPEATER_MOCK_WORKFLOWS`; pickers empty until a real source exists
- `SAMPLE_WORKFLOW` stays as a test fixture only

This increment **supersedes**:
- US-HPI-01 omit AC that Enso or provider catalog loads when `[palettes]` is omitted (adapter-only remains; Enso gone; omit-without-adapter is empty-remote)
- US-HPI-03 omit AC that Enso `task/list` loads for nested skills when agent-shell `[palettes]` is omitted
- US-LIM-01 omit AC that the featured strip shows built-in Condition / Router / Repeater when `[palettes]` is omitted
- US-PAL-05 AC that built-in Enso adapters run when catalog.solution / catalog.agent are omitted

---

## Persona ↔ Story Mapping

| Story | P-HOST | P-AUTHOR |
|---|---|---|
| US-RAD-01 No Enso HTTP; omit palettes is empty-remote | ● | ● |
| US-RAD-02 Nested skills from agent-shell palettes; no MOCK_SKILLS | ● | ● |
| US-RAD-03 Repeater Properties has no mock workflow catalog | ○ | ● |
| US-RAD-04 Embed / README: no Enso proxy or credentials | ● | ○ |

● = primary · ○ = secondary / sees result

---

## Traceability FR ↔ US

| FR | Stories |
|---|---|
| FR-RAD-01 Remove Enso catalog HTTP | US-RAD-01 |
| FR-RAD-02 Omit palettes is empty-remote | US-RAD-01 |
| FR-RAD-03 Remove mock nested skills | US-RAD-02 |
| FR-RAD-04 Nested skills from palettes | US-RAD-02 |
| FR-RAD-05 Remove Repeater mock workflows | US-RAD-03 |
| FR-RAD-06 Docs | US-RAD-04 |
| NFR-RAD-01 Security (no credentials in source) | US-RAD-01, US-RAD-04 |
| NFR-RAD-02 Resiliency (no Enso HTTP fail path) | US-RAD-01 |
| NFR-RAD-03 PBT Partial (omit-without-adapter never Enso/static featured) | US-RAD-01, US-RAD-02 |

---

## INVEST check

| Story | I | N | V | E | S | T |
|---|---|---|---|---|---|---|
| US-RAD-01 | ● | ● | ● | ● | ● | ● |
| US-RAD-02 | ● | ● | ● | ● | ● | ● |
| US-RAD-03 | ● | ● | ● | ● | ● | ● |
| US-RAD-04 | ● | ● | ● | ● | ● | ● |

Independent enough to implement in that order (HTTP/empty omit → nested palettes → Repeater mocks → docs). Negotiable AC. Valuable to host and author. Estimable as one unit of work or four thin slices. Small. Testable via Gherkin.

---

## US-RAD-01 — No Enso catalog HTTP; omit palettes is empty-remote

**As a** Host Integrator  
**I want** this SPA to stop calling Enso catalog APIs and treat omitted `[palettes]` as empty-remote unless I inject a catalog adapter  
**So that** authors do not see Enso or static featured catalog when I have not bound palettes  

**FR**: FR-RAD-01, FR-RAD-02, NFR-RAD-01, NFR-RAD-02, NFR-RAD-03 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given the default SPA (no [palettes], no catalog adapter)
When the author opens the solution Agents Library
Then palette-empty-remote is shown
And featured Condition / Router / Repeater are hidden
And default agents are hidden
And no HTTP request is made to Enso task/list or pipeline/list
```
```
Given the parent binds [palettes]="[]"
And no catalog adapter is configured
When the author opens the solution Agents Library
Then the library is the same empty-remote as omit
```
```
Given the parent binds [palettes] with sanitized items
When the author opens the solution Agents Library
Then the U-HPI / U-LIM overlay applies (featured replace, icons, metadata)
And Enso catalog HTTP is not called
```
```
Given [palettes] is omitted
And provideWorkflowBuilderUi({ catalog }) supplies a solution adapter
When the solution Agents Library loads
Then adapter rows are shown (U-PAL-02)
And Enso catalog HTTP is not called
```
```
Given environment.ts and environment.prod.ts
When a host inspects catalog configuration
Then there are no Enso catalog URLs, solution/user/agent/workflow IDs, user-category lists, or stored credentials
```
```
Given proxy.conf.json and Angular serve proxyConfig
When a host inspects local proxy setup
Then /enso-api is not present
```

---

## US-RAD-02 — Nested Skills Library uses agent-shell palettes; no MOCK_SKILLS

**As a** Host Integrator  
**I want** nested Skills Library to use the same `[palettes]` overlay as `wb-agent-skills-shell`  
**So that** authors see host cards (or empty) instead of a dummy skills catalog  

**FR**: FR-RAD-03, FR-RAD-04, NFR-RAD-03 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given MOCK_SKILLS / mock-skills.catalog.ts
When the author opens nested Skills Library
Then those dummy rows are not listed
```
```
Given [palettes] is omitted or bound as [] on wb-agent-skills-shell
And no catalog adapter is configured for that canvas
When the author opens nested Skills Library
Then the nested list is empty
And a second mock catalog is not invented
```
```
Given wb-agent-skills-shell [palettes] includes sanitized AIAgent and logic cards
When the author opens nested Skills Library
Then the nested list shows the same overlay as the agent-skills shell
And search/filter may still apply
```
```
Given solution-shell [palettes] and agent-skills-shell [palettes] differ
When the author opens nested Skills Library from an agent
Then the nested list uses the agent-skills-shell palettes
```

---

## US-RAD-03 — Repeater Properties has no mock workflow catalog

**As a** Workflow Author  
**I want** Repeater Properties workflow and version pickers without dummy catalog options  
**So that** I am not offered fake Claims / Policy / Notify workflows  

**FR**: FR-RAD-05 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given a Repeater node is selected
When Properties shows workflow and version pickers
Then there are no dummy Claims, Policy, or Notify options
And the option lists are empty until a real source exists
```
```
Given REPEATER_MOCK_WORKFLOWS / repeater-mock.catalog.ts
When the SPA runs
Then that catalog is not used for Repeater Properties
```

---

## US-RAD-04 — Embed / README: no Enso proxy or credentials; document empty-when-omit

**As a** Host Integrator  
**I want** embed and README docs without live Enso catalog, proxy, or Bearer token, and with empty-when-omit documented  
**So that** other teams embed without copying secrets or expecting this SPA to call Enso  

**FR**: FR-RAD-06, NFR-RAD-01 · **Persona**: P-HOST  

**Acceptance criteria**
```
Given docs/workflow-builder-ui-embed.md and README.md
When a host reads catalog / embed / proxy sections
Then they do not describe live Enso catalog HTTP, /enso-api proxy, or Bearer token for this SPA
And they see that omitted [palettes] with no adapter is empty-remote (same as [])
And they see that nested Skills Library uses wb-agent-skills-shell [palettes]
And examples contain no access tokens
```
