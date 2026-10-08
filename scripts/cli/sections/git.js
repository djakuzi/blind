import { spawnSync } from 'node:child_process';
import { printLine } from '../core/terminal.js';
import { choose } from '../core/prompt.js';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const TYPES = ['feature', 'bugfix', 'hotfix'];
const NAME = /^(feature|bugfix|hotfix)\/(?:[0-9]+-)?[a-z0-9]+(?:-[a-z0-9]+){0,2}$/;

function git(context, args) {
  const result = spawnSync('git', args, { cwd: context.root, encoding: 'utf8', timeout: 30000, windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || 'Git failed').trim());
  return result.stdout.trim();
}

function current(context) {
  return git(context, ['branch', '--show-current']);
}

function clean(context) {
  return git(context, ['status', '--porcelain']) === '';
}

function assertArgs(args, count, usage) {
  if (args.length !== count) throw new Error(`Usage: ${usage}`);
}

function validateName(name) {
  return name === 'main' || name === 'development' || NAME.test(name);
}

async function create(context, args) {
  let [type, suffix] = args;
  if (args.length === 0) {
    const options = [{ label: 'Back', value: null }, ...TYPES.map((value) => ({ label: value, value }))];
    printLine('Choose branch type:');
    options.forEach((option, index) => printLine(`${index}. ${option.label}`));
    type = (await choose(options, context.signal))?.value;
    if (!type) return 0;
    const readline = createInterface({ input: stdin, output: stdout });
    try {
      suffix = (await readline.question('Task number and description (e.g. 123-new-menu): ', { signal: context.signal })).trim();
    } finally {
      readline.close();
    }
  }
  if (args.length !== 0) assertArgs(args, 2, 'git create <feature|bugfix|hotfix> <task-description>');
  if (!TYPES.includes(type)) throw new Error('Invalid branch type.');
  const name = `${type}/${suffix}`;
  if (!NAME.test(name)) throw new Error('Invalid branch name. Use lower-case words separated by hyphens (up to three words), optionally prefixed by task number.');
  if (!clean(context)) throw new Error('Working tree must be clean.');
  const base = type === 'hotfix' ? 'main' : 'development';
  if (current(context) !== base) throw new Error(`Checkout ${base} before creating a ${type} branch.`);
  git(context, ['fetch', 'origin', base]);
  const local = git(context, ['rev-parse', base]);
  const remote = git(context, ['rev-parse', `origin/${base}`]);
  if (local !== remote) throw new Error(`${base} differs from origin/${base}. Update the base branch first.`);
  git(context, ['switch', '-c', name]);
  printLine(`Created ${name} from ${base}`);
  return 0;
}

function updateDevelopment(context, args) {
  assertArgs(args, 0, 'git update');
  if (current(context) !== 'development') throw new Error('Switch to development before updating.');
  if (!clean(context)) throw new Error('Working tree must be clean.');
  printLine('Fetching origin...');
  git(context, ['fetch', 'origin']);
  printLine('Fast-forwarding development...');
  git(context, ['merge', '--ff-only', 'origin/development']);
  printLine('Development is up to date.');
  return 0;
}

export function registerGitSection(registry) {
  registry.addSection({ id: 'git', title: 'Git', description: 'Safe repository operations' });
  registry.addCommand({
    section: 'git', id: 'status', description: 'Display current branch and working tree status',
    run(context, args) {
      assertArgs(args, 0, 'git status');
      printLine(`Branch: ${current(context) || '(detached)'}`);
      printLine(git(context, ['status', '--short']) || 'Working tree clean');
      return 0;
    },
  });
  registry.addCommand({
    section: 'git', id: 'check', description: 'Validate current branch naming',
    run(context, args) {
      assertArgs(args, 0, 'git check');
      const name = current(context);
      const valid = validateName(name);
      printLine(`${valid ? '[OK]' : '[FAIL]'} Branch: ${name || '(detached)'}`);
      return valid ? 0 : 1;
    },
  });
  registry.addCommand({ section: 'git', id: 'create', description: 'Create branch: <type> <name>', run: create });
  registry.addCommand({ section: 'git', id: 'update', description: 'Fast-forward local development from origin', run: updateDevelopment });
}
