# Audio licensing

Audio assets can have licensing and usage terms that differ from the source code of the project.

This directory keeps two kinds of records separate:

- `licenses/sources/` — terms and usage notes for external providers or asset sources;
- `licenses/assets/` — provenance and modifications for concrete audio assets.

## Asset manifests

- [Sound effects](./licenses/assets/sfx.md)

## Sources

- [Adobe Firefly](./licenses/sources/adobe-firefly.md)

## Rules

When adding a new audio asset:

1. Record the asset in the appropriate file under `licenses/assets/`.
2. Record a new source under `licenses/sources/` only when that source is not documented yet.
3. Keep the source URL, author/provider, license or usage terms, attribution requirement, and acquisition/generation date.
4. Record material edits such as trimming, conversion, normalization, mixing, or other processing.
5. Do not add assets with unknown or incompatible usage rights.
