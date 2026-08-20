# More Changes R62 — Clarification Questions

**Superseded**: Scope narrowed to **dblclick-as-config**. Answer  
`aidlc-docs/inception/requirements/requirement-verification-questions.md` instead.

**Context**: The npm-package increment (U-NP-01) and post-ops polish are complete (sticky `[ui]` so nested agent chrome stays tab-strip-off; dblclick enter; pointer-capture delay). R61 already shipped matching handle colors and agent name centering when description is empty. `enso-workflow-builder@0.1.1` is built but not published (npm 2FA OTP). You requested changes after More Changes closed at R61 (Done). Recent discussion covered host-driven Properties (U-HP-01 complete; custom widgets / `[properties]` input deferred).

Fill each `[Answer]:`, then reply in chat when done (e.g. `answered`).

**Live UI**: hard-refresh local `npm start`  
**Reference**: https://app.workflowbuilder.io/

---

## Question 1 — What is wrong / incomplete?

Pick all that apply (comma-separated letters OK).

A) **Condition / Router / Repeater** (canvas shapes, glyphs, handles)

B) **Properties panel** (General / host schema / Save / built-ins / edge props)

C) **Logic node Properties** (fields, connector panel, validation, save)

D) **Host Properties deferred items** (custom `ui_component` widgets, `[properties]` input, `ensoTask`→`taskMeta` migrate)

E) **Nodes Library** (featured strip / search / scroll / drag / agent cards)

F) **Top bar / theme / view mode / agent tabs (or no-tabs chrome)**

G) **Canvas overlay chrome** (Save/Export/Import/Run/Reset / undo/redo / layout / zoom)

H) **Connection rules / edges / handles**

I) **Solution Workflow / agents / skills / nested canvas / enter agent**

J) **Package / embed / try host / library publish / docs** (including finishing `0.1.1` with OTP; `provideWorkflowBuilderUi`, embed guide)

K) Something else

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2 — How should we proceed?

A) **Direct implement** after you list concrete fixes in the freeform block

B) Lightweight plan + your approval, then implement

C) Full AI-DLC stages

X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 3 — Priority if multiple items?

A) Fix everything listed in freeform in one pass

B) Highest-priority item first (name it in freeform), then pause for review

C) You will order them in freeform (1 = first)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Optional freeform
Describe what you see vs what you want (bullets). Attach a screenshot if helpful:

```text
Implement dynamic property configuration and rendering in the existing Workflow Builder Angular library without breaking the current static workflow functionality. The library should support both known/static properties and completely new dynamic properties. The selected node should expose properties as dynamic key-value pairs (Record<string, unknown>) so the library does not depend on predefined property keys. Modify the existing Properties component to iterate through all properties dynamically and add a Dynamic Property component responsible for rendering the correct UI control. Known properties can receive optional configuration/metadata such as label, control type, options, and validation rules; for unknown properties without metadata, infer the UI from the value type (string → textbox, number → number input, boolean → toggle, etc.). Configuration should be provided by the consuming application such as Enso and may come from either UI/code configuration or an API. The library must not contain Enso-specific property names or API logic. When a user edits a property, the updated value must flow back to the selected node and consuming application. New properties and new nodes introduced by the consuming application should work without requiring changes to the Workflow Builder library. Keep the implementation minimal by reusing the existing Workflow Builder and Properties components and adding only the Dynamic Property component and required interfaces/types.
```
