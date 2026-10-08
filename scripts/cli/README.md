# Blind CLI

Interactive: `npm run cli`. Direct command: `npm run cli -- <section> <command> [args]`.

## Development

- `npm run cli -- dev web` (debug)
- `npm run cli -- dev web --mode prod`
- `npm run cli -- dev desktop`

## Mobile platforms

- `npm run cli -- platform sync android --build`
- `npm run cli -- platform sync ios --build --mode debug`
- `npm run cli -- platform open android`
- `npm run cli -- platform open ios`
- `npm run cli -- platform run android --build`
- `npm run cli -- platform run ios --build`

The `--build` flag builds Web assets using existing npm scripts and synchronizes them via Capacitor before the requested action. Without it, `sync` explicitly synchronizes existing assets; `run` uses the current native project without rebuilding or syncing. iOS commands require macOS. Capacitor is invoked with `npx --no-install` to avoid implicit dependency installation.

## Project diagnostics

- `npm run cli -- project info`
- `npm run cli -- project status`
- `npm run cli -- project versions`
- `npm run cli -- project env`
- `npm run cli -- project doctor [web|desktop|android|ios]`

Run `npm run cli -- help` to list all commands.
