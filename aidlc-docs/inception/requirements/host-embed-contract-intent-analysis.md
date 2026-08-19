# Intent Analysis — Host embed contract (gaps, not package publish)

**Timestamp**: 2026-08-19T07:44:00Z  
**User request**: Fix embed/host gaps first; think about package publish later.

| Item | Assessment |
|---|---|
| **Clarity** | Direction clear (no ng-packagr). Which gaps in this increment need a lock |
| **Type** | Enhancement (brownfield embed contract) |
| **Scope** | Shells + facade persistence/actions + layout; not npm publish |
| **Complexity** | Moderate (I/O + events + CSS host fill) |
| **Depth** | Standard |

## Today

- Hosts can set chrome (`[ui]`), palettes, Properties schema, catalog adapter.
- There is **no** `[document]` / `(documentChange)`. Save is `saveDownload()` (blob). Autosave is in-memory.
- Run is simulated in-process.
- Shells use `height: 100vh` (fights a host panel).
- Unknown Properties widgets are disabled text. Repeater option lists are empty. Graph publish-validation and a real run adapter are absent.
- `src/app/try/` is local-only.

## Proposed intent

Keep this a SPA with embeddable shells. Close the **host contract** gaps so a parent app can load a graph, hear Save/Run, and size the canvas to a panel. **Do not** ng-packagr / npm publish in this increment.

Exact slice is Question 1.
