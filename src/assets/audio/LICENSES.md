# Audio licensing

Audio assets can have licensing and usage terms that differ from the source code of the project.

## Structure

- `*.license.md` — provenance and usage information for the audio file beside it;
- `licenses/sources/` — shared terms and notes for providers or asset sources.

Example:

```text
sfx/interaction/
├── hold-complete.wav
└── hold-complete.license.md
```

## Sources

- [Adobe Firefly](./licenses/sources/adobe-firefly.md)

## Rules

When adding an audio asset from an external source or generator:

1. Keep its `*.license.md` beside the audio file.
2. Record the source/provider, source terms, acquisition or generation date, and attribution requirement.
3. Add a file under `licenses/sources/` only when that source is not documented yet.
4. Do not add assets with unknown or incompatible usage rights.
