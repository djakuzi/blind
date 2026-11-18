import { paint } from './colors.js';
export function printLine(message = '') {
  process.stdout.write(`${message}\n`);
}

export function printError(error) {
  process.stderr.write(`${paint.error('Error:')} ${error instanceof Error ? error.message : String(error)}\n`);
}

export function showHelp(registry) {
  printLine(paint.brand('◆ Blind CLI'));
  printLine('Usage: npm run cli [-- <section> <command> [args...]]');
  printLine('       npm run cli -- help');
  printLine('');
  for (const section of registry.sections()) {
    printLine(`${paint.accent(section.title)} — ${paint.muted(section.description)}`);
    for (const command of section.commands) {
      printLine(`  ${command.path.padEnd(24)} ${command.description}`);
    }
  }
  printLine('');
  printLine('Without arguments, the interactive menu is opened.');
}
