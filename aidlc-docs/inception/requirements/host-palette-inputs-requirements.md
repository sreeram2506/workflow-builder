# Requirements — Host palette inputs (Syncfusion-style)

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | Parent component binds palette symbols like Syncfusion `<ejs-symbolpalette [palettes]="palettes">` |
| **Request type** | Enhancement (brownfield) on U-PAL-01/02 |
| **Scope** | `wb-shell-layout`, `wb-agent-skills-shell`, catalog wiring, embed docs |
| **Complexity** | Moderate |
| **Requirements depth** | Standard |
| **Increment name** | Host palette inputs (v1) |

---

## Locked decisions

| ID | Decision |
|---|---|
| Q1 | **A** — Bind `[palettes]` on `wb-shell-layout` and `wb-agent-skills-shell` |
| Q2 | **A** — Parent list = **catalog/agent (or skill) cards**. Featured Condition/Router/Repeater and `defaultAgents` stay |
| Q3 | **A** — Omit input = Enso or `provideWorkflowBuilderUi` catalog. Present `[]` = empty-state only. Present items = parent owns remote list (no Enso) |
| Q4 | **A** — `[defaultAgents]` on the same host tag; omit = Blank Agent; present (incl. `[]`) replaces Blank Agent; **wins over JSON** |
| Q5 | **A** — Same `[palettes]` pattern on skills shell |
| Q6 | **A** — Component input **wins** over `provideWorkflowBuilderUi({ catalog })` |
| Q7 | **A** — Drop items whose `type` is not a known `NodeType` (no `Stream` node this increment) |
| E1 | Security **ON** — new-code scoped |
| E2 | Resiliency **ON** — directional; DR / topology / CAB **N/A** (client SPA) |
| E3 | PBT **partial** — omit vs present vs `[]`; unknown-type drop |

---

## 1. Goals

1. Let a **parent Angular component** pass catalog cards the way Syncfusion passes `palettes` — template inputs, not only bootstrap DI.
2. Keep **omit = today’s Enso/adapter** so existing embeds do not break.
3. Document the parent template API in embed docs.

---

## 2. Functional requirements

### FR-HPI-01 — Host tags

The parent SHALL bind:

```html
<wb-shell-layout
  [palettes]="solutionPalettes"
  [defaultAgents]="defaultAgents">
</wb-shell-layout>

<wb-agent-skills-shell
  [palettes]="skillPalettes">
</wb-agent-skills-shell>
```

`defaultAgents` applies to the **solution** shell only (skills has no default-agent strip).

Item shape is existing `PaletteItem`: `key`, `type`, `label`, `description`, `categoryId`, optional `taskId` / `taskMeta`.

`defaultAgents` cards: `{ key, label, description }` (same as U-PAL-01).

### FR-HPI-02 — Precedence

Resolution for **remote catalog** of a canvas:

1. Built-in Enso default
2. `provideWorkflowBuilderUi({ catalog })` if set
3. Component `[palettes]` if the input is **present** — **wins**

Resolution for **default agents** (solution):

1. Omitted JSON/provider → Blank Agent
2. JSON / `provideWorkflowBuilderUi` `palette.solution.defaultAgents`
3. Component `[defaultAgents]` if **present** — **wins**

Chrome flags and `palette.*.types` allow-lists from U-UI / U-PAL still apply to whatever rows are composed.

### FR-HPI-03 — Omit vs `[]` vs items (`[palettes]`)

| Input | Remote catalog |
|---|---|
| Omitted (`undefined`) | Enso or provider catalog (U-PAL-02) |
| `[]` | Empty-remote path: empty-state only (no featured, no default agents, no lists) |
| One or more items | Parent owns remote list (no Enso HTTP for that canvas). Featured + default agents still show (Q2). Parent items listed under them, then filtered by allow-list |

### FR-HPI-04 — `[defaultAgents]`

| Input | Behavior |
|---|---|
| Omitted | JSON/provider / Blank Agent (U-PAL-01) |
| `[]` | No default-agent cards |
| Non-empty | Those cards replace Blank Agent |

If allow-list is present and does not include `AIAgent`, default agents SHALL NOT render.

### FR-HPI-05 — Unknown types

Items whose `type` is not in `ALLOWED_NODE_TYPES` SHALL be dropped (not shown, not creatable). `"Stream"` is dropped. A first-class Stream node is **out of scope**.

### FR-HPI-06 — Docs

`docs/workflow-builder-ui-embed.md` SHALL show a parent template example (`[palettes]`, `[defaultAgents]`), omit/`[]`/items, and that inputs win over the catalog provider. Example parent items MUST use known types only.

---

## 3. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-HPI-01 | Omitting inputs MUST preserve U-PAL-02 behavior (fail-open). |
| NFR-HPI-02 | No secrets in examples; do not log tokens from catalog/Enso. |
| NFR-HPI-03 | Invalid item shapes skipped; remaining items still render. |
| NFR-HPI-04 | PBT Partial: omit vs present vs `[]`; dropped unknown types never appear in output. |

---

## 4. Out of scope

- New `Stream` (or other) canvas node type
- New `wb-workflow-builder` wrapper (Q1=A)
- Appending parent items **and** Enso in one list (Q2=A, Q3=A)
- Publishable ng library
- Skills `[defaultAgents]`

---

## 5. Success criteria

A parent can write:

```html
<wb-shell-layout
  [palettes]="[{ key: 'stream', type: 'AIAgent', label: 'Stream', description: 'Host API', categoryId: 'agents' }]"
  [defaultAgents]="[{ key: 'claims', label: 'Claims Agent', description: 'Triage' }]">
</wb-shell-layout>
```

and see featured logic shapes, Claims Agent, and a Stream **card** (typed `AIAgent`) without Enso. Omitting `[palettes]` keeps Enso. Passing `[]` shows empty-state only.

---

## Extension compliance (this stage)

| Extension | Status | Notes |
|---|---|---|
| Security | Compliant (new-code) | Input validation on item `type`; no secrets in docs. SECURITY-01/02/04/06/07/08/10/12/13/14 N/A or unchanged SPA |
| Resiliency | Compliant directional | Omit fail-open; empty vs error already U-PAL-02. DR/topology/CAB N/A |
| PBT Partial | Compliant | Properties identified for FD: omit/`[]`/items; unknown-type drop invariant |
