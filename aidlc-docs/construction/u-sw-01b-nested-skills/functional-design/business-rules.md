# Business Rules — U-SW-01b Nested Agent Skills

## BR-SW01B-01 — Routes

- Solution canvas at `/`
- Nested agent skills at `/agent/:nodeId`
- No production auth on routes

## BR-SW01B-02 — Tab → navigate

- Clicking an open agent tab navigates to `/agent/:nodeId` for that tab’s `nodeId`
- Focusing already-open nested route for same id is idempotent (re-navigate OK)

## BR-SW01B-03 — Nested shell

- Dedicated nested children (not the solution canvas graph):
  - Left: mock skills catalog
  - Center: selected skills list/cards for the agent
  - Right: Properties (reuse patterns)
- Top bar shows **Back** while on agent route

## BR-SW01B-04 — Mock catalog

- Exactly **5** static mock skills (id, name, description)
- No HTTP; catalog is compile-time / domain module

## BR-SW01B-05 — Add skill

- Edit mode only
- Append to `node.data.skills` array
- **Dedupe by `skillId`**: if present, do not append again (may focus existing entry)
- Catalog entry remains available after add (copy semantics)

## BR-SW01B-06 — Remove skill

- Edit mode: × on selected skill card removes that entry
- View mode: remove disabled

## BR-SW01B-07 — Persistence

- Source of truth: `WorkflowNode` with `type === 'AIAgent'`, path `data.skills`
- In-session: survives Back and re-open via GraphStore document
- Serialize: opaque `data` already clones; skills round-trip with document JSON

## BR-SW01B-08 — Back

- Navigate to `/`
- Keep agent tabs open
- Select and focus the Blank Agent `nodeId` when the node still exists

## BR-SW01B-09 — Invalid agent id

- If `:nodeId` missing or not an `AIAgent` on the document → redirect to `/`
- Optional `canvasStatus` message (e.g. “Agent not found”)

## BR-SW01B-10 — View mode

- Cannot add or remove skills
- Properties non-mutating / read-only consistent with main builder
- Back and tab navigation still allowed

## BR-SW01B-11 — Properties focus

- Nested selection of skill entry → skill Properties (name/description)
- Clear skill selection / none → agent node Properties (label, etc.)
