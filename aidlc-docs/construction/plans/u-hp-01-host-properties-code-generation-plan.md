# U-HP-01 Code Generation Plan — Generic host-driven Properties

**Status**: GENERATION COMPLETE — awaiting code review  
**Unit**: `u-hp-01-host-properties`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-HP-01, US-HP-02, US-HP-03, US-HP-04  
**Design**: `aidlc-docs/construction/u-hp-01-host-properties/functional-design/`  
**FD locks**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A  

This plan is the single source of truth for Code Generation. Do not run Part 2 until approved.

**N/A**: API / repository / DB / deployment artifacts (client SPA). NFR Requirements/Design and Infrastructure Design skipped.

Public API and examples MUST NOT use Enso field names (`ensoTask`, skillconfig, x_config, PlatformApi, configurations, Xpms).

---

## Unit context

| Item | Value |
|---|---|
| Depends on | Properties panel, `getAtPath`/`setAtPath`, `[palettes]` overlay, `provideWorkflowBuilderUi` |
| Pattern | First-win schema; drop copy; stop flatten / Ignore Keys |
| Out of scope | Live widget registry; instance `[properties]` input; migrating leftover `ensoTask`; Enso HTTP |

---

## Story coverage

| Story | Steps |
|---|---|
| US-HP-01 Schema copy, render, Save | 1–3, 5–7, 11 |
| US-HP-02 Supply order; General only | 2, 4, 6–7, 11 |
| US-HP-03 No flatten; unknown widget | 3, 6–8, 11 |
| US-HP-04 Embed docs | 10 |

---

## Generation Steps

### Step 1 — Schema types + sanitize + logic built-ins (FR-HP-01, FR-HP-05, FR-HP-09, P-HP-01)

- [x] Create `src/app/core/domain/host-properties.schema.ts` — `HostPropertiesSchema` / section / field types; `sanitizeHostPropertiesSchema`; `logicBuiltinPropertiesSchema(type)` (Condition `condition` textarea; Repeater workflow/version/pause with empty options; Decision empty sections). Not Enso-named.
- [x] Create `src/app/core/domain/host-properties.schema.spec.ts` — skip empty path / `..` / unknown type; keep valid rest.
- [x] Create `src/app/core/domain/host-properties.schema.pbt.spec.ts` — P-HP-01 (`fc.assert` + seed).

### Step 2 — Resolver (FR-HP-02, P-HP-02, Q1=A, Q2=A)

- [x] Create `src/app/core/domain/host-properties.resolve.ts` — `resolveHostPropertiesSchema(node, adapter | null)`: plain-object `data.propertiesSchema` (including `{}`) wins; adapter `schemaFor` in try/catch (throw/non-object → skip); else logic built-in; else `null`.
- [x] Create `src/app/core/domain/host-properties.resolve.spec.ts` — `{}` wins over Condition built-in; adapter throw → built-in; Action + taskMeta → `null` (P-HP-03 example).
- [x] Add PBT P-HP-02 / P-HP-03 in that spec or `host-properties.resolve.pbt.spec.ts`.

### Step 3 — Palette + factory copy (FR-HP-03, Q4=A)

- [x] Modify `src/app/core/domain/palette.catalog.ts` — optional `propertiesSchema?: HostPropertiesSchema` on `PaletteItem`.
- [x] Modify `src/app/core/domain/palette-host.helpers.ts` — copy plain-object `propertiesSchema` in `applyHostExtras` / `sanitizeHostPaletteItems`.
- [x] Modify `src/app/core/domain/palette-host.helpers.spec.ts` — overlay copies schema.
- [x] Modify `src/app/core/domain/node.factory.ts` — copy `propertiesSchema`; copy `taskMeta` to `data.taskMeta` (not `ensoTask`).
- [x] Modify `src/app/core/domain/node.factory.spec.ts` — `taskMeta` not `ensoTask`; schema copied.

### Step 4 — Properties adapter DI (FR-HP-02, Q3=A App Design)

- [x] Create `src/app/core/ui-config/properties-adapter.ts` — `WorkflowBuilderPropertiesAdapter` with sync `schemaFor`; `WORKFLOW_BUILDER_PROPERTIES` token.
- [x] Modify `src/app/core/ui-config/provide-workflow-builder-ui.ts` — `options.properties?: WorkflowBuilderPropertiesAdapter`; provide token when set.
- [x] Re-export from `src/app/core/ui-config` public barrel if one exists.

### Step 5 — Built-in properties.schema.ts (FR-HP-06)

- [x] Modify `src/app/core/domain/properties.schema.ts` — remove Ignore Keys / `schemaFor` mock / `assertRegistryV1Invariant` v1 Ignore Keys rule. Keep `NODE_STATUS_OPTIONS`, `controlKeyForPath`, `isLogicNodeType`. Logic field lists come from `logicBuiltinPropertiesSchema` (or thin wrappers). Do not export host-facing Xpms.
- [x] Modify `src/app/core/domain/config-path.spec.ts` — drop Ignore Keys invariant; assert Condition/Repeater paths via new types; Action/Trigger have no configuration fields.
- [x] Modify `src/app/core/domain/logic-node-rules.spec.ts` — Repeater options still `[]` via built-in schema.

### Step 6 — Right sidebar (FR-HP-04..08, Q3=A, Q5=A, Q7=A)

- [x] Modify `src/app/features/shell/right-sidebar.component.ts`:
  - Inject optional `WORKFLOW_BUILDER_PROPERTIES`
  - `bindNode`: General always; resolve schema; no `collectEnsoTaskFields`; no Ignore Keys
  - Render sections + fields; unknown `ui_component` → disabled text
  - Save: coerce boolean / number / string / `string[]`; `setAtPath` on `node.data`; hidden not written
  - View mode still disables
  - Repeater built-in: empty option lists; do not clear existing ids
  - Connector / Condition edge UI unchanged
- [x] Modify `src/app/features/shell/right-sidebar.component.spec.ts` — schema render + Save to path; Action + taskMeta not flattened; omit schema Condition still has built-in; unknown widget disabled; leftover `ensoTask` unused.

### Step 7 — Stop flatten (FR-HP-08)

- [x] Remove `collectEnsoTaskFields` usage (sidebar already in Step 6).
- [x] Delete `src/app/core/domain/enso-task-form.ts` and `.spec.ts` if unused; otherwise move remaining coerce helpers next to host-properties and delete flatten APIs.

### Step 8 — Tests leftover compile (US-HP-01..03)

- [x] Fix remaining references to `configurationFieldsFor` Ignore Keys, `ensoTask` form source, `assertRegistryV1Invariant`.

### Step 9 — (reserved alignment) — no extra API layer

- [x] N/A — skip API/repository/DB (client SPA)

### Step 10 — Docs (US-HP-04, FR-HP-10)

- [x] Modify `docs/workflow-builder-ui-embed.md` — `propertiesSchema` on palette items; `provideWorkflowBuilderUi({ properties: { schemaFor } })`; first-win; paths on `node.data`; General always; opaque `taskMeta`; no Enso names; no secrets.

### Step 11 — Regression

- [x] `npm test` — all green
- [x] `npm run build` — success (budget warnings OK)

### Step 12 — Construction code summaries

- [x] `aidlc-docs/construction/u-hp-01-host-properties/code/business-logic-summary.md`
- [x] `frontend-components-summary.md`
- [x] `code-generation-summary.md`
- [x] SKIP stubs: `api-layer-summary.md`, `repository-layer-summary.md`, `deployment-artifacts-summary.md`

---

## Explicitly not in this unit

- Live `ui_component` → Angular component map
- Instance `[properties]` input on shells
- Migrating leftover `data.ensoTask` → `taskMeta`
- Enso HTTP, PlatformApi widgets
- ng-packagr, document I/O, 100vh
- Breaking chrome flags, `[palettes]`, Condition edges, Router connectors
- Committing `src/app/try/`

---

## Approval

Approve this plan to run Part 2 in order.
