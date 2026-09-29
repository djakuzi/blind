import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const audioDir = resolve(root, 'src/assets/audio');
const outputDirectory = resolve(root, 'src/core/media');
const outputPath = resolve(outputDirectory, 'audio.ts');
const supportedExtensions = new Set(['.mp3', '.wav']);

const audioFiles = collectAudioFiles(audioDir)
  .sort((left, right) => left.localeCompare(right))
  .map((filePath, index) => {
    const relativePath = relative(audioDir, filePath).split(sep).join('/');
    const audioId = buildAudioId(relativePath);
    const type = relativePath.split('/')[0];

    if (type !== 'sfx' && type !== 'music') {
      throw new Error(`Audio file must be inside "sfx" or "music": ${relativePath}`);
    }

    return {
      relativePath,
      audioId,
      type,
      importName: `AudioAsset${index + 1}`,
    };
  });

validateAudioIds(audioFiles);

const importsBlock = audioFiles
  .map(({ importName, relativePath }) => `import ${importName} from '@/assets/audio/${relativePath}'`)
  .join('\n');

const entriesBlock = audioFiles
  .map(
    ({ audioId, importName, type }) => `  '${audioId}': {
    src: ${importName},
    type: '${type}',
  },`,
  )
  .join('\n');

const content = `${importsBlock}${importsBlock ? '\n\n' : ''}export const AUDIO_ASSETS = {
${entriesBlock}
} as const

export type tAudioId = keyof typeof AUDIO_ASSETS
export type tAudioType = 'sfx' | 'music'
`;

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(outputPath, content);

console.log(`audio generated: ${audioFiles.length}`);

function collectAudioFiles(directoryPath) {
  if (!existsSync(directoryPath)) {
    return [];
  }

  return readdirSync(directoryPath).flatMap((entryName) => {
    const entryPath = resolve(directoryPath, entryName);
    const entryStat = statSync(entryPath);

    if (entryStat.isDirectory()) {
      return collectAudioFiles(entryPath);
    }

    return supportedExtensions.has(extname(entryPath).toLowerCase()) ? [entryPath] : [];
  });
}

function buildAudioId(relativePath) {
  const extension = extname(relativePath);
  return relativePath.slice(0, -extension.length).split('/').join('.');
}

function validateAudioIds(audioFiles) {
  const ids = new Set();

  for (const { audioId, relativePath } of audioFiles) {
    if (ids.has(audioId)) {
      throw new Error(`Duplicate audio id "${audioId}" generated from "${relativePath}"`);
    }

    ids.add(audioId);
  }
}
