# Application Design Plan — Host palette inputs (Syncfusion-style)

**Role**: Application Architect  
**Status**: APPROVED — GENERATION COMPLETE  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Requirements**: `host-palette-inputs-requirements.md`  
**Stories**: `host-palette-inputs-stories.md`  
**Execution plan**: Approved Q1=A (1 unit U-HPI-01; App Design + Units; skip NFR/Infra)

Fill `[Answer]:` for each question, then reply in chat. Design artifacts are not generated until this plan is approved.

Additive artifacts will use prefix `host-palette-inputs-` under `aidlc-docs/inception/application-design/`.

---

## Execution checklist (after plan approval)

- [x] Generate `host-palette-inputs-components.md`
- [x] Generate `host-palette-inputs-component-methods.md`
- [x] Generate `host-palette-inputs-services.md`
- [x] Generate `host-palette-inputs-component-dependency.md`
- [x] Generate `host-palette-inputs-application-design.md` (summary)
- [x] Validate design completeness

---

## Proposed component set

| ID | Name | Role |
|---|---|---|
| C-HPI-SHELL | `wb-shell-layout` | `[palettes]`, `[defaultAgents]` inputs |
| C-HPI-SKILLS | `wb-agent-skills-shell` | `[palettes]` input |
| C-HPI-CAT | `EnsoTaskCatalogService` (extend) | If host palettes **present**, use as remote list (win over provider/Enso); `[]` → empty-remote; drop unknown types |
| C-HPI-LEFT | `LeftSidebarComponent` | Unchanged empty-remote / featured / default-agent strip; receives host overlay from parent shell |
| C-HPI-DOCS | Embed docs | Parent template example |

**Unit**: U-HPI-01 = all of the above.

---

## Question 1

**How do shell inputs reach the catalog?**

A) **Recommended** — Shells pass `[palettes]` into `wb-left-sidebar`; sidebar calls `loadCatalog` with an optional host overlay. Catalog treats a **present** overlay as the remote list (wins over provider token and Enso). `EnsoTaskCatalogService` stays `providedIn: 'root'` (component-level catalog tokens would not be seen)

B) Shells `provide` a local catalog adapter in `providers: []` and we change the catalog service to not be root (or use a factory per shell)

C) New `HostPaletteInputService` signal that shells write and catalog reads

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**How is omit vs `[]` vs items represented on the Angular input?**

A) **Recommended** — `input<PaletteItem[] | undefined>()` with **no default**. Unbound = `undefined` (omit). `[palettes]="[]"` = present empty. `[palettes]="items"` = present items

B) Sentinel object `{ mode: 'omit' | 'empty' | 'items', items?: ... }` as the only input type

C) Separate boolean `[useHostPalettes]` plus `[palettes]` array

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Who drops unknown `type` values?**

A) **Recommended** — Catalog compose (same place as U-PAL-02 allow-list). Invalid/missing required fields skipped. Sidebar does not re-validate types

B) Shell/sidebar drops before calling catalog

C) Both catalog and sidebar

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**How does `[defaultAgents]` interact with JSON/provider `palette.solution.defaultAgents`?**

A) **Recommended** — If the input is **present** (including `[]`), catalog/helpers use that list and ignore JSON/provider defaultAgents. If omitted, existing U-PAL-01 merge applies

B) Merge arrays (JSON + input)

C) Input only; stop reading JSON defaultAgents when the component exists

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Unit boundary**

A) **Recommended** — Keep **one unit U-HPI-01** (shells + catalog overlay + docs)

B) Split docs into a second unit

X) Other (please describe after [Answer]: tag below)

[Answer]: A
