# Tech Stack Decisions — U1

## Locked Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | Angular (latest stable at scaffold time), standalone components | Project constraint |
| State | Angular signals via GraphStore + UiStore + WorkflowFacade | Application design |
| Styling | CSS + CSS custom properties (design tokens); dark default | Visual + theme requirements |
| Scaffold | Angular CLI `ng new` (standalone defaults; CSS; minimal routing as needed) | Q1 = A |
| Package manager | npm | Q9 = A |
| Unit tests | Vitest (Angular Vitest builder / supported integration for chosen Angular) | Q2 = A |
| PBT | `fast-check` | Q3 = A; satisfies PBT-09 |
| Lint / TS | Strict TypeScript + strict templates; ESLint Angular defaults | Q10 = A |
| Drag-drop | Not in U1; later `@angular/cdk/drag-drop` for palette only | Requirements |
| Forms | Not in U1; later `@angular/forms` reactive | Requirements |
| Canvas libs | None — custom SVG+HTML later | Requirements |
| Backend | None | Requirements |
| Persistence | In-memory signals only | Requirements |

## Dependency Intent (U1 Code Generation)

**Runtime**
- `@angular/core`, `@angular/common`, `@angular/platform-browser`, `@angular/router` (if single route still generated)
- Zone or zoneless per Angular version defaults at scaffold time — accept CLI default unless it blocks signals patterns

**Dev**
- Angular CLI / build tooling from `ng new`
- Vitest + Angular testing utilities as configured by chosen builder
- `fast-check` as direct dependency for PBT

**Explicitly excluded in U1**
- `@angular/cdk` (until U3)
- `@angular/forms` (until U5)
- localStorage wrappers
- ngx-vflow / React Flow / other graph libs

## Browser / Platform
- Desktop evergreen only
- No mobile layout goal

## Notes for Code Generation
- Replace existing stub root `package.json` with Angular app package (keep project name `workflow-builder` if possible)
- Application code at workspace root `src/`; docs remain in `aidlc-docs/`
- After U1 code ships, stop for Phase 1 user review before U2
