# Requirements — Host UI chrome inputs (`[ui]`)

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | Syncfusion-style `[ui]` on shells to control chrome visibility |
| **Request type** | Enhancement (brownfield) |
| **Scope** | Shells + UiConfigService instance overlay + docs |
| **Complexity** | Moderate |
| **Requirements depth** | Standard |
| **Increment name** | Host UI chrome inputs |

---

## Locked decisions

| ID | Decision |
|---|---|
| Q1 | **A** — Precedence: defaults → JSON → provider → **`[ui]` wins** |
| Q2 | **A** — Omit = no overlay; partial deep-merges; `{}` = no leaf overrides |
| Q3 | **A** — Both `wb-shell-layout` and `wb-agent-skills-shell` |
| Q4 | **A** — Full `UiFeatures` / `UiFeaturesPartial` map (incl. themeToggle alias) |
| Q5 | **A** — Reactive: parent changes update chrome without reload |
| Q6 | **A** — Keep provider + `[ui]` (app-wide vs per-instance) |
| Q7 | **C** — Embed guide section + README pointer |
| E1/Q8 | Security **new-code scoped** |
| E2/Q9 | Resiliency directional; DR/CAB mostly N/A |
| E3/Q10 | PBT **partial** — instance merge over resolved features |

---

## 1. Goals

1. Let a **parent Angular host** pass chrome flags via `[ui]` on shell tags (same ergonomics as `[palettes]` / `[defaultAgents]`).
2. Preserve existing DI/JSON path for SPA-wide defaults.
3. Document the API in the embed guide.

---

## 2. Functional requirements

### FR-HUI-01 — Component input

`wb-shell-layout` and `wb-agent-skills-shell` SHALL expose:

```typescript
ui = input<UiFeaturesPartial | undefined>();
```

Omit (unbound) ⇒ no instance overlay. Bound partial deep-merges onto the service-resolved map.

### FR-HUI-02 — Precedence

Effective features for a shell instance SHALL be:

1. Built-in defaults (all show)  
2. Optional JSON  
3. `provideWorkflowBuilderUi({ features })`  
4. **`[ui]` partial** — wins per leaf  

### FR-HUI-03 — Flag scope

`[ui]` SHALL accept the same partial shape as provider/JSON overlays (`UiFeaturesPartial`), including `themeToggle` alias behavior already defined in U-UI-01.

### FR-HUI-04 — Reactive updates

When the bound `[ui]` value changes, chrome visibility SHALL update without full page reload (input + computed/effect reading the overlay).

### FR-HUI-05 — Isolation

Instance `[ui]` on one shell SHALL NOT rewrite global `UiConfigService` state used by other instances (overlay is per-shell effective view, or equivalent scoped merge). Provider/JSON remain global bootstrap layers.

### FR-HUI-06 — Existing chrome gates

All U-UI-02 gates (`is(...)` / region mounts) SHALL use the **effective** features for that shell (global resolved ⊕ `[ui]` overlay), not bootstrap-only.

### FR-HUI-07 — Docs

Extend `docs/workflow-builder-ui-embed.md` with `[ui]` examples and precedence; update README pointer.

### Out of scope (v1)

- Deprecating `provideWorkflowBuilderUi({ features })`
- End-user settings UI to edit flags
- Changing palette `[palettes]` / `[defaultAgents]` semantics

---

## 3. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-HUI-01 | Pure merge helper for instance overlay; partial PBT (omit / partial leaves / provider then ui) |
| NFR-HUI-02 | No secrets in docs/examples |
| NFR-HUI-03 | Existing suites green; add coverage for omit vs partial vs reactive override |
| NFR-HUI-04 | Effective reads stay synchronous after overlay apply |

---

## 4. Extension compliance

| Extension | Status | Notes |
|---|---|---|
| Security Baseline | Enabled — new-code scoped | Docs/examples: no secrets |
| Resiliency Baseline | Enabled — directional | SPA input merge; cloud DR N/A |
| Property-Based Testing | Partial | Instance overlay merge |

---

## 5. Success criteria

1. Parent can bind `[ui]="{ propertiesPanel: { enabled: false }, ... }"` and see chrome hide without touching JSON.
2. Omit `[ui]` preserves current DI/JSON behavior.
3. Changing `[ui]` at runtime updates chrome.
4. Embed + README document the API.
5. Unit + partial PBT pass.

---

## 6. Traceability

| Answer | FR |
|---|---|
| Q1 A, Q6 A | FR-HUI-02, FR-HUI-05 |
| Q2 A | FR-HUI-01 |
| Q3 A, Q4 A | FR-HUI-01, FR-HUI-03 |
| Q5 A | FR-HUI-04, FR-HUI-06 |
| Q7 C | FR-HUI-07 |
| Q10 B | NFR-HUI-01 |
