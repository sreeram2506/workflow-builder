# Business Rules — U-RAD-01 Remove APIs and dummy data

---

## BR-RAD-01 — No Enso catalog HTTP (FR-RAD-01, US-RAD-01)

The SPA SHALL NOT POST to Enso `task/list` or `pipeline/list`. `EnsoTaskCatalogService` SHALL NOT inject `HttpClient`. Delete `loadEnsoPipelines`, `loadEnsoTasks`, and catalog token/user-id helpers used only for those calls. Delete `enso-pipeline.mapper` and `enso-task.mapper` if unused afterward.

Strip from `environment.ts` / `environment.prod.ts`: catalog URLs, solution/user/agent/workflow IDs, user-category lists, stored credentials. Keep non-catalog keys (routing grid, run delay).

Remove `/enso-api` from `proxy.conf.json`. Drop Angular serve `proxyConfig` if that file has no remaining routes.

`UiConfigService` MAY still use `HttpClient` for UI JSON (App Design Q5=A).

## BR-RAD-02 — Omit-without-adapter is empty-remote (FR-RAD-02, Q1=A)

When `hostPalettes` is omitted and no catalog adapter is injected:

| Field | Value |
|---|---|
| `emptyRemote` | `true` |
| `items` | `[]` |
| `categories` | `[]` |
| `error` | `null` |
| `source` | `'empty'` |

Same as `[palettes]="[]"`. Do not compose static featured `PALETTE_ITEMS`.

When an adapter is injected and palettes omitted: U-PAL-02. Adapter **failure**: existing `errorLoad` static fallback + banner (App Design Q2=A). Do not reuse `errorLoad` for omit-without-adapter.

When `hostPalettes` is defined and sanitized length &gt; 0: U-HPI overlay + U-LIM omit-static-featured. No HTTP.

## BR-RAD-03 — Featured strip on omit (US-RAD-01, Q2=A)

Empty-remote hides featured Condition / Router / Repeater and default agents (existing empty-remote UI). This **supersedes** US-LIM-01 AC that omit shows the built-in three.

Present non-empty `[palettes]`: U-LIM replace unchanged.

## BR-RAD-04 — Nested palettes (FR-RAD-03, FR-RAD-04, Q3=A, Q7=A)

- Delete `MOCK_SKILLS` / `mock-skills.catalog.ts`.
- `wb-nested-skills-library` `[palettes]`: sanitize with `sanitizeHostPaletteItems`.
- Filter: case-insensitive substring on `label`, `description`, `key`.
- Add: `addSkillFromPaletteItem(agentNodeId, { key, label, description, taskId })`.
- Omit / `[]` / no matches: empty `<ul>` (no new empty-state copy).
- Do not mount the component in `wb-agent-skills-shell`. Visible nested Skills Library remains the agent-shell left sidebar.

## BR-RAD-05 — Facade (Q5=A)

`addSkillToAgent` MUST NOT call `findMockSkill`. It returns `false`. Nested Add uses `addSkillFromPaletteItem` only.

## BR-RAD-06 — Repeater mocks (FR-RAD-05, Q4=A)

Delete `repeater-mock.catalog.ts`. Workflow select `options` = `[]`. Version select stays `[]`. Do not clear existing `repeater.workflowId` / `versionId` on the node.

## BR-RAD-07 — Docs (FR-RAD-06, NFR-RAD-01)

Embed and README: no live Enso catalog, `/enso-api`, or Bearer token. Document empty-when-omit and nested skills from `[palettes]`. No secrets in examples.

## BR-RAD-08 — PBT (Q6=A, NFR-RAD-03)

See Testable Properties in `business-logic-model.md` (P-RAD-01..03).
