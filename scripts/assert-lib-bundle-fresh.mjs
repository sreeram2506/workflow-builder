/**
 * Fail if the compiled library bundle is older than app sources.
 * Bumping package.json / ensure-lib-version alone does NOT refresh the .mjs —
 * only `ng build enso-workflow-builder` does.
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const srcPkgPath = resolve(root, 'projects/enso-workflow-builder/package.json');
const distPkgPath = resolve(root, 'dist/enso-workflow-builder/package.json');
const distDir = resolve(root, 'dist/enso-workflow-builder/fesm2022');
const sourceRoots = [
  resolve(root, 'src/app'),
  resolve(root, 'projects/enso-workflow-builder/package.json'),
];

function walkFiles(dir, out = []) {
  if (!existsSync(dir)) {
    return out;
  }
  const st = statSync(dir);
  if (st.isFile()) {
    out.push(dir);
    return out;
  }
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'try' || name.startsWith('.')) {
      continue;
    }
    walkFiles(join(dir, name), out);
  }
  return out;
}

function newestMtimeMs(paths) {
  let max = 0;
  let newest = null;
  for (const p of paths) {
    const files = walkFiles(p).filter((f) => /\.(ts|html|css|scss|json)$/.test(f));
    for (const f of files) {
      const m = statSync(f).mtimeMs;
      if (m > max) {
        max = m;
        newest = f;
      }
    }
  }
  return { max, newest };
}

if (!existsSync(srcPkgPath) || !existsSync(distPkgPath)) {
  console.error('Missing source or dist package.json — run `npm run build:lib` first.');
  process.exit(1);
}

const srcVer = JSON.parse(readFileSync(srcPkgPath, 'utf8')).version;
const distVer = JSON.parse(readFileSync(distPkgPath, 'utf8')).version;
if (srcVer !== distVer) {
  console.error(
    `Version mismatch: source=${srcVer} dist=${distVer}. Run \`npm run build:lib\` (do not only bump version).`,
  );
  process.exit(1);
}

if (!existsSync(distDir)) {
  console.error(`Missing ${distDir} — library was not built.`);
  process.exit(1);
}

const bundles = readdirSync(distDir).filter((f) => f.endsWith('.mjs') && !f.endsWith('.map'));
if (bundles.length === 0) {
  console.error('No .mjs bundle in dist fesm2022 — build failed or incomplete.');
  process.exit(1);
}

const bundlePath = join(distDir, bundles[0]);
const bundleStat = statSync(bundlePath);
const { max: sourceNewest, newest: newestFile } = newestMtimeMs(sourceRoots);

// Allow 2s skew for filesystem clocks; bundle must not be older than sources.
if (bundleStat.mtimeMs + 2000 < sourceNewest) {
  console.error(
    `Stale library bundle detected.\n` +
      `  Bundle: ${bundlePath}\n` +
      `  Bundle mtime: ${new Date(bundleStat.mtimeMs).toISOString()}\n` +
      `  Newer source: ${newestFile}\n` +
      `  Source mtime: ${new Date(sourceNewest).toISOString()}\n` +
      `ensure-lib-version.mjs only copies the version string — it does not compile.\n` +
      `Fix: nvm use 22 && npm run build:lib && npm run publish:lib`,
  );
  process.exit(1);
}

const hash = createHash('sha256').update(readFileSync(bundlePath)).digest('hex').slice(0, 12);
console.log(
  `Library bundle OK — version ${distVer}, ${bundles[0]} sha256=${hash}… (${bundleStat.size} bytes)`,
);
