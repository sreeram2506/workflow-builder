/**
 * Angular library build requires Node 20.19+ / 22.12+.
 * On Node 18, `ng build` fails and a stale dist/ is easy to publish by mistake.
 */
const major = Number(process.versions.node.split('.')[0]);
const minor = Number(process.versions.node.split('.')[1] ?? 0);

const ok =
  (major === 20 && minor >= 19) ||
  major === 21 ||
  (major === 22 && minor >= 12) ||
  major >= 23;

if (!ok) {
  console.error(
    `Node ${process.versions.node} is too old for enso-workflow-builder.\n` +
      `Use Node 20.19+ or 22.12+ (e.g. \`nvm use 22\`), then:\n` +
      `  npm run build:lib\n` +
      `  npm run publish:lib\n` +
      `Do not publish dist/ after a failed build — it still contains the previous bundle.`,
  );
  process.exit(1);
}

console.log(`Node ${process.versions.node} OK for library build`);
