/**
 * After a successful `ng build`, keep dist package.json version aligned with
 * projects/enso-workflow-builder/package.json.
 *
 * This does NOT compile TypeScript. Never use it as a substitute for build:lib.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const srcPath = resolve(root, 'projects/enso-workflow-builder/package.json');
const distPath = resolve(root, 'dist/enso-workflow-builder/package.json');

if (!existsSync(srcPath)) {
  console.error(`Missing source package.json: ${srcPath}`);
  process.exit(1);
}
if (!existsSync(distPath)) {
  console.error(`Missing dist package.json: ${distPath} (run build:lib first)`);
  process.exit(1);
}

const src = JSON.parse(readFileSync(srcPath, 'utf8'));
const dist = JSON.parse(readFileSync(distPath, 'utf8'));
const nextVersion = src.version;

if (typeof nextVersion !== 'string' || !nextVersion.trim()) {
  console.error('Source package.json has no valid version');
  process.exit(1);
}

if (dist.version === nextVersion) {
  console.log(`dist version OK (${nextVersion})`);
  process.exit(0);
}

const previous = dist.version;
dist.version = nextVersion;
writeFileSync(distPath, `${JSON.stringify(dist, null, 2)}\n`);
console.log(`Synced dist version ${previous} → ${nextVersion}`);
