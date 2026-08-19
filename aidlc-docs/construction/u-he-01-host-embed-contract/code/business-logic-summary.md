# Business Logic Summary — U-HE-01 Host embed contract

**Stories**: US-HE-01, US-HE-02, US-HE-03  
**FR**: FR-HE-01..07

## Parse

- `parseWorkflowUnknown(raw)` allowlists and validates host objects.
- Missing `schemaVersion` defaults to `WORKFLOW_SCHEMA_VERSION` so `getDocument()` round-trips through `[document]`.
- `parseWorkflowJson` is JSON.parse + `parseWorkflowUnknown`. Invalid input never throws.

## Facade

- `loadDocument` — fail-safe: keep last good graph + canvas error.
- `getDocument` — structured clone of the **solution** document; flushes nested canvas first.
- `dirty` (`hostDirty`) — separate from autosave debounce; false after load/Save; true after committed edits; pan does not set it.
- `requestSave` / `requestRun` — first-win: bound shell `(save)`/`(run)` → provider `persist` → `saveDownload` / `startRun`.
- Default Save still marks saved + toast (Export remains the blob).

## Persist

- `provideWorkflowBuilderUi({ persist: { save, run } })` optional token `WORKFLOW_BUILDER_PERSIST`.
