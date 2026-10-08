import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

export async function choose(items, signal) {
  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error('Interactive mode requires a terminal. Use -- help.');
  }
  const readline = createInterface({ input: stdin, output: stdout, terminal: true });
  try {
    while (!signal.aborted) {
      const answer = (await readline.question('Choose an option: ', { signal })).trim();
      const choice = Number(answer);
      if (answer !== '' && Number.isInteger(choice) && choice >= 0 && choice < items.length) {
        return items[choice];
      }
      stdout.write('Invalid option. Try again.\n');
    }
    return null;
  } catch (error) {
    if (signal.aborted || error?.name === 'AbortError') return null;
    throw error;
  } finally {
    readline.close();
  }
}
