import { paint } from './colors.js';
import { emitKeypressEvents } from 'node:readline';
import { stdin, stdout } from 'node:process';

function display(title, items, index, hint) {
  stdout.write('\x1b[H\x1b[J');
  stdout.write(`${paint.brand('◆ BLIND CLI')} ${paint.muted(' / ')} ${paint.accent(title)}\n${paint.muted('─'.repeat(38))}\n\n`);
  const rows = Math.max(4, (stdout.rows || 24) - 8);
  const start = Math.max(0, Math.min(index - Math.floor(rows / 2), items.length - rows));
  const end = Math.min(items.length, start + rows);
  if (start > 0) stdout.write(`${paint.muted('  ↑ more')}\n`);
  for (let i = start; i < end; i += 1) {
    const selected = i === index;
    stdout.write(`${selected ? paint.selected(` ❯ ${items[i].label} `) : `   ${items[i].label}`}\n`);
  }
  if (end < items.length) stdout.write(`${paint.muted('  ↓ more')}\n`);
  if (items[index]?.description) stdout.write(`\n${paint.muted(items[index].description)}\n`);
  stdout.write(`\n${paint.muted(hint)}\n`);
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
  }
}
