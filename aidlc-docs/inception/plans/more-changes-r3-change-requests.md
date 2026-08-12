# More Changes R3 — Change Requests (direct implement)

**Source**: `more-changes-r3-clarification-questions.md`  
**Process**: Q4=A direct implement

## Checklist

- [x] Avatar initials from node **label** (Complete→CO, Enrich Payload→EP, …)
- [x] Connection handles on **left / top / bottom / right**; hit-test + facing ports for edges
- [x] Larger layout gaps so connectors stay visible (V/H/Layered)
- [x] Per-type SVG icons on canvas nodes + Nodes Library
- [x] Distinct Condition/Decision shape (diamond accent + angled tint; handles stay hittable)

## Files touched

- `node-visuals.ts` / `.spec.ts`
- `viewport.math.ts` / `.spec.ts` (`facingPorts`, `smoothEdgePath`, `portOnSide`)
- `connection.math.ts`, `edge-routing.ts`, `layout.math.ts`
- `workflow-node.component.ts`, `graph-renderer.component.ts`
- `left-sidebar.component.ts`
