# Integration Test Instructions — U-PAL-02

**Scope**: U-PAL-01 helpers applied in `EnsoTaskCatalogService` + Agents Library UI.

## Automated

### Scenario 1: Adapter → catalog compose → sidebar
- **Description**: Host adapter items plus filtered static / default agents
- **Setup**: `npm test`
- **Test Steps**: `enso-task-catalog.service.spec.ts` + `left-sidebar.palette.spec.ts`
- **Expected Results**: adapter present ⇒ no Enso HTTP; empty remote ⇒ empty-state only; error ⇒ static + banner, no mock agent keys
- **Cleanup**: none

### Scenario 2: Palette JSON overlay → catalog reload
- **Description**: `features().palette` change retriggers `loadCatalog`
- **Setup**: `npm test`
- **Test Steps**: left-sidebar spec “reloads catalog when palette features change”
- **Expected Results**: `loadCatalog` called again after `applyLayers` palette overlay
- **Cleanup**: none

## Manual smoke

1. `npm start` (or use `http://localhost:4200/`)
2. With `src/assets/wb-ui-config.json` as `{}`, Agents Library still shows Condition / Router / Repeater + Blank Agent (Enso empty → empty-state; Enso/auth error → static + banner, **no mock agents**)
3. Palette overlay:
   ```bash
   cp src/assets/examples/wb-ui-config.palette-host.json src/assets/wb-ui-config.json
   ```
   Click back into the browser (JSON reloads on window focus). Expect Claims Agent + Policy Agent instead of Blank Agent; featured types per the example allow-list.
4. Restore:
   ```bash
   echo '{}' > src/assets/wb-ui-config.json
   ```

Catalog adapters cannot be tried via JSON. Wire `provideWorkflowBuilderUi({ catalog })` in `app.config.ts` if you need a host list. Do not put access tokens in JSON or docs.

## Integration with U-PAL-01
- Same `features().palette` merge (omit vs `[]` vs present)
- U-PAL-02 is the first unit that **applies** those helpers to catalog emit + sidebar
