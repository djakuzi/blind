import { stdout } from 'node:process';

let active = false;

export function enterMenuScreen() {
  if (!stdout.isTTY || active) return;
  stdout.write('\x1b[?1049h\x1b[H\x1b[J');
  active = true;
}

export function clearMenuScreen() {
  if (!active) return;
  stdout.write('\x1b[H\x1b[J');
}

export function leaveMenuScreen() {
  if (!active) return;
  stdout.write('\x1b[?1049l');
  active = false;
}
