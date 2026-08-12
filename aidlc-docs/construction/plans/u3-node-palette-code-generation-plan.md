# U3 Code Generation Plan — Node Palette

**Status**: APPROVED — Part 2 COMPLETE  
**Unit**: `u3-node-palette`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-4.1, US-4.2 (+ click-to-add)  

### Locked inputs
| Area | Decision |
|---|---|
| Categories | Flow / Logic / Integration / AI, expandable |
| Search | RxJS debounceTime(150) + clear |
| DnD | `@angular/cdk` cdkDrag on palette; create on drag-end hit-test over canvas viewport |
| Preview | CDK default |
| Drop zone | Canvas viewport only |
| createNode | Select new node; id `n-{type}-{shortRandom}` |
| Click-to-add | Viewport center |
| Errors | try/catch → canvasError |
| Non-goals | No edge draw, no Properties open-on-create, no Templates |

---

## Generation Steps

### Step 1 — Dependency
- [x] Install `@angular/cdk@^20.2.14` (latest Angular 20 CDK; no 20.3 published)

### Step 2 — Domain / catalog
- [x] `PaletteCatalog` data (categories + items)
- [x] `node-factory` helpers (id, defaults)
- [x] Search filter helper (pure)

### Step 3 — Store / facade
- [x] `GraphStore.addNode`
- [x] `WorkflowFacade.createNode(type, position)` with validation + try/catch

### Step 4 — Unit tests (+ PBT)
- [x] Factory/catalog/filter tests
- [x] fast-check: type ∈ catalog; id pattern
- [x] Facade createNode smoke

### Step 5 — Business logic summary
- [x] `aidlc-docs/construction/u3-node-palette/code/business-logic-summary.md`

### Step 6 — Frontend
- [x] Evolve Nodes Library into categorized searchable palette with CDK drag
- [x] Canvas drop target id + drag-end world create
- [x] Click-to-add + keyboard Enter/Space
- [x] Keep Templates disabled

### Step 7 — Frontend tests / app.spec
- [x] Update specs as needed (createNode / palette smoke)

### Step 8 — Frontend summary
- [x] `frontend-components-summary.md`

### Step 9 — API layer
- [x] SKIP documented

### Step 10 — Docs
- [x] README Phase 4 note + `code-generation-summary.md`

### Step 11 — Deployment artifacts
- [x] SKIP documented

### Step 12 — Verify
- [x] `npm test` + `npm run build` pass (17 tests)
- [x] Confirm U4+ features absent

---

## Approval
Part 2 generation complete — awaiting stage approval to continue.
