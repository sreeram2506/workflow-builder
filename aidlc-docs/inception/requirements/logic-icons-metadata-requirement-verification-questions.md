# Host logic extras + agent metadata — Requirements questions

**Status**: RESOLVED  
**Answers**: Q1=A · Q2=B · Q3=C · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A · Q10=A · Q11=A · Q12=B  
**Increment**: Host-supplied extra Condition / Router / Repeater (with icons) and metadata on default agents  
**Live UI**: hard-refresh local `npm start` after later implementation

Fill **every** `[Answer]:` with `A`, `B`, `C`, … or `X` plus a note. Then reply in chat (for example `answered`). No application code until answers are locked.

Today:

- Featured strip shows **one** Condition, one Router (`Decision`), one Repeater (`logicShapeItems` takes the first of each type). Extra host `[palettes]` of those types are not shown as additional shapes.
- Those three use **built-in SVG glyphs**, not a host icon.
- `[defaultAgents]` cards have only `key`, `label`, `description`. No icon. No metadata. On drop, `node.data` gets `paletteKey` only (Enso rows already copy `taskMeta` → `ensoTask`; host sanitizer **drops** `taskMeta`).

---

## Question 1

**What should the host be able to provide for Condition / Router / Repeater?**

A) **Recommended** — Extra cards of those types (same `type`, different `key` / `label` / icon). Featured strip can show more than three shapes

B) Still only one Condition, one Router, one Repeater — host may only override their icons / labels

C) Extra cards are allowed but they appear in the agent/skill **lists**, not in the featured strip (strip stays the three built-ins)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**If the host supplies several Condition / Router / Repeater cards, what does the featured strip show?**

A) **Recommended** — All matching items (built-in plus host), in catalog order

B) Host list **replaces** the three built-ins; show every host Condition / Router / Repeater, none of the static three unless the host included them

C) Still one slot per type (first match wins), even if the host sent more

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 3

**How does the host pass an icon?**

A) **Recommended** — Image URL string (`iconUrl`): `https:` or same-origin relative path (for example `/assets/router.svg`)

B) Inline SVG path `d` (`iconPath`), same as today’s 24×24 glyphs

C) Both fields; `iconUrl` wins when both are set

X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 4

**Where should a host icon appear?**

A) **Recommended** — Agents / Skills library only (featured strip, default-agent cards, list rows)

B) Library **and** canvas node (logic shapes keep geometry; agent cards show the image)

C) Library, canvas, and Properties panel header

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Which host cards must carry metadata besides `label`?**

A) **Recommended** — `[defaultAgents]` **and** host `[palettes]` (including extra Condition / Router / Repeater)

B) `[defaultAgents]` only

C) Host `[palettes]` only (`defaultAgents` stay key / label / description)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6

**What is the metadata shape?**

A) **Recommended** — Optional JSON object `metadata?: Record<string, unknown>` (plain object; drop if not an object). Also keep / copy existing `taskMeta` when the host sends it

B) String map only (`Record<string, string>`)

C) Reuse `taskMeta` only (no new `metadata` field)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7

**When the user drops a card, what happens to metadata?**

A) **Recommended** — Copy onto `node.data` (for example `data.metadata` and existing `data.ensoTask` from `taskMeta`) so the host can read it from the workflow document. Do not render a Properties editor for arbitrary keys this increment

B) Palette-only; nodes keep `paletteKey` / label / description only

C) Copy onto `node.data` **and** show a read-only Metadata section in Properties

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8

**If a card has no icon, what should the library show?**

A) **Recommended** — Today’s type glyph (rhombus / router / repeater, or AIAgent path for default agents)

B) Initials from the label

C) Empty icon well (no glyph)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9

**Icon URL safety (if Q3 includes URLs)**

A) **Recommended** — Allow `https:` and same-origin relative paths. Reject `javascript:`, `data:` (except `data:image/*`), and other schemes. Broken URL falls back to Q8

B) Same-origin / relative paths only (no remote `https:`)

C) Any string as `img src` (host is trusted)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 10

**Should security extension rules be enforced for this project?**

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 11

**Should the resiliency baseline be applied to this project?**

**What this extension is.** Enabling it applies a set of **directional, design-time best practices** for building resilient systems, derived from the **AWS Well-Architected Framework (Reliability Pillar)** and resilience-review guidance. It steers requirements, design, and code toward fault tolerance, high availability, observability, and recoverability — covering 15 practice areas across business goals, change management, observability, high availability, disaster recovery, and continuous improvement.

**What this extension is NOT.** Enabling it does **not** make your workload production-ready, nor does it certify or guarantee any availability, RTO, or RPO target. It is a **starting point** that scaffolds good resiliency decisions early — it is not a substitute for a formal **AWS Well-Architected Review** of the built system.

Treat the output as a well-grounded **first draft of your resiliency posture** to build on and validate — not a finished, production-certified result.

A) Yes — apply the resiliency baseline as directional best practices and design-time guidance (recommended for business-critical workloads, as an informed starting point that you can validate and harden before go-live)

B) No — skip the resiliency baseline (suitable for PoCs, prototypes, and experimental projects where rapid iteration matters more than reliability)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 12

**Should property-based testing (PBT) rules be enforced for this project?**

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)

B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)

C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers with no significant business logic)

X) Other (please describe after [Answer]: tag below)

[Answer]: B
