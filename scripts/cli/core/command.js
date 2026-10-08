import { paint } from './colors.js';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { printLine, showHelp } from './terminal.js';
import { choose } from './prompt.js';
import { enterMenuScreen, leaveMenuScreen } from './screen.js';

async function runCommand(command, context, args) {
  if (context.signal.aborted) return 130;
  const result = await command.run(context, args);
  return Number.isInteger(result) ? result : 0;
}

async function runInteractive(registry, context) {
  const sections = registry.sections();
  let sectionIndex = 0;
  enterMenuScreen();
  try {
  while (!context.signal.aborted) {
    const menu = [
      ...sections.map((section) => ({ label: section.title, description: section.description, section })),
      { label: 'Exit', exit: true },
    ];
    const sectionChoice = await choose(menu, context.signal, { title: 'Sections', initialIndex: sectionIndex });
    if (!sectionChoice || sectionChoice.exit) return context.signal.aborted ? 130 : 0;
    sectionIndex = sections.findIndex((item) => item.id === sectionChoice.section.id);
    const section = sectionChoice.section;
    let commandIndex = 0;
    while (!context.signal.aborted) {
      const commands = [
        ...section.commands.map((command) => ({ label: command.id, description: command.description, command })),
        { label: 'Back', back: true },
      ];
      const selected = await choose(commands, context.signal, {
        title: section.title,
        initialIndex: commandIndex,
      });
      if (!selected || selected.back) break;
      commandIndex = section.commands.findIndex((command) => command.path === selected.command.path);
      leaveMenuScreen();
      try {
        const code = await runCommand(selected.command, context, []);
        printLine(`\n${paint.accent(selected.command.path)}: ${code === 0 ? paint.success('Completed') : paint.error(`Exited with code ${code}`)}`);
      } catch (error) {
        printLine(`\n${paint.error('Command failed:')} ${error instanceof Error ? error.message : String(error)}`);
      }
      if (context.signal.aborted) return 130;
      const readline = createInterface({ input: stdin, output: stdout });
      try {
        await readline.question('Press Enter to return to the menu... ', { signal: context.signal });
      } catch (error) {
        if (context.signal.aborted || error?.name === 'AbortError') return 130;
        throw error;
      } finally {
        readline.close();
        enterMenuScreen();
      }
    }
  }
  return 130;
  } finally {
    leaveMenuScreen();
  }
}

export async function runCli(registry, context, args) {
  if (args.length) {
    if (args.length === 1 && (args[0] === 'help' || args[0] === '--help' || args[0] === '-h')) {
      showHelp(registry);
      return 0;
    }
    const command = registry.find(args.slice(0, 2));
    if (!command) throw new Error(`Unknown command: ${args.join(' ')}. See: npm run cli -- help`);
    return runCommand(command, context, args.slice(2));
  }
  return runInteractive(registry, context);
}
