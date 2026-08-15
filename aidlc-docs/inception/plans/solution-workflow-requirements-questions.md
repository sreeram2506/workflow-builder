# Solution Workflow — Requirements Clarification Questions

**Increment**: Solution Workflow (agent-inside-agent / skills palette)  
**Context**: Brownfield workflow-builder after U1–U9. You asked to build a **solution workflow** where an agent can contain an agent, with currently developed skills available. Solution workflow palette should include **Condition, Router, Repeater**, and **Blank Agent** below them.

Fill each `[Answer]:`, then reply in chat when done (e.g. `answered`).

**Live UI**: hard-refresh local `npm start`  
**Reference**: enso-suite solution canvas + `.cursor/skills/enso-logic-nodes/SKILL.md`

---

## Question 1 — What is the primary scope of this increment?

A) **Nodes Library only** — restore featured strip: Condition / Router / Repeater, with **Blank Agent** card below (no nested-agent runtime yet)

B) **Solution workflow mode** — canvas mode for solution workflows: palette = logic shapes + Blank Agent below; skills list available for the agent context

C) **Full agent-inside-agent** — Blank Agent can open/edit a nested agent pipeline (skills), plus solution palette as in B

D) Match enso-suite **solution canvas** behavior as closely as practical in this prototype (palette + drop rules + nested agent entry points)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2 — Where do “currently developed skills” come from?

A) **Static mock list** in the app (like Repeater mock catalogs) — good enough for local prototype

B) **Existing Enso task/list / skills API** already wired in this repo (live or via proxy)

C) **Hard-coded subset** of known skills for Workflow Manipulation + a few agent skills only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3 — What should Blank Agent do when added / opened?

A) Same as before — create an `AIAgent` node on the canvas; Properties stay generic for now

B) Create Blank Agent node; double-click / “open” navigates to a **nested agent workflow** editor (agent-inside-agent) in this app

C) Create Blank Agent node; show a **skills strip / panel** of developed skills that can be dragged into the nested agent

D) B + C together

X) Other (please describe after [Answer]: tag below)

[Answer]: X( when blank agent opened we have to show the currenlty skills screen)

---

## Question 4 — How should we proceed?

A) **Direct implement** after answers (small library restore only)

B) Lightweight plan + your approval, then implement

C) Full AI-DLC stages (requirements → stories if needed → plan → code)

X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 5 — Priority if multiple parts?

A) Fix everything listed in freeform in one pass

B) Highest-priority item first (name it in freeform), then pause for review

C) You will order them in freeform (1 = first)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question: Resiliency Extensions
Should the resiliency baseline be applied to this increment? (Already **Yes / DR N/A** on prior increments.)

A) Keep current — Yes, DR N/A

B) No — skip resiliency for this increment

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question: Property-Based Testing Extension
Should PBT rules apply to this increment? (Already **Partial** on prior increments.)

A) Keep current — Partial + fast-check

B) Yes — full PBT

C) No — skip PBT for this increment

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Optional freeform
Describe agent-inside-agent / skills UX (what you see vs what you want). Attach a screenshot or enso-suite reference if helpful:

```text
s in solution workflow we will have the agnets and when he clicks o agent we have to t=route to this screen we weeii have everything same here nodes there agent we well have the propertis dialogs same as those
```
