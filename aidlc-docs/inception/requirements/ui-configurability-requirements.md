# Requirements — UI Configurability

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | Make Workflow Builder chrome fully configurable (top bar, Agents/Skills libraries, properties, canvas, tabs, overlays) for reuse in other apps |
| **Request type** | New Feature / Enhancement (brownfield) |
| **Scope** | Multiple components (shell, canvas overlays, config layer, demo JSON, embed docs) |
| **Complexity** | Moderate–Complex (granular flags + merge precedence + phased packaging) |
| **Requirements depth** | Standard |
| **Increment name** | UI Configurability (v1) |

---

## Locked decisions

| ID | Decision |
|---|---|
| Q1 | **C** — Host Angular provider overrides JSON/env defaults |
| Q2 | **C** — Fully granular toggles (regions + actions + library modes) |
| Q3+F1 | **A,B,C,D,E,F,G,H** — v1 includes Top bar, Agents Library, **Skills Library**, Properties, Canvas, Agent tabs, overlays, Theme |
| Q4 | **D** — Typed `provideWorkflowBuilderUi(...)` wrapping a boolean feature map |
| Q5 | **A** — Missing flag defaults to **show** (current full chrome) |
| Q6 | **C** — Nested `/agent/:nodeId` always opens canvas; left Skills Library / properties follow flags |
| Q7+F2 | **A (phased)** — v1 = SPA config + wiring + embed API docs; **v2 later** = publishable ng library |
| E1+F3 | Security ON for **new code this increment** (no secrets in demo JSON; full SECURITY sweep deferred to packaging) |
| E2 | Resiliency ON (directional; DR/topology mostly N/A for client SPA config) |
| E3 | PBT **partial** — config merge / defaulting helpers |

---

## 1. Goals

1. Let a **host app** (or deploy-time JSON) decide which UI chrome is visible without forking the SPA.
2. Keep **backward-compatible defaults**: unspecified flags → everything visible (today’s UX).
3. Document an **embed/provider API** so other Angular apps can inject config in v1; extract a publishable package in a later increment.

---

## 2. Functional requirements

### FR-UI-01 — Feature map

The system SHALL expose a typed UI feature configuration as a nested (or dotted) **boolean map**, e.g.:

- `topBar.enabled`, `topBar.logo`, `topBar.title`, `topBar.status`, `topBar.back`, `topBar.save`, `topBar.export`, `topBar.import`, `topBar.run`, `topBar.reset`, `topBar.theme`, `topBar.editView`, `topBar.agentTabs`
- `agentsLibrary.enabled` (+ optional subflags if needed for search/featured strip)
- `skillsLibrary.enabled`
- `propertiesPanel.enabled`
- `canvas.enabled`
- `canvas.zoomControls`, `canvas.minimap`, `canvas.floatingActions` (if present)
- `themeToggle` (may alias `topBar.theme`)

Exact key tree is finalized in Functional Design; keys above are the v1 inventory.

### FR-UI-02 — Merge precedence

Resolution order SHALL be:

1. Built-in defaults (all `true` / show)
2. Optional JSON/env file (e.g. `assets/wb-ui-config.json` or environment object)
3. Host `provideWorkflowBuilderUi({ features: {...} })` — **wins**

Partial objects deep-merge; omitted keys retain lower-layer values.

### FR-UI-03 — Top bar

When `topBar.enabled` is false, the top bar SHALL not render (agent tabs may still render if `topBar.agentTabs` or a dedicated tabs flag is true — FD locks placement).  
Individual action flags SHALL hide the corresponding controls without removing underlying facade APIs (keyboard shortcuts may still call Save if flag true only for UI — FD locks shortcut policy; default: shortcuts respect same flags).

### FR-UI-04 — Agents Library

When `agentsLibrary.enabled` is false on the solution route, the left Agents Library SHALL not render. Canvas and other enabled chrome remain.

### FR-UI-05 — Skills Library

When `skillsLibrary.enabled` is false on the nested agent route, the left Skills Library SHALL not render. Nested canvas still opens (FR-UI-07).

### FR-UI-06 — Properties panel

When `propertiesPanel.enabled` is false, the right Properties sidebar SHALL not render (selection may still update store).

### FR-UI-07 — Canvas & nested agent

- When `canvas.enabled` is false, the canvas host SHALL not render (host is responsible for a usable layout — empty shell allowed).
- Nested agent navigation remains available; with Skills Library off, nested view is canvas (± properties per flags).

### FR-UI-08 — Agent tabs & overlays

- Agent tab strip visibility follows its flag.
- Zoom / minimap / floating actions follow canvas overlay flags.

### FR-UI-09 — Demo / SPA wiring

This SPA SHALL load optional JSON (or env) and apply `provideWorkflowBuilderUi` so developers can prove toggles without a host app. Example configs documented (e.g. “minimal canvas”, “no libraries”).

### FR-UI-10 — Embed API docs (v1)

Document how another Angular app provides the token/provider and which flags exist. **No** ng-packagr publish in v1 (v2).

### Out of scope (v1)

- Publishable npm library / ng-packagr
- End-user in-app settings UI to edit flags live
- Backend feature-flag service
- Changing Enso API payloads (separate from chrome flags)

---

## 3. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-UI-01 | Config merge is pure, unit-tested; PBT on merge/defaulting (partial) |
| NFR-UI-02 | No secrets/tokens in committed demo JSON (Security — new code) |
| NFR-UI-03 | Invalid JSON fails soft: log/status + fall back to defaults (show all) |
| NFR-UI-04 | Flag checks are synchronous reads from injected config (no per-frame HTTP) |
| NFR-UI-05 | Existing tests remain green; add coverage for merge + key visibility paths |

---

## 4. Extension compliance (this stage)

| Extension | Status | Notes |
|---|---|---|
| Security Baseline | Enabled — **scoped** | New config/demo code: no secrets in assets; full SECURITY-* infra N/A for SPA-only |
| Resiliency Baseline | Enabled | Directional; most cloud DR rules N/A; soft-fail JSON load is resiliency-relevant |
| Property-Based Testing | Partial | Config merge / default apply |

---

## 5. Success criteria

1. Flipping flags via JSON and/or provider hides/shows listed chrome without code forks.
2. Defaults preserve full current UI when config is empty.
3. Nested agent works with Skills Library disabled (canvas-only).
4. Embed provider API documented for Angular hosts.
5. Unit + PBT (merge) pass.

---

## 6. Traceability (answers → FR)

| Answer | FR |
|---|---|
| Q1 C, Q4 D | FR-UI-01, FR-UI-02, FR-UI-10 |
| Q2 C, Q3+F1 | FR-UI-03…08 |
| Q5 A | FR-UI-02 defaults |
| Q6 C | FR-UI-05, FR-UI-07 |
| F2 A | FR-UI-09, FR-UI-10; packaging → future v2 |
