# U-UI-02 Functional Design Plan — Chrome Wiring + Docs

**Unit**: `u-ui-02-chrome-wiring`  
**Status**: APPROVED — ARTIFACTS GENERATED  
**Stories**: US-UI-02..06, US-UI-08 (+ FR-UI-09 demos, FR-UI-10 embed docs)  
**Depends on**: U-UI-01 complete  
**Locked FD**: Q1=A · Q2=B · Q3=A · Q4=A · Q5=A · Q6=A · Q7=C · Q8=A

Output dir: `aidlc-docs/construction/u-ui-02-chrome-wiring/functional-design/`

---

## Execution checklist

- [x] Generate `business-logic-model.md`
- [x] Generate `business-rules.md`
- [x] Generate `domain-entities.md`
- [x] Generate `frontend-components.md`
- [x] Validate vs US-UI-02..06, 08 + FR-UI-09/10

---

## Question 1 — Where to gate chrome (pattern)

A) **Parent shells only** — `ShellLayout` / `AgentSkillsShell` `@if` around left/right/canvas/header; TopBar gates its own actions/tabs internally

B) **Every leaf component self-gates** (sidebar checks `agentsLibrary` / `skillsLibrary` itself even if parent mounts it)

C) **Both** — parents omit mount; critical leaves also self-guard as defense in depth

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 2 — Top bar vs agent tabs when flags differ (Q4=C already: independent `agentTabs.enabled`)

When `topBar.enabled` is false but `agentTabs.enabled` is true:

A) Render a **tabs-only** strip in the header overlay (TopBar shows tabs region only; no logo/actions)

B) Extract tabs into a separate `wb-agent-tabs` component mounted by the shell when flag true

C) Keep full TopBar component mounted but hide all non-tab chrome via inner `@if`s

X) Other (describe after [Answer]:)

[Answer]: B

---

## Question 3 — Load-status banner (U-UI-01 left this to U-UI-02)

A) Show non-blocking banner when `loadStatus().kind` is `missing` or `invalid` (reuse error-banner style, distinct from `bootstrapError`)

B) Console / `loadStatus` only — no UI banner

C) Banner only for `invalid`; silent for `missing`

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 4 — Chrome inset / layout when libraries or properties hidden

A) **Auto-adjust** — `ChromeInsetDirective` / widths treat hidden panels as collapsed (canvas uses full width)

B) Leave inset math unchanged (may leave empty gutter where panel was)

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 5 — Shortcut policy detail

A) Gate only **Save (⌘/Ctrl+S)** via `topBar.save` (current HostListener in TopBar); undo/redo/copy/paste stay always on

B) Also gate undo/redo/copy/paste behind related flags if we add them later — for v1 only Save as (A)

C) Move shortcut handler to Facade and gate Save there; TopBar listener delegates

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 6 — Nested agent left library flag

A) Solution left sidebar → `agentsLibrary.enabled`; nested left sidebar → `skillsLibrary.enabled` (even if both use `wb-left-sidebar`)

B) Single `agentsLibrary.enabled` controls both routes’ left libraries

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 7 — Embed docs location (FR-UI-10)

A) Expand `docs/workflow-builder-ui-config-try.md` into full embed guide `docs/workflow-builder-ui-embed.md` (provider + all flags + examples)

B) Put embed guide under `aidlc-docs/construction/u-ui-02-chrome-wiring/code/` only

C) Both A + short pointer from README

X) Other (describe after [Answer]:)

[Answer]: C

---

## Question 8 — Demo JSON for SPA (FR-UI-09)

A) Keep examples under `src/assets/examples/`; active file stays `{}`; document copy workflow (already started in U-UI-01)

B) Add npm script(s) to swap example → active config

C) Ship `minimal-canvas` as the default active `wb-ui-config.json` for demos

X) Other (describe after [Answer]:)

[Answer]: A
