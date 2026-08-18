# Frontend Components Summary — U-RAD-01 Remove APIs and dummy data

**Stories**: US-RAD-02, US-RAD-03, US-RAD-04

## Modified

| Path | Change |
|---|---|
| `src/app/features/agent/nested-skills-library.component.ts` | `[palettes]` input; sanitize + search; Add via `addSkillFromPaletteItem`; empty `<ul>` |
| `src/app/features/shell/right-sidebar.component.ts` | Empty Repeater workflow/version option lists; keep existing node values |
| `angular.json` | Remove serve `proxyConfig` |
| `docs/workflow-builder-ui-embed.md` | Empty-when-omit; no Enso HTTP/proxy/Bearer; nested palettes |
| `README.md` | No Enso token/proxy; empty-when-omit |

## Created

| Path | Role |
|---|---|
| `src/app/features/agent/nested-skills-library.component.spec.ts` | Omit/`[]`/list/search/Add |

## Behavior

- Default SPA Agents Library is empty-remote (no Enso network)
- Nested Developed-skills is not mounted in the agent shell
- Repeater Properties has no Claims/Policy/Notify dummy options
