# Enso workflow builder (npm library)

Angular 20 workflow builder UI for host apps. Peer Angular / CDK / rxjs / zone.js — the library does not bundle Angular.

`src/lib` is a git symlink to `../../../src/app` so ng-packagr compiles the same sources the SPA uses. Do not replace it with a second copy of the app.

## Build and pack (this repo)

```bash
npm run build:lib
npm run pack:lib
```

That produces `enso-workflow-builder-0.1.0.tgz` under `dist/enso-workflow-builder/`. Install the tarball in a host with `npm install ./path/to/enso-workflow-builder-0.1.0.tgz`.

`npm publish` from `dist/enso-workflow-builder` is a later step (registry auth). Do not publish `src/app/try/` or secrets.

## Host install

See `docs/workflow-builder-ui-embed.md` in this repository.
