# Integration Test Instructions — U-UI-01

**Scope**: Config core only (no chrome gates yet).

## Automated
- Initializer + HttpTestingController cases in `ui-config.service.spec.ts` cover JSON → service → provider precedence.

## Manual smoke
1. `npm start`
2. Open DevTools console → expect `[UiConfig] loadStatus=ok` and full features (defaults) when `wb-ui-config.json` is `{}`
3. Copy an example over the active file, refresh:
   ```bash
   cp src/assets/examples/wb-ui-config.minimal-canvas.json src/assets/wb-ui-config.json
   ```
4. Confirm console shows merged flags (e.g. `agentsLibrary.enabled: false`)
5. Restore defaults:
   ```bash
   echo '{}' > src/assets/wb-ui-config.json
   ```

**Chrome visibility does not change until U-UI-02.**
