#!/usr/bin/env node
/**
 * Single entry for publishing enso-workflow-builder.
 *
 * Guarantees: Node is new enough → fresh ng build → dist version matches source →
 * compiled .mjs is newer than sources and contains expected UI markers → then publish.
 *
 * Usage (repo root):
 *   nvm use 22
 *   # bump projects/enso-workflow-builder/package.json version
 *   npm run publish:lib
 *   npm run publish:lib -- --otp=123456
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const srcPkgPath = resolve(root, 'projects/enso-workflow-builder/package.json');
const distDir = resolve(root, 'dist/enso-workflow-builder');
const distPkgPath = resolve(distDir, 'package.json');
const fesmDir = resolve(distDir, 'fesm2022');

/** Strings that must appear in the compiled bundle when current UI source is built. */
const REQUIRED_BUNDLE_MARKERS = [
  'no-status',
  'wrap-2',
  'palette-initials',
];

function run(title, command, args) {
  console.log(`\n→ ${title}`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });
  if (result.status !== 0) {
    console.error(`\nFAILED: ${title} (exit ${result.status ?? 'unknown'})`);
    process.exit(result.status ?? 1);
  }
}

function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

// 1) Node gate
run('Check Node version', process.execPath, [resolve(root, 'scripts/check-node-for-lib.mjs')]);

if (!existsSync(srcPkgPath)) {
  fail(`Missing ${srcPkgPath}`);
}
const srcVersion = JSON.parse(readFileSync(srcPkgPath, 'utf8')).version;
console.log(`\nPublishing enso-workflow-builder@${srcVersion} (from source package.json)`);

// 2) Always rebuild — never publish whatever happens to sit in dist/
run('Build library (ng-packagr)', 'npx', ['ng', 'build', 'enso-workflow-builder']);
run('Sync dist version', process.execPath, [resolve(root, 'scripts/ensure-lib-version.mjs')]);
run('Assert bundle fresh vs sources', process.execPath, [
  resolve(root, 'scripts/assert-lib-bundle-fresh.mjs'),
]);

// 3) Verify compiled JS actually contains current UI (catches empty/stale/wrong build)
if (!existsSync(fesmDir)) {
  fail(`Missing ${fesmDir} after build`);
}
const mjsName = readdirSync(fesmDir).find((f) => f.endsWith('.mjs') && !f.endsWith('.map'));
if (!mjsName) {
  fail('No fesm2022 .mjs after build');
}
const mjsPath = resolve(fesmDir, mjsName);
const mjsText = readFileSync(mjsPath, 'utf8');
const missing = REQUIRED_BUNDLE_MARKERS.filter((m) => !mjsText.includes(m));
if (missing.length > 0) {
  fail(
    `Built bundle is missing expected UI markers: ${missing.join(', ')}\n` +
      `File: ${mjsPath}\n` +
      `The published package would not include your latest canvas/palette changes.\n` +
      `Check that projects/enso-workflow-builder/src/lib → src/app symlink is intact and rebuild.`,
  );
}

const distVersion = JSON.parse(readFileSync(distPkgPath, 'utf8')).version;
if (distVersion !== srcVersion) {
  fail(`After build, dist version ${distVersion} !== source ${srcVersion}`);
}

const sha256 = createHash('sha256').update(mjsText).digest('hex');
const meta = {
  name: 'enso-workflow-builder',
  version: srcVersion,
  builtAt: new Date().toISOString(),
  bundle: mjsName,
  bundleSha256: sha256,
  markers: REQUIRED_BUNDLE_MARKERS,
};
writeFileSync(resolve(distDir, 'build-meta.json'), `${JSON.stringify(meta, null, 2)}\n`);
console.log(`\nBuild meta written (bundle sha256=${sha256.slice(0, 16)}…)`);

// 4) Publish only this freshly built dist/
const extraArgs = process.argv.slice(2);
run('npm publish dist/enso-workflow-builder', 'npm', [
  'publish',
  distDir,
  '--access',
  'public',
  ...extraArgs,
]);

console.log(`\nPublished enso-workflow-builder@${srcVersion}`);
console.log(`In the host app, install exactly this version:\n  npm install enso-workflow-builder@${srcVersion}`);
console.log('Reinstalling an older same version will NOT pick up new code.');
