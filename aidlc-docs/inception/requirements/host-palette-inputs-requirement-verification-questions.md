# Host palette inputs (Syncfusion-style) — Requirements questions

**Status**: RESOLVED  
**Answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A · Q10=B  
**Increment**: Parent `[palettes]` binding like Syncfusion SymbolPalette

Fill **every** `[Answer]:` with `A`, `B`, `C`, … or `X` plus a note. Then reply in chat. No application code until answers are locked.

Today the parent can only use JSON allow-lists and `provideWorkflowBuilderUi({ catalog })`. There is no `<wb-shell-layout [palettes]="…">`. Syncfusion parents own a `palettes` array of symbols and bind it on the component.

---

## Question 1

**Which tag should the parent bind `[palettes]` on?**

A) **Recommended** — `wb-shell-layout` (solution canvas) and `wb-agent-skills-shell` (skills canvas), matching how those shells are routed today

B) A new wrapper, e.g. `wb-workflow-builder`, that the parent uses instead of routing to the shells

C) Keep bootstrap-only (`provideWorkflowBuilderUi`); no template inputs

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**What does `[palettes]` mean in the Agents Library?**

A) **Recommended** — Parent list is the **catalog/agent cards** (Syncfusion symbols). Built-in featured strip (Condition / Router / Repeater) and `defaultAgents` stay as they are today, then parent items are listed under them

B) Parent list is the **entire** library (parent must include Condition / Router / Repeater if they want them — closest to Syncfusion owning every symbol)

C) Parent list is **appended** to Enso `pipeline/list` (Enso + parent items)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**When the parent omits `[palettes]` vs passes `[]` vs passes items?**

A) **Recommended** — Omit = current behavior (Enso or `provideWorkflowBuilderUi` catalog). Present `[]` = empty-state only (same as empty remote). Present items = parent owns the remote list (no Enso for that canvas)

B) `[palettes]` always required; omit is an error

C) Omit and `[]` both mean “show built-in types only” (no empty-state)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Should `[defaultAgents]` also be a component input (Syncfusion-style sibling of palettes)?**

A) **Recommended** — Yes. `[defaultAgents]="cards"` on the same host tag; omit = Blank Agent; present (including `[]`) = replace Blank Agent. Wins over JSON `palette.solution.defaultAgents`

B) No — default agents stay JSON / `provideWorkflowBuilderUi` features only

C) Input exists but JSON/provider still wins

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Skills Library this increment?**

A) **Recommended** — Same pattern: `[palettes]` on `wb-agent-skills-shell` (or a `skillsPalettes` input). Omit = Enso tasks; present = parent skills list

B) Solution Agents Library only; skills stay Enso/JSON types

C) One `[palettes]` on the solution shell also applies to nested skills

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6

**If both component `[palettes]` and `provideWorkflowBuilderUi({ catalog })` are set?**

A) **Recommended** — Component input wins (instance props beat global provider, like Syncfusion)

B) Provider catalog still wins

C) Forbidden — throw / ignore one of them

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7

**Parent item `type` that is not a known node type (`Stream`, etc.)?**

A) **Recommended** — Drop that item (same as JSON unknown types). Cards must use `AIAgent`, `Action`, `Condition`, `Decision`, `Repeater`, … Adding a real `Stream` **node** is a later increment

B) Show the card but create an `AIAgent` (or `Action`) when dropped

C) Add `Stream` as a first-class canvas node type in this increment

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8

Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9

Should the resiliency baseline be applied to this project?

A) Yes — apply the resiliency baseline as directional best practices and design-time guidance

B) No — skip the resiliency baseline

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 10

Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints

B) Partial — enforce PBT rules only for pure functions and serialization round-trips

C) No — skip all PBT rules

X) Other (please describe after [Answer]: tag below)

[Answer]: B
