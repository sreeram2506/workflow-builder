# U-UI-01 Code Change Requests (round 1)

**Unit**: `u-ui-01-config-core`  
**Status**: RESOLVED — awaiting Code Generation re-approval  
**Context**: User wanted example configs to try every flag

---

## Answers (locked)

| Q | Answer |
|---|---|
| Q1 | **X** — example config to try the feature with all keys |
| Q2 | refer Q1 |
| Q3 | **X** (treated as small try-it enhancement; no FD change) |

## Fixes applied

1. Added example JSON covering all keys:
   - `src/assets/examples/wb-ui-config.all-on.json`
   - `src/assets/examples/wb-ui-config.all-off.json`
   - `src/assets/examples/wb-ui-config.minimal-canvas.json`
2. Added try guide: `docs/workflow-builder-ui-config-try.md` (copy/cp instructions + provider snippet)
3. Dev-mode console dump of `loadStatus` + resolved `features` after initializer
4. Commented `provideWorkflowBuilderUi` example in `app.config.ts`
5. Spec covering all-off example normalize/resolve

**Note**: Chrome hide/show still lands in **U-UI-02**. U-UI-01 verify via console `[UiConfig]` log after copying an example over `src/assets/wb-ui-config.json`.

## Verification

- `npm test` — re-run after changes
