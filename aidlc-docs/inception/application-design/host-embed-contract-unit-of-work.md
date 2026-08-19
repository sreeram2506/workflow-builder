# Unit of Work — Host embed contract

**Parent label**: Host embed contract  
**Deployment model**: Same monolith Angular SPA (no new package / no ng-packagr)  
**Unit meaning**: One logical construction module  
**Sequencing**: Single unit — Code Generation → Build and Test (plan Q2=A; Functional Design skipped)  
**Ownership**: Same stream (plan Q4=A)  
**Construction**: Code Generation; skip Functional Design, NFR Requirements/Design, and Infrastructure Design (plan Q2=A)  
**Product boundary**: Host load/read document, optional Save/Run hooks, fill-host height  
**Application Design**: SKIP  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A  
**Depends on**: `WorkflowDocument` serialize/parse, shells `[ui]`/`[palettes]`, Save/Run chrome — COMPLETE

---

## Code organization (brownfield) — Q3=A

```text
src/app/
  core/facade/
    workflow.facade.ts              # CHANGE: loadDocument, getDocument, dirty;
                                    #         Save/Run dispatch to host handler or default
    workflow.facade.spec.ts         # EXTEND: invalid load keep last; handler vs download/simulate
  core/domain/
    workflow.serialize.ts           # REUSE/EXTEND: parse fail-safe for load
    workflow.serialize.spec.ts      # EXTEND PBT Partial round-trip if needed
  core/ui-config/
    provide-workflow-builder-ui.ts  # CHANGE: persist?: { save?; run? }
    persist-adapter.ts              # ADD optional: token + save/run types (or colocate)
  features/shell/
    shell-layout.component.ts       # CHANGE: [document], (documentChange), (save), (run);
                                    #         height 100% / min-height 0
    chrome-shortcuts.directive.ts   # CHANGE: Cmd/S uses facade Save dispatch
    zoom-controls.component.ts      # CHANGE: Save/Run buttons use facade dispatch
  features/agent/
    agent-skills-shell.component.ts # CHANGE: height 100%; no duplicate solution [document]

docs/
  workflow-builder-ui-embed.md      # CHANGE: document I/O, persist hooks, fill-host
```

No new Angular project. No `core/embed-contract/` folder (Q3≠B). Do not commit `src/app/try/` unless asked.

**Construction notes**
- `getDocument()` flushes nested canvas onto the solution agent first (same as persist-on-exit).
- Persist first-win: bound shell `(save)` / `(run)` wins over `provideWorkflowBuilderUi({ persist })`; else default blob Save / simulated Run.
- Invalid `[document]` / `loadDocument` does not wipe last good graph.

---

## Unit Catalog

### U-HE-01 — Host embed contract

**Stories**: US-HE-01, US-HE-02, US-HE-03, US-HE-04  
**FR**: FR-HE-01..09  
**NFR**: Security (no secrets in docs/emits); Resiliency (invalid load keep last good); PBT Partial (serialize/parse round-trip)  

**Owns**
- `loadDocument` / `[document]` apply (FR-HE-01)
- Invalid load fail-safe (FR-HE-02)
- `getDocument` / dirty (FR-HE-03)
- `(documentChange)` after load and committed edits (FR-HE-04)
- Save host hook vs blob download (FR-HE-05)
- Run host hook vs simulated Run (FR-HE-06)
- Export/Import files unchanged (FR-HE-07)
- Shell `height: 100%` (FR-HE-08)
- Embed docs (FR-HE-09)

**Does not own**
- ng-packagr / npm publish
- Properties widget registry, graph validation, Repeater option lists, real run engine, theme tokens
- Removing defaults when no handler is set
- Committing `src/app/try/`

**Done when**
- Valid `[document]` loads; invalid keeps last good + status
- Host can read getDocument / dirty / documentChange
- Save/Run handlers fire when set; otherwise download/simulate
- Shells fill host box; docs updated; `npm test` / `npm run build` green
