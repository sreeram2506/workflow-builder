# More Changes R54 — Change Requests

**Source**: `more-changes-r54-clarification-questions.md`  
**Answers**: Q1=F · Q2=A · Q3=A  
**Freeform**: remove route not needed

## Scope

| ID | Request | Status |
|----|---------|--------|
| R54-1 | Remove unused Angular Router (empty routes; single-shell app) | Done |

## Notes

- Deleted `src/app/app.routes.ts`
- Removed `provideRouter` from `app.config.ts`
- Removed `@angular/router` from `package.json` (run `npm install` if lockfile still lists it)
- Canvas edge “route” / Router node type unchanged
