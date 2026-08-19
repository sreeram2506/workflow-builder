# Requirements — Host embed contract

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | Fix embed/host gaps first; package publish later |
| **Request type** | Enhancement (brownfield) |
| **Scope** | Document I/O, Save/Run host hooks, fill-host height |
| **Complexity** | Moderate |
| **Requirements depth** | Standard |
| **Increment name** | Host embed contract |
| **Answers** | Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=B |

See `host-embed-contract-intent-analysis.md`.

---

## 1. Goals

1. A host can **load** a workflow into the builder and **read** the current document (including dirty).
2. **Save** and **Run** can notify the host when handlers are provided; otherwise keep today’s download and simulated Run.
3. Shells **fill the host box** (`height: 100%`), not the browser viewport (`100vh`).
4. No npm / ng-packagr publish in this increment.

---

## 2. Locked decisions

| Topic | Choice |
|---|---|
| Slice | Host contract only (Q1=A). Not widgets, validation, option lists, run engine, theme tokens, or ng-packagr |
| Document | `[document]` in + `(documentChange)` out on shells; facade `loadDocument` / `getDocument` / dirty (Q2=A) |
| Invalid load | Do **not** wipe the canvas; keep last good document; set a status/error |
| Save/Run | Optional host callbacks (provider and/or shell outputs). Unset → keep blob Save and simulated Run (Q3=A) |
| Export/Import | File chrome unchanged |
| Height | `height: 100%` / `min-height: 0`; host wrapper supplies height; no `[height]` input (Q4=A) |
| Extensions | Security Yes (new-code); Resiliency Yes (directional, DR N/A); PBT Partial (parse/serialize) |

---

## 3. Functional requirements

### FR-HE-01 — Load document

The host SHALL be able to load a solution `WorkflowDocument` into the builder:

- Shell input `[document]` on `wb-shell-layout` (and nested shell if a document is bound there — nested graph still lives on the solution agent; prefer **solution shell** as the load target).
- Facade `loadDocument(doc)` used by that input.

A successful load replaces the canvas graph (and clears or resets nested-edit state so the solution document is what is shown). `id` / `name` / nodes / edges / viewport SHALL be taken from the loaded document (existing serialize rules).

### FR-HE-02 — Invalid load fail-safe

If the host passes a non-object, or a document that fails existing parse/validate:

- The canvas SHALL keep the last good document.
- A non-secret status/error SHALL be set (reuse canvas status or bootstrap-style message).
- The builder SHALL NOT throw to the host page.

### FR-HE-03 — Get document and dirty

Facade SHALL expose:

- `getDocument()` — current **solution** `WorkflowDocument` (if nested canvas is open, flush nested graph onto the solution agent first, same as today’s exit/save path).
- `dirty` (or existing autosave dirty) — true when the in-memory graph differs from the last loaded or last successful host Save.

### FR-HE-04 — documentChange output

`wb-shell-layout` SHALL have `(documentChange)` that emits a structured clone of `getDocument()` after:

- a successful `[document]` / `loadDocument` apply, and
- committed graph changes that already mark autosave dirty (debounce MAY match existing autosave; do not emit on every pointer move).

Emit MUST NOT include secrets. Nested shell need not duplicate this if solution shell owns the solution document.

### FR-HE-05 — Save host hook

If the host supplies a Save handler (`provideWorkflowBuilderUi({ persist: { save } })` and/or `(save)` on the shell — one first-win order, documented):

- Save button and ⌘/Ctrl+S SHALL call that handler with `getDocument()`.
- SHALL NOT trigger blob `saveDownload`.

If no handler is set, Save/⌘S SHALL keep today’s blob download.

View mode: existing Save disable stays.

### FR-HE-06 — Run host hook

If the host supplies a Run handler (`persist.run` and/or `(run)` — same first-win as Save):

- Run SHALL call that handler with `getDocument()`.
- SHALL NOT start simulated Run.

If no handler is set, Run SHALL keep today’s simulated Run.

Stop/reset chrome stays as today unless a Run handler is active (then Stop/Reset MAY no-op or still clear local statuses — prefer: local status clear still allowed; do not invent a host Stop API this increment).

### FR-HE-07 — Export / Import files

Export and Import file chrome SHALL remain. They are not replaced by `[document]`.

### FR-HE-08 — Fill host height

`wb-shell-layout` and `wb-agent-skills-shell` SHALL use `height: 100%` and `min-height: 0` (not `100vh`). The host (or app root / try wrapper) MUST give an ancestor a definite height. No `[height]` input.

Standalone SPA: `html` / `body` / `app-root` already fill the viewport so the app still looks full-page.

### FR-HE-09 — Embed docs

`docs/workflow-builder-ui-embed.md` SHALL document `[document]`, `(documentChange)`, Save/Run handlers vs defaults, invalid-load fail-safe, and fill-host height. No tokens in examples. Do not commit `src/app/try/` unless needed locally for height; try remains gitignored.

---

## 4. Non-functional

- No new HTTP, secrets, or host tokens in documents or examples.
- Parse/load never throws to the host; invalid payload keeps last good (Resiliency fail-safe).
- PBT Partial: round-trip serialize/parse for documents this increment touches (existing serialize helpers if still used).
- `npm test` / `npm run build` stay green. Chrome flags, palettes, Properties schema, agent enter-without-tabs, Condition edges, Router connectors stay intact.

---

## 5. Out of scope

- ng-packagr / npm publish / peerDeps package layout
- Properties widget registry (Q1 not B/D)
- Graph validation before Save (Q1 not C/D)
- Host Repeater option lists, real run engine, theme token set (Q1 not D)
- Removing blob Save or simulated Run when no host handler (Q3 not B)
- Facade-only I/O with no shell bindings (Q2 not B)
- `[height]` input (Q4 not B)
- Committing `src/app/try/`

---

## 6. Success

- Host sets `[document]` → canvas shows that graph; bad payload leaves previous graph + status.
- Host reads `(documentChange)` / `getDocument()` / dirty.
- With Save handler: Save does not download; handler receives the document. Without: download still works.
- With Run handler: Run does not simulate; handler receives the document. Without: simulate still works.
- Shell in a fixed-height host panel fills that panel (no `100vh` overflow vs parent).
