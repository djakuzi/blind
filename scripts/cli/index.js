#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createContext } from './core/context.js';
import { createRegistry } from './core/registry.js';
import { runCli } from './core/command.js';
import { printError } from './core/terminal.js';
import { registerProjectSection } from './sections/project.js';
import { registerDevelopmentSection } from './sections/development.js';
import { registerPlatformSection } from './sections/platform.js';
import { registerBuildSection } from './sections/build.js';
import { registerGenerateSection } from './sections/generate.js';
import { registerVerifySection } from './sections/verify.js';
import { registerLocalizationSection } from './sections/localization.js';
import { registerGitSection } from './sections/git.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const controller = new AbortController();
process.once('SIGINT', () => controller.abort());
process.once('SIGTERM', () => controller.abort());

try {
  const registry = createRegistry();
  registerProjectSection(registry);
  registerDevelopmentSection(registry);
  registerPlatformSection(registry);
  registerBuildSection(registry);
  registerGenerateSection(registry);
  registerVerifySection(registry);
  registerLocalizationSection(registry);
  registerGitSection(registry);
  const context = createContext({ root, signal: controller.signal });
  process.exitCode = await runCli(registry, context, process.argv.slice(2));
} catch (error) {
  printError(error);
  process.exitCode = controller.signal.aborted ? 130 : 1;
}
