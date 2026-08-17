# UI Configurability — Requirements Clarification Questions

**Increment**: Make Workflow Builder chrome / libraries / canvas features **host- or user-configurable**  
**Status**: AWAITING ANSWERS  
**Context**: Brownfield SPA; want top bar, Agents Library, Skills Library, canvas chrome, etc. toggleable per embedding app

Fill every `[Answer]:`, then reply **answered** in chat.

---

## Question 1 — Who sets the config?

A) **Host app only** (Angular injection / provider when embedding) — end users cannot change it

B) **Runtime JSON / env** (e.g. `assets/wb-ui-config.json` or environment) — deploy-time per tenant

C) **Both** — host provider overrides defaults from JSON/env

D) **In-app settings UI** for the Workflow Author to toggle panels live

X) Other (describe after [Answer]:)

[Answer]: C

---

## Question 2 — How fine-grained should toggles be?

A) **Coarse regions only** — e.g. show/hide: Top bar, Left library, Right properties, Canvas, Agent tabs, Minimap, Zoom controls

B) **Regions + top-bar actions** — also toggle Save, Export, Import, Run, Reset, Theme, Edit/View, Back, Logo, title/status

C) **Fully granular** — every button/section individually + library modes (Agents vs Skills vs both)

X) Other (describe after [Answer]:)

[Answer]: C

---

## Question 3 — What must be configurable in **v1** of this increment? (pick all that apply)

List letters after `[Answer]:` (e.g. `A,B,D,E`).

A) Top bar (whole bar and/or individual actions)

B) Agents Library (solution left sidebar)

C) Skills Library (nested agent left sidebar)

D) Properties panel (right sidebar)

E) Canvas itself (always on vs optional)

F) Agent tab strip

G) Canvas overlays (zoom, minimap, floating Save/Export if present)

H) Theme toggle

X) Other (describe)

[Answer]: `A,B,D,E, F,G,H`

---

## Question 4 — Config shape preference?

A) **Typed TypeScript config** via `InjectionToken` / `provideWorkflowBuilderUi({ ... })`

B) **Plain JSON** schema loaded at startup

C) **Feature-flag style** boolean map (`ui.topBar.save: true`)

D) **A + C** — typed provider wrapping a boolean feature map

X) Other (describe after [Answer]:)

[Answer]: D

---

## Question 5 — Defaults when a flag is missing?

A) **Show everything** (current behavior = all on)

B) **Safe minimal** (canvas + essential actions only; libraries off until enabled)

C) **Explicit required** — missing key = build/runtime error

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 6 — Nested agent route when Skills Library is disabled?

A) Still open `/agent/:nodeId` but hide left Skills Library

B) Block navigation into nested agent entirely

C) Open nested agent with canvas only (no left library, properties optional via flags)

X) Other (describe after [Answer]:)

[Answer]: C

---

## Question 7 — Scope of this increment?

A) **Config + wiring only** inside this SPA (prove toggles via env/demo config)

B) **Config + documented embed API** (token + example) for other Angular apps

C) **Full embeddable library package** (publishable) — larger effort

X) Other (describe after [Answer]:)

[Answer]: C

---

## Extension opt-ins (this increment)

### Question E1 — Security Baseline

A) Yes — enforce SECURITY rules

B) No — skip (PoC / internal tooling)

X) Other (describe after [Answer]:)

[Answer]: A

### Question E2 — Resiliency Baseline

A) Yes — apply resiliency guidance

B) No — skip for this increment

X) Other (describe after [Answer]:)

[Answer]: A

### Question E3 — Property-Based Testing

A) Yes — full PBT

B) Partial — pure/config merge helpers only

C) No — skip

X) Other (describe after [Answer]:)

[Answer]: B

---

When done, reply **answered**.
