import { readFile, access } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { printLine } from '../core/terminal.js';

const PLURAL_FORMS = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);
const LANGUAGE_CODE = /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i;

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

async function json(root, relativePath, errors) {
  try {
    return JSON.parse(await readFile(join(root, relativePath), 'utf8'));
  } catch (error) {
    errors.push(`${relativePath}: ${error.message}`);
    return null;
  }
}

function compare(reference, target, path, errors, base, code) {
  if (typeof reference === 'string') {
    if (typeof target !== 'string' || !target.trim()) {
      errors.push(`${code}: invalid or missing string at ${path}`);
      return;
    }
    const placeholders = (value) =>
      [...value.matchAll(/\{([a-zA-Z][\w]*)\}/g)]
        .map((match) => match[1])
        .sort()
        .join(',');
    if (placeholders(reference) !== placeholders(target)) {
      errors.push(`${code}: placeholder mismatch at ${path}`);
    }
    return;
  }
  if (!isRecord(reference) || !isRecord(target)) {
    errors.push(`${code}: invalid structure at ${path}`);
    return;
  }

  const plural = path.endsWith('game.format.players') || path.endsWith('game.format.rounds');
  for (const key of Object.keys(reference)) {
    if (plural && PLURAL_FORMS.has(key) && key !== 'other') continue;
    if (!(key in target)) errors.push(`${code}: missing ${path}.${key}`);
    else compare(reference[key], target[key], `${path}.${key}`, errors, base, code);
  }
  for (const key of Object.keys(target)) {
    if (plural && PLURAL_FORMS.has(key)) {
      if (typeof target[key] !== 'string' || !target[key].includes('{count}')) {
        errors.push(`${code}: invalid plural form at ${path}.${key}`);
      }
    } else if (!(key in reference)) {
      errors.push(`${code}: extra ${path}.${key}`);
    }
  }
}

async function validate(root, showLanguages = false) {
  const errors = [];
  const metadata = await json(root, 'public/lang/languages.json', errors);
  if (!Array.isArray(metadata) || !metadata.length) {
    errors.push('languages.json: expected a non-empty array');
  }
  const languages = Array.isArray(metadata) ? metadata : [];
  const seen = new Set();
  let defaults = 0;
  for (const entry of languages) {
    if (!isRecord(entry)) {
      errors.push('languages.json: invalid language entry');
      continue;
    }
    const { key, name, img, version, isDefault } = entry;
    if (typeof key !== 'string' || !LANGUAGE_CODE.test(key) || seen.has(key.toLowerCase())) {
      errors.push(`languages.json: invalid or duplicate language code: ${String(key)}`);
      continue;
    }
    seen.add(key.toLowerCase());
    if (typeof name !== 'string' || !name.trim()) errors.push(`${key}: missing display name`);
    if ((typeof version !== 'string' && typeof version !== 'number') || !String(version).trim()) errors.push(`${key}: missing version`);
    if (typeof isDefault !== 'boolean') errors.push(`${key}: isDefault must be boolean`);
    if (isDefault === true) defaults++;
    if (typeof img !== 'string' || !img.startsWith('/lang/images/') || !img.endsWith('.svg')) {
      errors.push(`${key}: invalid image path`);
    } else {
      const image = resolve(root, 'public', img.slice(1));
      const imagesRoot = resolve(root, 'public/lang/images') + sep;
      if (!image.startsWith(imagesRoot)) errors.push(`${key}: image path outside lang/images`);
      else {
        try {
          await access(image);
        } catch {
          errors.push(`${key}: missing image ${img}`);
        }
      }
    }
    if (showLanguages) printLine(`${key} — ${name} (v${version})${isDefault ? ' [default]' : ''}`);
  }
  if (defaults !== 1) errors.push(`languages.json: expected exactly one default language (found ${defaults})`);

  const loaded = new Map();
  for (const key of seen) {
    const locale = await json(root, `public/lang/${key}.json`, errors);
    if (locale !== null) loaded.set(key, locale);
  }
  const defaultEntry = languages.find((entry) => entry?.isDefault === true);
  const baseline = loaded.get(defaultEntry?.key?.toLowerCase()) ?? loaded.values().next().value;
  if (baseline) {
    if (!isRecord(baseline)) errors.push('Default locale must be a JSON object');
    else
      for (const [code, locale] of loaded) {
        compare(baseline, locale, 'locale', errors, baseline, code);
      }
  }

  if (errors.length) {
    errors.forEach((item) => printLine(`[FAIL] ${item}`));
    printLine(`Localization: ${errors.length} issue(s)`);
    return 1;
  }
  printLine(`Localization: valid (${seen.size} languages)`);
  return 0;
}

export function registerLocalizationSection(registry) {
  registry.addSection({ id: 'locale', title: 'Localization', description: 'Validate bundled language resources' });
  registry.addCommand({
    section: 'locale',
    id: 'check',
    description: 'Validate locale files and metadata',
    run(context, args) {
      if (args.length) throw new Error('Usage: locale check');
      return validate(context.root);
    },
  });
  registry.addCommand({
    section: 'locale',
    id: 'languages',
    description: 'List registered languages and validate resources',
    run(context, args) {
      if (args.length) throw new Error('Usage: locale languages');
      return validate(context.root, true);
    },
  });
}
