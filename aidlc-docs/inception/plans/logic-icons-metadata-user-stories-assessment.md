# User Stories Assessment — Host logic extras + agent metadata

## Request Analysis
- **Original Request**: Extra Condition / Router / Repeater with icons; default agents support metadata besides label
- **User Impact**: Direct — host embed API and workflow-author library (featured strip, card icons, dropped node data)
- **Complexity Level**: Medium
- **Stakeholders**: Host integrator, workflow author, library maintainer

## Assessment Criteria Met
- [x] High Priority: New user-facing library behavior; host-facing catalog API; UX change to featured strip
- [x] Medium Priority: Integration (parent `[palettes]` / `[defaultAgents]`); data on dropped nodes
- [x] Benefits: Shared AC for replace-vs-omit, icon fallback, metadata persist; testable slices per FR

## Decision
**Execute User Stories**: Yes

**Reasoning**: Hosts and authors see different outcomes (strip contents, icons, node `data.metadata`). Stories give INVEST slices and Gherkin AC before design/code. Not a refactor or isolated bugfix.

## Expected Outcomes
- Personas P-HOST / P-AUTHOR mapped to each story
- Traceability FR-LIM-01..10 ↔ US
- Acceptance criteria covering omit vs present palettes, unsafe URLs, drop metadata
