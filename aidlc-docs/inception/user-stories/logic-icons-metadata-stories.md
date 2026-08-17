# User Stories — Host logic extras + agent metadata

**Breakdown**: Hybrid — feature stories with host and author AC  
**Granularity**: Standard (4 stories)  
**AC style**: Gherkin  
**Personas**: P-HOST, P-AUTHOR (`personas.md`)  
**Requirements**: `logic-icons-metadata-requirements.md` FR-LIM-01..10  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  

**Locked policies**
- Extra Condition / Router (`Decision`) / Repeater cards allowed (same type, different key/label/icon)
- When `[palettes]` is present (non-empty after sanitize), host logic cards **replace** the three built-ins
- Omit `[palettes]` keeps the static featured three
- `[palettes]="[]"` keeps empty-remote (featured hidden)
- Icons: `iconUrl` + `iconPath`; URL wins; library only; canvas unchanged
- Unsafe URLs rejected; fallback type glyph (including broken image)
- `metadata` plain object on defaultAgents and palettes; `taskMeta` kept on palettes
- Drop copies `data.metadata` and `data.ensoTask`; no Properties editor for arbitrary keys

This increment **supersedes** US-HPI-01 AC that featured Condition / Router / Repeater remain when parent `[palettes]` items are present.

---

## Persona ↔ Story Mapping

| Story | P-HOST | P-AUTHOR |
|---|---|---|
| US-LIM-01 Extra logic cards; featured strip replace | ● | ● |
| US-LIM-02 Library icons, allowlist, fallback | ● | ● |
| US-LIM-03 Metadata + taskMeta on drop | ● | ● |
| US-LIM-04 Embed docs + try samples | ● | ○ |

● = primary · ○ = secondary / sees result

---

## Traceability FR ↔ US

| FR | Stories |
|---|---|
| FR-LIM-01 Extra logic cards | US-LIM-01 |
| FR-LIM-02 Featured strip replace | US-LIM-01 |
| FR-LIM-03 Icon fields | US-LIM-02 |
| FR-LIM-04 Library-only icons | US-LIM-02 |
| FR-LIM-05 URL sanitization | US-LIM-02 |
| FR-LIM-06 Icon fallback | US-LIM-02 |
| FR-LIM-07 Metadata on cards | US-LIM-03 |
| FR-LIM-08 Metadata on drop | US-LIM-03 |
| FR-LIM-09 Sanitizers preserve extras | US-LIM-02, US-LIM-03 |
| FR-LIM-10 Docs + try harness | US-LIM-04 |
| NFR-LIM-01 Pure sanitizers | US-LIM-01, US-LIM-02, US-LIM-03 |
| NFR-LIM-02 URL allowlist | US-LIM-02 |
| NFR-LIM-03 Fail-safe glyph | US-LIM-02 |
| NFR-LIM-04 PBT Partial | US-LIM-01, US-LIM-02, US-LIM-03 |
| NFR-LIM-05 Tests stay green | US-LIM-01..04 |
| NFR-LIM-06 No secrets in docs | US-LIM-04 |

---

## INVEST check

| Story | I | N | V | E | S | T |
|---|---|---|---|---|---|---|
| US-LIM-01 | ● | ● | ● | ● | ● | ● |
| US-LIM-02 | ● | ● | ● | ● | ● | ● |
| US-LIM-03 | ● | ● | ● | ● | ● | ● |
| US-LIM-04 | ● | ● | ● | ● | ● | ● |

Independent enough to implement in that order (strip → icons → metadata → docs). Negotiable AC. Valuable to host and author. Estimable as one unit of work or four thin slices. Small. Testable via Gherkin.

---

## US-LIM-01 — Extra logic cards; featured strip replaces built-ins

**As a** Host Integrator  
**I want** to pass several Condition / Router / Repeater cards on `[palettes]`  
**So that** the featured strip shows my logic shapes instead of only the three built-ins  

**FR**: FR-LIM-01, FR-LIM-02, NFR-LIM-01, NFR-LIM-04 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given [palettes] is omitted on wb-shell-layout
When the author opens the solution Agents Library
Then the featured strip shows the built-in Condition, Router, and Repeater (allow-list permitting)
```
```
Given the parent binds [palettes] with three Condition cards (keys c1, c2, c3) and one Decision card (key r1)
When the author opens the solution Agents Library
Then the featured strip shows c1, c2, c3, and r1 in catalog order
And the built-in static Condition / Router / Repeater do not appear
And Enso pipeline/list is not called
```
```
Given the parent binds [palettes] with only AIAgent cards (no Condition, Decision, or Repeater)
When the author opens the solution Agents Library
Then the featured strip has no built-in logic shapes
```
```
Given the parent binds [palettes]="[]"
When the author opens the solution Agents Library
Then empty-state only is shown (featured hidden)
```
```
Given wb-agent-skills-shell [palettes] includes extra Repeater cards
When the author opens Skills Library
Then the featured strip follows the same replace rule for that canvas
```
```
Given [palettes] includes a row with type Stream and a valid Condition
When the library renders
Then Stream is dropped and the Condition card remains
```

---

## US-LIM-02 — Library icons with allowlist and fallback

**As a** Host Integrator  
**I want** `iconUrl` and `iconPath` on palette and default-agent cards  
**So that** authors see my icons in the library without changing canvas node art  

**FR**: FR-LIM-03, FR-LIM-04, FR-LIM-05, FR-LIM-06, FR-LIM-09, NFR-LIM-02, NFR-LIM-03 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given a palette or default-agent card with a valid https iconUrl
When the author views the library (featured strip, default-agent strip, or list row)
Then that row shows the image from the sanitized URL
```
```
Given a card with both iconUrl (valid) and iconPath
When the library renders the row
Then the image from iconUrl is used (not the path glyph)
```
```
Given a card with only iconPath (non-empty SVG d)
And no usable iconUrl
When the library renders the row
Then the inline SVG path is shown
```
```
Given JSON palette.solution.defaultAgents includes iconUrl or iconPath
When [defaultAgents] is omitted
Then those default-agent cards show the same icon rules
```
```
Given a card with iconUrl javascript:alert(1) or http://example/x.png or data:text/html,... or data:image/svg+xml,...
When the library renders
Then img src is not that string
And the type glyph fallback is shown
```
```
Given a card with a valid https iconUrl that fails to load
When the image errors
Then the type glyph fallback is shown (no dead image)
```
```
Given a card with no icon fields
When the library renders
Then today’s type glyph is shown (logic preview or AIAgent path)
```
```
Given a card with a host icon
When the author drops it on the canvas
Then the canvas node does not use the host image (logic geometry / agent card stay as today)
And the Properties panel does not show the host icon
```

---

## US-LIM-03 — Metadata and taskMeta persist on drop

**As a** Host Integrator  
**I want** metadata on default agents and palettes, and taskMeta on palettes  
**So that** dropped nodes carry that data in the workflow document  

**FR**: FR-LIM-07, FR-LIM-08, FR-LIM-09, NFR-LIM-01, NFR-LIM-04 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```
Given [defaultAgents] includes { key: policy, label: Policy, metadata: { team: "risk" } }
When the author drops that card on the canvas
Then the node has data.paletteKey policy
And data.metadata.team is "risk"
And the library does not render the metadata keys as visible fields
```
```
Given [palettes] includes an AIAgent or Condition with metadata and taskMeta plain objects
When the author drops that card
Then data.metadata is a shallow copy of metadata
And data.ensoTask is a shallow copy of taskMeta
```
```
Given a card whose metadata is an array, null, or a string
When sanitizers run
Then metadata is omitted on the palette item and on the dropped node
```
```
Given JSON defaultAgents includes metadata
When [defaultAgents] is omitted
Then drop from that default-agent card still copies data.metadata
```
```
Given a dropped node is selected
When Properties opens
Then there is no new editor for arbitrary metadata keys
```

---

## US-LIM-04 — Embed docs and try-harness samples

**As a** Host Integrator  
**I want** embed docs (and optional try samples) for extra logic cards, icons, and metadata  
**So that** other teams copy a working parent example  

**FR**: FR-LIM-10, NFR-LIM-06 · **Persona**: P-HOST  

**Acceptance criteria**
```
Given docs/workflow-builder-ui-embed.md
When a host reads the catalog inputs section
Then they see iconUrl / iconPath (URL wins) and metadata examples
And they see that present [palettes] replaces built-in featured Condition / Router / Repeater
And examples use only known NodeType values
And examples contain no access tokens
```
```
Given the local try host is used
When a catalog preset includes extra logic cards and default agents with metadata
Then those samples demonstrate the new fields (try folder remains gitignored)
```
