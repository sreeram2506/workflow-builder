# Application Design Plan — UI Configurability (v1)

**Role**: Application Architect  
**Status**: ARTIFACTS GENERATED — AWAITING APPROVAL  
**Requirements**: `ui-configurability-requirements.md`  
**Stories**: `ui-configurability-stories.md`  
**Execution plan**: Approved Q1=A (2 units; App Design + Units; skip NFR/Infra)

**Locked answers**: Q1=A · Q2=C · Q3=A · Q4=C · Q5=A

Additive artifacts under `aidlc-docs/inception/application-design/` with `ui-configurability-` prefix.

---

## Execution checklist

- [x] Generate `ui-configurability-components.md`
- [x] Generate `ui-configurability-component-methods.md`
- [x] Generate `ui-configurability-services.md`
- [x] Generate `ui-configurability-component-dependency.md`
- [x] Generate `ui-configurability-application-design.md` (summary)
- [x] Validate design completeness

---

## Question 1 — Where does the resolved config live?

A) **Injectable `UiConfigService`** (signal of resolved features) — components call `uiConfig.is('topBar.save')`

B) **Facade only** — `WorkflowFacade.uiFeatures()` computed; no separate service

C) **Both** — service owns merge/load; facade re-exports for templates that already use facade

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 2 — Feature key access style

A) **Dot-path strings** — `is('topBar.save')` with typed path union

B) **Nested object only** — `features().topBar.save` (no string paths)

C) **Both** — nested object + `is(path)` helper

X) Other (describe after [Answer]:)

[Answer]: C

---

## Question 3 — JSON load timing

A) **APP_INITIALIZER** — block bootstrap until JSON attempted (fail soft to defaults)

B) **Eager HttpClient in root service constructor** — first paint may briefly show defaults then apply

C) **Static import / environment only in v1** — no HTTP JSON file yet (provider + `environment.uiFeatures`)

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 4 — Agent tabs when `topBar.enabled` is false

A) Tabs render in a **standalone strip** below where the top bar was (still under `topBar.agentTabs` or `agentTabs.enabled`)

B) Tabs remain **inside** top-bar component but only the tab row renders

C) If top bar disabled, **tabs also hidden** unless a separate `agentTabs.enabled` is true (independent flag)

X) Other (describe after [Answer]:)

[Answer]: C

---

## Question 5 — Unit boundary confirmation

A) Keep **U-UI-01** (config core) then **U-UI-02** (chrome wiring + docs) as planned

B) Single combined unit instead

X) Other (describe after [Answer]:)

[Answer]: A
