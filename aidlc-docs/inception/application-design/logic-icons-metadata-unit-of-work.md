# Unit of Work — Host logic extras + agent metadata

**Parent label**: Host logic extras + agent metadata  
**Deployment model**: Same monolith Angular SPA (no new package)  
**Unit meaning**: One logical construction module  
**Sequencing**: Single unit — FD → Code Generation → Build and Test (plan Q2=A)  
**Ownership**: Same stream (plan Q4=A)  
**Construction**: Functional Design → Code Generation; skip NFR Requirements/Design and Infrastructure Design (plan Q2=A)  
**Product boundary**: Extra Condition / Router / Repeater cards with library icons; metadata on drop; featured strip replace when `[palettes]` present  
**Application Design**: `logic-icons-metadata-application-design.md`  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A  
**Depends on**: Host palette inputs (U-HPI) COMPLETE; logic nodes / catalog compose shipped

---

## Code organization (brownfield) — Q3=A

```text
src/app/
  core/domain/
    icon-url.ts                         # NEW sanitizeIconUrl
    icon-url.spec.ts                    # NEW example + PBT
    palette.catalog.ts                  # EXTEND PaletteItem iconUrl iconPath metadata
    palette-host.helpers.ts             # EXTEND sanitize extras; featuredLogicItems
    palette-host.helpers.spec.ts        # EXTEND
    palette-host.helpers.pbt.spec.ts    # EXTEND
    node.factory.ts                     # EXTEND data.metadata
    node.factory.spec.ts                # EXTEND
  core/ui-config/
    ui-features.types.ts                # EXTEND DefaultAgentCard
    merge-ui-features.ts                # EXTEND normalizeDefaultAgentCards
    merge-ui-features.spec.ts           # EXTEND
  core/data/
    enso-task-catalog.service.ts        # EXTEND compose omit static featured when host palettes present
    enso-task-catalog.service.spec.ts   # EXTEND
  features/shell/
    left-sidebar.component.ts           # EXTEND featuredLogicItems; library icons
    left-sidebar.palette.spec.ts        # EXTEND

docs/
  workflow-builder-ui-embed.md          # EXTEND extra logic / icons / metadata / replace rule

src/app/try/                            # OPTIONAL samples; gitignored
```

No new Angular project. No `core/domain/palette-host/` folder (Q3≠B).

---

## Unit Catalog

### U-LIM-01 — Host logic extras + agent metadata

| Field | Value |
|---|---|
| **Id** | `u-lim-01-logic-icons-metadata` |
| **Stories** | US-LIM-01, US-LIM-02, US-LIM-03, US-LIM-04 |
| **Responsibility** | Extra logic cards; featured strip replace; `sanitizeIconUrl`; library icons; `metadata`/`taskMeta` ingest; drop `data.metadata`; embed docs |
| **Primary components** | `icon-url.ts`, palette-host helpers, catalog compose, left-sidebar, node.factory, DefaultAgentCard, embed markdown |
| **Depends on** | U-HPI overlay (`[palettes]` / `[defaultAgents]`); existing featured strip and factory `ensoTask` |
| **Out of scope** | Canvas/Properties icons; metadata Properties editor; new injectable; unknown types; `http:` URLs |
| **Internal order** | icon-url + types → sanitizers + featured helper → JSON normalize → compose omit → sidebar icons → factory metadata → docs/try → tests/PBT |
| **PBT** | Partial — URL allowlist, metadata object-only, featured replace when host palettes present |
| **Done when** | US-LIM-01..04 AC pass; omit palettes keeps static three; present palettes replaces them; unsafe URLs never in `img src`; drop copies metadata; docs; `npm test` green |

---

## Construction Rule

After Units Generation approval, CONSTRUCTION runs **U-LIM-01** (Functional Design → Code Generation → Build and Test), then Operations placeholder.
