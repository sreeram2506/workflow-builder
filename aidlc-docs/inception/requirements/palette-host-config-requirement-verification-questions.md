# Palette / catalog host config — Requirements questions

**Status**: RESOLVED  
**Answers**: Q1=A · Q2=A · Q3=C · Q4=B · Q5=A · Q6=B · Q7=A · Q8=A · Q9=B

Fill `[Answer]:` for each question, then reply in chat. No code will be edited until then.

This increment is about **what hosts can configure** for palettes and catalog APIs — not chrome hide/show (that is already U-UI-01/02).

Today: solution canvas shows Condition, Router, Repeater, Blank Agent + Enso/mock agents; nested skills canvas shows Condition, Router, Repeater + Enso/static skills. Hosts cannot turn those types off, rename Blank Agent, add a second default agent, or plug extra list APIs.

---

## Question 1

**How should a parent app supply this config?**

A) Same as chrome: JSON (`wb-ui-config.json`) plus `provideWorkflowBuilderUi(...)` overlay (provider wins)

B) Provider-only TypeScript (no JSON) — catalog/URLs stay in code

C) JSON-only for node hide/show; TypeScript provider required for APIs and default-agent list

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 2

**Should solution (Agents Library) and nested agent (Skills Library) be configured separately?**

A) Yes — independent flags/lists per canvas (e.g. hide Blank Agent on solution, keep Condition on skills)

B) No — one set of type flags applies to both canvases

C) Solution can hide/rename agents; skills only hide Condition/Router/Repeater (no custom default agents on skills)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 3

**Which built-in nodes can a host hide?**

A) Only the ones named: Condition, Router, Repeater, Blank Agent

B) Those plus other static types (Trigger, Action, Delay, End, Notification) on skills

C) Host supplies an allow-list of type keys; omitted types are hidden (default still show-all if omitted entirely)

X) Other (please describe after [Answer]: tag below)

[Answer]:C

---

## Question 4

**Default agents (rename / two different defaults)**

A) Host can only **rename** the single Blank Agent (label + description)

B) Host supplies **1..N static default agent cards** (id, label, description). If the list is present it **replaces** built-in Blank Agent

C) Host list **adds** extra default agents; built-in Blank Agent stays unless a hide-flag turns it off

D) No built-in Blank Agent unless the host adds it; Enso/API agents are the only other source

X) Other (please describe after [Answer]: tag below)

[Answer]:B

---

## Question 5

**How should extra APIs attach to Agents or Skills lists?**

A) Host injects a **catalog adapter** (functions that return agent/skill rows). Enso stays the default adapter unless the host replaces it

B) Host passes **extra HTTP URLs**; responses must match current Enso pipeline/task JSON shapes

C) Host passes URLs **plus optional mapper functions** (any JSON → palette rows)

D) v1 = hide/show + default-agent list only; extra APIs in a later increment

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 6

**If an extra/Enso list API fails or returns empty**

A) Keep today’s behavior: show static defaults + mock agents (solution) / static catalog (skills), plus a non-blocking error string

B) Show only host static defaults (no mocks); banner on failure

C) Empty list + banner (no mocks)

X) Other (please describe after [Answer]: tag below)

[Answer]:B

---

## Question 7

**Security Extensions**  
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 8

**Resiliency Extensions**  
Should the resiliency baseline be applied to this project?

**What this extension is.** Enabling it applies directional, design-time best practices for building resilient systems (Well-Architected Reliability Pillar). It is a starting point, not a production certification.

A) Yes — apply the resiliency baseline as directional best practices and design-time guidance

B) No — skip the resiliency baseline (suitable for PoCs and rapid iteration)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 9

**Property-Based Testing Extension**  
Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints

B) Partial — enforce PBT only for merge/defaulting/mapper helpers

C) No — skip all PBT rules

X) Other (please describe after [Answer]: tag below)

[Answer]:B
