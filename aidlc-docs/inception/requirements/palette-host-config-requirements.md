# Requirements — Palette / catalog host config

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | Parent apps must control which built-in nodes appear (Condition, Router, Repeater, Blank Agent) on solution vs skills canvases; rename or supply multiple default agents; plug extra APIs for agent/skill lists |
| **Request type** | New Feature / Enhancement (brownfield) |
| **Scope** | Multiple components (ui-config, palette catalog, left sidebar, Enso catalog service, embed docs) |
| **Complexity** | Moderate–Complex |
| **Requirements depth** | Standard |
| **Increment name** | Palette / catalog host config (v1) |

---

## Locked decisions

| ID | Decision |
|---|---|
| Q1 | **A** — JSON (`wb-ui-config.json`) + `provideWorkflowBuilderUi` overlay; provider wins (same merge as chrome) |
| Q2 | **A** — Independent config per canvas (solution Agents Library vs nested Skills Library) |
| Q3 | **C** — Optional **allow-list** of type keys; omitted group ⇒ show all current types; present list ⇒ only those types |
| Q4 | **B** — Host `defaultAgents` (1..N cards). If the key is **present**, it **replaces** built-in Blank Agent |
| Q5 | **A** — Host injects a **catalog adapter**; Enso remains the default until replaced |
| Q6 | **B** — On list failure/empty: host static defaults only (**no mock agents**); non-blocking banner |
| E1 | Security **ON** — new-code scoped (no secrets in JSON; adapters must not log tokens) |
| E2 | Resiliency **ON** — directional; DR / multi-region / change-CAB **N/A** (client SPA catalog) |
| E3 | PBT **partial** — allow-list filter + merge/defaulting helpers |

---

## 1. Goals

1. Let a **host repo** decide which built-in palette types appear on each canvas without forking the SPA.
2. Let a host **replace Blank Agent** with one or more named default agent cards.
3. Let a host **replace** the Enso list calls with its own catalog adapter (which may call extra APIs internally).
4. Keep **backward-compatible defaults**: omitted allow-list and omitted `defaultAgents` ⇒ today’s types and single Blank Agent.

---

## 2. Functional requirements

### FR-PAL-01 — Config layers

Resolution order SHALL be:

1. Built-in defaults (all current types visible; one Blank Agent; Enso adapter)
2. JSON `wb-ui-config.json` (serializable fields only)
3. Host `provideWorkflowBuilderUi(...)` — **wins**

Partial deep-merge. Adapter functions exist **only** on the provider (not JSON).

### FR-PAL-02 — Per-canvas allow-list

The system SHALL support independent optional allow-lists:

- `palette.solution.types` — Agents Library (solution canvas)
- `palette.agent.types` — Skills Library (nested agent canvas)

**Type keys** are stable catalog types, including `Condition`, `Decision` (Router), `Repeater`, `AIAgent` (Blank Agent / default agents), and other static types (`Trigger`, `Action`, `Delay`, `End`, `Notification`) so a host can restrict skills as well.

Rules:

- Key **omitted** ⇒ show all types that canvas shows today.
- Key **present** as an array ⇒ show only those types (built-in **and** adapter rows filtered to the list).
- Empty array `[]` ⇒ no types from this filter (library may still mount if chrome `agentsLibrary`/`skillsLibrary` is on).

Chrome flags from UI Configurability still hide the **whole** library; this increment does not replace them.

### FR-PAL-03 — Default agents (solution)

`palette.solution.defaultAgents` is an optional array of `{ key, label, description }` (and optional subtitle).

| JSON/provider | Behavior |
|---|---|
| Key omitted | Built-in Blank Agent, if `AIAgent` is allowed |
| `[]` | No static default agent cards |
| Non-empty | Those cards **replace** Blank Agent |

Default-agent cards are `AIAgent` rows. If the solution allow-list is present and does **not** include `AIAgent`, default agents SHALL NOT render.

Skills canvas has **no** `defaultAgents` in v1 (allow-list + adapter only).

### FR-PAL-04 — Catalog adapter

The host MAY provide:

- `catalog.solution` — loads extra/replacement **agent** rows for the solution library
- `catalog.agent` — loads extra/replacement **skill** rows for the nested library

If omitted, the current Enso adapter SHALL be used (pipeline/list for solution, task/list for skills).

A host adapter **replaces** the Enso adapter for that canvas (it may call Enso plus other APIs inside the host). Workflow Builder SHALL invoke at most one adapter per canvas.

Adapter output SHALL be palette rows (`key`, `type`, `label`, `description`, `categoryId`, optional `taskId`/`taskMeta`). Rows are then filtered by FR-PAL-02.

### FR-PAL-05 — Failure / empty list (Q6=B)

If the adapter/Enso call fails or returns no rows:

- Solution: show **only** FR-PAL-03 static defaults (no `MOCK_SOLUTION_AGENTS`).
- Skills: show **only** static catalog types that pass the allow-list (no mock skill packs).
- Show a **non-blocking** banner/status (existing catalog error string or config banner pattern).
- Do not block the canvas.

### FR-PAL-06 — Featured logic strip

Condition / Router / Repeater remain the featured strip **when allowed** by that canvas’s allow-list. Hidden types SHALL not appear in the strip or category lists.

### FR-PAL-07 — Docs

Embed/try docs SHALL describe allow-lists, `defaultAgents`, and the TypeScript adapter hook. Example JSON SHALL include allow-list + `defaultAgents` samples. Adapters are documented as provider-only.

---

## 3. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-PAL-01 | Omitted config MUST preserve today’s visible types (fail-open / show-all). |
| NFR-PAL-02 | JSON MUST NOT contain access tokens, cookies, or Authorization values (SECURITY — new JSON). |
| NFR-PAL-03 | Catalog HTTP/adapters MUST NOT log tokens or PII. |
| NFR-PAL-04 | Allow-list filter is a pure function: every output item’s `type` is in the allow-list when the list is present (PBT invariant). |
| NFR-PAL-05 | Merge of omitted vs present `defaultAgents` is deterministic (PBT / unit tests). |
| NFR-PAL-06 | Adapter failure MUST NOT crash the shell; banner + static defaults only. |

Out of scope for v1: publishable ng library; skills-side default agent cards; multiple parallel adapters per canvas (compose inside the host adapter).

---

## 4. Composition notes

- Router in the UI is node type `Decision`.
- UI Configurability chrome flags remain the library master switch.
- Existing Enso `environment.ts` URLs stay the **default adapter** implementation until a host replaces it.

---

## 5. Personas (for User Stories)

- **Host integrator** — another repo embedding Workflow Builder.
- **Workflow editor** — sees the filtered palette / default agents.
