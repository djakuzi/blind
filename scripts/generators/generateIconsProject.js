import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const iconsDir = resolve(root, 'src/app/assets/icons')
const outputDirectory = resolve(root, 'src/core/media')
const outputPath = resolve(outputDirectory, 'assets.ts')
const excludedDirectories = []

const iconFiles = collectSvgFiles(iconsDir)
  .sort((left, right) => left.localeCompare(right))
  .map((filePath) => {
    const relativePath = relative(iconsDir, filePath).split(sep).join('/')
    const iconName = buildIconName(relativePath)
    const importName = buildImportName(iconName)

    return {
      filePath,
      relativePath,
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

const iconsBlock = iconFiles
  .map(({ iconName, importName }) => `  '${iconName}': ${importName},`)
  .join('\n')

const content = `${importsBlock}

export const ICONS_ASSETS = {
${iconsBlock}
} as const

export type IconAssetName = keyof typeof ICONS_ASSETS
`

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

function buildIconName(relativePath) {
  const segments = relativePath.replace(/\.svg$/, '').split('/')

  return segments
    .flatMap((segment, index) => {
      if (index === 0 || segments.length === 1) {
        return segment
      }

      const familyName = segments[index - 1]

      if (segment === familyName) {
        return []
      }

      if (segment.startsWith(`${familyName}--`)) {
        return segment.slice(familyName.length + 2)
      }

      if (segment.startsWith(`${familyName}-`)) {
        return segment.slice(familyName.length + 1)
      }

      return segment
    })
    .join('-')
}

function buildImportName(iconName) {
  return iconName
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join('')
}
