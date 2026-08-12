# U5 Functional Design — Clarifications (Round 1)

**Recorded answers (Part A)**

| Q | Answer | Notes |
|---|---|---|
| Q1 | A | Auto-expand on single-node select |
| Q2 | B | JSON Schema Draft-07 subset |
| Q3 | X | Example config descriptor provided — **not** a full per-type field list |
| Q4 | B | Explicit Save (not live patch) |
| Q5 | B | Multi-select → first selected node |
| Q6 | A | View mode → disabled/readonly form |
| Q7 | A | No edge properties; no toasts beyond field invalid; no backend schema; no undo |

**Blocking conflicts / gaps**

1. **Field-list gate unresolved** — Q3 = X with one example object; we still need the exact fields per `NodeType`.
2. **Schema format conflict** — Q2 asks for JSON Schema Draft-07; the Q3 example is an XPMS-style config descriptor (`BooleanConfiguration`, `config_path`, `op_type`, etc.), not JSON Schema.
3. **Save vs live** — Q4 = Save; plan checklist still said “live update” — confirm Save UX details.

Fill each `[Answer]:`, then reply in chat when done.

---

## Question C1 — Schema representation (resolves Q2 vs Q3 example)

**Which schema representation should U5 implement?**

A) **JSON Schema Draft-07 subset** as answered in Q2 — map `type` / `enum` / `title` / sections via grouping conventions; ignore the XPMS descriptor shape

B) **XPMS-style field descriptors** (as in your Q3 example) as the in-app schema format — each field has `name`, `description`, `data_type`, `value`, `options`, `config_path`, `required`, `ui_component`, etc. (Q2 overridden)

C) **Hybrid** — store configs as XPMS-style descriptors in a registry; render forms from that metadata (not Draft-07 documents)

X) Other (please describe after [Answer]: tag below)

[Answer]:

---

## Question C2 — GATE: Exact field lists

**What are the locked v1 fields?**

A) Keep the **original proposed field keys** from the plan (General + Configuration table), but express each field using the **schema format chosen in C1**

B) Use **only** General fields (`label`, `subtitle`, `status`) in U5; Configuration empty until a later unit

C) Configuration fields are **XPMS-style mocks** — for **every** node type, ship **one** boolean example field shaped like your sample (`Ignore Keys in Paragraph` / `config.data.ignore_keys_in_paragraph`), plus General fields

D) You will paste a **full per-type field list** after `[Answer]:` (required if not A/B/C)

X) Other (please describe after [Answer]: tag below)

[Answer]:

---

## Question C3 — Where do Common vs Configuration values live?

A) `label` / `subtitle` / `status` on node root; Configuration values in `node.data` (keys or nested path per schema)

B) Everything including label/subtitle/status only in `node.data`

C) XPMS `config_path` is authoritative (e.g. `config.data.*` nested under `node.data`); General fields still on node root

X) Other (please describe after [Answer]: tag below)

[Answer]:

---

## Question C4 — Explicit Save UX (Q4 = B)

A) Footer **Save** applies `facade.patchNode`; **Cancel** reverts form to last saved node state; dirty indicator optional

B) **Save** only (no Cancel); leaving selection discards unsaved edits

C) **Save** applies; switching selection with dirty form **auto-saves** first

X) Other (please describe after [Answer]: tag below)

[Answer]:

---

## Question C5 — “First selected” for multi-select (Q5 = B)

A) First id in current `selection.nodeIds` array order

B) Most recently clicked / added to selection

X) Other (please describe after [Answer]: tag below)

[Answer]:

---

## Question C6 — Invalid Save

A) Disable Save while form invalid; show inline field errors only (no toast)

B) Allow Save of partial/invalid values (coerce or store as-is)

X) Other (please describe after [Answer]: tag below)

[Answer]:

---

## After answers

Functional Design artifacts will be generated only when C1–C2 (gate) are unambiguous.
