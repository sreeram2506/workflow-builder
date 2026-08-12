# Domain Entities — U8 Simulated Run & View Mode

## Carried forward
| Entity | Use |
|---|---|
| `EditorMode` | `edit` \| `view` on UiStore |
| `NodeStatus` | `idle` \| `running` \| `success` \| `error` |
| `WorkflowNode` / edges | Graph for BFS walk |

## New concepts

### RunSimulationState
| Field | Meaning |
|---|---|
| `active` | Simulation in progress |
| `order` | Node id visit list |
| `index` | Current step |
| `timerIds` | Pending timeouts (for Stop) |

### RunWalkHelpers (pure)
| API | Role |
|---|---|
| `computeRunOrder(nodes, edges)` | BFS seed order |
| `findRunSeeds(nodes, edges)` | Trigger ∪ indegree-0 |

### Services (logical)
| Name | Role |
|---|---|
| RunSimulationService (or facade-owned) | Start/stop/step timers; patch statuses via store with skipHistory |

## Explicitly not
- Execution logs persistence
- Branch predicate engine
- Remote run jobs
