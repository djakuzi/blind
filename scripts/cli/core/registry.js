const TOKEN_PATTERN = /^[a-z][a-z0-9-]*$/;

export function createRegistry() {
  const sections = new Map();
  const paths = new Map();

  return {
    addSection({ id, title, description = '' }) {
      if (!TOKEN_PATTERN.test(id) || sections.has(id)) {
        throw new Error(`Invalid or duplicate section: ${id}`);
      }
      sections.set(id, { id, title, description, commands: [] });
    },
    addCommand({ section, id, description, run }) {
      if (!sections.has(section) || !TOKEN_PATTERN.test(id) || typeof run !== 'function') {
        throw new Error(`Invalid command: ${section} ${id}`);
      }
      const path = `${section} ${id}`;
      if (paths.has(path)) {
        throw new Error(`Duplicate command: ${path}`);
      }
      const command = { section, id, description, path, run };
      paths.set(path, command);
      sections.get(section).commands.push(command);
    },
    sections() {
      return [...sections.values()].map(({ commands, ...section }) => ({ ...section, commands: [...commands] }));
    },
    find(parts) {
      return paths.get(parts.join(' '));
    },
  };
}
