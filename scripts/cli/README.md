# Blind CLI

Entry point: `npm run cli` (interactive) or `npm run cli -- <section> <command>`.

Stage 1 provides the command registry, interactive menu, process runner, error handling and `project info` smoke command.

Available:

- `npm run cli -- help`
- `npm run cli -- project info`

Other project sections are implemented in subsequent stages. The CLI runs with Node.js and adds no third-party dependencies.
