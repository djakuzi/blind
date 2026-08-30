import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_MARKER = 'node-version'
const DOCS_DIR = path.resolve('docs')
const PACKAGE_JSON_PATH = path.resolve('package.json')

function parseArgs(argv) {
  let marker = DEFAULT_MARKER

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]

    if ((argument === '-m' || argument === '--marker') && argv[index + 1]) {
      marker = argv[index + 1]
      index += 1
    }
  }

  return { marker }
}

async function collectMarkdownFiles(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry.name)

      if (entry.isDirectory()) {
        return collectMarkdownFiles(entryPath)
      }

      return entry.isFile() && entry.name.endsWith('.md') ? [entryPath] : []
    }),
  )

  return files.flat()
}

function createMarkerRegExp(marker) {
  return new RegExp(
    `<span\\s+hidden\\s+data-doc-marker="${marker}:start"><\\/span>([\\s\\S]*?)<span\\s+hidden\\s+data-doc-marker="${marker}:end"><\\/span>`,
    'g',
  )
}

async function readNodeVersion() {
  const packageJsonRaw = await readFile(PACKAGE_JSON_PATH, 'utf8')
  const packageJson = JSON.parse(packageJsonRaw)
  const nodeVersion = packageJson?.engines?.node

  if (!nodeVersion) {
    throw new Error('В package.json отсутствует поле engines.node')
  }

  return nodeVersion
}

async function syncNodeVersionDocs() {
  const { marker } = parseArgs(process.argv.slice(2))
  const nodeVersion = await readNodeVersion()
  const files = await collectMarkdownFiles(DOCS_DIR)
  const markerRegExp = createMarkerRegExp(marker)

  let updatedFilesCount = 0
  let updatedMarkersCount = 0

  for (const filePath of files) {
    const source = await readFile(filePath, 'utf8')
    const matches = [...source.matchAll(markerRegExp)]

    if (matches.length === 0) {
      continue
    }

    const nextSource = source.replace(
      markerRegExp,
      `<span hidden data-doc-marker="${marker}:start"></span>\`${nodeVersion}\`<span hidden data-doc-marker="${marker}:end"></span>`,
    )

    if (nextSource !== source) {
      await writeFile(filePath, nextSource, 'utf8')
      updatedFilesCount += 1
    }

    updatedMarkersCount += matches.length
  }

  if (updatedMarkersCount === 0) {
    throw new Error(`Маркеры "${marker}" не найдены в docs`)
  }

  console.log(`Node.js version: ${nodeVersion}`)
  console.log(`Marker: ${marker}`)
  console.log(`Updated markers: ${updatedMarkersCount}`)
  console.log(`Updated files: ${updatedFilesCount}`)
}

syncNodeVersionDocs().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
