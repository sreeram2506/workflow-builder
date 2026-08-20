# More Changes R62 — Change Requests

**Source**: `more-changes-r62-clarification-questions.md`

## Answers

| Q | Answer |
|---|--------|
| Q1 | B — Properties panel |
| Q2 | C — Full AI-DLC stages |
| Q3 | B — Highest priority first, then pause |

## Scope (from freeform)

Dynamic property configuration and rendering in the existing Angular Workflow Builder library:

- Support known/static properties **and** completely new dynamic properties
- Selected node exposes properties as `Record<string, unknown>` (no predefined key dependency)
- Dynamic Property component renders controls from metadata or value-type inference
- Host (e.g. Enso) supplies config via UI/code or API — **no Enso-specific names/logic in the library**
- Edits flow back to node + consuming app
- New host properties/nodes work without library changes
- Minimal: reuse existing Properties / add Dynamic Property + types

## Disposition

**Not a direct More Changes polish.** Escalated to a new AI-DLC increment: **Dynamic Properties**.

See Requirements Analysis clarifying questions under `aidlc-docs/inception/requirements/`.
