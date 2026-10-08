import { emitKeypressEvents } from 'node:readline';
import { stdin, stdout } from 'node:process';

function display(title, items, index, hint) {
  stdout.write('\x1b[2J\x1b[H');
  stdout.write(`Blind CLI  /  ${title}\n\n`);
  const rows = Math.max(4, (stdout.rows || 24) - 8);
  const start = Math.max(0, Math.min(index - Math.floor(rows / 2), items.length - rows));
  const end = Math.min(items.length, start + rows);
  if (start > 0) stdout.write('  ↑ more\n');
  for (let i = start; i < end; i += 1) {
    const selected = i === index;
    stdout.write(`${selected ? '\x1b[7m❯ ' : '  '}${items[i].label}${selected ? '\x1b[0m' : ''}\n`);
  }
  if (end < items.length) stdout.write('  ↓ more\n');
  if (items[index]?.description) stdout.write(`\n${items[index].description}\n`);
  stdout.write(`\n${hint}\n`);
}

export async function choose(items, signal, { title = 'Choose', initialIndex = 0 } = {}) {
  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error('Interactive mode requires a terminal. Use -- help.');
  }
  if (!items.length || signal?.aborted) return null;
  emitKeypressEvents(stdin);
  const initialRaw = stdin.isRaw;
  let index = Math.max(0, Math.min(initialIndex, items.length - 1));
  let onKeypress;
  let onAbort;
  const selected = new Promise((resolve) => {
    onKeypress = (character, key = {}) => {
      if (key.ctrl && key.name === 'c') {
        resolve(null);
      } else if (key.name === 'escape' || key.name === 'backspace' || key.name === 'left') {
        resolve(null);
      } else if (key.name === 'up' || key.name === 'k') {
        index = (index + items.length - 1) % items.length;
        display(title, items, index, '↑/↓ Navigate   Enter Select   Esc Back');
      } else if (key.name === 'down' || key.name === 'j') {
        index = (index + 1) % items.length;
        display(title, items, index, '↑/↓ Navigate   Enter Select   Esc Back');
      } else if (key.name === 'return' || key.name === 'enter') {
        resolve(items[index]);
      }
    };
    onAbort = () => resolve(null);
    stdin.on('keypress', onKeypress);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
  try {
    stdin.setRawMode(true);
    stdin.resume();
    display(title, items, index, '↑/↓ Navigate   Enter Select   Esc Back');
    return await selected;
  } finally {
    stdin.removeListener('keypress', onKeypress);
    signal?.removeEventListener('abort', onAbort);
    stdin.setRawMode(initialRaw);
    stdin.pause();
    stdout.write('\x1b[2J\x1b[H');
  }
}
