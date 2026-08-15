# Frontend Components — U-SW-01b Nested Agent Skills

## Hierarchy

```text
App
  RouterOutlet
    ShellLayout (solution)     route: /
      TopBar (tabs; no Back)
      LeftSidebar | Canvas | RightSidebar

    ShellLayout or AgentShell  route: /agent/:nodeId
      TopBar (tabs + Back)
      NestedSkillsLibrary | NestedSkillsPanel | RightSidebar
```

Prefer: one `ShellLayout` that swaps center/left content by route, **or** thin `AgentSkillsPageComponent` as dedicated nested children (AD Q4=B).

---

## Component specs

### App / routes

| Concern | Behavior |
|---|---|
| `provideRouter` | Add `@angular/router`; routes `/` and `/agent/:nodeId` |
| Bootstrap | Keep facade.initialize on app init |

### TopBar (extend)

| Concern | Behavior |
|---|---|
| Tab click | `facade.selectAgentTab(nodeId)` → navigate `/agent/:nodeId` |
| Back | Visible on agent route → `facade.navigateBackToSolution()` |
| Tabs | Still shown on nested route |

### NestedSkillsLibraryComponent

| Concern | Behavior |
|---|---|
| List | 5 mock skills; optional search |
| Add | Click/button → `facade.addSkillToAgent(routeNodeId, skillId)` |
| View | Disabled add |

### NestedSkillsPanelComponent

| Concern | Behavior |
|---|---|
| Bind | `facade.agentSkills(nodeId)` |
| Select | Sets selected skill for Properties |
| Remove | × → `facade.removeSkillFromAgent` (edit only) |

### RightSidebar (reuse)

| Concern | Behavior |
|---|---|
| Nested | If `selectedSkillId` → skill fields; else agent node schema |
| View | Read-only |

### WorkflowFacade (extend)

| Method | Behavior |
|---|---|
| `selectAgentTab(nodeId)` | Focus tab + Router navigate |
| `navigateBackToSolution()` | `/` + select agent |
| `addSkillToAgent` / `removeSkillFromAgent` | Patch `data.skills`; view-locked |
| `agentSkills(nodeId)` | Read helper |
| Guard invalid route | Redirect `/` |

---

## Story coverage

| Story | Coverage |
|---|---|
| US-SW-02 | Tab → nested route + shell |
| US-SW-03 | Catalog + add to list |
| US-SW-04 | Back + `data.skills` persist |
| US-SW-05 | Properties + view locks |
