# U-RAD-01 Functional Design Plan — Remove APIs and dummy data

**Unit**: `u-rad-01-remove-apis-dummy-data`  
**Status**: STAGE APPROVED — CG PLAN OPEN  
**Locked FD**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A  
**Stories**: US-RAD-01..04  
**App Design locks**: Keep `EnsoTaskCatalogService`; no HTTP; omit-without-adapter = empty-remote; adapter failure unchanged; convert nested library; delete mocks; no new injectable  
**UoW locks**: Q1=A · Q2=A · Q3=A · Q4=A  
**Next after FD approval**: Code Generation (NFR/Infra SKIP)

Output dir: `aidlc-docs/construction/u-rad-01-remove-apis-dummy-data/functional-design/`

Fill every `[Answer]:`, then reply in chat (for example `answered`). Functional design artifacts will not be generated until this plan is approved.

---

## Execution checklist (after plan approval)

- [x] Generate `business-logic-model.md`
- [x] Generate `business-rules.md`
- [x] Generate `domain-entities.md`
- [x] Generate `frontend-components.md`
- [x] Include Testable Properties (PBT Partial)
- [x] Validate vs US-RAD-01..04

---

## Question 1

**Business rule — omit `[palettes]` with no catalog adapter**

A) **Recommended** — Same payload as `[palettes]="[]"`: `emptyRemote: true`, `items: []`, `categories: []`, `error: null`, `source: 'empty'`. Do not compose static `PALETTE_ITEMS` featured types. Do not call HTTP.

B) Omit-without-adapter uses `source: 'static'` with empty items (would differ from `[]`)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 2

**Featured strip when palettes are omitted (supersedes US-LIM-01 omit AC)**

A) **Recommended** — Omit-without-adapter is empty-remote, so the featured strip is **hidden** (same as `[]`). Static Condition / Router / Repeater do **not** appear. When palettes are present and non-empty, U-LIM replace rule is unchanged.

B) Keep LIM omit behavior (show built-in featured three) even after Enso is removed

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 3

**Nested library — search and Add**

A) **Recommended** — Sanitize `palettes` with existing `sanitizeHostPaletteItems`. Filter case-insensitive substring on `label`, `description`, and `key`. Add calls `addSkillFromPaletteItem` with `key`, `label`, `description`, optional `taskId`. Omit or `[]` → empty list.

B) Filter label only; Add disabled (display-only)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 4

**Repeater pickers — existing node values**

A) **Recommended** — Workflow and version `<select>` option lists are empty. Do **not** clear `repeater.workflowId` / `versionId` already on the node. Orphan ids may remain in data until the author changes them. No new API.

B) Clear workflow/version on the node when the value is not in the (empty) option list

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 5

**Facade — `addSkillToAgent` after MOCK_SKILLS is deleted**

A) **Recommended** — Stop `findMockSkill`. `addSkillToAgent(id, skillId)` returns `false` (no mock row). Nested Add uses `addSkillFromPaletteItem` only. Update facade specs that used mock skill ids.

B) Treat `skillId` as name/description and still call `addSkillRef` (would invent skills from ids)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 6

**PBT (Partial — PBT-02/03/07/08/09)**

A) **Recommended** — Properties: (1) Invariant — omit-without-adapter load never has `emptyRemote === false`. (2) Invariant — omit-without-adapter items never include static featured keys `Condition` / `Decision` / `Repeater` from `PALETTE_ITEMS`. (3) Invariant — omit-without-adapter `source` is never `'enso'`. Example tests for nested filter and empty Repeater options. Document compose as **lossy** (no inverse).

B) Example tests only (no new PBT)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 7

**Frontend — nested empty list**

A) **Recommended** — Empty `<ul>` when there are no matching palettes (no new empty-state copy in Developed-skills). Left sidebar still uses existing `palette-empty-remote` for omit/`[]`. Do not mount nested library in the agent shell.

B) Add a dedicated empty-state string inside `wb-nested-skills-library`

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---
