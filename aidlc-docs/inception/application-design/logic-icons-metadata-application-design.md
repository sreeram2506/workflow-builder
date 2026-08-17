# Application Design Summary — Host logic extras + agent metadata

Consolidates `logic-icons-metadata-*.md` design artifacts.

## Decisions locked (plan)

| Q | Answer | Design implication |
|---|---|---|
| Q1 | **A** | `icon-url.ts` next to palette-host helpers |
| Q2 | **A** | `featuredLogicItems`; compose omits static featured types when host palettes present |
| Q3 | **A** | Sidebar methods; no `wb-palette-icon` |
| Q4 | **A** | Extend `createWorkflowNodeFromPaletteItem` |
| Q5 | **A** | No new injectable |

## Artifacts

| File | Content |
|---|---|
| `logic-icons-metadata-components.md` | Types, sanitizers, sidebar, factory, docs |
| `logic-icons-metadata-component-methods.md` | APIs |
| `logic-icons-metadata-services.md` | Orchestration + strip/icon rules |
| `logic-icons-metadata-component-dependency.md` | Matrix, data flow, U-LIM-01 |

## Traceability

| FR / Story | Design coverage |
|---|---|
| FR-LIM-01 · US-LIM-01 | Extra logic cards on palettes |
| FR-LIM-02 · US-LIM-01 | Compose omit + `featuredLogicItems` |
| FR-LIM-03..06 · US-LIM-02 | `icon-url.ts` + sidebar icon methods |
| FR-LIM-07..09 · US-LIM-03 | Sanitize metadata/taskMeta; factory copy |
| FR-LIM-10 · US-LIM-04 | Embed docs |
| NFR-LIM-02/03 | Allowlist + glyph fallback |
| NFR-LIM-04 | PBT on sanitizers / featured helper in FD/CG |

## Next

Units Generation (1 unit U-LIM-01) → Construction Functional Design → Code Generation → Build and Test.
