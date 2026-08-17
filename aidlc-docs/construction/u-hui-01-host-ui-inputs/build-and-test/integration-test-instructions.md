# Integration Test Instructions — U-HUI-01

**Scope**: Instance `[ui]` overlay with existing U-UI chrome + optional JSON/provider layers.

## Automated
- `host-ui-inputs.spec.ts` — shell fixtures with `setInput('ui', …)`; isolation across two shells; agent shell `skillsLibrary`
- `ui-chrome-gates.spec.ts` — ensure omit path still matches U-UI-02 behavior

## Manual smoke

### A) Temporary host wrapper (instance `[ui]`)
1. Point the default route at a small host that binds `[ui]` (see embed guide / prior try notes).
2. `npm start`
3. Confirm Agents Library / Properties / Save hide when those leaves are `false`.
4. Change the bound object → chrome updates without full reload.
5. Restore original `ShellLayoutComponent` route when done.

### B) `[ui]` wins over JSON
1. Apply a global hide via JSON:
   ```bash
   cp src/assets/examples/wb-ui-config.minimal-canvas.json src/assets/wb-ui-config.json
   ```
2. Host with `[ui]="{ agentsLibrary: { enabled: true } }"` — library should show.
3. Confirm global `UiConfigService.features().agentsLibrary.enabled` can remain `false` (DevTools / breakpoint).
4. Restore:
   ```bash
   echo '{}' > src/assets/wb-ui-config.json
   ```

### C) Nested shell independence
1. Open `/agent/:nodeId` via an agent tab.
2. Bind `[ui]` only on `wb-agent-skills-shell` (or temporary wrapper) to hide `skillsLibrary`.
3. Solution shell library should be unaffected when you return to `/`.
