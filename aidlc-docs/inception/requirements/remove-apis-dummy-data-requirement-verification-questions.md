# Remove APIs and dummy data — Requirement Verification Questions

**Increment**: Remove APIs and dummy data  
Fill each `[Answer]:`, then reply in chat (e.g. `answered`).

---

## Question 1
Which HTTP / backend APIs should we remove from this SPA?

A) Enso catalog calls (`task/list`, `pipeline/list`), the `/enso-api` proxy, and environment URLs plus stored credentials

B) Keep the catalog HTTP wiring; only remove hardcoded credentials from `environment.ts`

C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
Which dummy / mock catalogs should we remove?

A) Nested Skills `MOCK_SKILLS` and Repeater Properties `REPEATER_MOCK_WORKFLOWS`

B) Those mocks plus the `SAMPLE_WORKFLOW` test fixture (boot canvas stays empty Untitled)

C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
After Enso catalog HTTP is gone, what should the Agents / Skills library show when the host does **not** bind `[palettes]`?

A) Static built-in types only (Condition / Router / Repeater, Blank Agent, and other `PALETTE_ITEMS`) — no HTTP

B) Empty library (`palette-empty-remote`) unless the host binds `[palettes]`

C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 4
After mock nested skills are gone, what should the nested Skills Library show?

A) Empty list (host can supply skills later)

B) Same overlay as `[palettes]` on the agent skills shell when the parent binds it

C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 5
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6
Should the resiliency baseline be applied to this project?

A) Yes — apply the resiliency baseline as directional best practices and design-time guidance

B) No — skip the resiliency baseline (suitable for PoCs, prototypes, and experimental projects)

C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7
Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints

B) Partial — enforce PBT rules only for pure functions and serialization round-trips

C) No — skip all PBT rules

D) Other (please describe after [Answer]: tag below)

[Answer]: B
