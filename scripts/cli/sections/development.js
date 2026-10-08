import { runNpm } from '../core/npm.js';

export function registerDevelopmentSection(registry) {
  registry.addSection({
    id: 'dev',
    title: 'Development',
    description: 'Run Vite or Electron in development mode',
  });
  registry.addCommand({
    section: 'dev',
    id: 'web',
    description: 'Start Web: [--mode debug|prod]',
    async run(context, args) {
      const mode = args.length === 0 ? 'debug' : args.length === 2 && args[0] === '--mode' ? args[1] : null;
      if (!['debug', 'prod'].includes(mode)) throw new Error('Usage: dev web [--mode debug|prod]');
      return runNpm(context, mode === 'prod' ? 'dev:prod' : 'dev:debug');
    },
  });
  registry.addCommand({
    section: 'dev',
    id: 'desktop',
    description: 'Start Electron development',
    async run(context, args) {
      if (args.length) throw new Error('Usage: dev desktop');
      return runNpm(context, 'desktop:dev');
    },
  });
}
