# Intent Analysis — Host UI chrome inputs

**Increment**: Host UI chrome inputs (`[ui]`)  
**User confirmation**: "yes" (after asking whether to add Syncfusion-style `[ui]` on shells)

## Intent

Parents should control chrome visibility the way they already pass `[palettes]` / `[defaultAgents]` — property binding on `wb-shell-layout` / `wb-agent-skills-shell` — not only bootstrap `provideWorkflowBuilderUi({ features })` / JSON.

## Example desired API

```html
<wb-shell-layout
  [ui]="ui"
  [palettes]="palettes"
  [defaultAgents]="defaultAgents"
/>
```

with `ui` shaped like the existing `UiFeatures` partial (topBar, libraries, properties, canvas, …).

## Baseline gap

U-UI-01/02 implement flags via `UiConfigService` + DI/JSON only. Shells inject the service; there is no `[ui]` input today.

## Initial assessment

| Field | Value |
|---|---|
| Request type | Enhancement / new feature (brownfield) |
| Clarity | Clear goal; precedence & reactivity need RA questions |
| Scope | Shells + UiConfigService overlay + docs |
| Complexity | Moderate |
| Requirements depth | Standard |
| Reverse engineering | SKIP (same SPA) |
| User stories | Likely (host-facing API + AC) |
