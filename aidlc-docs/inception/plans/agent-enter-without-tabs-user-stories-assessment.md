# User Stories Assessment — Enter agent without tab bar

## Request Analysis
- **Original Request**: Enter nested agent via tab bar or double-click; both must work when the agent bar is hidden
- **User Impact**: Direct (canvas dblclick, nested back chrome)
- **Complexity Level**: Simple–medium
- **Stakeholders**: Host integrator, workflow author, reviewer

## Assessment Criteria Met
- [x] High Priority: New / changed user workflow (enter and leave nested agent)
- [x] High Priority: UX change when `agentTabs.enabled` is false
- [x] Benefits: Shared AC for enter/exit; testable Gherkin for chrome flag vs routing

## Decision
**Execute User Stories**: Yes  
**Reasoning**: Two entry paths plus a new nested Back control are user-visible. Stories keep tab-bar chrome separate from nested routing.

## Expected Outcomes
- AC for double-click with bar off
- AC that chips still work with bar on
- AC for Back/Solution when the strip is not mounted
- AC that select/drop does not accumulate chips when the bar is off
