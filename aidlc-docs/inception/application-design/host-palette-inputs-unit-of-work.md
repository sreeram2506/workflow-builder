# Unit of Work — Host palette inputs (Syncfusion-style)

**Parent label**: Host palette inputs  
**Deployment model**: Same monolith Angular SPA (no new package)  
**Unit meaning**: One logical construction module  
**Sequencing**: Single unit — FD → Code Generation → Build and Test (Q2=A)  
**Ownership**: Same stream (Q3=A)  
**Construction**: Functional Design → Code Generation; skip NFR Requirements/Design and Infrastructure Design (Q4=A)  
**Product boundary**: Parent `[palettes]` / `[defaultAgents]` on existing shells — no Stream canvas node, no `wb-workflow-builder` wrapper, no skills `[defaultAgents]`, no workflow document schema change (Q5=A)  
**Application Design**: `host-palette-inputs-application-design.md`  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A  
**Depends on**: U-PAL-02 COMPLETE (catalog adapter, empty-remote, featured strip, `resolveDefaultAgents`)

---

## Code organization (brownfield) — Q6=A

```text
src/app/
  features/shell/
    shell-layout.component.ts          # EXTEND: palettes + defaultAgents input()
    left-sidebar.component.ts          # EXTEND: overlay inputs; loadCatalog options
  features/agent/
    agent-skills-shell.component.ts    # EXTEND: palettes input()
  core/data/
    catalog.types.ts                   # EXTEND: CatalogLoadOptions overlay fields
    enso-task-catalog.service.ts       # EXTEND: present overlay wins; drop unknown types
  core/domain/
    palette-host.helpers.ts            # REUSE resolveDefaultAgents / allow-list
    workflow.models.ts                 # REUSE ALLOWED_NODE_TYPES (drop unknown)

docs/
  workflow-builder-ui-embed.md         # EXTEND: parent template [palettes] / [defaultAgents]
```

No new Angular project, no `src/app/core/host-palette/` service, catalog stays `providedIn: 'root'`.

---

## Unit Catalog

### U-HPI-01 — Host palette inputs

| Field | Value |
|---|---|
| **Id** | `u-hpi-01-host-palette-inputs` |
| **Stories** | US-HPI-01, US-HPI-02, US-HPI-03, US-HPI-04, US-HPI-05, US-HPI-06 |
| **Responsibility** | `input<PaletteItem[] \| undefined>()` and solution `defaultAgents` with **no default** (unbound = omit); pass overlay through left sidebar into `loadCatalog`; present palettes replace Enso and provider adapter (`[]` = empty-remote); present defaultAgents replace JSON/provider; catalog drops unknown `type` / invalid shapes; featured + defaults stay when items present; embed docs |
| **Primary components** | `ShellLayoutComponent`, `AgentSkillsShellComponent`, `LeftSidebarComponent`, `EnsoTaskCatalogService`, embed markdown |
| **Depends on** | U-PAL-02 catalog/sidebar; U-PAL-01 helpers; existing `PaletteItem` / `ALLOWED_NODE_TYPES` |
| **Out of scope** | Stream `NodeType`; component-scoped catalog tokens; skills `[defaultAgents]`; ng library |
| **Internal order** | `CatalogLoadOptions` overlay → catalog present-wins + drop unknown types + tests → sidebar pass-through + reload → shell/skills inputs → embed docs |
| **PBT** | Partial — omit vs `[]` vs items; unknown types never in output (NFR-HPI-04) |
| **Done when** | US-HPI-01..06 AC pass; omit = U-PAL-02; `[palettes]="[]"` empty-remote only; input wins over catalog provider; no Stream cards; `npm test` green |

---

## Construction Rule

After Units Generation approval, CONSTRUCTION runs **U-HPI-01** (Functional Design → Code Generation → Build and Test), then Operations placeholder.
