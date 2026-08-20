# U-DP-01 Code Generation Plan — Dynamic Properties

**Status**: GENERATION COMPLETE — awaiting code review  
**Unit**: `u-dp-01-dynamic-properties`  
**Workspace**: `/Users/trivenigogireddy/Work/workflow-builder`  
**Stories**: US-DP-01, US-DP-02, US-DP-03, US-DP-04, US-DP-05  
**Design**: `aidlc-docs/construction/u-dp-01-dynamic-properties/functional-design/`  
**FD locks**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A  

This plan is the single source of truth for Code Generation. Do not run Part 2 until approved.

**N/A**: API / repository / DB / deployment artifacts (client SPA). NFR Requirements/Design and Infrastructure Design skipped.

Public API and examples MUST NOT use Enso field names.

---

## Unit context

| Item | Value |
|---|---|
| Depends on | U-HP-01 schema/resolve/sidebar; `patchNode`; UI chrome merge |
| Pattern | Values in `node.data.properties`; schema metadata first-win; Dynamic Property for remaining keys |
| Out of scope | Live widget registry; instance `[properties]` input; `propertiesChange` output; migrating built-ins into the map |

---

## Story coverage

| Story | Steps |
|---|---|
| US-DP-01 Bind + Save to properties map | 2–3, 5–6, 9 |
| US-DP-02 Dynamic Property + inference | 2–3, 5–6, 9 |
| US-DP-03 Built-ins + collision | 2, 5–6, 9 |
| US-DP-04 Add property chrome | 1, 5–6, 9 |
| US-DP-05 Embed docs + try host | 7–8 |

---

## Generation Steps

### Step 1 — Chrome flag `propertiesPanel.addProperty` (FR-DP-06)

- [x] Modify `src/app/core/ui-config/ui-features.types.ts` — add `addProperty: boolean` to `PropertiesPanelFeatures`; add path to `UI_FEATURE_PATHS` if applicable
- [x] Modify `src/app/core/ui-config/merge-ui-features.ts` — default `addProperty: false`; pick boolean leaf in normalize/merge
- [x] Extend merge/normalize specs — default false; overlay true merges

### Step 2 — Pure helpers (FR-DP-01, FR-DP-03, FR-DP-05, P-DP-01..03)

- [x] Create `src/app/core/domain/host-properties.dynamic.ts` — `getPropertiesMap`, `withPropertiesMap`, `inferControlKind`, `schemaCoveredPaths`, `builtInCollisionIds`, `listRemainingPropertyKeys` per FD
- [x] Create `src/app/core/domain/host-properties.dynamic.spec.ts` — example cases (malformed map, order, collision, infer)
- [x] Create `src/app/core/domain/host-properties.dynamic.pbt.spec.ts` — P-DP-01, P-DP-02, P-DP-03 (`fc.assert` + seed)

### Step 3 — Dynamic Property component (FR-DP-02, Q7=A)

- [x] Create `src/app/features/shell/dynamic-property.component.ts` — standalone; inputs key/value/metadata/disabled; output valueChange; text/number/boolean/readonlyJson; no HTML injection
- [x] Create `src/app/features/shell/dynamic-property.component.spec.ts` — infer kinds; disabled JSON; emits on edit

### Step 4 — (N/A layers)

- [x] N/A — skip API / repository / DB / deployment

### Step 5 — Right sidebar bind/save + remaining + Add (FR-DP-04..07, US-DP-01..04)

- [x] Modify `src/app/features/shell/right-sidebar.component.ts`:
  - Import helpers + Dynamic Property
  - Schema field get/set against `getPropertiesMap` / paths under map (not top-level `node.data` for host schema fields)
  - Built-in fields remain on `node.data` paths as today
  - Render remaining keys via `wb-dynamic-property`
  - Add row when effective chrome `propertiesPanel.addProperty`
  - Save: merge `properties` via `withPropertiesMap` + `patchNode`; General + built-ins unchanged
  - View mode disables; hide Add
- [x] Modify `src/app/features/shell/right-sidebar.component.spec.ts` — Save to `data.properties`; remaining inferred; Condition collision omit; Add gated by chrome

### Step 6 — Compile / leftover fixes

- [x] Fix any broken imports/tests from path bind change
- [x] Ensure existing host-properties specs still pass or update expectations to properties map

### Step 7 — Embed docs (US-DP-05, FR-DP-08/09, NFR-DP-04)

- [x] Modify `docs/workflow-builder-ui-embed.md` — `node.data.properties` value map; schema paths relative to map; inference; `propertiesPanel.addProperty`; migration note off top-level value paths; no Enso names / secrets

### Step 8 — Try host demo (US-DP-05)

- [x] Modify `src/app/try/try-ui-host.component.ts` — example with `propertiesSchema` + seeded `properties` extras; optional toggle/demo for `addProperty`

### Step 9 — Construction markdown summaries

- [x] Write `aidlc-docs/construction/u-dp-01-dynamic-properties/code/business-logic-summary.md`
- [x] Write `aidlc-docs/construction/u-dp-01-dynamic-properties/code/frontend-components-summary.md`
- [x] Write `aidlc-docs/construction/u-dp-01-dynamic-properties/code/code-generation-summary.md`
- [x] Mark N/A stubs if required by project convention (`api-layer-SKIP.md`, etc.) only if prior units did — match U-HP-01 pattern

### Step 10 — Verify

- [x] Run `npm test` (or project test command) and `npm run build`; fix failures in-scope

---

## Extension compliance (CG)

| Extension | Plan |
|---|---|
| Security | No HTML bind; vendor-neutral docs; no secrets in try/docs |
| Resiliency | Malformed map → `{}`; skip-invalid unchanged |
| PBT Partial | Step 2 P-DP-01..03 |

---

## Approval

Reply **Approve & Continue** (or **Request Changes**) after reviewing this plan. Generation starts only after approval.
