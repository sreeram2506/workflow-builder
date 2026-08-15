# Business Rules — U-SW-01a Palette + Agent Tabs

## BR-SW01A-01 — Blank Agent palette placement

- Featured strip types remain `Condition`, `Decision` (Router), `Repeater` only
- Blank Agent is **not** a fourth featured-strip CDK item
- Blank Agent appears as a **separate card row directly under** the featured strip
- Catalog: include `AIAgent` in `PALETTE_ITEMS` (category may be `logic` or `agent`); UI must not list it again inside category lists if that would duplicate the below-strip card (exclude from category loops the same way featured types are excluded)

## BR-SW01A-02 — Blank Agent create

- Drag or click-to-add creates `type: 'AIAgent'`, default `label: 'Blank Agent'`, `data: {}` (or existing factory defaults)
- Copy-on-create: palette entry remains available after create
- Edit mode only for create (existing palette view-mode lock)

## BR-SW01A-03 — Tab open on double-click

- Only `node.type === 'AIAgent'` opens/focuses tabs
- Other node types: ignore dblclick (no new behavior)
- Single-click: unchanged select + Properties
- Dblclick does **not** navigate to nested route in this unit

## BR-SW01A-04 — Tab identity and focus

- One tab per `nodeId` (no duplicates)
- Re-dblclick existing → **focus** that tab
- Focused tab is the single “active” tab in the strip (visual state only in P0)

## BR-SW01A-05 — Maximum 5 tabs (FIFO)

- `MAX_AGENT_TABS = 5`
- Opening a new tab when already at 5: **remove the oldest tab by `openedAt`** (FIFO), then append the new tab and focus it
- Focusing an existing tab does **not** change `openedAt` (FIFO = open order, not LRU)

## BR-SW01A-06 — Tab label

- Display label = current `WorkflowNode.label` for that `nodeId`
- Default node label `"Blank Agent"` until renamed
- When node label is patched, tab title updates

## BR-SW01A-07 — Tab close

- Each tab has an explicit **×** control in P0
- Close removes tab only; node remains on canvas
- Closing focused tab: focus newest remaining by `openedAt`, or clear focus if none

## BR-SW01A-08 — View mode

- In view mode: **cannot** create Blank Agent from palette (existing lock)
- In view mode: **may** dblclick AIAgent to open/focus tab; **may** close tabs
- Tabs are chrome, not document mutations

## BR-SW01A-09 — Deleted / missing node

- If an AIAgent node is deleted while its tab is open: remove that tab (or on next render skip missing nodeIds)
- Prefer immediate cleanup when node removed from document

## BR-SW01A-10 — Persistence of tabs

- Open tabs are **session UI state** (not part of WorkflowDocument)
- Refresh clears tabs (acceptable in P0)
