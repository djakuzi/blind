# Blind CLI

Interactive: `npm run cli`. Direct command: `npm run cli -- <section> <command> [args]`.

## Build / Package

- `npm run cli -- build web debug`
- `npm run cli -- build web prod`
- `npm run cli -- build desktop`
- `npm run cli -- build mobile android [debug|prod]`
- `npm run cli -- build mobile ios [debug|prod]`
- `npm run cli -- package desktop [current|mac|win|linux]`

All builds invoke the pre-existing npm scripts. Mobile preparation builds Web assets and runs `cap sync`; opening IDE and launching devices remain in the Platforms section. Desktop packaging is limited to the current host OS; use GitHub Actions for other targets.

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

## Generators

- `npm run cli -- generate styles`
- `npm run cli -- generate icons`
- `npm run cli -- generate audio`
- `npm run cli -- generate fonts`
- `npm run cli -- generate docs`
- `npm run cli -- generate all`
- `npm run cli -- generate check`

`generate check` runs the generators in a temporary project copy and compares their outputs with current generated files. It needs local `node_modules` and does not alter the working source tree.
