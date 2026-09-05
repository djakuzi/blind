import { access, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createFont, woff2 } from 'fonteditor-core';

const ROOT_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const FONTS_PATH = resolve(ROOT_PATH, 'src/assets/fonts');

async function collectTtfFiles(directoryPath) {
  const entries = await readdir(directoryPath, {
    withFileTypes: true,
  });

  const sortedEntries = entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  );

  const files = [];

  for (const entry of sortedEntries) {
    const entryPath = resolve(directoryPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectTtfFiles(entryPath));
      continue;
    }

    if (entry.isFile() && extname(entry.name).toLowerCase() === '.ttf') {
      files.push(entryPath);
    }
  }

  return files;
}

async function convertFont(inputPath) {
  const outputPath = inputPath.replace(/\.ttf$/i, '.woff2');

  try {
    const ttfBuffer = await readFile(inputPath);

    const font = createFont(ttfBuffer, {
      type: 'ttf',
      hinting: true,
      kerning: true,
      compound2simple: false,
    });

    const woff2Buffer = font.write({
      type: 'woff2',
      hinting: true,
      kerning: true,
    });

    await writeFile(outputPath, Buffer.from(woff2Buffer));
  } catch (error) {
    const inputRelativePath = relative(ROOT_PATH, inputPath);
    const message = error instanceof Error ? error.message : String(error);

    throw new Error(
      `Failed to convert font "${inputRelativePath}": ${message}`,
    );
  }

  return outputPath;
}

async function generateFontsWoff2() {
  try {
    await access(FONTS_PATH);
  } catch {
    throw new Error(
      `Fonts directory not found: ${relative(ROOT_PATH, FONTS_PATH)}`,
    );
  }

  const fontFiles = await collectTtfFiles(FONTS_PATH);

  if (fontFiles.length === 0) {
    console.log(
      `No TTF fonts found in ${relative(ROOT_PATH, FONTS_PATH)}`,
    );

    return;
  }

  await woff2.init();

  for (const inputPath of fontFiles) {
    const outputPath = await convertFont(inputPath);

    console.log(`Updated ${relative(ROOT_PATH, outputPath)}`);
  }

  console.log(`WOFF2 fonts generated successfully: ${fontFiles.length}`);
}

generateFontsWoff2().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});