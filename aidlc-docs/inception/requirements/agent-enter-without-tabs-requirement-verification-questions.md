# Enter agent without tab bar — Requirement Verification Questions

**Increment**: Enter agent without tab bar (double-click + optional tabs)  
Fill each `[Answer]:`, then reply in chat (e.g. `answered`).

No application code until answers are locked.

---

## Question 1
How should a user enter a Blank Agent / AIAgent nested canvas?

A) **Recommended** — Two ways: (1) click an agent chip on the tab bar when `agentTabs.enabled` is true; (2) double-click the agent node on the solution canvas. Double-click must enter even when the tab bar is hidden. Nested canvas: double-click an agent node must not re-enter.

B) Double-click only when the tab bar is hidden; when the bar is shown, only chips enter (double-click does nothing)

C) Single-click the agent node also enters (in addition to double-click and chips)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
When the agent tab bar is hidden (`agentTabs.enabled` false) and the user is inside `/agent/:id`, how do they return to the solution canvas?

A) **Recommended** — Independent **Back / Solution** control on the nested shell (not the tab strip). Works whether tabs are on or off. Tab strip Solution chip stays as today when tabs are on.

B) Browser Back / URL only — no extra in-app control

C) Always show a single Solution chip even when `agentTabs.enabled` is false (hide other agent chips)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
When the tab bar is hidden, should selecting an agent still record an internal tab (no UI)?

A) **Recommended** — Do not add tab chips when `agentTabs.enabled` is false. Double-click still navigates. Turning the bar back on does not require leftover hidden tabs.

B) Keep calling `openAgentTab` so state exists if the host later turns the bar on

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
In **View** mode, should double-click still enter the nested agent (read-only nested canvas)?

A) **Recommended** — Yes, enter in view (same as today: navigate; edits still blocked)

B) No — double-click / chip enter only in Edit mode

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
