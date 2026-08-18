# Intent Analysis — Remove APIs and dummy data

| Field | Value |
|---|---|
| **User request** | now remove the apis, and dummy data |
| **Request type** | Cleanup / enhancement (brownfield) |
| **Scope** | Catalog HTTP, env/proxy, mock skills, repeater mocks, empty-when-omit, nested palettes |
| **Complexity** | Moderate |
| **Requirements depth** | Standard |
| **Clarity after Q1–Q7** | Clear — no contradictions |
| **Answers** | Q1=A · Q2=A · Q3=B · Q4=B · Q5=A · Q6=A · Q7=B |

## Locked decisions

| ID | Decision |
|---|---|
| Q1 | Remove Enso catalog HTTP, `/enso-api` proxy, environment URLs and credentials |
| Q2 | Remove `MOCK_SKILLS` and `REPEATER_MOCK_WORKFLOWS`; keep `SAMPLE_WORKFLOW` for tests |
| Q3 | Omit `[palettes]` → empty library (`palette-empty-remote`), not static types or Enso |
| Q4 | Nested Skills Library uses the same `[palettes]` overlay as the agent skills shell |
| Q5 | Security Baseline **Yes** |
| Q6 | Resiliency Baseline **Yes** (directional; DR N/A) |
| Q7 | PBT **Partial** |

## Known surfaces (at analysis time)

| Surface | What it is today |
|---|---|
| Enso catalog HTTP | `EnsoTaskCatalogService` posts to pipeline/task list URLs; `proxy.conf.json`; environment URLs + credentials |
| Host overlay | `[palettes]` / `[defaultAgents]` skip Enso when bound (U-HPI / U-LIM) |
| Mock nested skills | `MOCK_SKILLS` in nested Skills Library |
| Repeater mocks | `REPEATER_MOCK_WORKFLOWS` in Properties |
| Static palette | Built-in types (not HTTP); unused on omit after this increment |
| SAMPLE_WORKFLOW | Test fixture only; boot canvas is empty Untitled |
