# Requirements — Remove APIs and dummy data

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | now remove the apis, and dummy data |
| **Request type** | Cleanup (brownfield) |
| **Scope** | Catalog HTTP, env/proxy, mock skills, repeater mocks, library empty-when-omit, nested skills from palettes |
| **Complexity** | Moderate |
| **Requirements depth** | Standard |
| **Increment name** | Remove APIs and dummy data |
| **Answers** | Q1=A · Q2=A · Q3=B · Q4=B · Q5=A · Q6=A · Q7=B |

See `remove-apis-dummy-data-intent-analysis.md`.

---

## 1. Goals

1. Stop calling Enso catalog HTTP from this SPA (no `task/list` / `pipeline/list`, no `/enso-api` proxy, no environment URLs or stored credentials).
2. Remove dummy nested-skills and Repeater Properties catalogs.
3. When the host does not bind `[palettes]`, the Agents / Skills library is empty (`palette-empty-remote`), not static `PALETTE_ITEMS` and not Enso.
4. Nested Skills Library uses the same `[palettes]` overlay as the agent skills shell.

---

## 2. Locked decisions

| Topic | Choice |
|---|---|
| Enso catalog HTTP | Remove (URLs, proxy, credentials) |
| Dummy catalogs | Remove `MOCK_SKILLS` and `REPEATER_MOCK_WORKFLOWS` |
| SAMPLE_WORKFLOW | Keep (tests only; boot canvas stays empty Untitled) |
| Omit `[palettes]` | Empty library (`palette-empty-remote`) |
| `[palettes]="[]"` | Unchanged empty-remote |
| `[palettes]` with items | Unchanged U-HPI / U-LIM overlay (featured replace, icons, metadata) |
| Nested skills | Same `[palettes]` as `wb-agent-skills-shell` |
| Catalog provider adapter | Keep as optional non-HTTP load when `[palettes]` is omitted (U-PAL-02). Enso HTTP is gone. |
| Extensions | Security Yes; Resiliency Yes (DR N/A); PBT Partial |

---

## 3. Functional requirements

### FR-RAD-01 — Remove Enso catalog HTTP

The SPA SHALL NOT call Enso `task/list` or `pipeline/list`. Remove `/enso-api` from `proxy.conf.json`. Remove catalog URLs, solution/user/agent/workflow IDs, user-category lists, and stored credentials from `environment.ts` / `environment.prod.ts`.

`EnsoTaskCatalogService` SHALL NOT use `HttpClient` for those endpoints. Host `[palettes]` overlay and optional catalog adapter remain.

### FR-RAD-02 — Omit palettes is empty-remote

When `[palettes]` is **omitted** and no catalog adapter is configured: `emptyRemote: true`, no static `PALETTE_ITEMS` compose, no Enso. Library shows `palette-empty-remote` (featured and default agents hidden), same as `[palettes]="[]"`.

When a catalog adapter is configured and palettes omitted: keep U-PAL-02 adapter load (not Enso).

### FR-RAD-03 — Remove mock nested skills

Delete `MOCK_SKILLS` / `mock-skills.catalog.ts` usage from the nested Skills Library.

### FR-RAD-04 — Nested skills from palettes

`wb-nested-skills-library` SHALL list the same sanitized palette overlay as `wb-agent-skills-shell [palettes]` (search/filter may remain). Omit / `[]` → empty nested list. Do not invent a second mock catalog.

### FR-RAD-05 — Remove Repeater mock workflows

Delete `REPEATER_MOCK_WORKFLOWS`. Repeater Properties workflow/version pickers SHALL have no dummy Claims/Policy/Notify options. Empty options until a real source exists (out of scope to invent a new API).

### FR-RAD-06 — Docs

Update embed / README so they do not describe live Enso catalog, proxy, or Bearer token for this SPA. Document empty-when-omit and nested skills from `[palettes]`. No secrets in examples.

---

## 4. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-RAD-01 Security | No catalog credentials or Bearer tokens in source. Removing Enso auth from `environment.ts` is required. |
| NFR-RAD-02 Resiliency | No HTTP catalog failure path for Enso. Empty-remote is the no-data path. |
| NFR-RAD-03 PBT Partial | Invariants on compose: omit-without-adapter never emits Enso/static featured rows; sanitizers unchanged (U-LIM). |

---

## 5. Out of scope

- New backend to replace Enso
- Removing `provideWorkflowBuilderUi({ catalog })` adapters
- Removing `SAMPLE_WORKFLOW` test fixture
- Removing static `PALETTE_ITEMS` type definitions (they are unused on omit; still used when host palettes compose extras / defaults)
- Canvas/Properties host icons (already in U-LIM)

---

## 6. Success criteria

- Default SPA (`npm start`, no `[palettes]`): empty Agents Library, no Enso network calls
- Nested skills: empty without palettes; host palettes appear when bound on the agent shell
- Repeater Properties: no mock workflow names
- `npm test` / `npm run build` green
