# Logical Components — U5 (NFR Design)

## In-scope

### properties.schema (static module)
| Field | Detail |
|---|---|
| **Type** | Static TypeScript module under `core/domain/` |
| **Responsibility** | XPMS-style descriptors per `NodeType`; General field definitions; locked v1 boolean Configuration mock |
| **Does not** | HTTP fetch; injectable service |

### config-path helpers (pure)
| Field | Detail |
|---|---|
| **Type** | Pure functions (`getAtPath`, `setAtPath`) under `core/domain/` |
| **Responsibility** | Immutable nested read/write under `node.data` via `config_path` |
| **PBT** | Round-trip invariants for safe paths |

### UiStore (evolve)
| Field | Detail |
|---|---|
| **APIs** | `selectionFocusNodeId`; `propertiesDraft` (working `WorkflowNode` or null); setters/clear |
| **Responsibility** | Most-recent click focus; dual-write draft for Properties |

### WorkflowFacade (evolve)
| Field | Detail |
|---|---|
| **APIs** | `patchNode(id, partial)`; focus helpers on select/toggle; draft sync orchestration as needed |
| **Errors** | try/catch on patch → `canvasError`; missing node no-op |

### GraphStore (evolve)
| Field | Detail |
|---|---|
| **APIs** | `patchNode` / update node by id (immutable merge of root + `data`) |

### RightSidebarComponent (evolve in place)
| Field | Detail |
|---|---|
| **Owns** | Reactive FormGroup; Save enablement; empty state; view-mode disable; auto-expand on sole selection |
| **Maps** | Schema descriptors → controls; form ↔ `propertiesDraft` |
| **Does not** | PropertiesService; live GraphStore writes on keystroke |

## Explicitly out of scope
| Component | Reason |
|---|---|
| PropertiesService | Q4 = A |
| PropertiesSchemaRegistry injectable | Q3 = A |
| PropertiesFormComponent child | Q4 = A (in-place sidebar) |
| Queues / caches / CB | No backend |
| DomSanitizer HTML descriptions | Q5 = A |

## Dependency diagram

```text
Selection / click
  -> facade updates selection + selectionFocusNodeId
  -> clear/rebuild propertiesDraft from GraphStore node

RightSidebar FormGroup
  -> valueChanges -> UiStore.propertiesDraft (dual-write)
  -> canvas still reads GraphStore document

Save (valid + dirty + edit mode)
  -> facade.patchNode(focusId, from draft)
       -> getAtPath/setAtPath for Configuration
       -> GraphStore immutable node update
  -> re-baseline draft from saved node

Unexpected throw -> canvasError
```

## Infrastructure
Confirm **Infrastructure Design SKIP** for U5 (no cloud resources).
