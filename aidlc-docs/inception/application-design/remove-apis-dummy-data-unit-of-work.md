# Unit of Work — Remove APIs and dummy data

**Parent label**: Remove APIs and dummy data  
**Deployment model**: Same monolith Angular SPA (no new package)  
**Unit meaning**: One logical construction module  
**Sequencing**: Single unit — FD → Code Generation → Build and Test (plan Q2=A)  
**Ownership**: Same stream (plan Q4=A)  
**Construction**: Functional Design → Code Generation; skip NFR Requirements/Design and Infrastructure Design (plan Q2=A)  
**Product boundary**: No Enso catalog HTTP; omit `[palettes]` without adapter is empty-remote; nested skills from palettes; no dummy Repeater workflows  
**Application Design**: `remove-apis-dummy-data-application-design.md`  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A  
**Depends on**: U-HPI overlay, U-PAL-02 adapter, U-LIM featured replace — COMPLETE

---

## Code organization (brownfield) — Q3=A

```text
src/environments/
  environment.ts                        # CHANGE strip catalog URLs/IDs/credentials
  environment.prod.ts                   # CHANGE same

proxy.conf.json                         # CHANGE remove /enso-api
angular.json                            # CHANGE drop proxyConfig if unused

src/app/
  core/data/
    enso-task-catalog.service.ts        # CHANGE no HttpClient; omit-without-adapter empty-remote
    enso-task-catalog.service.spec.ts   # CHANGE drop HTTP/Enso cases; add empty-omit
  core/domain/
    enso-pipeline.mapper.ts             # DELETE (HTTP-only)
    enso-pipeline.mapper.spec.ts        # DELETE
    enso-task.mapper.ts                 # DELETE (HTTP-only)
    enso-task.mapper.spec.ts            # DELETE
    mock-skills.catalog.ts              # DELETE
    repeater-mock.catalog.ts            # DELETE
    properties.schema.ts                # CHANGE Repeater options []
    logic-node-rules.spec.ts            # CHANGE no mock catalog
    agent-skills.spec.ts                # CHANGE no MOCK_SKILLS
    enso-task-form.ts                   # KEEP (Properties, not catalog HTTP)
  core/facade/
    workflow.facade.ts                  # CHANGE addSkillToAgent without findMockSkill
    workflow.facade.spec.ts             # CHANGE
  features/agent/
    nested-skills-library.component.ts  # CHANGE [palettes] + addSkillFromPaletteItem
    nested-skills-library.component.spec.ts  # ADD or EXTEND if present
  features/shell/
    right-sidebar.component.ts          # CHANGE empty Repeater pickers
    left-sidebar.palette.spec.ts        # CHANGE omit = empty-remote (not static featured)

docs/
  workflow-builder-ui-embed.md          # CHANGE empty-when-omit; nested palettes; no Enso/proxy/Bearer

README.md                               # CHANGE no Enso token/proxy
```

No new Angular project. No `core/data/palette-catalog/` folder (Q3≠B). Do not commit `src/app/try/` or catalog credentials.

---

## Unit Catalog

### U-RAD-01 — Remove APIs and dummy data

| Field | Value |
|---|---|
| **Id** | `u-rad-01-remove-apis-dummy-data` |
| **Stories** | US-RAD-01, US-RAD-02, US-RAD-03, US-RAD-04 |
| **Responsibility** | Remove Enso catalog HTTP, env URLs/credentials, `/enso-api`; omit-without-adapter = empty-remote; convert nested library to palettes; delete MOCK_SKILLS and Repeater mocks; docs |
| **Primary components** | `EnsoTaskCatalogService`, environments, proxy, nested-skills-library, facade, properties schema, right-sidebar, embed/README |
| **Depends on** | U-HPI `hostPalettes` overlay; U-PAL-02 catalog adapter tokens; U-LIM compose omit-static-featured when palettes present |
| **Out of scope** | New backend; removing catalog adapters; removing `SAMPLE_WORKFLOW`; renaming the catalog service; mounting Developed-skills chrome; changing adapter-failure to empty-remote |
| **Internal order** | Env/proxy/HTTP/mappers out → empty-omit + PBT → nested palettes + MOCK_SKILLS → Repeater mocks → docs/tests |
| **PBT** | Partial — omit-without-adapter never emits Enso or static featured rows |
| **Done when** | US-RAD-01..04 AC pass; default SPA empty library and no Enso HTTP; nested list from palettes; Repeater pickers empty; no credentials in env/docs; `npm test` / `npm run build` green |

---

## Construction Rule

After Units Generation approval, CONSTRUCTION runs **U-RAD-01** (Functional Design → Code Generation → Build and Test), then Operations placeholder.
