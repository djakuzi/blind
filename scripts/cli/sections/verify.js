import { runNpm } from '../core/npm.js';
import { printLine } from '../core/terminal.js';

const CHECKS = [
  { id: 'format', name: 'Prettier', script: 'format:check' },
  { id: 'lint', name: 'ESLint', script: 'lint' },
  { id: 'web', name: 'Web build and TypeScript', script: 'build' },
  { id: 'desktop', name: 'Desktop build and TypeScript', script: 'desktop:build' },
];

function assertNoArgs(args, command) {
  if (args.length) throw new Error(`Usage: ${command}`);
}

async function checkAll(context, args, runGeneratedCheck) {
  assertNoArgs(args, 'verify all');
  let failures = 0;
  for (const item of CHECKS) {
    if (context.signal.aborted) return 130;
    printLine(`\nChecking ${item.name}...`);
    const code = await runNpm(context, item.script);
    if (code === 130) return 130;
    printLine(`${item.name}: ${code === 0 ? 'PASS' : `FAIL (exit ${code})`}`);
    if (code !== 0) failures += 1;
  }
  printLine('\nChecking generated files...');
  const code = await runGeneratedCheck(context, []);
  if (code === 130) return 130;
  printLine(`Generated files: ${code === 0 ? 'PASS' : `FAIL (exit ${code})`}`);
  if (code !== 0) failures += 1;
  printLine(`\nVerification: ${failures ? `${failures} failed` : 'all passed'}`);
  return failures ? 1 : 0;
}

export function registerVerifySection(registry) {
  registry.addSection({ id: 'verify', title: 'Verify', description: 'Read-only quality and build checks' });
  for (const item of CHECKS) {
    registry.addCommand({
      section: 'verify',
      id: item.id,
      description: `Check ${item.name}`,
      async run(context, args) {
        assertNoArgs(args, `verify ${item.id}`);
        return runNpm(context, item.script);
      },
    });
  }

  const generated = registry.find(['generate', 'check']);
  if (!generated) throw new Error('Generate section must be registered before Verify.');
  registry.addCommand({
    section: 'verify', id: 'generated', description: 'Check generated files',
    async run(context, args) {
      assertNoArgs(args, 'verify generated');
      return generated.run(context, []);
    },
  });
  registry.addCommand({
    section: 'verify', id: 'all', description: 'Run every quality check',
    run: (context, args) => checkAll(context, args, generated.run),
  });

  registry.addSection({ id: 'fix', title: 'Fix', description: 'Explicit formatting and lint repairs' });
  for (const item of [
    { id: 'format', script: 'format', description: 'Run Prettier --write' },
    { id: 'lint', script: 'lint:fix', description: 'Run ESLint --fix' },
  ]) {
    registry.addCommand({
      section: 'fix', id: item.id, description: item.description,
      async run(context, args) {
        assertNoArgs(args, `fix ${item.id}`);
        return runNpm(context, item.script);
      },
    });
  }
  registry.addCommand({
    section: 'fix', id: 'all', description: 'Run Prettier --write then ESLint --fix',
    async run(context, args) {
      assertNoArgs(args, 'fix all');
      for (const script of ['format', 'lint:fix']) {
        const code = await runNpm(context, script);
        if (code !== 0) return code;
      }
      return 0;
    },
  });
}
