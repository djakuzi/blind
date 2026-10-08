import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { printLine } from '../core/terminal.js';

export function registerProjectSection(registry) {
  registry.addSection({
    id: 'project',
    title: 'Project',
    description: 'Project information (additional checks in stage 2)',
  });
  registry.addCommand({
    section: 'project',
    id: 'info',
    description: 'Show project name, version and runtime',
    async run(context, args) {
      if (args.length) throw new Error('Usage: project info');
      const pkg = JSON.parse(await readFile(join(context.root, 'package.json'), 'utf8'));
      printLine(`Project: ${pkg.name}`);
      printLine(`Version: ${pkg.version}`);
      printLine(`Node: ${process.version}`);
      printLine(`Platform: ${process.platform}`);
      return 0;
    },
  });
}
