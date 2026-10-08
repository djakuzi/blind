import { cp, mkdtemp, readdir, readFile, rm, symlink, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { runNpm } from '../core/npm.js';
import { printLine } from '../core/terminal.js';
import * as prettier from 'prettier';

const GENERATORS = [
  { id: 'styles', script: 'app:generate:style-contracts', outputs: ['src/app/shared/styles/contracts'] },
  { id: 'icons', script: 'app:generate:icons-assets', outputs: ['src/core/media/icons/const.ts', 'src/core/media/icons/type.ts'] },
  { id: 'audio', script: 'app:generate:audio-assets', outputs: ['src/core/media/audio/const.ts', 'src/core/media/audio/type.ts'] },
  { id: 'fonts', script: 'app:generate:fonts-woff2', outputs: ['src/assets/fonts'] },
  { id: 'docs', script: 'app:generate:docs-versions', outputs: ['docs/architecture/sections/stack.md', 'docs/projectSetup/index.md'] },
];

async function inventory(root, target) {
  const full = join(root, target);
  let entries;
  try {
    entries = await readdir(full, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOTDIR') return [[target, await readFile(full)]];
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const results = [];
  for (const entry of entries) {
    if (entry.isDirectory()) results.push(...await inventory(root, join(target, entry.name)));
    else if (entry.isFile() && (!target.startsWith('src/assets/fonts') || entry.name.endsWith('.woff2'))) {
      const path = join(target, entry.name);
      results.push([path, await readFile(join(root, path))]);
    }
  }
  return results;
}

async function normalized(source, filepath, content) {
  if (!content || !filepath.endsWith('.ts')) return content;
  const config = (await prettier.resolveConfig(join(source, filepath))) ?? {};
  return Buffer.from(await prettier.format(content.toString('utf8'), {
    ...config,
    filepath: join(source, filepath),
  }));
}

async function compareOutputs(source, temporary) {
  const outputs = [...new Set(GENERATORS.flatMap((item) => item.outputs))];
  const changed = [];
  for (const output of outputs) {
    const oldFiles = new Map(await inventory(source, output));
    const newFiles = new Map(await inventory(temporary, output));
    for (const path of new Set([...oldFiles.keys(), ...newFiles.keys()])) {
      const before = await normalized(source, path, oldFiles.get(path));
      const after = await normalized(source, path, newFiles.get(path));
      if (!before && !after) continue;
      if (!before || !after || !before.equals(after)) changed.push(path);
    }
  }
  return changed.sort();
}

async function generateCheck(context) {
  const temporary = await mkdtemp(join(tmpdir(), 'blind-cli-generate-'));
  try {
    await cp(context.root, temporary, {
      recursive: true,
      filter: (path) => {
        const parts = relative(context.root, path).split(/[\\/]/);
        return !parts.some((part) => ['.git', 'node_modules', 'dist', 'dist-electron', 'release', '.vite'].includes(part));
      },
    });
    try {
      await access(join(context.root, 'node_modules'));
      await symlink(join(context.root, 'node_modules'), join(temporary, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
    } catch {
      printLine('Dependencies are missing. Run npm ci before checking generated files.');
      return 1;
    }
    for (const generator of GENERATORS) {
      printLine(`Checking ${generator.id}...`);
      const code = await runNpm({ ...context, root: temporary }, generator.script);
      if (code !== 0) return code;
    }
    const changed = await compareOutputs(context.root, temporary);
    if (changed.length) {
      printLine('Generated files differ:');
      changed.forEach((path) => printLine(`  ${path}`));
      return 1;
    }
    printLine('Generated files are up to date.');
    return 0;
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

export function registerGenerateSection(registry) {
  registry.addSection({ id: 'generate', title: 'Generate', description: 'Run existing project generators' });
  for (const generator of GENERATORS) {
    registry.addCommand({
      section: 'generate', id: generator.id, description: `Run ${generator.id} generator`,
      async run(context, args) {
        if (args.length) throw new Error(`Usage: generate ${generator.id}`);
        return runNpm(context, generator.script);
      },
    });
  }
  registry.addCommand({
    section: 'generate', id: 'all', description: 'Run all generators',
    async run(context, args) {
      if (args.length) throw new Error('Usage: generate all');
      for (const generator of GENERATORS) {
        printLine(`Generating ${generator.id}...`);
        const code = await runNpm(context, generator.script);
        if (code !== 0) return code;
      }
      return 0;
    },
  });
  registry.addCommand({
    section: 'generate', id: 'check', description: 'Verify generated files without modifying the project',
    async run(context, args) {
      if (args.length) throw new Error('Usage: generate check');
      return generateCheck(context);
    },
  });
}
