# Component Methods — Solution Workflow Increment

High-level signatures only. Business rules detailed in Functional Design.

---

## WorkflowFacade (extend)

```ts
openAgentTab(nodeId: string): void
// Ensure tab exists for AIAgent nodeId; focus tab; do not navigate

selectAgentTab(nodeId: string): void
// Focus tab and navigate to /agent/:nodeId

closeAgentTab(nodeId: string): void // optional P0+P1
// Remove tab; if viewing that agent, navigate Back to solution

navigateBackToSolution(): void
// Router → solution; restore selection on last agent when practical

addSkillToAgent(agentNodeId: string, skillId: string): void
// Append from mock catalog into node.data.skills (no-op in view mode)

removeSkillFromAgent(agentNodeId: string, skillId: string): void // if in scope
// Remove from data.skills (no-op in view mode)

agentSkills(agentNodeId: string): readonly SkillRef[]
// Read ordered skills from document node data
```

## UiStore / tab state (extend or small AgentUiStore)

```ts
openAgentTabs(): readonly { nodeId: string; label: string }[]
focusedAgentTabId(): string | null
setOpenAgentTabs(...): void
```

## WorkflowNodeComponent (extend)

```ts
onNodeDblClick(event: MouseEvent): void
// If type === AIAgent → facade.openAgentTab(id); prevent unintended text select
```

## AgentTabsStrip / TopBar

```ts
onTabSelect(nodeId: string): void  // → facade.selectAgentTab
onBack(): void                     // → facade.navigateBackToSolution
```

## NestedSkillsLibraryComponent

```ts
skillsCatalog(): readonly MockSkill[]
onAddSkill(skillId: string): void  // → facade.addSkillToAgent(routeNodeId, skillId)
```

## NestedSkillsPanelComponent

```ts
selectedSkills(): readonly SkillRef[]
onSelectSkillEntry(skillId: string): void
onRemoveSkill(skillId: string): void // optional
```

## Domain pure helpers (new)

```ts
ensureSkillsArray(data: Record<string, unknown>): SkillRef[]
appendSkill(skills: SkillRef[], skill: MockSkill): SkillRef[]  // dedupe policy in FD
filterMockSkills(catalog: MockSkill[], query: string): MockSkill[]
```

---

**Note**: Router `ActivatedRoute` param `nodeId` is the open Blank Agent id for nested components.
