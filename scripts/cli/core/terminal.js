export function printLine(message = '') {
  process.stdout.write(`${message}\n`);
}

export function printError(error) {
  process.stderr.write(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
}

export function showHelp(registry) {
  printLine('Blind CLI');
  printLine('Usage: npm run cli [-- <section> <command> [args...]]');
  printLine('       npm run cli -- help');
  printLine('');
  for (const section of registry.sections()) {
    printLine(`${section.title} — ${section.description}`);
    for (const command of section.commands) {
      printLine(`  ${command.path.padEnd(24)} ${command.description}`);
    }
  }
  printLine('');
  printLine('Without arguments, the interactive menu is opened.');
}
