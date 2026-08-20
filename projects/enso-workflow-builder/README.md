# Enso workflow builder (npm library)

Angular 20 workflow builder UI for host apps. Peer Angular / CDK / rxjs / zone.js — the library does not bundle Angular.

`src/lib` is a git symlink to `../../../src/app` so ng-packagr compiles the **same** `src/app` sources the SPA uses. Your canvas/palette changes under `src/app/...` are what get published.

## Publish so the version includes your latest code

**Always use Node 22** (`nvm use 22`). On Node 18 the build fails and an old `dist/` can be published by mistake.

```bash
cd /Users/trivenigogireddy/Work/workflow-builder
nvm use 22

# 1) Bump a NEW version every release (npm never overwrites 0.1.6 once published)
#    edit: projects/enso-workflow-builder/package.json → "version": "0.1.8"

# 2) Build + verify + publish in one step (required path)
npm run publish:lib
# with 2FA OTP if needed:
npm run publish:lib -- --otp=123456
```

`publish:lib` always:

1. Checks Node version  
2. Runs a full `ng build enso-workflow-builder` (recompiles `fesm2022/*.mjs`)  
3. Syncs version into dist  
4. Fails if the bundle is older than sources or missing UI markers  
5. Publishes **only** that fresh `dist/enso-workflow-builder`

Do **not** run `npm publish` from `projects/` or from a leftover `dist/` folder.

## Install in enso-suite (or any host)

```bash
npm install enso-workflow-builder@0.1.8   # exact new version
# restart ng serve + hard-refresh browser
```

Confirm what you got:

```bash
npm ls enso-workflow-builder
cat node_modules/enso-workflow-builder/package.json | grep version
cat node_modules/enso-workflow-builder/build-meta.json   # if present
```

Same version number = same immutable tarball on npm. New code ⇒ new version ⇒ reinstall that version.

## Local tarball (optional)

```bash
npm run pack:lib
# host package.json:
# "enso-workflow-builder": "file:../workflow-builder/dist/enso-workflow-builder/enso-workflow-builder-0.1.8.tgz"
```

## Host docs

See `docs/workflow-builder-ui-embed.md` in this repository.
