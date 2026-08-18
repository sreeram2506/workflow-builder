# Integration Test Instructions

## Purpose
U-HP-01 first-win Properties schema (palette copy → adapter → logic built-in → General only), Save along field `path`s, and no flatten of opaque blobs.

This SPA has one construction unit. Automated checks live in the Vitest suite (`npm test`). There is no separate multi-service integration runner.

## Test Scenarios

### Scenario 1: Palette schema copy → Properties render → Save
- **Description**: Dropped node with `propertiesSchema` shows those fields; Save writes the value at `path` on `node.data`
- **Setup**: `npm test`
- **Test Steps**: `node.factory.spec.ts`; `palette-host.helpers.spec.ts`; `right-sidebar.component.spec.ts` (schema Save)
- **Expected Results**: schema on `data.propertiesSchema`; form control for the field; Save updates the path (e.g. `timeout`)
- **Cleanup**: none

### Scenario 2: First-win order
- **Description**: Plain-object `data.propertiesSchema` (including `{}`) wins; adapter throw is skipped; omit schema uses Condition/Repeater built-ins; Action with no schema is General only
- **Setup**: `npm test`
- **Test Steps**: `host-properties.resolve.spec.ts`; `host-properties.resolve.pbt.spec.ts`; `right-sidebar.component.spec.ts`
- **Expected Results**: `{}` is not Condition built-in; adapter throw still has Condition expression; Action + `taskMeta` has empty `configFields`
- **Cleanup**: none

### Scenario 3: Opaque blobs are not flattened
- **Description**: `taskMeta` and leftover `ensoTask` are not walked into form fields
- **Setup**: `npm test`
- **Test Steps**: `right-sidebar.component.spec.ts`; `host-properties.resolve.pbt.spec.ts` (P-HP-03)
- **Expected Results**: no `enso` form group; no controls for nested blob keys
- **Cleanup**: none

### Scenario 4: Logic chrome unchanged
- **Description**: Condition true/false edges, Router connectors, Repeater existing ids still bind
- **Setup**: `npm test`
- **Test Steps**: `right-sidebar.component.spec.ts` logic-nodes describe; `logic-node-rules.spec.ts`
- **Expected Results**: Condition expression present when schema omitted; Repeater keeps `wf-claims-intake` / `v1`; connector name/condition required; condition-out label read-only
- **Cleanup**: none

### Scenario 5: Embed Properties supply (manual)
- **Description**: Host supplies palette `propertiesSchema` and/or `provideWorkflowBuilderUi({ properties: { schemaFor } })`
- **Setup**: `npm start`; see `docs/workflow-builder-ui-embed.md`
- **Test Steps**: Drop a host Action with schema; select it; edit a field; Save. Repeat with adapter-only schema (no `propertiesSchema` on the node).
- **Expected Results**: General always visible; host fields render; Save persists on `node.data`; unknown `ui_component` is disabled text
- **Cleanup**: stop `ng serve` if started only for this stage

## Setup Integration Test Environment

### 1. Start Required Services
```bash
npm start
```

No backend is required.

### 2. Configure Service Endpoints
None. Properties adapter is in-process (`schemaFor`).

## Run Integration Tests

### 1. Execute Integration Test Suite
```bash
npm test
```

### 2. Verify Service Interactions
See `docs/workflow-builder-ui-embed.md` (first-win; paths on `node.data`; opaque `taskMeta`).

### 3. Cleanup
Stop `ng serve` if started only for this stage.
