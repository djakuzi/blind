import { printLine, showHelp } from './terminal.js';
import { choose } from './prompt.js';

function printMenu(sections) {
  printLine('\nBlind CLI');
  printLine('---------');
  const choices = [{ label: 'Exit', kind: 'exit' }];
  for (const section of sections) {
    for (const command of section.commands) {
      choices.push({ label: `${section.title} / ${command.id}`, kind: 'command', command });
    }
  }
  choices.forEach((item, index) => printLine(`${index}. ${item.label}`));
  return choices;
}

async function runCommand(command, context, args) {
  if (context.signal.aborted) return 130;
  const result = await command.run(context, args);
  return Number.isInteger(result) ? result : 0;
}

export async function runCli(registry, context, args) {
  if (args.length) {
    if (args.length === 1 && (args[0] === 'help' || args[0] === '--help' || args[0] === '-h')) {
      showHelp(registry);
      return 0;
    }
    const command = registry.find(args.slice(0, 2));
    if (!command) {
      throw new Error(`Unknown command: ${args.join(' ')}. See: npm run cli -- help`);
    }
    return runCommand(command, context, args.slice(2));
  }

  while (!context.signal.aborted) {
    const choices = printMenu(registry.sections());
    const selected = await choose(choices, context.signal);
    if (!selected || selected.kind === 'exit') return context.signal.aborted ? 130 : 0;
    try {
      const code = await runCommand(selected.command, context, []);
      if (code !== 0) printLine(`Command exited with code ${code}.`);
    } catch (error) {
      printLine(`Command failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return 130;
}
