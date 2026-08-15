# Services — Solution Workflow Increment

Additive service/domain design. Prefer thin services + pure domain modules (existing pattern).

---

## Service / module catalog

| ID | Name | Kind | Responsibility |
|---|---|---|---|
| S-SW-CATALOG | `mock-skills.catalog.ts` | domain pure | Static mock developed skills (id, name, description) |
| S-SW-SKILLS | `agent-skills.ts` | domain pure | Read/write/normalize `data.skills` arrays; dedupe helpers |
| S-SW-FACADE | `WorkflowFacade` (extend) | facade | Tabs, navigate Back/select tab, add/remove skill, view-mode gates |
| S-SW-ROUTER | Angular `Router` + routes | platform | `/` solution shell; `/agent/:nodeId` nested skills shell |
| S-SW-GRAPH | `GraphStore` (reuse) | store | Solution document remains source of truth; skill patches update AIAgent node data |
| S-SW-UI | `UiStore` (extend) | store | Open agent tabs list + focus; selection restore after Back |
| S-SW-SER | Serialization (reuse) | service | Opaque `node.data` already clones `skills` if present |

---

## Orchestration patterns

### Open path (tab-first)

1. User dblclicks Blank Agent → `openAgentTab(nodeId)` updates UiStore tabs (no route change).
2. User selects tab → `selectAgentTab(nodeId)` → `Router.navigate(['/agent', nodeId])`.
3. Nested components read `nodeId` from route; bind skills via facade → GraphStore document.

### Add skill

1. Nested library emits skillId → `addSkillToAgent` (edit mode only).
2. Pure helper appends to `data.skills` → GraphStore patches node (history/autosave per existing rules).

### Back

1. Top bar Back → `navigateBackToSolution()` → `Router.navigate(['/'])` (or solution path).
2. Facade selects/focuses the Blank Agent node when practical.
3. Tab may remain open for re-entry (Functional Design default: keep tab).

---

## Non-goals

- Live Enso skills HTTP client
- Separate document store for nested graphs (no nested graph in this increment)
