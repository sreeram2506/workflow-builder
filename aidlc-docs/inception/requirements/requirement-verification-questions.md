# Agent dblclick config — Requirement Verification Questions

**Increment**: More Changes R62  
**Request**: Introduce double-click-to-enter-agent as a parent-passable UI config flag (today it is always on).

Fill each `[Answer]:` with a letter. If you pick **X**, describe after the tag. Reply in chat when done (e.g. `answered`).

---

## Question 1 — What interaction should the new flag control?

Today: double-click a Blank Agent / AIAgent **node on the solution canvas** calls `selectAgentTab` and navigates to `/agent/:id`. Chip **single-click** (when the strip is on) also enters. Nested canvas never re-enters.

A) **Recommended** — Canvas node double-click only (parent can turn enter-on-dblclick on/off)

B) Double-click on an **agent tab chip** (strip), not the canvas node

C) One flag for **both** canvas node dblclick and chip dblclick

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2 — Config path (parent JSON / provider / `[ui]`)

A) **Recommended** — `agentTabs.doubleClick` next to `agentTabs.enabled`

B) `agentTabs.enterOnDoubleClick` (longer, explicit)

C) `canvas.enterAgentOnDoubleClick` (canvas gesture, not tab chrome)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3 — Default when the parent omits the key

A) **Recommended** — `true` (keep today’s always-on dblclick; parent sets `false` to disable)

B) `false` (opt-in; parent must set `true` to enable dblclick)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4 — How does this relate to `agentTabs.enabled` (hide the chip strip)?

A) **Recommended** — Independent leaves. Host can hide the strip and still dblclick-enter (U-AE-01), or show the strip and turn dblclick off

B) Coupled: dblclick-enter only when `agentTabs.enabled` is true

C) When the strip is off, dblclick is the only enter path and cannot be disabled; the new flag only applies when the strip is on

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5 — If dblclick is off **and** the tab strip is off, how does a user enter the nested agent?

A) **No nested enter** from the builder UI (host does not want enter in that combo)

B) Keep another in-app enter (describe after [Answer]: — e.g. Properties action, context menu)

C) Treat that combo as invalid: if strip is off, force dblclick on (ignore `false`)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6 — Host layers (same merge as other chrome)

A) **Recommended** — Defaults, then `/assets/wb-ui-config.json`, then `provideWorkflowBuilderUi({ features })`, then instance `[ui]` (sticky onto nested shell like `agentTabs.enabled`)

B) Provider + `[ui]` only (not JSON)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7 — Chip single-click when the strip is on

A) **Recommended** — Unchanged. Strip chip single-click still enters even if canvas dblclick is off

B) When the new flag is false, chips also do not enter

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8 — Security Extensions

Carry-forward from npm-package RA was **Yes — new-code scoped**. Confirm for this increment:

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

C) Carry forward existing (new-code scoped; do not re-open)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9 — Resiliency Extensions

Carry-forward was **Yes — directional; DR N/A**. Confirm for this increment:

A) Yes — apply the resiliency baseline as directional best practices and design-time guidance (recommended for business-critical workloads, as an informed starting point that you can validate and harden before go-live)

B) No — skip the resiliency baseline (suitable for PoCs, prototypes, and experimental projects where rapid iteration matters more than reliability)

C) Carry forward existing (directional; DR N/A)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 10 — Property-Based Testing Extension

Carry-forward was **Partial**. Confirm for this increment:

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)

B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)

C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers with no significant business logic)

D) Carry forward existing (Partial)

X) Other (please describe after [Answer]: tag below)

[Answer]: B
