# Unit of Work — Enter agent without tab bar

**Parent label**: Enter agent without tab bar  
**Deployment model**: Same monolith Angular SPA (no new package)  
**Unit meaning**: One logical construction module  
**Sequencing**: Single unit — Code Generation → Build and Test (plan Q2=A; Functional Design skipped)  
**Ownership**: Same stream (plan Q4=A)  
**Construction**: Code Generation; skip Functional Design, NFR Requirements/Design, and Infrastructure Design (plan Q2=A)  
**Product boundary**: Enter/exit nested agent without the tab strip; `agentTabs.enabled` remains chrome, not a routing gate  
**Application Design**: SKIP  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A  
**Depends on**: Nested agent routes, `selectAgentTab` / `navigateBackToSolution`, chrome `agentTabs.enabled` — COMPLETE

---

## Code organization (brownfield) — Q3=A

```text
src/app/
  core/facade/
    workflow.facade.ts              # CHANGE: skip chip add when agentTabs.enabled is false
                                    #         (openAgentTab / enterAgentCanvas / selectAgentTab)
                                    #         keep navigate in selectAgentTab even when chips skipped
    workflow.facade.spec.ts         # EXTEND: bar off does not accumulate chips; dblclick still navigates
  features/canvas/
    canvas-viewport.component.ts    # KEEP: solution dblclick -> selectAgentTab; nested no re-enter
    canvas-viewport.component.spec.ts  # EXTEND if needed
  features/shell/
    shell-layout.component.ts       # CHANGE: nested Back/Solution when strip not mounted
    agent-tabs.component.ts         # KEEP: chip enter/exit when bar on
  features/agent/
    agent-skills-shell.component.ts # CHANGE: nested Back/Solution when strip not mounted
  core/ui-config/
    merge-ui-features.ts            # KEEP: agentTabs.enabled chrome flag
    ui-features.types.ts            # KEEP

docs/
  workflow-builder-ui-embed.md      # CHANGE: agentTabs.enabled is strip chrome, not a /agent/:id block
```

No new Angular project. No `core/agent-nav/` folder (Q3≠B). Do not commit `src/app/try/` unless asked.

**Construction note**: `selectAgentTab` currently calls `openAgentTab` then navigates. Gate **chip add** only. Navigation and `enterAgentCanvas` must still succeed when `agentTabs.enabled` is false.

---

## Unit Catalog

### U-AE-01 — Enter agent without tab bar

**Stories**: US-AE-01, US-AE-02, US-AE-03, US-AE-04  
**FR**: FR-AE-01..08  
**NFR**: Security (invalid agent route still redirects; no secrets); Resiliency (fail-safe missing agent); PBT Partial N/A as new pure transform — example tests for flag gating  

**Owns**
- Skip `openAgentTab` chip mutation when effective `agentTabs.enabled` is false (FR-AE-05)
- Solution-canvas double-click still `selectAgentTab` / `/agent/:nodeId` with the bar off (FR-AE-01)
- Chip click still enters when the bar is on; Solution chip still returns (FR-AE-02)
- Nested canvas double-click does not re-enter (FR-AE-03)
- Independent Back/Solution on nested shell when the strip is not mounted (FR-AE-04)
- View mode still enters; nested edits stay blocked (FR-AE-06)
- Embed docs: `agentTabs.enabled` hides the strip only (FR-AE-07, FR-AE-08)

**Does not own**
- Single-click enter
- Browser-only back
- Live hidden tab chips while the bar is off
- Properties schema, palettes overlay, Condition edges, Router connectors
- Committing `src/app/try/`

**Done when**
- Bar off: dblclick enters; no chips from select/drop; nested Back returns
- Bar on: chips still enter/exit
- Nested: no second enter on dblclick
- View: still enters; nested graph read-only
- Docs updated; `npm test` / `npm run build` green
