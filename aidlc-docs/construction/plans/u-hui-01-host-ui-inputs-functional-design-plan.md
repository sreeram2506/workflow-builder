# U-HUI-01 Functional Design Plan — Host UI chrome inputs (`[ui]`)

**Unit**: `u-hui-01-host-ui-inputs`  
**Status**: GENERATION COMPLETE — AWAITING STAGE APPROVAL  
**Stories**: US-HUI-01..04  
**Depends on**: U-UI-01 / U-UI-02 COMPLETE  
**App Design locks**: shell-local merge; no global write; `UI_EFFECTIVE_FEATURES` token; single unit  
**UoW plan locks**: Q1=A · Q2=A · Q3=A  
**Locked FD**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A  
**Next after FD approval**: Code Generation (NFR/Infra SKIP)

Output dir: `aidlc-docs/construction/u-hui-01-host-ui-inputs/functional-design/`

U-UI-01/02 rules still apply for bootstrap layers and chrome regions. This plan only locks **instance `[ui]` overlay** behavior.

---

## Execution checklist (after plan approval)

- [x] Generate `business-logic-model.md`
- [x] Generate `business-rules.md`
- [x] Generate `domain-entities.md`
- [x] Generate `frontend-components.md`
- [x] Validate vs US-HUI-01..04

---

## Question 1

**Domain — what does `UI_EFFECTIVE_FEATURES` expose?**

A) **Recommended** — InjectionToken for a small **reader** `{ features(): UiFeatures; is(path: UiFeaturePath | string): boolean }` backed by the shell’s effective signal (same fail-open `is` semantics as `UiConfigService`)

B) InjectionToken for `Signal<UiFeatures>` only; each consumer builds its own path checks

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Business logic — how is effective computed?**

A) **Recommended** — `effectiveFeatures = computed(() => mergeUiFeatures(uiConfig.features(), ui() ?? {}))` on each shell; omit and `{}` both pass `{}` into merge (no leaf overrides). Never call `applyLayers` / never write the service for `[ui]`

B) Push `[ui]` into `UiConfigService` via a new `setInstanceOverlay` API (global write — conflicts with FR-HUI-05)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Business rule — invalid / unknown keys in bound `[ui]`**

A) **Recommended** — Reuse `normalizePartial` (or equivalent) before merge: unknown keys ignored; non-boolean known leaves treated as omitted (same as U-UI-01 JSON/provider). No banner; do not invalidate `loadStatus`

B) Reject entire `[ui]` object on any bad leaf → fall back to global features only + optional warn

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Data flow — who reads effective flags?**

A) **Recommended** — Shell region `@if`s use shell-local `is(...)` / `effectiveFeatures()`. TopBar, ChromeShortcuts, ZoomControls, CanvasViewport inject `UI_EFFECTIVE_FEATURES` (optional) with **fallback** to `UiConfigService` when token absent (tests / non-shell hosts)

B) Every gated component injects only the token (required); no UiConfigService fallback

C) Shells only — children keep injecting `UiConfigService` (would ignore `[ui]` for action/overlay gates)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Integration — nested agent shell vs solution shell**

A) **Recommended** — Each shell’s `[ui]` is **independent**. Nested `wb-agent-skills-shell` does **not** inherit the parent solution shell’s overlay unless the host also binds `[ui]` on the nested shell. Token provided at each shell scopes to that shell’s descendants only

B) Nested shell always inherits parent effective features as base, then merges its own `[ui]`

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6

**Error / status — load-status banner under `[ui]`**

A) **Recommended** — Banner still reads **global** `UiConfigService.loadStatus()` (JSON soft-fail). Instance `[ui]` does not own or mutate load status

B) Hide load-status banner when any `[ui]` is bound

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7

**Frontend — reactive updates**

A) **Recommended** — Angular `input()` + `computed` effective + token factory reading that signal. Parent changes to `[ui]` update chrome without remount/reload. Clearing a key (new partial without that key) restores lower-layer value via merge

B) Require host to remount the shell to apply `[ui]` changes

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8

**Business scenario — themeToggle alias on `[ui]`**

A) **Recommended** — Same U-UI-01 alias rules: `[ui]` may set `themeToggle` and/or `theme.toggle`; normalize before merge so either path affects the theme gate

B) Only accept `theme.toggle` on `[ui]`; ignore `themeToggle` alias at instance layer

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9

**PBT / tests (NFR-HUI-01 Partial)**

A) **Recommended** — PBT: for arbitrary resolved base + partial, `mergeUiFeatures(base, normalizePartial(partial))` leaf equals partial when defined else base; instance path never mutates a cloned global snapshot. Example tests: omit/`{}`/partial precedence, isolation across two shells, reactive update, both shells, docs smoke not required in unit tests

B) Example-based tests only (no new PBT)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
