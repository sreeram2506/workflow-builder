# Integration Test Instructions — U-PAL-01

**Scope**: Config + helpers only (no catalog adapter or sidebar wiring).

## Automated
- `ui-config.service.spec.ts` JSON → `normalizePartial` → provider `palette` overlay
- Helpers compose `PALETTE_ITEMS` with allow-list + defaultAgents (US-PAL-02..04 logic without UI)

## Manual smoke
1. `npm start` (or use the running `http://localhost:4200/` session)
2. Confirm chrome is unchanged with `src/assets/wb-ui-config.json` as `{}` (show-all types still in Agents Library)
3. Optional: merge a palette snippet into the JSON, refresh, check console `[UiConfig]` for `palette.solution.types` — **library cards do not filter until U-PAL-02**
4. Restore `{}` if you changed the file

## Integration with U-UI-01
- Same initializer, merge order, and `provideWorkflowBuilderUi({ features })`
- `is()` paths unchanged; read palette via `features().palette`
