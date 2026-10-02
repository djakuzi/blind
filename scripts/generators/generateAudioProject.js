import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const audioDir = resolve(root, 'src/assets/audio');
const outputDirectory = resolve(root, 'src/core/media/audio');
const outputConstPath = resolve(outputDirectory, 'const.ts');
const outputTypePath = resolve(outputDirectory, 'type.ts');
const supportedExtensions = new Set(['.mp3', '.wav']);
const audioChannelsByType = {
  sfx: 4,
  music: 1,
};

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
      channels: audioChannelsByType[type],
      importName: `AudioAsset${index + 1}`,
    };
  });

validateAudioIds(audioFiles);

const audioGroups = buildAudioGroups(audioFiles);

const importsBlock = audioFiles
  .map(({ importName, relativePath }) => `import ${importName} from '@/assets/audio/${relativePath}?no-inline'`)
  .join('\n');

const entriesBlock = audioFiles
  .map(
    ({ audioId, importName, type, channels }) => `  '${audioId}': {
    id: '${audioId}',
    src: ${importName},
    type: '${type}',
    channels: ${channels},
  },`,
  )
  .join('\n');

const groupsBlock = audioGroups
  .map(
    ({ groupId, audioIds }) => `  '${groupId}': [
${audioIds.map((audioId) => `    '${audioId}',`).join('\n')}
  ],`,
  )
  .join('\n');

const constContent = `${importsBlock}${importsBlock ? '\n\n' : ''}export const AUDIO_ASSETS = {
${entriesBlock}
} as const

export const AUDIO_GROUPS = {
${groupsBlock}
} as const
`;

const typeContent = `import type { AUDIO_ASSETS, AUDIO_GROUPS } from './const';

export type tAudioId = keyof typeof AUDIO_ASSETS;
export type tAudioGroupId = keyof typeof AUDIO_GROUPS;
export type tAudioType = 'sfx' | 'music';
`;

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(outputConstPath, constContent);
writeFileSync(outputTypePath, typeContent);

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

function buildAudioGroups(audioFiles) {
  const groups = new Map();

  for (const { relativePath, audioId } of audioFiles) {
    const directoryParts = relativePath.split('/').slice(0, -1);

    for (let depth = 1; depth <= directoryParts.length; depth += 1) {
      const groupId = directoryParts.slice(0, depth).join('.');
      const audioIds = groups.get(groupId) ?? [];

      audioIds.push(audioId);
      groups.set(groupId, audioIds);
    }
  }

  return [...groups.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([groupId, audioIds]) => ({
      groupId,
      audioIds,
    }));
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
