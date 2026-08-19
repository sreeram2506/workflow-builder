# Host embed contract — Requirement Verification Questions

**Increment**: Host embed contract (gaps first; package publish later)  
Fill each `[Answer]:`, then reply in chat (e.g. `answered`).

No application code until answers are locked. **ng-packagr / npm publish is out of this increment** (locked by the request).

---

## Question 1

**Which gaps should this increment close?** (package publish stays later)

A) **Recommended** — Host contract only: (1) load/get workflow document + change/dirty; (2) Save/Run notify the host instead of only blob-download / in-app simulate; (3) shells fill the host box (`height: 100%`), not `100vh`. Defer: widget registry, Repeater option lists, graph validation, real run engine, theme token set, ng-packagr.

B) A plus Properties **widget registry** (host registers Angular components for unknown `ui_component`)

C) A plus **graph validation** (e.g. Trigger present, no dangling edges) before Save

D) All listed product gaps except ng-packagr (A + widgets + validation + host option lists + run adapter + theme tokens)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**How should the host load and read the graph?** (ignored if Q1 excludes document I/O)

A) **Recommended** — Shell bindings like existing `[ui]` / `[palettes]`: `[document]` in, `(documentChange)` out; facade `loadDocument` / `getDocument` / dirty. Invalid JSON does not wipe the canvas (keep last good + status).

B) Facade-only (host injects `WorkflowFacade`; no new shell inputs/outputs)

C) Keep file Export/Import only; do not add a document binding

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**When the host is embedding, what should Save and Run do?** (SPA demo may keep a default)

A) **Recommended** — Optional host callbacks via `provideWorkflowBuilderUi` and/or shell outputs. If a Save handler is set, Save/⌘S calls it with the document (no blob). If not set, keep today’s download. If a Run handler is set, Run calls it; if not, keep simulated Run. Export/Import files stay as chrome.

B) Always emit to the host; remove blob download and simulated Run from this package

C) Keep download + simulated Run only; hosts poll `getDocument()` (no Save/Run hooks)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**How should the builder fill a host panel?** (not the browser window)

A) **Recommended** — Shells use `height: 100%` / `min-height: 0` so the host’s box defines size. Host (or try harness) must give the wrapper a height. No new `[height]` input.

B) Add `[fillHost]="true"` (default false so the standalone SPA can stay `100vh`)

C) Keep `100vh` this increment

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6

Should the resiliency baseline be applied to this project?

A) Yes — apply the resiliency baseline as directional best practices and design-time guidance

B) No — skip the resiliency baseline

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7

Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints

B) Partial — enforce PBT rules only for pure functions and serialization round-trips

C) No — skip all PBT rules (suitable for simple CRUD / UI-only)

X) Other (please describe after [Answer]: tag below)

[Answer]: B
