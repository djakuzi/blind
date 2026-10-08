# Blind CLI

Run interactive menu: `npm run cli`.

Direct commands: `npm run cli -- <section> <command> [args]`.

## Project diagnostics

- `npm run cli -- project info`
- `npm run cli -- project status`
- `npm run cli -- project versions`
- `npm run cli -- project env`
- `npm run cli -- project doctor` (Web baseline)
- `npm run cli -- project doctor android`
- `npm run cli -- project doctor ios`
- `npm run cli -- project doctor desktop`
- `npm run cli -- help`

Doctor uses the Node version from `package.json`, checks local environment files against `.env.template`, and checks platform tools. No secrets are printed or modified. Missing requirements result in exit code 1. Platform-specific tools are checked only when the relevant platform is requested.

CLI uses Node.js ESM and no additional dependencies. Other sections will be implemented in later stages.
