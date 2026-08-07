# Requirements Verification Questions

Please answer each question by filling in the letter after `[Answer]:`.
If none of the options fit, choose **Other** and describe your preference after the tag.
When finished, reply in chat that you are done.

---

## Question 1
**Graph rendering primitive** — You asked me to pick SVG or HTML5 Canvas (or ask if unsure). My recommendation is **SVG (with HTML overlay for node cards)** because: (a) nodes need rich DOM (icons, labels, badges, CSS theming, selection outlines), (b) light/dark theming via CSS variables is natural, (c) hit-testing and handles map cleanly to elements, (d) Canvas would force re-implementing text/layout/accessibility and make schema-driven UI harder. Pure Canvas is better for thousands of simple shapes; this product is node-card UX. Confirm:

A) SVG + HTML node cards (recommended) — edges/grid/lasso in SVG; nodes as positioned HTML

B) Pure SVG — nodes and edges all SVG elements

C) Pure HTML5 Canvas — draw everything on canvas (harder for themed node cards / forms coupling)

D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
**Initial node types for mock seed + palette (Phase 1 seed / Phase 4 palette)** — Which starter catalog should we use? (We will not invent additional types later without asking.)

A) Generic automation set: Trigger, Action, Condition, Delay, End (5 types)

B) Integration-style set: Trigger, HTTP Request, Transform, Condition, Notification, End (6 types)

C) Minimal set for scaffolding only: Start, Process, Decision, End (4 types) — expand later after you approve

D) Other (please describe exact type names/categories after [Answer]: tag below)

[Answer]: A

---

## Question 3
**Reference fidelity to workflowbuilder.io** — How closely should Phase 1+ visuals match the public product?

A) Inspired / close enough — same layout regions and SaaS feel; not pixel-perfect

B) High fidelity — match spacing, sidebar patterns, and control placement as closely as practical from public UI

C) Follow only the written Visual Style section in the project brief (ignore further reference-site details)

D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 4
**Default theme on first load**

A) Light theme (matches the brief’s light-gray dotted canvas description)

B) Dark theme

C) Follow system preference (`prefers-color-scheme`), with manual toggle available

D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 5
**Default canvas mode on first load**

A) Edit mode (all interactions enabled)

B) Read-only / view mode (controls locked; toggle to edit later)

C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6
**Handle typing for connections (needed before Phase 5, but shapes Phase 1 mock data)** — What does “typed source/target handles” mean for v1?

A) Simple direction only — source vs target; any source may connect to any target

B) Port kinds — e.g. `flow` vs `data`; only matching kinds may connect

C) Node-category rules — e.g. Condition may have true/false outputs; otherwise unrestricted flow

D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7
**Browser / viewport baseline for layout shell**

A) Modern evergreen desktop browsers only (Chrome/Edge/Firefox/Safari latest); desktop-first, no mobile layout goal

B) Desktop-first but usable down to ~1280px width

C) Responsive including tablet (simplified sidebars)

D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8
**Phase gate confirmation** — Your brief says do not advance phases without explicit confirmation. For AI-DLC + your build order, confirm the gate model:

A) After Requirements + Workflow Planning approval, implement **only Phase 1**, then stop for your review before Phase 2

B) Group early phases: after planning, implement Phases 1–3 together, then stop; later phases still gated individually

C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9
**Security Extensions**
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 10
**Resiliency Extensions**
Should the resiliency baseline be applied to this project?

**What this extension is.** Enabling it applies directional, design-time best practices for building resilient systems (AWS Well-Architected Reliability Pillar guidance). It steers requirements/design/code toward fault tolerance, observability, and recoverability.

**What this extension is NOT.** It does not make the workload production-ready or certify availability/RTO/RPO. Suitable as an informed starting point — not a finished production certification.

A) Yes — apply the resiliency baseline as directional best practices and design-time guidance

B) No — skip the resiliency baseline (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 11
**Property-Based Testing Extension**
Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)

B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for limited algorithmic complexity)

C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers)

X) Other (please describe after [Answer]: tag below)

[Answer]: B
