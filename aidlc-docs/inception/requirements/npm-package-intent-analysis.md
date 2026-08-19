# Intent Analysis — npm package publish

| Field | Value |
|---|---|
| **User request** | Publish this as an npm package |
| **Request type** | Enhancement (brownfield) — packaging / library extract |
| **Scope** | ng-packagr (or equivalent) library + public API + pack/publish path |
| **Complexity** | Moderate–high (library extract, peerDeps, styles/assets, SPA kept as demo) |
| **Requirements depth** | Standard |
| **Increment name** | npm package publish |
| **Clarity** | Locked |
| **Answers** | Q1=A · Q2=A · Q3=X (`enso-workflow-builder`) · Q4=A · Q5=A · Q6=A · Q7=A · Q8=B |

## Notes

Host embed contract (U-HE-01) is COMPLETE. This increment was explicitly deferred then. Today the repo is an Angular **application** (`private: true`, no `ng-package.json`). Hosts currently copy/import from source (`docs/workflow-builder-ui-embed.md`).

Reverse Engineering: SKIP (scoped packaging increment; same as prior brownfield increments; no RE artifacts).
