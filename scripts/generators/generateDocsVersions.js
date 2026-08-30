import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const PACKAGE_JSON_PATH = path.resolve('package.json');

const MARKERS = [
  {
    filePath: path.resolve('docs/architecture/sections/stack.md'),
    marker: 'stack-vue',
    value: (packageJson) => `Vue ${toMinorVersion(packageJson.dependencies.vue)}`,
  },
  {
    filePath: path.resolve('docs/architecture/sections/stack.md'),
    marker: 'stack-typescript',
    value: (packageJson) => `TypeScript ${toMinorVersion(packageJson.devDependencies.typescript)}`,
  },
  {
    filePath: path.resolve('docs/architecture/sections/stack.md'),
    marker: 'stack-vite',
    value: (packageJson) => `Vite ${toMinorVersion(packageJson.devDependencies.vite)}`,
  },
  {
    filePath: path.resolve('docs/architecture/sections/stack.md'),
    marker: 'stack-pinia',
    value: (packageJson) => `Pinia ${toMinorVersion(packageJson.dependencies.pinia)}`,
  },
  {
    filePath: path.resolve('docs/architecture/sections/stack.md'),
    marker: 'stack-vue-router',
    value: (packageJson) => `Vue Router ${toMajorVersion(packageJson.dependencies['vue-router'])}`,
  },
  {
    filePath: path.resolve('docs/architecture/sections/stack.md'),
    marker: 'stack-plugin-vue',
    value: (packageJson) => `@vitejs/plugin-vue ${toMajorVersion(packageJson.devDependencies['@vitejs/plugin-vue'])}`,
  },
  {
    filePath: path.resolve('docs/architecture/sections/stack.md'),
    marker: 'node-version',
    value: (packageJson) => packageJson.engines.node,
  },
  {
    filePath: path.resolve('docs/projectSetup/index.md'),
    marker: 'node-version',
    value: (packageJson) => packageJson.engines.node,
  },
  {
    filePath: path.resolve('docs/projectSetup/index.md'),
    marker: 'setup-vue',
    value: (packageJson) => `Vue ${normalizeVersion(packageJson.dependencies.vue)}`,
  },
  {
    filePath: path.resolve('docs/projectSetup/index.md'),
    marker: 'setup-vite',
    value: (packageJson) => `Vite ${normalizeVersion(packageJson.devDependencies.vite)}`,
  },
  {
    filePath: path.resolve('docs/projectSetup/index.md'),
    marker: 'setup-pinia',
    value: (packageJson) => `Pinia ${normalizeVersion(packageJson.dependencies.pinia)}`,
  },
  {
    filePath: path.resolve('docs/projectSetup/index.md'),
    marker: 'setup-vue-router',
    value: (packageJson) => `vue-router ${normalizeVersion(packageJson.dependencies['vue-router'])}`,
  },
];

function normalizeVersion(rawVersion) {
  const match = rawVersion?.match(/\d+\.\d+\.\d+/);

  if (!match) {
    throw new Error(`Не удалось распознать версию "${rawVersion}"`);
  }

  return match[0];
}

function toMinorVersion(rawVersion) {
  const [major, minor] = normalizeVersion(rawVersion).split('.');
  return `${major}.${minor}.x`;
}

function toMajorVersion(rawVersion) {
  const [major] = normalizeVersion(rawVersion).split('.');
  return `${major}.x`;
}

function createMarkerRegExp(marker) {
  return new RegExp(
    `<span\\s+hidden\\s+data-doc-marker="${marker}:start"><\\/span>([\\s\\S]*?)<span\\s+hidden\\s+data-doc-marker="${marker}:end"><\\/span>`,
    'g',
  );
}

async function readPackageJson() {
  const packageJsonRaw = await readFile(PACKAGE_JSON_PATH, 'utf8');
  return JSON.parse(packageJsonRaw);
}

async function syncDocsVersions() {
  const packageJson = await readPackageJson();
  const filePaths = [...new Set(MARKERS.map(({ filePath }) => filePath))];
  let updatedFilesCount = 0;
  let updatedMarkersCount = 0;

  for (const filePath of filePaths) {
    const source = await readFile(filePath, 'utf8');
    let nextSource = source;
    let fileMarkersCount = 0;

    for (const markerConfig of MARKERS.filter((item) => item.filePath === filePath)) {
      const markerRegExp = createMarkerRegExp(markerConfig.marker);
      const matches = [...nextSource.matchAll(markerRegExp)];

      if (matches.length === 0) {
        continue;
      }

      const value = markerConfig.value(packageJson);

      nextSource = nextSource.replace(
        markerRegExp,
        `<span hidden data-doc-marker="${markerConfig.marker}:start"></span>\`${value}\`<span hidden data-doc-marker="${markerConfig.marker}:end"></span>`,
      );

      fileMarkersCount += matches.length;
    }

    if (nextSource !== source) {
      await writeFile(filePath, nextSource, 'utf8');
      updatedFilesCount += 1;
    }

    updatedMarkersCount += fileMarkersCount;
  }

  if (updatedMarkersCount === 0) {
    throw new Error('В документации не найдены маркеры версий');
  }

  console.log(`Updated markers: ${updatedMarkersCount}`);
  console.log(`Updated files: ${updatedFilesCount}`);
}

syncDocsVersions().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
