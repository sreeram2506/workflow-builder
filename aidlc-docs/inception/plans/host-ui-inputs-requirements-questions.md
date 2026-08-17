# Requirements Questions — Host UI chrome inputs (`[ui]`)

**Status**: ANSWERS LOCKED — requirements generated; awaiting approval  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=C · Q8=C · Q9=C · Q10=B

Artifact: `aidlc-docs/inception/requirements/host-ui-inputs-requirements.md`

---

## Question 1 — Merge precedence when `[ui]` is bound

A) **Recommended** — Defaults → JSON → provider → **component `[ui]` wins** (mirrors how present `[palettes]` wins over catalog provider)

B) Provider always wins over `[ui]` (instance is weaker)

C) `[ui]` replaces the entire resolved map (no merge with lower layers)

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 2 — Omit vs empty object semantics

A) **Recommended** — Omit `[ui]` → no instance overlay (DI/JSON only). `[ui]="partial"` deep-merges. No special meaning for `{}` beyond “no leaf overrides”

B) `[ui]="null"` / omit = no overlay; `[ui]="{}"` forces all defaults ignoring JSON/provider

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 3 — Which shells get `[ui]`

A) **Both** `wb-shell-layout` and `wb-agent-skills-shell`

B) Solution shell only

C) Separate inputs later; v1 solution only

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 4 — Scope of flags controllable via `[ui]`

A) **Full v1 chrome map** (same as `UiFeatures`: topBar.*, agentTabs, agentsLibrary, skillsLibrary, propertiesPanel, canvas.*, themeToggle alias)

B) Region-level only (`*.enabled`) — no per-action leaves in `[ui]`

C) Match the example only (topBar subset + agentsLibrary + propertiesPanel + canvas minimap/zoom) — expand later

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 5 — Live updates when parent changes `[ui]`

A) **Reactive** — changing the bound object/signal updates chrome without reload (effect / input binding)

B) Bootstrap-only — first value wins until remount

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 6 — Relationship to existing `provideWorkflowBuilderUi({ features })`

A) **Keep both** — provider for app-wide defaults; `[ui]` for per-instance / host-page overrides

B) Deprecate provider features in favor of `[ui]` only (JSON still loads)

C) Provider features ignored when any shell with `[ui]` is used

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 7 — Docs / embed guide

A) Extend `docs/workflow-builder-ui-embed.md` with `[ui]` section (like palettes)

B) New dedicated doc only

C) Both A + short README pointer update

X) Other (describe after [Answer]:)

[Answer]: C

---

## Question 8 — Security Extensions

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

C) Yes — **new-code scoped** only (same posture as prior SPA increments)

X) Other (please describe after [Answer]:)

[Answer]: C

---

## Question 9 — Resiliency Extensions

A) Yes — apply as directional best practices (recommended starting point)

B) No — skip resiliency baseline

C) Yes — directional; most cloud DR/CAB N/A for client SPA input wiring

X) Other (please describe after [Answer]:)

[Answer]: C

---

## Question 10 — Property-Based Testing Extension

A) Yes — enforce all PBT rules as blocking constraints

B) Partial — PBT on merge of instance `[ui]` partial over resolved features (omit/partial leaf invariants)

C) No — skip all PBT rules

X) Other (please describe after [Answer]:)

[Answer]: B
