# Unit of Work — Agent tabs doubleClick config

**Parent label**: Agent tabs doubleClick config  
**Deployment model**: Same monolith Angular SPA (no new package)  
**Unit meaning**: One logical construction module  
**Sequencing**: Single unit — Code Generation → Build and Test (plan Q2=A; Functional Design skipped)  
**Ownership**: Same stream (plan Q4=A)  
**Construction**: Code Generation; skip Functional Design, NFR Requirements/Design, and Infrastructure Design (plan Q2=A)  
**Product boundary**: Host-passable `agentTabs.doubleClick` gates solution-canvas enter-on-dblclick; independent of strip chrome  
**Application Design**: SKIP  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A  
**Depends on**: UI feature merge, `injectEffectiveUi` on canvas, U-AE-01 enter-without-tabs — COMPLETE

---

## Code organization (brownfield) — Q3=A

```text
src/app/
  core/ui-config/
    ui-features.types.ts            # CHANGE: AgentTabsFeatures.doubleClick; UI_FEATURE_PATHS
    merge-ui-features.ts            # CHANGE: default true; pickBooleanLeaves includes doubleClick
    merge-ui-features.spec.ts       # EXTEND: default / explicit false / independent of enabled
    merge-ui-features.pbt.spec.ts   # EXTEND: absent key -> true; explicit false wins (PBT Partial)
  features/canvas/
    canvas-viewport.component.ts    # CHANGE: onNodeDblClick gated by ui.is(agentTabs.doubleClick)
    canvas-viewport.component.spec.ts  # EXTEND: false does not navigate; true still enters
  src/assets/examples/
    wb-ui-config.all-on.json        # CHANGE: agentTabs.doubleClick true
    wb-ui-config.all-off.json       # CHANGE: agentTabs.doubleClick false
    (other example JSON if they list agentTabs leaves)

docs/
  workflow-builder-ui-embed.md      # CHANGE: document agentTabs.doubleClick; parent example
```

Canvas already has `injectEffectiveUi()`. Gate in `onNodeDblClick`; do not add a new facade session signal unless tests prove instance `[ui]` is not visible there.

No new Angular project. No new helper module (Q3≠B). Do not commit `src/app/try/` unless asked.

---

## Unit Catalog

### U-DC-01 — Agent tabs doubleClick config

**Stories**: US-DC-01, US-DC-02, US-DC-03, US-DC-04, US-DC-05  
**FR**: FR-DC-01..08  
**NFR**: Security (no secrets in JSON/docs); Resiliency N/A (DR); PBT Partial on merge invariant  

**Owns**
- `agentTabs.doubleClick` leaf, default `true`, merge layers (FR-DC-01, FR-DC-02)
- Solution-canvas AIAgent dblclick navigates only when effective flag is true (FR-DC-03, FR-DC-07)
- Independence from `agentTabs.enabled`; both false = no builder enter (FR-DC-04)
- Chip single-click still enters when strip on (FR-DC-05)
- Nested canvas dblclick still does not re-enter (FR-DC-06)
- Embed docs + example JSON (FR-DC-08)

**Does not own**
- Chip double-click gesture
- New enter paths when both flags are false
- Nested Back / Solution chrome (U-AE-01 stays)
- Single-click node enter
- Publishing `enso-workflow-builder`
- Committing `src/app/try/`

**Done when**
- Omit/true: canvas dblclick still enters
- `doubleClick: false`: canvas dblclick does not enter; chips still enter if strip on
- `enabled: false` + `doubleClick: true`: dblclick enters; no strip
- Both false: no builder enter
- Nested: no second enter
- Docs/examples updated; `npm test` / `npm run build` green
