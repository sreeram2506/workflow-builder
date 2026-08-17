# Application Design Summary — Host UI chrome inputs (`[ui]`)

## Decisions locked

| Q | Answer | Implication |
|---|---|---|
| Q1 | **A** | Shell-local effective merge; no global write |
| Q2 | **A** | Shells + children via effective reader |
| Q3 | **A** | `UI_EFFECTIVE_FEATURES` token at shell |
| Q4 | **A** | Single unit U-HUI-01 |

## Artifacts

- `host-ui-inputs-components.md`
- `host-ui-inputs-component-methods.md`
- `host-ui-inputs-services.md`
- `host-ui-inputs-component-dependency.md`

## Traceability

| FR / Story | Design |
|---|---|
| FR-HUI-01..03 · US-HUI-01/02/04 | `ui` input + merge + full partial |
| FR-HUI-04..06 · US-HUI-03 | computed effective + token consumers |
| FR-HUI-05 · US-HUI-01 isolation | no global service mutation |
| FR-HUI-07 | embed + README |

## Next

Units Generation → Construction (FD → CG → Build/Test). NFR/Infra skipped.
