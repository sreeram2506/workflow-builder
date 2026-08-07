# Units of Work — Angular Workflow Builder

**Deployment model**: Single monolith Angular SPA (one package)  
**Unit meaning**: Logical construction modules (not separately deployable services)  
**Sequencing**: Strict sequential — finish Unit N (design + code + approval) before Unit N+1  
**First delivery gate**: Complete **U1** only, then hard stop for Phase 1 review

---

## Code Organization Strategy (Greenfield)

```text
workflow-builder/                 # repo / npm workspace root
  angular.json / package.json
  src/
    index.html
    main.ts
    styles/
      tokens.css                  # CSS custom properties (light/dark)
      styles.css
    app/
      app.config.ts
      app.routes.ts
      app.ts / app.html
      core/
        domain/                   # pure TS (geometry, validate, serialize later)
        stores/                   # GraphStore, UiStore
        facade/                   # WorkflowFacade
        data/                     # MockWorkflowRepository + seed JSON
      shared/                     # presentational primitives
      features/
        shell/
        canvas/                   # from U2
        palette/                  # from U3
        properties/               # from U5
        theme/                    # ThemeToggle in U1
        run/                      # from U8
        serialization/            # from U7
  aidlc-docs/                     # documentation only
```

- Units do **not** create separate Angular projects/libs
- Later units extend `core/` and add feature folders; they do not fork state ownership

---

## Unit Catalog

### U1 — App Shell, Design Tokens, Theme, Seed Store
| Field | Value |
|---|---|
| **Build phases** | Phase 1 |
| **Responsibility** | Scaffold Angular app; shell layout (top/left/canvas/right); CSS tokens; dark default + theme toggle; GraphStore + UiStore + WorkflowFacade; load 4–5 mock nodes/edges |
| **Primary components** | App, ShellLayout, TopBar, LeftSidebar, RightSidebar, CanvasHost (placeholder), ThemeToggle |
| **Primary services** | WorkflowFacade, GraphStore, UiStore, MockWorkflowRepository |
| **Out of scope** | Pan/zoom, node render, palette, connections, properties editing, history, run |
| **Done when** | US-1.1, US-1.2, US-1.3 pass; user Phase 1 review gate |

### U2 — Canvas Engine (Navigate + Render + Select)
| Field | Value |
|---|---|
| **Build phases** | Phases 2–3 |
| **Responsibility** | Viewport pan/zoom/grid/minimap/zoom controls; render HTML nodes + SVG edges from store; selection + lasso highlight |
| **Depends on** | U1 stores/facade/shell host |
| **Done when** | US-2.* and US-3.* pass |

### U3 — Node Palette
| Field | Value |
|---|---|
| **Build phases** | Phase 4 |
| **Responsibility** | Categorized searchable palette; CDK drag-drop create node on canvas |
| **Depends on** | U1, U2 (drop coordinates / canvas host) |
| **Done when** | US-4.1, US-4.2 pass |

### U4 — Connections & Edge Reshape
| Field | Value |
|---|---|
| **Build phases** | Phase 5 (+ FR-09 reshape) |
| **Responsibility** | Handles; draw edges; direction-only validation; waypoint drag with grid snap |
| **Depends on** | U1, U2 |
| **Done when** | US-5.1, US-5.2, US-5.3 pass |

### U5 — Schema-Driven Properties Panel
| Field | Value |
|---|---|
| **Build phases** | Phase 6 |
| **Responsibility** | Right sidebar forms from per-type JSON schema; live patches via facade; read-only inspect path prepared for view mode |
| **Depends on** | U1 (selection), schema registry |
| **Gate** | Confirm field lists before inventing fields (stop-and-ask) |
| **Done when** | US-6.1 (and US-6.2 AC readiness; full view-mode lock in U8) |

### U6 — Smart Routing & Auto-Layout
| Field | Value |
|---|---|
| **Build phases** | Phases 7–8 |
| **Responsibility** | Edge auto-routing; one-click layout options |
| **Depends on** | U1–U4 graph model |
| **Gate** | Stop-and-ask: routing complexity; hand-rolled vs approved layout lib |
| **Done when** | US-E7 / US-E8 detailed stories (to be expanded after gates) satisfied |

### U7 — Serialization, Autosave, History, Clipboard
| Field | Value |
|---|---|
| **Build phases** | Phase 9 |
| **Responsibility** | Export/import JSON; debounced in-memory autosave; undo/redo; copy/paste; introduce HistoryService (deferred from app design) |
| **Depends on** | U1 core; graph mutations from prior units |
| **PBT** | Round-trip serialize/deserialize (Partial PBT) |
| **Done when** | US-9.1–US-9.5 pass |

### U8 — Simulated Run & View Mode
| Field | Value |
|---|---|
| **Build phases** | Phase 10 + View Mode |
| **Responsibility** | Run simulation status walk; enter/exit view mode; lock mutating controls |
| **Depends on** | All prior feature units for lock surface area |
| **Done when** | US-10.1, US-VM.1–3, US-6.2 (view inspect) pass |

---

## Construction Rule
After Units Generation approval, CONSTRUCTION starts with **U1 only** (Functional Design → NFR Requirements → NFR Design → Code Generation → Build/Test), then stops for explicit Phase 1 confirmation before U2.
