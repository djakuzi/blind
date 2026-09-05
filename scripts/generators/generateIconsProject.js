import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const iconsDir = resolve(root, 'src/assets/icons')
const outputDirectory = resolve(root, 'src/core/media')
const outputPath = resolve(outputDirectory, 'assets.ts')
const excludedDirectories = []

const iconFiles = collectSvgFiles(iconsDir)
  .sort((left, right) => left.localeCompare(right))
  .map((filePath) => {
    const relativePath = relative(iconsDir, filePath).split(sep).join('/')
    const { groupName, iconName } = buildIconMeta(relativePath)
    const importName = buildImportName(iconName)

    return {
      filePath,
      relativePath,
      groupName,
      iconName,
      importName,
    }
  })

const importsBlock = iconFiles
  .map(
    ({ importName, relativePath }) =>
      `import ${importName} from '@/assets/icons/${relativePath}?raw'`,
  )
  .join('\n')

const groupedIcons = Object.groupBy(iconFiles, ({ groupName }) => groupName)

const iconsBlock = Object.entries(groupedIcons)
  .map(([groupName, icons]) => {
    const entries = icons
      .map(({ iconName, importName }) => `    ${iconName}: ${importName},`)
      .join('\n')

    return `  ${groupName}: {
${entries}
  },`
  })
  .join('\n')

const typesBlock = [
  'export type tIconGroup = keyof typeof ICONS_ASSETS',
  'export type tIconAssets = Record<string, string>',
  '',
  'type tResolveIconName<TName extends string> =',
  '  TName extends `${infer TIconName}Dark`',
  '    ? TIconName',
  '    : TName extends `${infer TIconName}Light`',
  '      ? TIconName',
  '      : TName',
  '',
  'export type tIconName<TGroup extends tIconGroup> =',
  '  TGroup extends tIconGroup',
  '    ? tResolveIconName<Extract<keyof (typeof ICONS_ASSETS)[TGroup], string>>',
  '    : never',
].join('\n');

const content = `${importsBlock}

export const ICONS_ASSETS = {
${iconsBlock}
} as const

${typesBlock}
`;

mkdirSync(outputDirectory, { recursive: true })
writeFileSync(outputPath, content)

console.log(`icons generated: ${iconFiles.length}`)

function collectSvgFiles(directoryPath) {
  return readdirSync(directoryPath).flatMap((entryName) => {
    const entryPath = resolve(directoryPath, entryName)
    const entryStat = statSync(entryPath)

    if (entryStat.isDirectory()) {
      if (excludedDirectories.includes(relative(iconsDir, entryPath).split(sep)[0])) {
        return []
      }

      return collectSvgFiles(entryPath)
    }

    return extname(entryPath) === '.svg' ? [entryPath] : []
  })
}

function buildIconMeta(relativePath) {
  const segments = relativePath.replace(/\.svg$/, '').split('/')

  const groupName = toCamelCase(segments[0])
  const fileName = segments.at(-1)

  return {
    groupName,
    iconName: toCamelCase(fileName),
  }
}

function buildImportName(iconName) {
  return iconName[0].toUpperCase() + iconName.slice(1)
}

function toCamelCase(value) {
  const segments = value.split(/[^a-zA-Z0-9]+/).filter(Boolean)

  return segments
    .map((segment, index) => {
      const normalized = segment.toLowerCase()

      if (index === 0) {
        return normalized
      }

      return normalized[0].toUpperCase() + normalized.slice(1)
    })
    .join('')
}