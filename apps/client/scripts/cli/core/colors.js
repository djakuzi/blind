const enabled = process.stdout.isTTY && !('NO_COLOR' in process.env) && process.env.TERM !== 'dumb';
const ansi = (code, value) => (enabled ? `\x1b[${code}m${value}\x1b[0m` : value);
export const paint = {
  brand: (text) => ansi('1;36', text),
  accent: (text) => ansi('1;96', text),
  muted: (text) => ansi('2', text),
  success: (text) => ansi('1;32', text),
  error: (text) => ansi('1;31', text),
  selected: (text) => ansi('1;30;46', text),
};
